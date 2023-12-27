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
      let jsonDic = self.readJSON(configurationJson)
      let configuration = self.parseJSON(jsonDic)
      
      let pdfViewController = CPDFViewController(filePath: documentPath, password: "", configuration: configuration)
      pdfViewController.delegate = self
      let nav = CNavigationController(rootViewController: pdfViewController)
      nav.modalPresentationStyle = .fullScreen
      rootNav?.present(nav, animated: true)
    }
  }
  
  @objc(openPDFByConfiguration: password: configurationJson:)
  func configurationJson(filePath: String, password: String, configurationJson: String) {
    let rootNav = OpenPDFModule.presentedViewController()
    let jsonDic = self.readJSON(configurationJson)
    let configuration = self.parseJSON(jsonDic)
    
    let pdfViewController = CPDFViewController(filePath: filePath, password: password, configuration: configuration)
    pdfViewController.delegate = self
    let nav = CNavigationController(rootViewController: pdfViewController)
    nav.modalPresentationStyle = .fullScreen
    rootNav?.present(nav, animated: true)
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  // MARK: - Private Methods
  
  func readJSON(_ jsonFilePath: String) -> Dictionary<String, Any> {
    do {
      if let jsonData = jsonFilePath.data(using: .utf8) {
        
        let jsonDic = try JSONSerialization.jsonObject(with: jsonData, options: JSONSerialization.ReadingOptions.mutableContainers) as? [String: Any] ?? [String: Any]()
        
        return jsonDic
      }
      
    } catch{
      
    }
    
    return Dictionary()
  }
  
  func parseJSON(_ jsonDic: Dictionary<String, Any>) -> CPDFConfiguration {
    let configuration = CPDFConfiguration()
    
    for (key, value) in jsonDic {
      print("Key: \(key)")
      if let innerDict = value as? [String: Any] {
        for (innerKey, innerValue) in innerDict {
          if let innerArray = innerValue as? [Any] {
            if innerKey == "iosRightBarAvailableActions" {
              for (_, item) in innerArray.enumerated() {
                if item as! String == "search" {
                  let search = CNavBarButtonItem(viewRightBarButtonItem: .search)
                  configuration.showRightItems.append(search)
                } else if item as! String == "bota" {
                  let bota = CNavBarButtonItem(viewRightBarButtonItem: .bota)
                  configuration.showRightItems.append(bota)
                } else if item as! String == "menu" {
                  let more = CNavBarButtonItem(viewRightBarButtonItem: .more)
                  configuration.showRightItems.append(more)
                }
              }
            } else if innerKey == "iosLeftBarAvailableActions" {
              for (_, item) in innerArray.enumerated() {
                
                if item as! String == "back" {
                  let back = CNavBarButtonItem(viewLeftBarButtonItem: .back)
                  configuration.showleftItems.append(back)
                } else if item as! String == "thumbnail" {
                  let thumbnail = CNavBarButtonItem(viewLeftBarButtonItem: .thumbnail)
                  configuration.showleftItems.append(thumbnail)
                }
              }
            } else if innerKey == "availableMenus" {
              for (_, item) in innerArray.enumerated() {
                if item as! String == "viewSettings" {
                  configuration.showMoreItems.append(.setting)
                } else if item as! String == "documentEditor" {
                  configuration.showMoreItems.append(.pageEdit)
                } else if item as! String == "security" {
                  configuration.showMoreItems.append(.security)
                } else if item as! String == "watermark" {
                  configuration.showMoreItems.append(.watermark)
                } else if item as! String == "documentInfo" {
                  configuration.showMoreItems.append(.info)
                } else if item as! String == "save" {
                  configuration.showMoreItems.append(.save)
                } else if item as! String == "share" {
                  configuration.showMoreItems.append(.share)
                } else if item as! String == "openDocument" {
                  configuration.showMoreItems.append(.addFile)
                }
              }
            }
          } else {
            if innerKey == "initialViewMode" {
              if innerValue as! String == "viewer" {
                  configuration.enterToolModel = .viewer
              } else if innerValue as! String == "annotations" {
                  configuration.enterToolModel = .annotation
              } else if innerValue as! String == "contentEditor" {
                  configuration.enterToolModel = .edit
              } else if innerValue as! String == "forms" {
                  configuration.enterToolModel = .form
              } else if innerValue as! String == "digitalSignatures" {
                  configuration.enterToolModel = .signature
              }
            }
          }
        }
      } else if let innerArray = value as? [Any] {
        for (index, item) in innerArray.enumerated() {
          print("  Item \(index): \(item)")
        }
      }
    }
    
    return configuration
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
