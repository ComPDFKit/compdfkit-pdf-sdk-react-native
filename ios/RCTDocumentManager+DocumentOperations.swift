//
//  RCTDocumentManager.swift
//  react-native-compdfkit-pdf
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

extension RCTDocumentManager {
  @objc(open: withDocument: withPassword: withPageIndex: withResolver: withRejecter:)
  func open(
    forCPDFViewTag tag: Int,
    document : URL,
    password : String,
    pageIndex: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.open(document: document, password: password, pageIndex: pageIndex) { success in
        resolve(success)
      }
    }
  }
  
  @objc(getFileName: withResolver: withRejecter:)
  func getFileName(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.getFileName { fileName in
        resolve(fileName)
      }
    }
  }
  
  @objc(isEncrypted: withResolver: withRejecter:)
  func isEncrypted(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.isEncrypted { isEncrypted in
        resolve(isEncrypted)
      }
    }
  }
  
  @objc(isImageDoc: withResolver: withRejecter:)
  func isImageDoc(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.isImageDoc { isImageDoc in
        resolve(isImageDoc)
      }
    }
  }
  
  @objc(getPermissions: withResolver: withRejecter:)
  func getPermissions(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.getPermissions { permissions in
        resolve(permissions)
      }
    }
  }
  
  @objc(getPageCount: withResolver: withRejecter:)
  func getPageCount(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.getPageCount { pageCount in
        resolve(pageCount)
      }
    }
  }
  
  @objc(checkOwnerUnlocked: withResolver: withRejecter:)
  func checkOwnerUnlocked(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.checkOwnerUnlocked { unlocked in
        resolve(unlocked)
      }
    }
  }
  
  
  @objc(checkOwnerPassword: withPassword: withResolver: withRejecter:)
  func checkOwnerPassword(
    forCPDFViewTag tag : Int,
    password : String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.checkOwnerPassword(password: password) { correct in
        resolve(correct)
      }
    }
  }
  
  @objc(removePassword: withResolver: withRejecter:)
  func removePassword(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.removePassword { success in
        resolve(success)
      }
    }
  }
  
  @objc(setPassword: withInfo: withResolver: withRejecter:)
  func setPassword(
    forCPDFViewTag tag : Int,
    info : NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.setPassword(info: info) { success in
        resolve(success)
      }
    }
  }
  
  @objc(getEncryptAlgo: withResolver: withRejecter:)
  func getEncryptAlgo(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getEncryptAlgo { encryptAlgo in
        resolve(encryptAlgo)
      }
    }
  }
  
  @objc(printDocument: withResolver: withRejecter:)
  func printDocument(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.printDocument()
      resolve(nil)
    }
  }
  
  @objc(importWidgets: withXfdfFile: withResolver: withRejecter:)
  func importWidgets(
    tag : Int,
    xfdfFile : URL,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.importWidgets(xfdfFile: xfdfFile) { success in
        if success {
          resolve(success)
        } else {
          reject("import_widgets_failed", "Failed to import widgets", nil);
        }
      }
    } 
  }
  
  @objc(exportWidgets: withResolver: withRejecter:)
  func exportWidgets(
    tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.exportWidgets { xfdfFilePath in
        resolve(xfdfFilePath)
      }
    }
  }
  
  @objc(getDocumentPath: withResolver: withRejecter:)
  func getDocumentPath(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ){
    withCPDFView(tag: tag, reject: reject) { view in
      view.getDocumentPath { path in
        resolve(path)
      }
    }
  }
  
  @objc(
    flattenAllPages: withSavePath: withFontSubset: withResolver: withRejecter:
  )
  func flattenAllPages(
    forCPDFViewTag tag : Int,
    savePath: URL,
    fontSubset: Bool,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.flattenAllPages(savePath: savePath, fontSubset: fontSubset) { success in
        resolve(success)
      }
    }
  }
  
  @objc(
    saveAs: withSavePath: withRemoveSecurity: withFontSubset:  withResolver: withRejecter:
  )
  func saveAs(
    forCPDFViewTag tag : Int,
    savePath: URL,
    removeSecurity: Bool,
    fontSubset: Bool,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.saveAs(savePath: savePath, removeSecurity: removeSecurity, fontSubset: fontSubset) { success in
        resolve(success)
      }
    }
  }
  
  @objc(importDocument: withFilePath: withInfo: withResolver: withRejecter:)
  func importDocument(
    forCPDFViewTag tag : Int,
    filePath: URL,
    info: NSDictionary,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  )  {
    withCPDFView(tag: tag, reject: reject) { view in
      view.importDocument(filePath, info) { success in
        resolve(success)
      }
    }
  }
  
  @objc(
    splitDocumentPages: withSavePath: withPages: withResolver: withRejecter:
  )
  func splitDocumentPages(
    forCPDFViewTag tag : Int,
    savePath: URL,
    pages: [Int],
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.splitDocumentPages(savePath: savePath, pages: pages) { success in
        resolve(success)
      }
    }
  }
  
  @objc(
    insertBlankPage: withPageIndex: withPageWidth: withPageHeight: withResolver: withRejecter:
  )
  func insertBlankPage(
    forCPDFViewTag tag : Int,
    pageIndex: Int,
    pageWidth: NSNumber,
    pageHeight: NSNumber,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.insertBlankPage(pageIndex: pageIndex, pageWidth: pageWidth.floatValue, pageHeight: pageHeight.floatValue) { success in
        resolve(success)
      }
    }
  }
  
  @objc(
    insertImagePage: withPageIndex: withImagePath: withPageWidth: withPageHeight: withResolver: withRejecter:
  )
  func insertImagePage(
    forCPDFViewTag tag : Int,
    pageIndex: Int,
    imagePath: URL,
    pageWidth: NSNumber,
    pageHeight: NSNumber,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.insertImagePage(pageIndex: pageIndex, imagePath: imagePath, pageWidth: pageWidth.floatValue, pageHeight: pageHeight.floatValue, completionHandler:  { success in
        if success {
          resolve(true)
        } else {
          reject("insert_image_page_failed", "Failed to insert image page", nil)
        }
      })
    } 
  }
  
  @objc(removePages: withPageIndexes: withResolver: withRejecter:)
  func removePages(
    forCPDFViewTag tag : Int,
    pageIndexes: [Int],
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.removePages(indexes: pageIndexes, completionHandler: { success in
        resolve(success)
      })
    }
  }
  
  @objc(movePage: withFromIndex: withToIndex: withResolver: withRejecter:)
  func movePage(
    forCPDFViewTag tag : Int,
    fromIndex: Int,
    toIndex: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.movePage(fromIndex: fromIndex, toIndex: toIndex) { success in
        resolve(success)
      }
    }
  }
  
  @objc(getInfo: withResolver: withRejecter:)
  func getInfo(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getInfo { info in
        resolve(info)
      }
    }
  }
  
  @objc(getMajorVersion: withResolver: withRejecter:)
  func getMajorVersion(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getMajorVersion { majorVersion in
        resolve(majorVersion)
      }
    }
  }
  
  @objc(getMinorVersion: withResolver: withRejecter:)
  func getMinorVersion(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getMinorVersion { minorVersion in
        resolve(minorVersion)
      }
    }
  }
  
  @objc(getPermissionsInfo: withResolver: withRejecter:)
  func getPermissionsInfo(
    forCPDFViewTag tag : Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    withCPDFView(tag: tag, reject: reject) { view in
      view.getPermissionsInfo { permissionInfo in
        resolve(permissionInfo)
      }
    }
  }
  
  
  
}
