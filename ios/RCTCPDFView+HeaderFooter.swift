//
//  RCTCPDFView+HeaderFooter.swift
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
  private enum HeaderFooterError: LocalizedError {
    case documentUnavailable
    case invalidInput(String)

    var errorDescription: String? {
      switch self {
      case .documentUnavailable:
        return "Document unavailable"
      case .invalidInput(let message):
        return message
      }
    }
  }

  func getHeaderFooter() -> [String: Any]? {
    guard let headerFooter = pdfViewController?.pdfListView?.document?.headerFooter() else {
      return nil
    }
    let hasContent = (0..<6).contains { index in
      !(headerFooter.text(at: UInt(index)) ?? "").isEmpty
    }
    guard hasContent else {
      return nil
    }
    let margin = headerFooter.margin
    let slots = (0..<6).map { index -> [String: Any] in
      [
        "position": headerFooterPosition(index),
        "text": headerFooter.text(at: UInt(index)) ?? "",
        "font_name": headerFooter.fontName(at: UInt(index)) ?? "Helvetica",
        "font_size": Double(headerFooter.fontSize(at: UInt(index))),
        "text_color": headerFooter.textColor(at: UInt(index))?.toHexString() ?? "#000000"
      ]
    }
    return [
      "pages": headerFooter.pageString ?? "",
      "margin": [
        "left": Double(margin.left),
        "top": Double(margin.top),
        "right": Double(margin.right),
        "bottom": Double(margin.bottom)
      ],
      "slots": slots
    ]
  }

  func updateHeaderFooter(info: [String: Any]) throws -> Bool {
    guard let headerFooter = pdfViewController?.pdfListView?.document?.headerFooter() else {
      throw HeaderFooterError.documentUnavailable
    }
    guard let pages = info["pages"] as? String, !pages.isEmpty,
          let margin = info["margin"] as? [String: Any],
          let slots = info["slots"] as? [[String: Any]], !slots.isEmpty,
          let left = number(margin["left"]),
          let top = number(margin["top"]),
          let right = number(margin["right"]),
          let bottom = number(margin["bottom"]) else {
      throw HeaderFooterError.invalidInput("Header/footer payload is invalid.")
    }
    var positions = Set<Int>()
    for slot in slots {
      guard let index = headerFooterIndex(slot["position"] as? String),
            positions.insert(index).inserted,
            let fontSize = number(slot["font_size"]), fontSize > 0 else {
        throw HeaderFooterError.invalidInput("Header/footer slot is invalid.")
      }
    }

    headerFooter.pageString = pages
    headerFooter.margin = UIEdgeInsets(top: top, left: left, bottom: bottom, right: right)
    for index in 0..<6 {
      headerFooter.setText("", at: UInt(index))
    }
    for slot in slots {
      guard let index = headerFooterIndex(slot["position"] as? String),
            let fontSize = number(slot["font_size"]) else {
        continue
      }
      headerFooter.setText(slot["text"] as? String ?? "", at: UInt(index))
      headerFooter.setFontName(slot["font_name"] as? String ?? "Helvetica", at: UInt(index))
      headerFooter.setFontSize(fontSize, at: UInt(index))
      headerFooter.setTextColor(color(slot["text_color"] as? String ?? "#FF000000"), at: UInt(index))
    }
    headerFooter.update()
    pdfViewController?.pdfListView?.layoutDocumentView()
    return true
  }

  func clearHeaderFooter() -> Bool {
    guard let headerFooter = pdfViewController?.pdfListView?.document?.headerFooter() else {
      return false
    }
    let success = headerFooter.clear()
    if success {
      pdfViewController?.pdfListView?.layoutDocumentView()
    }
    return success
  }

  private func headerFooterPosition(_ index: Int) -> String {
    switch index {
    case 0: return "header_left"
    case 1: return "header_center"
    case 2: return "header_right"
    case 3: return "footer_left"
    case 4: return "footer_center"
    case 5: return "footer_right"
    default: return "header_left"
    }
  }

  private func headerFooterIndex(_ value: String?) -> Int? {
    switch value {
    case "header_left": return 0
    case "header_center": return 1
    case "header_right": return 2
    case "footer_left": return 3
    case "footer_center": return 4
    case "footer_right": return 5
    default: return nil
    }
  }

  private func number(_ value: Any?) -> CGFloat? {
    guard let number = value as? NSNumber else { return nil }
    return CGFloat(number.doubleValue)
  }

  private func color(_ value: String) -> UIColor {
    var hex = value.trimmingCharacters(in: .whitespacesAndNewlines)
    if hex.hasPrefix("#") { hex.removeFirst() }
    if hex.count == 8 { hex = String(hex.dropFirst(2)) }
    guard hex.count == 6, let rgb = UInt64(hex, radix: 16) else { return .black }
    return UIColor(
      red: CGFloat((rgb >> 16) & 0xFF) / 255,
      green: CGFloat((rgb >> 8) & 0xFF) / 255,
      blue: CGFloat(rgb & 0xFF) / 255,
      alpha: 1)
  }
}
