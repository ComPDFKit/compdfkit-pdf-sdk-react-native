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
import com.compdfkit.core.document.CPDFDocument.PDFDocumentType;
import com.compdfkit.core.document.CPDFDocumentPermissionInfo;
import com.compdfkit.core.document.CPDFBates;
import com.compdfkit.core.document.CPDFBackground;
import com.compdfkit.core.document.CPDFBackground.CPDFBackgroundAlign;
import com.compdfkit.core.document.CPDFBackground.Type;
import com.compdfkit.core.annotation.CPDFImageScaleType;
import com.compdfkit.core.document.CPDFHeaderFooter;
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
import com.compdfkitpdf.reactnative.util.RnEnumConverter;
import com.compdfkitpdf.reactnative.util.RnDocumentSourceResolver;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.ReactApplicationContext;
import android.util.Base64;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.UUID;
import com.compdfkit.core.document.CPDFDocument.CPDFOptimizeOptions;
import com.compdfkit.core.document.CPDFDocument.CPDFOptimizeResult;
import com.compdfkit.core.document.CPDFDocument.CPDFImageOptimizeOptions;
import com.compdfkit.core.document.CPDFDocument.CPDFColorSpaceConvertOptions;
import com.compdfkit.core.document.CPDFDocument.CPDFCompressAlgorithm;
import com.compdfkit.core.document.CPDFDocument.OptimizeListener;
import com.compdfkitpdf.reactnative.view.RnPdfView;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Handles document ops for the native PDF viewer layer.
 */
final class RnDocumentOps {

  private static final String ERROR_WATERMARK_FAIL = "WATERMARK_FAIL";
  private static final String ERROR_HEADER_FOOTER_FAIL = "HEADER_FOOTER_FAIL";
  private static final String ERROR_INVALID_OUTPUT_PATH = "INVALID_OUTPUT_PATH";
  private static final String ERROR_DOCUMENT_INVALID = "DOCUMENT_INVALID";
  private static final String ERROR_ENCRYPTED_DOCUMENT = "ENCRYPTED_DOCUMENT_NOT_CONVERTIBLE";
  private static final String ERROR_PDF_STANDARD_CONVERT_FAILED = "PDF_STANDARD_CONVERT_FAILED";
  private static final String ERROR_PDF_STANDARD_SAVE_FAILED = "PDF_STANDARD_SAVE_FAILED";
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

  /**
   * Cancellation flags of the optimize runs in flight, keyed by the reader view. Only one run per
   * reader may be in flight so a stale run cannot race the reload of a newer one.
   */
  private final Map<RnPdfView, AtomicBoolean> runningOptimizations = new HashMap<>();

  /**
   * Returns the configuration {@link #optimizeSaveAsCopy} uses when no options are passed.
   */
  WritableMap getOptimizeOptions(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) {
      throw new IllegalStateException("The document is released or invalid.");
    }
    return optimizeOptionsToMap(new CPDFOptimizeOptions());
  }

  /**
   * Requests cancellation of the run in flight on this reader. The native listener polls the flag at
   * every page boundary; the pending call then resolves with {@code cancelled = true}.
   */
  void cancelOptimize(RnPdfViewContext context) {
    AtomicBoolean cancelled;
    synchronized (runningOptimizations) {
      cancelled = runningOptimizations.get(context.view);
    }
    if (cancelled != null) {
      cancelled.set(true);
    }
  }

  /**
   * Writes an optimized copy using either a supplied one-shot configuration or native defaults.
   *
   * <p>The native SDK closes the opened document once the copy is written, so every run that reached
   * the native call reloads the document from its original source. Unsaved changes are lost. When
   * the reload fails the call rejects with {@code OPTIMIZE_RESTORE_FAILED}.
   */
  void optimizeSaveAsCopy(RnPdfViewContext context, String outputPath, ReadableMap raw,
      boolean fontSubset, Promise promise) {
    if (!isDocumentAvailable(context)) {
      promise.reject("DOCUMENT_INVALID", "The document is released or invalid.");
      return;
    }
    if (TextUtils.isEmpty(outputPath)) {
      promise.reject("INVALID_OUTPUT_PATH", "outputPath must not be empty.");
      return;
    }
    File outputFile = new File(outputPath);
    File parent = outputFile.getParentFile();
    if (parent == null || !parent.isDirectory() || !parent.canWrite()) {
      promise.reject("INVALID_OUTPUT_PATH", "The output directory is not writable.");
      return;
    }
    final CPDFOptimizeOptions options;
    try {
      options = raw == null ? new CPDFOptimizeOptions() : optimizeOptionsFromMap(raw);
    } catch (IllegalArgumentException error) {
      promise.reject("INVALID_OPTIMIZE_OPTIONS", error.getMessage(), error);
      return;
    }
    final RnPdfView view = context.view;
    final AtomicBoolean cancelled = new AtomicBoolean(false);
    synchronized (runningOptimizations) {
      if (runningOptimizations.containsKey(view)) {
        promise.reject("OPTIMIZE_ALREADY_RUNNING",
          "Another optimize run is already in flight on this document.");
        return;
      }
      runningOptimizations.put(view, cancelled);
    }
    // Pending content edits have to be committed on the main thread before the document is read.
    if (context.viewCtrl != null) {
      context.viewCtrl.exitEditMode();
    }
    final CPDFDocument document = context.document;
    final OptimizeListener listener = new OptimizeListener() {
      @Override
      public boolean isCancelled() {
        return cancelled.get();
      }

      @Override
      public void onUpdate(int pageIndex) {
        CThreadPoolUtils.getInstance().executeMain(() -> view.emitOptimizeProgress(pageIndex));
      }
    };
    CThreadPoolUtils.getInstance().executeIO(() -> {
      CPDFOptimizeResult result = null;
      Exception failure = null;
      try {
        result = document.optimizeSaveAsCopy(outputPath, options, fontSubset, listener);
      } catch (Exception error) {
        failure = error;
      }
      final CPDFOptimizeResult completedResult = result;
      final Exception completedFailure = failure;
      // A cancelled run may have been stopped after the native close, so every run that reached
      // the native call is reloaded, not only the successful ones.
      final boolean needsReload = document.shouleReloadDocument() || completedResult != null;
      CThreadPoolUtils.getInstance().executeMain(() -> {
        try {
          String restoreError = needsReload ? restoreOptimizedDocument(context, document) : null;
          // The SDK reports a run cancelled before its first page as a plain failure.
          boolean wasCancelled = cancelled.get()
            && (completedFailure != null || completedResult == null || !completedResult.ok);
          String failureMessage = null;
          if (wasCancelled) {
            // Not a failure; resolved below with cancelled = true.
          } else if (completedFailure != null) {
            failureMessage = "The optimized copy could not be written: " + completedFailure.getMessage();
          } else if (completedResult == null) {
            failureMessage = "The optimize run returned no result.";
          } else if (!completedResult.ok && !completedResult.cancelled) {
            failureMessage = "The optimized copy could not be written.";
          }
          if (restoreError != null) {
            // The opened document still holds the optimized content; saving it would overwrite
            // the source, so this outranks any other failure.
            promise.reject("OPTIMIZE_RESTORE_FAILED",
              failureMessage == null ? restoreError : failureMessage + " " + restoreError);
          } else if (failureMessage != null) {
            promise.reject("OPTIMIZE_FAILED", failureMessage, completedFailure);
          } else if (wasCancelled) {
            WritableMap cancelledResult = optimizeResultToMap(completedResult);
            cancelledResult.putBoolean("ok", false);
            cancelledResult.putBoolean("cancelled", true);
            promise.resolve(cancelledResult);
          } else {
            promise.resolve(optimizeResultToMap(completedResult));
          }
        } finally {
          synchronized (runningOptimizations) {
            runningOptimizations.remove(view);
          }
        }
      });
    });
  }

  /**
   * Reloads the document from its original source and refreshes the reader.
   *
   * @return {@code null} when restored, otherwise why it was not.
   */
  private String restoreOptimizedDocument(RnPdfViewContext context, CPDFDocument document) {
    PDFDocumentError error;
    try {
      error = document.reload();
    } catch (Exception e) {
      error = null;
    }
    if (error != PDFDocumentError.PDFDocumentErrorSuccess) {
      return "The optimized document could not be reloaded from its original source"
        + (error == null ? "" : " (" + error.name() + ")")
        + ". Do not save it; close and reopen the document instead.";
    }
    if (isReaderAvailable(context)) {
      context.readerView.reloadPages2();
    }
    return null;
  }

  WritableArray getDigitalSignatures(RnPdfViewContext context) { return new RnDigitalSignatureOps(reactContext).getDigitalSignatures(context); }
  WritableMap verifyDigitalSignature(RnPdfViewContext context, int index) { return new RnDigitalSignatureOps(reactContext).verifyDigitalSignature(context, index); }
  boolean writeSignature(RnPdfViewContext context, int page, String uuid, String path, ReadableMap config) { return new RnDigitalSignatureOps(reactContext).writeSignature(context, page, uuid, path, config); }
  WritableMap getLtvReadiness(RnPdfViewContext context) { return RnSignatureLtvOps.getLtvReadiness(context); }
  WritableMap addSignatureLtv(RnPdfViewContext context, String path, ReadableMap options) { return RnSignatureLtvOps.addSignatureLtv(context, path, options); }

  private static WritableMap optimizeResultToMap(CPDFOptimizeResult result) {
    WritableMap out = Arguments.createMap();
    out.putBoolean("ok", result != null && result.ok);
    out.putBoolean("cancelled", result != null && result.cancelled);
    out.putInt("pages_processed", result == null ? 0 : result.pagesProcessed);
    out.putDouble("steps_us", result == null ? 0 : result.stepsUs);
    out.putDouble("save_us", result == null ? 0 : result.saveUs);
    return out;
  }

  private static WritableMap optimizeOptionsToMap(CPDFOptimizeOptions options) {
    WritableMap out = Arguments.createMap();
    out.putInt("flags", options.optimizeFlags);
    out.putDouble("image_quality", options.imageQuality);
    out.putMap("color_image_options", imageOptionsToMap(options.colorImageOptions));
    out.putMap("grayscale_image_options", imageOptionsToMap(options.grayscaleImageOptions));
    out.putMap("monochrome_image_options", imageOptionsToMap(options.monochromeImageOptions));
    WritableMap colorSpace = Arguments.createMap();
    CPDFColorSpaceConvertOptions convert = options.colorSpaceConvert;
    if (convert != null && convert.iccData != null) {
      colorSpace.putString("icc_data_base64", Base64.encodeToString(convert.iccData, Base64.NO_WRAP));
    } else {
      colorSpace.putNull("icc_data_base64");
    }
    colorSpace.putBoolean("rgb_to_cmyk", convert != null && convert.rgbToCmyk);
    out.putMap("color_space_convert", colorSpace);
    return out;
  }

  private static WritableMap imageOptionsToMap(CPDFImageOptimizeOptions options) {
    WritableMap out = Arguments.createMap();
    if (options == null) return out;
    out.putInt("upper_ppi", options.upperPpi);
    out.putInt("target_ppi", options.targetPpi);
    out.putInt("quality", options.quality);
    out.putInt("block_size", options.blockSize);
    out.putString("compress_algorithm", compressAlgorithmName(options.compressAlgorithm));
    return out;
  }

  private static String compressAlgorithmName(CPDFCompressAlgorithm value) {
    if (value == CPDFCompressAlgorithm.kFlate) return "flate";
    if (value == CPDFCompressAlgorithm.kRunLength) return "run_length";
    if (value == CPDFCompressAlgorithm.kDCT) return "jpeg";
    if (value == CPDFCompressAlgorithm.kJBIG2) return "jbig2";
    if (value == CPDFCompressAlgorithm.kJPX) return "jpeg2000";
    return "none";
  }

  private static CPDFOptimizeOptions optimizeOptionsFromMap(ReadableMap m) {
    validateOptimizeOptions(m);
    CPDFOptimizeOptions options = new CPDFOptimizeOptions();
    options.optimizeFlags = m.hasKey("flags") ? m.getInt("flags") : options.optimizeFlags;
    options.imageQuality = (float) (m.hasKey("image_quality")
      ? m.getDouble("image_quality") : options.imageQuality);
    options.colorImageOptions = imageOptionsFromMap(
      m.getMap("color_image_options"), options.colorImageOptions);
    options.grayscaleImageOptions = imageOptionsFromMap(
      m.getMap("grayscale_image_options"), options.grayscaleImageOptions);
    options.monochromeImageOptions = imageOptionsFromMap(
      m.getMap("monochrome_image_options"), options.monochromeImageOptions);

    ReadableMap colorSpace = m.getMap("color_space_convert");
    if (colorSpace != null) {
      byte[] iccData = null;
      if (colorSpace.hasKey("icc_data_base64") && !colorSpace.isNull("icc_data_base64")) {
        iccData = Base64.decode(colorSpace.getString("icc_data_base64"), Base64.DEFAULT);
      }
      options.colorSpaceConvert = new CPDFColorSpaceConvertOptions(
        iccData,
        colorSpace.hasKey("rgb_to_cmyk") && colorSpace.getBoolean("rgb_to_cmyk"));
    }
    return options;
  }

  private static void validateOptimizeOptions(ReadableMap options) {
    if (options == null) return;
    if (options.hasKey("image_quality")
      && (options.getDouble("image_quality") <= 0 || options.getDouble("image_quality") > 100)) {
      throw new IllegalArgumentException("INVALID_OPTIMIZE_OPTIONS");
    }
    validateImageOptions(options.getMap("color_image_options"));
    validateImageOptions(options.getMap("grayscale_image_options"));
    validateImageOptions(options.getMap("monochrome_image_options"));
    try {
      ReadableMap colorSpace = options.getMap("color_space_convert");
      if (colorSpace != null && colorSpace.hasKey("icc_data_base64")
        && !colorSpace.isNull("icc_data_base64")) {
        Base64.decode(colorSpace.getString("icc_data_base64"), Base64.DEFAULT);
      }
    } catch (IllegalArgumentException error) {
      throw new IllegalArgumentException("INVALID_OPTIMIZE_OPTIONS");
    }
  }

  private static void validateImageOptions(ReadableMap options) {
    if (options == null) return;
    if ((options.hasKey("upper_ppi") && options.getInt("upper_ppi") <= 0)
      || (options.hasKey("target_ppi") && options.getInt("target_ppi") <= 0)
      || (options.hasKey("quality")
        && (options.getInt("quality") <= 0 || options.getInt("quality") > 100))
      || (options.hasKey("block_size") && options.getInt("block_size") <= 0)) {
      throw new IllegalArgumentException("INVALID_OPTIMIZE_OPTIONS");
    }
  }

  private static CPDFImageOptimizeOptions imageOptionsFromMap(
      ReadableMap map, CPDFImageOptimizeOptions defaults) {
    if (map == null) return defaults;
    return new CPDFImageOptimizeOptions(
      map.hasKey("upper_ppi") ? map.getInt("upper_ppi") : defaults.upperPpi,
      map.hasKey("target_ppi") ? map.getInt("target_ppi") : defaults.targetPpi,
      map.hasKey("quality") ? map.getInt("quality") : defaults.quality,
      map.hasKey("block_size") ? map.getInt("block_size") : defaults.blockSize,
      compressAlgorithm(map.hasKey("compress_algorithm")
        ? map.getString("compress_algorithm") : "none"));
  }

  private static CPDFCompressAlgorithm compressAlgorithm(String value) {
    if ("flate".equals(value)) return CPDFCompressAlgorithm.kFlate;
    if ("run_length".equals(value)) return CPDFCompressAlgorithm.kRunLength;
    if ("jpeg".equals(value)) return CPDFCompressAlgorithm.kDCT;
    if ("jbig2".equals(value)) return CPDFCompressAlgorithm.kJBIG2;
    if ("jpeg2000".equals(value)) return CPDFCompressAlgorithm.kJPX;
    return CPDFCompressAlgorithm.kNone;
  }

  WritableMap getHeaderFooter(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) {
      return null;
    }
    CPDFHeaderFooter headerFooter = context.document.getHeaderFooter();
    if (headerFooter == null) {
      return null;
    }
    try {
      WritableMap value = toHeaderFooterMap(headerFooter);
      return hasHeaderFooterContent(value) ? value : null;
    } finally {
      headerFooter.release();
    }
  }

  boolean updateHeaderFooter(RnPdfViewContext context, ReadableMap info) {
    if (!isDocumentAvailable(context) || info == null || !info.hasKey("pages")
      || !info.hasKey("margin") || !info.hasKey("slots")) {
      return false;
    }
    String pages = getString(info, "pages", "");
    ReadableMap margin = info.getMap("margin");
    ReadableArray slots = info.getArray("slots");
    if (TextUtils.isEmpty(pages) || margin == null || slots == null || slots.size() == 0) {
      return false;
    }
    CPDFHeaderFooter headerFooter = context.document.getHeaderFooter();
    if (headerFooter == null) {
      return false;
    }
    try {
      headerFooter.setPages(pages);
      headerFooter.setMargin(
        (float) getDouble(margin, "left", 0),
        (float) getDouble(margin, "top", 0),
        (float) getDouble(margin, "right", 0),
        (float) getDouble(margin, "bottom", 0));
      for (int index = 0; index < 6; index++) {
        headerFooter.setText(index, "");
      }
      for (int i = 0; i < slots.size(); i++) {
        ReadableMap slot = slots.getMap(i);
        if (slot == null) {
          return false;
        }
        int index = headerFooterIndex(getString(slot, "position", ""));
        double fontSize = getDouble(slot, "font_size", 0);
        if (index < 0 || fontSize <= 0) {
          return false;
        }
        headerFooter.setText(index, getString(slot, "text", ""));
        headerFooter.setFontName(index, getString(slot, "font_name", "Helvetica"));
        headerFooter.setFontSize(index, (float) fontSize);
        headerFooter.setTextColor(index, Color.parseColor(
          getString(slot, "text_color", "#FF000000")));
      }
      headerFooter.update();
      reloadPagesIfAttached(context);
      return true;
    } catch (IllegalArgumentException error) {
      return false;
    } finally {
      headerFooter.release();
    }
  }

  boolean clearHeaderFooter(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) {
      return false;
    }
    CPDFHeaderFooter headerFooter = context.document.getHeaderFooter();
    if (headerFooter == null) {
      return false;
    }
    try {
      headerFooter.clear();
      reloadPagesIfAttached(context);
      return true;
    } finally {
      headerFooter.release();
    }
  }

  WritableMap getBates(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) return null;
    CPDFBates bates = context.document.getBates();
    if (bates == null) return null;
    try {
      WritableMap value = toHeaderFooterMap(bates);
      value.putInt("page_offset", bates.getPageOffset());
      value.putInt("rule", bates.getRules());
      return hasHeaderFooterContent(value) ? value : null;
    } finally { bates.release(); }
  }

  boolean updateBates(RnPdfViewContext context, ReadableMap info) {
    if (!isDocumentAvailable(context) || info == null || !info.hasKey("pages") || !info.hasKey("margin") || !info.hasKey("slots")) return false;
    String pages = getString(info, "pages", ""); ReadableMap margin = info.getMap("margin"); ReadableArray slots = info.getArray("slots");
    if (TextUtils.isEmpty(pages) || margin == null || slots == null || slots.size() == 0) return false;
    CPDFBates bates = context.document.getBates(); if (bates == null) return false;
    try {
      bates.setPages(pages);
      bates.setMargin((float) getDouble(margin, "left", 0), (float) getDouble(margin, "top", 0), (float) getDouble(margin, "right", 0), (float) getDouble(margin, "bottom", 0));
      bates.setPageOffset((int) getDouble(info, "page_offset", 0)); bates.setRules((int) getDouble(info, "rule", 2));
      for (int index = 0; index < 6; index++) bates.setText(index, "");
      for (int i = 0; i < slots.size(); i++) {
        ReadableMap slot = slots.getMap(i); if (slot == null) return false;
        int index = headerFooterIndex(getString(slot, "position", "")); double size = getDouble(slot, "font_size", 0);
        if (index < 0 || size <= 0) return false;
        bates.setText(index, getString(slot, "text", "")); bates.setFontName(index, getString(slot, "font_name", "Helvetica")); bates.setFontSize(index, (float) size);
        bates.setTextColor(index, Color.parseColor(getString(slot, "text_color", "#FF000000")));
      }
      bates.update(); reloadPagesIfAttached(context); return true;
    } catch (IllegalArgumentException error) { return false; } finally { bates.release(); }
  }

  boolean clearBates(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) return false; CPDFBates bates = context.document.getBates(); if (bates == null) return false;
    try { bates.clear(); reloadPagesIfAttached(context); return true; } finally { bates.release(); }
  }

  WritableMap getBackground(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) return null;
    CPDFBackground background = context.document.getBackground();
    if (background == null) return null;
    try {
      if (!background.isValid()) return null;
      WritableMap value = Arguments.createMap();
      value.putString("pages", background.getPages() == null ? "" : background.getPages());
      value.putString("type", background.getType() == Type.Image ? "image" : "color");
      if (background.getType() == Type.Color) value.putString("color", String.format("#%08X", background.getColor()));
      value.putDouble("opacity", background.getOpacity());
      value.putDouble("scale", background.getScale());
      value.putDouble("rotation", RnBackgroundRotation.fromNative(background.getRotation()));
      value.putString("horizontal_alignment", backgroundHoriz(background.getHorizalign()));
      value.putString("vertical_alignment", backgroundVert(background.getVertalign()));
      value.putDouble("horizontal_offset", background.getXOffset());
      value.putDouble("vertical_offset", background.getYOffset());
      value.putBoolean("allow_view", background.isAllowsView());
      value.putBoolean("allow_print", background.isAllowsPrint());
      return value;
    } finally {
      background.release();
    }
  }

  void updateBackground(RnPdfViewContext context, ReadableMap info, Promise promise) {
    if (!isDocumentAvailable(context) || info == null) {
      promise.reject("BACKGROUND_FAIL", "Document unavailable");
      return;
    }
    CPDFBackground background = context.document.getBackground();
    if (background == null) {
      promise.resolve(false);
      return;
    }
    try {
      if (!hasRequiredBackgroundFields(info)) {
        promise.reject("BACKGROUND_FAIL", "Background payload is invalid.");
        return;
      }

      String pages = getString(info, "pages", "");
      String type = getString(info, "type", "");
      CPDFBackgroundAlign horizontalAlignment = parseBackgroundHoriz(getString(info, "horizontal_alignment", ""));
      CPDFBackgroundAlign verticalAlignment = parseBackgroundVert(getString(info, "vertical_alignment", ""));
      if (TextUtils.isEmpty(pages) || TextUtils.isEmpty(type)
        || horizontalAlignment == null || verticalAlignment == null) {
        promise.reject("BACKGROUND_FAIL", "Background payload is invalid.");
        return;
      }

      boolean success = true;
      success = background.setPages(pages) && success;
      success = background.setOpacity((float) getDouble(info, "opacity", 0)) && success;
      success = background.setScale((float) getDouble(info, "scale", 0)) && success;
      success = background.setRotation(RnBackgroundRotation.toNative(getDouble(info, "rotation", 0))) && success;
      success = background.setHorizalign(horizontalAlignment) && success;
      success = background.setVertalign(verticalAlignment) && success;
      success = background.setXOffset((float) getDouble(info, "horizontal_offset", 0)) && success;
      success = background.setYOffset((float) getDouble(info, "vertical_offset", 0)) && success;
      success = background.setAllowsView(getBoolean(info, "allow_view", false)) && success;
      success = background.setAllowsPrint(getBoolean(info, "allow_print", false)) && success;

      if ("color".equals(type)) {
        String color = getString(info, "color", "");
        if (TextUtils.isEmpty(color)) {
          promise.reject("BACKGROUND_FAIL", "A color background requires color.");
          return;
        }
        try {
          success = background.setType(Type.Color) && success;
          success = background.setColor(Color.parseColor(color)) && success;
        } catch (IllegalArgumentException error) {
          promise.reject("BACKGROUND_FAIL", "Background color is invalid.", error);
          return;
        }
      } else if ("image".equals(type)) {
        String path = com.compdfkitpdf.reactnative.util.RnFileUtils.parseFilePath(
          reactContext, getString(info, "image_path", ""));
        if (TextUtils.isEmpty(path) || !new File(path).isFile()) {
          promise.reject("BACKGROUND_FAIL", "Background image_path does not exist.");
          return;
        }
        success = background.setType(Type.Image) && success;
        success = background.setImage(path, null, CPDFImageScaleType.SCALETYPE_fitCenter) && success;
      } else {
        promise.reject("BACKGROUND_FAIL", "Background type is invalid.");
        return;
      }

      if (!success) {
        promise.reject("BACKGROUND_FAIL", "Native SDK failed to update the background.");
        return;
      }
      background.update();
      reloadPagesIfAttached(context);
      promise.resolve(true);
    } catch (IllegalArgumentException error) {
      promise.reject("BACKGROUND_FAIL", error.getMessage(), error);
    } finally {
      background.release();
    }
  }

  boolean clearBackground(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) return false;
    CPDFBackground background = context.document.getBackground();
    if (background == null) return false;
    try {
      background.clear();
      reloadPagesIfAttached(context);
      return true;
    } finally {
      background.release();
    }
  }

  private boolean hasRequiredBackgroundFields(ReadableMap info) {
    String[] fields = { "pages", "type", "opacity", "scale", "rotation",
      "horizontal_alignment", "vertical_alignment", "horizontal_offset",
      "vertical_offset", "allow_view", "allow_print" };
    for (String field : fields) {
      if (!info.hasKey(field) || info.isNull(field)) return false;
    }
    return true;
  }

  private CPDFBackgroundAlign parseBackgroundHoriz(String value) { if ("left".equals(value)) return CPDFBackgroundAlign.Left; if ("center".equals(value)) return CPDFBackgroundAlign.Center; if ("right".equals(value)) return CPDFBackgroundAlign.Right; return null; }
  private CPDFBackgroundAlign parseBackgroundVert(String value) { if ("top".equals(value)) return CPDFBackgroundAlign.Top; if ("center".equals(value)) return CPDFBackgroundAlign.Center; if ("bottom".equals(value)) return CPDFBackgroundAlign.Bottom; return null; }
  private String backgroundHoriz(CPDFBackgroundAlign value) { return value == CPDFBackgroundAlign.Left ? "left" : value == CPDFBackgroundAlign.Right ? "right" : "center"; }
  private String backgroundVert(CPDFBackgroundAlign value) { return value == CPDFBackgroundAlign.Top ? "top" : value == CPDFBackgroundAlign.Bottom ? "bottom" : "center"; }

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
        boolean success = watermark.create();
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
    boolean success = watermark.create();
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

  private WritableMap toHeaderFooterMap(CPDFHeaderFooter headerFooter) {
    WritableMap value = Arguments.createMap();
    value.putString("pages", headerFooter.getPages() == null ? "" : headerFooter.getPages());
    RectF margin = headerFooter.getMargin();
    WritableMap marginMap = Arguments.createMap();
    marginMap.putDouble("left", margin == null ? 0 : margin.left);
    marginMap.putDouble("top", margin == null ? 0 : margin.top);
    marginMap.putDouble("right", margin == null ? 0 : margin.right);
    marginMap.putDouble("bottom", margin == null ? 0 : margin.bottom);
    value.putMap("margin", marginMap);
    WritableArray slots = Arguments.createArray();
    for (int index = 0; index < 6; index++) {
      WritableMap slot = Arguments.createMap();
      slot.putString("position", headerFooterPosition(index));
      slot.putString("text", headerFooter.getText(index) == null ? "" : headerFooter.getText(index));
      slot.putString("font_name", headerFooter.getFontName(index) == null
        ? "Helvetica" : headerFooter.getFontName(index));
      slot.putDouble("font_size", headerFooter.getFontSize(index));
      slot.putString("text_color", String.format("#%08X", headerFooter.getTextColor(index)));
      slots.pushMap(slot);
    }
    value.putArray("slots", slots);
    return value;
  }

  private boolean hasHeaderFooterContent(WritableMap value) {
    ReadableArray slots = value.getArray("slots");
    if (slots == null) {
      return false;
    }
    for (int index = 0; index < slots.size(); index++) {
      ReadableMap slot = slots.getMap(index);
      if (slot != null && !TextUtils.isEmpty(getString(slot, "text", ""))) {
        return true;
      }
    }
    return false;
  }

  private int headerFooterIndex(String position) {
    switch (position) {
      case "header_left": return 0;
      case "header_center": return 1;
      case "header_right": return 2;
      case "footer_left": return 3;
      case "footer_center": return 4;
      case "footer_right": return 5;
      default: return -1;
    }
  }

  private String headerFooterPosition(int index) {
    switch (index) {
      case 0: return "header_left";
      case 1: return "header_center";
      case 2: return "header_right";
      case 3: return "footer_left";
      case 4: return "footer_center";
      case 5: return "footer_right";
      default: return "header_left";
    }
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
    CPDFPage copiedPage = document.copyPage(pageIndex, normalizedInsertIndex);
    boolean copied = copiedPage != null && copiedPage.isValid();
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
   * Returns the PDF standard the current document declares conformance with.
   */
  String getPdfStandardType(RnPdfViewContext context) {
    if (!isDocumentAvailable(context)) {
      return null;
    }
    return RnEnumConverter.pdfStandardTypeToString(context.document.getType());
  }

  /**
   * Converts the current document to the given PDF standard and writes the result to
   * {@code outputPath}.
   *
   * <p>The conversion runs on a separately opened copy of the source file (see
   * {@link #runPdfStandardConversion}), so the opened document and the reader are never touched.
   *
   * <p>{@code fontSubset} is the only setting on the wire: {@code convertType} takes nothing but
   * the target standard, and the ICC output intent is the one bundled with the SDK.
   */
  void convertToPdfStandard(RnPdfViewContext context, String outputPath, String type,
    boolean fontSubset, Promise promise) {
    if (!isDocumentAvailable(context)) {
      promise.reject(ERROR_DOCUMENT_INVALID, "The document is released or invalid.");
      return;
    }
    CPDFDocument document = context.document;

    PDFDocumentType targetType = RnEnumConverter.stringToPdfStandardType(type);
    if (targetType == null) {
      promise.reject(ERROR_PDF_STANDARD_CONVERT_FAILED, "Unknown PDF standard type: " + type);
      return;
    }

    String pathError = validatePdfStandardOutputPath(document, outputPath);
    if (pathError != null) {
      promise.reject(ERROR_INVALID_OUTPUT_PATH, pathError);
      return;
    }

    if (!TextUtils.isEmpty(document.getPassword())) {
      promise.reject(ERROR_ENCRYPTED_DOCUMENT,
        "An encrypted document cannot be converted. Remove the password with saveAs first.");
      return;
    }

    CThreadPoolUtils.getInstance().executeIO(
      () -> runPdfStandardConversion(context, document, outputPath, targetType, fontSubset,
        promise));
  }

  /**
   * Runs the in place conversion off the UI thread and restores the opened document afterwards.
   */
  /**
   * Converts a separately opened instance of the current document, so the document shown in the
   * reader is never mutated. Converting the reader's own document raced with page rendering after
   * the reload that followed it and crashed in native code on back-to-back calls. As on iOS, the
   * reader needs no reload afterwards; unlike iOS, unsaved changes in the reader are not part of the
   * output because the copy is opened from the source file.
   */
  private void runPdfStandardConversion(RnPdfViewContext context, CPDFDocument document,
    String outputPath, PDFDocumentType targetType, boolean fontSubset, Promise promise) {
    String errorCode = null;
    String errorMessage = null;
    CPDFDocument source = new CPDFDocument(reactContext);
    try {
      String path = document.getAbsolutePath();
      Uri uri = document.getUri();
      PDFDocumentError openError = !TextUtils.isEmpty(path) ? source.open(path) : uri != null ? source.open(uri) : null;
      if (openError != PDFDocumentError.PDFDocumentErrorSuccess) {
        errorCode = ERROR_PDF_STANDARD_CONVERT_FAILED;
        errorMessage = "The document could not be reopened from its source for conversion"
          + (openError == null ? "." : " (" + openError.name() + ").");
      } else if (!source.convertType(targetType)) {
        errorCode = ERROR_PDF_STANDARD_CONVERT_FAILED;
        errorMessage = "The native conversion to " + targetType.name() + " failed.";
      } else {
        boolean saveResult;
        if (RnDocumentSourceResolver.isContentSource(outputPath)) {
          saveResult = source.saveAs(Uri.parse(outputPath), false, fontSubset);
        } else {
          saveResult = source.saveAs(outputPath, false, false, fontSubset);
        }
        if (!saveResult) {
          errorCode = ERROR_PDF_STANDARD_SAVE_FAILED;
          errorMessage = "The conversion succeeded but writing " + outputPath + " failed.";
        }
      }
    } catch (Exception e) {
      errorCode = ERROR_PDF_STANDARD_CONVERT_FAILED;
      errorMessage = "The conversion failed: " + e.getMessage();
    } finally {
      try {
        source.close();
      } catch (Exception ignored) {
        // The copy is discarded either way.
      }
    }
    final String code = errorCode;
    final String message = errorMessage;
    CThreadPoolUtils.getInstance().executeMain(() -> {
      if (code != null) {
        promise.reject(code, message);
      } else {
        promise.resolve(true);
      }
    });
  }

  /**
   * Returns the reason the output path cannot be used, or null when it is valid.
   */
  @Nullable
  private String validatePdfStandardOutputPath(CPDFDocument document, String outputPath) {
    if (TextUtils.isEmpty(outputPath)) {
      return "outputPath must not be empty.";
    }
    if (RnDocumentSourceResolver.isContentSource(outputPath)) {
      return null;
    }
    File output = new File(outputPath);
    File parent = output.getParentFile();
    if (parent == null || !parent.exists()) {
      return "The parent directory of " + outputPath + " does not exist.";
    }
    if (!parent.canWrite()) {
      return "The directory " + parent.getAbsolutePath() + " is not writable.";
    }
    String currentPath = document.getAbsolutePath();
    if (!TextUtils.isEmpty(currentPath) && currentPath.equals(output.getAbsolutePath())) {
      return "outputPath must differ from the path of the current document.";
    }
    return null;
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
