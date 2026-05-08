//
//  RCTDocumentManager+PagesAnnotations.swift
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
  // MARK: - Pages Methods
  
  @objc(getAnnotations: withPageIndex: withResolver: withRejecter:)
  func getAnnotations(
    forCPDFViewTag tag : Int,
    pageIndex: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getAnnotations(pageIndex: pageIndex) { annotations in
        resolve(annotations)
      }
    }
  }
  
  @objc(getForms: withPageIndex: withResolver: withRejecter:)
  func getForms(
    forCPDFViewTag tag : Int,
    pageIndex: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getWidgets(pageIndex: pageIndex) { widgets in
        resolve(widgets)
      }
    }
  }
  
  @objc(
    setWidgetIsChecked: withPage: withUuid: withIsChecked: withResolver: withRejecter:
  )
  func setWidgetIsChecked(
    forCPDFViewTag tag : Int,
    page: Int,
    uuid: String,
    isChecked: Bool,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setWidgetIsChecked(pageIndex: page, uuid: uuid, isChecked: isChecked)
      resolve(nil)
    }
  }
  
  @objc(
    setTextWidgetText: withPage: withUuid: withText: withResolver: withRejecter:
  )
  func setTextWidgetText(
    forCPDFViewTag tag : Int,
    page: Int,
    uuid: String,
    text: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setTextWidgetText(pageIndex: page, uuid: uuid, text: text)
      resolve(nil)
    }
  }
  
  @objc(
    addWidgetImageSignature: withPage: withUuid: withImagePath: withResolver: withRejecter:
  )
  func addWidgetImageSignature(
    forCPDFViewTag tag : Int,
    page: Int,
    uuid: String,
    imagePath: URL,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.addWidgetImageSignature(pageIndex: page, uuid: uuid, imagePath: imagePath) { success in
        resolve(success)
      }
    }
  }
  
  @objc(updateAp: withPage: withUuid: withResolver: withRejecter:)
  func updateAp(
    forCPDFViewTag tag : Int,
    page: Int,
    uuid: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.updateAp(pageIndex: page, uuid: uuid)
      resolve(nil)
    }
  }
  
  @objc(reloadPages: withResolver: withRejecter:)
  func reloadPages(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.reloadPages()
      resolve(nil)
    }
  }
  
  @objc(
    removeAnnotation: withPageIndex: withAnnotId: withResolver: withRejecter:
  )
  func removeAnnotation(
    forCPDFViewTag tag : Int,
    pageIndex: Int,
    annotId: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.removeAnnotation(pageIndex: pageIndex, annotId: annotId) { success in
        resolve(success)
      }
    }
  }
  
  @objc(removeWidget: withPageIndex: withWidgetId: withResolver: withRejecter:)
  func removeWidget(
    forCPDFViewTag tag : Int,
    pageIndex: Int,
    widgetId: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.removeWidget(pageIndex: pageIndex, widgetId: widgetId) { success in
        resolve(success)
      }
    }
  }
  
  // MARK: - Annotation Methods
  
  @objc(setAnnotationMode: withMode: withResolver: withRejecter:)
  func setAnnotationMode(
    forCPDFViewTag tag : Int,
    mode: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setAnnotationMode(mode: mode)
      resolve(nil)
    }
  }
  
  @objc(getAnnotationMode: withResolver: withRejecter:)
  func getAnnotationMode(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getAnnotationMode { mode in
        resolve(mode)
      }
    }
  }
  
  @objc(annotationCanRedo: withResolver: withRejecter:)
  func annotationCanRedo(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.annotationCanRedo { canRedo in
        resolve(canRedo)
      }
    }
  }
  
  @objc(annotationCanUndo: withResolver: withRejecter:)
  func annotationCanUndo(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.annotationCanUndo { canUndo in
        resolve(canUndo)
      }
    }
  }
  
  @objc(annotationUndo:withResolver: withRejecter:)
  func annotationUndo(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.annotationUndo()
      resolve(nil)
    }
  }
  
  @objc(annotationRedo: withResolver: withRejecter:)
  func annotationRedo(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.annotationRedo()
      resolve(nil)
    }
  }
  
  @objc(setFormCreationMode: withMode: withResolver: withRejecter:)
  func setFormCreationMode(
    forCPDFViewTag tag : Int,
    mode: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setFormCreationMode(mode: mode)
      resolve(nil)
    }
  }
  
  @objc(getFormCreationMode: withResolver: withRejecter:)
  func getFormCreationMode(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getFormCreationMode { mode in
        resolve(mode)
      }
    }
  }
  
  @objc(verifyDigitalSignatureStatus: withResolver: withRejecter:)
  func verifyDigitalSignatureStatus(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.verifyDigitalSignatureStatus()
      resolve(nil)
    }
  }
  
  @objc(hideDigitalSignStatusView: withResolver: withRejecter:)
  func hideDigitalSignStatusView(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.hideDigitalSignStatusView()
      resolve(nil)
    }
  }
  
  @objc(clearDisplayRect: withResolver: withRejecter:)
  func clearDisplayRect(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.clearDisplayRect()
      resolve(nil)
    }
  }
  
  @objc(dismissContextMenu: withResolver: withRejecter:)
  func dismissContextMenu(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.dismissContextMenu()
      resolve(nil)
    }
  }
  
  @objc(showSearchTextView: withResolver: withRejecter:)
  func showSearchTextView(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.showSearchTextView()
      resolve(nil)
    }
  }
  
  @objc(hideSearchTextView: withResolver: withRejecter:)
  func hideSearchTextView(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.hideSearchTextView()
      resolve(nil)
    }
  }
  
  @objc(saveCurrentInk: withResolver: withRejecter:)
  func saveCurrentInk(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.saveCurrentInk()
      resolve(nil)
    }
  }
  
  @objc(saveCurrentPencil: withResolver: withRejecter:)
  func saveCurrentPencil(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.saveCurrentPencil()
      resolve(nil)
    }
  }
  
  @objc(changeEditType: withEditTypes: withResolver: withRejecter:)
  func changeEditType(
    forCPDFViewTag tag : Int,
    withEditTypes editTypes: [Int],
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.changeEditType(withEditTypes: editTypes)
      resolve(nil)
    }
  }
  
  @objc(editorCanUndo: withResolver: withRejecter:)
  func editorCanUndo(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.editorCanUndo { canUndo in
        resolve(canUndo)
      }
    }
  }
  
  @objc(editorCanRedo: withResolver: withRejecter:)
  func editorCanRedo(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.editorCanRedo { canRedo in
        resolve(canRedo)
      }
    }
  }
  
  @objc(editorUndo: withResolver: withRejecter:)
  func editorUndo(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.editorUndo()
      resolve(nil)
    }
  }
  
  @objc(editorRedo: withResolver: withRejecter:)
  func editorRedo(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.editorRedo()
      resolve(nil)
    }
  }
  
  @objc(searchText: withText: withSearchOption: withResolver: withRejecter:)
  func searchText(
    forCPDFViewTag tag: Int,
    text: String,
    searchOption: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.searchText(text: text, searchOption: searchOption) { results in
        resolve(results)
      }
    }
  }
  
  @objc(selection: range: withResolver: withRejecter:)
  func selection(
    forCPDFViewTag tag: Int,
    range: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFViewSync(tag: tag, reject: reject) { view in
      view.selection(dictionary: range) { results in
        if results {
          resolve(true)
        } else {
          reject("selection_failed", "Failed to select search result", nil)
        }
      }
    }
  }
  
  @objc(clearSearch: withResolver: withRejecter:)
  func clearSearch(
    forCPDFViewTag tag: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.clearSearch { result in
        if result {
          resolve(nil)
        } else {
          reject("clear_search_failed", "Failed to clear search highlight", nil)
        }
      }
    }
  }
  
  @objc(
    getSearchText: withPageIndex: withLocation: withLength: withResolver: withRejecter:
  )
  func getSearchText(
    forCPDFViewTag tag: Int,
    pageIndex: Int,
    location: Int,
    length: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFViewSync(tag: tag, reject: reject) { view in
      view.getSearchText(pageIndex: pageIndex, location: location, length: length) { text in
        resolve(text)
      }
    }
  }
  
  @objc(getPageSize: withPageIndex: withResolver: withRejecter:)
  func getPageSize(
    forCPDFViewTag tag: Int,
    pageIndex: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getPageSize(pageIndex: pageIndex) { size in
        resolve(size)
      }
    }
  }
  
  @objc(
    renderPage: withPageIndex: withWidth: withHeight: withBackgroundColor: withDrawAnnot: withDrawForm: withPageCompression: withResolver: withRejecter:
  )
  func renderPage(
    forCPDFViewTag tag: Int,
    pageIndex: Int,
    width: Int,
    height: Int,
    backgroundColor: String,
    drawAnnot: Bool,
    drawForm: Bool,
    pageCompression: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.renderPage(pageIndex: pageIndex, width: width, height: height, backgroundColor: backgroundColor, drawAnnot: drawAnnot, drawForm: drawForm, pageCompression: pageCompression) { image in
        if let image {
          resolve(image)
        } else {
          print("Failed to render page")
          reject("render_page_failed", "Failed to render page", nil)
        }
      }
    }
  }

  @objc(
    renderAnnotationAppearance: withPageIndex: withUuid: withOptions: withResolver: withRejecter:
  )
  func renderAnnotationAppearance(
    forCPDFViewTag tag: Int,
    pageIndex: Int,
    uuid: String,
    options: [String: Any],
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.renderAnnotationAppearance(pageIndex: pageIndex, uuid: uuid, options: options) { image in
        if let image {
          resolve(image)
        } else {
          reject("render_annotation_appearance_failed", "Failed to render annotation appearance", nil)
        }
      }
    }
  }
  
  @objc(getPageRotation: withPageIndex: withResolver: withRejecter:)
  func getPageRotation(
    forCPDFViewTag tag: Int,
    pageIndex: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getPageRotation(pageIndex: pageIndex) { rotation in
        resolve(rotation)
      }
    }
  }
  
  @objc(
    setPageRotation: withPageIndex: withRotation: withResolver: withRejecter:
  )
  func setPageRotation(
    forCPDFViewTag tag: Int,
    pageIndex: Int,
    rotation: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setPageRotation(pageIndex: pageIndex, rotation: rotation) { success in
        resolve(success)
      }
    }
  }
}
