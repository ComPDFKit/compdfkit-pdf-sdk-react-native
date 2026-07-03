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
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import android.util.Log;
import androidx.annotation.Nullable;
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
import com.compdfkit.core.watermark.CPDFWatermark;
import com.compdfkit.tools.common.utils.CFileUtils;
import com.compdfkit.tools.common.utils.print.CPDFPrintUtils;
import com.compdfkit.tools.common.utils.threadpools.CThreadPoolUtils;
import com.compdfkit.tools.common.views.pdfview.CPDFPageIndicatorView;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl.COnSaveCallback;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl.COnSaveError;
import com.compdfkitpdf.reactnative.util.RnDocumentInfoMapper;
import com.compdfkitpdf.reactnative.util.RnDocumentSourceResolver;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.ReactApplicationContext;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.UUID;

/**
 * Handles document ops for the native PDF viewer layer.
 */
final class RnDocumentOps {

  private static final String ERROR_WATERMARK_FAIL = "WATERMARK_FAIL";
  private static final Handler MAIN_HANDLER = new Handler(Looper.getMainLooper());

  private final ReactApplicationContext reactContext;

  /**
   * Creates a new RnDocumentOps instance.
   */
  RnDocumentOps(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
  }

  /**
   * Returns whether the context and document are available.
   */
  private boolean isDocumentAvailable(@Nullable RnPdfViewContext context) {
    return context != null && context.document != null;
  }

  /**
   * Returns whether the reader context is available.
   */
  private boolean isReaderAvailable(@Nullable RnPdfViewContext context) {
    return context != null && context.readerView != null && context.viewCtrl != null;
  }

  static boolean isValidSourcePageIndex(int pageIndex, int pageCount) {
    return pageIndex >= 0 && pageIndex < pageCount;
  }

  static int normalizeInsertIndex(int insertIndex, int pageCount) {
    return insertIndex == -1 ? pageCount : insertIndex;
  }

  static boolean isValidInsertIndex(int insertIndex, int pageCount) {
    return insertIndex >= 0 && insertIndex <= pageCount;
  }

  /**
   * Saves the current document state.
   */
  void save(RnPdfViewContext context, COnSaveCallback saveCallback, COnSaveError error) {
    if (isReaderAvailable(context)) {
      context.viewCtrl.savePDF(saveCallback, error);
    } else {
      error.error(new Exception("save() Unable to find DocumentView"));
    }
  }

  /**
   * Imports annotations.
   */
  boolean importAnnotations(RnPdfViewContext context, String xfdfFilePath) throws Exception {
    if (!isDocumentAvailable(context)) {
      throw new Exception("Document unavailable");
    }
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
    if (!isDocumentAvailable(context)) {
      throw new Exception("Document unavailable");
    }
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
    if (!isReaderAvailable(context)) {
      promise.reject("OPEN_FAIL", "DocumentView is unavailable");
      return;
    }
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
    if (!isDocumentAvailable(context)) {
      return "";
    }
    return context.document.getFileName();
  }

  /**
   * Returns whether encrypted.
   */
  boolean isEncrypted(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) {
      return false;
    }
    return context.document.isEncrypted();
  }

  /**
   * Returns whether image doc.
   */
  boolean isImageDoc(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) {
      return false;
    }
    return context.document.isImageDoc();
  }

  /**
   * Returns the permissions.
   */
  PDFDocumentPermissions getPermissions(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) {
      return PDFDocumentPermissions.PDFDocumentPermissionsNone;
    }
    return context.document.getPermissions();
  }

  /**
   * Returns check owner unlocked.
   */
  boolean checkOwnerUnlocked(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) {
      return false;
    }
    return context.document.checkOwnerUnlocked();
  }

  /**
   * Returns check owner password.
   */
  boolean checkOwnerPassword(RnPdfViewContext context, String password) {
    if (!isDocumentAvailable(context)) {
      return false;
    }
    return context.document.checkOwnerPassword(password);
  }

  /**
   * Returns the page count.
   */
  int getPageCount(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) {
      return 0;
    }
    return context.document.getPageCount();
  }

  /**
   * Saves as.
   */
  void saveAs(RnPdfViewContext context, String savePath, boolean removeSecurity, boolean fontSubSet,
    Promise result) {
    if (!isReaderAvailable(context) || !isDocumentAvailable(context)) {
      result.reject("SAVE_FAIL", "DocumentView is unavailable");
      return;
    }
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
    if (reactContext.getCurrentActivity() != null && isDocumentAvailable(context)) {
      CPDFPrintUtils.printCurrentDocument(reactContext.getCurrentActivity(), context.document);
    }
  }

  /**
   * Removes password.
   */
  void removePassword(RnPdfViewContext context, Promise promise) {
    if (!isDocumentAvailable(context)) {
      promise.reject("SAVE_FAIL", "Document unavailable");
      return;
    }
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
    if (!isDocumentAvailable(context)) {
      promise.reject("SAVE_FAIL", "Document unavailable");
      return;
    }
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
    if (!isDocumentAvailable(context)) {
      return "noEncryptAlgo";
    }
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
    if (!isDocumentAvailable(context)) {
      throw new Exception("Document unavailable");
    }
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
    if (!isDocumentAvailable(context)) {
      throw new Exception("Document unavailable");
    }
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
    if (!isDocumentAvailable(context)) {
      promise.reject("SAVE_FAIL", "Document unavailable");
      return;
    }
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
    if (isReaderAvailable(context)) {
      context.readerView.reloadPages();
    }
  }

  /**
   * Handles reload pages2.
   */
  void reloadPages2(RnPdfViewContext context) {
    if (isReaderAvailable(context)) {
      context.readerView.reloadPages2();
    }
  }

  /**
   * Imports document.
   */
  void importDocument(RnPdfViewContext context, String filePath, String password, int[] pages,
    int insertPosition, Promise promise) {
    try {
      if (!isReaderAvailable(context) || !isDocumentAvailable(context)) {
        promise.reject("IMPORT_DOCUMENT_FAIL", "DocumentView is unavailable");
        return;
      }
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
      if (!isDocumentAvailable(context)) {
        promise.reject("SPLIT_DOCUMENT_FAIL", "Document unavailable");
        return;
      }
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
   * Extracts document images into the specified directory.
   */
  void extractImages(RnPdfViewContext context, String directoryPath, int[] pages, Promise promise) {
    if (!isDocumentAvailable(context)) {
      promise.reject("EXTRACT_IMAGES_FAIL", "Document unavailable");
      return;
    }
    if (directoryPath == null || directoryPath.trim().isEmpty()) {
      promise.reject("EXTRACT_IMAGES_FAIL", "directory_path is empty");
      return;
    }

    CPDFDocument document = context.document;
    int pageCount = document.getPageCount();
    int[] targetPages = pages;
    if (targetPages != null) {
      for (int page : targetPages) {
        if (page < 0 || page >= pageCount) {
          promise.reject("EXTRACT_IMAGES_FAIL", "Invalid page index: " + page);
          return;
        }
      }
    }

    CThreadPoolUtils.getInstance().executeIO(() -> {
      try {
        File outputDirectory = new File(directoryPath);
        if (outputDirectory.exists() && !outputDirectory.isDirectory()) {
          promise.reject("EXTRACT_IMAGES_FAIL",
            "directory_path is not a directory: " + directoryPath);
          return;
        }
        if (!outputDirectory.exists() && !outputDirectory.mkdirs()) {
          promise.reject("EXTRACT_IMAGES_FAIL", "Failed to create directory: " + directoryPath);
          return;
        }

        String outputPath = outputDirectory.getAbsolutePath();
        boolean success;
        if (targetPages == null || targetPages.length == 0) {
          success = document.extractImage(outputPath,
            (pageIndex, imageIndex, index) -> extractImageName(document, pageIndex, imageIndex,
              index));
        } else {
          success = document.extractImage(outputPath, targetPages,
            (pageIndex, imageIndex, index) -> extractImageName(document, pageIndex, imageIndex,
              index));
        }

        WritableArray imagePaths = success ? listFilePaths(outputDirectory) : Arguments.createArray();
        promise.resolve(createExtractImageResult(success, outputPath, imagePaths));
      } catch (Exception e) {
        promise.reject("EXTRACT_IMAGES_FAIL", "error:" + e.getMessage());
      }
    });
  }

  /**
   * Returns the document path.
   */
  String getDocumentPath(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) {
      return "";
    }
    if (!TextUtils.isEmpty(context.document.getAbsolutePath())) {
      return context.document.getAbsolutePath();
    }
    return context.document.getUri().toString();
  }

  private WritableMap createExtractImageResult(boolean success, String directoryPath,
    WritableArray imagePaths) {
    WritableMap result = Arguments.createMap();
    result.putBoolean("success", success);
    result.putInt("count", imagePaths.size());
    result.putString("directory_path", directoryPath);
    result.putArray("image_paths", imagePaths);
    return result;
  }

  private WritableArray listFilePaths(File directory) {
    WritableArray paths = Arguments.createArray();
    File[] files = directory.listFiles();
    if (files == null) {
      return paths;
    }
    Arrays.sort(files, Comparator.comparing(File::getName));
    for (File file : files) {
      if (file.isFile()) {
        paths.pushString(file.getAbsolutePath());
      }
    }
    return paths;
  }

  private String extractImageName(CPDFDocument document, int pageIndex, int imageIndex, int index) {
    String documentName = CFileUtils.getFileNameNoExtension(document.getFileName());
    if (TextUtils.isEmpty(documentName)) {
      documentName = "document";
    }
    String safeDocumentName = documentName.replaceAll("[^A-Za-z0-9._-]", "_");
    return safeDocumentName + "_page_" + pageIndex + "_image_" + imageIndex + "_" + index;
  }

  /**
   * Returns insert blank page.
   */
  boolean insertBlankPage(RnPdfViewContext context, int pageIndex, int width, int height) {
    if (!isDocumentAvailable(context) || !isReaderAvailable(context)) {
      return false;
    }
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
    if (!isDocumentAvailable(context) || !isReaderAvailable(context)) {
      return false;
    }
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
    if (!isDocumentAvailable(context)) {
      return false;
    }
    return context.document.removePages(pages);
  }

  void createWatermark(RnPdfViewContext context, ReadableMap info, Promise promise) {
    if (!isDocumentAvailable(context)) {
      promise.reject(ERROR_WATERMARK_FAIL, "Document unavailable");
      return;
    }
    CPDFWatermark.Type type = toWatermarkType(getString(info, "type", ""));
    if (type == CPDFWatermark.Type.WATERMARK_TYPE_UNKWON) {
      promise.reject(ERROR_WATERMARK_FAIL, "Invalid watermark type");
      return;
    }
    String validationError = validateWatermarkInput(info, type, true);
    if (validationError != null) {
      promise.reject(ERROR_WATERMARK_FAIL, validationError);
      return;
    }
    if (type == CPDFWatermark.Type.WATERMARK_TYPE_IMG) {
      loadImageInfo(info, promise, imageInfo -> {
        CPDFWatermark watermark = context.document.createWatermark(type);
        if (watermark == null || !applyWatermark(info, watermark, imageInfo)) {
          promise.reject(ERROR_WATERMARK_FAIL, "Failed to create watermark");
          return;
        }
        boolean success = watermark.update();
        watermark.release();
        reloadPagesIfAttached(context);
        promise.resolve(success);
      });
      return;
    }
    CPDFWatermark watermark = context.document.createWatermark(type);
    if (watermark == null || !applyWatermark(info, watermark, null)) {
      promise.reject(ERROR_WATERMARK_FAIL, "Failed to create watermark");
      return;
    }
    boolean success = watermark.update();
    watermark.release();
    reloadPagesIfAttached(context);
    promise.resolve(success);
  }

  int getWatermarkCount(RnPdfViewContext context) {
    return isDocumentAvailable(context) ? context.document.getWatermarkCount() : 0;
  }

  WritableMap getWatermark(RnPdfViewContext context, int index, boolean exportImage) {
    if (!isDocumentAvailable(context)) {
      return null;
    }
    CPDFWatermark watermark = getWatermarkAt(context.document, index);
    if (watermark == null) {
      return null;
    }
    WritableMap map = toWatermarkMap(context, watermark, index, exportImage);
    watermark.release();
    return map;
  }

  WritableArray getWatermarks(RnPdfViewContext context, boolean exportImages) {
    WritableArray array = Arguments.createArray();
    if (!isDocumentAvailable(context)) {
      return array;
    }
    CPDFDocument document = context.document;
    for (int i = 0; i < document.getWatermarkCount(); i++) {
      CPDFWatermark watermark = document.getWatermark(i);
      if (watermark != null) {
        array.pushMap(toWatermarkMap(context, watermark, i, exportImages));
        watermark.release();
      }
    }
    return array;
  }

  void updateWatermark(RnPdfViewContext context, int index, ReadableMap info, Promise promise) {
    if (!isDocumentAvailable(context)) {
      promise.resolve(false);
      return;
    }
    CPDFWatermark watermark = getWatermarkAt(context.document, index);
    if (watermark == null) {
      promise.resolve(false);
      return;
    }
    CPDFWatermark.Type payloadType = toWatermarkType(getString(info, "type", ""));
    if (payloadType != CPDFWatermark.Type.WATERMARK_TYPE_UNKWON && payloadType != watermark.getType()) {
      watermark.release();
      promise.resolve(false);
      return;
    }
    String validationError = validateWatermarkInput(info, watermark.getType(), false);
    if (validationError != null) {
      watermark.release();
      promise.reject(ERROR_WATERMARK_FAIL, validationError);
      return;
    }
    if (watermark.getType() == CPDFWatermark.Type.WATERMARK_TYPE_IMG
      && !TextUtils.isEmpty(getString(info, "image_path", ""))) {
      loadImageInfo(info, promise, imageInfo -> {
        boolean success = applyWatermark(info, watermark, imageInfo);
        if (success) {
          success = watermark.update();
          reloadPagesIfAttached(context);
        }
        watermark.release();
        promise.resolve(success);
      });
      return;
    }
    boolean success = applyWatermark(info, watermark, null);
    if (success) {
      success = watermark.update();
      reloadPagesIfAttached(context);
    }
    watermark.release();
    promise.resolve(success);
  }

  boolean removeWatermark(RnPdfViewContext context, int index) {
    if (!isDocumentAvailable(context)) {
      return false;
    }
    CPDFWatermark watermark = getWatermarkAt(context.document, index);
    if (watermark == null) {
      return false;
    }
    boolean success = watermark.clear();
    watermark.release();
    if (success) {
      reloadPagesIfAttached(context);
    }
    return success;
  }

  boolean removeAllWatermarks(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) {
      return false;
    }
    CPDFDocument document = context.document;
    for (int watermarkCount = document.getWatermarkCount(); watermarkCount > 0; watermarkCount--) {
      CPDFWatermark watermark = document.getWatermark(watermarkCount - 1);
      if (watermark != null) {
        watermark.clear();
        watermark.release();
      }
    }
    reloadPagesIfAttached(context);
    return true;
  }

  private boolean applyWatermark(ReadableMap info, CPDFWatermark watermark,
    @Nullable ImageInfo imageInfo) {
    if (watermark.getType() == CPDFWatermark.Type.WATERMARK_TYPE_TEXT) {
      watermark.setText(getString(info, "text_content", ""));
      watermark.setTextRGBColor(Color.parseColor(getString(info, "text_color", "#000000")));
      watermark.setFontSize((float) getDouble(info, "font_size", 24));
    } else if (watermark.getType() == CPDFWatermark.Type.WATERMARK_TYPE_IMG) {
      if (imageInfo != null) {
        watermark.setImage(imageInfo.path, "", imageInfo.width, imageInfo.height);
      }
    } else {
      return false;
    }
    watermark.setScale((float) getDouble(info, "scale", 1));
    watermark.setRotation((float) -Math.toRadians(getDouble(info, "rotation", 45)));
    watermark.setOpacity((float) getDouble(info, "opacity", 1));
    watermark.setVertalign(toVertAlign(getString(info, "vertical_alignment", "center")));
    watermark.setHorizalign(toHorizAlign(getString(info, "horizontal_alignment", "center")));
    watermark.setVertOffset((float) getDouble(info, "vertical_offset", 0));
    watermark.setHorizOffset((float) getDouble(info, "horizontal_offset", 0));
    watermark.setPages(getString(info, "pages", ""));
    watermark.setFront(getBoolean(info, "is_front", true));
    watermark.setFullScreen(getBoolean(info, "is_tile_page", false));
    watermark.setHorizontalSpacing((float) getDouble(info, "horizontal_spacing", 0));
    watermark.setVerticalSpacing((float) getDouble(info, "vertical_spacing", 0));
    return true;
  }

  private WritableMap toWatermarkMap(RnPdfViewContext context, CPDFWatermark watermark,
    int index, boolean exportImage) {
    WritableMap map = Arguments.createMap();
    ExportedImage exportedImage = exportWatermarkImage(context, watermark, index, exportImage);
    map.putInt("index", index);
    map.putString("type", watermark.getType() == CPDFWatermark.Type.WATERMARK_TYPE_IMG ? "image" : "text");
    map.putString("text_content", watermark.getText());
    map.putString("image_path", exportedImage.path);
    map.putBoolean("is_image_exported", exportedImage.exported);
    map.putString("text_color", toHexColor(watermark.getTextRGBColor()));
    map.putDouble("font_size", watermark.getFontSize());
    map.putDouble("scale", watermark.getScale());
    map.putDouble("rotation", -Math.toDegrees(watermark.getRotation()));
    map.putDouble("opacity", watermark.getOpacity());
    map.putString("vertical_alignment", fromVertAlign(watermark.getVertalign()));
    map.putString("horizontal_alignment", fromHorizAlign(watermark.getHorizalign()));
    map.putDouble("vertical_offset", watermark.getVertOffset());
    map.putDouble("horizontal_offset", watermark.getHorizOffset());
    map.putString("pages", watermark.getPages());
    map.putBoolean("is_front", watermark.isFront());
    map.putBoolean("is_tile_page", watermark.isFullScreen());
    map.putDouble("horizontal_spacing", watermark.getHorizontalSpacing());
    map.putDouble("vertical_spacing", watermark.getVerticalSpacing());
    return map;
  }

  private ExportedImage exportWatermarkImage(RnPdfViewContext context, CPDFWatermark watermark,
    int index, boolean exportImage) {
    if (!exportImage || watermark.getType() != CPDFWatermark.Type.WATERMARK_TYPE_IMG) {
      return ExportedImage.empty();
    }
    Bitmap bitmap = watermark.getImage();
    if (bitmap == null) {
      return ExportedImage.empty();
    }
    FileOutputStream outputStream = null;
    try {
      File directory = new File(reactContext.getCacheDir(),
        "compdfkit/watermarks/" + context.document.hashCode());
      if (!directory.exists() && !directory.mkdirs()) {
        return ExportedImage.empty();
      }
      File file = new File(directory, "watermark_" + index + "_"
        + System.currentTimeMillis() + "_" + UUID.randomUUID() + ".png");
      outputStream = new FileOutputStream(file);
      boolean success = bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
      outputStream.flush();
      return success ? new ExportedImage(file.getAbsolutePath(), true) : ExportedImage.empty();
    } catch (Exception e) {
      Log.e("ComPDFKitRN", "Failed to export watermark image", e);
      return ExportedImage.empty();
    } finally {
      if (outputStream != null) {
        try {
          outputStream.close();
        } catch (IOException ignored) {
        }
      }
    }
  }

  private void loadImageInfo(ReadableMap info, Promise promise, ImageCallback callback) {
    String imagePath = getString(info, "image_path", "");
    if (TextUtils.isEmpty(imagePath)) {
      promise.reject(ERROR_WATERMARK_FAIL, "Image path is empty");
      return;
    }
    CThreadPoolUtils.getInstance().executeIO(() -> {
      ImageInfo imageInfo = decodeImageInfo(imagePath);
      MAIN_HANDLER.post(() -> {
        if (imageInfo == null) {
          promise.reject(ERROR_WATERMARK_FAIL, "Failed to decode image");
          return;
        }
        callback.onImageLoaded(imageInfo);
      });
    });
  }

  private ImageInfo decodeImageInfo(String imagePath) {
    try {
      String resolvedPath = com.compdfkitpdf.reactnative.util.RnFileUtils.parseFilePath(reactContext, imagePath);
      BitmapFactory.Options options = new BitmapFactory.Options();
      options.inJustDecodeBounds = true;
      BitmapFactory.decodeFile(resolvedPath, options);
      if (options.outWidth <= 0 || options.outHeight <= 0) {
        return null;
      }
      return new ImageInfo(resolvedPath, options.outWidth, options.outHeight);
    } catch (Exception e) {
      Log.e("ComPDFKitRN", "Failed to decode watermark image", e);
      return null;
    }
  }

  private String validateWatermarkInput(ReadableMap info, CPDFWatermark.Type type, boolean isCreate) {
    if (TextUtils.isEmpty(getString(info, "pages", ""))) {
      return "The page range cannot be empty, please set the page range, for example: pages: \"0,1,2,3\"";
    }
    if (type == CPDFWatermark.Type.WATERMARK_TYPE_TEXT
      && TextUtils.isEmpty(getString(info, "text_content", ""))) {
      return "Add text watermark, the text cannot be empty";
    }
    if (type == CPDFWatermark.Type.WATERMARK_TYPE_IMG && isCreate
      && TextUtils.isEmpty(getString(info, "image_path", ""))) {
      return "image path is empty";
    }
    return null;
  }

  private CPDFWatermark getWatermarkAt(CPDFDocument document, int index) {
    if (index < 0 || index >= document.getWatermarkCount()) {
      return null;
    }
    return document.getWatermark(index);
  }

  private CPDFWatermark.Type toWatermarkType(String type) {
    if ("text".equals(type)) {
      return CPDFWatermark.Type.WATERMARK_TYPE_TEXT;
    }
    if ("image".equals(type)) {
      return CPDFWatermark.Type.WATERMARK_TYPE_IMG;
    }
    return CPDFWatermark.Type.WATERMARK_TYPE_UNKWON;
  }

  private CPDFWatermark.Vertalign toVertAlign(String value) {
    if ("top".equals(value)) {
      return CPDFWatermark.Vertalign.WATERMARK_VERTALIGN_TOP;
    }
    if ("bottom".equals(value)) {
      return CPDFWatermark.Vertalign.WATERMARK_VERTALIGN_BOTTOM;
    }
    return CPDFWatermark.Vertalign.WATERMARK_VERTALIGN_CENTER;
  }

  private CPDFWatermark.Horizalign toHorizAlign(String value) {
    if ("left".equals(value)) {
      return CPDFWatermark.Horizalign.WATERMARK_HORIZALIGN_LEFT;
    }
    if ("right".equals(value)) {
      return CPDFWatermark.Horizalign.WATERMARK_HORIZALIGN_RIGHT;
    }
    return CPDFWatermark.Horizalign.WATERMARK_HORIZALIGN_CENTER;
  }

  private String fromVertAlign(CPDFWatermark.Vertalign value) {
    if (value == CPDFWatermark.Vertalign.WATERMARK_VERTALIGN_TOP) {
      return "top";
    }
    if (value == CPDFWatermark.Vertalign.WATERMARK_VERTALIGN_BOTTOM) {
      return "bottom";
    }
    return "center";
  }

  private String fromHorizAlign(CPDFWatermark.Horizalign value) {
    if (value == CPDFWatermark.Horizalign.WATERMARK_HORIZALIGN_LEFT) {
      return "left";
    }
    if (value == CPDFWatermark.Horizalign.WATERMARK_HORIZALIGN_RIGHT) {
      return "right";
    }
    return "center";
  }

  private String toHexColor(int color) {
    return String.format("#%06X", (0xFFFFFF & color));
  }

  private String getString(ReadableMap map, String key, String defaultValue) {
    return map != null && map.hasKey(key) && !map.isNull(key) ? map.getString(key) : defaultValue;
  }

  private double getDouble(ReadableMap map, String key, double defaultValue) {
    return map != null && map.hasKey(key) && !map.isNull(key) ? map.getDouble(key) : defaultValue;
  }

  private boolean getBoolean(ReadableMap map, String key, boolean defaultValue) {
    return map != null && map.hasKey(key) && !map.isNull(key) ? map.getBoolean(key) : defaultValue;
  }

  private void reloadPagesIfAttached(RnPdfViewContext context) {
    if (context != null && context.readerView != null) {
      context.readerView.reloadPages2();
    }
  }

  private interface ImageCallback {
    void onImageLoaded(ImageInfo imageInfo);
  }

  private static final class ImageInfo {
    final String path;
    final int width;
    final int height;

    ImageInfo(String path, int width, int height) {
      this.path = path;
      this.width = width;
      this.height = height;
    }
  }

  private static final class ExportedImage {
    final String path;
    final boolean exported;

    ExportedImage(String path, boolean exported) {
      this.path = path;
      this.exported = exported;
    }

    static ExportedImage empty() {
      return new ExportedImage("", false);
    }
  }

  /**
   * Copies a page and inserts the duplicate at the target index.
   */
  boolean copyPage(RnPdfViewContext context, int pageIndex, int insertIndex) {
    if (!isDocumentAvailable(context) || !isReaderAvailable(context)) {
      return false;
    }
    CPDFDocument document = context.document;
    int pageCount = document.getPageCount();
    if (!isValidSourcePageIndex(pageIndex, pageCount)) {
      return false;
    }
    int normalizedInsertIndex = normalizeInsertIndex(insertIndex, pageCount);
    if (!isValidInsertIndex(normalizedInsertIndex, pageCount)) {
      return false;
    }
    CPDFDocument tempDocument = CPDFDocument.createDocument(reactContext);
    boolean importedToTemp = tempDocument.importPages(document, new int[] { pageIndex }, 0);
    if (!importedToTemp) {
      return false;
    }
    boolean copied = document.importPages(tempDocument, new int[] { 0 }, normalizedInsertIndex);
    if (copied) {
      context.readerView.reloadPages();
      updatePageIndicatorView(document, context.viewCtrl);
    }
    return copied;
  }

  /**
   * Returns move page.
   */
  boolean movePage(RnPdfViewContext context, int fromIndex, int toIndex) {
    if (!isDocumentAvailable(context)) {
      return false;
    }
    return context.document.movePage(fromIndex, toIndex);
  }

  /**
   * Sets the page rotation.
   */
  void setPageRotation(RnPdfViewContext context, int pageIndex, int rotation, Promise promise) {
    if (!isDocumentAvailable(context)) {
      promise.reject("SET_PAGE_ROTATION_FAIL", "Document unavailable");
      return;
    }
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
    if (!isDocumentAvailable(context)) {
      return 0;
    }
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
    if (!isDocumentAvailable(context)) {
      return null;
    }
    return RnDocumentInfoMapper.getDocumentInfo(context.document);
  }

  /**
   * Returns the major version.
   */
  int getMajorVersion(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) {
      return 0;
    }
    return context.document.getMajorVersion();
  }

  /**
   * Returns the minor version.
   */
  int getMinorVersion(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) {
      return 0;
    }
    return context.document.getMinorVersion();
  }

  /**
   * Returns the permission info.
   */
  WritableMap getPermissionInfo(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) {
      return null;
    }
    return RnDocumentInfoMapper.getPermissionsInfo(context.document);
  }

  /**
   * Updates page indicator view.
   */
  private void updatePageIndicatorView(CPDFDocument document, CPDFViewCtrl pdfView) {
    if (pdfView != null && document != null) {
      CPDFPageIndicatorView indicatorView = pdfView.indicatorView;
      indicatorView.setTotalPage(document.getPageCount());
      indicatorView.setCurrentPageIndex(pdfView.getCPdfReaderView().getPageNum());
      pdfView.refreshSlideBarDocumentState();
    }
  }
}
