//
//  RCTCPDFView.swift
//  react-native-compdfkit-pdf
//
//  Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
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
    func onPageEditDialogBackPress(_ cpdfView: RCTCPDFView)
    func onFullScreenChanged(_ cpdfView: RCTCPDFView, isFull: Bool)
    func onTapMainDocArea(_ cpdfView: RCTCPDFView)
    func onAnnotationHistoryChanged(_ cpdfView: RCTCPDFView)
    func onIOSClickBackPressed(_ cpdfView: RCTCPDFView)
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
            let documentHome = homeDiectory.appending("/Documents")
            if documentPath.hasPrefix(homeDiectory) && documentPath.hasPrefix(documentHome) {
                
            } else {
                let fileManager = FileManager.default
                let samplesFilePath = NSHomeDirectory().appending("/Documents/Files")
                let fileName = document.lastPathComponent
                let docsFilePath = samplesFilePath + "/" + fileName
                
                if !fileManager.fileExists(atPath: samplesFilePath) {
                    try? FileManager.default.createDirectory(atPath: samplesFilePath, withIntermediateDirectories: true, attributes: nil)
                }
                 
                try? FileManager.default.copyItem(atPath: document.path, toPath: docsFilePath)
                
                documentPath = docsFilePath
            }
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
        
        NotificationCenter.default.addObserver(self, selector: #selector(annotationsOperationChangeNotification(_:)), name: NSNotification.Name(NSNotification.Name("CPDFListViewAnnotationsOperationChangeNotification").rawValue), object: nil)
    }
    
    func insertPDFDocument(_ document: CPDFDocument, Pages pages: [Int], Position index: Int) -> Bool {
        if let pdfListView = self.pdfViewController?.pdfListView {
            var _index = index
            if index < 0 || index > pdfListView.document.pageCount {
                if Int(index) == -1 {
                    _index = Int(pdfListView.document.pageCount)
                } else {
                    return false
                }
            }
            
            var indexSet = IndexSet()
            for page in pages {
                indexSet.insert(IndexSet.Element(page))
            }
            
            let success = pdfListView.document.importPages(indexSet, from: document, at: UInt(_index))
            pdfListView.layoutDocumentView()
            
            return success
        } else {
            return false
        }
    }
    
    func extractPDFDocument(_ savePath: URL, Pages pages: [Int]) -> Bool {
        if let pdfListView = self.pdfViewController?.pdfListView {
            var indexSet = IndexSet()
            for page in pages {
                indexSet.insert(page)
            }
            
            let document = CPDFDocument()
            document?.importPages(indexSet, from: pdfListView.document, at: 0)
            
            let success = document?.write(to: savePath, isSaveFontSubset: true) ?? false
            
            return success
        } else {
            return false
        }
    }
    
    func getValue<T>(from info: [String: Any]?, key: String, defaultValue: T) -> T {
        guard let value = info?[key] as? T else {
            return defaultValue
        }
        return value
    }
    
    // MARK: - Page Public Methods
    
    func getPage(_ index: UInt) -> CPDFPage {
        if let pdfListView = self.pdfViewController?.pdfListView {
            let page = pdfListView.document.page(at: index) ?? CPDFPage()
            return page
        } else {
            return CPDFPage()
        }
    }
    
    // MARK: - Document Public Methods
    
    func saveDocument(completionHandler: @escaping (Bool) -> Void) {
        if (self.pdfViewController?.pdfListView?.isEditing() == true && self.pdfViewController?.pdfListView?.isEdited() == true) {
            DispatchQueue.global(qos: .default).async {
                if self.pdfViewController?.pdfListView?.isEdited() == true {
                    
                    self.pdfViewController?.pdfListView?.commitEditing()
                }
                
                DispatchQueue.main.async {
                    
                    if self.pdfViewController?.pdfListView?.document.isModified() == true {
                        let document = self.pdfViewController?.pdfListView?.document
                        let success = document?.write(to: document?.documentURL ?? URL(fileURLWithPath: ""), isSaveFontSubset: true) ?? false
                        completionHandler(success)
                    } else {
                        completionHandler(true)
                    }
                }
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
    
    func setScale(scale : NSNumber){
        if let pdfListView = self.pdfViewController?.pdfListView {
            pdfListView.setScaleFactor(CGFloat(truncating: scale), animated: true)
        }
    }
    
    func getScale(completionHandler: @escaping (NSNumber) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            completionHandler(NSNumber(value: pdfListView.scaleFactor))
        } else {
            completionHandler(1.0)
        }
    }
    
    func setReadBackgroundColor(displayMode : NSString) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            switch displayMode {
            case "light":
                pdfListView.displayMode = .normal
            case "dark":
                pdfListView.displayMode = .night
            case "sepia":
                pdfListView.displayMode = .soft
            case "reseda":
                pdfListView.displayMode = .green
            default:
                pdfListView.displayMode = .normal
            }
            pdfListView.layoutDocumentView()
        }
    }
    
    func getReadbackgroundColor(completionHandler: @escaping (NSString) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            let dispalyMode = pdfListView.displayMode
            switch dispalyMode {
            case .normal:
                completionHandler("#FFFFFF")
            case .night:
                completionHandler("#000000")
            case .soft:
                completionHandler("#FFFFFF")
            case .green:
                completionHandler("#FFEFBE")
            case .custom:
                completionHandler("#CDE6D0")
            @unknown default:
                completionHandler("#FFFFFF")
            }
        } else {
            completionHandler("#FFFFFF")
        }
    }
    
    func setFormFieldHighlight(formFieldHighlight : Bool){
        if let pdfListView = self.pdfViewController?.pdfListView {
            CPDFKitConfig.sharedInstance().setEnableFormFieldHighlight(formFieldHighlight)
            pdfListView.layoutDocumentView()
        }
    }
    
    func isFormFieldHighlight(completionHandler: @escaping (Bool) -> Void){
        completionHandler(CPDFKitConfig.sharedInstance().enableFormFieldHighlight())
    }
    
    func setLinkHighlight(linkHighlight : Bool) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            CPDFKitConfig.sharedInstance().setEnableLinkFieldHighlight(linkHighlight)
            pdfListView.layoutDocumentView()
        }
    }
    
    func isLinkHighlight(completionHandler: @escaping (Bool) -> Void){
        completionHandler(CPDFKitConfig.sharedInstance().enableLinkFieldHighlight())
    }
    
    func setVerticalMode(isVerticalMode : Bool) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            pdfListView.displayDirection = isVerticalMode ? .vertical : .horizontal
            pdfListView.layoutDocumentView()
        }
    }
    
    func isVerticalMode(completionHandler: @escaping (Bool) -> Void){
        if let pdfListView = self.pdfViewController?.pdfListView {
            completionHandler(pdfListView.displayDirection == .vertical)
        } else {
            completionHandler(true)
        }
    }
    
    func setContinueMode(isContinueMode : Bool) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            pdfListView.displaysPageBreaks = isContinueMode
            pdfListView.layoutDocumentView()
        }
    }
    
    func isContinueMode(completionHandler: @escaping (Bool) -> Void){
        if let pdfListView = self.pdfViewController?.pdfListView {
            completionHandler(pdfListView.displaysPageBreaks)
        }else {
            completionHandler(true)
        }
    }
    
    func setDoublePageMode(isDoublePageMode : Bool) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            pdfListView.displayTwoUp = isDoublePageMode
            pdfListView.displaysAsBook = false
            pdfListView.layoutDocumentView()
        }
    }
    
    func isDoublePageMode(completionHandler: @escaping (Bool) -> Void){
        if let pdfListView = self.pdfViewController?.pdfListView {
            completionHandler(pdfListView.displayTwoUp)
        }else {
            completionHandler(true)
        }
    }
    
    func setCoverPageMode(isCoverPageMode : Bool) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            pdfListView.displayTwoUp = isCoverPageMode
            pdfListView.displaysAsBook = isCoverPageMode
            pdfListView.layoutDocumentView()
        }
    }
    
    func isCoverPageMode(completionHandler: @escaping (Bool) -> Void){
        if let pdfListView = self.pdfViewController?.pdfListView {
            completionHandler(pdfListView.displaysAsBook)
        }else {
            completionHandler(true)
        }
    }
    
    func setCropMode(isCropMode : Bool) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            pdfListView.displayCrop = isCropMode
            pdfListView.layoutDocumentView()
        }
    }
    
    func isCropMode(completionHandler: @escaping (Bool) -> Void){
        if let pdfListView = self.pdfViewController?.pdfListView {
            completionHandler(pdfListView.displayCrop)
        }else {
            completionHandler(true)
        }
    }
    
    func setPreviewMode(viewMode : String) {
        switch viewMode {
        case "viewer":
            self.pdfViewController?.enterViewerMode()
        case "annotations":
            self.pdfViewController?.enterAnnotationMode()
        case "contentEditor":
            self.pdfViewController?.enterEditMode()
        case "forms":
            self.pdfViewController?.enterFormMode()
        case "signatures":
            self.pdfViewController?.enterSignatureMode()
        default:
            self.pdfViewController?.enterViewerMode()
        }
    }
    
    func getPreviewMode(completionHandler: @escaping (String) -> Void) {
        let state = self.pdfViewController?.functionTypeState ?? .viewer
        switch state {
        case .viewer:
            completionHandler("viewer")
        case .edit:
            completionHandler("contentEditor")
        case .annotation:
            completionHandler("annotations")
        case .form:
            completionHandler("forms")
        case .signature:
            completionHandler("signatures")
        default:
            completionHandler("viewer")
        }
    }
    
    func showThumbnailView(isEditMode : Bool) {
        if isEditMode {
            self.pdfViewController?.enterPDFPageEdit()
        } else {
            self.pdfViewController?.enterThumbnail()
        }
    }
    
    func showBotaView() {
        self.pdfViewController?.buttonItemClicked_Bota(UIButton(frame: .zero))
    }
    
    func showAddWatermarkView(saveAsNewFile : Bool) {
        self.pdfViewController?.enterPDFWatermark(isSaveAs: saveAsNewFile)
    }
    
    func showSecurityView() {
        self.pdfViewController?.enterPDFSecurity()
    }
    
    func showDisplaySettingView() {
        self.pdfViewController?.enterPDFSetting()
    }
    
    func enterSnipMode() {
        self.pdfViewController?.enterPDFSnipImageMode()
    }
    
    func exitSnipMode() {
        self.pdfViewController?.exitPDFSnipImageMode()
    }
    
    func open(document : URL, password : String, completionHandler: @escaping (Bool) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            let newDocument = CPDFDocument(url: document)
            if(newDocument?.isLocked == true){
                newDocument?.unlock(withPassword: password)
            }
            pdfListView.document = newDocument
            self.pdfViewController?.filePath = newDocument?.documentURL.path
            pdfListView.setNeedsDisplay()
            completionHandler(true)
            
            if newDocument?.isImageDocument() == true {
                let okAction = UIAlertAction(title: NSLocalizedString("OK", comment: ""), style: .default) { _ in
                    self.navigationController?.popViewController(animated: true)
                }
                let alert = UIAlertController(title: NSLocalizedString("Warning", comment: ""), message: NSLocalizedString("The current page is scanned images that do not support adding highlights, underlines, strikeouts, and squiggly lines.", comment: ""), preferredStyle: .alert)
                alert.addAction(okAction)
                UIApplication.presentedViewController()?.present(alert, animated: true, completion: nil)
            }
        } else {
            completionHandler(false)
        }
    }
    
    func getFileName(completionHandler: @escaping (String) -> Void){
        if let pdfListView = self.pdfViewController?.pdfListView {
            completionHandler(pdfListView.document.documentURL.lastPathComponent)
        }else {
            completionHandler("")
        }
    }
    
    func isEncrypted(completionHandler: @escaping (Bool) -> Void){
        if let pdfListView = self.pdfViewController?.pdfListView {
            completionHandler(pdfListView.document.isEncrypted)
        }else {
            completionHandler(false)
        }
    }
    
    func isImageDoc(completionHandler: @escaping (Bool) -> Void){
        if let pdfListView = self.pdfViewController?.pdfListView {
            completionHandler(pdfListView.document.isImageDocument())
        }else {
            completionHandler(false)
        }
    }
    
    func getPermissions(completionHandler: @escaping (NSNumber) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            let permissions = pdfListView.document?.permissionsStatus ?? .none
            switch permissions {
            case .none:
                completionHandler(0)
            case .user:
                completionHandler(1)
            case .owner:
                completionHandler(2)
            default:
                completionHandler(0)
            }
        }else {
            completionHandler(0)
        }
    }
    
    func getPageCount(completionHandler: @escaping (NSNumber) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            completionHandler(pdfListView.document.pageCount as NSNumber)
        }else {
            completionHandler(0)
        }
    }
    
    func checkOwnerUnlocked(completionHandler: @escaping (Bool) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            completionHandler(pdfListView.document.isCheckOwnerUnlocked())
        }else {
            completionHandler(false)
        }
    }
    
    func checkOwnerPassword(password : String, completionHandler: @escaping (Bool) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            completionHandler(pdfListView.document.checkOwnerPassword(password))
        }else {
            completionHandler(false)
        }
    }
    
    func removePassword(completionHandler: @escaping (Bool) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            let newDocument = pdfListView.document
            let url = newDocument?.documentURL
            
            let success = newDocument?.writeDecrypt(to: url, isSaveFontSubset: true) ?? false
            completionHandler(success)
        } else {
            completionHandler(false)
        }
    }
    
    func setPassword(info : NSDictionary, completionHandler: @escaping (Bool) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            
            let _info = info as? [String: Any]
            
            let userPassword : String = self.getValue(from: _info, key: "user_password", defaultValue: "")
            let ownerPassword : String = self.getValue(from: _info, key: "owner_password", defaultValue: "")
            let allowsPrinting : Bool = self.getValue(from: _info, key: "allows_printing", defaultValue: true)
            let allowsCopying : Bool = self.getValue(from: _info, key: "allows_copying", defaultValue: true)
            
            let encryptAlgo : String = self.getValue(from: _info, key: "encrypt_algo", defaultValue: "rc4")
            
            var level: Int = 0
            // Encryption mode, the type passed in is：rc4, aes128, aes256, noEncryptAlgo
            switch encryptAlgo {
            case "rc4":
                level = 0
            case "aes128":
                level = 1
            case "aes256":
                level = 2
            case "noEncryptAlgo":
                level = 3
            default:
                level = 3
            }
            
            var options:[CPDFDocumentWriteOption: Any] = [:]
            options[CPDFDocumentWriteOption.userPasswordOption] = userPassword
            
            options[CPDFDocumentWriteOption.ownerPasswordOption] = ownerPassword
            
            options[CPDFDocumentWriteOption.allowsPrintingOption] = allowsPrinting
            
            options[CPDFDocumentWriteOption.allowsCopyingOption] = allowsCopying
            
            options[CPDFDocumentWriteOption.encryptionLevelOption] = NSNumber(value: level)
            
            let newDocument = pdfListView.document
            let url = newDocument?.documentURL
            
            let success = newDocument?.write(to: url, withOptions: options, isSaveFontSubset: true) ?? false
            completionHandler(success)
        } else {
            completionHandler(false)
        }
    }
    
    func getEncryptAlgo(completionHandler: @escaping (String) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            let encryptAlgo = pdfListView.document.encryptionLevel
            switch encryptAlgo {
            case .RC4:
                completionHandler("rc4")
            case .AES128:
                completionHandler("aes128")
            case .AES256:
                completionHandler("aes256")
            case .noEncryptAlgo:
                completionHandler("noEncryptAlgo")
            default:
                completionHandler("noEncryptAlgo")
            }
        }else {
            completionHandler("noEncryptAlgo")
        }
    }
    
    func printDocument() {
        self.pdfViewController?.enterPrintState();
    }
    
    func importWidgets(xfdfFile : URL, completionHandler: @escaping (Bool) -> Void) {
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
            
            let success = pdfListView.document?.importForm(fromXFDFPath: documentPath) ?? false
            if success {
                self.pdfViewController?.pdfListView?.setNeedsDisplayForVisiblePages()
            }
            completionHandler(success)
        } else {
            completionHandler(false)
        }
    }
    
    func getDocumentPath(completionHandler: @escaping (String) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            let documentPath = pdfListView.document.documentURL.path
            completionHandler(documentPath)
        }
    }
    
    func exportWidgets(completionHandler: @escaping (String) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            let fileNameWithExtension = pdfListView.document?.documentURL.lastPathComponent ?? ""
            let fileName = (fileNameWithExtension as NSString).deletingPathExtension
            let documentFolder = NSHomeDirectory().appending("/Documents/\(fileName)_xfdf.xfdf")
            let succes = pdfListView.document?.export(toXFDFPath: documentFolder) ?? false
            
            if succes {
                completionHandler(documentFolder)
            } else {
                completionHandler("")
            }
        } else {
            completionHandler("")
        }
    }
    
    func flattenAllPages(savePath: URL, fontSubset: Bool, completionHandler: @escaping (Bool) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            
            let success = pdfListView.document.writeFlatten(to: savePath, isSaveFontSubset: fontSubset)
            
            completionHandler(success)
        } else {
            completionHandler(false)
        }
    }
    
    func saveAs(savePath: URL, removeSecurity: Bool, fontSubset: Bool, completionHandler: @escaping (Bool) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
           
            var success: Bool = false
            if removeSecurity {
                success = pdfListView.document.writeDecrypt(to: savePath, isSaveFontSubset: fontSubset)
            } else {
                success = pdfListView.document.write(to: savePath, isSaveFontSubset: fontSubset)
            }
            completionHandler(success)
        } else {
            completionHandler(false)
        }
    }
    
    func importDocument(_ filePath:URL, _ info : NSDictionary, completionHandler: @escaping (Bool) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            let _info = info as? [String: Any]
            
            let password: String = self.getValue(from: _info, key: "password", defaultValue: "")
            let pages: [Int] = self.getValue(from: _info, key: "pages", defaultValue: [])
            let insert_position: Int = self.getValue(from: _info, key: "insert_position", defaultValue: 0)

            let _document = CPDFDocument(url: filePath)
            
            if _document?.isLocked == true {
                _document?.unlock(withPassword: password)
            }
            
            let success = self.insertPDFDocument(_document!, Pages: pages, Position: insert_position)
            completionHandler(success)
        } else {
            completionHandler(false)
        }
    }
    
    func splitDocumentPages(savePath: URL, pages: [Int], completionHandler: @escaping (Bool) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            
            let success = self.extractPDFDocument(savePath, Pages: pages)
            
            completionHandler(success)
        } else {
            completionHandler(false)
        }
    }
    
    func insertBlankPage(pageIndex: Int, pageWidth: Float, pageHeight: Float, completionHandler: @escaping (Bool) -> Void) {
        if let pdfListView = self.pdfViewController?.pdfListView {
            var _index = pageIndex
            if pageIndex < 0 || pageIndex > pdfListView.document.pageCount {
                if pageIndex == -1 {
                    _index = Int(pdfListView.document.pageCount)
                } else {
                    completionHandler(false)
                }
            }
            
            let size = CGSize(width: Double(pageWidth), height: Double(pageHeight))
            let success = pdfListView.document.insertPage(size, at: UInt(_index))
            self.pdfViewController?.pdfListView?.layoutDocumentView()
            
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
    
    func PDFViewBaseControllerPageEditBack(_ baseController: CPDFViewBaseController) {
        self.delegate?.onPageEditDialogBackPress(self)
    }
    
    func PDFViewBaseController(_ baseController: CPDFViewBaseController, HiddenState state: Bool) {
        self.delegate?.onFullScreenChanged(self, isFull: state)
    }
    
    func PDFViewBaseControllerTouchEnded(_ baseController: CPDFViewBaseController) {
        self.delegate?.onTapMainDocArea(self)
    }
  
    public func PDFViewBaseControllerDissmiss(_ baseControllerDelete: CPDFViewBaseController) {
        self.delegate?.onIOSClickBackPressed(self)
    }
    
    // MARK: - Notification
    
    @objc func annotationsOperationChangeNotification(_ notification: Notification) {
        self.delegate?.onAnnotationHistoryChanged(self)
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
