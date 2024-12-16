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
    
    @objc(setMargins: withEdges:)
    func setMargins(tag : Int, edges: [Int]) -> Void {
        DispatchQueue.main.async {
            let reader = self.readerView()
            if edges.count == 4 {
                reader.setMargins(forCPDFViewTag: tag, left: edges[0], top: edges[1], right: edges[2], bottom: edges[3])
            }
        }
    }
    
    @objc(removeAllAnnotations: withResolver: withRejecter:)
    func removeAllAnnotations(tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.removeAllAnnotations(forCPDFViewTag: tag) { success in
                if success {
                    resolve(success)
                } else {
                    reject("remove_all_annotation_failed", "Failed to remove all annotation", nil);
                }
            }
        }
    }
    
    @objc(importAnnotations: withXfdfFile: withResolver: withRejecter:)
    func importAnnotations(tag : Int, xfdfFile : URL, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.importAnnotations(forCPDFViewTag: tag, xfdfFile: xfdfFile) { success in
                if success {
                    resolve(success)
                } else {
                    reject("import_annotation_failed", "Failed to import annotation", nil);
                }
            }
        }
    }
    
    @objc(exportAnnotations: withResolver: withRejecter:)
    func exportAnnotations(tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.exportAnnotations(forCPDFViewTag: tag) { xfdfFilePath in
                resolve(xfdfFilePath)
            } 
        }
    }
    
    @objc(setDisplayPageIndex: withPageIndex:)
    func setDisplayPageIndex(tag : Int, pageIndex : Int) -> Void {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.setDisplayPageIndex(forCPDFViewTag: tag, pageIndex: pageIndex)
        }
    }
    
    @objc(getCurrentPageIndex: withResolver: withRejecter:)
    func getCurrentPageIndex(tag : Int,resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.getCurrentPageIndex(forCPDFViewTag: tag) { pageIndex in
                resolve(pageIndex)
            }
        }
    }
    
    @objc(hasChange: withResolver: withRejecter:)
    func hasChange(tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.hasChange(forCPDFViewTag: tag) { success in
                resolve(success)
            }
        }
    }
    
}
