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
    
    @objc(setScale: withScaleValue:)
    func setScale(tag : Int, scale : NSNumber) -> Void {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.setScale(forCPDFViewTag: tag, scale: scale)
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
    
    @objc(setReadBackgroundColor: withThemes:)
    func setReadBackgroundColor(tag : Int, themes : NSDictionary) -> Void{
        DispatchQueue.main.async {
            let reader = self.readerView()
            let displayMode = themes["displayMode"] as? NSString ?? "light"
            reader.setReadBackgroundColor(forCPDFViewTag: tag, displayMode: displayMode)
        }
    }
    
    @objc(getReadBackgroundColor: withResolver: withRejecter:)
    func getReadBackgroundColor(tag: Int,  resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.getReadBackgroundColor(forCPDFViewTag: tag, completionHandler: {color in
                resolve(color)
            })
        }
    }
    
    @objc(setFormFieldHighlight: withFormFieldHighlight:)
    func setFormFieldHighlight(tag: Int, formFieldHighlight : Bool) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.setFormFieldHighlight(forCPDFViewTag: tag, formFieldHighlight: formFieldHighlight)
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
    
    @objc(setLinkHighlight: withLinkHighlight:)
    func setLinkHighlight(tag: Int, linkHighlight : Bool) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.setLinkHighlight(forCPDFViewTag: tag, linkHighlight: linkHighlight)
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
    
    @objc(setVerticalMode: withVerticalMode:)
    func setVerticalMode(tag : Int, isVerticalMode : Bool){
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.setVerticalMode(forCPDFViewTag: tag, isVerticalMode: isVerticalMode)
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
    
    @objc(setContinueMode: withContiueMode:)
    func setContinueMode(forCPDFViewTag tag : Int, isContinueMode : Bool) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.setContinueMode(forCPDFViewTag: tag, isContinueMode: isContinueMode)
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
    
    @objc(setDoublePageMode: withDoublePageMode:)
    func setDoublePageMode(forCPDFViewTag tag : Int, isDoublePageMode : Bool) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.setDoublePageMode(forCPDFViewTag: tag, isDoublePageMode: isDoublePageMode)
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
    
    @objc(setCoverPageMode: withCoverPageMode:)
    func setCoverPageMode(forCPDFViewTag tag : Int, isCoverPageMode : Bool) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.setCoverPageMode(forCPDFViewTag: tag, isCoverPageMode: isCoverPageMode)
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
    
    @objc(setCropMode: withCropMode:)
    func setCropMode(forCPDFViewTag tag : Int, isCropMode : Bool) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.setCropMode(forCPDFViewTag: tag, isCropMode: isCropMode)
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
    
    @objc(setPreviewMode: withViewMode:)
    func setPreviewMode(forCPDFViewTag tag : Int, viewMode : String) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.setPreviewMode(forCPDFViewTag: tag, viewMode: viewMode)
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
    
    @objc(showThumbnailView: withEditMode:)
    func showThumbnailView(forCPDFViewTag tag : Int, isEditMode : Bool) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.showThumbnailView(forCPDFViewTag: tag, isEditMode: isEditMode)
        }
    }
    
    @objc(showBotaView:)
    func showBotaView(forCPDFViewTag tag : Int) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.showBotaView(forCPDFViewTag: tag)
        }
    }
    
    @objc(showAddWatermarkView:withSaveAsNewFile:)
    func showAddWatermarkView(forCPDFViewTag tag : Int, saveAsNewFile : Bool) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.showAddWatermarkView(forCPDFViewTag: tag, saveAsNewFile: saveAsNewFile)
        }
    }
    
    @objc(showSecurityView:)
    func showSecurityView(forCPDFViewTag tag : Int) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.showSecurityView(forCPDFViewTag: tag)
        }
    }
    
    @objc(showDisplaySettingView:)
    func showDisplaySettingView(forCPDFViewTag tag : Int) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.showDisplaySettingView(forCPDFViewTag: tag)
        }
    }
    
    @objc(enterSnipMode:)
    func enterSnipMode(forCPDFViewTag tag : Int) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.enterSnipMode(forCPDFViewTag: tag)
        }
    }
    
    @objc(exitSnipMode:)
    func exitSnipMode(forCPDFViewTag tag : Int) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.exitSnipMode(forCPDFViewTag: tag)
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
    
    @objc(printDocument:)
    func printDocument(forCPDFViewTag tag : Int){
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.printDocument(forCPDFViewTag: tag)
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
    
    @objc(setWidgetIsChecked: withPage: withUuid: withIsChecked: )
    func setWidgetIsChecked(forCPDFViewTag tag : Int, page: Int, uuid: String, isChecked: Bool) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.setWidgetIsChecked(forCPDFViewTag: tag, pageIndex: page, uuid: uuid, isChecked: isChecked)
        }
    }
    
    @objc(setTextWidgetText: withPage: withUuid: withText:)
    func setTextWidgetText(forCPDFViewTag tag : Int, page: Int, uuid: String, text: String) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.setTextWidgetText(forCPDFViewTag: tag, pageIndex: page, uuid: uuid, text: text)
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
    
  @objc(updateAp: withPage: withUuid:)
    func updateAp(forCPDFViewTag tag : Int, page: Int, uuid: String) {
        DispatchQueue.main.async {
            let reader = self.readerView()
            reader.updateAp(forCPDFViewTag: tag, pageIndex: page, uuid: uuid)
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
    
}
