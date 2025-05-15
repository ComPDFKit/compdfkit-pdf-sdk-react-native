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
        
        // 检查颜色字符串是否有效
        if hexString.hasPrefix("#") {
            hexString.remove(at: hexString.startIndex)
        }
        
        // 确保字符串长度是8（包括透明度部分）
        if hexString.count == 8 {
            var rgba: UInt64 = 0
            Scanner(string: hexString).scanHexInt64(&rgba)
            
            let a = CGFloat((rgba >> 24) & 0xFF) / 255.0
            let r = CGFloat((rgba >> 16) & 0xFF) / 255.0
            let g = CGFloat((rgba >> 8) & 0xFF) / 255.0
            let b = CGFloat(rgba & 0xFF) / 255.0
            
            return UIColor(red: r, green: g, blue: b, alpha: a)
        } else {
            // 如果不是合法的8位Hex，返回透明的颜色或其他默认值
            return UIColor(white: 0.0, alpha: 0.0)
        }
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
}
