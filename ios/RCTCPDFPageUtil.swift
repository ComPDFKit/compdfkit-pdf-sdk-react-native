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
                }
            case "Freehand":
                if let inkAnnotation = annoation as? CPDFInkAnnotation {
                    let memory = getMemoryAddress(inkAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = "ink"
                    annotaionDict["title"] = inkAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = inkAnnotation.contents
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
                }
                
            case "FreeText":
                if let freeTextAnnotation = annoation as? CPDFFreeTextAnnotation {
                    let memory = getMemoryAddress(freeTextAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = "freetext"
                    annotaionDict["title"] = freeTextAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = freeTextAnnotation.contents
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
                }
                
            case "Media":
                if let mediaAnnotation = annoation as? CPDFSoundAnnotation {
                    let memory = getMemoryAddress(mediaAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = "sound"
                    annotaionDict["title"] = mediaAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = mediaAnnotation.contents
                }
            case "":
                if let signatureAnnotation = annoation as? CPDFSignatureAnnotation {
                    let memory = getMemoryAddress(signatureAnnotation)
                    
                    annotaionDict["uuid"] = memory
                    annotaionDict["type"] = "signature"
                    annotaionDict["title"] = signatureAnnotation.userName()
                    annotaionDict["page"] = pageIndex
                    annotaionDict["content"] = signatureAnnotation.contents
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
                            if widgetType != "PushButton" {
                                let isOn = buttonWidget.state()
                                if (isOn != 0) {
                                    formDict["isChecked"] = true
                                } else {
                                    formDict["isChecked"] = false
                                }
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
                        }
                        
                    case "ListBox", "ComboBox":
                        if let choiceWidget = form as? CPDFChoiceWidgetAnnotation {
                            let lowertype = lowercaseFirstLetter(of: widgetType)
                            let memory = getMemoryAddress(choiceWidget)
                            
                            formDict["uuid"] = memory
                            formDict["type"] = lowertype
                            formDict["title"] = choiceWidget.fieldName()
                            formDict["page"] = pageIndex
                        }
                        
                    case "SignatureFields":
                        if let signatureWidget = form as? CPDFSignatureWidgetAnnotation {
                            let memory = getMemoryAddress(signatureWidget)
                            
                            formDict["uuid"] = memory
                            formDict["type"] = "signaturesFields"
                            formDict["title"] = signatureWidget.fieldName()
                            formDict["page"] = pageIndex
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
    
    func updateAp(uuid: String) {
        if let widget = self.getForm(formUUID: uuid) {
            widget.updateAppearanceStream()
        } else if let annotation = self.getAnnotation(formUUID: uuid) {
            annotation.updateAppearanceStream()
        }
    }
    
    //MARK: - Private Methods
    
    
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
        
        for  annoation in annoations {
            let type: String = annoation.type
            if annoation.type == "Widget" {
                if let widgetAnnotation = annoation as? CPDFWidgetAnnotation {
                    
                    let _uuid = getMemoryAddress(annoation)
                    
                    if _uuid == uuid {
                        return widgetAnnotation
                    }
                }
            }
        }
        
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
