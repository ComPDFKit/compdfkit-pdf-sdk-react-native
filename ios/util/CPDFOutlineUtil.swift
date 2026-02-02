//
//  CPDFOutlineUtil.swift
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

class CPDFOutlineUtil {
    
    static func newOutlineRoot(document: CPDFDocument?) -> [String : Any]? {
        guard let document = document else {
            CPDFUtil.log("Document is nil")
            return nil
        }
        
        let outlineRoot = document.outlineRoot()
        if outlineRoot == nil {
            document.setNewOutlineRoot()
        }
        return getOutline(document)
    }

    
    static func getOutline(_ document: CPDFDocument?) -> [String: Any]? {
        guard let document = document else {
            CPDFUtil.log("Document is nil")
            return nil
        }

        guard let outlineRoot = document.outlineRoot(),
              let dict = self.convertOutlineToDict(outlineRoot) else {
            CPDFUtil.log("== No Outline Found ==")
            return nil
        }

        return dict
    }
    
    
    static func convertOutlineToDict(_ outline: CPDFOutline?, level: Int = 0) -> [String: Any]? {
        guard let outline = outline else {
            CPDFUtil.log("convertOutlineToDict Outline is nil")
            return nil }
        
        var dict: [String: Any] = [:]
        
        dict["title"] = outline.label ?? ""
        dict["level"] = level
        dict["tag"] = ""
        dict["uuid"] = CPDFUtil.getMemoryAddress(outline)
    
        
        var actionDict: [String: Any] = [:]
        if outline.action is CPDFGoToAction {
            actionDict["actionType"] = "goTo"
            actionDict["pageIndex"] = (outline.action as? CPDFGoToAction)?.destination()?.pageIndex ?? 0
            dict["action"] = actionDict
        } else if let action = outline.action as? CPDFURLAction {
            actionDict["actionType"] = "uri"
            actionDict["uri"] = action.url() ?? ""
            dict["action"] = actionDict
        }
        
        let destination = outline.destination
        
        if let dest = destination {
            dict["destination"] = [
                "pageIndex": dest.pageIndex,
                "zoom": dest.zoom,
                "positionX": dest.point.x,
                "positionY": dest.point.y,
            ]
            
            if(dict["action"] == nil){
                actionDict["actionType"] = "goTo"
                actionDict["pageIndex"] = dest.pageIndex
                dict["action"] = actionDict
            }
        }
        
        
        var children: [[String: Any]] = []
        for i in 0..<outline.numberOfChildren {
            if let child = outline.child(at: i),
               let childDict = convertOutlineToDict(child, level: level + 1) {
                children.append(childDict)
            }
        }
        
        dict["childList"] = children
        
        return dict
    }
    

    
    static func findOutlineByUuid(
        document: CPDFDocument?,
        uuid: String
    ) -> CPDFOutline? {
        guard let root = document?.outlineRoot() else {
            return nil
        }
        return findOutline(outline: root, uuid: uuid)
    }

    private static func findOutline(
        outline: CPDFOutline,
        uuid: String
    ) -> CPDFOutline? {

        let outlineUuid = CPDFUtil.getMemoryAddress(outline)
        if outlineUuid == uuid {
            return outline
        }

        for i in 0..<outline.numberOfChildren {
            if let child = outline.child(at: i),
               let found = findOutline(outline: child, uuid: uuid) {
                return found
            }
        }

        return nil
    }
    

    static func addOutline(
        document: CPDFDocument?,
        parentUuid: String,
        insertIndex: Int,
        title: String,
        pageIndex: Int
    ) -> Bool {
        
        guard let document = document else {
            return false
        }
        var parentOutline: CPDFOutline?
        
        if (!parentUuid.isEmpty){
            parentOutline = findOutlineByUuid(document: document, uuid: parentUuid)
        }else {
            parentOutline = document.setNewOutlineRoot()
        }

        guard let parentOutline = parentOutline else {
            CPDFUtil.log("Not found parent outline！！")
            return false
        }

        guard pageIndex >= 0,
              pageIndex < document.pageCount else {
            CPDFUtil.log("Insert outline page index is out of range！！")
            return false
        }
        var insertIndex = insertIndex
        if(insertIndex == -1){
            CPDFUtil.log("Insert index is -1, will insert at the end！！")
            insertIndex = Int(parentOutline.numberOfChildren)
        }

        guard let outline = parentOutline.insertChild(at: UInt(insertIndex)) else {
            CPDFUtil.log("Insert outline failed！！")
            return false
        }

        if let destination = CPDFDestination(
            document: document,
            pageIndex: pageIndex,
            at: .zero,
            zoom: 0
        ) {
            outline.action = CPDFGoToAction(destination: destination)
        }

        outline.label = title
        
        CPDFUtil.log("Insert outline success！！")
        return true
    }
    
    static func removeOutline(document: CPDFDocument?, uuid: String) -> Bool {
        guard let document = document else {
            return false
        }
        
        guard let outline = findOutlineByUuid(document: document, uuid: uuid) else {
            return false
        }
        
        outline.removeFromParent()
        return true
    }
    

    static func updateOutline(document: CPDFDocument?, uuid: String, title: String, pageIndex: Int) -> Bool {
        guard let document = document else {
            return false
        }
        
        guard let outline = findOutlineByUuid(document: document, uuid: uuid) else {
            CPDFUtil.log("Not found outline to update！！")
            return false
        }
        guard pageIndex >= 0,
              pageIndex < document.pageCount else {
            CPDFUtil.log("update outline page index is out of range！！")
            return false
        }
        
        outline.label = title
        
        if let destination = CPDFDestination(
            document: document,
            pageIndex: pageIndex,
            at: .zero,
            zoom: 0
        ) {
            outline.action = CPDFGoToAction(destination: destination)
        }
        return true
    }
    
    static func moveToOutline(document: CPDFDocument?, newParentUUid: String, uuid : String, insertIndex: Int) -> Bool {
        guard let document = document else {
            return false
        }
        
        guard let outline = findOutlineByUuid(document: document, uuid: uuid) else {
            CPDFUtil.log("Not found outline to move！！")
            return false
        }
        
        guard let parentOutline = findOutlineByUuid(document: document, uuid: newParentUUid) else {
            CPDFUtil.log("Not found new parent outline to move！！")
            return false
        }
        var index = insertIndex;
        if(insertIndex == -1){
            index = Int(parentOutline.numberOfChildren)
        }
        outline.removeFromParent();
        parentOutline.insertChild(outline, at: UInt(index))
        return true;
    }

}
