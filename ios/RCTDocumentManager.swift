//
//  RCTDocumentManager.swift
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

@objc(CPDFViewManager)
class RCTDocumentManager: NSObject, RCTBridgeModule {
    static func moduleName() -> String! {
        return "RCTDocumentManager"
    }
    
    internal var bridge: RCTBridge!
    
    @objc func readerView() -> RCTCPDFReaderView {
        self.bridge.module(for: RCTCPDFReaderView.self) as! RCTCPDFReaderView
    }
    
    @objc(save: withResolver: withRejecter:)
    func save(tag: Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.saveDocument(forCPDFViewTag: tag) { success in
                if success {
                    resolve(success)
                } else {
                    reject("save_failed", "Failed to save document", nil);
                }
            }
            
        }
    }
    
}
