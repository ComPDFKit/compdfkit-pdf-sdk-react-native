//
//  RCTCPDFView+BridgeCompat.swift
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

extension RCTCPDFView {
  func getInfo(completionHandler: @escaping ([String: Any]) -> Void) {
    let info = CPDFDocumentInfoUtil.getDocumentInfo(from: pdfViewController?.pdfListView?.document)
    completionHandler(info)
  }

  func getMajorVersion(completionHandler: @escaping (Int) -> Void) {
    if let document = pdfViewController?.pdfListView?.document {
      completionHandler(Int(document.majorVersion))
    } else {
      completionHandler(0)
    }
  }

  func getMinorVersion(completionHandler: @escaping (Int) -> Void) {
    if let document = pdfViewController?.pdfListView?.document {
      completionHandler(Int(document.minorVersion))
    } else {
      completionHandler(0)
    }
  }

  func getPermissionsInfo(completionHandler: @escaping ([String: Any]) -> Void) {
    let info = CPDFDocumentInfoUtil.getPermissionsInfo(document: pdfViewController?.pdfListView?.document)
    completionHandler(info)
  }
}
