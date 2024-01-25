//
//  OpenPDFModule.swift
//  ComPDFKit_RN
//
//  Copyright © 2014-2023 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//
import UIKit
import Foundation
import ComPDFKit
import ComPDFKit_Tools

@objc(OpenPDFModule)
class OpenPDFModule: NSObject, CPDFViewBaseControllerDelete {
  
  @objc(openPDF:)
  func openPDF(_ configurationJson: String) -> Void {
    DispatchQueue.main.async {
      let documentPath = Bundle.main.path(forResource: "developer_guide_ios", ofType: "pdf") ?? ""
      let rootNav = OpenPDFModule.presentedViewController()
      
      let jsonDataParse = CPDFJSONDataParse(String: configurationJson)
      guard let configuration = jsonDataParse.configuration else { return }
      
      let pdfViewController = CPDFViewController(filePath: documentPath, password: "", configuration: configuration)
      pdfViewController.delegate = self
      let nav = CNavigationController(rootViewController: pdfViewController)
      nav.modalPresentationStyle = .fullScreen
      rootNav?.present(nav, animated: true)
    }
  }
  
  @objc(openPDFByConfiguration: password: configurationJson:)
  func openPDFByConfiguration(filePath: URL, password: String, configurationJson: String) {
    DispatchQueue.main.async {
      let rootNav = OpenPDFModule.presentedViewController()
      
      let jsonDataParse = CPDFJSONDataParse(String: configurationJson)
      guard let configuration = jsonDataParse.configuration else { return }
      
      
      let pdfViewController = CPDFViewController(filePath: filePath.path, password: password, configuration: configuration)
      pdfViewController.delegate = self
      let nav = CNavigationController(rootViewController: pdfViewController)
      nav.modalPresentationStyle = .fullScreen
      rootNav?.present(nav, animated: true)
    }
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  func PDFViewBaseControllerDissmiss(_ baseControllerDelete: CPDFViewBaseController) {
    baseControllerDelete.dismiss(animated: true)
  }
  
  class func presentedViewController() -> UIViewController? {
    
    var rootViewController: UIViewController? = nil
    
    if let appDelegate = UIApplication.shared.delegate as? NSObject {
      if appDelegate.responds(to: Selector(("viewController"))) {
        rootViewController = appDelegate.value(forKey: "viewController") as? UIViewController
      }
    }
    
    if rootViewController == nil, let appDelegate = UIApplication.shared.delegate as? NSObject, appDelegate.responds(to: #selector(getter: UIApplicationDelegate.window)) {
      if let window = appDelegate.value(forKey: "window") as? UIWindow {
        rootViewController = window.rootViewController
      }
    }
    
    if rootViewController == nil {
      if let window = UIApplication.shared.keyWindow {
        rootViewController = window.rootViewController
      }
    }
    
    guard let finalRootViewController = rootViewController else {
      return nil
    }
    
    var currentViewController = finalRootViewController
    
    while let presentedViewController = currentViewController.presentedViewController {
      if !(presentedViewController is UIAlertController) && currentViewController.modalPresentationStyle != .popover {
        currentViewController = presentedViewController
      } else {
        return currentViewController
      }
    }
    
    return currentViewController
  }
  
}
