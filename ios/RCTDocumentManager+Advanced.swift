//
//  RCTDocumentManager+Advanced.swift
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
  // MARK: - Outline Methods
  @objc(getOutlineRoot: withResolver: withRejecter:)
  func getOutlineRoot(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getOutlineRoot { outlineRoot in
        resolve(outlineRoot)
      }
    }
  }

  @objc(newOutlineRoot: withResolver: withRejecter:)
  func newOutlineRoot(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.newOutlineRoot { success in
        resolve(success)
      }
    }
  }

  @objc(addOutline: withParentId: withTitle: withInsertIndex: withPageIndex: withResolver: withRejecter:)
  func addOutline(
    forCPDFViewTag tag : Int,
    parentUuid: String,
    title: String,
    insertIndex: Int,
    pageIndex: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      print("RCTDocumentManager: addOutline: parentUuid:\(parentUuid), title:\(title), insertIndex:\(insertIndex), pageIndex:\(pageIndex)")
      view.addOutline(parentId: parentUuid, title: title, insertIndex: insertIndex, pageIndex: pageIndex) { outlineId in
        resolve(outlineId)
      }
    }
  }

  @objc(removeOutline: withOutlineId: withResolver: withRejecter:)
  func removeOutline(
    forCPDFViewTag tag : Int,
    outlineId: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.removeOutline(outlineId: outlineId) { success in
        resolve(success)
      }
    }
  }

  @objc(updateOutline: withOutlineId: withTitle: withPageIndex: withResolver: withRejecter:)
  func updateOutline(
    forCPDFViewTag tag : Int,
    outlineId: String,
    title: String,
    pageIndex: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.updateOutline(outlineId: outlineId, title: title, pageIndex: pageIndex) { success in
        resolve(success)
      }
    }
  }

  @objc(moveOutline: withOutlineId: withNewParentId: withInsertIndex: withResolver: withRejecter:)
  func moveOutline(
    forCPDFViewTag tag : Int,
    outlineId: String,
    newParentId: String,
    insertIndex: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.moveOutline(outlineId: outlineId, newParentId: newParentId, insertIndex: insertIndex) { success in
        resolve(success)
      }
    }
  }

  // Mark: - Bookmarks Methods
  @objc(getBookmarks: withResolver: withRejecter:)
  func getBookmarks(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getBookmarks { bookmarks in
        resolve(bookmarks)
      }
    }
  }

  @objc(removeBookmark: withPageIndex: withResolver: withRejecter:)
  func removeBookmark(
    forCPDFViewTag tag : Int,
    pageIndex: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.removeBookmark(pageIndex: pageIndex) { success in
        resolve(success)
      }
    }
  }

  @objc(hasBookmark: withPageIndex: withResolver: withRejecter:)
  func hasBookmark(
    forCPDFViewTag tag : Int,
    pageIndex: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.hasBookmark(pageIndex: pageIndex) { hasBookmark in
        resolve(hasBookmark)
      }
    }
  }

  @objc(addBookmark: withTitle: withPageIndex: withResolver: withRejecter:)
  func addBookmark(
    forCPDFViewTag tag : Int,
    title: String,
    pageIndex: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.addBookmark(pageIndex: pageIndex, title: title) { success in
        resolve(success)
      }
    }
  }

  @objc(updateBookmark: withUuid: withTitle: withResolver: withRejecter:)
  func updateBookmark(
    forCPDFViewTag tag : Int,
    uuid: String,
    title: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.updateBookmark(uuid: uuid, title: title) { success in
        resolve(success)
      }
    }
  }

  // MARK: - Annotations, Widgets Attributes Methods
  @objc(fetchDefaultAnnotationStyle: withResolver: withRejecter:)
  func fetchDefaultAnnotationStyle(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      let attr = view.fetchDefaultAnnotationStyle()
      resolve(attr)
    }
  }

  @objc(updateDefaultAnnotationStyle: withAttr: withResolver: withRejecter:)
  func updateDefaultAnnotationStyle(
    forCPDFViewTag tag : Int,
    attr: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.updateDefaultAnnotationStyle(style: attr)
      resolve(nil)
    }
  }

  @objc(fetchDefaultWidgetStyle: withResolver: withRejecter:)
  func fetchDefaultWidgetStyle(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      let attr = view.fetchDefaultWidgetStyle()
      resolve(attr)
    }
  }

  @objc(updateDefaultWidgetStyle: withAttr: withResolver: withRejecter:)
  func updateDefaultWidgetStyle(
    forCPDFViewTag tag : Int,
    attr: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.updateDefaultWidgetStyle(style: attr)
      resolve(nil)
    }
  }

  @objc(removeEditArea: withPageIndex: withEidtingAreaId: withType: withResolver: withRejecter:)
  func removeEditArea(
    forCPDFViewTag tag : Int,
    pageIndex: Int,
    eidtingAreaId: String,
    type: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.removeEditingArea(pageIndex: pageIndex, editingAreaId: eidtingAreaId) { sucess in
        resolve(sucess)
      }
    }
  }

  @objc(updateAnnotation: withAnnotation: withResolver: withRejecter:)
  func updateAnnotation(
    forCPDFViewTag tag : Int,
    annotationMap: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.updateAnnotation(annotationMap: annotationMap)
      resolve(nil)
    }
  }
  
  @objc(updateWidget: withWidget: withResolver: withRejecter:)
  func updateWidget(
    forCPDFViewTag tag : Int,
    widgetMap: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.updateWidget(widgetMap: widgetMap)
      resolve(nil)
    }
  }

  @objc(addAnnotations: withAnnotations: withResolver: withRejecter:)
  func addAnnotations(
    forCPDFViewTag tag : Int,
    annotations: [NSDictionary],
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.addAnnotations(annotations) { success in
        resolve(success)
      }
    }
  }
  
  @objc(addWidgets: withWidgets: withResolver: withRejecter:)
  func addWidgets(
    forCPDFViewTag tag : Int,
    widgets: [NSDictionary],
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.addWidgets(widgets) { success in
        resolve(success)
      }
    }
  }
  
  @objc(setAnnotationsVisible: withVisible: withResolver: withRejecter:)
  func setAnnotationsVisible(
    forCPDFViewTag tag: Int,
    visible: Bool,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.setAnnotationsVisible(visible: visible) { success in
        if success {
          resolve(nil)
        } else {
          reject("set_annotations_visible_failed", "Failed to update annotations visibility", nil)
        }
      }
    }
  }

  @objc(isAnnotationsVisible: withResolver: withRejecter:)
  func isAnnotationsVisible(
    forCPDFViewTag tag: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.isAnnotationsVisible { success in
        resolve(success)
      }
    }
  }

  @objc(showDefaultAnnotationPropertiesView: withType: withResolver: withRejecter:)
  func showDefaultAnnotationPropertiesView(
    forCPDFViewTag tag: Int,
    type: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.showDefaultAnnotationPropertiesView(type: type) { success in
        if success {
          resolve(nil)
        } else {
          reject("show_default_annotation_properties_failed", "Failed to show default annotation properties view", nil)
        }
      }
    }
  }

  @objc(showAnnotationPropertiesView: withAnnotation: withResolver: withRejecter:)
  func showAnnotationPropertiesView(
    forCPDFViewTag tag: Int,
    annotation: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.showAnnotationPropertiesView(annotation: annotation) { success in
        if success {
          resolve(nil)
        } else {
          reject("show_annotation_properties_failed", "Failed to show annotation properties view", nil)
        }
      }
    }
  }

  @objc(showWidgetPropertiesView: withWidget: withResolver: withRejecter:)
  func showWidgetPropertiesView(
    forCPDFViewTag tag: Int,
    widget: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.showWidgetPropertiesView(widget: widget) { success in
        if success {
          resolve(nil)
        } else {
          reject("show_widget_properties_failed", "Failed to show widget properties view", nil)
        }
      }
    }
  }

  @objc(showEditAreaPropertiesView: withEditArea: withResolver: withRejecter:)
  func showEditAreaPropertiesView(
    forCPDFViewTag tag: Int,
    editArea: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.showEditAreaPropertiesView(editArea: editArea) { success in
        if success {
          resolve(nil)
        } else {
          reject("show_edit_area_properties_failed", "Failed to show edit area properties view", nil)
        }
      }
    }
  }

  @objc(prepareNextSignature: withSignaturePath: withResolver: withRejecter:)
  func prepareNextSignature(
    forCPDFViewTag tag: Int,
    signaturePath: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.prepareNextSignature(signaturePath: signaturePath) { success in
        if success {
          resolve(nil)
        } else {
          reject("prepare_next_signature_failed", "Failed to prepare next signature", nil)
        }
      }
    }
  }
  
  @objc(prepareNextStamp: withDict: withResolver: withRejecter:)
  func prepareNextStamp(
    forCPDFViewTag tag: Int,
    dict: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.prepareNextStamp(dict: dict) { success in
        if success {
          resolve(nil)
        } else {
          reject("prepare_next_stamp_failed", "Failed to prepare next stamp", nil)
        }
      }
    }
  }
  
  @objc(prepareNextImage: withImage: withResolver: withRejecter:)
  func prepareNextImage(
    forCPDFViewTag tag: Int,
    image: URL,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.prepareNextImage(image: image) { success in
        if success {
          resolve(nil)
        } else {
          reject("prepare_next_image_failed", "Failed to prepare next image", nil)
        }
      }
    }
  }
}
