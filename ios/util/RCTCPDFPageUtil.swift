//
//  RCTCPDFPageUtil.swift
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

class RCTCPDFPageUtil: NSObject {
  
  private var page: CPDFPage?
  
  public var pageIndex: Int = 0
  
  public var pdfView: CPDFListView?
  
  init(page: CPDFPage? = nil) {
      self.page = page
  }
  
  //MARK: - Public Methods
  
  func getAnnotations() -> [Dictionary<String, Any>] {
      var annotaionDicts:[Dictionary<String, Any>] = []
      
      let annoations = page?.annotations ?? []
      
      for  annoation in annoations {
          if annoation.type == "Widget" {
              continue
          }

          let annotaionDict = getAnnotation(FormAnnotation: annoation)

          if annotaionDict["type"] != nil {
              annotaionDicts.append(annotaionDict)
          }
      }
      
      return annotaionDicts
  }
  
  func getAnnotation(FormAnnotation annotation: CPDFAnnotation) -> Dictionary<String, Any> {
      var annotaionDict: [String : Any] = [:]
      
      let type: String = annotation.type
      
      switch type {
      case "Highlight", "Squiggly", "Underline", "Strikeout":
          if let markupAnnotation = annotation as? CPDFMarkupAnnotation {
              let lowertype = CPDFUtil.lowercaseFirstLetter(of: type)
              let memory = CPDFUtil.getMemoryAddress(markupAnnotation)
              
              annotaionDict["uuid"] = memory
              annotaionDict["type"] = lowertype
              annotaionDict["title"] = markupAnnotation.userName()
              annotaionDict["page"] = pageIndex
              annotaionDict["content"] = markupAnnotation.contents
              
              if markupAnnotation.modificationDate() != nil {
                  annotaionDict["createDate"] = Int(
                      markupAnnotation
                          .modificationDate().timeIntervalSince1970 * 1000
                  )
              }
              annotaionDict["color"] = markupAnnotation.color?
                  .toHexString()
              annotaionDict["alpha"] = CPDFUtil.roundToTwoDecimals(
                  markupAnnotation.opacity * 255.0
              )
              
              annotaionDict["rect"] = getAnnotationRect(
                  bounds: markupAnnotation.bounds
              )
              annotaionDict["markedText"] = markupAnnotation.markupText()
              
          }
      case "Circle":
          if let circleAnnotation = annotation as? CPDFCircleAnnotation {
              let lowertype = lowercaseFirstLetter(of: type)
              let memory = CPDFUtil.getMemoryAddress(circleAnnotation)
              
              annotaionDict["uuid"] = memory
              annotaionDict["type"] = lowertype
              annotaionDict["title"] = circleAnnotation.userName()
              annotaionDict["page"] = pageIndex
              annotaionDict["content"] = circleAnnotation.contents
              
              if circleAnnotation.modificationDate() != nil {
                  annotaionDict["createDate"] = Int(
                      circleAnnotation
                          .modificationDate().timeIntervalSince1970 * 1000
                  )
              }
              
              annotaionDict["rect"] = getAnnotationRect(
                  bounds: circleAnnotation.bounds
              )
              annotaionDict["borderWidth"] = CPDFUtil.roundToTwoDecimals(circleAnnotation.borderWidth)
              annotaionDict["borderColor"] = circleAnnotation.color?
                  .toHexString()
              annotaionDict["borderAlpha"] = CPDFUtil.roundToTwoDecimals(
                  circleAnnotation.opacity * 255.0
              )
              annotaionDict["fillColor"] = circleAnnotation.interiorColor?
                  .toHexString()
              annotaionDict["fillAlpha"] = CPDFUtil.roundToTwoDecimals(
                  circleAnnotation.interiorOpacity * 255.0
              )
              let borderEeffect: CPDFBorderEffectType = circleAnnotation.borderEffect?.borderEffectType ?? .solid
              annotaionDict["bordEffectType"] = CPDFEnumConvertUtil.borderEffectToString(borderEffectType: borderEeffect)
              
              if(circleAnnotation.border != nil) {
                  let dashGapAny = circleAnnotation.border?.dashPattern.last
                  let dashGap = (dashGapAny as? Double) ?? 0.0
                  annotaionDict["dashGap"] = CPDFUtil.roundToTwoDecimals(dashGap)
              }
          }
      case "Square":
          if let squareAnnotation = annotation as? CPDFSquareAnnotation {
              let lowertype = lowercaseFirstLetter(of: type)
              let memory = CPDFUtil.getMemoryAddress(squareAnnotation)
              
              annotaionDict["uuid"] = memory
              annotaionDict["type"] = lowertype
              annotaionDict["title"] = squareAnnotation.userName()
              annotaionDict["page"] = pageIndex
              annotaionDict["content"] = squareAnnotation.contents
              
              if squareAnnotation.modificationDate() != nil {
                  annotaionDict["createDate"] = Int(
                      squareAnnotation
                          .modificationDate().timeIntervalSince1970 * 1000
                  )
              }
              
              annotaionDict["rect"] = getAnnotationRect(
                  bounds: squareAnnotation.bounds
              )
              annotaionDict["borderWidth"] = CPDFUtil.roundToTwoDecimals(squareAnnotation.borderWidth)
              annotaionDict["borderColor"] = squareAnnotation.color?
                  .toHexString()
              annotaionDict["borderAlpha"] = CPDFUtil.roundToTwoDecimals(
                  squareAnnotation.opacity * 255.0
              )
              annotaionDict["fillColor"] = squareAnnotation.interiorColor?
                  .toHexString()
              annotaionDict["fillAlpha"] = CPDFUtil.roundToTwoDecimals(
                  squareAnnotation.interiorOpacity * 255.0
              )
              let borderEeffect: CPDFBorderEffectType = squareAnnotation.borderEffect?.borderEffectType ?? .solid
              annotaionDict["bordEffectType"] = CPDFEnumConvertUtil.borderEffectToString(borderEffectType: borderEeffect)
              
              if(squareAnnotation.border != nil) {
                  let dashGapAny = squareAnnotation.border?.dashPattern.last
                  let dashGap = (dashGapAny as? Double) ?? 0.0
                  annotaionDict["dashGap"] = CPDFUtil.roundToTwoDecimals(dashGap)
              }
          }
      case "Line", "Arrow":
          if let lineAnnotation = annotation as? CPDFLineAnnotation {
              let lowertype = lowercaseFirstLetter(of: type)
              let memory = CPDFUtil.getMemoryAddress(lineAnnotation)
              
              annotaionDict["uuid"] = memory
              annotaionDict["type"] = lowertype
              annotaionDict["title"] = lineAnnotation.userName()
              annotaionDict["page"] = pageIndex
              annotaionDict["content"] = lineAnnotation.contents
              
              if lineAnnotation.modificationDate() != nil {
                  annotaionDict["createDate"] = Int(
                      lineAnnotation
                          .modificationDate().timeIntervalSince1970 * 1000
                  )
              }
              
              annotaionDict["rect"] = getAnnotationRect(
                  bounds: lineAnnotation.bounds
              )
              annotaionDict["borderWidth"] = CPDFUtil.roundToTwoDecimals(lineAnnotation.borderWidth)
              annotaionDict["borderColor"] = lineAnnotation.color?
                  .toHexString()

              annotaionDict["fillAlpha"] = CPDFUtil.roundToTwoDecimals(
                  lineAnnotation.interiorOpacity * 255.0
              )

              annotaionDict["lineHeadType"] = CPDFEnumConvertUtil.lineStyleToString(lineAnnotation.startLineStyle)
              annotaionDict["lineTailType"] = CPDFEnumConvertUtil.lineStyleToString(lineAnnotation.endLineStyle)
              
              if(lineAnnotation.border != nil) {
                  let dashGapAny = lineAnnotation.border?.dashPattern.last
                  let dashGap = (dashGapAny as? Double) ?? 0.0
                  annotaionDict["dashGap"] = CPDFUtil.roundToTwoDecimals(dashGap)
              }
              
              let startPoint = lineAnnotation.startPoint;
              let endPoint = lineAnnotation.endPoint;
              
              let points = [
                  [CPDFUtil.roundToTwoDecimals(startPoint.x),CPDFUtil.roundToTwoDecimals(startPoint.y)],
                  [CPDFUtil.roundToTwoDecimals(endPoint.x),CPDFUtil.roundToTwoDecimals(endPoint.y)]
              ]
              annotaionDict["points"] = points
          }
      case "Freehand":
          if let inkAnnotation = annotation as? CPDFInkAnnotation {
              let memory = CPDFUtil.getMemoryAddress(inkAnnotation)
              
              annotaionDict["uuid"] = memory
              annotaionDict["type"] = "ink"
              annotaionDict["title"] = inkAnnotation.userName()
              annotaionDict["page"] = pageIndex
              annotaionDict["content"] = inkAnnotation.contents
              
              if inkAnnotation.modificationDate() != nil {
                  annotaionDict["createDate"] = Int(
                      inkAnnotation
                          .modificationDate().timeIntervalSince1970  * 1000
                  )
              }
              annotaionDict["color"] = inkAnnotation.color?.toHexString()
              annotaionDict["alpha"] = CPDFUtil.roundToTwoDecimals(
                  inkAnnotation.opacity * 255.0
              )
              
              annotaionDict["rect"] = getAnnotationRect(
                  bounds: inkAnnotation.bounds
              )
              annotaionDict["borderWidth"] = CPDFUtil.roundToTwoDecimals(inkAnnotation.borderWidth)
              
              // Debug log for ink paths in [[any]] format
              let rawPaths: Any = inkAnnotation.paths as Any
              var nestedPaths: [[Any]] = []
              if let outer = rawPaths as? [Any] {
                  for strokeAny in outer {
                      var strokePoints: [[Double]] = []
                      // stroke may be array of NSValue (CGPoint), array of arrays, or array of dicts
                      if let strokeArray = strokeAny as? [Any] {
                          for pointAny in strokeArray {
                              // Case: NSValue wrapping CGPoint
                              if let value = pointAny as? NSValue {
                                  let p = value.cgPointValue
                                  strokePoints.append([
                                      Double(CPDFUtil.roundToTwoDecimals(p.x)),
                                      Double(CPDFUtil.roundToTwoDecimals(p.y))
                                  ])
                              }
                          }
                      }
                      if(!strokePoints.isEmpty){
                          nestedPaths.append(strokePoints)
                      }
                  }
              }
              annotaionDict["inkPath"] = nestedPaths
          }
          
      case "Note":
          if let noteAnnotation = annotation as? CPDFTextAnnotation {
              let lowertype = lowercaseFirstLetter(of: type)
              let memory = CPDFUtil.getMemoryAddress(noteAnnotation)
              
              annotaionDict["uuid"] = memory
              annotaionDict["type"] = lowertype
              annotaionDict["title"] = noteAnnotation.userName()
              annotaionDict["page"] = pageIndex
              annotaionDict["content"] = noteAnnotation.contents
              annotaionDict["color"] = noteAnnotation.color?.toHexString()
              annotaionDict["alpha"] = CPDFUtil.roundToTwoDecimals(
                  noteAnnotation.opacity * 255.0
              )
              
              if noteAnnotation.modificationDate() != nil {
                  annotaionDict["createDate"] = Int(
                      noteAnnotation
                          .modificationDate().timeIntervalSince1970 * 1000
                  )
              }
          
              annotaionDict["rect"] = getAnnotationRect(
                  bounds: noteAnnotation.bounds
              )
          }
          
      case "FreeText":
          if let freeTextAnnotation = annotation as? CPDFFreeTextAnnotation {
              let memory = CPDFUtil.getMemoryAddress(freeTextAnnotation)
              
              annotaionDict["uuid"] = memory
              annotaionDict["type"] = "freetext"
              annotaionDict["title"] = freeTextAnnotation.userName()
              annotaionDict["page"] = pageIndex
              annotaionDict["content"] = freeTextAnnotation.contents
              
              if freeTextAnnotation.modificationDate() != nil {
                  annotaionDict["createDate"] = Int(
                      freeTextAnnotation
                          .modificationDate().timeIntervalSince1970 * 1000
                  )
              }
              annotaionDict["color"] = freeTextAnnotation.color?
                  .toHexString()
              annotaionDict["alpha"] = CPDFUtil.roundToTwoDecimals(
                  freeTextAnnotation.opacity * 255.0
              )
              
              annotaionDict["rect"] = getAnnotationRect(
                  bounds: freeTextAnnotation.bounds
              )
              annotaionDict["alignment"] = CPDFEnumConvertUtil.textAlignmentToString(freeTextAnnotation.alignment)
              let fontDict: [String: Any] = [
                  "fontSize": freeTextAnnotation.fontSize,
                  "familyName": freeTextAnnotation.cFont.familyName,
                  "styleName": freeTextAnnotation.cFont.styleName ?? "",
                  "fontColor": freeTextAnnotation.fontColor?
                      .toHexString() ?? "",
              ]
              annotaionDict["textAttribute"] = fontDict
          }
          
      case "Stamp", "Image":
          if let stampAnnotation = annotation as? CPDFStampAnnotation {
              let lowertype = lowercaseFirstLetter(of: type)
              let memory = CPDFUtil.getMemoryAddress(stampAnnotation)
              
              annotaionDict["uuid"] = memory
              annotaionDict["type"] = lowertype
              if type == "Image" {
                  annotaionDict["type"] = "pictures"
              }
              annotaionDict["title"] = stampAnnotation.userName()
              annotaionDict["page"] = pageIndex
              annotaionDict["content"] = stampAnnotation.contents
              if stampAnnotation.modificationDate() != nil {
                  annotaionDict["createDate"] = Int(
                      stampAnnotation
                          .modificationDate().timeIntervalSince1970  * 1000
                  )
              }
              
              annotaionDict["rect"] = getAnnotationRect(
                  bounds: stampAnnotation.bounds
              )
              switch stampAnnotation.stampType() {
              case .standard:
                  annotaionDict["stampType"] = "standard"
                  let type = stampAnnotation.standardType
                  annotaionDict["standardStamp"] = CPDFEnumConvertUtil.standardStampToString(type)
                  
              case .text:
                  annotaionDict["stampType"] = "text"
                  var textDict:[String: Any] = [:]
                  textDict["content"] = stampAnnotation.text
                  textDict["date"] = stampAnnotation.detailText
                  let shapeStyle = stampAnnotation.shape
                  textDict["shape"] = CPDFEnumConvertUtil.stampShapeToString(shapeStyle)
                  let colorStyle = stampAnnotation.style
                  textDict["color"] = CPDFEnumConvertUtil.stampStyleToString(colorStyle)
                  annotaionDict["textStamp"] = textDict
              default:
                  annotaionDict["stampType"] = "unknown"
              }
          }
          
      case "Link":
          if let linkAnnotation = annotation as? CPDFLinkAnnotation {
              let lowertype = lowercaseFirstLetter(of: type)
              let memory = CPDFUtil.getMemoryAddress(linkAnnotation)
              
              annotaionDict["uuid"] = memory
              annotaionDict["type"] = lowertype
              annotaionDict["title"] = linkAnnotation.userName()
              annotaionDict["page"] = pageIndex
              annotaionDict["content"] = linkAnnotation.contents
              
              if linkAnnotation.modificationDate() != nil {
                  annotaionDict["createDate"] = Int(
                      linkAnnotation
                          .modificationDate().timeIntervalSince1970 * 1000
                  )
              }
              
              annotaionDict["rect"] = getAnnotationRect(
                  bounds: linkAnnotation.bounds
              )
              var actionDict: [String: Any] = [:];
              if (linkAnnotation.url() != nil) {
                  actionDict["actionType"] = "uri"
                  actionDict["uri"] = linkAnnotation.url()
                  annotaionDict["action"] = actionDict
              } else {
                  if(linkAnnotation.destination() != nil) {
                      actionDict["actionType"] = "goTo"
                      actionDict["pageIndex"] = linkAnnotation
                          .destination().pageIndex
                      annotaionDict["action"] = actionDict
                  }
              }
          }
          
      case "Media":
          if let mediaAnnotation = annotation as? CPDFSoundAnnotation {
              let memory = CPDFUtil.getMemoryAddress(mediaAnnotation)
              
              annotaionDict["uuid"] = memory
              annotaionDict["type"] = "sound"
              annotaionDict["title"] = mediaAnnotation.userName()
              annotaionDict["page"] = pageIndex
              annotaionDict["content"] = mediaAnnotation.contents
              
              if mediaAnnotation.modificationDate() != nil {
                  annotaionDict["createDate"] = Int(
                      mediaAnnotation
                          .modificationDate().timeIntervalSince1970 * 1000
                  )
              }
              
              annotaionDict["rect"] = getAnnotationRect(
                  bounds: mediaAnnotation.bounds
              )
          }
      case "":
          if let signatureAnnotation = annotation as? CPDFSignatureAnnotation {
              let memory = CPDFUtil.getMemoryAddress(signatureAnnotation)
              
              annotaionDict["uuid"] = memory
              annotaionDict["type"] = "signature"
              annotaionDict["title"] = signatureAnnotation.userName()
              annotaionDict["page"] = pageIndex
              annotaionDict["content"] = signatureAnnotation.contents
              
              if signatureAnnotation.modificationDate() != nil {
                  annotaionDict["createDate"] = Int(
                      signatureAnnotation
                          .modificationDate().timeIntervalSince1970 * 1000
                  )
              }
              
              annotaionDict["rect"] = getAnnotationRect(
                  bounds: signatureAnnotation.bounds
              )
          }
          
      default:
          print("Unhandled type: \(type)")
      }
      return annotaionDict
  }
  
  func getForms() -> [Dictionary<String, Any>] {
      var formDicts:[Dictionary<String, Any>] = []
      let forms = page?.annotations ?? []
      
      for form in forms {
          if form.type == "Widget" {
              if let widgetAnnotation = form as? CPDFWidgetAnnotation {
                  let formDict: [String : Any] = self.getForm(FormAnnotation: widgetAnnotation)
                  formDicts.append(formDict)
              }
          }
      }
      
      return formDicts
  }
  
  func getForm(FormAnnotation widgetAnnotation: CPDFWidgetAnnotation) -> Dictionary<String, Any> {
      let type: String = widgetAnnotation.type
      var formDict: [String : Any] = [:]
      let widgetType: String = widgetAnnotation.widgetType
      
      switch widgetType {
      case "CheckBox", "RadioButton", "PushButton":
          if let buttonWidget = widgetAnnotation as? CPDFButtonWidgetAnnotation {
              let lowertype = lowercaseFirstLetter(of: widgetType)
              let memory = CPDFUtil.getMemoryAddress(buttonWidget)
              
              formDict["uuid"] = memory
              formDict["type"] = lowertype
              formDict["title"] = buttonWidget.fieldName()
              formDict["page"] = pageIndex
              
              if buttonWidget.modificationDate() != nil {
                  formDict["createDate"] = Int(
                      buttonWidget
                          .modificationDate().timeIntervalSince1970 * 1000
                  )
              }
              formDict["rect"] = getAnnotationRect(
                  bounds: buttonWidget.bounds
              )
              formDict["borderWidth"] = CPDFUtil.roundToTwoDecimals(buttonWidget.borderWidth)
              formDict["borderColor"] = buttonWidget.borderColor?
                  .toHexString()
              formDict["fillColor"] = buttonWidget.backgroundColor?
                  .toHexString()
              
              if widgetType == "PushButton" {
                  formDict["buttonTitle"] = buttonWidget.caption()
                  var actionDict: [String: Any] = [:]
                  let action = buttonWidget.action
                  if(action != nil){
                      if let urlActions = action as? CPDFURLAction {
                          actionDict["actionType"] = "uri"
                          actionDict["uri"] = urlActions.url()
                      } else if let gotoAction = action as? CPDFGoToAction {
                          actionDict["actionType"] = "goTo"
                          actionDict["pageIndex"] = gotoAction
                              .destination().pageIndex
                      }
                      formDict["action"] = actionDict
                  }
                  formDict["familyName"] = buttonWidget.cFont.familyName
                  formDict["styleName"] = buttonWidget.cFont.styleName ?? ""
                  formDict["fontSize"] = buttonWidget.fontSize
                  formDict["fontColor"] = buttonWidget.fontColor?
                      .toHexString()
              } else {
                  let isOn = buttonWidget.state()
                  if (isOn != 0) {
                      formDict["isChecked"] = true
                  } else {
                      formDict["isChecked"] = false
                  }
                  
                  let checkStyle = buttonWidget.widgetCheckStyle()
                  formDict["checkStyle"] = CPDFEnumConvertUtil.widgetButtonStyleToString(
                      checkStyle
                  )
                  formDict["checkColor"] = buttonWidget.fontColor?
                      .toHexString()
              }
          }
          
      case "TextField":
          if let textFieldWidget = widgetAnnotation as? CPDFTextWidgetAnnotation {
              let lowertype = lowercaseFirstLetter(of: widgetType)
              let memory = CPDFUtil.getMemoryAddress(textFieldWidget)
              
              formDict["uuid"] = memory
              formDict["type"] = lowertype
              formDict["title"] = textFieldWidget.fieldName()
              formDict["page"] = pageIndex
              formDict["text"] = textFieldWidget.stringValue
              
              if textFieldWidget.modificationDate() != nil {
                  formDict["createDate"] = Int(
                      textFieldWidget
                          .modificationDate().timeIntervalSince1970 * 1000
                  )
              }

              formDict["rect"] = getAnnotationRect(
                  bounds: textFieldWidget.bounds
              )
              formDict["borderWidth"] = CPDFUtil.roundToTwoDecimals(textFieldWidget.borderWidth)
              formDict["familyName"] = textFieldWidget.cFont.familyName
              formDict["styleName"] = textFieldWidget.cFont.styleName ?? ""
              formDict["fontSize"] = textFieldWidget.fontSize
              formDict["fontColor"] = textFieldWidget.fontColor?
                  .toHexString()
              formDict["borderColor"] = textFieldWidget.borderColor?
                  .toHexString()
              formDict["fillColor"] = textFieldWidget.backgroundColor?
                  .toHexString()
              formDict["isMultiline"] = textFieldWidget.isMultiline
              formDict["text"] = textFieldWidget.stringValue
              
              formDict["alignment"] = CPDFEnumConvertUtil.textAlignmentToString(textFieldWidget.alignment)
          }
          
      case "ListBox", "ComboBox":
          if let choiceWidget = widgetAnnotation as? CPDFChoiceWidgetAnnotation {
              let lowertype = lowercaseFirstLetter(of: widgetType)
              let memory = CPDFUtil.getMemoryAddress(choiceWidget)
              
              formDict["uuid"] = memory
              formDict["type"] = lowertype
              formDict["title"] = choiceWidget.fieldName()
              formDict["page"] = pageIndex
              
              if choiceWidget.modificationDate() != nil {
                  formDict["createDate"] = Int(
                      choiceWidget
                          .modificationDate().timeIntervalSince1970 * 1000
                  )
              }
              formDict["rect"] = getAnnotationRect(
                  bounds: choiceWidget.bounds
              )
              formDict["borderWidth"] = CPDFUtil.roundToTwoDecimals(choiceWidget.borderWidth)
              formDict["familyName"] = choiceWidget.cFont.familyName
              formDict["styleName"] = choiceWidget.cFont.styleName ?? ""
              formDict["fontSize"] = choiceWidget.fontSize
              formDict["fontColor"] = choiceWidget.fontColor?
                  .toHexString()
              formDict["borderColor"] = choiceWidget.borderColor?
                  .toHexString()
              formDict["fillColor"] = choiceWidget.backgroundColor?
                  .toHexString()
              formDict["selectItemAtIndex"] = choiceWidget.selectItemAtIndex
              
              let items = choiceWidget.items ?? []
              var optionsArray: [[String: String]] = []
              
              for item: CPDFChoiceWidgetItem in items {
                  let itemDict: [String: String] = [
                      "text": item.string,
                      "value": item.value
                  ]
                  optionsArray.append(itemDict)
              }
              
              formDict["options"] = optionsArray
          }
          
      case "SignatureFields":
          if let signatureWidget = widgetAnnotation as? CPDFSignatureWidgetAnnotation {
              let memory = CPDFUtil.getMemoryAddress(signatureWidget)
              
              formDict["uuid"] = memory
              formDict["type"] = "signaturesFields"
              formDict["title"] = signatureWidget.fieldName()
              formDict["page"] = pageIndex
              
              if signatureWidget.modificationDate() != nil {
                  formDict["createDate"] = Int(
                      signatureWidget
                          .modificationDate().timeIntervalSince1970 * 1000
                  )
              }
 
              formDict["rect"] = getAnnotationRect(
                  bounds: signatureWidget.bounds
              )
              formDict["borderWidth"] = CPDFUtil.roundToTwoDecimals(signatureWidget.borderWidth)
              formDict["borderColor"] = signatureWidget.borderColor?
                  .toHexString()
              formDict["fillColor"] = signatureWidget.backgroundColor?
                  .toHexString()
          }
          
      default:
          print("Unhandled type: \(type)")
      }
      
      return formDict
  }
  
  func getEditArea(FromEditArea editArea: CPDFEditArea) -> Dictionary<String, Any> {
      var editDic: [String : Any] = [:]
      if let textEditArea = editArea as? CPDFEditTextArea {
          let memory = CPDFUtil.getMemoryAddress(textEditArea)
          
          editDic["uuid"] = memory
          editDic["type"] = "text"
          editDic["text"] = textEditArea.editTextAreaString()
          editDic["page"] = pageIndex
          
          if let pdfView = self.pdfView {
              let alignment = pdfView.editingSelectionAlignment(with: textEditArea)
              editDic["alignment"] = CPDFEnumConvertUtil.textAlignmentToString(alignment)
              let fontSize = pdfView.editingSelectionFontSizes(with: textEditArea)
              editDic["fontSize"] = CPDFUtil.roundToTwoDecimals(fontSize)
              
              let fontColor = pdfView.editingSelectionFontColor(with: textEditArea) ?? .black
              let alpha = pdfView.opacityByRange(for: textEditArea)
              editDic["color"] = fontColor.toHexARGBString(alpha: alpha)
              editDic["alpha"] = CPDFUtil.roundToTwoDecimals(alpha*255.0)
              
              let font = pdfView.editingSelectionCFont(with: textEditArea)
              editDic["familyName"] = font?.familyName ?? ""
              editDic["styleName"] = font?.styleName ?? ""
          }
      } else if let imageEditArea = editArea as? CPDFEditImageArea {
          let memory = CPDFUtil.getMemoryAddress(imageEditArea)
          editDic["uuid"] = memory
          editDic["type"] = "image"
          editDic["page"] = pageIndex
          
//            if let image = imageEditArea.thumbnailImage(with: imageEditArea.bounds.size) {
//                if let imagePath = saveImageToSandbox(image) {
//                    editDic["image"] = nil
//                }
//            }
          
          if let pdfView = self.pdfView {
              let alpha = pdfView.getImageTransparencyEdit(imageEditArea)
              editDic["alpha"] = CPDFUtil.roundToTwoDecimals(Double(alpha) * 255.0)
              
          }
      } else if let pathEditArea = editArea as? CPDFEditPathArea {
          let memory = CPDFUtil.getMemoryAddress(pathEditArea)
          editDic["uuid"] = memory
          editDic["type"] = "path"
          editDic["page"] = pageIndex
      }
      
      return editDic
  }
  
  func updateAp(uuid: String) {
      if let widget = self.getForm(formUUID: uuid) {
          widget.updateAppearanceStream()
      } else if let annotation = self.getAnnotation(formUUID: uuid) {
          annotation.updateAppearanceStream()
      }
  }
  
  
  // MARK: - Set Annottions Methods
  
  func removeAnnotation(uuid: String) {
      if let annotation = self.getAnnotation(formUUID: uuid) {
          page?.removeAnnotation(annotation)
      }
  }
  
  func updateAnnotation(
      pageIndex : Int,
      uuid: String,
      properties: [String: Any]
  ) {
      if let annotation = self.getAnnotation(formUUID: uuid) {
          // --------------->
          // update annotation properties here
          if let userName = properties["title"] as? String {
              annotation.setUserName(userName)
          }
          if let contents = properties["content"] as? String {
              annotation.contents = contents
          }
          
          switch annotation.type {
          case "Note":
              if let noteAnnotation = annotation as? CPDFTextAnnotation {
                  if let colorHex = properties["color"] as? String {
                      noteAnnotation.color = ColorHelper
                          .colorWithHexString(hex: colorHex)
                  }
                  if let alpha = properties["alpha"] as? Double {
                      noteAnnotation.opacity = CGFloat(alpha / 255.0)
                  }
              }
              
          case "Highlight", "Squiggly", "Underline", "Strikeout":
              if let markupAnnotation = annotation as? CPDFMarkupAnnotation {
                  if let colorHex = properties["color"] as? String {
                      markupAnnotation.color = ColorHelper
                          .colorWithHexString(hex: colorHex)
                  }
                  if let alpha = properties["alpha"] as? Double {
                      markupAnnotation.opacity = CGFloat(alpha / 255.0)
                  }
              }
          case "Freehand":
              if let inkAnnotation = annotation as? CPDFInkAnnotation {
                  if let colorHex = properties["color"] as? String {
                      inkAnnotation.color = ColorHelper
                          .colorWithHexString(hex: colorHex)
                  }
                  if let alpha = properties["alpha"] as? Double {
                      inkAnnotation.opacity = CGFloat(alpha / 255.0)
                  }
                  if let borderWidth = properties["borderWidth"] as? Double {
                      inkAnnotation.borderWidth = borderWidth
                  }
              }
          case "Circle":
              if let circleAnnotation = annotation as? CPDFCircleAnnotation {
                  if let fillColor = properties["fillColor"] as? String {
                      circleAnnotation.interiorColor = ColorHelper
                          .colorWithHexString(hex: fillColor)
                  }
                  if let fillAlpha = properties["fillAlpha"] as? Double {
                      circleAnnotation.interiorOpacity = CGFloat(
                          fillAlpha / 255.0
                      )
                  }
                  if let borderColor = properties["borderColor"] as? String {
                      circleAnnotation.color = ColorHelper
                          .colorWithHexString(hex: borderColor)
                  }
                  if let borderAlpha = properties["borderAlpha"] as? Double {
                      circleAnnotation.opacity = CGFloat(borderAlpha / 255.0)
                  }
                  if let borderWidth = properties["borderWidth"] as? Double {
                      circleAnnotation.borderWidth = borderWidth
                  }
                  
                  if let bordEffectType = properties["bordEffectType"] as? String {
                      circleAnnotation.borderEffect?.borderEffectType = CPDFEnumConvertUtil.stringToBorderEffect(_str: bordEffectType)
                  }
                  
                  let dashGap = properties["dashGap"] as? Double ?? 0.0
                  let oldBorder = annotation.border
                  let style = dashGap > 0 ? CPDFBorderStyle.dashed : CPDFBorderStyle.solid
                  let border = CPDFBorder(
                      style: style,
                      lineWidth: oldBorder?.lineWidth ?? 0,
                      dashPattern: [dashGap]
                  )
                  annotation.border = border
              }
          case "Square":
              if let squareAnnotation = annotation as? CPDFSquareAnnotation {
                  if let fillColor = properties["fillColor"] as? String {
                      squareAnnotation.interiorColor = ColorHelper
                          .colorWithHexString(hex: fillColor)
                  }
                  if let fillAlpha = properties["fillAlpha"] as? Double {
                      squareAnnotation.interiorOpacity = CGFloat(
                          fillAlpha / 255.0
                      )
                  }
                  if let borderColor = properties["borderColor"] as? String {
                      squareAnnotation.color = ColorHelper
                          .colorWithHexString(hex: borderColor)
                  }
                  if let borderAlpha = properties["borderAlpha"] as? Double {
                      squareAnnotation.opacity = CGFloat(borderAlpha / 255.0)
                  }
                  if let borderWidth = properties["borderWidth"] as? Double {
                      squareAnnotation.borderWidth = borderWidth
                  }
                  if let bordEffectType = properties["bordEffectType"] as? String {
                      squareAnnotation.borderEffect?.borderEffectType = CPDFEnumConvertUtil.stringToBorderEffect(_str: bordEffectType)
                  }
                  let dashGap = properties["dashGap"] as? Double ?? 0.0
                  let oldBorder = annotation.border
                  let style = dashGap > 0 ? CPDFBorderStyle.dashed : CPDFBorderStyle.solid
                  let border = CPDFBorder(
                      style: style,
                      lineWidth: oldBorder?.lineWidth ?? 0,
                      dashPattern: [dashGap]
                  )
                  annotation.border = border
              }
          case "Line", "Arrow":
              if let lineAnnotation = annotation as? CPDFLineAnnotation {
                  if let fillColor = properties["fillColor"] as? String {
                      lineAnnotation.interiorColor = ColorHelper
                          .colorWithHexString(hex: fillColor)
                  }
                  if let fillAlpha = properties["fillAlpha"] as? Double {
                      lineAnnotation.interiorOpacity = CGFloat(
                          fillAlpha / 255.0
                      )
                  }
                  if let borderColor = properties["borderColor"] as? String {
                      lineAnnotation.color = ColorHelper
                          .colorWithHexString(hex: borderColor)
                  }
                  if let borderAlpha = properties["borderAlpha"] as? Double {
                      lineAnnotation.opacity = CGFloat(borderAlpha / 255.0)
                  }
                  if let borderWidth = properties["borderWidth"] as? Double {
                      lineAnnotation.borderWidth = borderWidth
                  }
                  lineAnnotation.startLineStyle = CPDFEnumConvertUtil.stringToLineStyle(
                      properties["lineHeadType"] as? String ?? "none"
                  )
                  lineAnnotation.endLineStyle = CPDFEnumConvertUtil.stringToLineStyle(
                      properties["lineTailType"] as? String ?? "none"
                  )
                  
                  let dashGap = properties["dashGap"] as? Double ?? 0.0
                  let oldBorder = annotation.border
                  let style = dashGap > 0 ? CPDFBorderStyle.dashed : CPDFBorderStyle.solid
                  let border = CPDFBorder(
                      style: style,
                      lineWidth: oldBorder?.lineWidth ?? 0,
                      dashPattern: [dashGap]
                  )
                  annotation.border = border
              }
          case "FreeText":
              if let freeTextAnnotation = annotation as? CPDFFreeTextAnnotation {
                  if let alignment = properties["alignment"] as? String {
                      freeTextAnnotation.alignment = CPDFEnumConvertUtil.stringToTextAlignment(alignment)
                  }
                  if let alpha = properties["alpha"] as? Double {
                      freeTextAnnotation.opacity = CGFloat(alpha / 255.0)
                  }
                  if let textAttribute = properties["textAttribute"] as? [String: Any] {
                      if let fontSize = textAttribute["fontSize"] as? Double {
                          freeTextAnnotation.fontSize = fontSize
                      }
                      if let fontColorHex = textAttribute["color"] as? String {
                          freeTextAnnotation.fontColor = ColorHelper
                              .colorWithHexString(hex: fontColorHex)
                      }
                      let familyName = textAttribute["familyName"] as? String ?? "Helvetica"
                      let styleName = textAttribute["styleName"] as? String ?? ""
                      freeTextAnnotation.cFont = CPDFFont(
                          familyName: familyName,
                          fontStyle: styleName
                      )
                  }
              }
          case "Link":
              if let linkAnnotation = annotation as? CPDFLinkAnnotation {
                  if let actionDict = properties["action"] as? [String: Any] {
                      let actionType = actionDict["actionType"] as? String ?? ""
                      switch actionType {
                      case "uri":
                          if let uri = actionDict["uri"] as? String {
                              linkAnnotation.setURL(uri)
                          }
                      case "goTo":
                          if let destPageIndex = actionDict["pageIndex"] as? Int{
                              linkAnnotation
                                  .setDestination(
                                      CPDFDestination.init(
                                          document: page?.document,
                                          pageIndex: destPageIndex
                                      )
                                  )
                          }
                      default:
                          break;
                      }
                  }
              }
          default:
              break;
          }
          annotation.updateAppearanceStream()
      }
  }
  
  
  func updateWidget(
      pageIndex : Int,
      uuid: String,
      properties: [String: Any]
  ) {
      if let widget = self.getForm(formUUID: uuid) {
          // --------------->
          // update widget properties here
          if let userName = properties["title"] as? String {
              widget.setUserName(userName)
          }
          
          if let fillColorHex = properties["fillColor"] as? String {
              widget.backgroundColor = ColorHelper
                  .colorWithHexString(hex: fillColorHex)
          }
          if let borderColor = properties["borderColor"] as? String {
              widget.borderColor = ColorHelper
                  .colorWithHexString(hex: borderColor)
          }
          if let borderWidth = properties["borderWidth"] as? Double {
              widget.borderWidth = borderWidth
          }
          
          switch widget.widgetType {
          case "TextField":
              if let textFieldWidget = widget as? CPDFTextWidgetAnnotation {
                  if let text = properties["text"] as? String {
                      textFieldWidget.stringValue = text
                  }
                  if let fontColorHex = properties["fontColor"] as? String {
                      textFieldWidget.fontColor = ColorHelper
                          .colorWithHexString(hex: fontColorHex)
                  }
                  if let fontSize = properties["fontSize"] as? Double {
                      textFieldWidget.fontSize = fontSize
                  }
                  if let isMultiline = properties["isMultiline"] as? Bool {
                      textFieldWidget.isMultiline = isMultiline
                  }
                  if let alignment = properties["alignment"] as? String {
                      textFieldWidget.alignment = CPDFEnumConvertUtil.stringToTextAlignment(alignment)
                  }

                  let familyName = properties["familyName"] as? String ?? "Helvetica"
                  let styleName = properties["styleName"] as? String ?? ""
                  textFieldWidget.cFont = CPDFFont(
                      familyName: familyName,
                      fontStyle: styleName
                  )
              }
          case "CheckBox", "RadioButton":
              if let buttonWidget = widget as? CPDFButtonWidgetAnnotation {
                  if let checkColorHex = properties["checkColor"] as? String {
                      buttonWidget.fontColor = ColorHelper
                          .colorWithHexString(hex: checkColorHex)
                  }
                  if let isChecked = properties["isChecked"] as? Bool {
                      buttonWidget.setState(isChecked ? 1 : 0)
                  }
                  if let checkStyleStr = properties["checkStyle"] as? String {
                      let checkStyle = CPDFEnumConvertUtil.stringToWidgetButtonStyle(checkStyleStr)
                      buttonWidget.setWidgetCheck(checkStyle)
                  }
              }
          case "PushButton":
              if let pushButtonWidget = widget as? CPDFButtonWidgetAnnotation {
                  if let buttonTitle = properties["buttonTitle"] as? String {
                      pushButtonWidget.setCaption(buttonTitle)
                  }
                  if let fontColorHex = properties["fontColor"] as? String {
                      pushButtonWidget.fontColor = ColorHelper
                          .colorWithHexString(hex: fontColorHex)
                  }
                  if let fontSize = properties["fontSize"] as? Double {
                      pushButtonWidget.fontSize = fontSize
                  }
                  let familyName = properties["familyName"] as? String ?? "Helvetica"
                  let styleName = properties["styleName"] as? String ?? ""
                  pushButtonWidget.cFont = CPDFFont(
                      familyName: familyName,
                      fontStyle: styleName
                  )
                  
                  if let actionDict = properties["action"] as? [String: Any] {
                      let actionType = actionDict["actionType"] as? String ?? ""
                      switch actionType {
                      case "uri":
                          if let uri = actionDict["uri"] as? String {
                              let urlAction = CPDFURLAction(url: uri)
                              pushButtonWidget.action = urlAction
                          }
                      case "goTo":
                          if let destPageIndex = actionDict["pageIndex"] as? Int{
                              let gotoAction = CPDFGoToAction(
                                  destination: CPDFDestination.init(
                                      document: page?.document,
                                      pageIndex: destPageIndex
                                  )
                              )
                              pushButtonWidget.action = gotoAction
                          }
                      default:
                          break;
                      }
                  }
              }
          case "ListBox","ComboBox":
              if let choiceWidget = widget as? CPDFChoiceWidgetAnnotation {
                  if let fontColorHex = properties["fontColor"] as? String {
                      choiceWidget.fontColor = ColorHelper
                          .colorWithHexString(hex: fontColorHex)
                  }
                  if let fontSize = properties["fontSize"] as? Double {
                      choiceWidget.fontSize = fontSize
                  }
                  let familyName = properties["familyName"] as? String ?? "Helvetica"
                  let styleName = properties["styleName"] as? String ?? ""
                  choiceWidget.cFont = CPDFFont(
                      familyName: familyName,
                      fontStyle: styleName
                  )
                  if let options = properties["options"] as? [[String: String]] {
                      var items: [CPDFChoiceWidgetItem] = []
                      for option in options {
                          let text = option["text"] ?? ""
                          let value = option["value"] ?? ""
                          
                          let item = CPDFChoiceWidgetItem()
                          item.string = text
                          item.value = value
                          items.append(item)
                      }
                      choiceWidget.items = items
                  }
                  if let selectItemAtIndex = properties["selectItemAtIndex"] as? Int {
                      choiceWidget.selectItemAtIndex = selectItemAtIndex
                  }
              }
          default:
              break;
              
          }
          widget.updateAppearanceStream()
      }
  }
  
  // MARK: - Set Form Methods
  
  func removeWidget(uuid: String) {
      if let widget = self.getForm(formUUID: uuid) {
          print("removeWidget(): page is nil? :\(page == nil)")
          page?.removeAnnotation(widget)
      }
  }
  
  func setWidgetIsChecked(uuid: String, isChecked: Bool) {
      if let widget = self.getForm(formUUID: uuid) {
          if let buttonWidget = widget as? CPDFButtonWidgetAnnotation {
              buttonWidget.setState(isChecked ? 1 : 0)
          }
      }
  }
  
  func setTextWidgetText(uuid: String, text: String) {
      if let widget = self.getForm(formUUID: uuid) {
          if let textFieldWidget = widget as? CPDFTextWidgetAnnotation {
              textFieldWidget.stringValue = text
          }
      }
  }
  
  func addWidgetImageSignature(
      uuid: String,
      imagePath: URL,
      completionHandler: @escaping (Bool) -> Void
  ) {
      if let widget = self.getForm(formUUID: uuid) {
          if let signatureWidget = widget as? CPDFSignatureWidgetAnnotation {
              let image = UIImage(contentsOfFile: imagePath.path)
              signatureWidget.sign(with: image)
              completionHandler(true)
          }
      } else if let annotation = self.getAnnotation(formUUID: uuid) {
          if let signatureAnnotation = annotation as? CPDFSignatureAnnotation {
              let image = UIImage(contentsOfFile: imagePath.path)
              signatureAnnotation.setImage(image)
              completionHandler(true)
          }
      } else {
          completionHandler(false)
      }
  }
  
  public func getAnnotation(formUUID uuid: String) -> CPDFAnnotation? {
      let annoations = page?.annotations ?? []
      for  annoation in annoations {
          if annoation.type == "Widget" {
              continue
          }
          let _uuid = CPDFUtil.getMemoryAddress(annoation)
          if _uuid == uuid {
              return annoation
          }
      }
      
      return nil
  }
  
  public func getForm(formUUID uuid: String) -> CPDFWidgetAnnotation? {
      let annoations = page?.annotations ?? []
      for  annoation in annoations {
          if annoation.type == "Widget" {
              if let widgetAnnotation = annoation as? CPDFWidgetAnnotation {
                  let _uuid = CPDFUtil.getMemoryAddress(annoation)
                  if _uuid == uuid {
                      return widgetAnnotation
                  }
              }
          }
      }
      return nil
  }
  
  public func getEidtArea(editUUID uuid: String) -> CPDFEditArea? {
      if let editArea = pdfView?.editingArea() {
          let _uuid = CPDFUtil.getMemoryAddress(editArea)
          if _uuid == uuid {
              return editArea
          }
          return nil
      }
      return nil
  }
  
  public static func addAnnotations(document: CPDFDocument, annotations: [[String: Any]]) -> Bool {
      // Placeholder: receive annotation data from Flutter and log for debugging.
      var overallSuccess = true

      for (index, annot) in annotations.enumerated() {

          guard let type = annot["type"] as? String else { continue }
          // Common fields used by multiple annotation types
          let pageIndex = annot["page"] as? Int ?? 0
          let title = annot["title"] as? String ?? ""
          let content = annot["content"] as? String ?? ""

          // Parse rect using helper
          let rect = RCTCPDFPageUtil.rectFromDict(annot["rect"] as? [String: Any])
          switch type {
          case "note":
              guard let page = document.page(at: UInt(pageIndex)) else {
                  overallSuccess = false
                  continue
              }

              let text = CPDFTextAnnotation(document: document)
              text?.contents = content
              text?.bounds = rect
              if !title.isEmpty {
                  text?.setUserName(title)
              }
              if let createDateInt = annot["createDate"] as? Int {
                  let createDate = Date(timeIntervalSince1970: TimeInterval(createDateInt) / 1000.0)
                  text?.setModificationDate(createDate)
              } else {
                  text?.setModificationDate(Date())
              }
              
              if let colorHex = annot["color"] as? String {
                  text?.color = ColorHelper.colorWithHexString(hex: colorHex)
              }

              if let alpha = annot["alpha"] as? Double {
                  text?.opacity = CGFloat(alpha / 255.0)
              }
              page.addAnnotation(text!)

          case "highlight", "underline", "squiggly", "strikeout":
              print("ComPDFKit-Flutter: Received markup annotation [\(index)]: \(annot)")
              guard let page = document.page(at: UInt(pageIndex)) else {
                  overallSuccess = false
                  continue
              }
              
              // Build quadrilateral points from rect
              let quadRect = rect
              var quadrilateralPoints: [CGPoint] = []
              let selections: [CPDFSelection] = page.selection(for: quadRect).selectionsByLine ?? []
              for selections in selections {
                  
                  let quadRect = selections.bounds
                  quadrilateralPoints.append(CGPoint(x: quadRect.minX, y: quadRect.maxY))
                  quadrilateralPoints.append(CGPoint(x: quadRect.maxX, y: quadRect.maxY))
                  quadrilateralPoints.append(CGPoint(x: quadRect.minX, y: quadRect.minY))
                  quadrilateralPoints.append(CGPoint(x: quadRect.maxX, y: quadRect.minY))

                  // Map string type to CPDFMarkupAnnotation.MarkupType
                  var markupType: CPDFMarkupType = .highlight
                  switch type {
                  case "underline":
                      markupType = .underline
                  case "squiggly":
                      markupType = .squiggly
                  case "strikeout":
                      markupType = .strikeOut
                  default:
                      markupType = .highlight
                  }

                  if let markup = CPDFMarkupAnnotation(document: document, markupType: markupType) {
                      // set color
                      if let colorHex = annot["color"] as? String {
                          markup.color = ColorHelper.colorWithHexString(hex: colorHex)
                      } else {
                          markup.color = UIColor.yellow
                      }

                      // set opacity
                      if let alpha = annot["alpha"] as? Double {
                          markup.opacity = CGFloat(alpha / 255.0)
                      }

                      markup.quadrilateralPoints = quadrilateralPoints
                      if !title.isEmpty {
                          markup.setUserName(title)
                      }
                      markup.contents = content
                      if let createDateInt = annot["createDate"] as? Int {
                          let createDate = Date(timeIntervalSince1970: TimeInterval(createDateInt) / 1000.0)
                          markup.setModificationDate(createDate)
                      } else {
                          markup.setModificationDate(Date())
                      }

                      page.addAnnotation(markup)
                  } else {
                      overallSuccess = false
                  }
              }

              case "freetext":
                  guard let page = document.page(at: UInt(pageIndex)) else {
                      overallSuccess = false
                      continue
                  }

                  if let freeText = CPDFFreeTextAnnotation(document: document) {
                      freeText.contents = content
                      freeText.bounds = rect
                      if !title.isEmpty {
                          freeText.setUserName(title)
                      }

                      if let textAttr = annot["textAttribute"] as? [String: Any] {
                          let familyName = textAttr["familyName"] as? String ?? "Helvetica"
                          let styleName = textAttr["styleName"] as? String ?? ""
                          freeText.cFont = CPDFFont(familyName: familyName, fontStyle: styleName)
                          if let fontSize = textAttr["fontSize"] as? Double {
                              freeText.fontSize = fontSize
                          }
                          if let fontColorHex = textAttr["fontColor"] as? String {
                              freeText.fontColor = ColorHelper.colorWithHexString(hex: fontColorHex)
                          }
                      }
                      if let alignmentStr = annot["alignment"] as? String {
                          freeText.alignment = CPDFEnumConvertUtil.stringToTextAlignment(alignmentStr)
                      }
                      if let alpha = annot["alpha"] as? Double {
                          freeText.opacity = CGFloat(alpha / 255.0)
                      }
                      if let createDateInt = annot["createDate"] as? Int {
                          let createDate = Date(timeIntervalSince1970: TimeInterval(createDateInt) / 1000.0)
                          freeText.setModificationDate(createDate)
                      } else {
                          freeText.setModificationDate(Date())
                      }
                      page.addAnnotation(freeText)
                  } else {
                      overallSuccess = false
                  }

              case "line", "arrow":
                  guard let page = document.page(at: UInt(pageIndex)) else {
                      overallSuccess = false
                      continue
                  }

                  if let line = CPDFLineAnnotation(document: document) {
                      // If points provided, use them. Expecting [[x,y], [x,y]]
                      if let points = annot["points"] as? [[Any]], points.count >= 2 {
                          if let sx = points[0][0] as? Double, let sy = points[0][1] as? Double,
                             let ex = points[1][0] as? Double, let ey = points[1][1] as? Double {
                              CPDFUtil.log("Line points from annotation data: start(\(sx), \(sy)), end(\(ex), \(ey))")
                              line.startPoint = CGPoint(x: sx, y: sy)
                              line.endPoint = CGPoint(x: ex, y: ey)
                          }
                      } else {
                          // Fallback: use rect corners
                          line.startPoint = CGPoint(x: rect.minX, y: rect.minY)
                          line.endPoint = CGPoint(x: rect.maxX, y: rect.maxY)
                      }

                      if let startStyle = annot["lineHeadType"] as? String {
                          line.startLineStyle = CPDFEnumConvertUtil.stringToLineStyle(startStyle)
                      }
                      if let endStyle = annot["lineTailType"] as? String {
                          line.endLineStyle = CPDFEnumConvertUtil.stringToLineStyle(endStyle)
                      }

                      if let borderColorHex = annot["borderColor"] as? String {
                          line.color = ColorHelper.colorWithHexString(hex: borderColorHex)
                      }
                      if let fillColorHex = annot["fillColor"] as? String {
                          line.interiorColor = ColorHelper.colorWithHexString(hex: fillColorHex)
                      }

                      if let borderAlpha = annot["borderAlpha"] as? Double {
                          line.opacity = CGFloat(borderAlpha / 255.0)
                      }
                      if let fillAlpha = annot["fillAlpha"] as? Double {
                          line.interiorOpacity = CGFloat(fillAlpha / 255.0)
                      }
                      if let borderWidth = annot["borderWidth"] as? Double {
                          line.borderWidth = borderWidth
                      }
                      let dashGap = annot["dashGap"] as? Double ?? 0.0
                      let style = dashGap > 0 ? CPDFBorderStyle.dashed : CPDFBorderStyle.solid
                      let border = CPDFBorder(style: style, lineWidth: line.borderWidth, dashPattern: [dashGap])
                      line.border = border

                      if let contents = annot["content"] as? String {
                          line.contents = contents
                      }

                      if let createDateInt = annot["createDate"] as? Int {
                          let createDate = Date(timeIntervalSince1970: TimeInterval(createDateInt) / 1000.0)
                          line.setModificationDate(createDate)
                      } else {
                          line.setModificationDate(Date())
                      }
                      page.addAnnotation(line)
                  } else {
                      overallSuccess = false
                  }

          case "circle":
              guard let page = document.page(at: UInt(pageIndex)) else {
                  overallSuccess = false
                  continue
              }

              if let circle = CPDFCircleAnnotation(document: document) {
                  circle.bounds = rect
                  if !title.isEmpty {
                      circle.setUserName(title)
                  }
                  circle.contents = content

                  if let borderWidth = annot["borderWidth"] as? Double {
                      circle.borderWidth = borderWidth
                  }
                  if let borderColorHex = annot["borderColor"] as? String {
                      circle.color = ColorHelper.colorWithHexString(hex: borderColorHex)
                  }
                  if let borderAlpha = annot["borderAlpha"] as? Double {
                      circle.opacity = CGFloat(borderAlpha / 255.0)
                  }
                  if let fillColorHex = annot["fillColor"] as? String {
                      circle.interiorColor = ColorHelper.colorWithHexString(hex: fillColorHex)
                  }
                  if let fillAlpha = annot["fillAlpha"] as? Double {
                      circle.interiorOpacity = CGFloat(fillAlpha / 255.0)
                  }

                  if let bordEffectType = annot["bordEffectType"] as? String {
                      circle.borderEffect?.borderEffectType = CPDFEnumConvertUtil.stringToBorderEffect(_str: bordEffectType)
                  }

                  let dashGap = annot["dashGap"] as? Double ?? 0.0
                  let style = dashGap > 0 ? CPDFBorderStyle.dashed : CPDFBorderStyle.solid
                  let border = CPDFBorder(style: style, lineWidth: circle.borderWidth, dashPattern: [dashGap])
                  circle.border = border

                  if let createDateInt = annot["createDate"] as? Int {
                      let createDate = Date(timeIntervalSince1970: TimeInterval(createDateInt) / 1000.0)
                      circle.setModificationDate(createDate)
                  } else {
                      circle.setModificationDate(Date())
                  }

                  page.addAnnotation(circle)
              } else {
                  overallSuccess = false
              }

          case "square":
              guard let page = document.page(at: UInt(pageIndex)) else {
                  overallSuccess = false
                  continue
              }

              if let square = CPDFSquareAnnotation(document: document) {
                  square.bounds = rect
                  if !title.isEmpty {
                      square.setUserName(title)
                  }
                  square.contents = content

                  if let borderWidth = annot["borderWidth"] as? Double {
                      square.borderWidth = borderWidth
                  }
                  if let borderColorHex = annot["borderColor"] as? String {
                      square.color = ColorHelper.colorWithHexString(hex: borderColorHex)
                  }
                  if let borderAlpha = annot["borderAlpha"] as? Double {
                      square.opacity = CGFloat(borderAlpha / 255.0)
                  }
                  if let fillColorHex = annot["fillColor"] as? String {
                      square.interiorColor = ColorHelper.colorWithHexString(hex: fillColorHex)
                  }
                  if let fillAlpha = annot["fillAlpha"] as? Double {
                      square.interiorOpacity = CGFloat(fillAlpha / 255.0)
                  }
                  if let bordEffectType = annot["bordEffectType"] as? String {
                      square.borderEffect?.borderEffectType = CPDFEnumConvertUtil.stringToBorderEffect(_str: bordEffectType)
                  }
                  let dashGap = annot["dashGap"] as? Double ?? 0.0
                  let style = dashGap > 0 ? CPDFBorderStyle.dashed : CPDFBorderStyle.solid
                  let border = CPDFBorder(style: style, lineWidth: square.borderWidth, dashPattern: [dashGap])
                  square.border = border

                  if let createDateInt = annot["createDate"] as? Int {
                      let createDate = Date(timeIntervalSince1970: TimeInterval(createDateInt) / 1000.0)
                      square.setModificationDate(createDate)
                  } else {
                      square.setModificationDate(Date())
                  }
                  page.addAnnotation(square)
              } else {
                  overallSuccess = false
              }

          case "stamp", "pictures":
              guard let page = document.page(at: UInt(pageIndex)) else {
                  overallSuccess = false
                  continue
              }

              let stampType = annot["stampType"] as? String ?? "standard"
              
              var stampAnnotation : CPDFStampAnnotation?
              switch stampType {
              case "standard":
                  let standardStamp = annot["standardStamp"] as? String ?? "Approved"
                  stampAnnotation = CPDFStampAnnotation(document: document, type: CPDFEnumConvertUtil.stringToStandardStamp(standardStamp))
                  let adJustRect = computeAdjustedRect(sourceRect: stampAnnotation!.bounds, left: rect.origin.x, top: rect.origin.y, right: rect.origin.x + rect.size.width, bottom: rect.origin.y + rect.size.height)
                  stampAnnotation?.bounds = adJustRect
              case "text":
                  if let textStampAttr = annot["textStamp"] as? [String: Any] {
                      let content = textStampAttr["content"] as? String ?? ""
                      let date = textStampAttr["date"] as? String ?? ""
                      let shapeStr = textStampAttr["shape"] as? String ?? "rect"
                      let colorStr = textStampAttr["color"] as? String ?? "white"
                      
                      stampAnnotation = CPDFStampAnnotation(document: document, text: content, detailText: date, style: CPDFEnumConvertUtil.stringToStampStyle(colorStr),
                                                            shape: CPDFEnumConvertUtil.stringToStampShape(shapeStr))
                      let adJustRect = computeAdjustedRect(sourceRect: stampAnnotation!.bounds, left: rect.origin.x, top: rect.origin.y, right: rect.origin.x + rect.size.width, bottom: rect.origin.y + rect.size.height)
                      stampAnnotation?.bounds = adJustRect
                  } else {
                      stampAnnotation = nil
                  }
              case "image":
                  if let image = Self.resolvedImage(from: annot) {
                      let sourceRect = CGRect(x: 0, y: 0, width: image.size.width, height: image.size.height)
                      let adJustRect = computeAdjustedRect(sourceRect: sourceRect, left: rect.origin.x, top: rect.origin.y, right: rect.origin.x + rect.size.width, bottom: rect.origin.y + rect.size.height)
                      stampAnnotation = CPDFStampAnnotation(document: document, image: image)
                      stampAnnotation?.bounds = adJustRect
                  } else {
                      CPDFUtil.log("addAnnotations - failed to resolve image stamp data")
                      stampAnnotation = nil
                  }
              default:
                  stampAnnotation = nil
              }
              
              if(stampAnnotation != nil){
                  
                  if !title.isEmpty {
                      stampAnnotation?.setUserName(title)
                  }
                  stampAnnotation?.contents = content
                  if let createDateInt = annot["createDate"] as? Int {
                      let createDate = Date(timeIntervalSince1970: TimeInterval(createDateInt) / 1000.0)
                      stampAnnotation?.setModificationDate(createDate)
                  } else {
                      stampAnnotation?.setModificationDate(Date())
                  }
                  page.addAnnotation(stampAnnotation!)
              }else {
                  overallSuccess = false
              }
              
          case "signature":
              guard let page = document.page(at: UInt(pageIndex)) else {
                  overallSuccess = false
                  continue
              }

              if let signature = CPDFSignatureAnnotation(document: document) {
                  
                  
                  if !title.isEmpty {
                      signature.setUserName(title)
                  }
                  signature.contents = content

                  if let imageStr = annot["image"] as? String, let imageData = Data(base64Encoded: imageStr, options: .ignoreUnknownCharacters), let image = UIImage(data: imageData) {
                      let sourceRect = CGRect(x: 0, y: 0, width: image.size.width, height: image.size.height)
                      let adJustRect = computeAdjustedRect(sourceRect: sourceRect, left: rect.origin.x, top: rect.origin.y, right: rect.origin.x + rect.size.width, bottom: rect.origin.y + rect.size.height)
                      signature.setImage(image)
                      signature.bounds = adJustRect
                  }

                  if let createDateInt = annot["createDate"] as? Int {
                      let createDate = Date(timeIntervalSince1970: TimeInterval(createDateInt) / 1000.0)
                      signature.setModificationDate(createDate)
                  } else {
                      signature.setModificationDate(Date())
                  }

                  page.addAnnotation(signature)
              } else {
                  overallSuccess = false
              }

          case "ink":
              guard let page = document.page(at: UInt(pageIndex)) else {
                  overallSuccess = false
                  continue
              }

              if let ink = CPDFInkAnnotation(document: document) {
                  // Set basic properties
                  if !title.isEmpty {
                      ink.setUserName(title)
                  }
                  ink.contents = content
                  
                  // Set color
                  if let colorHex = annot["color"] as? String {
                      ink.color = ColorHelper.colorWithHexString(hex: colorHex)
                  }
                  
                  // Set opacity (alpha)
                  if let alpha = annot["alpha"] as? Double {
                      ink.opacity = CGFloat(alpha / 255.0)
                  }
                  
                  // Set border width
                  if let borderWidth = annot["borderWidth"] as? Double {
                      ink.borderWidth = borderWidth
                  }
                  
                  // Parse and set ink paths
                  // Flutter sends: inkPath: List<List<List<double>>> = [[[x1,y1], [x2,y2], ...], [...]]
                  if let inkPathData = annot["inkPath"] as? [[[Any]]] {
                      var paths: [[NSValue]] = []
                      
                      for stroke in inkPathData {
                          var points: [NSValue] = []
                          for point in stroke {
                              if point.count >= 2,
                                 let x = point[0] as? Double,
                                 let y = point[1] as? Double {
                                  points.append(NSValue(cgPoint: CGPoint(x: x, y: y)))
                              }
                          }
                          if !points.isEmpty {
                              paths.append(points)
                          }
                      }
                      
                      if !paths.isEmpty {
                          ink.paths = paths
                      }
                  }
                  
                  // Set creation/modification date
                  if let createDateInt = annot["createDate"] as? Int {
                      let createDate = Date(timeIntervalSince1970: TimeInterval(createDateInt) / 1000.0)
                      ink.setModificationDate(createDate)
                  } else {
                      ink.setModificationDate(Date())
                  }
                  
                  page.addAnnotation(ink)
              } else {
                  overallSuccess = false
              }

          case "link":
              guard let page = document.page(at: UInt(pageIndex)) else {
                  overallSuccess = false
                  continue
              }

              if let link = CPDFLinkAnnotation(document: document) {
                  // Set bounds
                  link.bounds = rect
                  
                  // Set basic properties
                  if !title.isEmpty {
                      link.setUserName(title)
                  }
                  link.contents = content
                  
                  // Parse and set action
                  if let actionData = annot["action"] as? [String: Any],
                     let actionType = actionData["actionType"] as? String {
                      
                      switch actionType {
                      case "goTo":
                          // Handle page destination
                          if let destPageIndex = actionData["pageIndex"] as? Int {
                              link.setDestination(
                                  CPDFDestination.init(
                                      document: document,
                                      pageIndex: destPageIndex
                                  )
                              )
                          }
                          
                      case "uri":
                          // Handle URL
                          if let urlString = actionData["uri"] as? String {
                              link.setURL(urlString)
                          }
                          
                      default:
                          print("ComPDFKit-Flutter: Unhandled link action type: \(actionType)")
                      }
                  }
                  
                  // Set creation/modification date
                  if let createDateInt = annot["createDate"] as? Int {
                      let createDate = Date(timeIntervalSince1970: TimeInterval(createDateInt) / 1000.0)
                      link.setModificationDate(createDate)
                  } else {
                      link.setModificationDate(Date())
                  }
                  
                  page.addAnnotation(link)
              } else {
                  overallSuccess = false
              }

          case "sound":
              guard let page = document.page(at: UInt(pageIndex)) else {
                  overallSuccess = false
                  continue
              }

              if let soundAnnotation = CPDFSoundAnnotation(document: document) {
                  // Set bounds
                  soundAnnotation.bounds = rect
                  
                  // Set basic properties
                  if !title.isEmpty {
                      soundAnnotation.setUserName(title)
                  }
                  soundAnnotation.contents = content
                  
                  // Set sound file path
                  if let soundPath = annot["soundPath"] as? String {
                      soundAnnotation.setMediaPath(soundPath)
                  }
                  
                  // Set creation/modification date
                  if let createDateInt = annot["createDate"] as? Int {
                      let createDate = Date(timeIntervalSince1970: TimeInterval(createDateInt) / 1000.0)
                      soundAnnotation.setModificationDate(createDate)
                  } else {
                      soundAnnotation.setModificationDate(Date())
                  }
                  
                  page.addAnnotation(soundAnnotation)
              } else {
                  overallSuccess = false
              }

          default:
              CPDFUtil.log("addAnnotations - unhandled type \(type)")
          }
      }

      return overallSuccess
  }
  
  public static func addWidgets(document: CPDFDocument, widgets: [[String: Any]]) -> Bool {
      // Placeholder: receive widget data from Flutter and log for debugging.
      var overallSuccess = true
      
      for (_, widgetDict) in widgets.enumerated() {
          
          guard let type = widgetDict["type"] as? String else { continue }
          // Common fields used by multiple annotation types
          let pageIndex = widgetDict["page"] as? Int ?? 0
          var title = widgetDict["title"] as? String ?? ""
          if(title.isEmpty){
              title = createFieldName(type: type)
          }
          
          // Parse common widget properties
          let borderColorHex = widgetDict["borderColor"] as? String ?? "#000000"
          let fillColorHex = widgetDict["fillColor"] as? String ?? "#000000"
          let borderWidth = (widgetDict["borderWidth"] as? Double) ?? 2.0
          
          let borderColor = ColorHelper.colorWithHexString(hex: borderColorHex)
          let fillColor = ColorHelper.colorWithHexString(hex: fillColorHex)
          
          let createDate = (widgetDict["createDate"] as? Int).map {
              Date(timeIntervalSince1970: TimeInterval($0) / 1000.0)
          } ?? Date()
          
          // Parse rect using helper
          let rect = rectFromDict(borderWidth: borderWidth, dict: widgetDict["rect"] as? [String: Any])
          
          guard let page = document.page(at: UInt(pageIndex)) else {
              CPDFUtil.log("addWidgets - cannot get page at index \(pageIndex)")
              overallSuccess = false
              continue
          }
          
          switch type {
          case "textField":
              guard let textWidget = CPDFTextWidgetAnnotation(document: document) else {
                  CPDFUtil.log("addWidgets - failed to create textField")
                  overallSuccess = false
                  continue
              }
              
              textWidget.setFieldName(title)
              textWidget.bounds = rect
              textWidget.borderColor = borderColor
              textWidget.backgroundColor = fillColor
              textWidget.borderWidth = CGFloat(borderWidth)
              textWidget.setModificationDate(createDate)
              // TextField specific properties
              if let text = widgetDict["text"] as? String {
                  textWidget.stringValue = text
              }
              if let fontColorHex = widgetDict["fontColor"] as? String {
                  textWidget.fontColor = ColorHelper.colorWithHexString(hex: fontColorHex)
              }
              if let fontSize = widgetDict["fontSize"] as? Double {
                  textWidget.fontSize = fontSize
              }
              if let familyName = widgetDict["familyName"] as? String,
                 let styleName = widgetDict["styleName"] as? String {
                  textWidget.cFont = CPDFFont(familyName: familyName, fontStyle: styleName)
              }
              if let isMultiline = widgetDict["isMultiline"] as? Bool {
                  textWidget.isMultiline = isMultiline
              }
              if let alignment = widgetDict["alignment"] as? String {
                  textWidget.alignment = CPDFEnumConvertUtil.stringToTextAlignment(alignment)
              }
              page.addAnnotation(textWidget)
              
          case "checkBox", "radioButton":
              
              let controlType = type == "checkBox" ? CPDFWidgetControlType.checkBoxControl : CPDFWidgetControlType.radioButtonControl
              
              guard let checkBoxWidget = CPDFButtonWidgetAnnotation(document: document, controlType: controlType) else {
                  CPDFUtil.log("addWidgets - failed to create \(type)")
                  overallSuccess = false
                  continue
              }
              
              checkBoxWidget.setFieldName(title)
              checkBoxWidget.bounds = rect
              checkBoxWidget.borderColor = borderColor
              checkBoxWidget.backgroundColor = fillColor
              checkBoxWidget.borderWidth = CGFloat(borderWidth)
              checkBoxWidget.setModificationDate(createDate)
              
              // CheckBox specific properties
              if let isChecked = widgetDict["isChecked"] as? Bool {
                  checkBoxWidget.setState(isChecked ? 1 : 0)
              }
              
              if let checkStyleStr = widgetDict["checkStyle"] as? String {
                  checkBoxWidget.setWidgetCheck(CPDFEnumConvertUtil.stringToWidgetButtonStyle(checkStyleStr))
              }
              if let checkColorHex = widgetDict["checkColor"] as? String {
                  checkBoxWidget.fontColor = ColorHelper.colorWithHexString(hex: checkColorHex)
              }
              page.addAnnotation(checkBoxWidget)
              
          case "listBox", "comboBox":
              
              let isListChoice = type == "listBox"
              
              guard let choiceWidget = CPDFChoiceWidgetAnnotation(document: document, listChoice: isListChoice) else {
                  CPDFUtil.log("addWidgets - failed to create listBox")
                  overallSuccess = false
                  continue
              }
              
              choiceWidget.setFieldName(title)
              choiceWidget.bounds = rect
              choiceWidget.borderColor = borderColor
              choiceWidget.backgroundColor = fillColor
              choiceWidget.borderWidth = CGFloat(borderWidth)
              choiceWidget.setModificationDate(createDate)
              
              // ListBox specific properties
              if let options = widgetDict["options"] as? [[String: String]] {
                  var optionItems: [CPDFChoiceWidgetItem] = []
                  for option in options {
                      if let text = option["text"],
                         let value = option["value"] {
                          let item = CPDFChoiceWidgetItem()
                          item.value = value
                          item.string = text
                          optionItems.append(item)
                      }
                  }
                  choiceWidget.items = optionItems
              }
              if let selectItemAtIndex = widgetDict["selectItemAtIndex"] as? Int {
                  choiceWidget.selectItemAtIndex = selectItemAtIndex
              }
              if let fontColorHex = widgetDict["fontColor"] as? String {
                  choiceWidget.fontColor = ColorHelper.colorWithHexString(hex: fontColorHex)
              }
              if let fontSize = widgetDict["fontSize"] as? Double {
                  choiceWidget.fontSize = fontSize
              }
              if let familyName = widgetDict["familyName"] as? String,
                 let styleName = widgetDict["styleName"] as? String {
                  choiceWidget.cFont = CPDFFont(familyName: familyName, fontStyle: styleName)
              }
              
              page.addAnnotation(choiceWidget)
              
          case "signaturesFields":
              guard let signatureWidget = CPDFSignatureWidgetAnnotation(document: document) else {
                  CPDFUtil.log("addWidgets - failed to create signaturesFields")
                  overallSuccess = false
                  continue
              }
              
              signatureWidget.setFieldName(title)
              signatureWidget.bounds = rect
              signatureWidget.borderColor = borderColor
              signatureWidget.backgroundColor = fillColor
              signatureWidget.backgroundOpacity = 1.0
              signatureWidget.borderWidth = CGFloat(borderWidth)
              signatureWidget.setModificationDate(createDate)
              
              page.addAnnotation(signatureWidget)
              
          case "pushButton":
              guard let pushButtonWidget = CPDFButtonWidgetAnnotation(document: document, controlType: .pushButtonControl) else {
                  CPDFUtil.log("addWidgets - failed to create pushButton")
                  overallSuccess = false
                  continue
              }
              
              pushButtonWidget.setFieldName(title)
              pushButtonWidget.bounds = rect
              pushButtonWidget.borderColor = borderColor
              pushButtonWidget.backgroundColor = fillColor
              pushButtonWidget.borderWidth = CGFloat(borderWidth)
              pushButtonWidget.setModificationDate(createDate)
              
              // PushButton specific properties
              if let buttonTitle = widgetDict["buttonTitle"] as? String {
                  pushButtonWidget.setCaption(buttonTitle)
              }
              if let fontColorHex = widgetDict["fontColor"] as? String {
                  pushButtonWidget.fontColor = ColorHelper.colorWithHexString(hex: fontColorHex)
              }
              if let fontSize = widgetDict["fontSize"] as? Double {
                  pushButtonWidget.fontSize = fontSize
              }
              if let familyName = widgetDict["familyName"] as? String,
                 let styleName = widgetDict["styleName"] as? String {
                  pushButtonWidget.cFont = CPDFFont(familyName: familyName, fontStyle: styleName)
              }
              
              // Handle action if present
              if let actionDict = widgetDict["action"] as? [String: Any],
                 let actionType = actionDict["actionType"] as? String {
                  switch actionType {
                  case "goTo":
                      if let destPageIndex = actionDict["pageIndex"] as? Int {
                          if let destination = CPDFDestination(document: document, pageIndex: destPageIndex) {
                              let action = CPDFGoToAction(destination: destination)
                              pushButtonWidget.action = action
                          }
                      }
                  case "uri":
                      if let urlStr = actionDict["uri"] as? String {
                          let action = CPDFURLAction(url: urlStr)
                          pushButtonWidget.action = action
                      }
                  default:
                      break
                  }
              }else{
                  CPDFUtil.log("addWidgets - pushButton missing action")
              }
              page.addAnnotation(pushButtonWidget)
              
          default:
              CPDFUtil.log("addWidgets - unhandled type \(type)")
              break;
          }
      }

      return overallSuccess
  }
  //MARK: - Private Methods
  

  private static func computeAdjustedRect(
      sourceRect: CGRect,
      left: CGFloat,
      top: CGFloat,
      right: CGFloat,
      bottom: CGFloat
  ) -> CGRect {
      let rect = CGRect(x: left,
                        y: top,
                        width: right - left,
                        height: bottom - top)

      let targetWidth = rect.width
      let aspect: CGFloat = sourceRect.width == 0
          ? 1
          : abs(sourceRect.height / sourceRect.width)

      let targetHeight = targetWidth * aspect

      return CGRect(x: left,
                    y: top,
                    width: targetWidth,
                    height: targetHeight)
  }
  

  func lowercaseFirstLetter(of string: String) -> String {
      guard !string.isEmpty else { return string }
      let lowercaseString = string.prefix(1).lowercased() + string.dropFirst()
      return lowercaseString
  }

  
  func getAnnotationRect(bounds : CGRect) -> [String: Double] {
      let rectDict = [
          "bottom": CPDFUtil.roundToTwoDecimals(bounds.origin.y),
          "left": CPDFUtil.roundToTwoDecimals(bounds.origin.x),
          "top": CPDFUtil.roundToTwoDecimals(bounds.origin.y + bounds.size.height),
          "right": CPDFUtil.roundToTwoDecimals(bounds.origin.x + bounds.size.width)
      ]
      return rectDict;
  }
  

  func saveImageToSandbox(_ image: UIImage) -> String? {
      guard let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first else {
          return nil
      }
      
      let imageDirectory = documentsDirectory.appendingPathComponent("EditImages", isDirectory: true)
      
      if !FileManager.default.fileExists(atPath: imageDirectory.path) {
          do {
              try FileManager.default.createDirectory(at: imageDirectory, withIntermediateDirectories: true, attributes: nil)
          } catch {
              return nil
          }
      }
      
      let timestamp = Int(Date().timeIntervalSince1970 * 1000)
      let uuid = UUID().uuidString
      let fileName = "image_\(timestamp)_\(uuid).png"
      let fileURL = imageDirectory.appendingPathComponent(fileName)
      
      guard let imageData = image.pngData() else {
          return nil
      }
      
      do {
          try imageData.write(to: fileURL)
          
          return fileURL.path
      } catch {
          return nil
      }
  }

  private static func rectFromDict(_ dict: [String: Any]?) -> CGRect {
      return rectFromDict(borderWidth: 0, dict: dict)
  }

  private static func resolvedImage(from annot: [String: Any]) -> UIImage? {
      if let imageData = annot["imageData"] as? [String: Any] {
          if let image = resolvedImageData(from: imageData) {
              return image
          }
      }

      if let imageStr = annot["image"] as? String, !imageStr.isEmpty {
          if let image = imageFromBase64(imageStr) {
              return image
          }
      }

      return nil
  }

  private static func resolvedImageData(from imageData: [String: Any]) -> UIImage? {
      let type = imageData["type"] as? String ?? "base64"
      let value = imageData["data"] as? String ?? ""
      guard !value.isEmpty else {
          return nil
      }

      let image: UIImage?
      switch type {
      case "base64":
          image = imageFromBase64(value)
      case "filePath":
          image = imageFromPath(value)
      case "asset":
          image = imageFromAsset(value)
      case "uri":
          image = imageFromUri(value)
      default:
          image = nil
      }
      return image
  }

  private static func imageFromBase64(_ value: String) -> UIImage? {
      let normalized = stripDataUriPrefix(value)
      guard let data = Data(base64Encoded: normalized, options: .ignoreUnknownCharacters) else {
          return nil
      }
      guard let image = UIImage(data: data) else {
          return nil
      }
      return image
  }

  private static func stripDataUriPrefix(_ value: String) -> String {
      let trimmed = value.trimmingCharacters(in: .whitespacesAndNewlines)
      guard let commaIndex = trimmed.firstIndex(of: ",") else {
          return trimmed
      }

      let prefix = trimmed[..<commaIndex].lowercased()
      guard prefix.hasPrefix("data:") else {
          return trimmed
      }

      return String(trimmed[trimmed.index(after: commaIndex)...])
  }

  private static func imageFromPath(_ value: String) -> UIImage? {
      let trimmed = value.trimmingCharacters(in: .whitespacesAndNewlines)
      guard !trimmed.isEmpty else {
          return nil
      }

      // 1. Try parsing as URL (handles file:// and percent-encoded paths)
      if let url = URL(string: trimmed), url.isFileURL {
          let filePath = url.path
          if FileManager.default.fileExists(atPath: filePath) {
              if let image = UIImage(contentsOfFile: filePath) {
                  return image
              }
          } 
      }

      // 2. Strip file:// prefix manually for paths that URL(string:) cannot parse
      //    (e.g. paths with unencoded spaces: "file:///path with spaces/img.png")
      var rawPath = trimmed
      if rawPath.hasPrefix("file://") {
          rawPath = String(rawPath.dropFirst("file://".count))
          rawPath = rawPath.removingPercentEncoding ?? rawPath
      }

      if FileManager.default.fileExists(atPath: rawPath) {
          if let image = UIImage(contentsOfFile: rawPath) {
              return image
          }
      } 

      return nil
  }

  private static func imageFromUri(_ value: String) -> UIImage? {
      let trimmed = value.trimmingCharacters(in: .whitespacesAndNewlines)
      guard !trimmed.isEmpty else {
          return nil
      }

      // Try as local file path first
      if let image = imageFromPath(trimmed) {
          return image
      }

      // Try as remote URL (http:// or https://)
      if let url = URL(string: trimmed),
         let scheme = url.scheme?.lowercased(),
         (scheme == "http" || scheme == "https") {
          do {
              let data = try Data(contentsOf: url)
              if let image = UIImage(data: data) {
                  return image
              }
          } catch {
          }
      }

      return nil
  }

  private static func imageFromAsset(_ value: String) -> UIImage? {
      let trimmed = value.trimmingCharacters(in: .whitespacesAndNewlines)
      guard !trimmed.isEmpty else {
          return nil
      }

      if let directImage = UIImage(named: trimmed) {
          return directImage
      }

      let normalizedPath = trimmed.hasPrefix("/") ? String(trimmed.dropFirst()) : trimmed
      if let bundlePath = Bundle.main.path(forResource: normalizedPath, ofType: nil) {
          return UIImage(contentsOfFile: bundlePath)
      }

      let assetUrl = URL(fileURLWithPath: normalizedPath)
      let fileName = assetUrl.deletingPathExtension().lastPathComponent
      let fileExtension = assetUrl.pathExtension.isEmpty ? nil : assetUrl.pathExtension
      let directory = assetUrl.deletingLastPathComponent().path
      let bundleDirectory = directory == "." ? nil : directory

      if let bundlePath = Bundle.main.path(forResource: fileName, ofType: fileExtension, inDirectory: bundleDirectory) {
          return UIImage(contentsOfFile: bundlePath)
      }

      return nil
  }
  
  private static func rectFromDict(borderWidth: Double, dict: [String: Any]?) -> CGRect {
      guard let rectDict = dict else {
          return CGRect(x: 0, y: 0, width: 0, height: 0)
      }

      var left = (rectDict["left"] as? Double) ?? (rectDict["left"] as? CGFloat).map { Double($0) } ?? 0.0
      var bottom = (rectDict["bottom"] as? Double) ?? (rectDict["bottom"] as? CGFloat).map { Double($0) } ?? 0.0
      var right = (rectDict["right"] as? Double) ?? (rectDict["right"] as? CGFloat).map { Double($0) } ?? 0.0
      var top = (rectDict["top"] as? Double) ?? (rectDict["top"] as? CGFloat).map { Double($0) } ?? 0.0
      
      left += borderWidth
      top -= borderWidth
      right -= borderWidth
      bottom += borderWidth
      
      let x = CGFloat(left)
      let y = CGFloat(bottom)
      let w = CGFloat(right - left)
      let h = CGFloat(top - bottom)
      
      return CGRect(x: x, y: y, width: w, height: h)
  }
  
  private static func createFieldName(type: String) -> String {
      let now = Date()
      let calendar = Calendar.current
      
      // Format: yyyyMMdd HH:mm:ss.mmm
      let year = calendar.component(.year, from: now)
      let month = twoDigits(calendar.component(.month, from: now))
      let day = twoDigits(calendar.component(.day, from: now))
      let hour = twoDigits(calendar.component(.hour, from: now))
      let minute = twoDigits(calendar.component(.minute, from: now))
      let second = twoDigits(calendar.component(.second, from: now))
      let millisecond = String(format: "%03d", calendar.component(.nanosecond, from: now) / 1_000_000)
      
      let dateStr = "\(year)\(month)\(day) \(hour):\(minute):\(second).\(millisecond)"
      
      // Capitalize first letter of type name
      let capitalized = type.isEmpty ? "" : String(type.prefix(1)).uppercased() + String(type.dropFirst())
      
      return "\(capitalized)_\(dateStr)"
  }
  
  private static func twoDigits(_ n: Int) -> String {
      return String(format: "%02d", n)
  }
  
}
