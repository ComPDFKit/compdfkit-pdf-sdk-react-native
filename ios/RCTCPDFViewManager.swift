//
//  RCTCPDFViewManager.swift
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
  
  func insertImagePage(forCPDFViewTag tag : Int, pageIndex: Int, imagePath: URL, pageWidth : Float, pageHeight: Float, completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    rtcCPDFView?.insertImagePage(pageIndex: pageIndex, imagePath: imagePath, pageWidth: pageWidth, pageHeight: pageHeight, completionHandler: { success in
      completionHandler(success)
    })
  }
  
  func removePages(forCPDFViewTag tag : Int, indexes: [Int], completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    rtcCPDFView?.removePages(indexes: indexes, completionHandler: { success in
      completionHandler(success)
    })
  }
  
  func movePage(forCPDFViewTag tag : Int, fromIndex: Int, toIndex: Int, completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    rtcCPDFView?.movePage(fromIndex: fromIndex, toIndex: toIndex, completionHandler: { success in
      completionHandler(success)
    })
  }
  
  func getInfo(forCPDFViewTag tag : Int, completionHandler: @escaping (Dictionary<String, Any>) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let info = CPDFDocumentInfoUtil.getDocumentInfo(from: rtcCPDFView?.pdfViewController?.pdfListView?.document)
    completionHandler(info)
  }
  
  func getMajorVersion(forCPDFViewTag tag : Int, completionHandler: @escaping (Int) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    if let document = rtcCPDFView?.pdfViewController?.pdfListView?.document {
      let majorVersion = document.majorVersion
      completionHandler(Int(majorVersion))
    } else {
      completionHandler(0)
    }
  }
  
  func getMinorVersion(forCPDFViewTag tag : Int, completionHandler: @escaping (Int) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    if let document = rtcCPDFView?.pdfViewController?.pdfListView?.document {
      let minorVersion = document.minorVersion
      completionHandler(Int(minorVersion))
    } else {
      completionHandler(0)
    }
  }
  
  func getPermissionsInfo(forCPDFViewTag tag : Int, completionHandler: @escaping (Dictionary<String, Any>) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let permissionsInfo = CPDFDocumentInfoUtil.getPermissionsInfo(document: rtcCPDFView?.pdfViewController?.pdfListView?.document)
    completionHandler(permissionsInfo)
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
    
    rtcCPDFView?.pdfViewController?.pdfListView?.updateActiveAnnotations([])
    rtcCPDFView?.pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
    
    completionHandler(true)
  }
  
  func removeWidget(forCPDFViewTag tag : Int, pageIndex: Int, widgetId: String, completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let page = rtcCPDFView?.getPage(UInt(pageIndex))
    let pageUtil = RCTCPDFPageUtil(page: page)
    pageUtil.pageIndex = pageIndex
    
    pageUtil.removeWidget(uuid: widgetId)
    
    rtcCPDFView?.pdfViewController?.pdfListView?.updateActiveAnnotations([])
    rtcCPDFView?.pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
    rtcCPDFView?.pdfViewController?.pdfListView?.updateFormScrollEnabled()
    completionHandler(true)
  }
  
  func removeEditingArea(forCPDFViewTag tag : Int, pageIndex: Int, editingAreaId: String, completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let page = rtcCPDFView?.getPage(UInt(pageIndex))
    let pageUtil = RCTCPDFPageUtil(page: page)
    pageUtil.pageIndex = pageIndex
    pageUtil.pdfView = rtcCPDFView?.pdfViewController?.pdfListView
    
    let editArea = pageUtil.getEidtArea(editUUID: editingAreaId) ?? CPDFEditArea()
    
    rtcCPDFView?.pdfViewController?.pdfListView?.remove(with: editArea)
    
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

  // MARK: - Outline Methods
  func getOutlineRoot(forCPDFViewTag tag : Int, completionHandler: @escaping (Dictionary<String, Any>?) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let outlineRoot = CPDFOutlineUtil.getOutline(pdfListView?.document)
    completionHandler(outlineRoot)
  }

  func newOutlineRoot(forCPDFViewTag tag : Int, completionHandler: @escaping (Dictionary<String, Any>?) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let outlineRoot = CPDFOutlineUtil.newOutlineRoot(document: pdfListView?.document)
    completionHandler(outlineRoot)
  }

  func addOutline(forCPDFViewTag tag : Int, parentId: String, title: String, insertIndex: Int, pageIndex: Int, completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let result = CPDFOutlineUtil.addOutline(document: pdfListView?.document, parentUuid: parentId, insertIndex: insertIndex, title:title, pageIndex: pageIndex)
    completionHandler(result)
  }

  func removeOutline(forCPDFViewTag tag : Int, outlineId: String, completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let success = CPDFOutlineUtil.removeOutline(document: pdfListView?.document, uuid: outlineId)
    completionHandler(success)
  }

  func updateOutline(forCPDFViewTag tag : Int, outlineId: String, title: String, pageIndex: Int, completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let success = CPDFOutlineUtil.updateOutline(document: pdfListView?.document, uuid: outlineId, title: title, pageIndex: pageIndex)
    completionHandler(success)
  }

  func moveOutline(forCPDFViewTag tag : Int, outlineId: String, newParentId: String, insertIndex: Int, completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let success = CPDFOutlineUtil.moveToOutline(document: pdfListView?.document, newParentUUid: newParentId, uuid: outlineId, insertIndex: insertIndex)
    completionHandler(success)
  }
  
  // MARK: - Bookmark Methods
  
  func getBookmarks(forCPDFViewTag tag : Int, completionHandler: @escaping ([Dictionary<String, Any>]) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let bookmarks = CPDFBookmarkUtil.getBookmarks(document: pdfListView?.document)
    completionHandler(bookmarks)
  }
  
  func removeBookmark(forCPDFViewTag tag : Int, pageIndex: Int, completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let removeResult = pdfListView?.document.removeBookmark(forPageIndex: UInt(pageIndex)) ?? false
    pdfListView?.setNeedsDisplayForVisiblePages()
    completionHandler(removeResult)
  }

  func hasBookmark(forCPDFViewTag tag : Int, pageIndex: Int, completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let bookmarks = pdfListView?.document?.bookmarks() ?? []
    let hasBookmark = bookmarks.contains { $0.pageIndex == UInt(pageIndex) }
    completionHandler(hasBookmark)
  }

  func addBookmark(forCPDFViewTag tag : Int, pageIndex: Int, title: String, completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let addBookmarkResult = pdfListView?.document?.addBookmark(title, forPageIndex: UInt(pageIndex))
    pdfListView?.setNeedsDisplayForVisiblePages()
    completionHandler(addBookmarkResult ?? false)
  }

  func updateBookmark(forCPDFViewTag tag : Int, uuid: String, title: String, completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let success = CPDFBookmarkUtil.updateBookmark(document: pdfListView?.document, uuid: uuid, title: title)
    completionHandler(success)
  }

  // MARK: - Attributes Methods
  func fetchDefaultAnnotationStyle(forCPDFViewTag tag : Int) -> Dictionary<String, Any>   {

    return CPDFAnnotAttrUtil.getDefaultAnnotAttributes()
  }

  func updateDefaultAnnotationStyle(forCPDFViewTag tag : Int, style: NSDictionary) {
    let type = style["type"] as? String ?? ""
    CPDFAnnotAttrUtil.setAnnotDefaultAttr(type: type, attrDict: style as! Dictionary<String, Any>)
    let rtcCPDFView = cpdfViews[tag]
    rtcCPDFView?.pdfViewController?.annotationBar?.reloadAnnotationButtons()
  }

  func fetchDefaultWidgetStyle(forCPDFViewTag tag : Int) -> Dictionary<String, Any> {
    return CPDFAnnotAttrUtil.getDefaultWidgetAttributes()
  }

  func updateDefaultWidgetStyle(forCPDFViewTag tag : Int, style: NSDictionary) {
    let type = style["type"] as? String ?? ""
    CPDFAnnotAttrUtil.setWidgetDefaultAttr(type: type, attrDict: style as! Dictionary<String, Any>)
  }
  
  func updateAnnotation(forCPDFViewTag tag : Int, annotationMap: NSDictionary)  {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let pageIndex = annotationMap["page"] as? Int ?? 0
    let uuid = annotationMap["uuid"] as? String ?? ""
    
    let page = pdfListView?.document?.page(at: UInt(pageIndex))
    let pageUtil = RCTCPDFPageUtil(page: page)
    pageUtil.pageIndex = pageIndex
    pageUtil.updateAnnotation(pageIndex: pageIndex, uuid: uuid, properties: annotationMap as! [String : Any])
    pdfListView?.setNeedsDisplayForVisiblePages()
  }
  
  func updateWidget(forCPDFViewTag tag : Int, widgetMap: NSDictionary) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let pageIndex = widgetMap["page"] as? Int ?? 0
    let uuid = widgetMap["uuid"] as? String ?? ""
    
    let page = pdfListView?.document?.page(at: UInt(pageIndex))
    let pageUtil = RCTCPDFPageUtil(page: page)
    pageUtil.pageIndex = pageIndex
    pageUtil.updateWidget(pageIndex: pageIndex, uuid: uuid, properties: widgetMap as! [String : Any])
    pdfListView?.setNeedsDisplayForVisiblePages()

  }

  func addAnnotations(forCPDFViewTag tag : Int, annotations: [NSDictionary], completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let result = RCTCPDFPageUtil.addAnnotations(document: pdfListView!.document, annotations: annotations as! [Dictionary<String, Any>])
    pdfListView?.setNeedsDisplayForVisiblePages()
    completionHandler(result)
  }
  
  func addWidgets(forCPDFViewTag tag : Int, widgets: [NSDictionary], completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let result = RCTCPDFPageUtil.addWidgets(document: pdfListView!.document, widgets: widgets as! [Dictionary<String, Any>])
    pdfListView?.setNeedsDisplayForVisiblePages()
    completionHandler(result)
  }
  
  func setAnnotationsVisible(forCPDFViewTag tag: Int,visible: Bool,completionHandler: @escaping (Bool) -> Void) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    pdfListView?.drawAnnotationEnabled = visible
    pdfListView?.layoutDocumentView()
  }
  
  func isAnnotationsVisible(
    forCPDFViewTag tag: Int,
    completionHandler: @escaping (Bool) -> Void
  ) {
    let rtcCPDFView = cpdfViews[tag]
    let pdfListView = rtcCPDFView?.pdfViewController?.pdfListView;
    let visable = pdfListView?.drawAnnotationEnabled ?? true
    completionHandler(visable)
  }
  
  func showDefaultAnnotationPropertiesView(
    forCPDFViewTag tag: Int,
    type: String,
    completionHandler: @escaping (Bool) -> Void
  ) {
    let annotationMode = self.getAnnotationMode(mode: type)
    let rtcCPDFView = cpdfViews[tag]
    rtcCPDFView?.pdfViewController?.pdfListView?.setAnnotationMode(annotationMode)
    rtcCPDFView?.pdfViewController?.annotationBar?.buttonItemClicked_openModel(UIButton(frame: .zero))
  }
  
  func showAnnotationPropertiesView(
    forCPDFViewTag tag: Int,
    annotation: NSDictionary,
    completionHandler: @escaping (Bool) -> Void
  ) {
    let pageIndex = annotation["page"] as? Int ?? 0
    let uuid = annotation["uuid"] as? String ?? ""
    let rtcCPDFView = cpdfViews[tag]
    let page = rtcCPDFView?.pdfViewController?.pdfListView?.document?.page(at: UInt(pageIndex))
    let pageUtil = RCTCPDFPageUtil(page: page)
    let annotation = pageUtil.getAnnotation(formUUID: uuid) ?? CPDFAnnotation()
    
    rtcCPDFView?.pdfViewController?.annotationBar?.openAnnotationProperties([annotation])
    completionHandler(true)
  }
  
  func showWidgetPropertiesView(
    forCPDFViewTag tag: Int,
    widget: NSDictionary,
    completionHandler: @escaping (Bool) -> Void
  ) {
    let pageIndex = widget["page"] as? Int ?? 0
    let uuid = widget["uuid"] as? String ?? ""
    let rtcCPDFView = cpdfViews[tag]
    let page = rtcCPDFView?.pdfViewController?.pdfListView?.document?.page(at: UInt(pageIndex))
    let pageUtil = RCTCPDFPageUtil(page: page)
    
    let form = pageUtil.getForm(formUUID: uuid) ?? CPDFWidgetAnnotation()
    rtcCPDFView?.pdfViewController?.formBar?.openFormProperties(form)
    completionHandler(true)
  }
  
  func showEditAreaPropertiesView(
    forCPDFViewTag tag: Int,
    editArea: NSDictionary,
    completionHandler: @escaping (Bool) -> Void
  ) {
    let pageIndex = editArea["page"] as? Int ?? 0
    let uuid = editArea["uuid"] as? String ?? ""
    let rtcCPDFView = cpdfViews[tag]
    let page = rtcCPDFView?.pdfViewController?.pdfListView?.document?.page(at: UInt(pageIndex))
    let pageUtil = RCTCPDFPageUtil(page: page)
    pageUtil.pdfView = rtcCPDFView?.pdfViewController?.pdfListView
    
    let editArea = pageUtil.getEidtArea(editUUID: uuid) ?? CPDFEditArea()
    rtcCPDFView?.pdfViewController?.openEditPropertiesForAera(editArea)
    completionHandler(true)
  }
  
  func prepareNextSignature(
    forCPDFViewTag tag: Int,
    signaturePath: String,
    completionHandler: @escaping (Bool) -> Void
  ) {
    let rtcCPDFView = cpdfViews[tag]
    if let image = UIImage(contentsOfFile: signaturePath) {
        let annotation = CPDFSignatureAnnotation(document: rtcCPDFView?.pdfViewController?.pdfListView?.document)
        if(annotation != nil) {
            annotation?.setImage(image)
          rtcCPDFView?.pdfViewController?.pdfListView?.addAnnotation = annotation
        }
    }
  }
  
  func prepareNextStamp(
    forCPDFViewTag tag: Int,
    dict: NSDictionary,
    completionHandler: @escaping (Bool) -> Void
  ) {
    let rtcCPDFView = cpdfViews[tag]
    
    let type = dict["type"] as? String ?? "standard"
    if type == "image" {
        let imagePath = dict["imagePath"] as? String ?? ""
        if let image = UIImage(contentsOfFile: imagePath) {
            let annotation = CPDFStampAnnotation(document: rtcCPDFView?.pdfViewController?.pdfListView?.document, image: image)
            if(annotation != nil) {
              rtcCPDFView?.pdfViewController?.pdfListView?.addAnnotation = annotation
            }
        }
    } else if type == "standard" {
        let stampType = dict["standardStamp"] as? String ?? "Approved"
        let index = CPDFEnumConvertUtil.stringToStandardStamp(stampType)
        let annotation = CPDFStampAnnotation(document: rtcCPDFView?.pdfViewController?.pdfListView?.document, type: index)
        rtcCPDFView?.pdfViewController?.pdfListView?.addAnnotation = annotation
    } else if type == "text" {
        let textStampDict = dict["textStamp"] as? NSDictionary ?? NSDictionary()
        let stampText = textStampDict["content"] as? String ?? ""
        let detailText = textStampDict["date"] as? String ?? ""
        let stampStyleSting = textStampDict["color"] as? String ?? "red"
        let stampShapeSting = textStampDict["shape"] as? String ?? "rect"
        let stampStyle = CPDFEnumConvertUtil.stringToStampStyle(stampStyleSting)
        let stampShape = CPDFEnumConvertUtil.stringToStampShape(stampShapeSting)
        let annotation = CPDFStampAnnotation(document:rtcCPDFView?.pdfViewController?.pdfListView?.document, text: stampText, detailText: detailText, style: stampStyle, shape: stampShape)
        rtcCPDFView?.pdfViewController?.pdfListView?.addAnnotation = annotation
    }
  }
  
  func prepareNextImage(
    forCPDFViewTag tag: Int,
    image: URL,
    completionHandler: @escaping (Bool) -> Void
  ) {
    let rtcCPDFView = cpdfViews[tag]
    if let image = UIImage(contentsOfFile: image.path) {
        let annotation = CPDFStampAnnotation(document: rtcCPDFView?.pdfViewController?.pdfListView?.document, image: image)
        if(annotation != nil) {
          rtcCPDFView?.pdfViewController?.pdfListView?.addAnnotation = annotation
        }
    }

  }
  
  // MARK: - Privte Method
  
  func getAnnotationMode(mode: String) -> CPDFViewAnnotationMode {
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
      
      return annotationMode
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
  
  func onAnnotationAddChanged(_ cpdfView: RCTCPDFView, annotationData: [String : Any]) {
    if let onChange = cpdfView.onChange {
      let eventBody: [String: Any] = [
        "annotationsCreated": annotationData
      ]
      onChange(eventBody)
    }
  }
  
  func onFormFieldAddChanged(_ cpdfView: RCTCPDFView, formData: [String : Any]) {
    if let onChange = cpdfView.onChange {
      let eventBody: [String: Any] = [
        "formFieldsCreated": formData
      ]
      onChange(eventBody)
    }
  }
  
  func onAnnotationSelectedChanged(_ cpdfView: RCTCPDFView, annotationData: [String : Any], isSelected: Bool) {
    if let onChange = cpdfView.onChange {
      if isSelected {
        let eventBody: [String: Any] = [
          "annotationsSelected": annotationData
        ]
        onChange(eventBody)
      } else {
        let eventBody: [String: Any] = [
          "annotationsDeselected": annotationData
        ]
        onChange(eventBody)
      }
    }
  }
  
  func onFormFieldSelectedChanged(_ cpdfView: RCTCPDFView, formData: [String : Any], isSelected: Bool) {
    if let onChange = cpdfView.onChange {
      if isSelected {
        let eventBody: [String: Any] = [
          "formFieldsSelected": formData
        ]
        onChange(eventBody)
      } else {
        let eventBody: [String: Any] = [
          "formFieldsDeselected": formData
        ]
        onChange(eventBody)
      }
    }
  }
  
  func onEditingAreaAddChanged(_ cpdfView: RCTCPDFView, editingAreaData: [String : Any]) {
    
  }
  
  func onEditingAreaSelectedChanged(_ cpdfView: RCTCPDFView, editingAreaData: [String : Any], isSelected: Bool) {
    if let onChange = cpdfView.onChange {
      if isSelected {
        let eventBody: [String: Any] = [
          "editorSelectionSelected": editingAreaData
        ]
        onChange(eventBody)
      } else {
        let eventBody: [String: Any] = [
          "editorSelectionDeselected": editingAreaData
        ]
        onChange(eventBody)
      }
    }
  }
  
  func onAutoShowAnnotationChanged(_ cpdfView: RCTCPDFView, annotationData: [String : Any]) {
    if let onChange = cpdfView.onChange {
      let eventBody: [String: Any] = [
        "onAnnotationCreationPrepared": annotationData
      ]
      onChange(eventBody)
    }
  }
  
  func onAutoShowFormPickerChanged(_ cpdfView: RCTCPDFView, formData: [String : Any]) {
    
  }
  
  func onCustomMenuActionChanged(_ cpdfView: RCTCPDFView, payload: [String : Any]) {
    if let onChange = cpdfView.onChange {
      let eventBody: [String: Any] = [
        "onCustomContextMenuItemTapped": payload
      ]
      onChange(eventBody)
    }
  }
  
  func onCustomToolbarActionChanged(_ cpdfView: RCTCPDFView, payload: [String : Any]) {
    if let onChange = cpdfView.onChange {
      let identifier = payload["identifier"] as? String ?? ""
      let eventBody: [String: Any] = [
        "onCustomToolbarItemTapped": identifier
      ]
      onChange(eventBody)
    }
  }
}
