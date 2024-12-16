//
//  RCTCPDFView.swift
//  react-native-compdfkit-pdf
//
//  Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import UIKit
import ComPDFKit_Tools
import ComPDFKit

protocol RCTCPDFViewDelegate: AnyObject {
    func cpdfViewAttached(_ cpdfView: RCTCPDFView)
    func saveDocumentChange(_ cpdfView: RCTCPDFView)
    func onPageChanged(_ cpdfView: RCTCPDFView, pageIndex: Int)
}

class RCTCPDFView: UIView, CPDFViewBaseControllerDelete {
    
    weak var delegate: RCTCPDFViewDelegate?
    
    public var pdfViewController : CPDFViewController?
    
    private var navigationController : CNavigationController?
    
    init() {
        super.init(frame: CGRect(x: 0, y: 0, width: 500, height: 400))
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Private Methods
    
    private func createCPDFView() {
        var documentPath = document.path
        var success = false
        
        let homeDiectory = NSHomeDirectory()
        let bundlePath = Bundle.main.bundlePath
            
        if (documentPath.hasPrefix(homeDiectory) || documentPath.hasPrefix(bundlePath)) {
            let fileManager = FileManager.default
            let samplesFilePath = NSHomeDirectory().appending("/Documents/Files")
            let fileName = document.lastPathComponent
            let docsFilePath = samplesFilePath + "/" + fileName

            if !fileManager.fileExists(atPath: samplesFilePath) {
                try? FileManager.default.createDirectory(atPath: samplesFilePath, withIntermediateDirectories: true, attributes: nil)
            }

            try? FileManager.default.copyItem(atPath: document.path, toPath: docsFilePath)
            
            documentPath = docsFilePath
        } else {
            success = document.startAccessingSecurityScopedResource()
        }
        
        let jsonData = CPDFJSONDataParse(String: configuration)
        let configurations = jsonData.configuration ?? CPDFConfiguration()

        pdfViewController = CPDFViewController(filePath: documentPath, password: password, configuration: configurations)
        pdfViewController?.delegate = self
        navigationController = CNavigationController(rootViewController: pdfViewController!)
        navigationController?.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        navigationController?.view.frame = self.frame

        navigationController?.setViewControllers([pdfViewController!], animated: true)
        
        addSubview(navigationController?.view ?? UIView())
        
        self.delegate?.cpdfViewAttached(self)
        
        if success {
            document.stopAccessingSecurityScopedResource()
        }
    }
    
    // MARK: - Public Methods
    
    func saveDocument(completionHandler: @escaping (Bool) -> Void) {
        if (self.pdfViewController?.pdfListView?.isEditing() == true && self.pdfViewController?.pdfListView?.isEdited() == true) {
            self.pdfViewController?.pdfListView?.commitEditing()
            
            if self.pdfViewController?.pdfListView?.document.isModified() == true {
                let document = self.pdfViewController?.pdfListView?.document
                let success = document?.write(to: document?.documentURL ?? URL(fileURLWithPath: ""), isSaveFontSubset: true) ?? false
                completionHandler(success)
            } else {
                completionHandler(true)
            }
            
        } else {
            if self.pdfViewController?.pdfListView?.document.isModified() == true {
                let document = self.pdfViewController?.pdfListView?.document
                let success = document?.write(to: document?.documentURL ?? URL(fileURLWithPath: ""), isSaveFontSubset: true) ?? false
                completionHandler(success)
            } else {
                completionHandler(true)
            }
        }
    }
    
    func setMargins(left : Int, top : Int, right : Int, bottom : Int) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            pdfListView.pageBreakMargins = .init(top: CGFloat(top), left: CGFloat(left), bottom: CGFloat(bottom), right: CGFloat(right))
            pdfListView.layoutDocumentView()
        }
    }
    
    func removeAllAnnotations(completionHandler: @escaping (Bool) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            let pageCount = pdfListView.document?.pageCount ?? 0
            for i in 0..<pageCount {
                let page = pdfListView.document?.page(at: i)
                page?.removeAllAnnotations()
            }
            self.pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
            self.pdfViewController?.pdfListView?.updateActiveAnnotations([])
            completionHandler(true)
        } else {
            completionHandler(false)
        }
    }
    
    func importAnnotations(xfdfFile : URL, completionHandler: @escaping (Bool) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
        
            let documentFolder = NSHomeDirectory().appending("/Documents/Files")
            if !FileManager.default.fileExists(atPath: documentFolder) {
                try? FileManager.default.createDirectory(at: URL(fileURLWithPath: documentFolder), withIntermediateDirectories: true, attributes: nil)
            }
            
            let documentPath = documentFolder + "/\(xfdfFile.lastPathComponent)"
            try? FileManager.default.copyItem(atPath: xfdfFile.path, toPath: documentPath)
            
            if !FileManager.default.fileExists(atPath: documentPath) {
                print("fail")
            }
            
            let success = pdfListView.document?.importAnnotation(fromXFDFPath: documentPath) ?? false
            if success {
                self.pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
            }
            completionHandler(success)
        } else {
            completionHandler(false)
        }
    }
    
    func exportAnnotations(completionHandler: @escaping (String) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            let fileNameWithExtension = pdfListView.document?.documentURL.lastPathComponent ?? ""
            let fileName = (fileNameWithExtension as NSString).deletingPathExtension
            let documentFolder = NSHomeDirectory().appending("/Documents/\(fileName)_xfdf.xfdf")
            let succes = pdfListView.document?.exportAnnotation(toXFDFPath: documentFolder) ?? false
            
            if succes {
                completionHandler(documentFolder)
            } else {
                completionHandler("")
            }
        } else {
            completionHandler("")
        }
    }
    
    func setDisplayPageIndex(pageIndex : Int) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            pdfListView.go(toPageIndex: pageIndex, animated: false)
        }
    }
    
    func getCurrentPageIndex(completionHandler: @escaping (Int) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            completionHandler(pdfListView.currentPageIndex)
        } else {
            completionHandler(0)
        }
    }
    
    func hasChange(completionHandler: @escaping (Bool) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            let success = pdfListView.document?.isModified() ?? false
            completionHandler(success)
        } else {
            completionHandler(false)
        }
    }
    
    // MARK: - CPDFViewBaseControllerDelete
    
    func PDFViewBaseController(_ baseController: CPDFViewBaseController, SaveState success: Bool) {
        self.delegate?.saveDocumentChange(self)
    }
    
    func PDFViewBaseController(_ baseController: CPDFViewBaseController, currentPageIndex index: Int) {
        self.delegate?.onPageChanged(self, pageIndex: index)
    }
    
    // MARK: - RCT Methods
    
    private var configuration: String = ""
    @objc func setConfiguration(_ newSection: String) {
       configuration = newSection
        
        if (document.path.count > 1) && (configuration.count > 1) {
            createCPDFView()
        }
    }
    
    private var document: URL = URL(fileURLWithPath: "")
    @objc func setDocument(_ newSection: URL) {
        document = newSection
        
        if (document.path.count > 1) && (configuration.count > 1) {
            createCPDFView()
        }
    }
    
    private var password: String = ""
    @objc func setPassword(_ newSection: String) {
       password = newSection
    }
    
    public var onChange: RCTBubblingEventBlock?
    @objc func setOnChange(_ newSection: @escaping RCTBubblingEventBlock) {
        onChange = newSection
    }
}
