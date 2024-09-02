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
}

class RCTCPDFView: UIView {
    
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
        let fileManager = FileManager.default
        let samplesFilePath = NSHomeDirectory().appending("/Documents/ReaderViewer")
        let fileName = document.lastPathComponent
        let docsFilePath = samplesFilePath + "/" + fileName
        
        if !fileManager.fileExists(atPath: samplesFilePath) {
            try? FileManager.default.createDirectory(atPath: samplesFilePath, withIntermediateDirectories: true, attributes: nil)
        }
        
        try? FileManager.default.copyItem(atPath: document.path, toPath: docsFilePath)
        
        let jsonData = CPDFJSONDataParse(String: configuration)
        let configurations = jsonData.configuration ?? CPDFConfiguration()

        pdfViewController = CPDFViewController(filePath: docsFilePath, password: password, configuration: configurations)
        navigationController = CNavigationController(rootViewController: pdfViewController!)
        navigationController?.view.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        navigationController?.view.frame = self.frame

        navigationController?.setViewControllers([pdfViewController!], animated: true)
        
        addSubview(navigationController?.view ?? UIView())
        
        self.delegate?.cpdfViewAttached(self)
    }
    
    // MARK: - Public Methods
    
    func saveDocument(completionHandler: @escaping (Bool) -> Void) {
        if (self.pdfViewController?.pdfListView?.isEditing() == true && self.pdfViewController?.pdfListView?.isEdited() == true) {
            self.pdfViewController?.pdfListView?.commitEditing()
            
            if self.pdfViewController?.pdfListView?.document.isModified() == true {
                let document = self.pdfViewController?.pdfListView?.document
                let success = document?.write(to: document?.documentURL ?? URL(fileURLWithPath: ""), isSaveFontSubset: true) ?? false
                completionHandler(success)
            }
        } else {
            if self.pdfViewController?.pdfListView?.document.isModified() == true {
                let document = self.pdfViewController?.pdfListView?.document
                let success = document?.write(to: document?.documentURL ?? URL(fileURLWithPath: ""), isSaveFontSubset: true) ?? false
                completionHandler(success)
            }
        }
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
}
