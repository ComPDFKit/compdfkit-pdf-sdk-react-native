//
//  RCTCPDFView+Optimize.swift
//  react-native-compdfkit-pdf
//
//  Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import UIKit
import ComPDFKit
import ComPDFKit_Tools

/// Document optimization (compression) on iOS. Payload keys, defaults, and error codes match the
/// Android bridge.
///
/// The native entry point is `CPDFOptimizeOption.optimizeAndSaveAsCopy(withPath:...)`, the only
/// iOS entry point that honours every option (flags, image quality, the color / grayscale /
/// monochrome image settings, and the ICC conversion) and reports timings.
///
/// The core optimizes the opened document itself before it serializes the copy, so the document
/// in memory holds the optimized content afterwards. Every run that reached the native call
/// therefore reloads the document from its source file, exactly like Android.
///
/// The SDK posts page progress as a global notification that does not say which document it
/// belongs to, so only one run may be in flight across all readers.
private enum RCTOptimizeState {
  static let lock = NSLock()
  /// The option object of the run in flight, used by `cancelOptimize`.
  static var running: CPDFOptimizeOption?
}

private enum RCTOptimizeDefaults {
  /// Mirrors `DEFAULT_OPTIMIZE_FLAGS` on Android and in TypeScript.
  static let flags: Int32 = 175_767_799
  static let imageQuality: Float = 40

  /// `CPDF_COMP_ALG` raw values from `CPDFOptimizeOption.h`, independent of Swift case naming.
  static let jpeg2000 = CPDF_COMP_ALG(rawValue: 1)!
  static let jpeg = CPDF_COMP_ALG(rawValue: 2)!
  static let jbig2 = CPDF_COMP_ALG(rawValue: 3)!

  /// The core defaults. A new `CPDFOptimizeOption` returns zeroed image options until they are
  /// set explicitly, so its getters cannot be used for this.
  static let color = CPDFOptimizeImageOption(uperPpi: 225, targetPpi: 150, compAlg: jpeg2000, quality: 40, blockSize: 256)
  static let grayscale = color
  static let monochrome = CPDFOptimizeImageOption(uperPpi: 450, targetPpi: 300, compAlg: jbig2, quality: 40, blockSize: 256)
}

extension RCTCPDFView {

  func getOptimizeOptions() throws -> [String: Any] {
    guard pdfViewController?.pdfListView?.document != nil else {
      throw RCTCPDFBridgeError(code: "DOCUMENT_INVALID", message: "The document is released or invalid.")
    }
    return [
      "flags": Int(RCTOptimizeDefaults.flags),
      "image_quality": Double(RCTOptimizeDefaults.imageQuality),
      "color_image_options": Self.encodeImageOptions(RCTOptimizeDefaults.color),
      "grayscale_image_options": Self.encodeImageOptions(RCTOptimizeDefaults.grayscale),
      "monochrome_image_options": Self.encodeImageOptions(RCTOptimizeDefaults.monochrome),
      "color_space_convert": ["icc_data_base64": NSNull(), "rgb_to_cmyk": true],
    ]
  }

  /// Requests cancellation of the run in flight; does nothing when no run is in flight.
  func cancelOptimize() {
    RCTOptimizeState.lock.lock()
    let option = RCTOptimizeState.running
    RCTOptimizeState.lock.unlock()
    option?.isCanceled = true
  }

  /// `fontSubset` is accepted for parity with Android but is not supported by the iOS SDK yet.
  func optimizeSaveAsCopy(
    outputPath: String,
    options: [String: Any]?,
    completion: @escaping (Result<[String: Any], RCTCPDFBridgeError>) -> Void
  ) {
    guard let pdfListView = pdfViewController?.pdfListView, let document = pdfListView.document else {
      completion(.failure(RCTCPDFBridgeError(code: "DOCUMENT_INVALID", message: "The document is released or invalid.")))
      return
    }
    let savePath: String
    switch validateOutputPath(outputPath, document: document) {
    case .success(let path):
      savePath = path
    case .failure(let error):
      completion(.failure(error))
      return
    }
    guard let sourceURL = document.documentURL else {
      completion(.failure(RCTCPDFBridgeError(
        code: "DOCUMENT_INVALID", message: "The document has no source file to restore it from after the run.")))
      return
    }
    let option: CPDFOptimizeOption
    do {
      option = try Self.decodeOptimizeOptions(options, document: document)
    } catch let error as RCTCPDFBridgeError {
      completion(.failure(error))
      return
    } catch {
      completion(.failure(RCTCPDFBridgeError(code: "INVALID_OPTIMIZE_OPTIONS", message: "\(error)")))
      return
    }

    RCTOptimizeState.lock.lock()
    if RCTOptimizeState.running != nil {
      RCTOptimizeState.lock.unlock()
      completion(.failure(RCTCPDFBridgeError(
        code: "OPTIMIZE_ALREADY_RUNNING",
        message: "Another optimize run is already in flight. iOS allows one run at a time across all documents.")))
      return
    }
    RCTOptimizeState.running = option
    RCTOptimizeState.lock.unlock()

    // Pending edits become part of the optimized copy; like every unsaved change they are still
    // discarded by the reload at the end.
    commitPendingEdits()
    if pdfListView.isEditing() {
      pdfListView.endOfEditing()
    }
    let pageIndex = pdfListView.currentPageIndex
    let password = document.password

    // The notification is posted synchronously on the thread running the core, so the counter is
    // only ever touched from that one thread.
    var pagesProcessed = 0
    let observer = NotificationCenter.default.addObserver(
      forName: NSNotification.Name("CPDFDocumentOptimizeProgressDidUpdateNotification"), object: nil, queue: nil
    ) { [weak self] notification in
      guard let index = (notification.userInfo?[CPDFOptimizeProgressPageIndexKey] as? NSNumber)?.intValue else {
        return
      }
      pagesProcessed = max(pagesProcessed, index + 1)
      DispatchQueue.main.async {
        self?.onChange?(["onOptimizeProgress": ["page_index": index]])
      }
    }
    option.startProgressMonitor()

    DispatchQueue.global(qos: .userInitiated).async { [weak self] in
      let fileManager = FileManager.default
      if fileManager.fileExists(atPath: savePath) {
        try? fileManager.removeItem(atPath: savePath)
      }
      var stepsUs: Int64 = 0
      var saveUs: Int64 = 0
      let ok = option.optimizeAndSaveAsCopy(withPath: savePath, stepsMicroseconds: &stepsUs, saveMicroseconds: &saveUs)
      let cancelled = option.isCanceled
      if !ok && fileManager.fileExists(atPath: savePath) {
        // Never leave a partial copy behind.
        try? fileManager.removeItem(atPath: savePath)
      }
      let processed = pagesProcessed

      DispatchQueue.main.async {
        NotificationCenter.default.removeObserver(observer)
        let restoreError: String?
        if let self = self {
          restoreError = self.restoreOptimizedDocument(sourceURL: sourceURL, password: password, pageIndex: pageIndex)
        } else {
          restoreError = "The reader was closed before the document could be reloaded."
        }
        let failure: String? = (!ok && !cancelled) ? "The optimize run failed." : nil
        if let restoreError = restoreError {
          // The opened document still holds the optimized content; saving it would overwrite
          // the source, so this outranks any other failure.
          completion(.failure(RCTCPDFBridgeError(
            code: "OPTIMIZE_RESTORE_FAILED", message: failure.map { "\($0) \(restoreError)" } ?? restoreError)))
        } else if let failure = failure {
          completion(.failure(RCTCPDFBridgeError(code: "OPTIMIZE_FAILED", message: failure)))
        } else {
          completion(.success([
            "ok": ok,
            "cancelled": cancelled,
            "pages_processed": processed,
            "steps_us": Int(stepsUs),
            "save_us": Int(saveUs),
          ]))
        }
        // Released last, so a follow-up run cannot start while this one is still restoring.
        RCTOptimizeState.lock.lock()
        RCTOptimizeState.running = nil
        RCTOptimizeState.lock.unlock()
      }
    }
  }

  /// Reopens the document from its source file and hands it to the reader.
  ///
  /// - Returns: `nil` when the document was restored, otherwise why it was not.
  private func restoreOptimizedDocument(sourceURL: URL, password: String?, pageIndex: Int) -> String? {
    let warning = "Do not save it; close and reopen the document instead."
    guard let reloaded = CPDFDocument(url: sourceURL) else {
      return "The optimized document could not be reloaded from its original source. \(warning)"
    }
    if reloaded.isLocked {
      guard let password = password, !password.isEmpty, reloaded.unlock(withPassword: password) else {
        return "The optimized document could not be unlocked after reloading it. \(warning)"
      }
    }
    if let error = reloaded.error as NSError? {
      return "The optimized document could not be reloaded from its original source (native code \(error.code)). \(warning)"
    }
    guard let pdfListView = pdfViewController?.pdfListView else {
      return "The reader was closed before the document could be reloaded. \(warning)"
    }
    pdfListView.document = reloaded
    pdfViewController?.filePath = reloaded.documentURL?.path
    if reloaded.pageCount > 0 {
      pdfListView.go(toPageIndex: min(pageIndex, Int(reloaded.pageCount) - 1), animated: false)
    }
    pdfListView.setNeedsDisplay()
    return nil
  }

  // MARK: - Codec

  /// Decodes the bridge payload; a missing payload or entry falls back to the core defaults that
  /// `getOptimizeOptions` reports. `imageQuality` is applied before the three image settings
  /// because its setter overwrites their quality, so a per-class quality wins, as on Android.
  private static func decodeOptimizeOptions(_ payload: [String: Any]?, document: CPDFDocument) throws -> CPDFOptimizeOption {
    guard let option = CPDFOptimizeOption(document: document) else {
      throw RCTCPDFBridgeError(code: "OPTIMIZE_FAILED", message: "The native optimize options could not be created.")
    }
    var color = RCTOptimizeDefaults.color
    var grayscale = RCTOptimizeDefaults.grayscale
    var monochrome = RCTOptimizeDefaults.monochrome
    var flags = RCTOptimizeDefaults.flags
    var imageQuality = RCTOptimizeDefaults.imageQuality
    var iccData: Data?
    var rgbToCmyk = true

    if let map = payload {
      if let value = map["flags"] as? NSNumber {
        flags = value.int32Value
      }
      if let value = map["image_quality"] as? NSNumber {
        let quality = value.floatValue
        if quality < 0 || quality > 100 {
          throw invalidOptions("image_quality must be between 0 and 100.")
        }
        imageQuality = quality
      }
      color = try decodeImageOptions(map["color_image_options"], fallback: color, field: "color_image_options")
      grayscale = try decodeImageOptions(map["grayscale_image_options"], fallback: grayscale, field: "grayscale_image_options")
      monochrome = try decodeImageOptions(map["monochrome_image_options"], fallback: monochrome, field: "monochrome_image_options")
      if let convert = map["color_space_convert"] as? [String: Any] {
        if let base64 = convert["icc_data_base64"] as? String, !base64.isEmpty {
          guard let data = Data(base64Encoded: base64) else {
            throw invalidOptions("color_space_convert.icc_data_base64 is not valid base64.")
          }
          iccData = data
        }
        if let value = convert["rgb_to_cmyk"] as? Bool {
          rgbToCmyk = value
        }
      }
    }

    // C enums imported into Swift accept any raw value, so a combined mask is kept as is.
    option.optimizeflag = CPDF_OPTIMIZE_FLAG(rawValue: flags) ?? CPDF_OPTIMIZE_FLAG(rawValue: RCTOptimizeDefaults.flags)!
    option.imageQuality = imageQuality
    option.col_imageOption = color
    option.gra_imageOption = grayscale
    option.mon_imageOption = monochrome
    option.iccProfileData = (iccData?.isEmpty ?? true) ? nil : iccData
    option.rgbToCMYK = rgbToCmyk
    return option
  }

  private static func decodeImageOptions(_ payload: Any?, fallback: CPDFOptimizeImageOption, field: String) throws -> CPDFOptimizeImageOption {
    guard let map = payload as? [String: Any] else {
      return fallback
    }
    var options = fallback
    options.uperPpi = try requirePositive(map["upper_ppi"], fallback: options.uperPpi, field: "\(field).upper_ppi")
    options.targetPpi = try requirePositive(map["target_ppi"], fallback: options.targetPpi, field: "\(field).target_ppi")
    options.blockSize = try requirePositive(map["block_size"], fallback: options.blockSize, field: "\(field).block_size")
    if let value = map["quality"] as? NSNumber {
      let quality = value.int32Value
      if quality < 0 || quality > 100 {
        throw invalidOptions("\(field).quality must be between 0 and 100.")
      }
      options.quality = quality
    }
    if let value = map["compress_algorithm"] as? String {
      options.compAlg = try algorithm(from: value, fallback: fallback.compAlg, field: field)
    }
    return options
  }

  private static func requirePositive(_ value: Any?, fallback: Int32, field: String) throws -> Int32 {
    guard let number = value as? NSNumber else {
      return fallback
    }
    if number.int32Value <= 0 {
      throw invalidOptions("\(field) must be greater than 0.")
    }
    return number.int32Value
  }

  /// Maps the bridge algorithm onto `CPDF_COMP_ALG` the way the Android JNI layer maps it onto the
  /// core: `flate` becomes JPEG 2000, and `none` / `run_length` keep the image class default.
  private static func algorithm(from value: String, fallback: CPDF_COMP_ALG, field: String) throws -> CPDF_COMP_ALG {
    switch value {
    case "jpeg2000", "flate":
      return RCTOptimizeDefaults.jpeg2000
    case "jpeg":
      return RCTOptimizeDefaults.jpeg
    case "jbig2":
      return RCTOptimizeDefaults.jbig2
    case "none", "run_length":
      return fallback
    default:
      throw invalidOptions("Unknown \(field).compress_algorithm: \(value)")
    }
  }

  private static func invalidOptions(_ message: String) -> RCTCPDFBridgeError {
    RCTCPDFBridgeError(code: "INVALID_OPTIMIZE_OPTIONS", message: message)
  }

  private static func encodeImageOptions(_ options: CPDFOptimizeImageOption) -> [String: Any] {
    let algorithm: String
    switch options.compAlg.rawValue {
    case RCTOptimizeDefaults.jpeg2000.rawValue:
      algorithm = "jpeg2000"
    case RCTOptimizeDefaults.jpeg.rawValue:
      algorithm = "jpeg"
    case RCTOptimizeDefaults.jbig2.rawValue:
      algorithm = "jbig2"
    default:
      algorithm = "none"
    }
    return [
      "upper_ppi": Int(options.uperPpi),
      "target_ppi": Int(options.targetPpi),
      "quality": Int(options.quality),
      "block_size": Int(options.blockSize),
      "compress_algorithm": algorithm,
    ]
  }
}
