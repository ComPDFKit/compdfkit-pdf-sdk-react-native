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
  private let viewRegistry = CPDFViewRegistry.shared

  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc override func view() -> UIView! {
    let rtcCPDFView = RCTCPDFView()
    rtcCPDFView.delegate = self
    return rtcCPDFView
  }

  // MARK: - RCTCPDFViewDelegate

  func cpdfViewAttached(_ cpdfView: RCTCPDFView) {
    guard let reactTag = cpdfView.reactTag else { return }
    viewRegistry.register(cpdfView, for: reactTag.intValue)
    print("ComPDFKitRN-iOS RCTCPDFReaderView attached: tag=\(reactTag.intValue), cachedViews=\(viewRegistry.count)")
  }

  func cpdfViewDetached(_ cpdfView: RCTCPDFView) {
    if let reactTag = cpdfView.reactTag {
      viewRegistry.unregister(tag: reactTag.intValue)
    }

    viewRegistry.unregister(view: cpdfView)
    print("ComPDFKitRN-iOS RCTCPDFReaderView detached: cachedViews=\(viewRegistry.count)")
  }

  func saveDocumentChange(_ cpdfView: RCTCPDFView) {
    if let onChange = cpdfView.onChange {
      onChange(["onSaveDocument": "onSaveDocument"])
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

  func onPencilDrawingCompleted(_ cpdfView: RCTCPDFView, payload: [String : Any]) {
    if let onChange = cpdfView.onChange {
      let eventBody: [String: Any] = [
        "pencilDrawingCompleted": payload
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

  func onSearchBackButtonTapped(_ cpdfView: RCTCPDFView, payload: [String : Any]) {
    if let onChange = cpdfView.onChange {
      let eventBody: [String: Any] = [
        "onSearchBackButtonTapped": payload
      ]
      onChange(eventBody)
    }
  }

  func onAnnotationStyleDialogDismissed(_ cpdfView: RCTCPDFView, payload: [String : Any]) {
    if let onChange = cpdfView.onChange {
      let eventBody: [String: Any] = [
        "onAnnotationStyleDialogDismissed": payload
      ]
      onChange(eventBody)
    }
  }

  func onFormStyleDialogDismissed(_ cpdfView: RCTCPDFView, payload: [String : Any]) {
    if let onChange = cpdfView.onChange {
      let eventBody: [String: Any] = [
        "onFormStyleDialogDismissed": payload
      ]
      onChange(eventBody)
    }
  }

  func onContentEditorStyleDialogDismissed(_ cpdfView: RCTCPDFView, payload: [String : Any]) {
    if let onChange = cpdfView.onChange {
      let eventBody: [String: Any] = [
        "onContentEditorStyleDialogDismissed": payload
      ]
      onChange(eventBody)
    }
  }

  func onWatermarkDialogDismissed(_ cpdfView: RCTCPDFView, payload: [String : Any]) {
    if let onChange = cpdfView.onChange {
      let eventBody: [String: Any] = [
        "onAddWatermarkDialogDismissed": payload
      ]
      onChange(eventBody)
    }
  }

  func onInterceptAnnotationDoAction(_ cpdfView: RCTCPDFView, annotation: [String : Any]) {
    if let onChange = cpdfView.onChange {
      let eventBody: [String: Any] = [
        "onInterceptAnnotationAction" : annotation
      ]
      onChange(eventBody)
    }
  }
}
