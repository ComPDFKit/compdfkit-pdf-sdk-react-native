//
//  CPDFViewRegistry.swift
//  react-native-compdfkit-pdf
//
//  Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import Foundation

private final class WeakCPDFViewBox {
  weak var view: RCTCPDFView?

  init(view: RCTCPDFView) {
    self.view = view
  }
}

final class CPDFViewRegistry {
  static let shared = CPDFViewRegistry()

  private var views: [Int: WeakCPDFViewBox] = [:]

  private init() {}

  func register(_ view: RCTCPDFView, for tag: Int) {
    views[tag] = WeakCPDFViewBox(view: view)
    pruneReleasedViews()
  }

  func unregister(tag: Int) {
    views.removeValue(forKey: tag)
    pruneReleasedViews()
  }

  func view(for tag: Int) -> RCTCPDFView? {
    let view = views[tag]?.view
    if view == nil {
      views.removeValue(forKey: tag)
    }
    return view
  }

  var count: Int {
    pruneReleasedViews()
    return views.count
  }

  private func pruneReleasedViews() {
    views = views.filter { $0.value.view != nil }
  }
}
