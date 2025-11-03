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
import ComPDFKit_Tools

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
    
    func setDisplayPageIndex(forCPDFViewTag tag : Int, pageIndex : Int, withRectList rectList: [[String: Any]]) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setDisplayPageIndex(pageIndex: pageIndex, rectList: rectList)
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
    
    func setBackgroundColor(forCPDFViewTag tag : Int, color : String) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.setBackgroundColor(hexColor: color)
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
    
    func showAddWatermarkView(forCPDFViewTag tag : Int, config : [String: Any]) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.showAddWatermarkView(config: config)
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
    
    func insertBlankPage(forCPDFViewTag tag : Int, pageIndex: Int, pageWidth: Float, pageHeight: Float, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.insertBlankPage(pageIndex: pageIndex, pageWidth: pageWidth, pageHeight: pageHeight, completionHandler: { success in
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
    
    func removeAnnotation(forCPDFViewTag tag : Int, pageIndex: Int, annotId: String, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        let page = rtcCPDFView?.getPage(UInt(pageIndex))
        let pageUtil = RCTCPDFPageUtil(page: page)
        pageUtil.pageIndex = pageIndex
        
        pageUtil.removeAnnotation(uuid: annotId)
        
        rtcCPDFView?.pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
        
        completionHandler(true)
    }
    
    func removeWidget(forCPDFViewTag tag : Int, pageIndex: Int, widgetId: String, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        let page = rtcCPDFView?.getPage(UInt(pageIndex))
        let pageUtil = RCTCPDFPageUtil(page: page)
        pageUtil.pageIndex = pageIndex
        
        pageUtil.removeWidget(uuid: widgetId)
        
        rtcCPDFView?.pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
        
        completionHandler(true)
    }
    
    // MARK: - Annotation Methods
    
    func setAnnotationMode(forCPDFViewTag tag : Int, mode: String) {
        let rtcCPDFView = cpdfViews[tag]
        
        var annotationMode: CPDFViewAnnotationMode = .CPDFViewAnnotationModenone
        switch mode {
        case "note":
            annotationMode = .note
        case "highlight":
            annotationMode = .highlight
        case "underline":
            annotationMode = .underline
        case "strikeout":
            annotationMode = .strikeout
        case "squiggly":
            annotationMode = .squiggly
        case "ink":
            annotationMode = .ink
        case "ink_eraser":
            annotationMode = .eraser
        case "pencil":
            annotationMode = .pencilDrawing
        case "circle":
            annotationMode = .circle
        case "square":
            annotationMode = .square
        case "arrow":
            annotationMode = .arrow
        case "line":
            annotationMode = .line
        case "freetext":
            annotationMode = .freeText
        case "signature":
            annotationMode = .signature
        case "stamp":
            annotationMode = .stamp
        case "pictures":
            annotationMode = .image
        case "link":
            annotationMode = .link
        case "sound":
            annotationMode = .sound
        case "unknown":
            annotationMode = .CPDFViewAnnotationModenone
        default:
            break
        }
        
        rtcCPDFView?.pdfViewController?.annotationBar?.annotationToolBarSwitch(annotationMode)
    }
    
    func getAnnotationMode(forCPDFViewTag tag : Int, completionHandler: @escaping (String) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        
        let annotationMode = rtcCPDFView?.pdfViewController?.pdfListView?.annotationMode ?? .CPDFViewAnnotationModenone
        var mode = "unknown"
        switch annotationMode {
        case .note:
            mode = "note"
        case .highlight:
            mode = "highlight"
        case .underline:
            mode = "underline"
        case .strikeout:
            mode = "strikeout"
        case .squiggly:
            mode = "squiggly"
        case .ink:
            mode = "ink"
        case .eraser:
            mode = "ink_eraser"
        case .pencilDrawing:
            mode = "pencil"
        case .circle:
            mode = "circle"
        case .square:
            mode = "square"
        case .arrow:
            mode = "arrow"
        case .line:
            mode = "line"
        case .freeText:
            mode = "freetext"
        case .signature:
            mode = "signature"
        case .stamp:
            mode = "stamp"
        case .image:
            mode = "pictures"
        case .link:
            mode = "link"
        case .sound:
            mode = "sound"
        case .CPDFViewAnnotationModenone:
            mode = "unknown"
        default:
            break
        }
        completionHandler(mode)
    }
    
    func annotationCanUndo(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        let canUndo = rtcCPDFView?.pdfViewController?.pdfListView?.canUndo() ?? false
        completionHandler(canUndo)
    }
    
    func annotationCanRedo(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        let canRedo:Bool = rtcCPDFView?.pdfViewController?.pdfListView?.canRedo() ?? false
        completionHandler(canRedo)
    }
    
    func annotationUndo(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.pdfViewController?.pdfListView?.undoPDFManager?.undo()
    }
    
    func annotationRedo(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.pdfViewController?.pdfListView?.undoPDFManager?.redo()
    }
    
    func setFormCreationMode(forCPDFViewTag tag : Int, mode: String) {
        let rtcCPDFView = cpdfViews[tag]
        
        var annotationMode: CPDFViewAnnotationMode = .CPDFViewAnnotationModenone
        switch mode {
        case "textField":
            annotationMode = .formModeText
        case "checkBox":
            annotationMode = .formModeCheckBox
        case "radioButton":
            annotationMode = .formModeRadioButton
        case "comboBox":
            annotationMode = .formModeCombox
        case "listBox":
            annotationMode = .formModeList
        case "pushButton":
            annotationMode = .formModeButton
        case "signaturesFields":
            annotationMode = .formModeSign
        case "unknown":
            annotationMode = .CPDFViewAnnotationModenone
        default:
            annotationMode = .CPDFViewAnnotationModenone
        }
        rtcCPDFView?.pdfViewController?.formBar?.formToolBarSwitch(annotationMode)
        if annotationMode == .CPDFViewAnnotationModenone {
            rtcCPDFView?.pdfViewController?.pdfListView?.scrollEnabled = true
        }
    }
    
    func getFormCreationMode(forCPDFViewTag tag : Int, completionHandler: @escaping (String) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        
        let annotationMode = rtcCPDFView?.pdfViewController?.pdfListView?.annotationMode ?? .CPDFViewAnnotationModenone
        var mode = "unknown"
        switch annotationMode {
        case .formModeText:
            mode = "textField"
        case .formModeCheckBox:
            mode = "checkBox"
        case .formModeRadioButton:
            mode = "radioButton"
        case .formModeCombox:
            mode = "comboBox"
        case .formModeList:
            mode = "listBox"
        case .formModeButton:
            mode = "pushButton"
        case .formModeSign:
            mode = "signaturesFields"
        case .CPDFViewAnnotationModenone:
            mode = "unknown"
            default:
            break
        }
        completionHandler(mode)
    }
    
    func verifyDigitalSignatureStatus(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.pdfViewController?.verifySignature()
    }
    
    func hideDigitalSignStatusView(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.pdfViewController?.hideVerifySignatureView()
    }
    
    func clearDisplayRect(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.pdfViewController?.pdfListView?.removeAllSquareAreas()
    }
    
    func dismissContextMenu(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.pdfViewController?.pdfListView?.becomeFirstResponder()
    }
    
    func showSearchTextView(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.pdfViewController?.buttonItemClicked_Search(nil)
    }

    func hideSearchTextView(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.pdfViewController?.buttonItemClicked_searchBack(nil)
    }
    
    func saveCurrentInk(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.pdfViewController?.annotationBar?.inkCommitDrawing()
    }
    
    func saveCurrentPencil(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.pdfViewController?.annotationBar?.inkCommitDrawing()
    }
    
    func changeEditType(forCPDFViewTag tag : Int, withEditTypes types: [Int]) {
        let rtcCPDFView = cpdfViews[tag]
        var editTypes: CEditingLoadType = []
        for type in types {
            if type == 0 {
                editTypes = []
            } else if type == 1 {
                editTypes.insert(.text)
            } else if type == 2 {
                editTypes.insert(.image)
            } else if type == 4 {
                editTypes.insert(.path)
            }
        }
        rtcCPDFView?.pdfViewController?.changeEditModeType(editTypes)
    }
    
    func editorCanUndo(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        let canUndo = rtcCPDFView?.pdfViewController?.pdfListView?.canEditTextUndo() ?? false
        completionHandler(canUndo)
    }
    
    func editorCanRedo(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        let canRedo = rtcCPDFView?.pdfViewController?.pdfListView?.canEditTextRedo() ?? false
        
        completionHandler(canRedo)
    }
     
    func editorUndo(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.pdfViewController?.pdfListView?.editTextUndo()
    }
    
    func editorRedo(forCPDFViewTag tag : Int) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.pdfViewController?.pdfListView?.editTextRedo()
    }
    
    func searchText(forCPDFViewTag tag : Int, text: String, searchOption: Int, completionHandler: @escaping ([[String: Any]]) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
        let searchResults = CPDFSearchUtil.searchText(from: pdfListView?.document, keywords: text, options:  CPDFSearchOptions(rawValue: searchOption))
        completionHandler(searchResults)
    }
    
    func selection(forCPDFViewTag tag : Int, dictionary: NSDictionary, completionHandler: @escaping (Bool) -> Void){
        let rtcCPDFView = cpdfViews[tag]
        let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
        let selection = CPDFSearchUtil.selection(from: pdfListView?.document, info: dictionary)
        if let selection = selection {
            pdfListView?.go(to: selection.bounds, on: selection.page, offsetY: CGFloat(88), animated: false)
            pdfListView?.setHighlightedSelection(selection, animated: true)
            completionHandler(true)
        }else {
            completionHandler(false)
        }
    }
    
    func clearSearch(forCPDFViewTag tag : Int, completionHandler: @escaping (Bool) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        rtcCPDFView?.pdfViewController?.pdfListView?.setHighlightedSelection(nil, animated: false)
    }
    
    func getSearchText(forCPDFViewTag tag : Int, pageIndex: Int, location: Int, length: Int, completionHandler: @escaping (String) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
        let text = CPDFSearchUtil.getSearchText(from: pdfListView?.document, pageIndex: pageIndex, location: location, length: length)
        completionHandler(text ?? "")
    }
    
    func getPageSize(forCPDFViewTag tag : Int, pageIndex: Int, completionHandler: @escaping (NSDictionary) -> Void) {
        guard let rtcCPDFView = cpdfViews[tag],
              let pdfListView = rtcCPDFView.pdfViewController?.pdfListView,
              let document = pdfListView.document else {
            completionHandler([:])
            return
        }
        
        guard let page = document.page(at: UInt(pageIndex)) else {
            completionHandler([:])
            return
        }
        
        let size = page.bounds(for: .mediaBox).size
        let pageSize: [String: CGFloat] = [
            "width": size.width,
            "height": size.height
        ]
        
        completionHandler(pageSize as NSDictionary)
    }
    
    func renderPage(forCPDFViewTag tag : Int, pageIndex: Int, width: Int, height: Int,backgroundColor: String, drawAnnot: Bool, drawForm: Bool, pageCompression: String, completionHandler: @escaping (String?) -> Void) {
        let rtcCPDFView = cpdfViews[tag]
        let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
        let document = pdfListView?.document;
        guard let page = document?.page(at: UInt(pageIndex)) else {
            completionHandler(nil)
            return
        }
        
        DispatchQueue.global(qos: .userInitiated).async {
            let thumbnailSize = CGSize(width: width, height: height)
            page.thumbnail(of: thumbnailSize, needReset: true) { image in
                DispatchQueue.main.async {
                    if(image == nil) {
                        completionHandler(nil)
                        return;
                    }
                    var data: Data
                    switch(pageCompression) {
                    case "png":
                        data = image!.pngData()!
                    case "jpeg":
                        data = image!.jpegData(compressionQuality: 0.85)!
                    default:
                        data = image!.pngData()!
                    }
                    
                    completionHandler(data.base64EncodedString())
                }
            }
        }
    }
  
  func getPageRotation(forCPDFViewTag tag : Int, pageIndex: Int, completionHandler: @escaping (NSNumber) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    rtcCPDFView?.getPageRotation(pageIndex: pageIndex, completionHandler: completionHandler)
  }
  
  func setPageRotation(forCPDFViewTag tag : Int, pageIndex: Int, rotation: Int, completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    rtcCPDFView?.setPageRotation(pageIndex: pageIndex, rotation: rotation, completionHandler: completionHandler)
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
    
    func onPageEditDialogBackPress(_ cpdfView: RCTCPDFView) {
        if let onChange = cpdfView.onChange {
            onChange(["onPageEditDialogBackPress": "onPageEditDialogBackPress"])
        }
    }
    
    func onFullScreenChanged(_ cpdfView: RCTCPDFView, isFull: Bool) {
        if let onChange = cpdfView.onChange {
            onChange(["onFullScreenChanged": isFull])
        }
    }
    
    func onTapMainDocArea(_ cpdfView: RCTCPDFView) {
        if let onChange = cpdfView.onChange {
            onChange(["onTapMainDocArea": "onTapMainDocArea"])
        }
    }
    
    func onDocumentIsReady(_ cpdfView: RCTCPDFView) {
        if let onChange = cpdfView.onChange {
            onChange(["onDocumentIsReady": "onDocumentIsReady"])
        }
    }
    
    func onAnnotationHistoryChanged(_ cpdfView: RCTCPDFView) {
        if let onChange = cpdfView.onChange {
            let historyState: [String: Bool] = [
                "canUndo": cpdfView.pdfViewController?.pdfListView?.canUndo() ?? false,
                "canRedo": cpdfView.pdfViewController?.pdfListView?.canRedo() ?? false
            ]
            let eventBody: [String: Any] = [
                "onAnnotationHistoryChanged": historyState
            ]
            onChange(eventBody)
        }
    }
    
    func onContentEditorHistoryChanged(_ cpdfView: RCTCPDFView, pageIndex: Int) {
        if let onChange = cpdfView.onChange {
            let historyState: [String: Any] = [
                "pageIndex": pageIndex,
                "canUndo": cpdfView.pdfViewController?.pdfListView?.canEditTextUndo() ?? false,
                "canRedo": cpdfView.pdfViewController?.pdfListView?.canEditTextRedo() ?? false
            ]
            let eventBody: [String: Any] = [
                "onContentEditorHistoryChanged": historyState
            ]
            onChange(eventBody)
        }
    }
    
    func onIOSClickBackPressed(_ cpdfView: RCTCPDFView) {
        if let onChange = cpdfView.onChange {
            onChange(["onIOSClickBackPressed": "onIOSClickBackPressed"])
        }
    }
    
}
