/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { NativeModules, findNodeHandle, Platform } from "react-native";
import {
  CPDFAnnotationRenderOptions,
  CPDFDocumentEncryptAlgo,
  CPDFDocumentPermissions,
  CPDFPageCompression,
  HexColor,
} from "../configuration/CPDFOptions";
import { CPDFPage, CPDFPageSize } from "../page/CPDFPage";
import { CPDFAnnotation } from "../annotation/CPDFAnnotation";
import { CPDFImageAnnotation } from "../annotation/CPDFImageAnnotation";
import { CPDFWidget } from "../annotation/form/CPDFWidget";
import { CPDFTextSearcher } from "../page/CPDFTextSearcher";
import { normalizeColorsInAnnotation, normalizeColorsInWidget, normalizeColorToARGB } from "../util/CPDFEnumUtils";
import { CPDFImageData, CPDFImageType } from "../util/CPDFImageData";
import { CPDFInfo } from "./CPDFInfo";
import { CPDFDocumentPermissionInfo } from "./CPDFDocumentPermissionInfo";
import { CPDFOutline } from "./CPDFOutline";
import { CPDFBookmark } from "./CPDFBookmark";
import { CPDFEditorTextAttr } from "../configuration/config/CPDFContentEditorConfig";
import { CPDFEditArea } from "../edit/CPDFEditArea";
import { CPDFSignatureWidget } from "../annotation/form/CPDFSignatureWidget";
const { CPDFViewManager } = NativeModules;

const DEFAULT_ANNOTATION_RENDER_SCALE = 3.0;
const DEFAULT_ANNOTATION_RENDER_QUALITY = 100;

function createAnnotationRenderOptions(
  options: CPDFAnnotationRenderOptions = {}
) {
  const scale = options.scale ?? DEFAULT_ANNOTATION_RENDER_SCALE;
  const targetWidth = options.targetWidth;
  const targetHeight = options.targetHeight;
  const compression = options.compression ?? CPDFPageCompression.PNG;
  const quality = options.quality ?? DEFAULT_ANNOTATION_RENDER_QUALITY;

  if (scale <= 0) {
    throw new Error("renderAnnotationAppearance(): scale must be greater than 0.");
  }
  if (targetWidth != null && targetWidth <= 0) {
    throw new Error("renderAnnotationAppearance(): targetWidth must be greater than 0.");
  }
  if (targetHeight != null && targetHeight <= 0) {
    throw new Error("renderAnnotationAppearance(): targetHeight must be greater than 0.");
  }
  if (quality < 1 || quality > 100) {
    throw new Error("renderAnnotationAppearance(): quality must be between 1 and 100.");
  }

  return {
    scale,
    target_width: targetWidth,
    target_height: targetHeight,
    compression,
    quality,
  };
}

function normalizeNativeDate(value: unknown): Date | undefined {
  if (value == null) {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(value as string | number);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

function normalizeBookmark(bookmark: CPDFBookmark): CPDFBookmark {
  return {
    ...bookmark,
    date: normalizeNativeDate(bookmark.date),
  };
}

function normalizeDocumentInfo(info: CPDFInfo): CPDFInfo {
  return {
    ...info,
    creationDate: normalizeNativeDate(info.creationDate),
    modificationDate: normalizeNativeDate(info.modificationDate),
  };
}

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
  pageAtIndex = (pageIndex: number): CPDFPage => {
    return new CPDFPage(this._viewerRef, pageIndex);
  };

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
  open = (
    document: string,
    password: string | null = null,
    pageIndex: number = 0
  ): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.open(tag, document, password, pageIndex);
    }
    return Promise.reject("Unable to find the native view reference");
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
    return Promise.reject("Unable to find the native view reference");
  };

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
    return Promise.reject("Unable to find the native view reference");
  };

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
    return Promise.reject("Unable to find the native view reference");
  };

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
    return Promise.reject("Unable to find the native view reference");
  };

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
    return Promise.reject("Unable to find the native view reference");
  };

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
    return Promise.reject("Unable to find the native view reference");
  };

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
    return Promise.reject("Unable to find the native view reference");
  };

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
    return Promise.reject("Unable to find the native view reference");
  };

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
    encryptAlgo: CPDFDocumentEncryptAlgo
  ): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setPassword(tag, {
        user_password: userPassword,
        owner_password: ownerPassword,
        allows_printing: allowsPrinting,
        allows_copying: allowsCopying,
        encrypt_algo: encryptAlgo,
      });
    }
    return Promise.reject("Unable to find the native view reference");
  };

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
      if (encryptAlgo == "noEncryptAlgo") {
        return Promise.resolve(CPDFDocumentEncryptAlgo.NO_ENCRYPT_ALGO);
      } else if (encryptAlgo == "rc4") {
        return Promise.resolve(CPDFDocumentEncryptAlgo.RC4);
      } else if (encryptAlgo == "aes128") {
        return Promise.resolve(CPDFDocumentEncryptAlgo.AES128);
      } else if (encryptAlgo == "aes256") {
        return Promise.resolve(CPDFDocumentEncryptAlgo.AES256);
      }
    }
    return Promise.reject("Unable to find the native view reference");
  };

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
  };

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
    return Promise.reject("Unable to find the native view reference");
  };

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
  };

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
  };

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
  importWidgets = (xfdfFile: string): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.importWidgets(tag, xfdfFile);
    }
    return Promise.resolve(false);
  };

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
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  };

  /**
   * Invokes the system's print service to print the current document.
   * @example
   * await pdfReaderRef.current?._pdfDocument.printDocument();
   * @returns
   */
  printDocument = (): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.printDocument(tag);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  };

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
   * await pdfReaderRef.current?.reloadPages2();
   * @returns Returns 'true' if the flattened document is saved successfully, otherwise 'false'.
   */
  flattenAllPages = (
    savePath: string,
    fontSubset: boolean
  ): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.flattenAllPages(tag, savePath, fontSubset);
    }
    return Promise.reject("Unable to find the native view reference");
  };

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
  saveAs = (
    savePath: string,
    removeSecurity: boolean,
    fontSubset: boolean
  ): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.saveAs(tag, savePath, removeSecurity, fontSubset);
    }
    return Promise.reject("Unable to find the native view reference");
  };

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
    filePath: string,
    pages: Array<number> | null = [],
    insertPosition: number = -1,
    password: string | null = ""
  ): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.importDocument(tag, filePath, {
        password: password,
        pages: pages,
        insert_position: insertPosition,
      });
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  };

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
    savePath: string,
    pages: Array<number> = []
  ): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.splitDocumentPages(tag, savePath, pages);
    }
    return Promise.reject("Unable to find the native view reference");
  };

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
  getDocumentPath = (): Promise<string> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.getDocumentPath(tag);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  };

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
  insertBlankPage(
    pageIndex: number,
    pageSize: CPDFPageSize = CPDFPageSize.a4
  ): Promise<boolean> {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.insertBlankPage(
        tag,
        pageIndex,
        pageSize.width,
        pageSize.height
      );
    }
    return Promise.reject("Unable to find the native view reference");
  }

  /**
   * Inserts an image as a new page into the current document at the specified index.
   *
   * The image will be placed on a blank page with the given dimensions. The imagePath
   * should point to a valid image resource accessible by the native platform (for example,
   * a file path, content URI on Android, or bundled asset path).
   *
   * @param pageIndex - Zero-based index at which the new image page will be inserted. Must be a valid index within the document (inserting at 0 places the page at the beginning).
   * @param imagePath - Path or URI to the image to be inserted (platform-dependent). The image format should be supported by the underlying platform (e.g., PNG, JPEG).
   * @param pageSize - The size of the page to create for the image. Defaults to A4 size if not provided.
   * @returns A Promise that resolves to `true` if the image page was successfully inserted, or `false` if the operation failed.
   *
   * @example
   * // Android file path:
   * const imagePath = 'file:///storage/emulated/0/Download/photo.jpg';
   * 
   * // Android content URI:
   * const imagePath = 'content://media/external/images/media/12345';
   * 
   * // Android asset path:
   * const imagePath = 'file:///assets/photo.jpg';
   * 
   * // iOS file path:
   * const imagePath = 'var/mobile/Containers/Data/Application/.../Documents/photo.jpg';
   * 
   * // insert image page at index 2
   * const success = await pdfReaderRef.current?._pdfDocument.insertImagePage(2, imagePath, CPDFPageSize.custom(imageWidth, imageHeight));
   * 
   * // need reload pages after inserting image page.
   * if (success) {
   *   await pdfReaderRef.current?.reloadPages2();
   * } 
   */
  insertImagePage(
    pageIndex: number,
    imagePath: string,
    pageSize: CPDFPageSize = CPDFPageSize.a4
  ): Promise<boolean> {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.insertImagePage(
        tag,
        pageIndex,
        imagePath,
        pageSize.width,
        pageSize.height
      );
    }
    return Promise.reject("Unable to find the native view reference");
  }

  /**
   * Removes the pages at the specified indices from the current document.
   *
   * The provided array should contain zero-based page indices to remove. Behavior for duplicate
   * indices or out-of-range indices depends on the native implementation; callers should ensure
   * indices are valid and unique where possible.
   *
   * @param pageIndices - An array of zero-based page indices identifying the pages to remove.
   * @returns A Promise that resolves to `true` if the pages were successfully removed, or `false` on failure.
   *
   * @example
   * const result = await pdfReaderRef.current?._pdfDocument.removePages([0, 2, 5]);
   * // need reload pages after removing pages.
   * if (result){
   *     await pdfReaderRef.current?.reloadPages2();
   * }
   */
  removePages(pageIndices: Array<number>): Promise<boolean> {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.removePages(tag, pageIndices);
    }
    return Promise.reject("Unable to find the native view reference");
  }

  /**
   * Moves a page from one index to another within the current document.
   *
   * This operation reorders pages so that the page originally at `fromIndex` will be placed
   * at `toIndex`. Both indices are zero-based. If `toIndex` is greater than the current page
   * count or either index is invalid, the operation may fail.
   *
   * @param fromIndex - The zero-based index of the page to move.
   * @param toIndex - The zero-based target index where the page should be inserted.
   * @returns A Promise that resolves to `true` if the page was moved successfully, or `false` if the operation failed.
   *
   * @example
   * const moved = await pdfReaderRef.current?._pdfDocument.movePage(4, 1);
   * // need reload pages after moving page.
   * if (moved){
   *     await pdfReaderRef.current?.reloadPages2();
   * }
   */
  movePage(fromIndex: number, toIndex: number): Promise<boolean> {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.movePage(tag, fromIndex, toIndex);
    }
    return Promise.reject("Unable to find the native view reference");
  }

  /**
   * Removes an annotation from the current page.
   * @param annotation The annotation to be removed.
   * @example
   * await pdfReaderRef?.current?._pdfDocument.removeAnnotation(annotation);
   */
  removeAnnotation(annotation: CPDFAnnotation): Promise<boolean> {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.removeAnnotation(
        tag,
        annotation.page,
        annotation.uuid
      );
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Removes a form widget from the current page.
   * @example
   * await pdfReaderRef?.current?._pdfDocument.removeWidget(widget);
   * @see CPDFWidget - Base class for all form widgets
   * @param widget The widget to be removed.
   * @returns
   */
  removeWidget(widget: CPDFWidget): Promise<boolean> {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.removeWidget(tag, widget.page, widget.uuid);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Gets the size of the specified page.
   * @example
   * const size = await pdfReaderRef?.current?._pdfDocument.getPageSize(pageIndex);
   * @param pageIndex The index of the page (0-based).
   * @returns The size of the specified page as a `CPDFPageSize` object.
   * @throws Error If the native view reference cannot be found.
   * @remarks This method retrieves the dimensions of a specific page in the PDF document.
   * @since 2.5.0
   */
  getPageSize = async (pageIndex: number): Promise<CPDFPageSize> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      const size = await CPDFViewManager.getPageSize(tag, pageIndex);
      return Promise.resolve(CPDFPageSize.custom(size.width, size.height));
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  };

  /**
   * Renders a PDF page into a base64-encoded image string.
   *
   * Converts the specified page of the currently loaded PDF document into an image
   * with the given dimensions, background color, and optional annotations or form fields.
   * Useful for generating page thumbnails or exporting a page snapshot.
   *
   * @example
   * ```ts
   * const size = await pdfReaderRef.current?._pdfDocument.getPageSize(pageIndex);
   * const image = await pdfReaderRef.current?._pdfDocument.renderPage({
   *   pageIndex,
   *   width: size.width,
   *   height: size.height,
   *   backgroundColor: '#FFFFFF',
   *   drawAnnot: true,
   *   drawForm: true,
   * });
   * console.log(image); // iVBORw0KGgo...
   * ```
   *
   * @param options Rendering options
   * @param options.pageIndex The index of the page to render (0-based).
   * @param options.width The width of the rendered image in pixels.
   * @param options.height The height of the rendered image in pixels.
   * @param options.backgroundColor The background color of the rendered page.
   * **Only supported on Android.**
   * @param options.drawAnnot Whether to draw annotations on the page.
   * **Only supported on Android.**
   * @param options.drawForm Whether to draw form fields on the page.
   * **Only supported on Android.**
   * @param options.pageCompression The compression format used for rendering (e.g., PNG or JPEG).
   *
   * @returns A Promise that resolves to a base64-encoded image string.
   *
   * @throws Error If the native view reference cannot be found.
   *
   * @remarks
   * - Rendering is performed on the native thread.
   * - For iOS, only the basic rendering parameters are supported.
   *
   * @since 2.5.0
   */
  renderPage({
    pageIndex,
    width,
    height,
    backgroundColor = "#FFFFFF",
    drawAnnot = true,
    drawForm = true,
    pageCompression = CPDFPageCompression.PNG,
  }: {
    pageIndex: number;
    width: number;
    height: number;
    backgroundColor?: HexColor;
    drawAnnot?: boolean;
    drawForm?: boolean;
    pageCompression?: CPDFPageCompression;
  }): Promise<string> {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.renderPage(
        tag,
        pageIndex,
        width,
        height,
        normalizeColorToARGB(backgroundColor),
        drawAnnot,
        drawForm,
        pageCompression
      );
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Renders the current appearance of an annotation to a base64-encoded image string.
   *
   * This API renders the annotation appearance from the PDF page. It does not
   * return the original source asset for annotations backed by external content.
   *
   * @example
   * ```ts
   * const page = pdfReaderRef.current?._pdfDocument.pageAtIndex(0);
   * const annotations = await page?.getAnnotations();
   * const annotation = annotations?.[0];
   *
   * if (annotation) {
   *   const base64 = await pdfReaderRef.current?._pdfDocument.renderAnnotationAppearance(
   *     annotation,
   *     {
   *       scale: 4,
   *       compression: CPDFPageCompression.PNG,
   *     }
   *   );
   * }
   * ```
   */
  renderAnnotationAppearance = (
    annotation: CPDFAnnotation,
    options: CPDFAnnotationRenderOptions = {}
  ): Promise<string> => {
    if (annotation.page === undefined || annotation.page === null) {
      throw new Error("renderAnnotationAppearance(): annotation.page is required.");
    }
    if (!annotation.uuid) {
      throw new Error("renderAnnotationAppearance(): annotation.uuid is required.");
    }

    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.renderAnnotationAppearance(
        tag,
        annotation.page,
        annotation.uuid,
        createAnnotationRenderOptions(options)
      );
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  };

  /**
   * Gets the document information, such as title, author, subject, keywords, creation date, modification date, and producer.
   * @example
   * const info = await pdfReaderRef?.current?._pdfDocument.getInfo();
   * console.log(info.title);
   * @see CPDFInfo - Document information class
   * @returns A promise that resolves to a `CPDFInfo` object containing the document information.
   */
  getInfo = (): Promise<CPDFInfo> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.getInfo(tag).then((info: CPDFInfo | null | undefined) =>
        normalizeDocumentInfo(info ?? {})
      );
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Gets major version string of document.
   * @example
   * const majorVersion = await pdfReaderRef?.current?._pdfDocument.getMajorVersion();
   * console.log(majorVersion);
   * 
   * @returns a Promise that resolves to the major version number.
   */
  getMajorVersion = (): Promise<number> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.getMajorVersion(tag);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Gets minor version string of document.
   * @example
   * const minorVersion = await pdfReaderRef?.current?._pdfDocument.getMinorVersion();
   * console.log(minorVersion);
   * @returns a Promise that resolves to the minor version number.
   */
  getMinorVersion = (): Promise<number> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.getMinorVersion(tag);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Gets permission information of document, including whether printing, copying, modifying, annotating, filling forms, etc. are allowed.
   * @example
   * const permissionsInfo = await pdfReaderRef?.current?._pdfDocument.getPermissionsInfo();
   * @returns a Promise that resolves to the CPDFDocumentPermissionInfo object.
   */
  getPermissionsInfo = (): Promise<CPDFDocumentPermissionInfo> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.getPermissionsInfo(tag);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Gets the outline root of the document.
   * @example
   * const outlineRoot = await pdfReaderRef?.current?._pdfDocument.getOutlineRoot();
   * 
   * @see CPDFOutline - Document outline class
   * @returns 
   */
  getOutlineRoot = (): Promise<CPDFOutline | null> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.getOutlineRoot(tag);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * if document has no outline, create a new outline root.
   * @example
   * const outlineRoot = await pdfReaderRef?.current?._pdfDocument.getOutlineRoot();
   * if (!outlineRoot) {
   *    outlineRoot = await pdfReaderRef?.current?._pdfDocument.newOutlineRoot();
   * }
   * 
   * @see CPDFOutline - Document outline class
   * @returns 
   */
  newOutlineRoot = (): Promise<CPDFOutline | null> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.newOutlineRoot(tag);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Adds a new outline item under the given parent.
   *
   * @param parentUuid UUID of parent outline.
   * @param title      Title of the new outline.
   * @param insertIndex Insert position within parent's children. Use -1 to append.
   * @param pageIndex  Target page index for the outline destination.
   * @example
   * await pdfReaderRef.current?._pdfDocument.addOutline('parent_outline_id', 'New Section', -1, 0);
   */
  addOutline = (parentUuid: string, title: string, insertIndex: number = -1, pageIndex: number): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      try {
        return CPDFViewManager.addOutline(tag, parentUuid, title, insertIndex, pageIndex);
      } catch (e) {
        console.error(e);
      }
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }


  /**
   * Removes an outline by its UUID.
   * @param outlineId UUID of the outline to remove.
   * @example
   * await pdfReaderRef.current?._pdfDocument.removeOutline(outline.uuid);
   */
  removeOutline = (outlineId: string): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.removeOutline(tag, outlineId);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Updates an outline by UUID.
   * @param outlineId UUID of the outline to update.
   * @param newTitle New title.
   * @param newPageIndex New destination page index.
   * @example
   * await pdfReaderRef.current?._pdfDocument.updateOutline(id, 'Chapter 1', 0);
   */
  updateOutline = (outlineId: string, newTitle: string, newPageIndex: number): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.updateOutline(tag, outlineId, newTitle, newPageIndex);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Moves an outline under a new parent by UUID.
   * @param outlineId UUID of outline to move.
   * @param newParentId UUID of the new parent outline (empty string for root).
   * @param insertIndex Insert position within new parent's children. Use -1 to append.
   * @example
   * await pdfReaderRef.current?._pdfDocument.moveOutline(outlineId, parentId, -1);
   */
  moveOutline = (outlineId: string, newParentId: string, insertIndex: number): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.moveOutline(tag, outlineId, newParentId, insertIndex);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Retrieves all bookmarks in the current document.
   *
   * @returns A promise that resolves to an array of {@link CPDFBookmark} objects.
   * @example
   * const bookmarks = await pdfReaderRef.current?._pdfDocument.getBookmarks();
   * console.log('Number of bookmarks:', bookmarks.length);
   * @see CPDFBookmark
   */
  getBookmarks = (): Promise<CPDFBookmark[]> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.getBookmarks(tag).then(
        (bookmarks: CPDFBookmark[] | null | undefined) =>
          Array.isArray(bookmarks) ? bookmarks.map(normalizeBookmark) : []
      );
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Removes a bookmark at the specified page index.
   *
   * @example
   * const removeResult = await pdfReaderRef.current?._pdfDocument.removeBookmark(2);
   * @param pageIndex The index of the page whose bookmark should be removed.
   * @returns A promise that resolves to `true` if the bookmark was successfully removed, otherwise `false`.
   */
  removeBookmark = (pageIndex: number): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.removeBookmark(tag, pageIndex);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Checks if a bookmark exists at the specified page index.
   *
   * @example
   * const hasBookmark = await pdfReaderRef.current?._pdfDocument.hasBookmark(2);
   * @param pageIndex The index of the page to check for a bookmark. 
   * @returns 
   */
  hasBookmark = (pageIndex: number): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.hasBookmark(tag, pageIndex);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Adds a bookmark at the specified page index with the given title.
   *
   * @example
   * const addResult = await pdfReaderRef.current?._pdfDocument.addBookmark('Chapter 1', 2);
   * @param title The title of the bookmark to be added.
   * @param pageIndex The index of the page where the bookmark should be added.
   * @returns A promise that resolves to `true` if the bookmark was successfully added, otherwise `false`.
   */
  addBookmark = (title: string, pageIndex: number): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.addBookmark(tag, title, pageIndex);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
   * Updates an existing bookmark with new title and page index.
   *
   * @example
   * const updateResult = await pdfReaderRef.current?._pdfDocument.updateBookmark(bookmark);
   * @param bookmark The bookmark object containing updated information.
   * @returns A promise that resolves to `true` if the bookmark was successfully updated, otherwise `false`.
   */
  updateBookmark = (bookmark: CPDFBookmark): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.updateBookmark(tag, bookmark.uuid, bookmark.title);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  /**
 * Removes the specified edit area from the document.
 *
 * @example
 * // first addEventListener to listen for edit area selected event
 * pdfReaderRef.current?.addEventListener('onEditAreaSelected', (editArea : CPDFEditArea) => {
 *    // store the selected edit area
 *    this.selectedEditArea = editArea;
 * });
 * // then remove the selected edit area
 * await pdfReaderRef.current?.removeEditArea(editArea);
 *
 * @param editArea The edit area to be removed.
 * @returns
 */
  removeEditArea = (editArea: CPDFEditArea): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.removeEditArea(tag, editArea.page, editArea.uuid, CPDFEditArea.editTypeToString(editArea.type));
    }
    return Promise.resolve();
  };

  /**
   * Updates the specified annotation in the document.
   * For modifiable properties, please refer to the update method of CPDFAnnotation and its subclasses.
   * 
   * @example
   * // update markup annotation
   * const markupAnnotation = annotation as CPDFMarkupAnnotation;
   * markupAnnotation.update({
   *    title: 'ComPDFKit',
   *    content: 'Updated content',
   *    markupText: 'Updated markup text',
   *    color: '#FF0000',
   *    alpha: 255
   * });
   * await pdfReaderRef.current?._pdfDocument.updateAnnotation(annotation);
   * @see CPDFAnnotation - Base class for all annotations
   * @param annotation The annotation to be updated.
   * @returns 
   */
  updateAnnotation = (annotation: CPDFAnnotation): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      // Convert annotation to JSON and normalize colors to ARGB format for native layer
      const annotData = annotation.toJSON();
      const normalizedData = normalizeColorsInAnnotation(annotData);
      return CPDFViewManager.updateAnnotation(tag, normalizedData);
    }
    return Promise.resolve();
  };

  updateWidget = (widget: CPDFWidget): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      // Convert widget to JSON and normalize colors to ARGB format for native layer
      try {
        const widgetData = widget.toJSON();
        const normalizedData = normalizeColorsInWidget(widgetData);
        console.log('Updating widget with data:', normalizedData);
        return CPDFViewManager.updateWidget(tag, normalizedData);
      } catch (e) {
        console.error('Error updating widget:', e);
      }

    }
    return Promise.resolve();
  };

  /**
   * Creates a new text area in the content editor on the specified page.
   * This method is only supported on the Android platform.
   * 
   * @param options Configuration options for the new text area
   * @param options.pageIndex The index of the page where the text area will be created
   * @param options.content The text content to display
   * @param options.offset The position (x, y) where the text area will be placed
   * @param options.maxWidth Optional maximum width of the text area
   * @param options.attr Optional text attributes (font color, size, alignment, etc.)
   * 
   * @example
   * await pdfReaderRef.current?._pdfDocument.createNewTextArea({
   *   pageIndex: 0,
   *   content: 'Hello World',
   *   offset: { x: 100, y: 100 },
   *   maxWidth: 300,
   *   attr: { fontColor: '#000000', fontSize: 20 }
   * });
   * 

   * @returns true if the text area was created successfully, otherwise false
   * @throws Throws an error if not running on Android platform
   */
  createNewTextArea = async (options: {
    pageIndex: number;
    content: string;
    offset: { x: number; y: number };
    maxWidth?: number;
    attr?: CPDFEditorTextAttr;
  }): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      throw new Error('createNewTextArea() is only supported on Android platform.');
    }
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.createNewTextArea(tag, {
        page_index: options.pageIndex,
        content: options.content,
        x: options.offset.x,
        y: options.offset.y,
        max_width: options.maxWidth,
        attr: options.attr || {},
      });
    }
    return Promise.resolve(false);
  };

  /**
   * Creates a new image area in the content editor on the specified page.
   * This method is only supported on the Android platform.
   * 
   * @param options Configuration options for the new image area
   * @param options.pageIndex The index of the page where the image area will be created
   * @param options.imageData The CPDFImageData instance containing the image source
   * @param options.offset The position (x, y) where the image area will be placed
   * @param options.width Optional width of the image area (default: 200)
   * 
   * @example
   * - Android Assets Path:
   * const imageData = CPDFImageData.fromAsset('image.png');
   * 
   * - Android Content URI:
   * const imageData = CPDFImageData.fromUri('content://media/external/images/media/12345');
   * 
   * - Android File Path:
   * const imageData = CPDFImageData.fromPath('/storage/emulated/0/Download/image.png');
   * 
   * - iOS File Path:
   * const imageData = CPDFImageData.fromPath('/var/mobile/Containers/Data/Application/.../Documents/image.png');
   * 
   * - Base64 String:
   * const imageData = CPDFImageData.fromBase64('iVBORw0KGgoAAAANSUhEUgAAAAUA...');
   * 
   * await pdfReaderRef.current?._pdfDocument.createNewImageArea({
   *   pageIndex: 0,
   *   imageData: imageData,
   *   offset: { x: 100, y: 100 },
   *   width: 200
   * });
   * 

   * @returns true if the image area was created successfully, otherwise false
   * @throws Throws an error if not running on Android platform
   */
  createNewImageArea = async (options: {
    pageIndex: number;
    imageData: CPDFImageData;
    offset: { x: number; y: number };
    width?: number;
  }): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      throw new Error('createNewImageArea() is only supported on Android platform.');
    }
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      try {
        return await CPDFViewManager.createNewImageArea(tag, {
          page_index: options.pageIndex,
          image_data: options.imageData.toJson(),
          x: options.offset.x,
          y: options.offset.y,
          width: options.width || 200,
        });
      } catch (error) {
        console.error('Error creating image area:', error);
        return false;
      }
    }
    return Promise.resolve(false);
  };

  /**
     * Adds an image signature to the widget.
     * @param imagePath The path of the image to be added as a signature.
     * @example
     * android support uri format:
     * await pdfDocument.addSignatureImage(signatureWidget, 'content://media/external/images/media/123');
     * file path:
     * const result = await pdfDocument.addSignatureImage(signatureWidget, '/path/to/image');
     * if (result) {
     *   await pdfDocument.updateAp(signatureWidget);
     * }
     * @returns 
     */
  addSignatureImage = (signatureWidget: CPDFSignatureWidget, imagePath: string): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.addWidgetImageSignature(tag, signatureWidget.page, signatureWidget.uuid, imagePath);
    }
    return Promise.reject(new Error('Unable to find the native view reference'));
  }

  /**
   * Updates the appearance of the specified widget.
   * 
   * @example
   * await pdfDocument.updateAp(signatureWidget);
   * @param widget
   * @returns 
   */
  updateAp = (widget: CPDFWidget): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.updateAp(tag, widget.page, widget.uuid);
    }
    return Promise.reject(new Error('Unable to find the native view reference'));
  }

  /**
   * Adds annotations to the document.
   * 
   * @example
   * const annotations: CPDFAnnotation[] = [
   *   new CPDFNoteAnnotation({
   *     page: 0,
   *     rect: { left: 100, top: 100, right: 150, bottom: 150 },
   *     contents: 'This is a note annotation',
   *     color: '#FFFF00',
   *   }),
   *   new CPDFMarkupAnnotation({
   *    page: 1,
   *    rect: { left: 50, top: 50, right: 200, bottom: 100 },
   *    markupText: 'Highlighted text',
   *    type: 'highlight',
   *    color: '#00FF00',
   *    }),
   * ];
   * await pdfReaderRef.current?._pdfDocument.addAnnotations(annotations);
   * @see CPDFAnnotation - Base class for all annotations
   * @param annotations 
   * @returns 
   */
  addAnnotations = (annotations: CPDFAnnotation[]): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      // Validate all annotations before processing
      annotations.forEach((annot, index) => {
        if (annot.page === undefined || annot.page === null) {
          const errorMsg = `Annotation at index ${index} is missing required 'page' property`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }
        // Skip rect validation for ink, line, and arrow annotations as they can derive rect from points
        const skipRectValidation = annot.type === 'ink' || annot.type === 'line' || annot.type === 'arrow';
        if (!skipRectValidation && !annot.rect) {
          const errorMsg = `Annotation at index ${index} is missing required 'rect' property`;
          console.error(errorMsg);
          throw new Error(errorMsg);
        }

        if (annot instanceof CPDFImageAnnotation) {
          const hasLegacyImage = typeof annot.image === 'string' && annot.image.trim().length > 0;
          const hasImageData = annot.imageData != null && annot.imageData.data.trim().length > 0;
          if (!hasLegacyImage && !hasImageData) {
            const errorMsg = `Image annotation at index ${index} requires either 'image' or 'imageData'.`;
            console.error(errorMsg);
            throw new Error(errorMsg);
          }
        }
      });

      const annotationsData = annotations.map(annot => {
        const annotData = this.serializeAnnotation(annot);
        return normalizeColorsInAnnotation(annotData);
      });
      return CPDFViewManager.addAnnotations(tag, annotationsData);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }

  private serializeAnnotation(annotation: CPDFAnnotation): Record<string, any> {
    if (annotation instanceof CPDFImageAnnotation) {
      return this.serializeImageAnnotation(annotation);
    }

    return annotation.toJSON();
  }

  private serializeImageAnnotation(annotation: CPDFImageAnnotation): Record<string, any> {
    const data: Record<string, any> = annotation.toJSON();
    const normalizedImageData = this.normalizeAnnotationImageData(annotation);

    if (normalizedImageData != null) {
      data.imageData = normalizedImageData;
      if (normalizedImageData.type === CPDFImageType.Base64) {
        data.image = normalizedImageData.data;
      } else {
        delete data.image;
      }
    } else if (typeof annotation.image === 'string' && annotation.image.trim().length > 0) {
      data.image = this.stripDataUriPrefix(annotation.image);
    }

    return data;
  }

  private normalizeAnnotationImageData(
    annotation: CPDFImageAnnotation,
  ): Record<string, any> | null {
    if (annotation.imageData != null) {
      return this.normalizeImageData(annotation.imageData);
    }

    if (typeof annotation.image !== 'string' || annotation.image.trim().length === 0) {
      return null;
    }

    return {
      type: CPDFImageType.Base64,
      data: this.stripDataUriPrefix(annotation.image),
    };
  }

  private normalizeImageData(imageData: CPDFImageData): Record<string, any> {
    switch (imageData.type) {
      case CPDFImageType.Base64:
        return {
          type: CPDFImageType.Base64,
          data: this.stripDataUriPrefix(imageData.data),
        };
      case CPDFImageType.FilePath:
      case CPDFImageType.Asset:
      case CPDFImageType.Uri:
      default:
        return imageData.toJson();
    }
  }

  private stripDataUriPrefix(value: string): string {
    const trimmed = value.trim();
    if (!trimmed.startsWith('data:')) {
      return trimmed;
    }

    const commaIndex = trimmed.indexOf(',');
    if (commaIndex < 0) {
      return trimmed;
    }

    const metadata = trimmed.slice(0, commaIndex).toLowerCase();
    if (!metadata.includes(';base64')) {
      return trimmed;
    }

    return trimmed.slice(commaIndex + 1).trim();
  }

  /**
   * Adds form widgets to the document.
   * 
   * @example
   * const widgets = [
   *   new CPDFCheckboxWidget({
   *     title: CPDFWidgetUtil.createFieldName("Checkbox"),
   *     page: 0,
   *     rect: { left: 361, top: 778, right: 442, bottom: 704 },
   *     isChecked: true,
   *     checkStyle: CPDFCheckStyle.CIRCLE,
   *     checkColor: "#3CE930",
   *     fillColor: "#e0e0e0",
   *     borderColor: "#000000",
   *     borderWidth: 5,
   *   })
   * ];
   * await pdfReaderRef.current?._pdfDocument.addWidgets(widgets);
   * 
   * @see CPDFWidget - Base class for all form widgets
   * @param widgets 
   * @returns 
   */
  addWidgets = (widgets: CPDFWidget[]): Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      const widgetsData = widgets.map(widget => {
        const widgetData = widget.toJSON();
        return normalizeColorsInWidget(widgetData);
      });
      return CPDFViewManager.addWidgets(tag, widgetsData);
    }
    return Promise.reject(
      new Error("Unable to find the native view reference")
    );
  }
}