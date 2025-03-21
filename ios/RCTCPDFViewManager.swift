//
//  RCTCPDFViewManager.swift
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
    
    // MARK: - Document Methods
    
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
    
    func setScale(forCPDFViewTag tag : Int, scale : NSNumber) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setScale(scale: scale)
    }
    
    func getScale(forCPDFViewTag tag : Int, completionHandler: @escaping (NSNumber) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.getScale(completionHandler: { success in
            completionHandler(success)
        })
    }
    
    func setReadBackgroundColor(forCPDFViewTag tag : Int, displayMode : NSString) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setReadBackgroundColor(displayMode: displayMode)
    }
    
    func getReadBackgroundColor(forCPDFViewTag tag : Int, completionHandler: @escaping (NSString) -> Void){
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.getReadbackgroundColor(completionHandler: {color in
            completionHandler(color)
        })
    }
    
    func setFormFieldHighlight(forCPDFViewTag tag : Int, formFieldHighlight : Bool) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setFormFieldHighlight(formFieldHighlight: formFieldHighlight)
    }
    
    func isFormFieldHighlight(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void){
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.isFormFieldHighlight(completionHandler: {highlight in
            completionHandler(highlight)
        })
    }
    
    func setLinkHighlight(forCPDFViewTag tag : Int, linkHighlight : Bool) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setLinkHighlight(linkHighlight: linkHighlight)
    }
    
    func isLinkHighlight(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void){
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.isLinkHighlight(completionHandler: {highlight in
            completionHandler(highlight)
        })
    }
    
    func setVerticalMode(forCPDFViewTag tag : Int, isVerticalMode : Bool) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setVerticalMode(isVerticalMode: isVerticalMode)
    }
    
    func isVerticalMode(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void){
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.isVerticalMode(completionHandler: {isVertical in
            completionHandler(isVertical)
        })
    }
    
    func setContinueMode(forCPDFViewTag tag : Int, isContinueMode : Bool) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setContinueMode(isContinueMode: isContinueMode)
    }
    
    func isContinueMode(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void){
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.isContinueMode(completionHandler: {isContinue in
            completionHandler(isContinue)
        })
    }
    
    func setDoublePageMode(forCPDFViewTag tag : Int, isDoublePageMode : Bool) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setDoublePageMode(isDoublePageMode: isDoublePageMode)
    }
    
    func isDoublePageMode(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void){
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.isDoublePageMode(completionHandler: {isDoublePage in
            completionHandler(isDoublePage)
        })
    }
    
    func setCoverPageMode(forCPDFViewTag tag : Int, isCoverPageMode : Bool) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setCoverPageMode(isCoverPageMode: isCoverPageMode)
    }
    
    func isCoverPageMode(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void){
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.isCoverPageMode(completionHandler: { isCoverPageMode in
            completionHandler(isCoverPageMode)
        })
    }
    
    func setCropMode(forCPDFViewTag tag : Int, isCropMode : Bool) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setCropMode(isCropMode: isCropMode)
    }
    
    func isCropMode(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void){
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.isCropMode(completionHandler: completionHandler)
    }
    
    func setPreviewMode(forCPDFViewTag tag : Int, viewMode : String) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setPreviewMode(viewMode: viewMode)
    }
    
    func getPreviewMode(forCPDFViewTag tag : Int, completionHandler: @escaping (String) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.getPreviewMode(completionHandler: { mode in
            completionHandler(mode)
        })
    }
    
    func showThumbnailView(forCPDFViewTag tag : Int, isEditMode : Bool) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.showThumbnailView(isEditMode: isEditMode)
    }
    
    func showBotaView(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.showBotaView()
    }
    
    func showAddWatermarkView(forCPDFViewTag tag : Int, saveAsNewFile : Bool) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.showAddWatermarkView(saveAsNewFile: saveAsNewFile)
    }
    
    func showSecurityView(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.showSecurityView()
    }
    
    func showDisplaySettingView(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.showDisplaySettingView()
    }
    
    func enterSnipMode(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.enterSnipMode()
    }
    
    func exitSnipMode(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.exitSnipMode()
    }
    
    func open(forCPDFViewTag : Int, document : URL, password : String, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[forCPDFViewTag]
        rtcCPDFView?.open(document: document, password: password, completionHandler: { success in
            completionHandler(success)
        })
    }
    
    func getFileName(forCPDFViewTag tag : Int, completionHandler: @escaping (String) -> Void){
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.getFileName(completionHandler: completionHandler)
    }
    
    func isEncrypted(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void){
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.isEncrypted(completionHandler: completionHandler)
    }
    
    func isImageDoc(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void){
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.isImageDoc(completionHandler: completionHandler)
    }
    
    func getPermissions(forCPDFViewTag tag : Int, completionHandler: @escaping (NSNumber) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.getPermissions(completionHandler: completionHandler)
    }
    
    func getPageCount(forCPDFViewTag tag : Int, completionHandler: @escaping (NSNumber) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.getPageCount(completionHandler: completionHandler)
    }
    
    func checkOwnerUnlocked(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.checkOwnerUnlocked(completionHandler: completionHandler)
    }
    
    func checkOwnerPassword(forCPDFViewTag tag : Int, password : String, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.checkOwnerPassword(password: password, completionHandler: completionHandler)
    }
    
    func removePassword(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.removePassword(completionHandler: { success in
            completionHandler(success)
        })
    }
    
    func setPassword(forCPDFViewTag tag : Int, info : NSDictionary, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setPassword(info: info, completionHandler: { success in
            completionHandler(success)
        })
    }
    
    func getEncryptAlgo(forCPDFViewTag tag : Int, completionHandler: @escaping (String) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.getEncryptAlgo(completionHandler: completionHandler)
    }
    
    func printDocument(forCPDFViewTag tag : Int){
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.printDocument()
    }
    
    func importWidgets(forCPDFViewTag tag: Int, xfdfFile : URL, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.importWidgets(xfdfFile: xfdfFile, completionHandler: { success in
            completionHandler(success)
        })
    }
    
    func getDocumentPath(forCPDFViewTag tag : Int, completionHandler: @escaping (String) -> Void){
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.getDocumentPath(completionHandler: { path in
            completionHandler(path)
        })
    }
    
    func exportWidgets(forCPDFViewTag tag: Int, completionHandler: @escaping (String) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.exportWidgets(completionHandler: { success in
            completionHandler(success)
        })
    }
    
    func flattenAllPages(forCPDFViewTag tag : Int, savePath: URL, fontSubset: Bool, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.flattenAllPages(savePath: savePath, fontSubset: fontSubset,  completionHandler: { success in
            completionHandler(success)
        })
    }
    
    func saveAs(forCPDFViewTag tag : Int, savePath: URL, removeSecurity: Bool, fontSubset: Bool, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.saveAs(savePath: savePath, removeSecurity: removeSecurity, fontSubset: fontSubset, completionHandler: { success in
            completionHandler(success)
        })
    }
    
    func importDocument(forCPDFViewTag tag : Int, filePath: URL, info : NSDictionary, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.importDocument(filePath, info, completionHandler: { success in
            completionHandler(success)
        })
    }
    
    func splitDocumentPages(forCPDFViewTag tag : Int, savePath: URL, pages: [Int], completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.splitDocumentPages(savePath: savePath, pages: pages, completionHandler: { success in
            completionHandler(success)
        })
    }
    
    // MARK: - Pages Methods
    
    func getAnnotations(forCPDFViewTag tag : Int, pageIndex: Int, completionHandler: @escaping ([Dictionary<String, Any>]) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        
        let page = rtcCPDFView?.getPage(UInt(pageIndex))
        let pageUtil = RCTCPDFPageUtil(page: page)
        pageUtil.pageIndex = pageIndex
        let annotations = pageUtil.getAnnotations()
        
        completionHandler(annotations)
    }
    
    func getWidgets(forCPDFViewTag tag : Int, pageIndex: Int, completionHandler: @escaping ([Dictionary<String, Any>]) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        
        let page = rtcCPDFView?.getPage(UInt(pageIndex))
        let pageUtil = RCTCPDFPageUtil(page: page)
        pageUtil.pageIndex = pageIndex
        let widgets = pageUtil.getForms()
        
        completionHandler(widgets)
    }
    
    func setWidgetIsChecked(forCPDFViewTag tag :Int, pageIndex: Int, uuid: String, isChecked: Bool) {
        let rtcCPDFView = cpdfViews[tag]
        let page = rtcCPDFView?.getPage(UInt(pageIndex))
        let pageUtil = RCTCPDFPageUtil(page: page)
        pageUtil.pageIndex = pageIndex
        
        pageUtil.setWidgetIsChecked(uuid: uuid, isChecked: isChecked)
    }
    
    func setTextWidgetText(forCPDFViewTag tag :Int, pageIndex: Int, uuid: String, text: String) {
        let rtcCPDFView = cpdfViews[tag]
        let page = rtcCPDFView?.getPage(UInt(pageIndex))
        let pageUtil = RCTCPDFPageUtil(page: page)
        pageUtil.pageIndex = pageIndex
        
        pageUtil.setTextWidgetText(uuid: uuid, text: text)
    }

    func addWidgetImageSignature(forCPDFViewTag tag :Int, pageIndex: Int, uuid: String, imagePath: URL, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        let page = rtcCPDFView?.getPage(UInt(pageIndex))
        let pageUtil = RCTCPDFPageUtil(page: page)
        pageUtil.pageIndex = pageIndex
        
        pageUtil.addWidgetImageSignature(uuid: uuid, imagePath: imagePath) { success in
            completionHandler(success)
        }
    }
    
    func updateAp(forCPDFViewTag tag : Int, pageIndex: Int, uuid: String) {
        let rtcCPDFView = cpdfViews[tag]
        
        let page = rtcCPDFView?.getPage(UInt(pageIndex))
        let pageUtil = RCTCPDFPageUtil(page: page)
        pageUtil.pageIndex = pageIndex
        pageUtil.updateAp(uuid: uuid)
        
        rtcCPDFView?.pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
    }
    
    func reloadPages(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
    
        rtcCPDFView?.pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
        rtcCPDFView?.pdfViewController?.pdfListView?.layoutDocumentView()
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
