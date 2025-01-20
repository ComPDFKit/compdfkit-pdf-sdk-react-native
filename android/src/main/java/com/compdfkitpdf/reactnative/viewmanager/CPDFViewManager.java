/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.viewmanager;


import static com.compdfkitpdf.reactnative.util.CPDFDocumentUtil.ASSETS_SCHEME;
import static com.compdfkitpdf.reactnative.util.CPDFDocumentUtil.CONTENT_SCHEME;
import static com.compdfkitpdf.reactnative.util.CPDFDocumentUtil.FILE_SCHEME;

import android.app.Activity;

import android.graphics.Color;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;
import android.util.SparseArray;
import android.view.View;
import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;

import com.compdfkit.core.common.CPDFDocumentException;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.document.CPDFDocument.PDFDocumentEncryptAlgo;
import com.compdfkit.core.document.CPDFDocument.PDFDocumentPermissions;
import com.compdfkit.core.document.CPDFDocument.PDFDocumentSaveType;
import com.compdfkit.core.document.CPDFDocumentPermissionInfo;
import com.compdfkit.tools.common.pdf.CPDFConfigurationUtils;
import com.compdfkit.tools.common.pdf.config.CPDFConfiguration;
import com.compdfkit.tools.common.utils.CFileUtils;
import com.compdfkit.tools.common.utils.threadpools.CThreadPoolUtils;
import com.compdfkit.tools.common.utils.viewutils.CViewUtils;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl.COnSaveCallback;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl.COnSaveError;
import com.compdfkit.tools.common.views.pdfview.CPreviewMode;
import com.compdfkit.ui.reader.CPDFReaderView;
import com.compdfkitpdf.reactnative.util.CPDFDocumentUtil;
import com.compdfkitpdf.reactnative.view.CPDFView;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import java.io.File;
import java.util.Map;

public class CPDFViewManager extends ViewGroupManager<CPDFView> {

  private static final String TAG = "ComPDFKitRN";

  private ReactApplicationContext reactContext;

  private SparseArray<CPDFView> mDocumentViews = new SparseArray<>();

  public CPDFViewManager(ReactApplicationContext context) {
    this.reactContext = context;
  }

  @NonNull
  @Override
  public String getName() {
    return "RCTCPDFReaderView";
  }

  private View.OnAttachStateChangeListener mOnAttachStateChangeListener = new View.OnAttachStateChangeListener() {
    @Override
    public void onViewAttachedToWindow(View v) {
      CPDFView documentView = (CPDFView) v;
      mDocumentViews.put(v.getId(), documentView);
      try {
        CPDFReaderView readerView = documentView.getCPDFReaderView();
        if (readerView.getPDFDocument() != null) {
          readerView.reloadPages();
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
    }

    @Override
    public void onViewDetachedFromWindow(View v) {
      mDocumentViews.remove(v.getId());
    }
  };

  @NonNull
  @Override
  protected CPDFView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
    Activity currentActivity = themedReactContext.getCurrentActivity();
    if (currentActivity instanceof FragmentActivity fragmentActivity) {
      CPDFView pdfView = new CPDFView(fragmentActivity);
      pdfView.setup(themedReactContext, fragmentActivity.getSupportFragmentManager());
      pdfView.addOnAttachStateChangeListener(mOnAttachStateChangeListener);
      return pdfView;
    } else {
      throw new IllegalStateException("CPDFView can only be used in FragmentActivity subclasses");
    }
  }

  @Override
  public boolean needsCustomLayoutForChildren() {
    return true;
  }

  @ReactProp(name = "document")
  public void setDocument(CPDFView pdfView, String document) {
    Log.d(TAG, "CPDFViewManager-setDocument()");
    Log.d(TAG, "document:" + document);
    pdfView.setDocument(document);
  }

  @ReactProp(name = "password")
  public void setPassword(CPDFView pdfView, String password) {
    pdfView.setPassword(password);
  }

  @ReactProp(name = "configuration")
  public void setConfiguration(CPDFView pdfView, String configurationJson) {
    CPDFConfiguration configuration = CPDFConfigurationUtils.fromJson(configurationJson);
    pdfView.setConfiguration(configuration);
  }


  public void save(int tag, COnSaveCallback saveCallback, COnSaveError error) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView != null) {
      pdfView.documentFragment.pdfView.savePDF(saveCallback, error);
    } else {
      error.error(new Exception("save() Unable to find DocumentView"));
    }
  }

  public void setMargins(int tag, int left, int top, int right, int bottom) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView != null) {
      CPDFReaderView readerView = pdfView.documentFragment.pdfView.getCPdfReaderView();
      readerView.setReaderViewTopMargin(top);
      readerView.setReaderViewBottomMargin(bottom);
      readerView.setReaderViewHorizontalMargin(left, right);
      readerView.reloadPages();
    }
  }

  public boolean removeAllAnnotations(int tag) {
    try {
      CPDFView pdfView = mDocumentViews.get(tag);
      if (pdfView != null) {
        CPDFReaderView readerView = pdfView.documentFragment.pdfView.getCPdfReaderView();
        boolean result = readerView.getPDFDocument().removeAllAnnotations();
        if (result) {
          readerView.invalidateAllChildren();
        }
        return result;
      }
      return false;
    } catch (Exception e) {
      return false;
    }
  }

  public boolean importAnnotations(int tag, String xfdfFilePath) throws Exception {
    String xfdf = CPDFDocumentUtil.getImportAnnotationPath(reactContext, xfdfFilePath);
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.documentFragment.pdfView.getCPdfReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    File file = new File(xfdf);
    if (!file.exists()) {
      throw new Exception("File not found: " + xfdf);
    }
    File cacheFile = new File(reactContext.getCacheDir(),
      CFileUtils.CACHE_FOLDER + File.separator + "importAnnotCache/"
        + CFileUtils.getFileNameNoExtension(document.getFileName()));
    cacheFile.mkdirs();
    boolean importResult = document.importAnnotations(xfdf,
      cacheFile.getAbsolutePath());
    readerView.reloadPages();
    return importResult;
  }

  public String exportAnnotations(int tag) throws Exception {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.documentFragment.pdfView.getCPdfReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    // export file directory
    File dirFile = new File(reactContext.getFilesDir(), "compdfkit/annotation/export/");
    dirFile.mkdirs();
    // export file name
    String fileName = CFileUtils.getFileNameNoExtension(document.getFileName());
    // export file cache file
    File cacheFile = new File(reactContext.getCacheDir(),
      CFileUtils.CACHE_FOLDER + File.separator + "exportAnnotCache/" + fileName);
    cacheFile.mkdirs();
    // export file
    File saveFile = new File(dirFile, fileName + ".xfdf");
    saveFile = CFileUtils.renameNameSuffix(saveFile);
    boolean exportResult = document.exportAnnotations(saveFile.getAbsolutePath(),
      cacheFile.getAbsolutePath());
    if (exportResult) {
      return saveFile.getAbsolutePath();
    } else {
      return null;
    }
  }

  public void setDisplayPageIndex(int tag, int pageIndex) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setDisplayPageIndex(pageIndex);
  }

  public int getCurrentPageIndex(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().getPageNum();
  }

  public boolean hasChange(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().getPDFDocument().hasChanges();
  }

  public void setScale(int tag, float scale) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setScale(scale);
  }

  public float getScale(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().getScale();
  }

  public void setCanScale(int tag, boolean canScale) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setCanScale(canScale);
  }

  public void setReadBackgroundColor(int tag, String color) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setReadBackgroundColor(Color.parseColor(color));
    pdfView.getCPDFReaderView().setBackgroundColor(
      CViewUtils.getColor(Color.parseColor(color), 190));
  }

  public String getReadBackgroundColor(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    String readBgColor =
      "#" + Integer.toHexString(pdfView.getCPDFReaderView().getReadBackgroundColor()).toUpperCase();
    return readBgColor;
  }

  public void setFormFieldHighlight(int tag, boolean isFormFieldHighlight) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setFormFieldHighlight(isFormFieldHighlight);
  }

  public boolean isFormFieldHighlight(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().isFormFieldHighlight();
  }

  public void setLinkHighlight(int tag, boolean isLinkHighlight) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setLinkHighlight(isLinkHighlight);
  }

  public boolean isLinkHighlight(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().isLinkHighlight();
  }

  public void setVerticalMode(int tag, boolean isVerticalMode) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setVerticalMode(isVerticalMode);
  }

  public boolean isVerticalMode(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().isVerticalMode();
  }

  public void setPageSpacing(int tag, int spacing) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setPageSpacing(spacing);
    pdfView.getCPDFReaderView().reloadPages();
  }

  public void setContinueMode(int tag, boolean isContinueMode) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setContinueMode(isContinueMode);
  }

  public boolean isContinueMode(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().isContinueMode();
  }

  public void setDoublePageMode(int tag, boolean isDoublePageMode) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setDoublePageMode(isDoublePageMode);
    pdfView.getCPDFReaderView().setCoverPageMode(false);
  }

  public boolean isDoublePageMode(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().isDoublePageMode();
  }

  public void setCoverPageMode(int tag, boolean isCoverPageMode) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setDoublePageMode(isCoverPageMode);
    pdfView.getCPDFReaderView().setCoverPageMode(isCoverPageMode);
  }

  public boolean isCoverPageMode(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().isCoverPageMode();
  }

  public void setCropMode(int tag, boolean isCropMode) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setCropMode(isCropMode);
  }

  public boolean isCropMode(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().isCropMode();
  }

  public void setPageSameWidth(int tag, boolean isPageSameWidth) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setPageSameWidth(isPageSameWidth);
    pdfView.getCPDFReaderView().reloadPages();
  }

  public boolean isPageInScreen(int tag, int pageIndex) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().isPageInScreen(pageIndex);
  }

  public void setFixedScroll(int tag, boolean isFixedScroll) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setFixedScroll(isFixedScroll);
  }

  public void setPreviewMode(int tag, String previewMode) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.documentFragment.setPreviewMode(CPreviewMode.fromAlias(previewMode));
  }

  public CPreviewMode getPreviewMode(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.documentFragment.pdfToolBar.getMode();
  }

  public void showThumbnailView(int tag, boolean editMode) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.documentFragment.showPageEdit(editMode);
  }

  public void showBotaView(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.documentFragment.showBOTA();
  }

  public void showAddWatermarkView(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.documentFragment.showAddWatermarkDialog();
  }

  public void showSecurityView(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.documentFragment.showSecurityDialog();
  }

  public void showDisplaySettingView(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.documentFragment.showDisplaySettings(pdfView.documentFragment.pdfView);
  }

  public void enterSnipMode(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.documentFragment.enterSnipMode();
  }

  public void exitSnipMode(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.documentFragment.exitSnipMode();
  }

  public void open(int tag, String filePath, String password, Promise promise) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFViewCtrl viewCtrl = pdfView.documentFragment.pdfView;
    if (filePath.startsWith(ASSETS_SCHEME)) {
      String assetsPath = filePath.replace(ASSETS_SCHEME + "/","");
      String[] strs = filePath.split("/");
      String fileName = strs[strs.length -1];
      String samplePDFPath = CFileUtils.getAssetsTempFile(reactContext, assetsPath, fileName);
      viewCtrl.openPDF(samplePDFPath, password, () -> {
        promise.resolve(true);
      });
    } else if (filePath.startsWith(CONTENT_SCHEME) || filePath.startsWith(FILE_SCHEME)) {
      Uri uri = Uri.parse(filePath);
      viewCtrl.openPDF(uri, password, () -> {
        promise.resolve(true);
      });
    } else {
      viewCtrl.openPDF(filePath, password, () -> {
        promise.resolve(true);
      });
    }
  }

  public String getFileName(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().getPDFDocument().getFileName();
  }

  public boolean isEncrypted(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().getPDFDocument().isEncrypted();
  }

  public boolean isImageDoc(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().getPDFDocument().isImageDoc();
  }

  public PDFDocumentPermissions getPermissions(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().getPDFDocument().getPermissions();
  }

  public boolean checkOwnerUnlocked(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().getPDFDocument().checkOwnerUnlocked();
  }

  public boolean checkOwnerPassword(int tag, String password) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().getPDFDocument().checkOwnerPassword(password);
  }

  public int getPageCount(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().getPDFDocument().getPageCount();
  }

  public void saveAs(int tag, String savePath, boolean removeSecurity, boolean fontSubSet,
    Promise result) {
    CThreadPoolUtils.getInstance().executeIO(() -> {
      try {
        CPDFView pdfView = mDocumentViews.get(tag);
        CPDFDocument document = pdfView.getCPDFReaderView().getPDFDocument();
        boolean saveResult;
        if (savePath.startsWith(CONTENT_SCHEME)) {
          saveResult = document.saveAs(Uri.parse(savePath), removeSecurity, fontSubSet);
        } else {
          saveResult = document.saveAs(savePath, removeSecurity, false, fontSubSet);
        }
        if (document.shouleReloadDocument()) {
          document.reload();
        }
        result.resolve(saveResult);
      } catch (CPDFDocumentException e) {
        e.printStackTrace();
        result.reject("SAVE_FAIL",
          "The current saved directory is: " + savePath
            + ", please make sure you have write permission to this directory");
      }
    });
  }

  public void print(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    String path = readerView.getPDFDocument().getAbsolutePath();
    Uri uri = readerView.getPDFDocument().getUri();
    CFileUtils.startPrint(reactContext, path, uri);
  }

  public void removePassword(int tag, Promise promise) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    try {
      CPDFDocument document = readerView.getPDFDocument();
      boolean saveResult = document.save(PDFDocumentSaveType.PDFDocumentSaveRemoveSecurity,
        true);
      if (document.shouleReloadDocument()) {
        document.reload();
      }
      promise.resolve(saveResult);
    } catch (Exception e) {
      promise.reject("SAVE_FAIL",
        "An exception occurs when remove document opening password and saving it.,"
          + e.getMessage());
    }
  }

  public void setPassword(int tag,
    String userPassword,
    String ownerPassword,
    boolean allowsPrinting,
    boolean allowsCopying,
    String encryptAlgo,
    Promise promise) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFDocument document = pdfView.getCPDFReaderView().getPDFDocument();
    ;
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
          "An exception occurs when setting a document opening password and saving it.,"
            + e.getMessage());
      }
    });
  }

  public String getEncryptAlgo(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    PDFDocumentEncryptAlgo encryptAlgo = pdfView.getCPDFReaderView().getPDFDocument()
      .getEncryptAlgorithm();
    return switch (encryptAlgo) {
      case PDFDocumentRC4 -> "rc4";
      case PDFDocumentAES128 -> "aes128";
      case PDFDocumentAES256 -> "aes256";
      case PDFDocumentNoEncryptAlgo -> "noEncryptAlgo";
    };
  }
}
