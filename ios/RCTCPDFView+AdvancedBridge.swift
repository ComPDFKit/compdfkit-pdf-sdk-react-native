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
  func getOutlineRoot(completionHandler: @escaping ([String: Any]?) -> Void) {
    completionHandler(CPDFOutlineUtil.getOutline(pdfViewController?.pdfListView?.document))
  }

  func newOutlineRoot(completionHandler: @escaping ([String: Any]?) -> Void) {
    completionHandler(CPDFOutlineUtil.newOutlineRoot(document: pdfViewController?.pdfListView?.document))
  }

  func addOutline(parentId: String, title: String, insertIndex: Int, pageIndex: Int, completionHandler: @escaping (Bool) -> Void) {
    let result = CPDFOutlineUtil.addOutline(
      document: pdfViewController?.pdfListView?.document,
      parentUuid: parentId,
      insertIndex: insertIndex,
      title: title,
      pageIndex: pageIndex
    )
    completionHandler(result)
  }

  func removeOutline(outlineId: String, completionHandler: @escaping (Bool) -> Void) {
    completionHandler(CPDFOutlineUtil.removeOutline(document: pdfViewController?.pdfListView?.document, uuid: outlineId))
  }

  func updateOutline(outlineId: String, title: String, pageIndex: Int, completionHandler: @escaping (Bool) -> Void) {
    completionHandler(CPDFOutlineUtil.updateOutline(document: pdfViewController?.pdfListView?.document, uuid: outlineId, title: title, pageIndex: pageIndex))
  }

  func moveOutline(outlineId: String, newParentId: String, insertIndex: Int, completionHandler: @escaping (Bool) -> Void) {
    completionHandler(CPDFOutlineUtil.moveToOutline(document: pdfViewController?.pdfListView?.document, newParentUUid: newParentId, uuid: outlineId, insertIndex: insertIndex))
  }

  func getBookmarks(completionHandler: @escaping ([[String: Any]]) -> Void) {
    completionHandler(CPDFBookmarkUtil.getBookmarks(document: pdfViewController?.pdfListView?.document))
  }

  func removeBookmark(pageIndex: Int, completionHandler: @escaping (Bool) -> Void) {
    let result = pdfViewController?.pdfListView?.document.removeBookmark(forPageIndex: UInt(pageIndex)) ?? false
    pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
    completionHandler(result)
  }

  func hasBookmark(pageIndex: Int, completionHandler: @escaping (Bool) -> Void) {
    let bookmarks = pdfViewController?.pdfListView?.document?.bookmarks() ?? []
    completionHandler(bookmarks.contains { $0.pageIndex == UInt(pageIndex) })
  }

  func addBookmark(pageIndex: Int, title: String, completionHandler: @escaping (Bool) -> Void) {
    let result = pdfViewController?.pdfListView?.document?.addBookmark(title, forPageIndex: UInt(pageIndex)) ?? false
    pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
    completionHandler(result)
  }

  func updateBookmark(uuid: String, title: String, completionHandler: @escaping (Bool) -> Void) {
    completionHandler(CPDFBookmarkUtil.updateBookmark(document: pdfViewController?.pdfListView?.document, uuid: uuid, title: title))
  }

  func fetchDefaultAnnotationStyle() -> [String: Any] {
    CPDFAnnotAttrUtil.getDefaultAnnotAttributes()
  }

  func updateDefaultAnnotationStyle(style: NSDictionary) {
    let type = style["type"] as? String ?? ""
    CPDFAnnotAttrUtil.setAnnotDefaultAttr(type: type, attrDict: style as! [String: Any])
    pdfViewController?.annotationBar?.reloadAnnotationButtons()
  }

  func fetchDefaultWidgetStyle() -> [String: Any] {
    CPDFAnnotAttrUtil.getDefaultWidgetAttributes()
  }

  func updateDefaultWidgetStyle(style: NSDictionary) {
    let type = style["type"] as? String ?? ""
    CPDFAnnotAttrUtil.setWidgetDefaultAttr(type: type, attrDict: style as! [String: Any])
  }

  func updateAnnotation(annotationMap: NSDictionary) {
    let pageIndex = annotationMap["page"] as? Int ?? 0
    let uuid = annotationMap["uuid"] as? String ?? ""
    let page = pdfViewController?.pdfListView?.document?.page(at: UInt(pageIndex))
    let pageUtil = RCTCPDFPageUtil(page: page)
    pageUtil.pageIndex = pageIndex
    pageUtil.updateAnnotation(pageIndex: pageIndex, uuid: uuid, properties: annotationMap as! [String: Any])
    pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
  }

  func updateWidget(widgetMap: NSDictionary) {
    let pageIndex = widgetMap["page"] as? Int ?? 0
    let uuid = widgetMap["uuid"] as? String ?? ""
    let page = pdfViewController?.pdfListView?.document?.page(at: UInt(pageIndex))
    let pageUtil = RCTCPDFPageUtil(page: page)
    pageUtil.pageIndex = pageIndex
    pageUtil.updateWidget(pageIndex: pageIndex, uuid: uuid, properties: widgetMap as! [String: Any])
    pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
  }

  func addAnnotations(_ annotations: [NSDictionary], completionHandler: @escaping (Bool) -> Void) {
    guard let document = pdfViewController?.pdfListView?.document else {
      completionHandler(false)
      return
    }
    let result = RCTCPDFPageUtil.addAnnotations(document: document, annotations: annotations as! [[String: Any]])
    pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
    completionHandler(result)
  }

  func addWidgets(_ widgets: [NSDictionary], completionHandler: @escaping (Bool) -> Void) {
    guard let document = pdfViewController?.pdfListView?.document else {
      completionHandler(false)
      return
    }
    let result = RCTCPDFPageUtil.addWidgets(document: document, widgets: widgets as! [[String: Any]])
    pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
    completionHandler(result)
  }

  func setAnnotationsVisible(visible: Bool, completionHandler: @escaping (Bool) -> Void) {
    guard let pdfListView = pdfViewController?.pdfListView else {
      completionHandler(false)
      return
    }
    pdfListView.drawAnnotationEnabled = visible
    pdfListView.layoutDocumentView()
    completionHandler(pdfListView.drawAnnotationEnabled == visible)
  }

  func isAnnotationsVisible(completionHandler: @escaping (Bool) -> Void) {
    completionHandler(pdfViewController?.pdfListView?.drawAnnotationEnabled ?? true)
  }

  func showDefaultAnnotationPropertiesView(type: String, completionHandler: @escaping (Bool) -> Void) {
    guard let pdfListView = pdfViewController?.pdfListView,
          let annotationBar = pdfViewController?.annotationBar else {
      completionHandler(false)
      return
    }
    pdfListView.setAnnotationMode(annotationMode(from: type))
    annotationBar.buttonItemClicked_openModel(UIButton(frame: .zero))
    completionHandler(true)
  }

  func showAnnotationPropertiesView(annotation: NSDictionary, completionHandler: @escaping (Bool) -> Void) {
    let pageIndex = annotation["page"] as? Int ?? 0
    let uuid = annotation["uuid"] as? String ?? ""
    let page = pdfViewController?.pdfListView?.document?.page(at: UInt(pageIndex))
    let pageUtil = RCTCPDFPageUtil(page: page)
    guard let annotation = pageUtil.getAnnotation(formUUID: uuid),
          let annotationBar = pdfViewController?.annotationBar else {
      completionHandler(false)
      return
    }

    annotationBar.openAnnotationProperties([annotation])
    completionHandler(true)
  }

  func showWidgetPropertiesView(widget: NSDictionary, completionHandler: @escaping (Bool) -> Void) {
    let pageIndex = widget["page"] as? Int ?? 0
    let uuid = widget["uuid"] as? String ?? ""
    let page = pdfViewController?.pdfListView?.document?.page(at: UInt(pageIndex))
    let pageUtil = RCTCPDFPageUtil(page: page)
    guard let form = pageUtil.getForm(formUUID: uuid),
          let formBar = pdfViewController?.formBar else {
      completionHandler(false)
      return
    }
    formBar.openFormProperties(form)
    completionHandler(true)
  }

  func showEditAreaPropertiesView(editArea: NSDictionary, completionHandler: @escaping (Bool) -> Void) {
    let pageIndex = editArea["page"] as? Int ?? 0
    let uuid = editArea["uuid"] as? String ?? ""
    let page = pdfViewController?.pdfListView?.document?.page(at: UInt(pageIndex))
    let pageUtil = RCTCPDFPageUtil(page: page)
    pageUtil.pdfView = pdfViewController?.pdfListView
    guard let editArea = pageUtil.getEidtArea(editUUID: uuid),
          let viewController = pdfViewController else {
      completionHandler(false)
      return
    }
    viewController.openEditPropertiesForAera(editArea)
    completionHandler(true)
  }

  func prepareNextSignature(signaturePath: String, completionHandler: @escaping (Bool) -> Void) {
    guard let image = UIImage(contentsOfFile: signaturePath),
          let document = pdfViewController?.pdfListView?.document,
          let annotation = CPDFSignatureAnnotation(document: document) else {
      completionHandler(false)
      return
    }
    annotation.setImage(image)
    pdfViewController?.pdfListView?.addAnnotation = annotation
    completionHandler(true)
  }

  func prepareNextStamp(dict: NSDictionary, completionHandler: @escaping (Bool) -> Void) {
    guard let document = pdfViewController?.pdfListView?.document else {
      completionHandler(false)
      return
    }

    let type = dict["type"] as? String ?? "standard"
    if type == "image" {
      let imagePath = dict["imagePath"] as? String ?? ""
      if let image = UIImage(contentsOfFile: imagePath) {
        let annotation = CPDFStampAnnotation(document: document, image: image)
        if annotation != nil {
          pdfViewController?.pdfListView?.addAnnotation = annotation
          completionHandler(true)
          return
        }
      }
      completionHandler(false)
      return
    } else if type == "standard" {
      let stampType = dict["standardStamp"] as? String ?? "Approved"
      let index = CPDFEnumConvertUtil.stringToStandardStamp(stampType)
      let annotation = CPDFStampAnnotation(document: document, type: index)
      pdfViewController?.pdfListView?.addAnnotation = annotation
      completionHandler(annotation != nil)
      return
    } else if type == "text" {
      let textStampDict = dict["textStamp"] as? NSDictionary ?? NSDictionary()
      let stampText = textStampDict["content"] as? String ?? ""
      let detailText = textStampDict["date"] as? String ?? ""
      let stampStyle = CPDFEnumConvertUtil.stringToStampStyle(textStampDict["color"] as? String ?? "red")
      let stampShape = CPDFEnumConvertUtil.stringToStampShape(textStampDict["shape"] as? String ?? "rect")
      let annotation = CPDFStampAnnotation(document: document, text: stampText, detailText: detailText, style: stampStyle, shape: stampShape)
      pdfViewController?.pdfListView?.addAnnotation = annotation
      completionHandler(annotation != nil)
      return
    }

    completionHandler(false)
  }

  func prepareNextImage(image: URL, completionHandler: @escaping (Bool) -> Void) {
    guard let uiImage = UIImage(contentsOfFile: image.path),
          let document = pdfViewController?.pdfListView?.document,
          let annotation = CPDFStampAnnotation(document: document, image: uiImage) else {
      completionHandler(false)
      return
    }
    pdfViewController?.pdfListView?.addAnnotation = annotation
    completionHandler(true)
  }

  func annotationMode(from mode: String) -> CPDFViewAnnotationMode {
    var annotationMode: CPDFViewAnnotationMode = .CPDFViewAnnotationModenone
    switch mode {
    case "note": annotationMode = .note
    case "highlight": annotationMode = .highlight
    case "underline": annotationMode = .underline
    case "strikeout": annotationMode = .strikeout
    case "squiggly": annotationMode = .squiggly
    case "ink": annotationMode = .ink
    case "ink_eraser": annotationMode = .eraser
    case "pencil": annotationMode = .pencilDrawing
    case "circle": annotationMode = .circle
    case "square": annotationMode = .square
    case "arrow": annotationMode = .arrow
    case "line": annotationMode = .line
    case "freetext": annotationMode = .freeText
    case "signature": annotationMode = .signature
    case "stamp": annotationMode = .stamp
    case "pictures": annotationMode = .image
    case "link": annotationMode = .link
    case "sound": annotationMode = .sound
    default: annotationMode = .CPDFViewAnnotationModenone
    }
    return annotationMode
  }

  func renderAnnotationAppearanceData(annotation: CPDFAnnotation, size: CGSize, options: [String: Any]) -> Data? {
    let image = annotation.anntationImage()
    guard size.width > 0, size.height > 0 else {
      return nil
    }

    let format = UIGraphicsImageRendererFormat.default()
    format.scale = 1
    format.opaque = false
    let renderer = UIGraphicsImageRenderer(size: size, format: format)
    let renderedImage = renderer.image { _ in
      image.draw(in: CGRect(origin: .zero, size: size))
    }

    let compression: String = getAnnotationRenderValue(from: options, key: "compression", defaultValue: "png")
    let quality: Int = min(max(getAnnotationRenderValue(from: options, key: "quality", defaultValue: 100), 1), 100)
    if compression == "jpeg" {
      return renderedImage.jpegData(compressionQuality: CGFloat(quality) / 100.0)
    }
    return renderedImage.pngData()
  }

  func resolveAnnotationAppearanceRenderSize(bounds: CGRect, options: [String: Any]) -> CGSize {
    let baseWidth = max(1, Int(abs(bounds.width).rounded()))
    let baseHeight = max(1, Int(abs(bounds.height).rounded()))
    let targetWidth: Int = getAnnotationRenderValue(from: options, key: "target_width", defaultValue: 0)
    let targetHeight: Int = getAnnotationRenderValue(from: options, key: "target_height", defaultValue: 0)
    let scale: Double = getAnnotationRenderValue(from: options, key: "scale", defaultValue: 3.0)

    if targetWidth > 0 && targetHeight > 0 {
      return CGSize(width: targetWidth, height: targetHeight)
    }
    if targetWidth > 0 {
      let resolvedHeight = max(1, Int((Double(targetWidth) * (Double(baseHeight) / Double(baseWidth))).rounded()))
      return CGSize(width: targetWidth, height: resolvedHeight)
    }
    if targetHeight > 0 {
      let resolvedWidth = max(1, Int((Double(targetHeight) * (Double(baseWidth) / Double(baseHeight))).rounded()))
      return CGSize(width: resolvedWidth, height: targetHeight)
    }

    return CGSize(
      width: max(1, Int((Double(baseWidth) * scale).rounded())),
      height: max(1, Int((Double(baseHeight) * scale).rounded()))
    )
  }

  func getAnnotationRenderValue<T>(from options: [String: Any], key: String, defaultValue: T) -> T {
    options[key] as? T ?? defaultValue
  }
}
