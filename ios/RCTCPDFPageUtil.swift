//
//  RCTCPDFPageUtil.swift
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

class RCTCPDFPageUtil: NSObject {
    
    private var page: CPDFPage?
    
    public var pageIndex: Int = 0
    
    init(page: CPDFPage? = nil) {
        self.page = page
    }
    
    //MARK: - Public Methods
    
    func getAnnotations() -> [Dictionary<String, Any>] {
        var annotaionDicts:[Dictionary<String, Any>] = []
       
        let annoations = page?.annotations ?? []
        
        for  annoation in annoations {
            var annotaionDict: [String : Any] = [:]
            
            let type: String = annoation.type
            if annoation.type == "Widget" {
                continue
            }
             
            switch type {
            case "Highlight", "Squiggly", "Underline", "Strikeout":
                if let markupAnnotation = annoation as? CPDFMarkupAnnotation {
                    let lowertype = lowercaseFirstLetter(of: type)
                    let memory = getMemoryAddress(markupAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = lowertype
                    annotaionDict["title"] = markupAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = markupAnnotation.contents
                    
                    if markupAnnotation.modificationDate() != nil {
                        annotaionDict["createDate"] = Int(markupAnnotation.modificationDate().timeIntervalSince1970 * 1000)
                    }
                    annotaionDict["color"] = markupAnnotation.color?.toHexString()
                    annotaionDict["alpha"] = markupAnnotation.opacity * 255.0
                    let rectDict = [
                        "bottom": markupAnnotation.bounds.origin.y,
                        "left": markupAnnotation.bounds.origin.x,
                        "top": markupAnnotation.bounds.origin.y + markupAnnotation.bounds.size.height,
                        "right": markupAnnotation.bounds.origin.x + markupAnnotation.bounds.size.width
                    ]
                    annotaionDict["rect"] = rectDict
                    annotaionDict["markedText"] = markupAnnotation.markupText()
                    
                }
            case "Circle":
                if let circleAnnotation = annoation as? CPDFCircleAnnotation {
                    let lowertype = lowercaseFirstLetter(of: type)
                    let memory = getMemoryAddress(circleAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = lowertype
                    annotaionDict["title"] = circleAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = circleAnnotation.contents
                    
                    if circleAnnotation.modificationDate() != nil {
                        annotaionDict["createDate"] = Int(circleAnnotation.modificationDate().timeIntervalSince1970 * 1000)
                    }
                    let rectDict = [
                        "bottom": circleAnnotation.bounds.origin.y,
                        "left": circleAnnotation.bounds.origin.x,
                        "top": circleAnnotation.bounds.origin.y + circleAnnotation.bounds.size.height,
                        "right": circleAnnotation.bounds.origin.x + circleAnnotation.bounds.size.width
                    ]
                    annotaionDict["rect"] = rectDict
                    annotaionDict["borderWidth"] = circleAnnotation.borderWidth
                    annotaionDict["borderColor"] = circleAnnotation.color?.toHexString()
                    annotaionDict["borderAlpha"] = circleAnnotation.opacity * 255.0
                    annotaionDict["fillColor"] = circleAnnotation.interiorColor?.toHexString()
                    annotaionDict["fillAlpha"] = circleAnnotation.interiorOpacity * 255.0
                    let borderEeffect: CPDFBorderEffectType = circleAnnotation.borderEffect?.borderEffectType ?? .solid
                    switch borderEeffect {
                    case .solid:
                        annotaionDict["bordEffectType"] = "solid"
                    case .cloudy:
                        annotaionDict["bordEffectType"] = "cloudy"
                    @unknown default:
                        annotaionDict["bordEffectType"] = "solid"
                    }
                }
            case "Square":
                if let squareAnnotation = annoation as? CPDFSquareAnnotation {
                    let lowertype = lowercaseFirstLetter(of: type)
                    let memory = getMemoryAddress(squareAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = lowertype
                    annotaionDict["title"] = squareAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = squareAnnotation.contents
                    
                    if squareAnnotation.modificationDate() != nil {
                        annotaionDict["createDate"] = Int(squareAnnotation.modificationDate().timeIntervalSince1970 * 1000)
                    }
                    let rectDict = [
                        "bottom": squareAnnotation.bounds.origin.y,
                        "left": squareAnnotation.bounds.origin.x,
                        "top": squareAnnotation.bounds.origin.y + squareAnnotation.bounds.size.height,
                        "right": squareAnnotation.bounds.origin.x + squareAnnotation.bounds.size.width
                    ]
                    annotaionDict["rect"] = rectDict
                    annotaionDict["borderWidth"] = squareAnnotation.borderWidth
                    annotaionDict["borderColor"] = squareAnnotation.color?.toHexString()
                    annotaionDict["borderAlpha"] = squareAnnotation.opacity * 255.0
                    annotaionDict["fillColor"] = squareAnnotation.interiorColor?.toHexString()
                    annotaionDict["fillAlpha"] = squareAnnotation.interiorOpacity * 255.0
                    let borderEeffect: CPDFBorderEffectType = squareAnnotation.borderEffect?.borderEffectType ?? .solid
                    switch borderEeffect {
                    case .solid:
                        annotaionDict["bordEffectType"] = "solid"
                    case .cloudy:
                        annotaionDict["bordEffectType"] = "cloudy"
                    @unknown default:
                        annotaionDict["bordEffectType"] = "solid"
                    }
                }
            case "Line", "Arrow":
                if let lineAnnotation = annoation as? CPDFLineAnnotation {
                    let lowertype = lowercaseFirstLetter(of: type)
                    let memory = getMemoryAddress(lineAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = lowertype
                    annotaionDict["title"] = lineAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = lineAnnotation.contents
                    
                    if lineAnnotation.modificationDate() != nil {
                        annotaionDict["createDate"] = Int(lineAnnotation.modificationDate().timeIntervalSince1970 * 1000)
                    }
                    let rectDict = [
                        "bottom": lineAnnotation.bounds.origin.y,
                        "left": lineAnnotation.bounds.origin.x,
                        "top": lineAnnotation.bounds.origin.y + lineAnnotation.bounds.size.height,
                        "right": lineAnnotation.bounds.origin.x + lineAnnotation.bounds.size.width
                    ]
                    annotaionDict["rect"] = rectDict
                    annotaionDict["borderWidth"] = lineAnnotation.borderWidth
                    annotaionDict["borderColor"] = lineAnnotation.color?.toHexString()
                    annotaionDict["borderAlpha"] = lineAnnotation.opacity * 255.0
                    annotaionDict["fillColor"] = lineAnnotation.interiorColor?.toHexString()
                    annotaionDict["fillAlpha"] = lineAnnotation.interiorOpacity * 255.0
                    let startLineStyle = lineAnnotation.startLineStyle
                    let endLineStyle = lineAnnotation.endLineStyle
                    annotaionDict["lineHeadType"] = getLineStyle(startLineStyle)
                    annotaionDict["lineTailType"] = getLineStyle(endLineStyle)
                }
            case "Freehand":
                if let inkAnnotation = annoation as? CPDFInkAnnotation {
                    let memory = getMemoryAddress(inkAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = "ink"
                    annotaionDict["title"] = inkAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = inkAnnotation.contents
                    
                    if inkAnnotation.modificationDate() != nil {
                        annotaionDict["createDate"] = Int(inkAnnotation.modificationDate().timeIntervalSince1970  * 1000)
                    }
                    annotaionDict["color"] = inkAnnotation.color?.toHexString()
                    annotaionDict["alpha"] = inkAnnotation.opacity * 255.0
                    let rectDict = [
                        "bottom": inkAnnotation.bounds.origin.y,
                        "left": inkAnnotation.bounds.origin.x,
                        "top": inkAnnotation.bounds.origin.y + inkAnnotation.bounds.size.height,
                        "right": inkAnnotation.bounds.origin.x + inkAnnotation.bounds.size.width
                    ]
                    annotaionDict["rect"] = rectDict
                    annotaionDict["borderWidth"] = inkAnnotation.borderWidth
                }
                
            case "Note":
                if let noteAnnotation = annoation as? CPDFTextAnnotation {
                    let lowertype = lowercaseFirstLetter(of: type)
                    let memory = getMemoryAddress(noteAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = lowertype
                    annotaionDict["title"] = noteAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = noteAnnotation.contents
                    
                    if noteAnnotation.modificationDate() != nil {
                        annotaionDict["createDate"] = Int(noteAnnotation.modificationDate().timeIntervalSince1970 * 1000)
                    }
                    let rectDict = [
                        "bottom": noteAnnotation.bounds.origin.y,
                        "left": noteAnnotation.bounds.origin.x,
                        "top": noteAnnotation.bounds.origin.y + noteAnnotation.bounds.size.height,
                        "right": noteAnnotation.bounds.origin.x + noteAnnotation.bounds.size.width
                    ]
                    annotaionDict["rect"] = rectDict
                }
                
            case "FreeText":
                if let freeTextAnnotation = annoation as? CPDFFreeTextAnnotation {
                    let memory = getMemoryAddress(freeTextAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = "freetext"
                    annotaionDict["title"] = freeTextAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = freeTextAnnotation.contents
                    
                    if freeTextAnnotation.modificationDate() != nil {
                        annotaionDict["createDate"] = Int(freeTextAnnotation.modificationDate().timeIntervalSince1970 * 1000)
                    }
                    annotaionDict["color"] = freeTextAnnotation.color?.toHexString()
                    annotaionDict["alpha"] = freeTextAnnotation.opacity * 255.0
                    let rectDict = [
                        "bottom": freeTextAnnotation.bounds.origin.y,
                        "left": freeTextAnnotation.bounds.origin.x,
                        "top": freeTextAnnotation.bounds.origin.y + freeTextAnnotation.bounds.size.height,
                        "right": freeTextAnnotation.bounds.origin.x + freeTextAnnotation.bounds.size.width
                    ]
                    annotaionDict["rect"] = rectDict
                    let alignment = freeTextAnnotation.alignment
                    switch alignment {
                    case .left:
                        annotaionDict["alignment"] = "left"
                    case .center:
                        annotaionDict["alignment"] = "center"
                    case .right:
                        annotaionDict["alignment"] = "right"
                    default:
                        annotaionDict["alignment"] = "left"
                    }
                    
                    let fontDict: [String: Any] = [
                        "fontSize": freeTextAnnotation.fontSize,
                        "familyName": freeTextAnnotation.cFont.familyName,
                        "styleName": freeTextAnnotation.cFont.styleName ?? "",
                        "fontColor": freeTextAnnotation.fontColor?.toHexString() ?? ""
                    ]
                    annotaionDict["textAttribute"] = fontDict
                }
                
            case "Stamp", "Image":
                if let stampAnnotation = annoation as? CPDFStampAnnotation {
                    let lowertype = lowercaseFirstLetter(of: type)
                    let memory = getMemoryAddress(stampAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = lowertype
                    if type == "Image" {
                        annotaionDict["type"] = "pictures"
                    }
                    annotaionDict["title"] = stampAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = stampAnnotation.contents
                    if stampAnnotation.modificationDate() != nil {
                        annotaionDict["createDate"] = Int(stampAnnotation.modificationDate().timeIntervalSince1970  * 1000)
                    }
                    let rectDict = [
                        "bottom": stampAnnotation.bounds.origin.y,
                        "left": stampAnnotation.bounds.origin.x,
                        "top": stampAnnotation.bounds.origin.y + stampAnnotation.bounds.size.height,
                        "right": stampAnnotation.bounds.origin.x + stampAnnotation.bounds.size.width
                    ]
                    annotaionDict["rect"] = rectDict
                }
                
            case "Link":
                if let linkAnnotation = annoation as? CPDFLinkAnnotation {
                    let lowertype = lowercaseFirstLetter(of: type)
                    let memory = getMemoryAddress(linkAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = lowertype
                    annotaionDict["title"] = linkAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = linkAnnotation.contents
                    
                    if linkAnnotation.modificationDate() != nil {
                        annotaionDict["createDate"] = Int(linkAnnotation.modificationDate().timeIntervalSince1970 * 1000)
                    }
                    let rectDict = [
                        "bottom": linkAnnotation.bounds.origin.y,
                        "left": linkAnnotation.bounds.origin.x,
                        "top": linkAnnotation.bounds.origin.y + linkAnnotation.bounds.size.height,
                        "right": linkAnnotation.bounds.origin.x + linkAnnotation.bounds.size.width
                    ]
                    annotaionDict["rect"] = rectDict
                    var actionDict: [String: Any] = [:];
                    if (linkAnnotation.url() != nil) {
                        actionDict["actionType"] = "uri"
                        actionDict["uri"] = linkAnnotation.url()
                    } else {
                        actionDict["actionType"] = "goTo"
                        actionDict["pageIndex"] = linkAnnotation.destination()?.pageIndex ?? 0
                    }
                    annotaionDict["action"] = actionDict
                }
                
            case "Media":
                if let mediaAnnotation = annoation as? CPDFSoundAnnotation {
                    let memory = getMemoryAddress(mediaAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = "sound"
                    annotaionDict["title"] = mediaAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = mediaAnnotation.contents
                    
                    if mediaAnnotation.modificationDate() != nil {
                        annotaionDict["createDate"] = Int(mediaAnnotation.modificationDate().timeIntervalSince1970 * 1000)
                    }
                    let rectDict = [
                        "bottom": mediaAnnotation.bounds.origin.y,
                        "left": mediaAnnotation.bounds.origin.x,
                        "top": mediaAnnotation.bounds.origin.y + mediaAnnotation.bounds.size.height,
                        "right": mediaAnnotation.bounds.origin.x + mediaAnnotation.bounds.size.width
                    ]
                    annotaionDict["rect"] = rectDict
                }
            case "":
                if let signatureAnnotation = annoation as? CPDFSignatureAnnotation {
                    let memory = getMemoryAddress(signatureAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = "signature"
                    annotaionDict["title"] = signatureAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = signatureAnnotation.contents
                    
                    if signatureAnnotation.modificationDate() != nil {
                        annotaionDict["createDate"] = Int(signatureAnnotation.modificationDate().timeIntervalSince1970 * 1000)
                    }
                    let rectDict = [
                        "bottom": signatureAnnotation.bounds.origin.y,
                        "left": signatureAnnotation.bounds.origin.x,
                        "top": signatureAnnotation.bounds.origin.y + signatureAnnotation.bounds.size.height,
                        "right": signatureAnnotation.bounds.origin.x + signatureAnnotation.bounds.size.width
                    ]
                    annotaionDict["rect"] = rectDict
                }
                    
            default:
                print("Unhandled type: \(type)")
            }
            
            if annotaionDict["type"] != nil {
                annotaionDicts.append(annotaionDict)
            }
        }
        
        return annotaionDicts
    }
    
    func getForms() -> [Dictionary<String, Any>] {
        var formDicts:[Dictionary<String, Any>] = []

        let forms = page?.annotations ?? []
        
        for form in forms {
            var formDict: [String : Any] = [:]
            
            let type: String = form.type
            if form.type == "Widget" {
                if let widgetAnnotation = form as? CPDFWidgetAnnotation {
                    let widgetType: String = widgetAnnotation.widgetType
                    
                    switch widgetType {
                    case "CheckBox", "RadioButton", "PushButton":
                        if let buttonWidget = form as? CPDFButtonWidgetAnnotation {
                            let lowertype = lowercaseFirstLetter(of: widgetType)
                            let memory = getMemoryAddress(buttonWidget)
                            
                            formDict["uuid"] = memory
                            formDict["type"] = lowertype
                            formDict["title"] = buttonWidget.fieldName()
                            formDict["page"] = pageIndex
                            
                            if buttonWidget.modificationDate() != nil {
                                formDict["createDate"] = Int(buttonWidget.modificationDate().timeIntervalSince1970 * 1000)
                            }
                            let rectDict = [
                                "bottom": buttonWidget.bounds.origin.y,
                                "left": buttonWidget.bounds.origin.x,
                                "top": buttonWidget.bounds.origin.y + buttonWidget.bounds.size.height,
                                "right": buttonWidget.bounds.origin.x + buttonWidget.bounds.size.width
                            ]
                            formDict["rect"] = rectDict
                            formDict["borderWidget"] = buttonWidget.borderWidth
                            formDict["borderColor"] = buttonWidget.borderColor?.toHexString()
                            formDict["fillColor"] = buttonWidget.backgroundColor?.toHexString()

                            if widgetType == "PushButton" {
                                formDict["buttonTitle"] = buttonWidget.caption()
                                var actionDict: [String: Any] = [:]
                                let action = buttonWidget.action
                                if let urlActions = action as? CPDFURLAction {
                                    actionDict["actionType"] = "uri"
                                    actionDict["uri"] = urlActions.url()
                                } else if let gotoAction = action as? CPDFGoToAction {
                                    actionDict["actionType"] = "goTo"
                                    actionDict["pageIndex"] = gotoAction.destination()?.pageIndex ?? 0
                                }
                                
                                formDict["action"] = actionDict
                                formDict["familyName"] = buttonWidget.cFont.familyName
                                formDict["styleName"] = buttonWidget.cFont.styleName ?? ""
                                formDict["fontSize"] = buttonWidget.fontSize
                                formDict["fontColor"] = buttonWidget.fontColor?.toHexString()
                            } else {
                                let isOn = buttonWidget.state()
                                if (isOn != 0) {
                                    formDict["isChecked"] = true
                                } else {
                                    formDict["isChecked"] = false
                                }
                                
                                let checkStyle = buttonWidget.widgetCheckStyle()
                                formDict["checkStyle"] = getCheckStyle(checkStyle)
                                formDict["checkColor"] = buttonWidget.fontColor?.toHexString()
                            }
                        }
                        
                    case "TextField":
                        if let textFieldWidget = form as? CPDFTextWidgetAnnotation {
                            let lowertype = lowercaseFirstLetter(of: widgetType)
                            let memory = getMemoryAddress(textFieldWidget)
                            
                            formDict["uuid"] = memory
                            formDict["type"] = lowertype
                            formDict["title"] = textFieldWidget.fieldName()
                            formDict["page"] = pageIndex
                            formDict["text"] = textFieldWidget.stringValue
                            
                            if textFieldWidget.modificationDate() != nil {
                                formDict["createDate"] = Int(textFieldWidget.modificationDate().timeIntervalSince1970 * 1000)
                            }
                            let rectDict = [
                                "bottom": textFieldWidget.bounds.origin.y,
                                "left": textFieldWidget.bounds.origin.x,
                                "top": textFieldWidget.bounds.origin.y + textFieldWidget.bounds.size.height,
                                "right": textFieldWidget.bounds.origin.x + textFieldWidget.bounds.size.width
                            ]
                            formDict["rect"] = rectDict
                            formDict["borderWidget"] = textFieldWidget.borderWidth
                            formDict["familyName"] = textFieldWidget.cFont.familyName
                            formDict["styleName"] = textFieldWidget.cFont.styleName ?? ""
                            formDict["fontSize"] = textFieldWidget.fontSize
                            formDict["fontColor"] = textFieldWidget.fontColor?.toHexString()
                            formDict["borderColor"] = textFieldWidget.borderColor?.toHexString()
                            formDict["fillColor"] = textFieldWidget.backgroundColor?.toHexString()
                            formDict["isMultiline"] = textFieldWidget.isMultiline
                            formDict["text"] = textFieldWidget.stringValue
                            
                            let alignment = textFieldWidget.alignment
                            switch alignment {
                            case .left:
                                formDict["alignment"] = "left"
                            case .center:
                                formDict["alignment"] = "center"
                            case .right:
                                formDict["alignment"] = "right"
                            default:
                                formDict["alignment"] = "left"
                            }
                        }
                        
                    case "ListBox", "ComboBox":
                        if let choiceWidget = form as? CPDFChoiceWidgetAnnotation {
                            let lowertype = lowercaseFirstLetter(of: widgetType)
                            let memory = getMemoryAddress(choiceWidget)
                            
                            formDict["uuid"] = memory
                            formDict["type"] = lowertype
                            formDict["title"] = choiceWidget.fieldName()
                            formDict["page"] = pageIndex
                            
                            if choiceWidget.modificationDate() != nil {
                                formDict["createDate"] = Int(choiceWidget.modificationDate().timeIntervalSince1970 * 1000)
                            }
                            let rectDict = [
                                "bottom": choiceWidget.bounds.origin.y,
                                "left": choiceWidget.bounds.origin.x,
                                "top": choiceWidget.bounds.origin.y + choiceWidget.bounds.size.height,
                                "right": choiceWidget.bounds.origin.x + choiceWidget.bounds.size.width
                            ]
                            formDict["rect"] = rectDict
                            formDict["borderWidget"] = choiceWidget.borderWidth
                            formDict["familyName"] = choiceWidget.cFont.familyName
                            formDict["styleName"] = choiceWidget.cFont.styleName ?? ""
                            formDict["fontSize"] = choiceWidget.fontSize
                            formDict["fontColor"] = choiceWidget.fontColor?.toHexString()
                            formDict["borderColor"] = choiceWidget.borderColor?.toHexString()
                            formDict["fillColor"] = choiceWidget.backgroundColor?.toHexString()
                            formDict["selectedIndexes"] = [choiceWidget.selectItemAtIndex]

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
                        if let signatureWidget = form as? CPDFSignatureWidgetAnnotation {
                            let memory = getMemoryAddress(signatureWidget)
                            
                            formDict["uuid"] = memory
                            formDict["type"] = "signaturesFields"
                            formDict["title"] = signatureWidget.fieldName()
                            formDict["page"] = pageIndex
                            
                            if signatureWidget.modificationDate() != nil {
                                formDict["createDate"] = Int(signatureWidget.modificationDate().timeIntervalSince1970 * 1000)
                            }
                            let rectDict = [
                                "bottom": signatureWidget.bounds.origin.y,
                                "left": signatureWidget.bounds.origin.x,
                                "top": signatureWidget.bounds.origin.y + signatureWidget.bounds.size.height,
                                "right": signatureWidget.bounds.origin.x + signatureWidget.bounds.size.width
                            ]
                            formDict["rect"] = rectDict
                            formDict["borderWidget"] = signatureWidget.borderWidth
                            formDict["borderColor"] = signatureWidget.borderColor?.toHexString()
                            formDict["fillColor"] = signatureWidget.backgroundColor?.toHexString()
                        }
                        
                    default:
                        print("Unhandled type: \(type)")
                    }
                    
                    formDicts.append(formDict)
                }
            }
        }
    
        return formDicts
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
            print("removeAnnotation():page is nil? :\(page == nil)")
            page?.removeAnnotation(annotation)
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
    
    func addWidgetImageSignature(uuid: String, imagePath: URL, completionHandler: @escaping (Bool) -> Void) {
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
    
    //MARK: - Private Methods
    
    func getCheckStyle(_ checkStyle: CPDFWidgetButtonStyle) -> String {
        switch checkStyle {
        case .none:
            return "none"
        case .check:
            return "check"
        case .cross:
            return "cross"
        case .circle:
            return "circle"
        case .diamond:
            return "diamond"
        case .square:
            return "square"
        case .star:
            return "star"
        default:
            return "check"
        }
    }
    
    func getLineStyle(_ lineStyle: CPDFLineStyle) -> String {
        switch lineStyle {
        case .none:
            return "none"
        case .openArrow:
            return "openArrow"
        case .closedArrow:
            return "closedArrow"
        case .circle:
            return "circle"
        case .square:
            return "square"
        case .diamond:
            return "diamond"
        default:
            return "none"
        }
    }
    
    func getAnnotation(formUUID uuid: String) -> CPDFAnnotation? {
        let annoations = page?.annotations ?? []
        
        for  annoation in annoations {
            let type: String = annoation.type
            if annoation.type == "Widget" {
                continue
            }
            
            let _uuid = getMemoryAddress(annoation)
            
            if _uuid == uuid {
                return annoation
            }
        }
        
        return nil
    }
    
    func getForm(formUUID uuid: String) -> CPDFWidgetAnnotation? {
        let annoations = page?.annotations ?? []
        print(("getForm(): page is nil?: \(page == nil), annotations:\(annoations.count)"))
        for  annoation in annoations {
            let type: String = annoation.type
            print(("getForm(): type:\(type)"))
            if annoation.type == "Widget" {
                if let widgetAnnotation = annoation as? CPDFWidgetAnnotation {
                    
                    let _uuid = getMemoryAddress(annoation)
                    print(("getForm(): formUUID: \(uuid)"))
                    if _uuid == uuid {
                        print(("getForm(): return widgetAnnotation----"))
                        return widgetAnnotation
                    }
                }
            }
        }
        print(("getForm(): return nil"))
        return nil
    }

    
    func lowercaseFirstLetter(of string: String) -> String {
        guard !string.isEmpty else { return string }
        
        let lowercaseString = string.prefix(1).lowercased() + string.dropFirst()
        
        return lowercaseString
    }
    
    func getMemoryAddress<T: AnyObject>(_ object: T) -> String {
        let pointer = Unmanaged.passUnretained(object).toOpaque()
        return String(describing: pointer)
    }

    
}
