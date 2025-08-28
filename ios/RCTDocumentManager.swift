//
//  RCTDocumentManager.swift
//  react-native-compdfkit-pdf
//
//  Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
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
  
  // MARK: - Document Methods
  
  @objc(setMargins: withEdges: withResolver: withRejecter:)
  func setMargins(tag : Int, edges: NSArray, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    DispatchQueue.main.async {
      guard edges.count == 4,
            let left = edges[0] as? Int,
            let top = edges[1] as? Int,
            let right = edges[2] as? Int,
            let bottom = edges[3] as? Int else {
        reject("INVALID_EDGES", "edges must be array of 4 integers", nil)
        return
      }
      
      let reader = self.readerView()
      reader.setMargins(forCPDFViewTag: tag, left: left, top: top, right: right, bottom: bottom)
      resolve(nil)
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
  
  @objc(setDisplayPageIndex: withPageIndex: withResolver: withRejecter:)
  func setDisplayPageIndex(tag : Int, pageIndex : Int,resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setDisplayPageIndex(forCPDFViewTag: tag, pageIndex: pageIndex)
      resolve(nil)
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
  
  @objc(setScale: withScaleValue: withResolver: withRejecter: )
  func setScale(tag : Int, scale : NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setScale(forCPDFViewTag: tag, scale: scale)
      resolve(nil)
    }
  }
  
  @objc(getScale: withResolver: withRejecter:)
  func getScale(tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.getScale(forCPDFViewTag: tag) { scale in
        resolve(scale)
      }
    }
  }
  
  @objc(setBackgroundColor: withBackgroundColor: withResolver: withRejecter:)
  func setBackgroundColor(tag : Int, backgroundColor : String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setBackgroundColor(forCPDFViewTag: tag, color: backgroundColor)
      resolve(nil)
    }
  }
  
  @objc(setReadBackgroundColor: withThemes: withResolver: withRejecter:)
  func setReadBackgroundColor(tag : Int, themes : NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void{
    DispatchQueue.main.async {
      let reader = self.readerView()
      let displayMode = themes["displayMode"] as? NSString ?? "light"
      reader.setReadBackgroundColor(forCPDFViewTag: tag, displayMode: displayMode)
      resolve(nil)
    }
  }
  
  @objc(getReadBackgroundColor: withResolver: withRejecter:)
  func getReadBackgroundColor(tag: Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.getReadBackgroundColor(forCPDFViewTag: tag, completionHandler: {color in
        resolve(color)
      })
    }
  }
  
  @objc(setFormFieldHighlight: withFormFieldHighlight: withResolver: withRejecter:)
  func setFormFieldHighlight(tag: Int, formFieldHighlight : Bool,resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setFormFieldHighlight(forCPDFViewTag: tag, formFieldHighlight: formFieldHighlight)
      resolve(nil)
    }
  }
  
  @objc(isFormFieldHighlight: withResolver: withRejecter:)
  func isFormFieldHighlight(tag: Int,  resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.isFormFieldHighlight(forCPDFViewTag: tag, completionHandler: {highlight in
        resolve(highlight)
      })
    }
  }
  
  @objc(setLinkHighlight: withLinkHighlight: withResolver: withRejecter:)
  func setLinkHighlight(tag: Int, linkHighlight : Bool,resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setLinkHighlight(forCPDFViewTag: tag, linkHighlight: linkHighlight)
      resolve(nil)
    }
  }
  
  @objc(isLinkHighlight: withResolver: withRejecter:)
  func isLinkHighlight(tag: Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.isLinkHighlight(forCPDFViewTag: tag, completionHandler: {highlight in
        resolve(highlight)
      })
    }
  }
  
  @objc(setVerticalMode: withVerticalMode: withResolver: withRejecter:)
  func setVerticalMode(tag : Int, isVerticalMode : Bool,resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setVerticalMode(forCPDFViewTag: tag, isVerticalMode: isVerticalMode)
      resolve(nil)
    }
  }
  
  @objc(isVerticalMode: withResolver: withRejecter:)
  func isVerticalMode(tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.isVerticalMode(forCPDFViewTag: tag, completionHandler: {isVertical in
        resolve(isVertical)
      })
    }
  }
  
  @objc(setContinueMode: withContiueMode:  withResolver: withRejecter:)
  func setContinueMode(forCPDFViewTag tag : Int, isContinueMode : Bool,resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setContinueMode(forCPDFViewTag: tag, isContinueMode: isContinueMode)
      resolve(nil)
    }
  }
  
  @objc(isContinueMode: withResolver: withRejecter:)
  func isContinueMode(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.isContinueMode(forCPDFViewTag: tag, completionHandler: {isContinue in
        resolve(isContinue)
      })
    }
  }
  
  @objc(setDoublePageMode: withDoublePageMode: withResolver: withRejecter:)
  func setDoublePageMode(forCPDFViewTag tag : Int, isDoublePageMode : Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setDoublePageMode(forCPDFViewTag: tag, isDoublePageMode: isDoublePageMode)
      resolve(nil)
    }
  }
  
  @objc(isDoublePageMode: withResolver: withRejecter:)
  func isDoublePageMode(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.isDoublePageMode(forCPDFViewTag: tag, completionHandler: {isDoublePageMode in
        resolve(isDoublePageMode)
      })
    }
  }
  
  @objc(setCoverPageMode: withCoverPageMode: withResolver: withRejecter:)
  func setCoverPageMode(forCPDFViewTag tag : Int, isCoverPageMode : Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setCoverPageMode(forCPDFViewTag: tag, isCoverPageMode: isCoverPageMode)
      resolve(nil)
    }
  }
  
  @objc(isCoverPageMode: withResolver: withRejecter:)
  func isCoverPageMode(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.isCoverPageMode(forCPDFViewTag: tag, completionHandler: {isCoverPageMode in
        resolve(isCoverPageMode)
      })
    }
  }
  
  @objc(setCropMode: withCropMode: withResolver: withRejecter:)
  func setCropMode(forCPDFViewTag tag : Int, isCropMode : Bool,resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setCropMode(forCPDFViewTag: tag, isCropMode: isCropMode)
      resolve(nil)
    }
  }
  
  @objc(isCropMode: withResolver: withRejecter:)
  func isCropMode(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.isCropMode(forCPDFViewTag: tag, completionHandler: {isCropMode in
        resolve(isCropMode)
      })
    }
  }
  
  @objc(setPreviewMode: withViewMode: withResolver: withRejecter:)
  func setPreviewMode(forCPDFViewTag tag : Int, viewMode : String,resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setPreviewMode(forCPDFViewTag: tag, viewMode: viewMode)
      resolve(nil)
    }
  }
  
  @objc(getPreviewMode: withResolver: withRejecter:)
  func getPreviewMode(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.getPreviewMode(forCPDFViewTag: tag) { mode in
        resolve(mode)
      }
    }
  }
  
  @objc(showThumbnailView: withEditMode: withResolver: withRejecter:)
  func showThumbnailView(forCPDFViewTag tag : Int, isEditMode : Bool,resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.showThumbnailView(forCPDFViewTag: tag, isEditMode: isEditMode)
      resolve(nil)
    }
  }
  
  @objc(showBotaView: withResolver: withRejecter:)
  func showBotaView(forCPDFViewTag tag : Int,resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.showBotaView(forCPDFViewTag: tag)
      resolve(nil)
    }
  }
  
  @objc(showAddWatermarkView:withSaveAsNewFile: withResolver: withRejecter:)
  func showAddWatermarkView(forCPDFViewTag tag : Int, saveAsNewFile : Bool,resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.showAddWatermarkView(forCPDFViewTag: tag, saveAsNewFile: saveAsNewFile)
      resolve(nil)
    }
  }
  
  @objc(showSecurityView:withResolver: withRejecter:)
  func showSecurityView(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.showSecurityView(forCPDFViewTag: tag)
      resolve(nil)
    }
  }
  
  @objc(showDisplaySettingView: withResolver: withRejecter:)
  func showDisplaySettingView(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.showDisplaySettingView(forCPDFViewTag: tag)
      resolve(nil)
    }
  }
  
  @objc(enterSnipMode: withResolver: withRejecter:)
  func enterSnipMode(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.enterSnipMode(forCPDFViewTag: tag)
      resolve(nil)
    }
  }
  
  @objc(exitSnipMode: withResolver: withRejecter:)
  func exitSnipMode(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.exitSnipMode(forCPDFViewTag: tag)
      resolve(nil)
    }
  }
  
  @objc(open: withDocument: withPassword: withResolver: withRejecter:)
  func open(forCPDFViewTag tag: Int, document : URL, password : String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.open(forCPDFViewTag: tag, document: document, password: password) { success in
        resolve(success)
      }
    }
  }
  
  @objc(getFileName: withResolver: withRejecter:)
  func getFileName(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.getFileName(forCPDFViewTag: tag, completionHandler: {fileName in
        resolve(fileName)
      })
    }
  }
  
  @objc(isEncrypted: withResolver: withRejecter:)
  func isEncrypted(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.isEncrypted(forCPDFViewTag: tag, completionHandler: {isEncrypted in
        resolve(isEncrypted)
      })
    }
  }
  
  @objc(isImageDoc: withResolver: withRejecter:)
  func isImageDoc(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.isImageDoc(forCPDFViewTag: tag, completionHandler: {isImageDoc in
        resolve(isImageDoc)
      })
    }
  }
  
  @objc(getPermissions: withResolver: withRejecter:)
  func getPermissions(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.getPermissions(forCPDFViewTag: tag, completionHandler: {permissions in
        resolve(permissions)
      })
    }
  }
  
  @objc(getPageCount: withResolver: withRejecter:)
  func getPageCount(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.getPageCount(forCPDFViewTag: tag, completionHandler: {pageCount in
        resolve(pageCount)
      })
    }
  }
  
  @objc(checkOwnerUnlocked: withResolver: withRejecter:)
  func checkOwnerUnlocked(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.checkOwnerUnlocked(forCPDFViewTag: tag, completionHandler: {unlocked in
        resolve(unlocked)
      })
    }
  }
  
  
  @objc(checkOwnerPassword: withPassword: withResolver: withRejecter:)
  func checkOwnerPassword(forCPDFViewTag tag : Int, password : String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.checkOwnerPassword(forCPDFViewTag: tag, password: password, completionHandler: {correct in
        resolve(correct)
      })
    }
  }
  
  @objc(removePassword: withResolver: withRejecter:)
  func removePassword(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.removePassword(forCPDFViewTag: tag) { success in
        resolve(success)
      }
    }
  }
  
  @objc(setPassword: withInfo: withResolver: withRejecter:)
  func setPassword(forCPDFViewTag tag : Int, info : NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setPassword(forCPDFViewTag: tag, info: info) { success in
        resolve(success)
      }
    }
  }
  
  @objc(getEncryptAlgo: withResolver: withRejecter:)
  func getEncryptAlgo(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.getEncryptAlgo(forCPDFViewTag: tag, completionHandler: {encryptAlgo in
        resolve(encryptAlgo)
      })
    }
  }
  
  @objc(printDocument: withResolver: withRejecter:)
  func printDocument(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.printDocument(forCPDFViewTag: tag)
      resolve(nil)
    }
  }
  
  @objc(importWidgets: withXfdfFile: withResolver: withRejecter:)
  func importWidgets(tag : Int, xfdfFile : URL, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.importWidgets(forCPDFViewTag: tag, xfdfFile: xfdfFile) { success in
        if success {
          resolve(success)
        } else {
          reject("import_widgets_failed", "Failed to import widgets", nil);
        }
      }
    }
  }
  
  @objc(exportWidgets: withResolver: withRejecter:)
  func exportWidgets(tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.exportWidgets(forCPDFViewTag: tag) { xfdfFilePath in
        resolve(xfdfFilePath)
      }
    }
  }
  
  @objc(getDocumentPath: withResolver: withRejecter:)
  func getDocumentPath(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.getDocumentPath(forCPDFViewTag: tag) { path in
        resolve(path)
      }
    }
  }
  
  @objc(flattenAllPages: withSavePath: withFontSubset: withResolver: withRejecter:)
  func flattenAllPages(forCPDFViewTag tag : Int, savePath: URL, fontSubset: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.flattenAllPages(forCPDFViewTag: tag, savePath: savePath, fontSubset: fontSubset) { success in
        resolve(success)
      }
    }
  }
  
  @objc(saveAs: withSavePath: withRemoveSecurity: withFontSubset:  withResolver: withRejecter:)
  func saveAs(forCPDFViewTag tag : Int, savePath: URL, removeSecurity: Bool, fontSubset: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.saveAs(forCPDFViewTag: tag, savePath: savePath, removeSecurity: removeSecurity, fontSubset: fontSubset) { success in
        resolve(success)
      }
    }
  }
  
  @objc(importDocument: withFilePath: withInfo: withResolver: withRejecter:)
  func importDocument(forCPDFViewTag tag : Int, filePath: URL, info: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock)  {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.importDocument(forCPDFViewTag: tag, filePath: filePath, info: info) { success in
        resolve(success)
      }
    }
  }
  
  @objc(splitDocumentPages: withSavePath: withPages: withResolver: withRejecter:)
  func splitDocumentPages(forCPDFViewTag tag : Int, savePath: URL, pages: [Int], resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.splitDocumentPages(forCPDFViewTag: tag, savePath: savePath, pages: pages) { success in
        resolve(success)
      }
    }
  }
  
  @objc(insertBlankPage: withPageIndex: withPageWidth: withPageHeight: withResolver: withRejecter:)
  func insertBlankPage(forCPDFViewTag tag : Int, pageIndex: Int, pageWidth: NSNumber, pageHeight: NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.insertBlankPage(forCPDFViewTag: tag, pageIndex: pageIndex, pageWidth: pageWidth.floatValue, pageHeight: pageHeight.floatValue) { success in
        resolve(success)
      }
    }
  }
  
  // MARK: - Pages Methods
  
  @objc(getAnnotations: withPageIndex: withResolver: withRejecter:)
  func getAnnotations(forCPDFViewTag tag : Int, pageIndex: Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.getAnnotations(forCPDFViewTag: tag, pageIndex: pageIndex) { annotations in
        resolve(annotations)
      }
    }
  }
  
  @objc(getForms: withPageIndex: withResolver: withRejecter:)
  func getForms(forCPDFViewTag tag : Int, pageIndex: Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.getWidgets(forCPDFViewTag: tag, pageIndex: pageIndex) { widgets in
        resolve(widgets)
      }
    }
  }
  
  @objc(setWidgetIsChecked: withPage: withUuid: withIsChecked: withResolver: withRejecter:)
  func setWidgetIsChecked(forCPDFViewTag tag : Int, page: Int, uuid: String, isChecked: Bool, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setWidgetIsChecked(forCPDFViewTag: tag, pageIndex: page, uuid: uuid, isChecked: isChecked)
      resolve(nil)
    }
  }
  
  @objc(setTextWidgetText: withPage: withUuid: withText: withResolver: withRejecter:)
  func setTextWidgetText(forCPDFViewTag tag : Int, page: Int, uuid: String, text: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setTextWidgetText(forCPDFViewTag: tag, pageIndex: page, uuid: uuid, text: text)
      resolve(nil)
    }
  }
  
  @objc(addWidgetImageSignature: withPage: withUuid: withImagePath: withResolver: withRejecter:)
  func addWidgetImageSignature(forCPDFViewTag tag : Int, page: Int, uuid: String, imagePath: URL, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.addWidgetImageSignature(forCPDFViewTag: tag, pageIndex: page, uuid: uuid, imagePath: imagePath) { success in
        resolve(success)
        
      }
    }
  }
  
  @objc(updateAp: withPage: withUuid: withResolver: withRejecter:)
  func updateAp(forCPDFViewTag tag : Int, page: Int, uuid: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.updateAp(forCPDFViewTag: tag, pageIndex: page, uuid: uuid)
      resolve(nil)
    }
  }
  
  @objc(reloadPages: withResolver: withRejecter:)
  func reloadPages(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.reloadPages(forCPDFViewTag: tag)
    }
  }
  
  @objc(removeAnnotation: withPageIndex: withAnnotId: withResolver: withRejecter:)
  func removeAnnotation(forCPDFViewTag tag : Int, pageIndex: Int, annotId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.removeAnnotation(forCPDFViewTag: tag, pageIndex: pageIndex, annotId: annotId) { success in
        resolve(success)
      }
    }
  }
  
  @objc(removeWidget: withPageIndex: withWidgetId: withResolver: withRejecter:)
  func removeWidget(forCPDFViewTag tag : Int, pageIndex: Int, widgetId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.removeWidget(forCPDFViewTag: tag, pageIndex:pageIndex, widgetId: widgetId) { success in
        resolve(success)
      }
    }
  }
  
  // MARK: - Annotation Methods
  
  @objc(setAnnotationMode: withMode: withResolver: withRejecter:)
  func setAnnotationMode(forCPDFViewTag tag : Int, mode: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.setAnnotationMode(forCPDFViewTag: tag, mode: mode)
      resolve(nil)
    }
  }
  
  @objc(getAnnotationMode: withResolver: withRejecter:)
  func getAnnotationMode(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.getAnnotationMode(forCPDFViewTag: tag) { mode in
        resolve(mode)
      }
    }
  }
  
  @objc(annotationCanRedo: withResolver: withRejecter:)
  func annotationCanRedo(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.annotationCanRedo(forCPDFViewTag: tag) { canRedo in
        resolve(canRedo)
      }
    }
  }
  
  @objc(annotationCanUndo: withResolver: withRejecter:)
  func annotationCanUndo(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.annotationCanUndo(forCPDFViewTag: tag) { canUndo in
        resolve(canUndo)
      }
    }
  }
  
  @objc(annotationUndo:withResolver: withRejecter:)
  func annotationUndo(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.annotationUndo(forCPDFViewTag: tag)
      resolve(nil)
    }
  }
  
  @objc(annotationRedo: withResolver: withRejecter:)
  func annotationRedo(forCPDFViewTag tag : Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.annotationRedo(forCPDFViewTag: tag)
    }
  }
  
  @objc(searchText: withText: withSearchOption: withResolver: withRejecter:)
  func searchText(forCPDFViewTag tag: Int, text: String, searchOption: Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.searchText(forCPDFViewTag: tag, text: text, searchOption: searchOption) { results in
        resolve(results)
      }
    }
  }
  
  @objc(selection: range: withResolver: withRejecter:)
  func selection(forCPDFViewTag tag: Int, range: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.sync {
      print("iOS-selection( range:\(range)")
      let reader = self.readerView()
      reader.selection(forCPDFViewTag: tag, dictionary: range, completionHandler: { results in
        resolve(nil)
      })
    }
  }
  
  @objc(clearSearch: withResolver: withRejecter:)
  func clearSearch(forCPDFViewTag tag: Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      let reader = self.readerView()
      reader.clearSearch(forCPDFViewTag: tag, completionHandler: {result in
        resolve(nil)
      })
    }
  }
  
  @objc(getSearchText: withPageIndex: withLocation: withLength: withResolver: withRejecter:)
  func getSearchText(forCPDFViewTag tag: Int, pageIndex: Int, location: Int, length: Int, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
    DispatchQueue.main.sync {
      let reader = self.readerView()
      reader.getSearchText(forCPDFViewTag: tag, pageIndex: pageIndex, location: location, length: length, completionHandler: {text in
        resolve(text)
      })
    }
  }
  
  
}
