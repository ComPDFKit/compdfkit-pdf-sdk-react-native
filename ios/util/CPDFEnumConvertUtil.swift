//
//  CPDFEnumConvertUtil.swift
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

class CPDFEnumConvertUtil {
  
  static func lineStyleToString(_ lineStyle: CPDFLineStyle) -> String {
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
  
  static func stringToLineStyle(_ str: String) -> CPDFLineStyle {
    switch str {
    case "none":
      return .none
    case "openArrow":
      return .openArrow
    case "closedArrow":
      return .closedArrow
    case "circle":
      return .circle
    case "square":
      return .square
    case "diamond":
      return .diamond
    default:
      return .none
    }
  }
  
  static func textAlignmentToString(_ alignment: NSTextAlignment) -> String {
    switch alignment {
    case .left:
      return "left"
    case .center:
      return "center"
    case .right:
      return "right"
    default:
      return "left"
    }
  }
  
  static func stringToTextAlignment(_ str: String) -> NSTextAlignment {
    switch str {
    case "left":
      return .left
    case "center":
      return .center
    case "right":
      return .right
    default:
      return .left
    }
  }
  
  static func widgetButtonStyleToString(_ buttonStyle: CPDFWidgetButtonStyle) -> String {
    switch buttonStyle {
    case .check:
      return "check"
    case .circle:
      return "circle"
    case .cross:
      return "cross"
    case .diamond:
      return "diamond"
    case .square:
      return "square"
    case .star:
      return "star"
    default:
      return "none"
    }
  }
  
  static func stringToWidgetButtonStyle(_ str: String) -> CPDFWidgetButtonStyle {
    switch str {
    case "check":
      return .check
    case "circle":
      return .circle
    case "cross":
      return .cross
    case "diamond":
      return .diamond
    case "square":
      return .square
    case "star":
      return .star
    default:
      return .none
    }
  }
  
  static func borderEffectToString(borderEffectType: CPDFBorderEffectType) -> String {
    switch borderEffectType {
    case .solid:
      return "solid"
    case .cloudy:
      return "cloudy"
    default:
      return "solid"
    }
  }
  
  static func stringToBorderEffect(_str: String) -> CPDFBorderEffectType {
    switch _str {
    case "cloudy":
      return .cloudy
    default:
      return .solid
    }
  }
  
  static func stringToStandardStamp(_ stampString: String) -> Int {
    switch stampString {
    case "Approved":
      return 1
    case "NotApproved":
      return 2
    case "Draft":
      return 3
    case "Final":
      return 4
    case "Completed":
      return 5
    case "Confidential":
      return 6
    case "ForPublicRelease":
      return 7
    case "NotForPublicRelease":
      return 8
    case "ForComment":
      return 9
    case "Void":
      return 10
    case "PreliminaryResults":
      return 11
    case "InformationOnly":
      return 12
    case "Witness":
      return 13
    case "InitialHere":
      return 14
    case "SignHere":
      return 15
    case "Revised":
      return 16
    case "Accepted":
      return 17
    case "Rejected":
      return 18
    case "PrivateMark#1":
      return 19   // privateaccepted
    case "PrivateMark#2":
      return 20   // privaterejected
    case "PrivateMark#3":
      return 21   // privateradiomark
    default:
      return 0
    }
  }
  
  static func standardStampToString(_ stampValue: Int) -> String {
    switch stampValue {
    case 1:
      return "Approved"
    case 2:
      return "NotApproved"
    case 3:
      return "Draft"
    case 4:
      return "Final"
    case 5:
      return "Completed"
    case 6:
      return "Confidential"
    case 7:
      return "ForPublicRelease"
    case 8:
      return "NotForPublicRelease"
    case 9:
      return "ForComment"
    case 10:
      return "Void"
    case 11:
      return "PreliminaryResults"
    case 12:
      return "InformationOnly"
    case 13:
      return "Witness"
    case 14:
      return "InitialHere"
    case 15:
      return "SignHere"
    case 16:
      return "Revised"
    case 17:
      return "Accepted"
    case 18:
      return "Rejected"
    case 19:
      return "PrivateMark#1" // privateaccepted
    case 20:
      return "PrivateMark#2" // privaterejected
    case 21:
      return "PrivateMark#3" // privateradiomark
    default:
      return "unknown"
    }
  }
  
  static func stringToStampStyle(_ stampStyleString: String) -> CPDFStampStyle {
    switch stampStyleString {
    case "red":
      return .red
    case "white":
      return .white
    case "blue":
      return .blue
    case "green":
      return .green
    default:
      return .white
    }
  }
  
  static func stringToStampShape(_ stampShapeString: String) -> CPDFStampShape {
    switch stampShapeString {
    case "rect":
      return .rectangle
    case "leftTriangle":
      return .arrowLeft
    case "rightTriangle":
      return .arrowRight
    case "none":
      return .none
    default:
      return .none
    }
  }
  
  static func stampStyleToString(_ stampStyle: CPDFStampStyle) -> String {
    switch stampStyle {
    case .red:
      return "red"
    case .white:
      return "white"
    case .blue:
      return "blue"
    case .green:
      return "green"
    default:
      return "white"
    }
  }
  
  static func stampShapeToString(_ stampShape: CPDFStampShape) -> String {
    switch stampShape {
    case .rectangle:
      return "rect"
    case .arrowLeft:
      return "leftTriangle"
    case .arrowRight:
      return "rightTriangle"
    case .none:
      return "none"
    default:
      return "none"
    }
  }
  
}
