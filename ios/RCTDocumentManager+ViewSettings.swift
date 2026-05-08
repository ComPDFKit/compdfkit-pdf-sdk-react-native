//
//  RCTDocumentManager.swift
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

extension RCTDocumentManager {
  @objc(save: withResolver: withRejecter:)
  func save(
    tag: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.saveDocument { success in
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
    guard edges.count == 4,
          let left = edges[0] as? Int,
          let top = edges[1] as? Int,
          let right = edges[2] as? Int,
          let bottom = edges[3] as? Int else {
      reject("INVALID_EDGES", "edges must be array of 4 integers", nil)
      return
    }
    
    withCPDFView(tag: tag, reject: reject) { view in
      view.setMargins(left: left, top: top, right: right, bottom: bottom)
      resolve(nil)
    }
  }
  
  @objc(removeAllAnnotations: withResolver: withRejecter:)
  func removeAllAnnotations(
    tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.removeAllAnnotations { success in
        if success {
          resolve(success)
        } else {
          reject(
            "remove_all_annotation_failed",
            "Failed to remove all annotation",
            nil
          );
        }
      }
    } 
  }
  
  @objc(importAnnotations: withXfdfFile: withResolver: withRejecter:)
  func importAnnotations(
    tag : Int,
    xfdfFile : URL,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.importAnnotations(xfdfFile: xfdfFile) { success in
        if success {
          resolve(success)
        } else {
          reject(
            "import_annotation_failed",
            "Failed to import annotation",
            nil
          );
        }
      }
    }
  }
  
  @objc(exportAnnotations: withResolver: withRejecter:)
  func exportAnnotations(
    tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.exportAnnotations { xfdfFilePath in
        resolve(xfdfFilePath)
      }
    }
  }
  
  @objc(
    setDisplayPageIndex: withPageIndex: withRectList: withResolver: withRejecter:
  )
  func setDisplayPageIndex(tag : Int, pageIndex : Int, withRectList rectList: [[String: Any]],resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setDisplayPageIndex(pageIndex: pageIndex, rectList: rectList)
      resolve(nil)
    }
  }
  
  @objc(getCurrentPageIndex: withResolver: withRejecter:)
  func getCurrentPageIndex(
    tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getCurrentPageIndex { pageIndex in
        resolve(pageIndex)
      }
    }
  }
  
  @objc(hasChange: withResolver: withRejecter:)
  func hasChange(
    tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.hasChange { success in
        resolve(success)
      }
    }
  }
  
  @objc(setScale: withScaleValue: withResolver: withRejecter: )
  func setScale(tag : Int, scale : NSNumber, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setScale(scale: scale)
      resolve(nil)
    }
  }
  
  @objc(getScale: withResolver: withRejecter:)
  func getScale(
    tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getScale { scale in
        resolve(scale)
      }
    }
  }
  
  @objc(setBackgroundColor: withBackgroundColor: withResolver: withRejecter:)
  func setBackgroundColor(tag : Int, backgroundColor : String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setBackgroundColor(hexColor: backgroundColor)
      resolve(nil)
    }
  }
  
  @objc(setReadBackgroundColor: withThemes: withResolver: withRejecter:)
  func setReadBackgroundColor(tag : Int, themes : NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void{
    let displayMode = themes["displayMode"] as? NSString ?? "light"
    withCPDFView(tag: tag, reject: reject) { view in
      view.setReadBackgroundColor(displayMode: displayMode)
      resolve(nil)
    }
  }
  
  @objc(getReadBackgroundColor: withResolver: withRejecter:)
  func getReadBackgroundColor(
    tag: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getReadbackgroundColor { color in
        resolve(color)
      }
    }
  }
  
  @objc(
    setFormFieldHighlight: withFormFieldHighlight: withResolver: withRejecter:
  )
  func setFormFieldHighlight(
    tag: Int,
    formFieldHighlight : Bool,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setFormFieldHighlight(formFieldHighlight: formFieldHighlight)
      resolve(nil)
    }
  }
  
  @objc(isFormFieldHighlight: withResolver: withRejecter:)
  func isFormFieldHighlight(
    tag: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.isFormFieldHighlight { highlight in
        resolve(highlight)
      }
    }
  }
  
  @objc(setLinkHighlight: withLinkHighlight: withResolver: withRejecter:)
  func setLinkHighlight(
    tag: Int,
    linkHighlight : Bool,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setLinkHighlight(linkHighlight: linkHighlight)
      resolve(nil)
    }
  }
  
  @objc(isLinkHighlight: withResolver: withRejecter:)
  func isLinkHighlight(
    tag: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.isLinkHighlight { highlight in
        resolve(highlight)
      }
    }
  }
  
  @objc(setVerticalMode: withVerticalMode: withResolver: withRejecter:)
  func setVerticalMode(
    tag : Int,
    isVerticalMode : Bool,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.setVerticalMode(isVerticalMode: isVerticalMode)
      resolve(nil)
    }
  }
  
  @objc(isVerticalMode: withResolver: withRejecter:)
  func isVerticalMode(
    tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.isVerticalMode { isVertical in
        resolve(isVertical)
      }
    }
  }
  
  @objc(setContinueMode: withContiueMode:  withResolver: withRejecter:)
  func setContinueMode(
    forCPDFViewTag tag : Int,
    isContinueMode : Bool,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setContinueMode(isContinueMode: isContinueMode)
      resolve(nil)
    }
  }
  
  @objc(isContinueMode: withResolver: withRejecter:)
  func isContinueMode(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.isContinueMode { isContinue in
        resolve(isContinue)
      }
    }
  }
  
  @objc(setDoublePageMode: withDoublePageMode: withResolver: withRejecter:)
  func setDoublePageMode(
    forCPDFViewTag tag : Int,
    isDoublePageMode : Bool,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setDoublePageMode(isDoublePageMode: isDoublePageMode)
      resolve(nil)
    }
  }
  
  @objc(isDoublePageMode: withResolver: withRejecter:)
  func isDoublePageMode(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.isDoublePageMode { isDoublePageMode in
        resolve(isDoublePageMode)
      }
    }
  }
  
  @objc(setCoverPageMode: withCoverPageMode: withResolver: withRejecter:)
  func setCoverPageMode(
    forCPDFViewTag tag : Int,
    isCoverPageMode : Bool,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setCoverPageMode(isCoverPageMode: isCoverPageMode)
      resolve(nil)
    }
  }
  
  @objc(isCoverPageMode: withResolver: withRejecter:)
  func isCoverPageMode(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.isCoverPageMode { isCoverPageMode in
        resolve(isCoverPageMode)
      }
    }
  }
  
  @objc(setCropMode: withCropMode: withResolver: withRejecter:)
  func setCropMode(
    forCPDFViewTag tag : Int,
    isCropMode : Bool,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setCropMode(isCropMode: isCropMode)
      resolve(nil)
    }
  }
  
  @objc(isCropMode: withResolver: withRejecter:)
  func isCropMode(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.isCropMode { isCropMode in
        resolve(isCropMode)
      }
    }
  }
  
  @objc(setPreviewMode: withViewMode: withResolver: withRejecter:)
  func setPreviewMode(
    forCPDFViewTag tag : Int,
    viewMode : String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setPreviewMode(viewMode: viewMode)
      resolve(nil)
    }
  }
  
  @objc(getPreviewMode: withResolver: withRejecter:)
  func getPreviewMode(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.getPreviewMode { mode in
        resolve(mode)
      }
    }
  }
  
  @objc(showThumbnailView: withEditMode: withResolver: withRejecter:)
  func showThumbnailView(
    forCPDFViewTag tag : Int,
    isEditMode : Bool,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.showThumbnailView(isEditMode: isEditMode)
      resolve(nil)
    }
  }
  
  @objc(showBotaView: withResolver: withRejecter:)
  func showBotaView(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.showBotaView()
      resolve(nil)
    }
  }
  
  @objc(showAddWatermarkView: withConfig: withResolver: withRejecter:)
  func showAddWatermarkView(
    forCPDFViewTag tag : Int,
    config : [String: Any],
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.showAddWatermarkView(config: config)
      resolve(nil)
    }
  }
  
  @objc(showSecurityView:withResolver: withRejecter:)
  func showSecurityView(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.showSecurityView()
      resolve(nil)
    }
  }
  
  @objc(showDisplaySettingView: withResolver: withRejecter:)
  func showDisplaySettingView(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.showDisplaySettingView()
      resolve(nil)
    }
  }
  
  @objc(showDocumentInfoView: withResolver: withRejecter:)
  func showDocumentInfoView(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.showDocumentInfoView()
      resolve(nil)
    }
  }

  @objc(enterSnipMode: withResolver: withRejecter:)
  func enterSnipMode(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.enterSnipMode()
      resolve(nil)
    }
  }
  
  @objc(exitSnipMode: withResolver: withRejecter:)
  func exitSnipMode(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.exitSnipMode()
      resolve(nil)
    }
  }
}
