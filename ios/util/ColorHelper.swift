//
//  ColorHelper.swift
//  compdfkit_flutter
//
//  Copyright © 2014-2023 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.

import UIKit

class ColorHelper {
  static func colorWithHexString (hex:String) -> UIColor {
      var hexString = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
      
      if hexString.hasPrefix("#") {
          hexString.remove(at: hexString.startIndex)
      }
      
      if hexString.count == 8 {
          var rgba: UInt64 = 0
          Scanner(string: hexString).scanHexInt64(&rgba)
          
          let a = CGFloat((rgba >> 24) & 0xFF) / 255.0
          let r = CGFloat((rgba >> 16) & 0xFF) / 255.0
          let g = CGFloat((rgba >> 8) & 0xFF) / 255.0
          let b = CGFloat(rgba & 0xFF) / 255.0
          
          return UIColor(red: r, green: g, blue: b, alpha: a)
      } else {
          return UIColor(white: 0.0, alpha: 0.0)
      }
  }
  
  static func alphaFromHex(_ hex: String) -> CGFloat? {
      let s = hex.trimmingCharacters(in: .whitespacesAndNewlines)
          .replacingOccurrences(of: "#", with: "")
      guard s.count == 8 else { return nil }
      let aStr = String(s.prefix(2))
      guard let a = UInt8(aStr, radix: 16) else { return nil }
      return CGFloat(a) / 255.0
  }
}

extension UIColor {
    func toHexString() -> String? {
        var red: CGFloat = 0
        var green: CGFloat = 0
        var blue: CGFloat = 0
        var alpha: CGFloat = 0
        
        guard self.getRed(&red, green: &green, blue: &blue, alpha: &alpha) else {
            return nil
        }
        
        let rgb: Int = (Int)(red * 255) << 16 | (Int)(green * 255) << 8 | (Int)(blue * 255) << 0
        
        return String(format: "#%06x", rgb)
    }
  
  func toHexARGBString(alpha a: CGFloat? = nil) -> String? {
      var r: CGFloat = 0
      var g: CGFloat = 0
      var b: CGFloat = 0
      var alphaFromColor: CGFloat = 0

      guard self.getRed(&r, green: &g, blue: &b, alpha: &alphaFromColor) else {
          return nil
      }

      func toByte(_ x: CGFloat) -> UInt8 {
          let v = Int((max(0, min(1, x)) * 255.0).rounded())
          return UInt8(max(0, min(255, v)))
      }

      let rr = toByte(r)
      let gg = toByte(g)
      let bb = toByte(b)
      let aa = toByte(a ?? alphaFromColor)

      return String(format: "#%02X%02X%02X%02X", aa, rr, gg, bb)
  }
}
