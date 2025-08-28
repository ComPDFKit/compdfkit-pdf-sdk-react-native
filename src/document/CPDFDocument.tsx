/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { NativeModules, findNodeHandle } from 'react-native';
import { CPDFDocumentEncryptAlgo, CPDFDocumentPermissions } from '../configuration/CPDFOptions';
import { CPDFPage, CPDFPageSize } from '../page/CPDFPage';
import { CPDFAnnotation } from '../annotation/CPDFAnnotation';
import { CPDFWidget } from '../annotation/form/CPDFWidget';
import { CPDFTextSearcher } from '../page/CPDFTextSearcher';
const { CPDFViewManager } = NativeModules;

export class CPDFDocument {

    private _viewerRef: any;

    private _textSearcher: CPDFTextSearcher;

    constructor(viewerRef: any) {
        this._viewerRef = viewerRef;
        this._textSearcher = new CPDFTextSearcher(this._viewerRef);
    }

    /**
     * Get the text searcher for the current document.
     * @returns The text searcher instance for the current document.
     */
    get textSearcher() {
        return this._textSearcher;
    }

    /**
     * Get the page object at the specified index
     * @param pageIndex The index of the page to retrieve
     * @returns The page object at the specified index
     */
    pageAtIndex = (pageIndex : number) : CPDFPage  => {
        return new CPDFPage(this._viewerRef, pageIndex);
    }

    /**
     * Reopens a specified document in the current `CPDFReaderView` component.
     *
     * @example
     * await pdfReaderRef.current?._pdfDocument.open(document, 'password');
     *
     * @param document The file path of the PDF document.
     * * (Android) For a local storage file path:
     * ```tsx
     *    document = 'file:///storage/emulated/0/Download/sample.pdf'
     * ```
     * * (Android) For a content URI:
     * ```tsx
     *    document = 'content://...'
     * ```
     * * (Android) For an asset file path:
     * ```tsx
     *    document = "file:///android_asset/..."
     * ```
     * @param password The password for the document, which can be null or empty.
     * @returns A promise that resolves to `true` if the document is successfully opened, otherwise `false`.
     */
    open = (document: string, password: string | null = null): Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.open(tag, document, password);
        }
        return Promise.reject('Unable to find the native view reference');
    };

    /**
     * Gets the file name of the PDF document.
     * @example
     * const fileName = await pdfReaderRef.current?._pdfDocument.getFileName();
     * @returns
     */
    getFileName = (): Promise<string> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.getFileName(tag);
        }
        return Promise.reject('Unable to find the native view reference');
    }

    /**
     * Checks if the PDF document is encrypted.
     * @example
     * const isEncrypted = await pdfReaderRef.current?._pdfDocument.isEncrypted();
     * @returns
     */
    isEncrypted = (): Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.isEncrypted(tag);
        }
        return Promise.reject('Unable to find the native view reference');
    }

    /**
     * Checks if the PDF document is an image document.
     * This is a time-consuming operation that depends on the document size.
     * @example
     * const isImageDoc = await pdfReaderRef.current?._pdfDocument.isImageDoc();
     * @returns
     */
    isImageDoc = (): Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.isImageDoc(tag);
        }
        return Promise.reject('Unable to find the native view reference');
    }

    /**
     * Gets the current document's permissions. There are three types of permissions:
     * No restrictions: [CPDFDocumentPermissions.NONE]
     * If the document has an open password and an owner password,
     * using the open password will grant [CPDFDocumentPermissions.USER] permissions,
     * and using the owner password will grant [CPDFDocumentPermissions.OWNER] permissions.
     *
     * @example
     * const permissions = await pdfReaderRef.current?._pdfDocument.getPermissions();
     * @returns
     */
    getPermissions = async (): Promise<CPDFDocumentPermissions> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            const id = await CPDFViewManager.getPermissions(tag);
            if (id == 0) {
                return Promise.resolve(CPDFDocumentPermissions.NONE);
            } else if (id == 1) {
                return Promise.resolve(CPDFDocumentPermissions.USER);
            } else if (id == 2) {
                return Promise.resolve(CPDFDocumentPermissions.OWNER);
            }
        }
        return Promise.reject('Unable to find the native view reference');
    }

    /**
     * Check if owner permissions are unlocked
     *
     * @example
     * const unlocked = await pdfReaderRef.current?._pdfDocument.checkOwnerUnlocked();
     * @returns
     */
    checkOwnerUnlocked = (): Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.checkOwnerUnlocked(tag);
        }
        return Promise.reject('Unable to find the native view reference');
    }

    /**
     * Whether the owner password is correct.
     * If the password is correct, the document will be unlocked with full owner permissions.
     *
     * @example
     * const check = await pdfReaderRef.current?._pdfDocument.checkOwnerPassword('ownerPassword');
     *
     * @param password password The owner password to be verified.
     * @returns A promise that resolves to `true` if the owner password is correct, otherwise `false`.
     */
    checkOwnerPassword = (password: string): Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.checkOwnerPassword(tag, password);
        }
        return Promise.reject('Unable to find the native view reference');
    }

    /**
     * Get the total number of pages in the current document
     *
     * @example
     * const pageCount = await pdfReaderRef.current?._pdfDocument.getPageCount();
     *
     * @returns
     */
    getPageCount = (): Promise<number> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.getPageCount(tag);
        }
        return Promise.reject('Unable to find the native view reference');
    }

    /**
     * Remove the user password and owner permission password
     * set in the document, and perform an incremental save.
     *
     * @example
     * const result = await pdfReaderRef.current?._pdfDocument.removePassword();
     * @returns
     */
    removePassword = (): Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.removePassword(tag);
        }
        return Promise.reject('Unable to find the native view reference');
    }

    /**
     *
     * This method sets the document password, including the user password for access restrictions
     * and the owner password for granting permissions.
     *
     * - To enable permissions like printing or copying, the owner password must be set; otherwise,
     * the settings will not take effect.
     *
     * @example
     * const success = await pdfReaderRef.current?._pdfDocument.setPassword(
     *  'user_password',
     *  'owner_password',
     *  false,
     *  false,
     *  CPDFDocumentEncryptAlgo.rc4
     * );
     *
     * @param userPassword The user password for document access restrictions.
     * @param ownerPassword The owner password to grant permissions (e.g., printing, copying).
     * @param allowsPrinting Whether printing is allowed (true or false).
     * @param allowsCopying Whether copying is allowed (true or false).
     * @param encryptAlgo The encryption algorithm to use (e.g., `CPDFDocumentEncryptAlgo.rc4`).
     * @returns A promise that resolves to `true` if the password is successfully set, otherwise `false`.
     */
    setPassword = (
        userPassword: string,
        ownerPassword: string,
        allowsPrinting: boolean,
        allowsCopying: boolean,
        encryptAlgo: CPDFDocumentEncryptAlgo): Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.setPassword(tag, {
                'user_password': userPassword,
                'owner_password': ownerPassword,
                'allows_printing': allowsPrinting,
                'allows_copying': allowsCopying,
                'encrypt_algo': encryptAlgo
            });
        }
        return Promise.reject('Unable to find the native view reference');
    }

    /**
     * Get the encryption algorithm of the current document
     *
     * @example
     * const encryptAlgo = await pdfReaderRef.current?._pdfDocument.getEncryptAlgo();
     * @returns
     */
    getEncryptAlgo = async (): Promise<CPDFDocumentEncryptAlgo> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            const encryptAlgo = await CPDFViewManager.getEncryptAlgo(tag);
            if (encryptAlgo == 'noEncryptAlgo') {
                return Promise.resolve(CPDFDocumentEncryptAlgo.NO_ENCRYPT_ALGO);
            } else if (encryptAlgo == 'rc4') {
                return Promise.resolve(CPDFDocumentEncryptAlgo.RC4);
            } else if (encryptAlgo == 'aes128') {
                return Promise.resolve(CPDFDocumentEncryptAlgo.AES128);
            } else if (encryptAlgo == 'aes256') {
                return Promise.resolve(CPDFDocumentEncryptAlgo.AES256);
            }
        }
        return Promise.reject('Unable to find the native view reference')
    }

    /**
     * Checks whether the document has been modified
     *
     * @example
     * const hasChange = await pdfReaderRef.current?._pdfDocument.hasChange();
     *
     * @returns {Promise<boolean>} Returns a Promise indicating if the document has been modified.
     *          `true`: The document has been modified,
     *          `false`: The document has not been modified.
     *          If the native view reference cannot be found, a rejected Promise will be returned.
     */
    hasChange = (): Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.hasChange(tag);
        }
        return Promise.resolve(false);
    }

    /**
     * Exports annotations from the current PDF document to an XFDF file.
     *
     * @example
     * const exportXfdfFilePath = await pdfReaderRef.current?._pdfDocument.exportAnnotations();
     *
     * @returns The path of the XFDF file if export is successful; an empty string if the export fails.
     */
    exportAnnotations = (): Promise<string> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.exportAnnotations(tag);
        }
        return Promise.reject('Unable to find the native view reference');
    }

    /**
     *
     * Delete all comments in the current document
     * @example
     * const removeResult = await pdfReaderRef.current?._pdfDocument.removeAllAnnotations();
     *
     * @returns
     */
    removeAllAnnotations = (): Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.removeAllAnnotations(tag);
        }
        return Promise.resolve(false);
    }

    /**
     * Imports annotations from the specified XFDF file into the current PDF document.
     * @example
     * // Android - assets file
     * const testXfdf = 'file:///android_asset/test.xfdf';
     * const importResult = await pdfReaderRef.current?._pdfDocument.importAnnotations(testXfdf);
     *
     * // Android - file path
     * const testXfdf = '/data/user/0/com.compdfkit.reactnative.example/xxx/xxx.xfdf';
     * const importResult = await pdfReaderRef.current?._pdfDocument.importAnnotations(testXfdf);
     *
     * // Android - Uri
     * const xfdfUri = 'content://xxxx'
     * const importResult = await pdfReaderRef.current?._pdfDocument.importAnnotations(xfdfUri);
     *
     * // iOS
     *
     * @param xfdfFile Path of the XFDF file to be imported.
     * @returns true if the import is successful; otherwise, false.
     */
    importAnnotations = (xfdfFile: string): Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.importAnnotations(tag, xfdfFile);
        }
        return Promise.resolve(false);
    }

    /**
     * Imports the form data from the specified XFDF file into the current PDF document.
     * @example
     * const xfdfFile = '/data/user/0/com.compdfkit.reactnative.example/xxx/xxx.xfdf';
     * // or use Uri on the Android Platform.
     * const xfdfFile = 'content://xxxx';
     * const importResult = await pdfReaderRef.current?._pdfDocument.importWidgets(xfdfFile);
     *
     * @param xfdfFile Path of the XFDF file to be imported.
     * @returns true if the import is successful; otherwise, false.
     */
    importWidgets = (xfdfFile : string) : Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.importWidgets(tag, xfdfFile);
        }
        return Promise.resolve(false);
    }

    /**
     * exports the form data from the current PDF document to an XFDF file.
     * @example
     * const exportXfdfFilePath = await pdfReaderRef.current?._pdfDocument.exportWidgets();
     * @returns The path of the XFDF file if export is successful; an empty string if the export fails.
     */
    exportWidgets = (): Promise<string> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.exportWidgets(tag);
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }

    /**
     * Invokes the system's print service to print the current document.
     * @example
     * await pdfReaderRef.current?._pdfDocument.printDocument();
     * @returns
     */
    printDocument = () : Promise<void> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.printDocument(tag);
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }

    /**
     * Flatten all pages of the current document
     * @param savePath The path to save the flattened document. On Android, you can pass a Uri.
     * @param fontSubset Whether to include the font subset when saving.
     * @example
     * const savePath = 'file:///storage/emulated/0/Download/flatten.pdf';
     * // or use Uri on the Android Platform.
     * const savePath = await ComPDFKit.createUri('flatten_test.pdf', 'compdfkit', 'application/pdf');
     * const fontSubset = true;
     * const result = await pdfReaderRef.current?._pdfDocument.flattenAllPages(savePath, fontSubset);
     * @returns Returns 'true' if the flattened document is saved successfully, otherwise 'false'.
     */
    flattenAllPages = (savePath : string, fontSubset : boolean) : Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.flattenAllPages(tag, savePath, fontSubset);
        }
        return Promise.reject('Unable to find the native view reference');
    }

    /**
     * Saves the document to the specified directory.
     * @example
     * const savePath = 'file:///storage/emulated/0/Download/save.pdf';
     * const removeSecurity = false;
     * const fontSubset = true;
     * const result = await pdfReaderRef.current?._pdfDocument.saveAs(savePath, removeSecurity, fontSubset);
     * @param savePath Specifies the path where the document should be saved.<br>
     *
     *      On Android, both file paths and URIs are supported. For example:
     *      - File path: `/data/user/0/com.compdfkit.flutter.example/cache/temp/PDF_Document.pdf`
     *      - URI: `content://media/external/file/1000045118`
     * @param removeSecurity Whether to remove the document's password.
     * @param fontSubset Whether to embed font subsets into PDF. Defaults to true.
     * @returns Returns 'true' if the document is saved successfully, otherwise 'false'.
     */
    saveAs = (savePath : string, removeSecurity : boolean, fontSubset : boolean) : Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.saveAs(tag, savePath, removeSecurity, fontSubset);
        }
        return Promise.reject('Unable to find the native view reference');
    }

    /**
     * Imports another PDF document and inserts it at a specified position in the current document.
     *
     * This method imports an external PDF document into the current document, allowing you to choose which pages to import and where to insert the document.
     *
     * @example
     * const filePath = '/data/user/0/com.compdfkit.flutter.example/cache/temp/PDF_Document.pdf';
     * const pages = [0]; // The pages to import from the document
     * const insertPosition = 0; // The position to insert, 0 means insert at the beginning of the document
     * const password = ''; // The password for the document, if encrypted
     * const importResult = await pdfReaderRef.current?._pdfDocument.importDocument(filePath, pages, insertPosition, password);
     *
     * @param filePath The path of the PDF document to import. Must be a valid, accessible path on the device.
     * @param pages The collection of pages to import, represented as an array of integers. If `null` or an empty array is passed, the entire document will be imported.
     * @param insertPosition The position to insert the external document into the current document. This value must be provided. If not specified, the document will be inserted at the end of the current document.
     * @param password The password for the document, if it is encrypted. If the document is not encrypted, an empty string `''` can be passed.
     *
     * @returns Returns a `Promise<boolean>` indicating whether the document import was successful.
     * - `true` indicates success
     * - `false` or an error indicates failure
     *
     * @throws If the native view reference cannot be found, the promise will be rejected with an error.
     */
    importDocument = (
        filePath : string,
        pages: Array<number> | null = [],
        insertPosition: number = -1,
        password : string | null = '',
    ) : Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.importDocument(tag, filePath, {
                'password' : password,
                'pages': pages,
                'insert_position' : insertPosition
            });
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }

    /**
     * Splits the specified pages from the current document and saves them as a new document.
     *
     * This function extracts the given pages from the current PDF document and saves them as a
     * new document at the provided save path.
     *
     * @example
     * const savePath = '/data/user/0/com.compdfkit.flutter.example/cache/temp/PDF_Document.pdf';
     * const pages = [0, 2, 4]; // Pages to extract from the current document
     * const result = await pdfReaderRef.current?.splitDocumentPages(savePath, pages);
     *
     * @param savePath The path where the new document will be saved.
     * @param pages The array of page numbers to be extracted and saved in the new document.
     *
     * @returns A Promise that resolves to `true` if the operation is successful, or `false` if it fails.
     *
     * @throws If the native view reference is not found, the promise will be rejected with an error message.
     */
    splitDocumentPages = (
        savePath : string,
        pages : Array<number> = [],
    ) : Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.splitDocumentPages(tag, savePath, pages);
        }
        return Promise.reject('Unable to find the native view reference');
    }


    /**
     * Retrieves the path of the current document.
     * On Android, if the document was opened via a URI, the URI will be returned.
     *
     * This function returns the path of the document being viewed. If the document was opened
     * through a file URI on Android, the URI string will be returned instead of a file path.
     *
     * @example
     * const documentPath = await pdfReaderRef.current?._pdfDocument.getDocumentPath();
     *
     * @returns A promise that resolves to the path (or URI) of the current document.
     * If the native view reference is not found, the promise will be rejected with an error.
     *
     * @throws Will reject with an error message if the native view reference cannot be found.
     */
    getDocumentPath = () : Promise<string> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.getDocumentPath(tag);
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }

    /**
     * Inserts a blank page at the specified index in the document.
     *
     * This method allows adding a blank page of a specified size at a specific index within the PDF document.
     * It is useful for document editing scenarios where page insertion is needed.
     *
     * @param pageIndex - The index position where the blank page will be inserted. Must be a valid index within the document.
     * @param pageSize - The size of the blank page to insert. Defaults to A4 size if not specified.
     *   Custom page sizes can be used by creating an instance of `CPDFPageSize` with custom dimensions.
     * @example
     * const pageSize = CPDFPageSize.a4;
     * // Custom page size
     * // const pageSize = new CPDFPageSize(500, 800);
     * const result = await pdfReaderRef.current?._pdfDocument.insertBlankPage(0, pageSize);
     * @returns A Promise that resolves to a boolean value indicating the success or failure of the blank page insertion.
     *   Resolves to `true` if the insertion was successful, `false` otherwise.
     */
    insertBlankPage(pageIndex : number, pageSize : CPDFPageSize = CPDFPageSize.a4) : Promise<boolean> {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.insertBlankPage(tag, pageIndex, pageSize.width, pageSize.height);
        }
        return Promise.reject('Unable to find the native view reference');
    }

    /**
     * Removes an annotation from the current page.
     * @param annotation The annotation to be removed.
     * @example
     * await pdfReaderRef?.current?._pdfDocument.removeAnnotation(annotation);
     */
    removeAnnotation(annotation : CPDFAnnotation) : Promise<boolean> {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.removeAnnotation(tag, annotation.page, annotation.uuid);
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }

    /**
     * Removes a form widget from the current page.
     * @example
     * await pdfReaderRef?.current?._pdfDocument.removeWidget(widget);
     * @see CPDFWidget - Base class for all form widgets
     * @param widget The widget to be removed.
     * @returns
     */
    removeWidget(widget : CPDFWidget) : Promise<boolean> {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.removeWidget(tag, widget.page, widget.uuid);
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }

}


// export default CPDFDocument;
