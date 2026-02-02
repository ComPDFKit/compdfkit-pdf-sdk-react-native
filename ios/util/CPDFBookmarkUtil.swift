//
//  CPDFBookmarkUtil.swift
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

class CPDFBookmarkUtil {
    
    
    static func getBookmarks(document: CPDFDocument?) -> [Dictionary<String, Any>] {
        var bookmarksDict: [Dictionary<String, Any>] = []
        guard let bookmarks = document?.bookmarks() else {
            return []
        }
        
        for bookmark in bookmarks.reversed() {
            var dict: [String: Any] = [:]
            dict["pageIndex"] = bookmark.pageIndex
            dict["title"] = bookmark.label ?? ""
            dict["uuid"] = CPDFUtil.getMemoryAddress(bookmark)
            if (bookmark.date != nil) {
                dict["date"] = Int(bookmark.date.timeIntervalSince1970 * 1000)
            }
            bookmarksDict.append(dict)
        }
        return bookmarksDict;
    }
    
    static func updateBookmark(document: CPDFDocument?, uuid: String, title: String) -> Bool {
        let bookmarks = document?.bookmarks() ?? []
        if let bookmark = bookmarks.first(where: { CPDFUtil.getMemoryAddress($0) == uuid }) {
            bookmark.label = title
            return true;
        }else {
            return false;
        }
    }
}
