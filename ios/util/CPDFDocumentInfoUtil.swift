//  CPDFDocumentInfoUtil.swift
//  compdfkit_flutter
//
//  Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//


import Foundation
import ComPDFKit
import ComPDFKit_Tools


public class CPDFDocumentInfoUtil {
    
    
    static func getDocumentInfo(from document: CPDFDocument?) -> [String: Any] {
        var documentInfo: [String: Any] = [:]
        
        guard let document = document,
              let documentAttributes = document.documentAttributes() else {
            return documentInfo
        }
        
        documentInfo["title"] = documentAttributes[.titleAttribute] as? String
        documentInfo["author"] = documentAttributes[.authorAttribute] as? String
        documentInfo["subject"] = documentAttributes[.subjectAttribute] as? String
        documentInfo["creator"] = documentAttributes[.creatorAttribute] as? String
        documentInfo["keywords"] = documentAttributes[.keywordsAttribute] as? String
        
        if let creationDateString = documentAttributes[.creationDateAttribute] as? String {
            documentInfo["creationDate"] = convertPDFDateToTimestamp(creationDateString)
        }
        
        if let modificationDateString = documentAttributes[.modificationDateAttribute] as? String {
            documentInfo["modificationDate"] = convertPDFDateToTimestamp(modificationDateString)
        }
        
        return documentInfo
    }
    
    
    private static func convertPDFDateToTimestamp(_ pdfDateString: String) -> Int? {
        guard let date = parsePDFDateString(pdfDateString) else {
            return nil
        }
        return Int(date.timeIntervalSince1970 * 1000)
    }
    
    private static func parsePDFDateString(_ pdfDateString: String) -> Date? {
        let formattedDateString = formatPDFDateString(pdfDateString)
        
        guard !formattedDateString.isEmpty else {
            return nil
        }
        
        return parseFormattedDateString(formattedDateString)
    }
    
    private static func formatPDFDateString(_ pdfDateString: String) -> String {
        guard pdfDateString.count >= 16 else {
            return ""
        }
        
        let startIndex = pdfDateString.index(pdfDateString.startIndex, offsetBy: 2)
        
        let year = extractSubstring(from: pdfDateString, startIndex: startIndex, offset: 0, length: 4)
        let month = extractSubstring(from: pdfDateString, startIndex: startIndex, offset: 4, length: 2)
        let day = extractSubstring(from: pdfDateString, startIndex: startIndex, offset: 6, length: 2)
        let hour = extractSubstring(from: pdfDateString, startIndex: startIndex, offset: 8, length: 2)
        let minute = extractSubstring(from: pdfDateString, startIndex: startIndex, offset: 10, length: 2)
        let second = extractSubstring(from: pdfDateString, startIndex: startIndex, offset: 12, length: 2)
        let formattedString = "\(year)-\(month)-\(day) \(hour):\(minute):\(second)"
        return formattedString
    }
    

    private static func extractSubstring(from string: String,
                                         startIndex: String.Index,
                                         offset: Int,
                                         length: Int) -> String {
        let rangeStart = string.index(startIndex, offsetBy: offset)
        let rangeEnd = string.index(rangeStart, offsetBy: length)
        return String(string[rangeStart..<rangeEnd])
    }

    
    private static func parseFormattedDateString(_ dateString: String) -> Date? {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
        formatter.locale = Locale(identifier: "en_US_POSIX")
        return formatter.date(from: dateString)
    }
    
    static func getPermissionsInfo(document : CPDFDocument?) -> [String: Any] {
        var permissionsInfo: [String: Any] = [:]
        if(document == nil){
            return permissionsInfo;
        }
        permissionsInfo["allowsPrinting"] = document!.allowsPrinting
        permissionsInfo["allowsHighQualityPrinting"] = document!.allowsHighQualityPrinting
        permissionsInfo["allowsCopying"] = document!.allowsCopying
        permissionsInfo["allowsDocumentChanges"] = document!.allowsDocumentChanges
        permissionsInfo["allowsDocumentAssembly"] = document!.allowsDocumentAssembly
        permissionsInfo["allowsCommenting"] = document!.allowsCommenting
        permissionsInfo["allowsFormFieldEntry"] = document!.allowsFormFieldEntry
        return permissionsInfo
    }
    
}
