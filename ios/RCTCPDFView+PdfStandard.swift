//
//  RCTCPDFView+PdfStandard.swift
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

/// A bridge failure carrying the error code returned to JavaScript.
struct RCTCPDFBridgeError: Error {
  let code: String
  let message: String
}

extension RCTCPDFView {

  func getPdfStandardType() throws -> String {
    guard let document = pdfViewController?.pdfListView?.document else {
      throw RCTCPDFBridgeError(code: "DOCUMENT_INVALID", message: "The document is released or invalid.")
    }
    return RCTPdfStandardUtil.value(from: document.standardType())
  }

  /// Writes the document converted to a PDF standard into a new file.
  ///
  /// Unlike Android, the iOS SDK converts a copy of the in-memory document and leaves the opened
  /// document untouched, so no reload is needed afterwards. The SDK deletes an existing file at
  /// the output path before writing, which is why the output path is checked against the current
  /// document before anything runs.
  func convertToPdfStandard(
    outputPath: String,
    type: String,
    fontSubset: Bool,
    completion: @escaping (Result<Bool, RCTCPDFBridgeError>) -> Void
  ) {
    guard let document = pdfViewController?.pdfListView?.document else {
      completion(.failure(RCTCPDFBridgeError(code: "DOCUMENT_INVALID", message: "The document is released or invalid.")))
      return
    }
    if RCTPdfStandardUtil.unsupportedTargets.contains(type) {
      completion(.failure(RCTCPDFBridgeError(code: "UNSUPPORTED_PDF_STANDARD", message: "\(type) is not supported on iOS.")))
      return
    }
    guard let mode = RCTPdfStandardUtil.mode(from: type) else {
      completion(.failure(RCTCPDFBridgeError(code: "PDF_STANDARD_CONVERT_FAILED", message: "Unknown PDF standard type: \(type)")))
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
    // The iOS core would strip the security and convert anyway; Android refuses a document
    // opened with a password, so do the same here to keep one behavior across platforms.
    if document.isEncrypted && !(document.password ?? "").isEmpty {
      completion(.failure(RCTCPDFBridgeError(
        code: "ENCRYPTED_DOCUMENT_NOT_CONVERTIBLE",
        message: "An encrypted document cannot be converted. Remove the password with saveAs first.")))
      return
    }
    commitPendingEdits()

    DispatchQueue.global(qos: .userInitiated).async {
      var failure: RCTCPDFBridgeError?
      do {
        // The SDK also ships a Bool-returning overload with the same selector prefix, so Swift
        // imports this NSError variant with a placeholder `error: ()` argument.
        try document.writeStandardPDF(
          toFilePath: savePath,
          withType: mode,
          iccFilePath: nil,
          with: nil,
          isSaveFontSubset: fontSubset,
          error: ())
        if !FileManager.default.fileExists(atPath: savePath) {
          failure = RCTCPDFBridgeError(
            code: "PDF_STANDARD_SAVE_FAILED",
            message: "The conversion succeeded but writing \(savePath) failed.")
        }
      } catch let error as NSError {
        failure = Self.pdfStandardError(error, type: type)
      }
      DispatchQueue.main.async {
        completion(failure.map { .failure($0) } ?? .success(true))
      }
    }
  }

  /// Validates a writable output file that differs from the current document. Returns the plain
  /// file path to write to; a `file://` URL is accepted as well.
  func validateOutputPath(_ outputPath: String, document: CPDFDocument) -> Result<String, RCTCPDFBridgeError> {
    let trimmed = outputPath.trimmingCharacters(in: .whitespacesAndNewlines)
    if trimmed.isEmpty {
      return .failure(RCTCPDFBridgeError(code: "INVALID_OUTPUT_PATH", message: "outputPath must not be empty."))
    }
    let path: String
    if let url = URL(string: trimmed), url.isFileURL {
      path = url.path
    } else {
      path = trimmed
    }
    let outputURL = URL(fileURLWithPath: path)
    let parent = outputURL.deletingLastPathComponent().path
    var isDirectory: ObjCBool = false
    if !FileManager.default.fileExists(atPath: parent, isDirectory: &isDirectory) || !isDirectory.boolValue {
      return .failure(RCTCPDFBridgeError(code: "INVALID_OUTPUT_PATH", message: "The parent directory of \(path) does not exist."))
    }
    if !FileManager.default.isWritableFile(atPath: parent) {
      return .failure(RCTCPDFBridgeError(code: "INVALID_OUTPUT_PATH", message: "The directory \(parent) is not writable."))
    }
    // The sandbox exposes the same location as /var and /private/var, so compare resolved paths.
    if let documentURL = document.documentURL,
       documentURL.standardizedFileURL.resolvingSymlinksInPath().path
        == outputURL.standardizedFileURL.resolvingSymlinksInPath().path {
      return .failure(RCTCPDFBridgeError(code: "INVALID_OUTPUT_PATH", message: "outputPath must differ from the path of the current document."))
    }
    return .success(path)
  }

  /// Commits pending ink and content edits so operations that read the in-memory document see them.
  func commitPendingEdits() {
    guard let pdfListView = pdfViewController?.pdfListView else { return }
    pdfListView.exitDrawing()
    if pdfListView.isEditing() && pdfListView.isEdited() {
      pdfListView.commitEditing()
    }
  }

  private static func pdfStandardError(_ error: NSError, type: String) -> RCTCPDFBridgeError {
    if error.domain == CPDFStandardConversionErrorDomain
        && error.code == CPDFStandardConversionError.Code.unsupportedFormat.rawValue {
      return RCTCPDFBridgeError(code: "UNSUPPORTED_PDF_STANDARD", message: "\(type) is not supported on iOS.")
    }
    var message = "The conversion to \(type) failed (native \(error.domain) \(error.code))."
    if let reason = error.userInfo[NSLocalizedFailureReasonErrorKey] as? String, !reason.isEmpty {
      message += " \(reason)"
    }
    return RCTCPDFBridgeError(code: "PDF_STANDARD_CONVERT_FAILED", message: message)
  }
}
