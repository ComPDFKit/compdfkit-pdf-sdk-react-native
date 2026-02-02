//
//  CPDFAnnotAttrUtil.swift
//  compdfkit_flutter
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
import Foundation
import UniformTypeIdentifiers


class CPDFAnnotAttrUtil {
    
    //MARK: - Get default annotation attribute
    
    
    static func getDefaultAnnotAttributes() -> Dictionary<String, Any>  {
        var annotaionDict: Dictionary<String, Any> = [:]
        annotaionDict["note"] = getNoteAttr()
        annotaionDict["highlight"] = getHighlightAttr()
        annotaionDict["underline"] = getUnderlineAttr()
        annotaionDict["squiggly"] = getSquigglyAttr()
        annotaionDict["strikeout"] = getStrikeoutAttr()
        annotaionDict["ink"] = getInkAttr()
        annotaionDict["square"] = getSquareAttr()
        annotaionDict["circle"] = getCircleAttr()
        annotaionDict["line"] = getLineAttr()
        annotaionDict["arrow"] = getArrowAttr()
        annotaionDict["freetext"] = getFreeTextAttr()
        return annotaionDict;
    }
    
    private static func getNoteAttr() -> Dictionary<String, Any> {
        let noteStyle = CAnnotStyle(annotionMode: .note, annotations: [])
        var noteAttrDict: Dictionary<String, Any> = [:]
        noteAttrDict["color"] = noteStyle.color?.toHexString()
        noteAttrDict["alpha"] = (noteStyle.opacity * 255.0 * 100).rounded() / 100
        return noteAttrDict
    }
    
    private static func getHighlightAttr() -> Dictionary<String, Any> {
        let highlightStyle = CAnnotStyle(annotionMode: .highlight, annotations: [])
        var highlightAttrDict: Dictionary<String, Any> = [:]
        highlightAttrDict["color"] = highlightStyle.color?.toHexString()
        highlightAttrDict["alpha"] = (highlightStyle.opacity * 255.0 * 100).rounded() / 100
        return highlightAttrDict
    }
    
    private static func getUnderlineAttr() -> Dictionary<String, Any> {
        let underlineStyle = CAnnotStyle(annotionMode: .underline, annotations: [])
        var underlineAttrDict: Dictionary<String, Any> = [:]
        underlineAttrDict["color"] = underlineStyle.color?.toHexString()
        underlineAttrDict["alpha"] = (underlineStyle.opacity * 255.0 * 100).rounded() / 100
        return underlineAttrDict
    }
    
    private static func getSquigglyAttr() -> Dictionary<String, Any> {
        let squigglyStyle = CAnnotStyle(annotionMode: .squiggly, annotations: [])
        var squigglyAttrDict: Dictionary<String, Any> = [:]
        squigglyAttrDict["color"] = squigglyStyle.color?.toHexString()
        squigglyAttrDict["alpha"] = (squigglyStyle.opacity * 255.0 * 100).rounded() / 100
        return squigglyAttrDict
    }
    
    private static func getStrikeoutAttr() -> Dictionary<String, Any> {
        let strikeoutStyle = CAnnotStyle(annotionMode: .strikeout, annotations: [])
        var strikeoutAttrDict: Dictionary<String, Any> = [:]
        strikeoutAttrDict["color"] = strikeoutStyle.color?.toHexString()
        strikeoutAttrDict["alpha"] = (strikeoutStyle.opacity * 255.0 * 100).rounded() / 100
        return strikeoutAttrDict
    }
    
    private static func getInkAttr() -> Dictionary<String, Any> {
        let inkStyle = CAnnotStyle(annotionMode: .ink, annotations: [])
        var inkAttrDict: Dictionary<String, Any> = [:]
        inkAttrDict["color"] = inkStyle.color?.toHexString()
        inkAttrDict["alpha"] = (inkStyle.opacity * 255.0 * 100).rounded() / 100
        inkAttrDict["borderWidth"] = inkStyle.lineWidth
        return inkAttrDict
    }
    
    private static func getSquareAttr() -> Dictionary<String, Any> {
        let squareStyle = CAnnotStyle(annotionMode: .square, annotations: [])
        var squareAttrDict: Dictionary<String, Any> = [:]
        squareAttrDict["fillColor"] = squareStyle.interiorColor?.toHexString()
        squareAttrDict["borderColor"] = squareStyle.color?.toHexString()
        squareAttrDict["colorAlpha"] = (squareStyle.opacity * 255.0 * 100).rounded() / 100
        squareAttrDict["borderWidth"] = squareStyle.lineWidth
        var borderStyleDict: Dictionary<String, Any> = [:]
        if(squareStyle.style == .dashed){
            borderStyleDict["style"] = "dashed"
        } else {
            borderStyleDict["style"] = "solid"
        }
        borderStyleDict["width"] = squareStyle.lineWidth
        borderStyleDict["dashGap"] = Double(truncating: squareStyle.dashPattern.last ?? 0)
        squareAttrDict["borderStyle"] = borderStyleDict
        return squareAttrDict
    }
    
    private static func getCircleAttr() -> Dictionary<String, Any> {
        let circleStyle = CAnnotStyle(annotionMode: .circle, annotations: [])
        var circleAttrDict: Dictionary<String, Any> = [:]
        circleAttrDict["fillColor"] = circleStyle.interiorColor?.toHexString()
        circleAttrDict["borderColor"] = circleStyle.color?.toHexString()
        circleAttrDict["colorAlpha"] = (circleStyle.opacity * 255.0 * 100).rounded() / 100
        circleAttrDict["borderWidth"] = circleStyle.lineWidth
        var borderStyleDict: Dictionary<String, Any> = [:]
        if(circleStyle.style == .dashed){
            borderStyleDict["style"] = "dashed"
        } else {
            borderStyleDict["style"] = "solid"
        }
        borderStyleDict["width"] = circleStyle.lineWidth
        borderStyleDict["dashGap"] = Double(truncating: circleStyle.dashPattern.last ?? 0)
        circleAttrDict["borderStyle"] = borderStyleDict
        return circleAttrDict
    }
    
    private static func getLineAttr() -> Dictionary<String, Any> {
        let lineStyle = CAnnotStyle(annotionMode: .line, annotations: [])
        var lineAttrDict: Dictionary<String, Any> = [:]
        lineAttrDict["fillColor"] = lineStyle.color?.toHexString()
        lineAttrDict["borderColor"] = lineStyle.color?.toHexString()
        lineAttrDict["borderAlpha"] = (lineStyle.opacity * 255.0 * 100).rounded() / 100
        lineAttrDict["borderWidth"] = lineStyle.lineWidth
        var borderStyleDict: Dictionary<String, Any> = [:]
        if(lineStyle.style == .dashed){
            borderStyleDict["style"] = "dashed"
        } else {
            borderStyleDict["style"] = "solid"
        }
        borderStyleDict["width"] = lineStyle.lineWidth
        borderStyleDict["dashGap"] = Double(truncating: lineStyle.dashPattern.last ?? 0)
        lineAttrDict["borderStyle"] = borderStyleDict
        return lineAttrDict
    }
    
    private static func getArrowAttr() -> Dictionary<String, Any> {
        let arrowStyle = CAnnotStyle(annotionMode: .arrow, annotations: [])
        var arrowAttrDict: Dictionary<String, Any> = [:]
        arrowAttrDict["fillColor"] = arrowStyle.color?.toHexString()
        arrowAttrDict["borderColor"] = arrowStyle.color?.toHexString()
        arrowAttrDict["borderAlpha"] = (arrowStyle.opacity * 255.0 * 100).rounded() / 100
        arrowAttrDict["borderWidth"] = arrowStyle.lineWidth
        var borderStyleDict: Dictionary<String, Any> = [:]
        if(arrowStyle.style == .dashed){
            borderStyleDict["style"] = "dashed"
        } else {
            borderStyleDict["style"] = "solid"
        }
        borderStyleDict["width"] = arrowStyle.lineWidth
        borderStyleDict["dashGap"] = Double(truncating: arrowStyle.dashPattern.last ?? 0)
        arrowAttrDict["borderStyle"] = borderStyleDict
        
        arrowAttrDict["startLineType"] = CPDFEnumConvertUtil.lineStyleToString(arrowStyle.startLineStyle)
        arrowAttrDict["tailLineType"] = CPDFEnumConvertUtil.lineStyleToString(arrowStyle.endLineStyle)
        
        return arrowAttrDict
    }
    
    
    private static func getFreeTextAttr() -> Dictionary<String, Any> {
        let freeTextStyle = CAnnotStyle(annotionMode: .freeText, annotations: [])
        var freeTextAttrDict: Dictionary<String, Any> = [:]
        freeTextAttrDict["fontColor"] = freeTextStyle.fontColor?.toHexString()
        freeTextAttrDict["fontSize"] = freeTextStyle.fontSize
        freeTextAttrDict["fontColorAlpha"] = (freeTextStyle.opacity * 255.0 * 100).rounded() / 100
        freeTextAttrDict["alignment"] = CPDFEnumConvertUtil.textAlignmentToString(freeTextStyle.alignment)
        freeTextAttrDict["familyName"] = freeTextStyle.newCFont.familyName
        freeTextAttrDict["styleName"] = freeTextStyle.newCFont.styleName
        return freeTextAttrDict
    }
    
    //MARK: - Set default annotation attribute
    
    
    public static func setAnnotDefaultAttr(type : String, attrDict : Dictionary<String, Any>){
        let userDefaults = UserDefaults.standard
        switch(type){
        case "note":
            for (innerKey, innerValue) in attrDict {
                if innerKey == "color" {
                    
                    let string = innerValue as? String ?? ""
                    let color = ColorHelper.colorWithHexString(hex: string)
                    userDefaults.setPDFListViewColor(color, forKey: CAnchoredNoteColorKey)
                } else if innerKey == "alpha" {
                    let opacity = innerValue as? CGFloat ?? 10
                    userDefaults.set(opacity / 255.0, forKey: CAnchoredNoteOpacityKey)
                }
            }
        case "highlight":
            for (innerKey, innerValue) in attrDict {
                if innerKey == "color" {
                    let string = innerValue as? String ?? ""
                    let color = ColorHelper.colorWithHexString(hex: string)
                    userDefaults.setPDFListViewColor(color, forKey: CHighlightNoteColorKey)
                } else if innerKey == "alpha" {
                    let opacity = innerValue as? CGFloat ?? 10
                    userDefaults.set(opacity / 255.0, forKey: CHighlightNoteOpacityKey)
                }
            }
        case "underline":
            for (innerKey, innerValue) in attrDict {
                if innerKey == "color" {
                    let string = innerValue as? String ?? ""
                    let color = ColorHelper.colorWithHexString(hex: string)
                    userDefaults.setPDFListViewColor(color, forKey: CUnderlineNoteColorKey)
                } else if innerKey == "alpha" {
                    let opacity = innerValue as? CGFloat ?? 10
                    userDefaults.set(opacity / 255.0, forKey: CUnderlineNoteOpacityKey)
                }
            }
        case "squiggly":
            for (innerKey, innerValue) in attrDict {
                if innerKey == "color" {
                    let string = innerValue as? String ?? ""
                    let color = ColorHelper.colorWithHexString(hex: string)
                    userDefaults.setPDFListViewColor(color, forKey: CSquigglyNoteColorKey)
                } else if innerKey == "alpha" {
                    let opacity = innerValue as? CGFloat ?? 10
                    userDefaults.set(opacity / 255.0, forKey: CSquigglyNoteOpacityKey)
                }
            }
        case "strikeout":
            for (innerKey, innerValue) in attrDict {
                if innerKey == "color" {
                    let string = innerValue as? String ?? ""
                    let color = ColorHelper.colorWithHexString(hex: string)
                    userDefaults.setPDFListViewColor(color, forKey: CStrikeOutNoteColorKey)
                } else if innerKey == "alpha" {
                    let opacity = innerValue as? CGFloat ?? 10
                    userDefaults.set(opacity / 255.0, forKey: CStrikeOutNoteOpacityKey)
                }
            }
        case "ink":
            for (innerKey, innerValue) in attrDict {
                if innerKey == "color" {
                    let string = innerValue as? String ?? ""
                    let color = ColorHelper.colorWithHexString(hex: string)
                    CPDFKitConfig.sharedInstance().setFreehandAnnotationColor(color)
                } else if innerKey == "alpha" {
                    let opacity = innerValue as? CGFloat ?? 10
                    CPDFKitConfig.sharedInstance().setFreehandAnnotationOpacity((opacity / 255.0) * 100)
                } else if innerKey == "borderWidth" {
                    let borderWidth = innerValue as? CGFloat ?? 1
                    CPDFKitConfig.sharedInstance().setFreehandAnnotationBorderWidth(borderWidth)
                }
            }
        case "square":
            for (innerKey, innerValue) in attrDict {
                if innerKey == "fillColor" {
                    let string = innerValue as? String ?? ""
                    let color = ColorHelper.colorWithHexString(hex: string)
                    userDefaults.setPDFListViewColor(color, forKey: CSquareNoteInteriorColorKey)
                } else if innerKey == "borderColor" {
                    let string = innerValue as? String ?? ""
                    let color = ColorHelper.colorWithHexString(hex: string)
                    userDefaults.setPDFListViewColor(color, forKey: CSquareNoteColorKey)
                } else if innerKey == "colorAlpha" {
                    let opacity = innerValue as? CGFloat ?? 10
                    userDefaults.set(opacity / 255.0, forKey: CSquareNoteOpacityKey)
                    userDefaults.set(opacity / 255.0, forKey: CSquareNoteInteriorOpacityKey)
                }  else if innerKey == "borderWidth" {
                    let borderWidth = innerValue as? CGFloat ?? 1
                    userDefaults.set(borderWidth, forKey: CSquareNoteLineWidthKey)
                } else if innerKey == "borderStyle" {
                    if let innerDict = innerValue as? [String: Any] {
                        for (innerSubKey, innerSubValue) in innerDict {
                            if innerSubKey == "style" {
                                let innerValueString = innerSubValue as? String ?? ""
                                if innerValueString == "solid" {
                                    userDefaults.set(0, forKey: CSquareNoteLineStyleKey)
                                } else if innerValueString == "dashed" {
                                    userDefaults.set(1, forKey: CSquareNoteLineStyleKey)
                                }
                            } else if innerSubKey == "dashGap" {
                                let dashPattern = innerSubValue as? Int ?? 0
                                userDefaults.set(dashPattern, forKey:  CSquareNoteDashPatternKey )
                            }
                        }
                    }
                }
            }
        case "circle":
            for (innerKey, innerValue) in attrDict {
                if innerKey == "fillColor" {
                    let string = innerValue as? String ?? ""
                    let color = ColorHelper.colorWithHexString(hex: string)
                    userDefaults.setPDFListViewColor(color, forKey: CCircleNoteInteriorColorKey)
                } else if innerKey == "borderColor" {
                    let string = innerValue as? String ?? ""
                    let color = ColorHelper.colorWithHexString(hex: string)
                    userDefaults.setPDFListViewColor(color, forKey: CCircleNoteColorKey)
                } else if innerKey == "colorAlpha" {
                    let opacity = innerValue as? CGFloat ?? 10
                    userDefaults.set(opacity / 255.0, forKey: CCircleNoteOpacityKey)
                    userDefaults.set(opacity / 255.0, forKey: CCircleNoteInteriorOpacityKey)
                }  else if innerKey == "borderWidth" {
                    let borderWidth = innerValue as? CGFloat ?? 1
                    userDefaults.set(borderWidth, forKey: CCircleNoteLineWidthKey)
                } else if innerKey == "borderStyle" {
                    if let innerDict = innerValue as? [String: Any] {
                        for (innerSubKey, innerSubValue) in innerDict {
                            if innerSubKey == "style" {
                                let innerValueString = innerSubValue as? String ?? ""
                                if innerValueString == "solid" {
                                    userDefaults.set(0, forKey: CCircleNoteLineStyleKey)
                                } else if innerValueString == "dashed" {
                                    userDefaults.set(1, forKey: CCircleNoteLineStyleKey)
                                }
                            } else if innerSubKey == "dashGap" {
                                let dashPattern = innerSubValue as? Int ?? 0
                                userDefaults.set(dashPattern, forKey:  CCircleNoteDashPatternKey )
                            }
                        }
                    }
                }
            }
        case "line":
            for (innerKey, innerValue) in attrDict {
                if innerKey == "borderColor" {
                    let string = innerValue as? String ?? ""
                    let color = ColorHelper.colorWithHexString(hex: string)
                    userDefaults.setPDFListViewColor(color, forKey: CLineNoteColorKey)
                } else if innerKey == "borderAlpha" {
                    let opacity = innerValue as? CGFloat ?? 10
                    userDefaults.set(opacity / 255.0, forKey: CLineNoteOpacityKey)
                }  else if innerKey == "borderWidth" {
                    let borderWidth = innerValue as? CGFloat ?? 1
                    userDefaults.set(borderWidth, forKey: CLineNoteLineWidthKey)
                } else if innerKey == "borderStyle" {
                    if let innerDict = innerValue as? [String: Any] {
                        for (innerSubKey, innerSubValue) in innerDict {
                            if innerSubKey == "style" {
                                let innerValueString = innerSubValue as? String ?? ""
                                if innerValueString == "solid" {
                                    userDefaults.set(0, forKey: CLineNoteLineStyleKey)
                                } else if innerValueString == "dashed" {
                                    userDefaults.set(1, forKey: CLineNoteLineStyleKey)
                                }
                            } else if innerSubKey == "dashGap" {
                                let dashPattern = innerSubValue as? Int ?? 0
                                userDefaults.set(dashPattern, forKey:  CLineNoteDashPatternKey )
                            }
                        }
                    }
                }
            }
            userDefaults.set(0, forKey: CLineNoteStartStyleKey)
            userDefaults.set(0, forKey: CLineNoteEndStyleKey)
        case "arrow":
            for (innerKey, innerValue) in attrDict {
                if innerKey == "borderColor" {
                    let string = innerValue as? String ?? ""
                    let color = ColorHelper.colorWithHexString(hex: string)
                    userDefaults.setPDFListViewColor(color, forKey: CArrowNoteColorKey)
                } else if innerKey == "borderAlpha" {
                    let opacity = innerValue as? CGFloat ?? 10
                    userDefaults.set(opacity / 255.0, forKey: CArrowNoteOpacityKey)
                }  else if innerKey == "borderWidth" {
                    let borderWidth = innerValue as? CGFloat ?? 1
                    userDefaults.set(borderWidth, forKey: CArrowNoteLineWidthKey)
                } else if innerKey == "borderStyle" {
                    if let innerDict = innerValue as? [String: Any] {
                        for (innerSubKey, innerSubValue) in innerDict {
                            if innerSubKey == "style" {
                                let innerValueString = innerSubValue as? String ?? ""
                                if innerValueString == "solid" {
                                    userDefaults.set(0, forKey: CArrowNoteLineStyleKey)
                                } else if innerValueString == "dashed" {
                                    userDefaults.set(1, forKey: CArrowNoteLineStyleKey)
                                }
                            } else if innerSubKey == "dashGap" {
                                let dashPattern = innerSubValue as? Int ?? 0
                                userDefaults.set(dashPattern, forKey:  CArrowNoteDashPatternKey )
                            }
                        }
                    }
                } else if innerKey == "startLineType" {
                    let innerValueString = innerValue as? String ?? ""
                    if innerValueString == "none" {
                        userDefaults.set(0, forKey: CArrowNoteStartStyleKey)
                    } else if innerValueString == "openArrow" {
                        userDefaults.set(1, forKey: CArrowNoteStartStyleKey)
                    } else if innerValueString == "closedArrow" {
                        userDefaults.set(2, forKey: CArrowNoteStartStyleKey)
                    } else if innerValueString == "square" {
                        userDefaults.set(3, forKey: CArrowNoteStartStyleKey)
                    } else if innerValueString == "circle" {
                        userDefaults.set(4, forKey: CArrowNoteStartStyleKey)
                    } else if innerValueString == "diamond" {
                        userDefaults.set(5, forKey: CArrowNoteStartStyleKey)
                    }
                } else if innerKey == "tailLineType" {
                    let innerValueString = innerValue as? String ?? ""
                    if innerValueString == "none" {
                        userDefaults.set(0, forKey: CArrowNoteEndStyleKey)
                    } else if innerValueString == "openArrow" {
                        userDefaults.set(1, forKey: CArrowNoteEndStyleKey)
                    } else if innerValueString == "closedArrow" {
                        userDefaults.set(2, forKey: CArrowNoteEndStyleKey)
                    } else if innerValueString == "square" {
                        userDefaults.set(3, forKey: CArrowNoteEndStyleKey)
                    } else if innerValueString == "circle" {
                        userDefaults.set(4, forKey: CArrowNoteEndStyleKey)
                    } else if innerValueString == "diamond" {
                        userDefaults.set(5, forKey: CArrowNoteEndStyleKey)
                    }
                }
            }
        case "freetext":
            for (innerKey, innerValue) in attrDict {
                if innerKey == "fontColor" {
                    let string = innerValue as? String ?? ""
                    let color = ColorHelper.colorWithHexString(hex: string)
                    userDefaults.setPDFListViewColor(color, forKey: CFreeTextNoteFontColorKey)
                } else if innerKey == "fontColorAlpha" {
                    let opacity = innerValue as? CGFloat ?? 10
                    userDefaults.set(opacity / 255.0, forKey: CFreeTextNoteOpacityKey)
                } else if innerKey == "fontSize" {
                    let fontSize = innerValue as? CGFloat ?? 10
                    userDefaults.set(fontSize, forKey: CFreeTextNoteFontSizeKey)
                } else if innerKey == "familyName" {
                    let familyName = innerValue as? String ?? "Helvetica"
                    userDefaults.set(familyName, forKey: CFreeTextNoteFontFamilyNameKey)
                } else if innerKey == "styleName" {
                    let styleName = innerValue as? String ?? ""
                    userDefaults.set(styleName, forKey: CFreeTextNoteFontNewStyleKey)
                } else if innerKey == "alignment" {
                    let string = innerValue as? String ?? ""
                    
                    if string == "left" {
                        userDefaults.set(0, forKey: CFreeTextNoteAlignmentKey)
                    } else if string == "center" {
                        userDefaults.set(1, forKey: CFreeTextNoteAlignmentKey)
                    } else if string == "right" {
                        userDefaults.set(2, forKey: CFreeTextNoteAlignmentKey)
                    }
                }
            }
            
        default:
            break;
        }
        
        userDefaults.synchronize()
    }
    
    //MARK: - get default widget attribute
    public static func getDefaultWidgetAttributes() -> Dictionary<String, Any>  {
        var widgetDict: Dictionary<String, Any> = [:]
        widgetDict["textField"] = getTextFieldAttr()
        widgetDict["checkBox"] = getCheckBoxAttr()
        widgetDict["radioButton"] = getRadioButtonAttr()
        widgetDict["comboBox"] = getComboBoxAttr()
        widgetDict["listBox"] = getListBoxAttr()
        widgetDict["pushButton"] = getPushButtonAttr()
        widgetDict["signaturesFields"] = getFormSignatureFieldsAttr()
        return widgetDict;
    }
    
    
    private static func getTextFieldAttr() -> Dictionary<String, Any> {
        let style = CFormStyle(formMode: .formModeText)
        var dict: Dictionary<String, Any> = [:]
        dict["fillColor"] = style.interiorColor?.toHexString()
        dict["borderColor"] = style.color?.toHexString()
        dict["borderWidth"] = style.lineWidth
        dict["fontColor"] = style.fontColor?.toHexString()
        dict["fontSize"] = style.fontSize
        dict["alignment"] = CPDFEnumConvertUtil.textAlignmentToString(style.textAlignment)
        dict["multiline"] = style.isMultiline
        dict["familyName"] = style.fontFamilyName
        dict["styleName"] = style.fontStyleName
        return dict
    }
    
    private static func getCheckBoxAttr() -> Dictionary<String, Any> {
        let style = CFormStyle(formMode: .formModeCheckBox)
        var dict: Dictionary<String, Any> = [:]
        dict["fillColor"] = style.interiorColor?.toHexString()
        dict["borderColor"] = style.color?.toHexString()
        dict["borderWidth"] = style.lineWidth
        dict["checkedColor"] = style.checkedColor?.toHexString()
        dict["isChecked"] = style.isChecked
        dict["checkedStyle"] = CPDFEnumConvertUtil.widgetButtonStyleToString(style.checkedStyle)
        return dict
    }
    
    private static func getRadioButtonAttr() -> Dictionary<String, Any> {
        let style = CFormStyle(formMode: .formModeRadioButton)
        var dict: Dictionary<String, Any> = [:]
        dict["fillColor"] = style.interiorColor?.toHexString()
        dict["borderColor"] = style.color?.toHexString()
        dict["borderWidth"] = style.lineWidth
        dict["checkedColor"] = style.checkedColor?.toHexString()
        dict["isChecked"] = style.isChecked
        dict["checkedStyle"] = CPDFEnumConvertUtil.widgetButtonStyleToString(style.checkedStyle)
        return dict
    }
    
    private static func getListBoxAttr() -> Dictionary<String, Any> {
        let style = CFormStyle(formMode: .formModeList)
        var dict: Dictionary<String, Any> = [:]
        dict["fillColor"] = style.interiorColor?.toHexString()
        dict["borderColor"] = style.color?.toHexString()
        dict["borderWidth"] = style.lineWidth
        dict["fontColor"] = style.fontColor?.toHexString()
        dict["fontSize"] = style.fontSize
        dict["familyName"] = style.fontFamilyName
        dict["styleName"] = style.fontStyleName
        return dict
    }
    
    private static func getComboBoxAttr() -> Dictionary<String, Any> {
        let style = CFormStyle(formMode: .formModeCombox)
        var dict: Dictionary<String, Any> = [:]
        dict["fillColor"] = style.interiorColor?.toHexString()
        dict["borderColor"] = style.color?.toHexString()
        dict["borderWidth"] = style.lineWidth
        dict["fontColor"] = style.fontColor?.toHexString()
        dict["fontSize"] = style.fontSize
        dict["familyName"] = style.fontFamilyName
        dict["styleName"] = style.fontStyleName
        return dict
    }
    
    private static func getFormSignatureFieldsAttr() -> Dictionary<String, Any> {
        let style = CFormStyle(formMode: .formModeSign)
        var dict: Dictionary<String, Any> = [:]
        dict["fillColor"] = style.interiorColor?.toHexString()
        dict["borderColor"] = style.color?.toHexString()
        dict["borderWidth"] = style.lineWidth
        return dict
    }
    
    
    private static func getPushButtonAttr() -> Dictionary<String, Any> {
        let style = CFormStyle(formMode: .formModeButton)
        var dict: Dictionary<String, Any> = [:]
        dict["fillColor"] = style.interiorColor?.toHexString()
        dict["borderColor"] = style.color?.toHexString()
        dict["borderWidth"] = style.lineWidth
        dict["fontColor"] = style.fontColor?.toHexString()
        dict["fontSize"] = style.fontSize
        dict["familyName"] = style.fontFamilyName
        dict["styleName"] = style.fontStyleName
        dict["title"] = style.title
        return dict
    }
    
    
    //MARK: - Set default widget attribute
    
    public static func setWidgetDefaultAttr(type : String, attrDict : Dictionary<String, Any>){
        let userDefaults = UserDefaults.standard
        if type == "textField" {
            if let innerDict = attrDict as? [String: Any] {
                for (innerKey, innerValue) in innerDict {
                    if innerKey == "fillColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CTextFieldInteriorColorKey)
                    } else if innerKey == "borderColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CTextFieldColorKey)
                    } else if innerKey == "borderWidth" {
                        let borderWidth = innerValue as? CGFloat ?? 1
                        userDefaults.set(borderWidth, forKey: CTextFieldLineWidthKey)
                    } else if innerKey == "fontColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CTextFieldFontColorKey)
                    } else if innerKey == "fontSize" {
                        let fontSize = innerValue as? CGFloat ?? 10
                        userDefaults.set(fontSize, forKey: CTextFieldFontSizeKey)
                    } else if innerKey == "familyName" {
                        let familyName = innerValue as? String ?? "Helvetica"
                        userDefaults.set(familyName, forKey: CTextFieldFontFamilyNameKey)
                    } else if innerKey == "styleName" {
                        let styleName = innerValue as? String ?? ""
                        userDefaults.set(styleName, forKey: CTextFieldFontStyleNameKey)
                    } else if innerKey == "alignment" {
                        let string = innerValue as? String ?? ""
                        if string == "left" {
                            userDefaults.set(0, forKey: CTextFieldAlignmentKey)
                        } else if string == "center" {
                            userDefaults.set(1, forKey: CTextFieldAlignmentKey)
                        } else if string == "right" {
                            userDefaults.set(2, forKey: CTextFieldAlignmentKey)
                        }
                    } else if innerKey == "multiline" {
                        let multiline = innerValue as? Bool ?? false
                        userDefaults.set(multiline, forKey: CTextFieldIsMultilineKey)
                    }
                }
            }
        } else if type == "checkBox" {
            if let innerDict = attrDict as? [String: Any] {
                for (innerKey, innerValue) in innerDict {
                    if innerKey == "fillColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CCheckBoxInteriorColorKey)
                    } else if innerKey == "borderColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CCheckBoxColorKey)
                    } else if innerKey == "borderWidth" {
                        let borderWidth = innerValue as? CGFloat ?? 1
                        userDefaults.set(borderWidth, forKey: CCheckBoxLineWidthKey)
                    } else if innerKey == "checkedColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CCheckBoxCheckedColorKey)
                    } else if innerKey == "isChecked" {
                        let isChecked = innerValue as? Bool ?? false
                        userDefaults.set(isChecked, forKey: CCheckBoxIsCheckedKey)
                    } else if innerKey == "checkedStyle" {
                        let string = innerValue as? String ?? ""
                        if string == "check" {
                            userDefaults.set(0, forKey: CCheckBoxCheckedStyleKey)
                        } else if string == "circle" {
                            userDefaults.set(1, forKey: CCheckBoxCheckedStyleKey)
                        } else if string == "cross" {
                            userDefaults.set(2, forKey: CCheckBoxCheckedStyleKey)
                        } else if string == "diamond" {
                            userDefaults.set(3, forKey: CCheckBoxCheckedStyleKey)
                        } else if string == "square" {
                            userDefaults.set(4, forKey: CCheckBoxCheckedStyleKey)
                        } else if string == "star" {
                            userDefaults.set(5, forKey: CCheckBoxCheckedStyleKey)
                        }
                    }
                }
            }
        } else if type == "radioButton" {
            if let innerDict = attrDict as? [String: Any] {
                for (innerKey, innerValue) in innerDict {
                    if innerKey == "fillColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CRadioButtonInteriorColorKey)
                    } else if innerKey == "borderColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CRadioButtonColorKey)
                    } else if innerKey == "borderWidth" {
                        let borderWidth = innerValue as? CGFloat ?? 1
                        userDefaults.set(borderWidth, forKey: CRadioButtonLineWidthKey)
                    } else if innerKey == "checkedColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CRadioButtonCheckedColorKey)
                    } else if innerKey == "isChecked" {
                        let isChecked = innerValue as? Bool ?? false
                        userDefaults.set(isChecked, forKey: CRadioButtonIsCheckedKey)
                    } else if innerKey == "checkedStyle" {
                        let string = innerValue as? String ?? ""
                        if string == "check" {
                            userDefaults.set(0, forKey: CRadioButtonCheckedStyleKey)
                        } else if string == "circle" {
                            userDefaults.set(1, forKey: CRadioButtonCheckedStyleKey)
                        } else if string == "cross" {
                            userDefaults.set(2, forKey: CRadioButtonCheckedStyleKey)
                        } else if string == "diamond" {
                            userDefaults.set(3, forKey: CRadioButtonCheckedStyleKey)
                        } else if string == "square" {
                            userDefaults.set(4, forKey: CRadioButtonCheckedStyleKey)
                        } else if string == "star" {
                            userDefaults.set(5, forKey: CRadioButtonCheckedStyleKey)
                        }
                    }
                }
            }
        } else if type == "listBox" {
            if let innerDict = attrDict as? [String: Any] {
                
                for (innerKey, innerValue) in innerDict {
                    if innerKey == "fillColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CListBoxInteriorColorKey)
                    } else if innerKey == "borderColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CListBoxColorKey)
                    } else if innerKey == "borderWidth" {
                        let borderWidth = innerValue as? CGFloat ?? 1
                        userDefaults.set(borderWidth, forKey: CListBoxLineWidthKey)
                    } else if innerKey == "fontColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CListBoxFontColorKey)
                    } else if innerKey == "fontSize" {
                        let fontSize = innerValue as? CGFloat ?? 10
                        userDefaults.set(fontSize, forKey: CListBoxFontSizeKey)
                    }  else if innerKey == "familyName" {
                        let familyName = innerValue as? String ?? "Helvetica"
                        userDefaults.set(familyName, forKey: CListBoxFontFamilyNameKey)
                    } else if innerKey == "styleName" {
                        let styleName = innerValue as? String ?? ""
                        userDefaults.set(styleName, forKey: CListBoxFontStyleNameKey)
                    }
                }
            }
        } else if type == "comboBox" {
            if let innerDict = attrDict as? [String: Any] {
                for (innerKey, innerValue) in innerDict {
                    if innerKey == "fillColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CComboBoxInteriorColorKey)
                    } else if innerKey == "borderColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CComboBoxColorKey)
                    } else if innerKey == "borderWidth" {
                        let borderWidth = innerValue as? CGFloat ?? 1
                        userDefaults.set(borderWidth, forKey: CComboBoxLineWidthKey)
                    } else if innerKey == "fontColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CComboBoxFontColorKey)
                    } else if innerKey == "fontSize" {
                        let fontSize = innerValue as? CGFloat ?? 10
                        userDefaults.set(fontSize, forKey: CComboBoxFontSizeKey)
                    }  else if innerKey == "familyName" {
                        let familyName = innerValue as? String ?? "Helvetica"
                        print("ComBoBox FamilyName:\(familyName)")
                        userDefaults.set(familyName, forKey: CComboBoxFontFamilyNameKey)
                    } else if innerKey == "styleName" {
                        let styleName = innerValue as? String ?? ""
                        print("ComBoBox StyleName:\(styleName)")
                        userDefaults.set(styleName, forKey: CComboBoxFontStyleNameKey)
                    }
                }
            }
        } else if type == "pushButton" {
            if let innerDict = attrDict as? [String: Any] {
                for (innerKey, innerValue) in innerDict {
                    if innerKey == "fillColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CPushButtonInteriorColorKey)
                    } else if innerKey == "borderColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CPushButtonColorKey)
                    } else if innerKey == "borderWidth" {
                        let borderWidth = innerValue as? CGFloat ?? 1
                        userDefaults.set(borderWidth, forKey: CPushButtonLineWidthKey)
                    } else if innerKey == "fontColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CPushButtonFontColorKey)
                    } else if innerKey == "fontSize" {
                        let fontSize = innerValue as? CGFloat ?? 10
                        userDefaults.set(fontSize, forKey: CPushButtonFontSizeKey)
                    }   else if innerKey == "familyName" {
                        let familyName = innerValue as? String ?? "Helvetica"
                        userDefaults.set(familyName, forKey: CPushButtonFontFamilyNameKey)
                    } else if innerKey == "styleName" {
                        let styleName = innerValue as? String ?? ""
                        userDefaults.set(styleName, forKey: CPushButtonFontStyleNameKey)
                    } else if innerKey == "title" {
                        let string = innerValue as? String ?? ""
                        userDefaults.set(string, forKey: CPushButtonTitleKey)
                    }
                }
            }
        } else if type == "signaturesFields" {
            if let innerDict = attrDict as? [String: Any] {
                for (innerKey, innerValue) in innerDict {
                    if innerKey == "fillColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CSignaturesFieldsInteriorColorKey)
                    } else if innerKey == "borderColor" {
                        let string = innerValue as? String ?? ""
                        let color = ColorHelper.colorWithHexString(hex: string)
                        userDefaults.setPDFListViewColor(color, forKey: CSignaturesFieldsColorKey)
                    } else if innerKey == "borderWidth" {
                        let borderWidth = innerValue as? CGFloat ?? 1
                        userDefaults.set(borderWidth, forKey: CSignaturesFieldsLineWidthKey)
                    } else if innerKey == "borderStyle" {
                        let string = innerValue as? String ?? ""
                        
                        if string == "solid" {
                            userDefaults.set(0, forKey: CSignaturesFieldsLineStyleKey)
                        } else if string == "dashed" {
                            userDefaults.set(1, forKey: CSignaturesFieldsLineStyleKey)
                        } else if string == "beveled" {
                            userDefaults.set(2, forKey: CSignaturesFieldsLineStyleKey)
                        } else if string == "inset" {
                            userDefaults.set(3, forKey: CSignaturesFieldsLineStyleKey)
                        } else if string == "underline" {
                            userDefaults.set(4, forKey: CSignaturesFieldsLineStyleKey)
                        }
                    }
                }
            }
        }
        userDefaults.synchronize()
    }
}
