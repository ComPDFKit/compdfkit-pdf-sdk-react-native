//
//  RCTCPDFView+Watermark.swift
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

extension RCTCPDFView {
  private enum WatermarkError: LocalizedError {
    case documentUnavailable
    case invalidType
    case invalidInput(String)
    case imageDecodeFailed
    case createFailed

    var errorDescription: String? {
      switch self {
      case .documentUnavailable:
        return "Document unavailable"
      case .invalidType:
        return "Invalid watermark type"
      case .invalidInput(let message):
        return message
      case .imageDecodeFailed:
        return "Failed to decode image"
      case .createFailed:
        return "Failed to create watermark"
      }
    }
  }

  func createWatermark(info: [String: Any]) throws -> Bool {
    guard let document = pdfViewController?.pdfListView?.document else {
      throw WatermarkError.documentUnavailable
    }
    let type = stringValue(info, "type", "")
    try validateWatermarkInput(info: info, type: type, isCreate: true)

    let watermarkType = try nativeWatermarkType(type)
    guard let watermark = CPDFWatermark(document: document, type: watermarkType) else {
      throw WatermarkError.createFailed
    }
    try applyWatermark(info: info, to: watermark, replaceImage: true)
    document.addWatermark(watermark)
    refreshWatermarkPages()
    return true
  }

  func getWatermarkCount() -> Int {
    return pdfViewController?.pdfListView?.document?.watermarks()?.count ?? 0
  }

  func getWatermark(index: Int, exportImage: Bool) -> [String: Any]? {
    guard let document = pdfViewController?.pdfListView?.document,
          let watermarks = document.watermarks(),
          index >= 0,
          index < watermarks.count,
          let watermark = watermarks[index] as? CPDFWatermark else {
      return nil
    }
    return watermarkMap(watermark, index: index, exportImage: exportImage)
  }

  func getWatermarks(exportImages: Bool) -> [[String: Any]] {
    guard let document = pdfViewController?.pdfListView?.document,
          let watermarks = document.watermarks() else {
      return []
    }
    return watermarks.enumerated().compactMap { index, item in
      guard let watermark = item as? CPDFWatermark else { return nil }
      return watermarkMap(watermark, index: index, exportImage: exportImages)
    }
  }

  func updateWatermark(index: Int, info: [String: Any]) throws -> Bool {
    guard let document = pdfViewController?.pdfListView?.document,
          let watermarks = document.watermarks() else {
      return false
    }
    guard index >= 0,
          index < watermarks.count else {
      return false
    }
    guard let watermark = watermarks[index] as? CPDFWatermark else {
      return false
    }
    let payloadType = stringValue(info, "type", "")
    if !payloadType.isEmpty && payloadType != typeString(watermark.type) {
      return false
    }
    try validateWatermarkInput(info: info, watermark: watermark, isCreate: false)
    let replaceImage = watermark.type == .image && !stringValue(info, "image_path", "").isEmpty
    try applyWatermark(info: info, to: watermark, replaceImage: replaceImage)
    let success = document.updateWatermark(watermark)
    if success {
      refreshWatermarkPages()
    }
    return success
  }

  func removeWatermark(index: Int) -> Bool {
    guard let document = pdfViewController?.pdfListView?.document,
          let watermarks = document.watermarks(),
          index >= 0,
          index < watermarks.count,
          let watermark = watermarks[index] as? CPDFWatermark else {
      return false
    }
    document.removeWatermark(watermark)
    refreshWatermarkPages()
    return true
  }

  func removeAllWatermarks() -> Bool {
    guard let document = pdfViewController?.pdfListView?.document,
          let watermarks = document.watermarks() else {
      return false
    }
    for item in watermarks.reversed() {
      if let watermark = item as? CPDFWatermark {
        document.removeWatermark(watermark)
      }
    }
    refreshWatermarkPages()
    return true
  }

  private func applyWatermark(info: [String: Any], to watermark: CPDFWatermark, replaceImage: Bool) throws {
    if watermark.type == .text {
      let fontSize = positiveDoubleValue(info, "font_size", 30)
      watermark.text = stringValue(info, "text_content", "")
      watermark.cFont = CPDFFont(familyName: "Helvetica", fontStyle: "")
      watermark.fontSize = CGFloat(fontSize)
      watermark.textColor = colorValue(info, "text_color", "#000000")
    } else if watermark.type == .image && replaceImage {
      let imagePath = stringValue(info, "image_path", "")
      guard let image = UIImage(contentsOfFile: imagePath) else {
        throw WatermarkError.imageDecodeFailed
      }
      watermark.image = image
    }

    watermark.scale = doubleValue(info, "scale", 1)
    watermark.rotation = doubleValue(info, "rotation", 45)
    watermark.opacity = doubleValue(info, "opacity", 1)
    watermark.pageString = stringValue(info, "pages", "")
    watermark.verticalPosition = verticalPosition(stringValue(info, "vertical_alignment", "center"))
    watermark.horizontalPosition = horizontalPosition(stringValue(info, "horizontal_alignment", "center"))
    watermark.ty = doubleValue(info, "vertical_offset", 0)
    watermark.tx = doubleValue(info, "horizontal_offset", 0)
    watermark.isFront = boolValue(info, "is_front", true)
    watermark.isTilePage = boolValue(info, "is_tile_page", false)
    watermark.horizontalSpacing = doubleValue(info, "horizontal_spacing", 0)
    watermark.verticalSpacing = doubleValue(info, "vertical_spacing", 0)
  }

  private func validateWatermarkInput(info: [String: Any], type: String, isCreate: Bool) throws {
    if stringValue(info, "pages", "").isEmpty {
      throw WatermarkError.invalidInput("The page range cannot be empty, please set the page range, for example: pages: \"0,1,2,3\"")
    }
    if type == "text" && stringValue(info, "text_content", "").isEmpty {
      throw WatermarkError.invalidInput("Add text watermark, the text cannot be empty")
    }
    if type == "image" && isCreate && stringValue(info, "image_path", "").isEmpty {
      throw WatermarkError.invalidInput("image path is empty")
    }
  }

  private func validateWatermarkInput(info: [String: Any], watermark: CPDFWatermark, isCreate: Bool) throws {
    try validateWatermarkInput(info: info, type: typeString(watermark.type), isCreate: isCreate)
    if watermark.type == .image && stringValue(info, "image_path", "").isEmpty && watermark.image == nil {
      throw WatermarkError.invalidInput("image path is empty")
    }
  }

  private func watermarkMap(_ watermark: CPDFWatermark, index: Int, exportImage: Bool) -> [String: Any] {
    let exportedImage = exportWatermarkImage(watermark, index: index, exportImage: exportImage)
    return [
      "index": index,
      "type": typeString(watermark.type),
      "text_content": watermark.text ?? "",
      "image_path": exportedImage.path,
      "is_image_exported": exportedImage.exported,
      "text_color": watermark.textColor?.toHexString() ?? "#000000",
      "font_size": Double(watermark.fontSize),
      "scale": Double(watermark.scale),
      "rotation": Double(watermark.rotation),
      "opacity": Double(watermark.opacity),
      "vertical_alignment": verticalPositionString(watermark.verticalPosition),
      "horizontal_alignment": horizontalPositionString(watermark.horizontalPosition),
      "vertical_offset": Double(watermark.ty),
      "horizontal_offset": Double(watermark.tx),
      "pages": watermark.pageString ?? "",
      "is_front": watermark.isFront,
      "is_tile_page": watermark.isTilePage,
      "horizontal_spacing": Double(watermark.horizontalSpacing),
      "vertical_spacing": Double(watermark.verticalSpacing)
    ]
  }

  private func exportWatermarkImage(_ watermark: CPDFWatermark, index: Int, exportImage: Bool) -> (path: String, exported: Bool) {
    guard exportImage, watermark.type == .image, let image = watermark.image, let data = image.pngData() else {
      return ("", false)
    }
    do {
      let documentId = pdfViewController?.pdfListView?.document?.documentURL.lastPathComponent ?? "document"
      let directory = try FileManager.default.url(
        for: .cachesDirectory,
        in: .userDomainMask,
        appropriateFor: nil,
        create: true
      )
      .appendingPathComponent("compdfkit/watermarks/\(documentId)", isDirectory: true)
      try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
      let file = directory.appendingPathComponent("watermark_\(index)_\(Int(Date().timeIntervalSince1970 * 1000))_\(UUID().uuidString).png")
      try data.write(to: file)
      return (file.path, true)
    } catch {
      return ("", false)
    }
  }

  private func nativeWatermarkType(_ value: String) throws -> CPDFWatermarkType {
    if value == "text" {
      return .text
    }
    if value == "image" {
      return .image
    }
    throw WatermarkError.invalidType
  }

  private func typeString(_ type: CPDFWatermarkType) -> String {
    return type == .image ? "image" : "text"
  }

  private func verticalPosition(_ value: String) -> CPDFWatermarkVerticalPosition {
    switch value {
    case "top": return .top
    case "bottom": return .bottom
    default: return .center
    }
  }

  private func horizontalPosition(_ value: String) -> CPDFWatermarkHorizontalPosition {
    switch value {
    case "left": return .left
    case "right": return .right
    default: return .center
    }
  }

  private func verticalPositionString(_ value: CPDFWatermarkVerticalPosition) -> String {
    switch value {
    case .top: return "top"
    case .bottom: return "bottom"
    default: return "center"
    }
  }

  private func horizontalPositionString(_ value: CPDFWatermarkHorizontalPosition) -> String {
    switch value {
    case .left: return "left"
    case .right: return "right"
    default: return "center"
    }
  }

  private func colorValue(_ info: [String: Any], _ key: String, _ defaultValue: String) -> UIColor {
    var hex = stringValue(info, key, defaultValue).trimmingCharacters(in: .whitespacesAndNewlines)
    if hex.hasPrefix("#") {
      hex.removeFirst()
    }
    if hex.count == 8 {
      hex = String(hex.dropFirst(2))
    }
    guard hex.count == 6, let rgb = UInt64(hex, radix: 16) else {
      return .black
    }
    return UIColor(
      red: CGFloat((rgb >> 16) & 0xFF) / 255,
      green: CGFloat((rgb >> 8) & 0xFF) / 255,
      blue: CGFloat(rgb & 0xFF) / 255,
      alpha: 1
    )
  }

  private func stringValue(_ info: [String: Any], _ key: String, _ defaultValue: String) -> String {
    return info[key] as? String ?? defaultValue
  }

  private func doubleValue(_ info: [String: Any], _ key: String, _ defaultValue: Double) -> Double {
    if let value = info[key] as? NSNumber {
      return value.doubleValue
    }
    return info[key] as? Double ?? defaultValue
  }

  private func positiveDoubleValue(_ info: [String: Any], _ key: String, _ defaultValue: Double) -> Double {
    let value = doubleValue(info, key, defaultValue)
    return value > 0 ? value : defaultValue
  }

  private func boolValue(_ info: [String: Any], _ key: String, _ defaultValue: Bool) -> Bool {
    return info[key] as? Bool ?? defaultValue
  }

  private func refreshWatermarkPages() {
    pdfViewController?.pdfListView?.layoutDocumentView()
  }
}
