//  Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
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

/**
 * RN and iOS native ComPDFKit SDK interaction class
 *
 */
@objc(ComPDFKit)
class ComPDFKit: NSObject, CPDFViewBaseControllerDelete{
    
    /**
      * Get the version number of the ComPDFKit SDK.<br/>
      * For example: "2.0.0".<br/>
      * <p></p>
      * Usage example:<br/><br/>
      * <pre>
      * ComPDFKit.getVersionCode().then((versionCode : string) => {
      *   console.log('ComPDFKit SDK Version:', versionCode)
      * })
      * </pre>
      *
      */
    @objc(getVersionCode:withRejecter:)
    func getVersionCode(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(String(CPDFKit.sharedInstance().versionNumber))
    }


    /**
       * Get the build tag of the ComPDFKit PDF SDK.<br/>
       * For example: "build_beta_2.0.0_42db96987_202404081007"<br/>
       * <p></p>
       *
       * Usage example:<br/>
       * <pre>
       * ComPDFKit.getSDKBuildTag().then((buildTag : string) => {
       *   console.log('ComPDFKit Build Tag:', buildTag)
       * })
       * </pre>
       *
       */
    @objc(getSDKBuildTag:withRejecter:)
    func getSDKBuildTag(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        let sdkBuildTag = CPDFKit.sharedInstance().versionString
        resolve(sdkBuildTag)
    }
    
    
    /**
     * Initialize the ComPDFKit PDF SDK using offline authentication.<br/>
     * <p></p>
     * Usage example:<br/>
     * <pre>
     * ComPDFKit.init_('license')
     * </pre>
     *
     * @param license The offline license.
     */
    @objc(init_: withResolver: withRejecter:)
    func init_(license : String,resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock){
        DispatchQueue.main.async {
            let code = CPDFKit.verify(withKey: license)
            print("ComPDFKitRN-iOS  init_:\(code)")
            resolve(code == CPDFKitLicenseCode.success)
        }
    }
    
    
    /**
     * Initialize the ComPDFKit PDF SDK using online authentication. <br/>
     * Requires internet connection. Please ensure that the network permission has been added in [AndroidManifest.xml] file. <br/>
     * {@link android.Manifest.permission#INTERNET} <br/>
     * <p></p>
     * Usage example:
     * <pre>
     *   ComPDFKit.initialize(androidLicense, iosLicense)
     * </pre>
     *
     * @param androidOnlineLicense The online license for the ComPDFKit SDK on Android platform.
     * @param iosOnlineLicense     The online license for the ComPDFKit SDK on iOS platform.
     */
    @objc(initialize: iosOnlineLicense: withResolver: withRejecter:)
    func initialize(_ androidOnlineLicense: String, iosOnlineLicense: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      DispatchQueue.main.async {
        CPDFKit.verify(withOnlineLicense: iosOnlineLicense) { code, message in
            print("ComPDFKitRN-iOS  initialize: \(code), Message:\(String(describing: message))")
            resolve(code == CPDFKitOnlineLicenseCode.success)
        }
      }
    }
    
    
    /**
       * Display a PDF.<br/>
       *
       * Usage example:<br/>
       * <pre>
       *   ComPDFKit.openDocument(document, password, configurationJson)
       * </pre>
       *
       * (Android) For local storage file path: <br/>
       * <pre>
       *   document = "file:///storage/emulated/0/Download/sample.pdf";<br/>
       * </pre>
       *
       * (Android) For content Uri: <br/>
       * <pre>
       *   document = "content://...";
       * </pre>
       *
       * (Android) For assets path: <br/>
       * <pre>
       *   document = "file:///android_asset/..."
       * </pre>
       *
       * @param document          The document URI or file path.
       * @param password          The document password.
       * @param configurationJson Configuration data in JSON format.
       */
    @objc(openDocument: password: configurationJson:)
    func openDocument(document : URL, password: String, configurationJson : String) -> Void {
        DispatchQueue.main.async {
            let rootNav = ComPDFKit.presentedViewController()
          
            let jsonDataParse = CPDFJSONDataParse(String: configurationJson)
            guard let configuration = jsonDataParse.configuration else { return }
            
            let pdfViewController = CPDFViewController(filePath: document.path, password: password, configuration: configuration)
            pdfViewController.delegate = self
            let nav = CNavigationController(rootViewController: pdfViewController)
            nav.modalPresentationStyle = .fullScreen
            rootNav?.present(nav, animated: true)
        }
    }
    
    
    /**
     * CPDFViewBaseControllerDelete delegate to dismiss ViewController.<br/>
     */
    func PDFViewBaseControllerDissmiss(_ baseControllerDelete: CPDFViewBaseController) {
      baseControllerDelete.dismiss(animated: true)
    }
    
    /**
     *  Cet a root ViewController.<br/>
     */
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
