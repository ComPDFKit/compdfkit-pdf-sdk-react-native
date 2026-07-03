//
//  CPDFPageTextUtil.swift
//  react-native-compdfkit-pdf
//
//  Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation
import ComPDFKit

class CPDFPageTextUtil {

  static func getPageText(from document: CPDFDocument?, pageIndex: Int) -> String {
    guard let page = page(from: document, pageIndex: pageIndex) else {
      return ""
    }
    return fullText(from: page)
  }

  static func getPageTextInRect(
    from document: CPDFDocument?,
    pageIndex: Int,
    rectInfo: [String: Any]?
  ) -> String {
    guard let page = page(from: document, pageIndex: pageIndex),
          let rect = rect(from: rectInfo) else {
      return ""
    }
    return page.string(for: rect) ?? ""
  }

  static func getPageTextLines(
    from document: CPDFDocument?,
    pageIndex: Int
  ) -> [[String: Any]] {
    guard let page = page(from: document, pageIndex: pageIndex) else {
      return []
    }
    let length = Int(page.numberOfCharacters)
    guard length > 0,
          let selection = page.selection(for: NSRange(location: 0, length: length)) else {
      return []
    }
    return selection.selectionsByLine.enumerated().map { index, line in
      let bounds = line.bounds
      return [
        "pageIndex": pageIndex,
        "lineIndex": index,
        "location": line.range.location,
        "length": line.range.length,
        "rect": [
          "left": bounds.origin.x,
          "top": bounds.origin.y,
          "right": bounds.origin.x + bounds.size.width,
          "bottom": bounds.origin.y + bounds.size.height,
        ],
      ]
    }
  }

  private static func page(from document: CPDFDocument?, pageIndex: Int) -> CPDFPage? {
    guard let document = document,
          pageIndex >= 0,
          pageIndex < document.pageCount else {
      return nil
    }
    return document.page(at: UInt(pageIndex))
  }

  private static func fullText(from page: CPDFPage) -> String {
    let length = Int(page.numberOfCharacters)
    if length == 0 {
      return ""
    }
    return page.string(for: NSRange(location: 0, length: length)) ?? ""
  }

  private static func rect(from info: [String: Any]?) -> CGRect? {
    guard let info = info else {
      return nil
    }
    let left = numberValue(info["left"])
    let top = numberValue(info["top"])
    let right = numberValue(info["right"])
    let bottom = numberValue(info["bottom"])
    let width = right - left
    let minY = min(top, bottom)
    let maxY = max(top, bottom)
    let height = maxY - minY
    guard abs(width) > 0.1, abs(height) > 0.1 else {
      return nil
    }
    return CGRect(x: left, y: minY, width: width, height: height)
  }

  private static func numberValue(_ value: Any?) -> CGFloat {
    if let number = value as? NSNumber {
      return CGFloat(truncating: number)
    }
    if let value = value as? CGFloat {
      return value
    }
    if let value = value as? Double {
      return CGFloat(value)
    }
    if let value = value as? Float {
      return CGFloat(value)
    }
    if let value = value as? Int {
      return CGFloat(value)
    }
    if let value = value as? String {
      return CGFloat(Double(value) ?? 0)
    }
    return 0
  }
}
