//
//  RCTPdfStandardUtil.swift
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

/// Maps the bridge's PDF standard strings to `CPDFStandardMode` and back.
///
/// The string values match `CPDFPdfStandardType` in TypeScript and the Android bridge.
enum RCTPdfStandardUtil {

  /// Values that are valid on the bridge but are not iOS conversion targets.
  /// `pdf` has no conversion meaning, and the iOS SDK cannot write PDF/E-2.
  static let unsupportedTargets: Set<String> = ["pdf", "pdf_e_2"]

  private static let targets: [String: (CPDFStandardFormat, Int, CPDFPartType)] = [
    "pdf": (.PDF, 0, .none),
    "pdf_a_1a": (.PDFA, 1, .pdf_a),
    "pdf_a_1b": (.PDFA, 1, .pdf_b),
    "pdf_a_2a": (.PDFA, 2, .pdf_a),
    "pdf_a_2u": (.PDFA, 2, .pdf_u),
    "pdf_a_2b": (.PDFA, 2, .pdf_b),
    "pdf_a_3a": (.PDFA, 3, .pdf_a),
    "pdf_a_3u": (.PDFA, 3, .pdf_u),
    "pdf_a_3b": (.PDFA, 3, .pdf_b),
    "pdf_x_1a": (.PDFX, 1, .none),
    "pdf_x_3": (.PDFX, 3, .none),
    "pdf_x_4": (.PDFX, 4, .none),
    "pdf_e_1": (.PDFE, 1, .none),
    "pdf_e_2": (.PDFE, 2, .none),
    "pdf_ua_1": (.PDFUA, 1, .none),
    "pdf_vt_1": (.PDFVT, 1, .none),
    "pdf_vt_2": (.PDFVT, 2, .none),
  ]

  static func mode(from value: String) -> CPDFStandardMode? {
    guard let (format, typenum, partType) = targets[value] else {
      return nil
    }
    let mode = CPDFStandardMode()
    mode.format = format
    mode.typenum = typenum
    mode.partType = partType
    return mode
  }

  /// Returns the bridge value for a standard the document declares; unknown combinations map to `pdf`.
  static func value(from mode: CPDFStandardMode) -> String {
    let typenum = mode.typenum
    switch mode.format {
    case .PDFA:
      let part: String
      switch mode.partType {
      case .pdf_a:
        part = "a"
      case .pdf_b:
        part = "b"
      case .pdf_u where typenum != 1:
        part = "u"
      default:
        return "pdf"
      }
      return (1...3).contains(typenum) ? "pdf_a_\(typenum)\(part)" : "pdf"
    case .PDFX:
      switch typenum {
      case 1:
        return "pdf_x_1a"
      case 3, 4:
        return "pdf_x_\(typenum)"
      default:
        return "pdf"
      }
    case .PDFE:
      return (1...2).contains(typenum) ? "pdf_e_\(typenum)" : "pdf"
    case .PDFUA:
      return typenum == 1 ? "pdf_ua_1" : "pdf"
    case .PDFVT:
      return (1...2).contains(typenum) ? "pdf_vt_\(typenum)" : "pdf"
    default:
      return "pdf"
    }
  }
}
