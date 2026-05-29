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

@objc(CPDFViewManager)
class RCTDocumentManager: NSObject, RCTBridgeModule {
  @objc var bridge: RCTBridge?

  static func moduleName() -> String! {
    return "RCTDocumentManager"
  }

  func cpdfView(for tag: Int) -> RCTCPDFView? {
    if let view = CPDFViewRegistry.shared.view(for: tag) {
      return view
    }

    guard Thread.isMainThread else {
      return nil
    }

    let reactTag = NSNumber(value: tag)
    guard let nativeView = bridge?.uiManager.view(forReactTag: reactTag),
          let cpdfView = findCPDFView(in: nativeView) else {
      return nil
    }

    CPDFViewRegistry.shared.register(cpdfView, for: tag)
    return cpdfView
  }

  private func findCPDFView(in view: UIView) -> RCTCPDFView? {
    if let cpdfView = view as? RCTCPDFView {
      return cpdfView
    }

    for subview in view.subviews {
      if let cpdfView = findCPDFView(in: subview) {
        return cpdfView
      }
    }

    return nil
  }

  func rejectMissingView(tag: Int, reject: RCTPromiseRejectBlock) {
    reject("view_not_found", "No RCTCPDFView found for tag \(tag)", nil)
  }

  func withCPDFView(
    tag: Int,
    reject: @escaping RCTPromiseRejectBlock,
    action: @escaping (RCTCPDFView) -> Void
  ) {
    DispatchQueue.main.async {
      guard let view = self.cpdfView(for: tag) else {
        self.rejectMissingView(tag: tag, reject: reject)
        return
      }

      action(view)
    }
  }

  func withCPDFViewSync(
    tag: Int,
    reject: @escaping RCTPromiseRejectBlock,
    action: @escaping (RCTCPDFView) -> Void
  ) {
    if Thread.isMainThread {
      guard let view = self.cpdfView(for: tag) else {
        self.rejectMissingView(tag: tag, reject: reject)
        return
      }

      action(view)
      return
    }

    DispatchQueue.main.sync {
      guard let view = self.cpdfView(for: tag) else {
        self.rejectMissingView(tag: tag, reject: reject)
        return
      }

      action(view)
    }
  }
}
