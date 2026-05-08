/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.viewer;

import android.graphics.RectF;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.common.CPDFDocumentException;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.document.CPDFDocument.PDFDocumentEncryptAlgo;
import com.compdfkit.core.document.CPDFDocument.PDFDocumentError;
import com.compdfkit.core.document.CPDFDocument.PDFDocumentImageMode;
import com.compdfkit.core.document.CPDFDocument.PDFDocumentPermissions;
import com.compdfkit.core.document.CPDFDocument.PDFDocumentSaveType;
import com.compdfkit.core.document.CPDFDocumentPermissionInfo;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.page.CPDFPage.PDFFlattenOption;
import com.compdfkit.tools.common.utils.CFileUtils;
import com.compdfkit.tools.common.utils.print.CPDFPrintUtils;
import com.compdfkit.tools.common.utils.threadpools.CThreadPoolUtils;
import com.compdfkit.tools.common.views.pdfview.CPDFPageIndicatorView;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl.COnSaveCallback;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl.COnSaveError;
import com.compdfkitpdf.reactnative.util.RnDocumentInfoMapper;
import com.compdfkitpdf.reactnative.util.RnDocumentSourceResolver;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReactApplicationContext;
import java.io.File;

/**
 * Handles document ops for the native PDF viewer layer.
 */
final class RnDocumentOps {

  private final ReactApplicationContext reactContext;

  /**
   * Creates a new RnDocumentOps instance.
   */
  RnDocumentOps(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
  }

  /**
   * Saves the current document state.
   */
  void save(RnPdfViewContext context, COnSaveCallback saveCallback, COnSaveError error) {
    if (context != null) {
      context.viewCtrl.savePDF(saveCallback, error);
    } else {
      error.error(new Exception("save() Unable to find DocumentView"));
    }
  }

  /**
   * Imports annotations.
   */
  boolean importAnnotations(RnPdfViewContext context, String xfdfFilePath) throws Exception {
    String xfdf = RnDocumentSourceResolver.getImportFilePath(reactContext, xfdfFilePath);
    File file = new File(xfdf);
    if (!file.exists()) {
      throw new Exception("File not found: " + xfdf);
    }
    File cacheFile = new File(reactContext.getCacheDir(),
      CFileUtils.CACHE_FOLDER + File.separator + "importAnnotCache/"
        + CFileUtils.getFileNameNoExtension(context.document.getFileName()));
    cacheFile.mkdirs();
    boolean importResult = context.document.importAnnotations(xfdf, cacheFile.getAbsolutePath());
    context.readerView.reloadPages();
    return importResult;
  }

  /**
   * Exports annotations.
   */
  String exportAnnotations(RnPdfViewContext context) throws Exception {
    File dirFile = new File(reactContext.getFilesDir(), "compdfkit/annotation/export/");
    dirFile.mkdirs();
    String fileName = CFileUtils.getFileNameNoExtension(context.document.getFileName());
    File cacheFile = new File(reactContext.getCacheDir(),
      CFileUtils.CACHE_FOLDER + File.separator + "exportAnnotCache/" + fileName);
    cacheFile.mkdirs();
    File saveFile = new File(dirFile, fileName + ".xfdf");
    saveFile = CFileUtils.renameNameSuffix(saveFile);
    boolean exportResult = context.document.exportAnnotations(saveFile.getAbsolutePath(),
      cacheFile.getAbsolutePath());
    return exportResult ? saveFile.getAbsolutePath() : null;
  }

  /**
   * Opens the requested document or resource.
   */
  void open(RnPdfViewContext context, String filePath, String password, int pageIndex, Promise promise) {
    String resolvedFilePath = RnDocumentSourceResolver.resolveOpenDocumentSource(reactContext, filePath);
    if (RnDocumentSourceResolver.isUriSource(resolvedFilePath)) {
      context.viewCtrl.openPDF(RnDocumentSourceResolver.parseUri(resolvedFilePath), password, pageIndex,
        () -> promise.resolve(true));
      return;
    }
    context.viewCtrl.openPDF(resolvedFilePath, password, pageIndex, () -> promise.resolve(true));
  }

  /**
   * Returns the file name.
   */
  String getFileName(RnPdfViewContext context) {
    return context.document.getFileName();
  }

  /**
   * Returns whether encrypted.
   */
  boolean isEncrypted(RnPdfViewContext context) {
    return context.document.isEncrypted();
  }

  /**
   * Returns whether image doc.
   */
  boolean isImageDoc(RnPdfViewContext context) {
    return context.document.isImageDoc();
  }

  /**
   * Returns the permissions.
   */
  PDFDocumentPermissions getPermissions(RnPdfViewContext context) {
    return context.document.getPermissions();
  }

  /**
   * Returns check owner unlocked.
   */
  boolean checkOwnerUnlocked(RnPdfViewContext context) {
    return context.document.checkOwnerUnlocked();
  }

  /**
   * Returns check owner password.
   */
  boolean checkOwnerPassword(RnPdfViewContext context, String password) {
    return context.document.checkOwnerPassword(password);
  }

  /**
   * Returns the page count.
   */
  int getPageCount(RnPdfViewContext context) {
    return context.document.getPageCount();
  }

  /**
   * Saves as.
   */
  void saveAs(RnPdfViewContext context, String savePath, boolean removeSecurity, boolean fontSubSet,
    Promise result) {
    CPDFDocument document = context.document;
    context.viewCtrl.exitEditMode();
    CThreadPoolUtils.getInstance().executeIO(() -> {
      try {
        boolean saveResult;
        if (RnDocumentSourceResolver.isContentSource(savePath)) {
          saveResult = document.saveAs(Uri.parse(savePath), removeSecurity, fontSubSet);
        } else {
          saveResult = document.saveAs(savePath, removeSecurity, false, fontSubSet);
        }
        CThreadPoolUtils.getInstance().executeMain(() -> {
          if (document.shouleReloadDocument()) {
            document.reload();
          }
        });
        result.resolve(saveResult);
      } catch (CPDFDocumentException e) {
        result.reject("SAVE_FAIL",
          "The current saved directory is: " + savePath
            + ", please make sure you have write permission to this directory");
      }
    });
  }

  /**
   * Handles print.
   */
  void print(RnPdfViewContext context) {
    if (reactContext.getCurrentActivity() != null) {
      CPDFPrintUtils.printCurrentDocument(reactContext.getCurrentActivity(), context.document);
    }
  }

  /**
   * Removes password.
   */
  void removePassword(RnPdfViewContext context, Promise promise) {
    try {
      boolean saveResult = context.document.save(PDFDocumentSaveType.PDFDocumentSaveRemoveSecurity,
        true);
      if (context.document.shouleReloadDocument()) {
        context.document.reload();
      }
      promise.resolve(saveResult);
    } catch (Exception e) {
      promise.reject("SAVE_FAIL",
        "An exception occurs when remove document opening password and saving it.," + e.getMessage());
    }
  }

  /**
   * Sets the password.
   */
  void setPassword(RnPdfViewContext context, String userPassword, String ownerPassword,
    boolean allowsPrinting, boolean allowsCopying, String encryptAlgo, Promise promise) {
    CPDFDocument document = context.document;
    CThreadPoolUtils.getInstance().executeIO(() -> {
      try {
        if (!TextUtils.isEmpty(userPassword)) {
          document.setUserPassword(userPassword);
        }
        if (!TextUtils.isEmpty(ownerPassword)) {
          document.setOwnerPassword(ownerPassword);
          CPDFDocumentPermissionInfo permissionInfo = document.getPermissionsInfo();
          permissionInfo.setAllowsPrinting(allowsPrinting);
          permissionInfo.setAllowsCopying(allowsCopying);
          document.setPermissionsInfo(permissionInfo);
        }

        switch (encryptAlgo) {
          case "rc4":
            document.setEncryptAlgorithm(PDFDocumentEncryptAlgo.PDFDocumentRC4);
            break;
          case "aes128":
            document.setEncryptAlgorithm(PDFDocumentEncryptAlgo.PDFDocumentAES128);
            break;
          case "aes256":
            document.setEncryptAlgorithm(PDFDocumentEncryptAlgo.PDFDocumentAES256);
            break;
          case "noEncryptAlgo":
            document.setEncryptAlgorithm(PDFDocumentEncryptAlgo.PDFDocumentNoEncryptAlgo);
            break;
          default:
            break;
        }

        boolean saveResult = document.save(
          CPDFDocument.PDFDocumentSaveType.PDFDocumentSaveIncremental, true);

        if (document.shouleReloadDocument()) {
          if (!TextUtils.isEmpty(userPassword)) {
            document.reload(userPassword);
          } else if (!TextUtils.isEmpty(ownerPassword)) {
            document.reload(ownerPassword);
          } else {
            document.reload();
          }
        }
        promise.resolve(saveResult);
      } catch (Exception e) {
        promise.reject("SAVE_FAIL",
          "An exception occurs when setting a document opening password and saving it.," + e.getMessage());
      }
    });
  }

  /**
   * Returns the encrypt algo.
   */
  String getEncryptAlgo(RnPdfViewContext context) {
    PDFDocumentEncryptAlgo encryptAlgo = context.document.getEncryptAlgorithm();
    switch (encryptAlgo) {
      case PDFDocumentRC4:
        return "rc4";
      case PDFDocumentAES128:
        return "aes128";
      case PDFDocumentAES256:
        return "aes256";
      case PDFDocumentNoEncryptAlgo:
      default:
        return "noEncryptAlgo";
    }
  }

  /**
   * Imports widgets.
   */
  boolean importWidgets(RnPdfViewContext context, String xfdfFilePath) throws Exception {
    String xfdf = RnDocumentSourceResolver.getImportFilePath(reactContext, xfdfFilePath);
    File file = new File(xfdf);
    if (!file.exists()) {
      throw new Exception("File not found: " + xfdf);
    }
    File cacheFile = new File(reactContext.getCacheDir(),
      CFileUtils.CACHE_FOLDER + File.separator + "importWidgetsCache/"
        + CFileUtils.getFileNameNoExtension(context.document.getFileName()));
    cacheFile.mkdirs();
    boolean importResult = context.document.importWidgets(xfdf, cacheFile.getAbsolutePath());
    context.readerView.reloadPages();
    return importResult;
  }

  /**
   * Exports widgets.
   */
  String exportWidgets(RnPdfViewContext context) throws Exception {
    File dirFile = new File(reactContext.getFilesDir(), "compdfkit/widgets/export/");
    dirFile.mkdirs();
    String fileName = CFileUtils.getFileNameNoExtension(context.document.getFileName());
    File cacheFile = new File(reactContext.getCacheDir(),
      CFileUtils.CACHE_FOLDER + File.separator + "exportWidgetsCache/" + fileName);
    cacheFile.mkdirs();
    File saveFile = new File(dirFile, fileName + ".xfdf");
    saveFile = CFileUtils.renameNameSuffix(saveFile);
    boolean exportResult = context.document.exportWidgets(saveFile.getAbsolutePath(),
      cacheFile.getAbsolutePath());
    return exportResult ? saveFile.getAbsolutePath() : null;
  }

  /**
   * Handles flatten all pages.
   */
  void flattenAllPages(RnPdfViewContext context, String savePath, boolean fontSubset, Promise promise) {
    try {
      CPDFDocument document = context.document;
      boolean success = document.flattenAllPages(PDFFlattenOption.FLAT_NORMALDISPLAY);
      if (!success) {
        promise.reject("FLATTEN_FAIL", "Flatten all pages failed.");
        return;
      }
      boolean saveResult;
      if (RnDocumentSourceResolver.isContentSource(savePath)) {
        saveResult = document.saveAs(Uri.parse(savePath), false, fontSubset);
      } else {
        saveResult = document.saveAs(savePath, false, false, fontSubset);
      }
      if (document.shouleReloadDocument()) {
        document.reload();
      }
      promise.resolve(saveResult);
    } catch (Exception e) {
      if (e instanceof CPDFDocumentException) {
        promise.reject("SAVE_FAIL", ((CPDFDocumentException) e).getErrType().name());
      } else {
        promise.reject("SAVE_FAIL", e.getMessage());
      }
    }
  }

  /**
   * Handles reload pages.
   */
  void reloadPages(RnPdfViewContext context) {
    context.readerView.reloadPages();
  }

  /**
   * Handles reload pages2.
   */
  void reloadPages2(RnPdfViewContext context) {
    context.readerView.reloadPages2();
  }

  /**
   * Imports document.
   */
  void importDocument(RnPdfViewContext context, String filePath, String password, int[] pages,
    int insertPosition, Promise promise) {
    try {
      CPDFDocument document = context.document;
      CPDFDocument importDocument = new CPDFDocument(reactContext);
      String importDocumentPath = RnDocumentSourceResolver.getImportFilePath(reactContext, filePath);
      PDFDocumentError error = importDocument.open(importDocumentPath, password);
      if (error != PDFDocumentError.PDFDocumentErrorSuccess) {
        promise.reject("IMPORT_DOCUMENT_FAIL", "open import document fail, error:" + error.name());
        return;
      }
      if (pages == null || pages.length == 0) {
        int pageCount = importDocument.getPageCount();
        pages = new int[pageCount];
        for (int i = 0; i < pageCount; i++) {
          pages[i] = i;
        }
      }
      if (insertPosition == -1) {
        insertPosition = document.getPageCount();
      }
      boolean importResult = document.importPages(importDocument, pages, insertPosition);
      promise.resolve(importResult);
      context.readerView.reloadPages();
      updatePageIndicatorView(document, context.viewCtrl);
    } catch (Exception e) {
      promise.reject("IMPORT_DOCUMENT_FAIL", "error:" + e.getMessage());
    }
  }

  /**
   * Handles split document page.
   */
  void splitDocumentPage(RnPdfViewContext context, String savePath, int[] pages, Promise promise) {
    try {
      CPDFDocument document = context.document;
      if (pages == null || pages.length == 0) {
        int pageCount = document.getPageCount();
        pages = new int[pageCount];
        for (int i = 0; i < pageCount; i++) {
          pages[i] = i;
        }
      }
      int[] finalPages = pages;
      CThreadPoolUtils.getInstance().executeIO(() -> {
        try {
          CPDFDocument newDocument = CPDFDocument.createDocument(reactContext);
          newDocument.importPages(document, finalPages, 0);
          boolean saveResult;
          if (RnDocumentSourceResolver.isContentSource(savePath)) {
            saveResult = newDocument.saveAs(Uri.parse(savePath), false, true);
          } else {
            saveResult = newDocument.saveAs(savePath, false, false, true);
          }
          promise.resolve(saveResult);
          newDocument.close();
        } catch (CPDFDocumentException e) {
          promise.reject("SPLIT_DOCUMENT_FAIL", "error:" + e.getErrType().name());
        }
      });
    } catch (Exception e) {
      promise.reject("SPLIT_DOCUMENT_FAIL", "error:" + e.getMessage());
    }
  }

  /**
   * Returns the document path.
   */
  String getDocumentPath(RnPdfViewContext context) {
    if (!TextUtils.isEmpty(context.document.getAbsolutePath())) {
      return context.document.getAbsolutePath();
    }
    return context.document.getUri().toString();
  }

  /**
   * Returns insert blank page.
   */
  boolean insertBlankPage(RnPdfViewContext context, int pageIndex, int width, int height) {
    CPDFPage page = context.document.insertBlankPage(pageIndex, width, height);
    boolean isValid = page != null && page.isValid();
    if (isValid) {
      context.readerView.reloadPages();
      updatePageIndicatorView(context.document, context.viewCtrl);
    }
    return isValid;
  }

  /**
   * Returns insert image page.
   */
  boolean insertImagePage(RnPdfViewContext context, int pageIndex, String imagePath, float width,
    float height) throws Exception {
    String resolvedImagePath =
      com.compdfkitpdf.reactnative.util.RnFileUtils.parseFilePath(reactContext, imagePath);
    Log.d("ComPDFKit", "insertImagePage source:" + imagePath);
    CPDFPage page = context.document.insertPageWithImagePath(pageIndex, width, height,
      resolvedImagePath, PDFDocumentImageMode.PDFDocumentImageModeScaleAspectFit);
    boolean isValid = page != null && page.isValid();
    if (isValid) {
      updatePageIndicatorView(context.document, context.viewCtrl);
    }
    return isValid;
  }

  /**
   * Removes pages.
   */
  boolean removePages(RnPdfViewContext context, int[] pages) {
    return context.document.removePages(pages);
  }

  /**
   * Returns move page.
   */
  boolean movePage(RnPdfViewContext context, int fromIndex, int toIndex) {
    return context.document.movePage(fromIndex, toIndex);
  }

  /**
   * Sets the page rotation.
   */
  void setPageRotation(RnPdfViewContext context, int pageIndex, int rotation, Promise promise) {
    CPDFPage cpdfPage = context.document.pageAtIndex(pageIndex);
    if (cpdfPage == null) {
      promise.reject("SET_PAGE_ROTATION_FAIL", "Page not found at index: " + pageIndex);
      return;
    }
    boolean setRotationResult = cpdfPage.setRotation(rotation);
    promise.resolve(setRotationResult);
  }

  /**
   * Returns the page rotation.
   */
  int getPageRotation(RnPdfViewContext context, int pageIndex) {
    CPDFPage cpdfPage = context.document.pageAtIndex(pageIndex);
    if (cpdfPage == null) {
      return 0;
    }
    return cpdfPage.getRotation();
  }

  /**
   * Returns the info.
   */
  WritableMap getInfo(RnPdfViewContext context) {
    return RnDocumentInfoMapper.getDocumentInfo(context.document);
  }

  /**
   * Returns the major version.
   */
  int getMajorVersion(RnPdfViewContext context) {
    return context.document.getMajorVersion();
  }

  /**
   * Returns the minor version.
   */
  int getMinorVersion(RnPdfViewContext context) {
    return context.document.getMinorVersion();
  }

  /**
   * Returns the permission info.
   */
  WritableMap getPermissionInfo(RnPdfViewContext context) {
    return RnDocumentInfoMapper.getPermissionsInfo(context.document);
  }

  /**
   * Updates page indicator view.
   */
  private void updatePageIndicatorView(CPDFDocument document, CPDFViewCtrl pdfView) {
    if (pdfView != null) {
      CPDFPageIndicatorView indicatorView = pdfView.indicatorView;
      indicatorView.setTotalPage(document.getPageCount());
      indicatorView.setCurrentPageIndex(pdfView.getCPdfReaderView().getPageNum());
      pdfView.slideBar.setPageCount(document.getPageCount());
      pdfView.slideBar.requestLayout();
    }
  }
}
