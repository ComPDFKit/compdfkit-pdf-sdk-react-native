//
//  RCTCPDFView+BridgeCompat.swift
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

extension RCTCPDFView {
  private func identityValue(_ identity: [String: Any]?, _ key: String) -> String? {
    return identity?[key] as? String
  }

  func getAnnotations(pageIndex: Int, completionHandler: @escaping ([[String: Any]]) -> Void) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    completionHandler(pageUtil.getAnnotations())
  }

  func getWidgets(pageIndex: Int, completionHandler: @escaping ([[String: Any]]) -> Void) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    completionHandler(pageUtil.getForms())
  }

  func setWidgetIsChecked(pageIndex: Int, uuid: String, isChecked: Bool) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    pageUtil.setWidgetIsChecked(uuid: uuid, isChecked: isChecked)
  }

  func setTextWidgetText(pageIndex: Int, uuid: String, text: String) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    pageUtil.setTextWidgetText(uuid: uuid, text: text)
  }

  func addWidgetImageSignature(pageIndex: Int, uuid: String, imagePath: URL, completionHandler: @escaping (Bool) -> Void) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    pageUtil.addWidgetImageSignature(uuid: uuid, imagePath: imagePath, completionHandler: completionHandler)
  }

  func updateAp(pageIndex: Int, uuid: String) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    pageUtil.updateAp(uuid: uuid)
    pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
  }

  func reloadPages() {
    pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
    pdfViewController?.pdfListView?.layoutDocumentView()
  }

  func removeAnnotation(pageIndex: Int, annotId: String, completionHandler: @escaping (Bool) -> Void) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    guard pageUtil.getAnnotation(formUUID: annotId) != nil else {
      completionHandler(false)
      return
    }

    pageUtil.removeAnnotation(uuid: annotId)
    pdfViewController?.pdfListView?.updateActiveAnnotations([])
    pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
    completionHandler(true)
  }

  func addAnnotationReply(
    pageIndex: Int,
    annotId: String,
    content: String,
    title: String,
    completionHandler: @escaping ([String: Any]?) -> Void
  ) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    let reply = pageUtil.addAnnotationReply(uuid: annotId, content: content, title: title)
    completionHandler(reply)
  }

  func getAnnotationReplies(
    pageIndex: Int,
    annotId: String,
    completionHandler: @escaping ([[String: Any]]) -> Void
  ) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    completionHandler(pageUtil.getAnnotationReplies(uuid: annotId))
  }

  func updateAnnotationReply(
    pageIndex: Int,
    replyId: String,
    content: String,
    title: String?,
    identity: [String: Any]?,
    completionHandler: @escaping (Bool) -> Void
  ) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    let result = pageUtil.updateAnnotationReply(
      uuid: replyId,
      nativeId: identityValue(identity, "native_id"),
      replyKey: identityValue(identity, "reply_key"),
      parentUuid: identityValue(identity, "parent_uuid"),
      content: content,
      title: title
    )
    completionHandler(result)
  }

  func removeAnnotationReply(
    pageIndex: Int,
    replyId: String,
    identity: [String: Any]?,
    completionHandler: @escaping (Bool) -> Void
  ) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    let result = pageUtil.removeAnnotationReply(
      uuid: replyId,
      nativeId: identityValue(identity, "native_id"),
      replyKey: identityValue(identity, "reply_key"),
      parentUuid: identityValue(identity, "parent_uuid")
    )
    completionHandler(result)
  }

  func removeAllAnnotationReplies(
    pageIndex: Int,
    annotId: String,
    completionHandler: @escaping (Bool) -> Void
  ) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    let result = pageUtil.removeAllAnnotationReplies(uuid: annotId)
    completionHandler(result)
  }

  func setAnnotationMarkState(
    pageIndex: Int,
    annotId: String,
    state: String,
    identity: [String: Any]?,
    completionHandler: @escaping (Bool) -> Void
  ) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    let result = pageUtil.setAnnotationMarkState(
      uuid: annotId,
      nativeId: identityValue(identity, "native_id"),
      replyKey: identityValue(identity, "reply_key"),
      parentUuid: identityValue(identity, "parent_uuid"),
      state: state
    )
    completionHandler(result)
  }

  func getAnnotationMarkState(
    pageIndex: Int,
    annotId: String,
    identity: [String: Any]?,
    completionHandler: @escaping (String) -> Void
  ) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    completionHandler(pageUtil.getAnnotationMarkState(
      uuid: annotId,
      nativeId: identityValue(identity, "native_id"),
      replyKey: identityValue(identity, "reply_key"),
      parentUuid: identityValue(identity, "parent_uuid")
    ))
  }

  func setAnnotationReviewState(
    pageIndex: Int,
    annotId: String,
    state: String,
    identity: [String: Any]?,
    completionHandler: @escaping (Bool) -> Void
  ) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    let result = pageUtil.setAnnotationReviewState(
      uuid: annotId,
      nativeId: identityValue(identity, "native_id"),
      replyKey: identityValue(identity, "reply_key"),
      parentUuid: identityValue(identity, "parent_uuid"),
      state: state
    )
    completionHandler(result)
  }

  func getAnnotationReviewState(
    pageIndex: Int,
    annotId: String,
    identity: [String: Any]?,
    completionHandler: @escaping (String) -> Void
  ) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    completionHandler(pageUtil.getAnnotationReviewState(
      uuid: annotId,
      nativeId: identityValue(identity, "native_id"),
      replyKey: identityValue(identity, "reply_key"),
      parentUuid: identityValue(identity, "parent_uuid")
    ))
  }

  func removeWidget(pageIndex: Int, widgetId: String, completionHandler: @escaping (Bool) -> Void) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    guard pageUtil.getForm(formUUID: widgetId) != nil else {
      completionHandler(false)
      return
    }

    pageUtil.removeWidget(uuid: widgetId)
    pdfViewController?.pdfListView?.updateActiveAnnotations([])
    pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
    pdfViewController?.pdfListView?.updateFormScrollEnabled()
    completionHandler(true)
  }

  func removeEditingArea(pageIndex: Int, editingAreaId: String, completionHandler: @escaping (Bool) -> Void) {
    let pageUtil = RCTCPDFPageUtil(page: getPage(UInt(pageIndex)))
    pageUtil.pageIndex = pageIndex
    pageUtil.pdfView = pdfViewController?.pdfListView

    guard let editArea = pageUtil.getEidtArea(editUUID: editingAreaId) else {
      completionHandler(false)
      return
    }

    pdfViewController?.pdfListView?.remove(with: editArea)
    completionHandler(true)
  }

  func setAnnotationMode(mode: String) {
    pdfViewController?.annotationBar?.annotationToolBarSwitch(annotationMode(from: mode), notifyPencilDrawingCompleted: true)
  }

  func getAnnotationMode(completionHandler: @escaping (String) -> Void) {
    let annotationMode = pdfViewController?.pdfListView?.annotationMode ?? .CPDFViewAnnotationModenone
    var mode = "unknown"
    switch annotationMode {
    case .note: mode = "note"
    case .highlight: mode = "highlight"
    case .underline: mode = "underline"
    case .strikeout: mode = "strikeout"
    case .squiggly: mode = "squiggly"
    case .ink: mode = "ink"
    case .eraser: mode = "ink_eraser"
    case .pencilDrawing: mode = "pencil"
    case .circle: mode = "circle"
    case .square: mode = "square"
    case .arrow: mode = "arrow"
    case .line: mode = "line"
    case .freeText: mode = "freetext"
    case .signature: mode = "signature"
    case .stamp: mode = "stamp"
    case .image: mode = "pictures"
    case .link: mode = "link"
    case .sound: mode = "sound"
    case .CPDFViewAnnotationModenone: mode = "unknown"
    default: break
    }
    completionHandler(mode)
  }

  func annotationCanUndo(completionHandler: @escaping (Bool) -> Void) {
    completionHandler(pdfViewController?.pdfListView?.canUndo() ?? false)
  }

  func annotationCanRedo(completionHandler: @escaping (Bool) -> Void) {
    completionHandler(pdfViewController?.pdfListView?.canRedo() ?? false)
  }

  func annotationUndo() {
    pdfViewController?.pdfListView?.undoPDFManager?.undo()
  }

  func annotationRedo() {
    pdfViewController?.pdfListView?.undoPDFManager?.redo()
  }

  func setFormCreationMode(mode: String) {
    var annotationMode: CPDFViewAnnotationMode = .CPDFViewAnnotationModenone
    switch mode {
    case "textField": annotationMode = .formModeText
    case "checkBox": annotationMode = .formModeCheckBox
    case "radioButton": annotationMode = .formModeRadioButton
    case "comboBox": annotationMode = .formModeCombox
    case "listBox": annotationMode = .formModeList
    case "pushButton": annotationMode = .formModeButton
    case "signaturesFields": annotationMode = .formModeSign
    default: annotationMode = .CPDFViewAnnotationModenone
    }
    pdfViewController?.formBar?.formToolBarSwitch(annotationMode)
    if annotationMode == .CPDFViewAnnotationModenone {
      pdfViewController?.pdfListView?.scrollEnabled = true
    }
  }

  func getFormCreationMode(completionHandler: @escaping (String) -> Void) {
    let annotationMode = pdfViewController?.pdfListView?.annotationMode ?? .CPDFViewAnnotationModenone
    var mode = "unknown"
    switch annotationMode {
    case .formModeText: mode = "textField"
    case .formModeCheckBox: mode = "checkBox"
    case .formModeRadioButton: mode = "radioButton"
    case .formModeCombox: mode = "comboBox"
    case .formModeList: mode = "listBox"
    case .formModeButton: mode = "pushButton"
    case .formModeSign: mode = "signaturesFields"
    case .CPDFViewAnnotationModenone: mode = "unknown"
    default: break
    }
    completionHandler(mode)
  }

  func verifyDigitalSignatureStatus() {
    pdfViewController?.verifySignature()
  }

  func hideDigitalSignStatusView() {
    pdfViewController?.hideVerifySignatureView()
  }

  func clearDisplayRect() {
    pdfViewController?.pdfListView?.removeAllSquareAreas()
  }

  func dismissContextMenu() {
    pdfViewController?.pdfListView?.becomeFirstResponder()
  }

  func showSearchTextView() {
    pdfViewController?.buttonItemClicked_Search(nil)
  }

  func hideSearchTextView() {
    pdfViewController?.buttonItemClicked_searchBack(nil)
  }

  func saveCurrentInk() {
    pdfViewController?.annotationBar?.inkCommitDrawing()
  }

  func saveCurrentPencil() {
    pdfViewController?.annotationBar?.inkCommitDrawing()
  }

  func changeEditType(withEditTypes types: [Int]) {
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
    pdfViewController?.changeEditModeType(editTypes)
  }

  func editorCanUndo(completionHandler: @escaping (Bool) -> Void) {
    completionHandler(pdfViewController?.pdfListView?.canEditTextUndo() ?? false)
  }

  func editorCanRedo(completionHandler: @escaping (Bool) -> Void) {
    completionHandler(pdfViewController?.pdfListView?.canEditTextRedo() ?? false)
  }

  func editorUndo() {
    pdfViewController?.pdfListView?.editTextUndo()
  }

  func editorRedo() {
    pdfViewController?.pdfListView?.editTextRedo()
  }

  func searchText(text: String, searchOption: Int, completionHandler: @escaping ([[String: Any]]) -> Void) {
    let results = CPDFSearchUtil.searchText(
      from: pdfViewController?.pdfListView?.document,
      keywords: text,
      options: CPDFSearchOptions(rawValue: searchOption)
    )
    completionHandler(results)
  }

  func clearSearch(completionHandler: @escaping (Bool) -> Void) {
    pdfViewController?.pdfListView?.setHighlightedSelection(nil, animated: false)
    completionHandler(pdfViewController?.pdfListView != nil)
  }

  func getSearchText(pageIndex: Int, location: Int, length: Int, completionHandler: @escaping (String) -> Void) {
    let text = CPDFSearchUtil.getSearchText(
      from: pdfViewController?.pdfListView?.document,
      pageIndex: pageIndex,
      location: location,
      length: length
    )
    completionHandler(text ?? "")
  }

  func getPageText(pageIndex: Int, completionHandler: @escaping (String) -> Void) {
    let text = CPDFPageTextUtil.getPageText(
      from: pdfViewController?.pdfListView?.document,
      pageIndex: pageIndex
    )
    completionHandler(text)
  }

  func getPageTextInRect(
    pageIndex: Int,
    rect: NSDictionary,
    completionHandler: @escaping (String) -> Void
  ) {
    let text = CPDFPageTextUtil.getPageTextInRect(
      from: pdfViewController?.pdfListView?.document,
      pageIndex: pageIndex,
      rectInfo: rect as? [String: Any]
    )
    completionHandler(text)
  }

  func getPageTextLines(
    pageIndex: Int,
    completionHandler: @escaping ([[String: Any]]) -> Void
  ) {
    let lines = CPDFPageTextUtil.getPageTextLines(
      from: pdfViewController?.pdfListView?.document,
      pageIndex: pageIndex
    )
    completionHandler(lines)
  }

  func getPageSize(pageIndex: Int, completionHandler: @escaping (NSDictionary) -> Void) {
    guard let document = pdfViewController?.pdfListView?.document,
          let page = document.page(at: UInt(pageIndex)) else {
      completionHandler([:])
      return
    }

    let size = page.bounds(for: .mediaBox).size
    completionHandler(["width": size.width, "height": size.height] as NSDictionary)
  }

  func renderPage(pageIndex: Int, width: Int, height: Int, backgroundColor: String, drawAnnot: Bool, drawForm: Bool, pageCompression: String, completionHandler: @escaping (String?) -> Void) {
    guard let page = pdfViewController?.pdfListView?.document?.page(at: UInt(pageIndex)) else {
      completionHandler(nil)
      return
    }

    DispatchQueue.global(qos: .userInitiated).async {
      let image = page.thumbnail(of: CGSize(width: width, height: height))
      guard let image else {
        completionHandler(nil)
        return
      }

      let data: Data
      switch pageCompression {
      case "jpeg":
        data = image.jpegData(compressionQuality: 0.85) ?? Data()
      default:
        data = image.pngData() ?? Data()
      }

      DispatchQueue.main.async {
        completionHandler(data.isEmpty ? nil : data.base64EncodedString())
      }
    }
  }

  func renderAnnotationAppearance(pageIndex: Int, uuid: String, options: [String: Any], completionHandler: @escaping (String?) -> Void) {
    guard let document = pdfViewController?.pdfListView?.document,
          pageIndex >= 0,
          pageIndex < document.pageCount,
          let page = document.page(at: UInt(pageIndex)),
          !uuid.isEmpty else {
      completionHandler(nil)
      return
    }

    let pageUtil = RCTCPDFPageUtil(page: page)
    pageUtil.pageIndex = pageIndex

    DispatchQueue.global(qos: .userInitiated).async {
      guard let annotation = pageUtil.getAnnotation(formUUID: uuid) else {
        DispatchQueue.main.async { completionHandler(nil) }
        return
      }

      let renderSize = self.resolveAnnotationAppearanceRenderSize(bounds: annotation.bounds, options: options)
      guard let data = self.renderAnnotationAppearanceData(annotation: annotation, size: renderSize, options: options) else {
        DispatchQueue.main.async { completionHandler(nil) }
        return
      }

      DispatchQueue.main.async {
        completionHandler(data.base64EncodedString())
      }
    }
  }
}
