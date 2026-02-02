//
//  CPDFUtil.swift
//  compdfkit_flutter
//
//  Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

class CPDFUtil {
    
    static func getMemoryAddress<T: AnyObject>(_ object: T) -> String {
        let pointer = Unmanaged.passUnretained(object).toOpaque()
        return String(describing: pointer)
    }
    
    // Debug-only logging helper. Prints the message only in Debug builds, prefixed with a tag.
    static func log(_ message: @autoclosure () -> String) {
        #if DEBUG
        print("ComPDFKit-iOS: \(message())")
        #endif
    }
    
    static func roundToTwoDecimals(_ value: Double) -> Double {
        return Double(round(100 * value) / 100)
    }
    
    static func lowercaseFirstLetter(of string: String) -> String {
        guard !string.isEmpty else { return string }
        let lowercaseString = string.prefix(1).lowercased() + string.dropFirst()
        return lowercaseString
    }
}
