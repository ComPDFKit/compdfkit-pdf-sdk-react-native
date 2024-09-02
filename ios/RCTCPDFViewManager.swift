//
//  RCTCPDFViewManager.swift
//  react-native-compdfkit-pdf
//
//  Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import UIKit
import ComPDFKit

@objc(RCTCPDFReaderView)
class RCTCPDFReaderView: RCTViewManager, RCTCPDFViewDelegate {
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    var cpdfViews: Dictionary<Int, RCTCPDFView> = [:]
    
    @objc override func view() -> UIView! {
        let rtcCPDFView = RCTCPDFView()
        rtcCPDFView.delegate = self
        return rtcCPDFView
    }
    
    func saveDocument(forCPDFViewTag tag: Int, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.saveDocument(completionHandler: { success in
            completionHandler(success)
        })
    }
    
    // MARK: - RCTCPDFViewDelegate
    
    func cpdfViewAttached(_ cpdfView: RCTCPDFView) {
        cpdfViews[cpdfView.reactTag.intValue] = cpdfView
    }
}
