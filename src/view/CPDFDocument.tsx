import { NativeModules, findNodeHandle } from 'react-native';
import { CPDFDocumentEncryptAlgo, CPDFDocumentPermissions } from '../configuration/CPDFOptions';
const { CPDFViewManager } = NativeModules;

export class CPDFDocument {

    _viewerRef: any;

    constructor(viewerRef: any) {
        this._viewerRef = viewerRef;
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
     * @returns Returns the save path of the current document.
     */
    // flattenAllPages = (savePath : string, fontSubset : boolean) : Promise<string> => {
    //     const tag = findNodeHandle(this._viewerRef);
    //     if (tag != null) {
    //         return CPDFViewManager.flattenAllPages(tag, {
    //             'save_path': savePath,
    //             'font_sub_set': fontSubset
    //         });
    //     }
    //     return Promise.reject(new Error('Unable to find the native view reference'));
    // }

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
     * @param fontSubset
     * @returns Whether to embed the font subset when saving the PDF.
     */
    // saveAs = (savePath : string, removeSecurity : boolean, fontSubset : boolean) : Promise<string> => {
    //     const tag = findNodeHandle(this._viewerRef);
    //     if (tag != null) {
    //         return CPDFViewManager.saveAs(tag, {
    //             'save_path': savePath,
    //             'remove_security': removeSecurity,
    //             'font_sub_set': fontSubset
    //         });
    //     }
    //     return Promise.reject(new Error('Unable to find the native view reference'));
    // }

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

}
// export default CPDFDocument;
