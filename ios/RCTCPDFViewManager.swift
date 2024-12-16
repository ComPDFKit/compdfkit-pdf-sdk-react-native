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
            
            if (success) {
                if let onChange = rtcCPDFView?.onChange {
                    onChange(["saveDocument": "saveDocument"])
                }
            }
        })
    }
    
    func setMargins(forCPDFViewTag tag: Int, left : Int, top : Int, right : Int, bottom : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setMargins(left: left, top: top, right: right, bottom: bottom)
    }
    
    func removeAllAnnotations(forCPDFViewTag tag: Int, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.removeAllAnnotations(completionHandler: { success in
            completionHandler(success)
        })
    }
    
    func importAnnotations(forCPDFViewTag tag: Int, xfdfFile : URL, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.importAnnotations(xfdfFile: xfdfFile, completionHandler: { success in
            completionHandler(success)
        })
    }
    
    func exportAnnotations(forCPDFViewTag tag: Int, completionHandler: @escaping (String) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.exportAnnotations(completionHandler: { success in
            completionHandler(success)
        })
    }
    
    func setDisplayPageIndex(forCPDFViewTag tag : Int, pageIndex : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setDisplayPageIndex(pageIndex: pageIndex)
    }
    
    func getCurrentPageIndex(forCPDFViewTag tag: Int, completionHandler: @escaping (Int) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.getCurrentPageIndex(completionHandler: { pageIndex in
            completionHandler(pageIndex)
        })
    }
    
    func hasChange(forCPDFViewTag tag: Int, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.hasChange(completionHandler: { success in
            completionHandler(success)
        })
    }
    
    
    
    // MARK: - RCTCPDFViewDelegate
    
    func cpdfViewAttached(_ cpdfView: RCTCPDFView) {
        cpdfViews[cpdfView.reactTag.intValue] = cpdfView
    }
    
    func saveDocumentChange(_ cpdfView: RCTCPDFView) {
        if let onChange = cpdfView.onChange {
            onChange(["saveDocument": "saveDocument"])
        }
    }
    
    func onPageChanged(_ cpdfView: RCTCPDFView, pageIndex: Int) {
        if let onChange = cpdfView.onChange {
            onChange(["onPageChanged": pageIndex])
        }
    }
    
}
