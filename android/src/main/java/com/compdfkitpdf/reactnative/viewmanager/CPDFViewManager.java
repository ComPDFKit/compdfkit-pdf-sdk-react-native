/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
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
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.RectF;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.text.TextUtils;
import android.util.Base64;
import android.util.Log;
import android.util.SparseArray;
import android.view.View;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentManager;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.request.target.CustomTarget;
import com.bumptech.glide.request.transition.Transition;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFStampAnnotation.StandardStamp;
import com.compdfkit.core.annotation.CPDFStampAnnotation.TextStamp;
import com.compdfkit.core.annotation.CPDFStampAnnotation.TextStampColor;
import com.compdfkit.core.annotation.CPDFStampAnnotation.TextStampShape;
import com.compdfkit.core.annotation.form.CPDFWidget.WidgetType;
import com.compdfkit.core.common.CPDFDocumentException;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.document.CPDFDocument.PDFDocumentEncryptAlgo;
import com.compdfkit.core.document.CPDFDocument.PDFDocumentError;
import com.compdfkit.core.document.CPDFDocument.PDFDocumentImageMode;
import com.compdfkit.core.document.CPDFDocument.PDFDocumentPermissions;
import com.compdfkit.core.document.CPDFDocument.PDFDocumentSaveType;
import com.compdfkit.core.document.CPDFDocumentPermissionInfo;
import com.compdfkit.core.document.CPDFOutline;
import com.compdfkit.core.edit.CPDFEditArea;
import com.compdfkit.core.edit.CPDFEditManager;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.page.CPDFPage.PDFFlattenOption;
import com.compdfkit.core.undo.CPDFUndoManager;
import com.compdfkit.tools.common.pdf.CPDFConfigurationUtils;
import com.compdfkit.tools.common.pdf.config.CPDFConfiguration;
import com.compdfkit.tools.common.pdf.config.CPDFWatermarkConfig;
import com.compdfkit.tools.common.utils.CFileUtils;
import com.compdfkit.tools.common.utils.annotation.CPDFAnnotationManager;
import com.compdfkit.tools.common.utils.glide.CPDFWrapper;
import com.compdfkit.tools.common.utils.glide.wrapper.impl.CPDFDocumentPageWrapper;
import com.compdfkit.tools.common.utils.print.CPDFPrintUtils;
import com.compdfkit.tools.common.utils.threadpools.CThreadPoolUtils;
import com.compdfkit.tools.common.views.pdfproperties.CAnnotationType;
import com.compdfkit.tools.common.views.pdfproperties.pdfstyle.CAnnotStyle;
import com.compdfkit.tools.common.views.pdfproperties.pdfstyle.CStyleType;
import com.compdfkit.tools.common.views.pdfproperties.pdfstyle.manager.CStyleManager;
import com.compdfkit.tools.common.views.pdfview.CPDFPageIndicatorView;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl.COnSaveCallback;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl.COnSaveError;
import com.compdfkit.tools.common.views.pdfview.CPreviewMode;
import com.compdfkit.ui.attribute.CPDFEditorTextAttr;
import com.compdfkit.ui.proxy.CPDFBaseAnnotImpl;
import com.compdfkit.ui.proxy.form.CPDFSignatureWidgetImpl;
import com.compdfkit.ui.reader.CPDFPageView;
import com.compdfkit.ui.reader.CPDFReaderView;
import com.compdfkit.ui.reader.CPDFReaderView.ViewMode;
import com.compdfkit.ui.textsearch.ITextSearcher;
import com.compdfkitpdf.reactnative.BuildConfig;
import com.compdfkitpdf.reactnative.util.CPDFAttrUtils;
import com.compdfkitpdf.reactnative.util.CPDFBookmarkUtil;
import com.compdfkitpdf.reactnative.util.CPDFDocumentInfoUtil;
import com.compdfkitpdf.reactnative.util.CPDFDocumentUtil;
import com.compdfkitpdf.reactnative.util.CPDFEditAreaUtil;
import com.compdfkitpdf.reactnative.util.CPDFEditAreaUtil.CPDFFlutterCreateAreaCallback;
import com.compdfkitpdf.reactnative.util.CPDFEnumConvertUtil;
import com.compdfkitpdf.reactnative.util.CPDFOutlineUtil;
import com.compdfkitpdf.reactnative.util.CPDFPageUtil;
import com.compdfkitpdf.reactnative.util.CPDFSearchUtil;
import com.compdfkitpdf.reactnative.view.CPDFView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
          readerView.reloadPages2();
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
    }

    @Override
    public void onViewDetachedFromWindow(View v) {
      CPDFView documentView = (CPDFView) v;
      try {
        CPDFReaderView readerView = documentView.getCPDFReaderView();
        readerView.getContextMenuShowListener()
          .dismissContextMenu();
      } catch (Exception e) {
        e.printStackTrace();
      }
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

  @ReactProp(name = "pageIndex")
  public void setPageIndex(CPDFView pdfView, int pageIndex) {
    pdfView.setPageIndex(pageIndex);
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
    String xfdf = CPDFDocumentUtil.getImportFilePath(reactContext, xfdfFilePath);
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

  public void setDisplayPageIndex(int tag, int pageIndex, ReadableArray array) {
    CPDFView pdfView = mDocumentViews.get(tag);

    List<RectF> androidRectList = new ArrayList<>();
    if (array != null && array.size() > 0) {
      for (int i = 0; i < array.size(); i++) {
        ReadableMap item = array.getMap(i);
        if (item == null) {
          continue;
        }
        float rectLeft = ((Number) item.getDouble("left")).floatValue();
        float rectTop = ((Number) item.getDouble("top")).floatValue();
        float rectRight = ((Number) item.getDouble("right")).floatValue();
        float rectBottom = ((Number) item.getDouble("bottom")).floatValue();
        RectF pageRectF = new RectF(rectLeft, rectTop, rectRight, rectBottom);
        androidRectList.add(convertScreenRectF(pdfView.getCPDFReaderView(), pageIndex, pageRectF));
      }
      RectF[] rectArray = androidRectList.toArray(new RectF[0]);
      pdfView.getCPDFReaderView().setDisplayPageIndex(pageIndex, rectArray);
    } else {
      pdfView.getCPDFReaderView().setDisplayPageIndex(pageIndex);
    }
  }

  private RectF convertScreenRectF(CPDFReaderView readerView, int pageIndex, RectF pageRectF) {
    CPDFPage page = readerView.getPDFDocument().pageAtIndex(pageIndex);
    RectF screenPageRect = readerView.getPageSize(pageIndex);
    return page.convertRectFromPage(readerView.isCropMode(), screenPageRect.width(),
      screenPageRect.height(), pageRectF);
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

  public void setWidgetBackgroundColor(int tag, String color) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.documentFragment.pdfView.setBackgroundColor(Color.parseColor(color));
  }

  public void setReadBackgroundColor(int tag, String color, String displayMode) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setReadBackgroundColor(Color.parseColor(color));
    CPDFViewCtrl cpdfViewCtrl = pdfView.documentFragment.pdfView;
    switch (displayMode) {
      case "light":
        cpdfViewCtrl.setBackgroundColor(ContextCompat.getColor(reactContext,
          com.compdfkit.tools.R.color.tools_pdf_view_ctrl_background_color));
        break;
      case "dark":
        cpdfViewCtrl.setBackgroundColor(ContextCompat.getColor(reactContext,
          com.compdfkit.tools.R.color.tools_pdf_view_ctrl_background_color_dark));
        break;
      case "sepia":
        cpdfViewCtrl.setBackgroundColor(ContextCompat.getColor(reactContext,
          com.compdfkit.tools.R.color.tools_pdf_view_ctrl_background_color_sepia));
        break;
      case "reseda":
        cpdfViewCtrl.setBackgroundColor(ContextCompat.getColor(reactContext,
          com.compdfkit.tools.R.color.tools_pdf_view_ctrl_background_color_reseda));
        break;
    }
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
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    readerView.setVerticalMode(isVerticalMode);
    pdfView.documentFragment.pdfView.updateScaleForLayout();
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
    pdfView.documentFragment.pdfView.updateScaleForLayout();
  }

  public boolean isContinueMode(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().isContinueMode();
  }

  public void setDoublePageMode(int tag, boolean isDoublePageMode) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setDoublePageMode(isDoublePageMode);
    pdfView.getCPDFReaderView().setCoverPageMode(false);
    pdfView.documentFragment.pdfView.updateScaleForLayout();
  }

  public boolean isDoublePageMode(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().isDoublePageMode();
  }

  public void setCoverPageMode(int tag, boolean isCoverPageMode) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.getCPDFReaderView().setDoublePageMode(isCoverPageMode);
    pdfView.getCPDFReaderView().setCoverPageMode(isCoverPageMode);
    pdfView.documentFragment.pdfView.updateScaleForLayout();
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
    pdfView.documentFragment.showPageEdit(false, editMode);
  }

  public void showBotaView(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.documentFragment.showBOTA();
  }

  public void showAddWatermarkView(int tag, @Nullable CPDFWatermarkConfig config) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFWatermarkConfig defaultConfig =
      pdfView.documentFragment.pdfView.getCPDFConfiguration().globalConfig.watermark;
    if (config == null) {
      config = defaultConfig;
    }
    pdfView.documentFragment.showAddWatermarkDialog(config);
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

  public void open(int tag, String filePath, String password, int pageIndex, Promise promise) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFViewCtrl viewCtrl = pdfView.documentFragment.pdfView;
    if (filePath.startsWith(ASSETS_SCHEME)) {
      String assetsPath = filePath.replace(ASSETS_SCHEME + "/", "");
      String[] strs = filePath.split("/");
      String fileName = strs[strs.length - 1];
      String samplePDFPath = CFileUtils.getAssetsTempFile(reactContext, assetsPath, fileName);
      viewCtrl.openPDF(samplePDFPath, password, pageIndex, () -> {
        promise.resolve(true);
      });
    } else if (filePath.startsWith(CONTENT_SCHEME) || filePath.startsWith(FILE_SCHEME)) {
      Uri uri = Uri.parse(filePath);
      viewCtrl.openPDF(uri, password, pageIndex, () -> {
        promise.resolve(true);
      });
    } else {
      viewCtrl.openPDF(filePath, password, pageIndex, () -> {
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
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFDocument document = pdfView.getCPDFReaderView().getPDFDocument();
    pdfView.documentFragment.pdfView.exitEditMode();
    CThreadPoolUtils.getInstance().executeIO(() -> {
      try {
        boolean saveResult;
        if (savePath.startsWith(CONTENT_SCHEME)) {
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
        e.printStackTrace();
        result.reject("SAVE_FAIL",
          "The current saved directory is: " + savePath
            + ", please make sure you have write permission to this directory");
      }
    });
  }

  public void print(int tag) {
    if (reactContext.getCurrentActivity() != null) {
      CPDFView pdfView = mDocumentViews.get(tag);
      CPDFReaderView readerView = pdfView.getCPDFReaderView();
      CPDFPrintUtils.printCurrentDocument(reactContext.getCurrentActivity(),
        readerView.getPDFDocument());
    }
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

  public boolean importWidgets(int tag, String xfdfFilePath) throws Exception {
    String xfdf = CPDFDocumentUtil.getImportFilePath(reactContext, xfdfFilePath);
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.documentFragment.pdfView.getCPdfReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    File file = new File(xfdf);
    if (!file.exists()) {
      throw new Exception("File not found: " + xfdf);
    }
    File cacheFile = new File(reactContext.getCacheDir(),
      CFileUtils.CACHE_FOLDER + File.separator + "importWidgetsCache/"
        + CFileUtils.getFileNameNoExtension(document.getFileName()));
    cacheFile.mkdirs();
    boolean importResult = document.importWidgets(xfdf,
      cacheFile.getAbsolutePath());
    readerView.reloadPages();
    return importResult;
  }

  public String exportWidgets(int tag) throws Exception {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.documentFragment.pdfView.getCPdfReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    // export file directory
    File dirFile = new File(reactContext.getFilesDir(), "compdfkit/widgets/export/");
    dirFile.mkdirs();
    // export file name
    String fileName = CFileUtils.getFileNameNoExtension(document.getFileName());
    // export file cache file
    File cacheFile = new File(reactContext.getCacheDir(),
      CFileUtils.CACHE_FOLDER + File.separator + "exportWidgetsCache/" + fileName);
    cacheFile.mkdirs();
    // export file
    File saveFile = new File(dirFile, fileName + ".xfdf");
    saveFile = CFileUtils.renameNameSuffix(saveFile);
    boolean exportResult = document.exportWidgets(saveFile.getAbsolutePath(),
      cacheFile.getAbsolutePath());
    if (exportResult) {
      return saveFile.getAbsolutePath();
    } else {
      return null;
    }
  }

  public void flattenAllPages(int tag, String savePath, boolean fontSubset, Promise promise) {
    try {
      CPDFView pdfView = mDocumentViews.get(tag);
      CPDFReaderView readerView = pdfView.getCPDFReaderView();
      CPDFDocument document = readerView.getPDFDocument();
      boolean success = document.flattenAllPages(PDFFlattenOption.FLAT_NORMALDISPLAY);
      if (!success) {
        promise.reject("FLATTEN_FAIL", "Flatten all pages failed.");
        return;
      }
      boolean saveResult;
      if (savePath.startsWith(CONTENT_SCHEME)) {
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

  public void reloadPages(int tag) {
    CPDFView cpdfView = mDocumentViews.get(tag);
    cpdfView.getCPDFReaderView().reloadPages();
  }

  public void reloadPages2(int tag) {
    CPDFView cpdfView = mDocumentViews.get(tag);
    cpdfView.getCPDFReaderView().reloadPages2();
  }

  public void importDocument(int tag, String filePath, String password, int[] pages,
    int insertPosition, Promise promise) {
    try {
      CPDFView cpdfView = mDocumentViews.get(tag);
      CPDFDocument document = cpdfView.getCPDFReaderView().getPDFDocument();

      CPDFDocument importDocument = new CPDFDocument(reactContext);
      String importDocumentPath = CPDFDocumentUtil.getImportFilePath(reactContext, filePath);
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
      cpdfView.getCPDFReaderView().reloadPages();
      updatePageIndicatorView(document, cpdfView.documentFragment.pdfView);
    } catch (Exception e) {
      promise.reject("IMPORT_DOCUMENT_FAIL", "error:" + e.getMessage());
    }
  }


  public void splitDocumentPage(int tag, String savePath, int[] pages, Promise promise) {
    try {
      CPDFView cpdfView = mDocumentViews.get(tag);
      CPDFDocument document = cpdfView.getCPDFReaderView().getPDFDocument();
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
          if (savePath.startsWith(CONTENT_SCHEME)) {
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
      e.printStackTrace();
      promise.reject("SPLIT_DOCUMENT_FAIL", "error:" + e.getMessage());
    }
  }

  public String getDocumentPath(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    if (!TextUtils.isEmpty(document.getAbsolutePath())) {
      return document.getAbsolutePath();
    }
    return document.getUri().toString();
  }

  public WritableArray getAnnotations(int tag, int pageIndex) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFPageUtil rcpdfPage = pdfView.getCPDFPageUtil();
    return rcpdfPage.getAnnotations(pageIndex);
  }

  public WritableArray getForms(int tag, int pageIndex) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFPageUtil rcpdfPage = pdfView.getCPDFPageUtil();
    return rcpdfPage.getWidgets(pageIndex);
  }

  public void setTextWidgetText(int tag, int pageIndex, String uuid, String text) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFPageUtil rcpdfPage = pdfView.getCPDFPageUtil();
    rcpdfPage.setTextWidgetText(pageIndex, uuid, text);
  }

  public void updateAp(int tag, int pageIndex, String uuid) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFPageUtil rcpdfPage = pdfView.getCPDFPageUtil();
    CPDFPageView pageView = (CPDFPageView) pdfView.getCPDFReaderView().getChild(pageIndex);
    if (pageView == null) {
      return;
    }
    CPDFAnnotation annotation = rcpdfPage.getAnnotation(pageIndex, uuid);
    CPDFBaseAnnotImpl impl = pageView.getAnnotImpl(annotation);
    if (impl == null) {
      rcpdfPage.updateAp(pageIndex, uuid);
      return;
    }
    if (impl instanceof CPDFSignatureWidgetImpl) {
      ((CPDFSignatureWidgetImpl) impl).refresh();
    } else {
      rcpdfPage.updateAp(pageIndex, uuid);
      impl.onAnnotAttrChange();
    }
    pageView.invalidate();
  }

  public void setWidgetIsChecked(int tag, int pageIndex, String uuid, boolean checked) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFPageUtil rcpdfPage = pdfView.getCPDFPageUtil();
    rcpdfPage.setChecked(pageIndex, uuid, checked);
  }

  public boolean addWidgetImageSignature(int tag, int pageIndex, String uuid, String imagePath) {
    CPDFView cpdfView = mDocumentViews.get(tag);
    return cpdfView.getCPDFPageUtil().addWidgetImageSignature(pageIndex, uuid, imagePath);
  }

  public boolean removeAnnotation(int tag, int pageIndex, String uuid) {
    CPDFView cpdfView = mDocumentViews.get(tag);
    CPDFPageUtil pageUtil = cpdfView.getCPDFPageUtil();
    CPDFAnnotation annotation = pageUtil.getAnnotation(pageIndex, uuid);
    if (annotation == null) {
      return false;
    }
    CPDFPageView pageView = (CPDFPageView) cpdfView.getCPDFReaderView().getChild(pageIndex);
    if (pageView != null) {
      CPDFBaseAnnotImpl baseAnnot = pageView.getAnnotImpl(annotation);
      pageView.deleteAnnotation(baseAnnot);
      return true;
    } else {
      return pageUtil.deleteAnnotation(pageIndex, uuid);
    }
  }

  public boolean removeWidget(int tag, int pageIndex, String uuid) {
    return removeAnnotation(tag, pageIndex, uuid);
  }

  public boolean insertBlankPage(int tag, int pageIndex, int width, int height) {
    CPDFView cpdfView = mDocumentViews.get(tag);
    CPDFDocument document = cpdfView.getCPDFReaderView().getPDFDocument();

    CPDFPage page = document.insertBlankPage(pageIndex, width, height);
    boolean isValid = page != null && page.isValid();
    if (isValid) {
      CPDFReaderView readerView = cpdfView.getCPDFReaderView();
      readerView.reloadPages();
      updatePageIndicatorView(document, cpdfView.documentFragment.pdfView);
    }
    return isValid;
  }

  public boolean insertImagePage(int tag, int pageIndex, String imagePath, float width,
    float height) {
    CPDFView cpdfView = mDocumentViews.get(tag);
    CPDFDocument document = cpdfView.getCPDFReaderView().getPDFDocument();

    CPDFPage page = null;
    if (imagePath.startsWith(ASSETS_SCHEME)) {
      Log.d("ComPDFKit", "insertImagePage from assets");
      String assetsPath = imagePath.replace(ASSETS_SCHEME + "/", "");
      String[] strs = imagePath.split("/");
      String fileName = strs[strs.length - 1];
      String samplePDFPath = CFileUtils.getAssetsTempFile(reactContext, assetsPath, fileName);

      page = document.insertPageWithImagePath(pageIndex, width, height,
        samplePDFPath, PDFDocumentImageMode.PDFDocumentImageModeScaleAspectFit);
    } else if (imagePath.startsWith(CONTENT_SCHEME) || imagePath.startsWith(FILE_SCHEME)) {

      Uri uri = Uri.parse(imagePath);
      Log.d("ComPDFKit", "insertImagePage from Uri");

      try {
        ParcelFileDescriptor fileDescriptor = reactContext.getContentResolver()
          .openFileDescriptor(uri, "r");
        if (fileDescriptor != null) {
          page = document.insertPageWithImage(pageIndex, width, height,
            fileDescriptor.getFd(), PDFDocumentImageMode.PDFDocumentImageModeScaleAspectFit);
        }
        if (fileDescriptor != null) {
          fileDescriptor.close();
        }
      } catch (Exception e) {
        Log.e("ComPDFKit", e.getMessage());
      }
    } else {
      Log.d("ComPDFKit", "insertImagePage from path");
      page = document.insertPageWithImagePath(pageIndex, width, height,
        imagePath, PDFDocumentImageMode.PDFDocumentImageModeScaleAspectFit);
    }
    boolean isValid = page != null && page.isValid();
    if (isValid) {
      updatePageIndicatorView(document, cpdfView.documentFragment.pdfView);
    }
    return isValid;
  }

  public boolean removePages(int tag, int[] pages) {
    CPDFView cpdfView = mDocumentViews.get(tag);
    CPDFDocument document = cpdfView.getCPDFReaderView().getPDFDocument();
    return document.removePages(pages);
  }

  public boolean movePage(int tag, int fromIndex, int toIndex) {
    CPDFView cpdfView = mDocumentViews.get(tag);
    CPDFDocument document = cpdfView.getCPDFReaderView().getPDFDocument();
    return document.movePage(fromIndex, toIndex);
  }

  public void setAnnotationMode(int tag, String mode) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CAnnotationType type;
    try {
      type = switch (mode) {
        case "note" -> CAnnotationType.TEXT;
        case "pictures" -> CAnnotationType.PIC;
        default -> CAnnotationType.valueOf(mode.toUpperCase());
      };
    } catch (Exception e) {
      type = CAnnotationType.UNKNOWN;
    }
    pdfView.documentFragment.annotationToolbar.switchAnnotationType(type);
  }

  public String getAnnotationMode(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CAnnotationType annotationType = pdfView.documentFragment.annotationToolbar.toolListAdapter.getCurrentAnnotType();
    return switch (annotationType) {
      case TEXT -> "note";
      case PIC -> "pictures";
      default -> annotationType.name().toLowerCase();
    };
  }

  public boolean annotationCanUndo(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFUndoManager manager = readerView.getUndoManager();
    return manager.canUndo();
  }

  public boolean annotationCanRedo(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFUndoManager manager = readerView.getUndoManager();
    return manager.canRedo();
  }

  public void annotationUndo(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFUndoManager manager = readerView.getUndoManager();
    try {
      if (manager.canUndo()) {
        manager.undo();
      }
    } catch (Exception e) {

    }
  }

  public void annotationRedo(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFUndoManager manager = readerView.getUndoManager();
    try {
      if (manager.canRedo()) {
        manager.redo();
      }
    } catch (Exception e) {

    }
  }

  private void updatePageIndicatorView(CPDFDocument document, CPDFViewCtrl pdfView) {
    if (pdfView != null) {
      CPDFPageIndicatorView indicatorView = pdfView.indicatorView;
      indicatorView.setTotalPage(document.getPageCount());
      indicatorView.setCurrentPageIndex(pdfView.getCPdfReaderView().getPageNum());
      pdfView.slideBar.setPageCount(document.getPageCount());
      pdfView.slideBar.requestLayout();
    }
  }

  public WritableArray searchText(int tag, String keywords, int searchOptions) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    ITextSearcher iTextSearcher = readerView.getTextSearcher();
    return CPDFSearchUtil.search(readerView.getPDFDocument(), iTextSearcher, keywords,
      searchOptions);
  }

  public void clearSearchResult(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFSearchUtil.clearSearch(reactContext, pdfView.documentFragment.pdfView,
      readerView.getPDFDocument());
  }

  public void selectionText(int tag, int pageIndex, int textRangeIndex) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFSearchUtil.selection(reactContext, pdfView.documentFragment.pdfView,
      readerView.getPDFDocument(), pageIndex, textRangeIndex);
  }

  public String getSearchText(int tag, int pageIndex, int location, int length) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    return CPDFSearchUtil.getText(readerView.getPDFDocument(), pageIndex, location, length);
  }

  public WritableMap getPageSize(int tag, int pageIndex) {
    try {
      CPDFView pdfView = mDocumentViews.get(tag);
      CPDFReaderView readerView = pdfView.getCPDFReaderView();
      CPDFDocument document = readerView.getPDFDocument();
      RectF rectF = document.getPageSize(pageIndex);
      WritableMap map = Arguments.createMap();
      map.putDouble("width", rectF.width());
      map.putDouble("height", rectF.height());
      return map;
    } catch (Exception e) {
      return null;
    }
  }

  public void renderPage(int tag, int pageIndex, int width, int height, String backgroundColor,
    boolean drawAnnot, boolean drawForm, String pageCompression, Promise promise) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    CPDFDocumentPageWrapper pageWrapper = new CPDFDocumentPageWrapper(document, pageIndex);
    pageWrapper.setBackgroundColor(Color.parseColor(backgroundColor));
    pageWrapper.setDrawAnnotation(drawAnnot);
    pageWrapper.setDrawForms(drawForm);
    CPDFWrapper wrapper = new CPDFWrapper(pageWrapper);
    wrapper.setSize(width, height);
    Glide.with(document.getContext())
      .asBitmap()
      .load(wrapper)
      .override(width, height)
      .diskCacheStrategy(DiskCacheStrategy.NONE)
      .into(new CustomTarget<Bitmap>() {
        @Override
        public void onResourceReady(@NonNull Bitmap resource,
          @Nullable Transition<? super Bitmap> transition) {
          switch (pageCompression) {
            case "jpeg":
              ByteArrayOutputStream jpegStream = new ByteArrayOutputStream();
              resource.compress(Bitmap.CompressFormat.JPEG, 85, jpegStream);
              byte[] byteArray = jpegStream.toByteArray();
              promise.resolve(Base64.encodeToString(byteArray, Base64.NO_WRAP));
              break;
            case "png":
              ByteArrayOutputStream pngStream = new ByteArrayOutputStream();
              resource.compress(Bitmap.CompressFormat.PNG, 100, pngStream);
              byte[] pngByteArray = pngStream.toByteArray();
              promise.resolve(Base64.encodeToString(pngByteArray, Base64.NO_WRAP));
              break;
          }
          Glide.get(document.getContext()).clearMemory();
        }

        @Override
        public void onLoadCleared(@Nullable Drawable placeholder) {

        }
      });
  }

  public void changeEditType(int tag, int type, Promise promise) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    if (readerView.getViewMode() != ViewMode.PDFEDIT && readerView.getViewMode() != ViewMode.ALL) {
      promise.reject("1002",
        "Current mode is not contentEditor mode, please switch to CPDFViewMode.contentEditor mode first.");
      return;
    }
    CPDFEditManager editManager = readerView.getEditManager();
    if (editManager != null) {
      editManager.changeEditType(type);
      pdfView.documentFragment.editToolBar.updateTypeStatus();
      promise.resolve(true);
    } else {
      promise.reject("1001", "EditManager is null, please check if Edit feature is enabled.");
    }
  }

  public boolean editorCanUndo(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFEditManager editManager = readerView.getEditManager();
    if (editManager != null) {
      return editManager.canUndo();
    } else {
      return false;
    }
  }

  public boolean editorCanRedo(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFEditManager editManager = readerView.getEditManager();
    if (editManager != null) {
      return editManager.canRedo();
    } else {
      return false;
    }
  }

  public boolean editorUndo(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFEditManager editManager = readerView.getEditManager();
    if (editManager == null) {
      return false;
    }
    if (editManager.canUndo()) {
      readerView.onEditUndo();

      pdfView.documentFragment.editToolBar.updateUndoRedo();
      return true;
    }
    return false;
  }

  public boolean editorRedo(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFEditManager editManager = readerView.getEditManager();
    if (editManager == null) {
      return false;
    }
    if (editManager.canRedo()) {
      readerView.onEditRedo();
      pdfView.documentFragment.editToolBar.updateUndoRedo();
      return true;
    }
    return false;
  }


  public void setFormCreationMode(int tag, String formType) {
    CPDFView pdfView = mDocumentViews.get(tag);
    WidgetType type = CPDFConfigurationUtils.getWidgetType(formType);
    pdfView.documentFragment.formToolBar.switchFormMode(type);
  }

  public String getFormCreationMode(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    return switch (readerView.getCurrentFocusedFormType()) {
      case Widget_TextField -> "textField";
      case Widget_CheckBox -> "checkBox";
      case Widget_RadioButton -> "radioButton";
      case Widget_ListBox -> "listBox";
      case Widget_ComboBox -> "comboBox";
      case Widget_PushButton -> "pushButton";
      case Widget_SignatureFields -> "signaturesFields";
      default -> "unknown";
    };
  }

  public void verifyDigitalSignatureStatus(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.documentFragment.verifyDocumentSignStatus();
  }

  public void hideDigitalSignatureView(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.documentFragment.hideDigitalSignStatusView();
  }

  public void clearDisplayRect(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    readerView.setDisplayPageRectangles(null);
    readerView.setShowDisplayPageRect(false);
  }

  public void dismissContextMenu(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    if (readerView.getContextMenuShowListener() != null) {
      readerView.getContextMenuShowListener().dismissContextMenu();
    }
  }

  public void showSearchTextView(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.documentFragment.showTextSearchView();
  }

  public void hideSearchTextView(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    pdfView.documentFragment.hideTextSearchView();
  }

  public void saveCurrentInk(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    readerView.getInkDrawHelper().onSave();
  }

  public void setPageRotation(int tag, int pageIndex, int rotation, Promise promise) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    CPDFPage cpdfPage = document.pageAtIndex(pageIndex);
    if (cpdfPage == null) {
      promise.reject("SET_PAGE_ROTATION_FAIL", "Page not found at index: " + pageIndex);
      return;
    }
    boolean setRotationResult = cpdfPage.setRotation(rotation);
    promise.resolve(setRotationResult);
  }

  public int getPageRotation(int tag, int pageIndex) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    CPDFPage cpdfPage = document.pageAtIndex(pageIndex);
    if (cpdfPage == null) {
      return 0;
    }
    return cpdfPage.getRotation();
  }

  public void setAnnotationsVisible(int tag, boolean visible) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    readerView.setAnnotationsVisible(visible);
  }

  public boolean areAnnotationsVisible(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    return readerView.isAnnotationsVisible();
  }

  public WritableMap getInfo(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    return CPDFDocumentInfoUtil.getDocumentInfo(document);
  }

  public int getMajorVersion(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    return document.getMajorVersion();
  }

  public int getMinorVersion(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    return document.getMinorVersion();
  }

  public WritableMap getPermissionInfo(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    return CPDFDocumentInfoUtil.getPermissionsInfo(document);
  }

  public WritableMap getOutlineRoot(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    return CPDFOutlineUtil.getOutlineMap(document);
  }

  public WritableMap newOutlineRoot(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    return CPDFOutlineUtil.newOutlineRoot(document);
  }


  public boolean addOutline(int tag, String parentUuid, String title, int insertIndex,
    int pageIndex) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    return CPDFOutlineUtil.addOutline(document, parentUuid, title, insertIndex, pageIndex);
  }

  public boolean removeOutline(int tag, String uuid) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    return CPDFOutlineUtil.deleteOutline(document, uuid);
  }

  public boolean updateOutline(int tag, String uuid, String newTitle, int newPageIndex) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    return CPDFOutlineUtil.updateOutline(document, uuid, newTitle, newPageIndex);
  }

  public boolean moveOutline(int tag, String uuid, String newParentUuid, int newIndex) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    return CPDFOutlineUtil.moveTo(document, uuid, newParentUuid, newIndex);
  }

  public WritableArray getBookmarks(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();
    CPDFDocument document = readerView.getPDFDocument();
    return CPDFBookmarkUtil.getBookmarks(document);
  }

  public boolean addBookmark(int tag, String title, int pageIndex) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView != null) {
      CPDFReaderView readerView = pdfView.getCPDFReaderView();
      CPDFDocument document = readerView.getPDFDocument();
      boolean result = CPDFBookmarkUtil.addBookmark(document, title, pageIndex);
      readerView.invalidateAllChildren();
      return result;
    }
    return false;
  }

  public boolean removeBookmark(int tag, int pageIndex) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView != null) {
      CPDFReaderView readerView = pdfView.getCPDFReaderView();
      CPDFDocument document = readerView.getPDFDocument();
      boolean result = document.removeBookmark(pageIndex);
      readerView.invalidateAllChildren();
      return result;
    }
    return false;
  }

  public boolean hasBookmark(int tag, int pageIndex) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView != null) {
      CPDFReaderView readerView = pdfView.getCPDFReaderView();
      CPDFDocument document = readerView.getPDFDocument();
      return document.hasBookmark(pageIndex);
    }
    return false;
  }

  public boolean updateBookmark(int tag, String uuid, String newTitle) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView != null) {
      CPDFReaderView readerView = pdfView.getCPDFReaderView();
      CPDFDocument document = readerView.getPDFDocument();
      boolean result = CPDFBookmarkUtil.updateBookmark(document, uuid, newTitle);
      readerView.invalidateAllChildren();
      return result;
    }
    return false;
  }

  public void showDefaultAnnotationPropertiesView(int tag, String annotType) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CAnnotationType type = CPDFEnumConvertUtil.strongToAnnotationType(annotType);
    pdfView.documentFragment.annotationToolbar.showAnnotStyleDialog(type.getStyleType());
  }

  public void showAnnotationPropertiesView(int tag, ReadableMap annotMap) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();

    int pageIndex = annotMap.getInt("page");
    String uuid = annotMap.getString("uuid");
    CPDFPageUtil pageUtil = pdfView.getCPDFPageUtil();
    pageUtil.setDocument(readerView.getPDFDocument());
    CPDFAnnotation annotation = pageUtil.getAnnotation(pageIndex, uuid);
    if (annotation != null) {
      FragmentManager fragmentManager = pdfView.documentFragment.getParentFragmentManager();
      CPDFPageView pageView = (CPDFPageView) readerView.getChild(pageIndex);
      CPDFBaseAnnotImpl baseAnnot = null;
      if (pageView != null) {
        baseAnnot = pageView.getAnnotImpl(annotation);
      }
      if (baseAnnot != null) {
        CPDFAnnotationManager.showPropertiesDialog(
          fragmentManager, baseAnnot, pageView);
      } else {
        CPDFAnnotationManager.showPropertiesDialog(
          fragmentManager, annotation, pageView);
      }
    }
  }

  public void showEditAreaPropertiesView(int tag, ReadableMap editAreaMap) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();

    int pageIndex = editAreaMap.getInt("page");
    String uuid = editAreaMap.getString("uuid");
    String areaType = editAreaMap.getString("type");
    CPDFDocument document = readerView.getPDFDocument();
    CPDFEditArea editArea = CPDFEditAreaUtil.getEditArea(document, pageIndex, uuid, areaType);
    if (editArea != null) {
      FragmentManager fragmentManager = pdfView.documentFragment.getParentFragmentManager();
      CPDFPageView pageView = (CPDFPageView) readerView.getChild(pageIndex);
      CPDFAnnotationManager.showPropertiesDialog(fragmentManager, editArea, pageView);
    }
  }

  public void prepareNextSignature(int tag, String imagePath) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView == null) {
      return;
    }
    CPDFViewCtrl viewCtrl = pdfView.documentFragment.pdfView;
    CStyleManager styleManager = new CStyleManager(viewCtrl);
    CAnnotStyle style = styleManager.getStyle(CStyleType.ANNOT_SIGNATURE);
    style.setImagePath(imagePath);
    styleManager.updateStyle(style);
  }

  public void prepareNextImage(int tag, String imagePath) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView == null) {
      return;
    }
    CPDFViewCtrl viewCtrl = pdfView.documentFragment.pdfView;
    CStyleManager styleManager = new CStyleManager(viewCtrl);
    CAnnotStyle style = styleManager.getStyle(CStyleType.ANNOT_PIC);
    style.setImagePath(imagePath);
    styleManager.updateStyle(style);
  }

  public void prepareNextStamp(int tag, ReadableMap stampMap) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView == null) {
      return;
    }
    CPDFViewCtrl viewCtrl = pdfView.documentFragment.pdfView;
    String stampType = stampMap.getString("type");
    CStyleManager styleManager = new CStyleManager(viewCtrl);
    CAnnotStyle style = styleManager.getStyle(CStyleType.ANNOT_STAMP);
    if ("image".equals(stampType)) {
      String imagePath = stampMap.getString("imagePath");
      String parseImagePath = com.compdfkitpdf.reactnative.util.CFileUtils.parseFilePath(
        reactContext, imagePath);
      style.setImagePath(parseImagePath);
    } else if ("standard".equals(stampType)) {
      String standardType = stampMap.getString("standardStamp");
      StandardStamp standardStamp = StandardStamp.str2Enum(standardType);
      style.setStandardStamp(standardStamp);
    } else if ("text".equals(stampType)) {
      ReadableMap textStampMap = stampMap.getMap("textStamp");
      String content = textStampMap.getString("content");
      String date = textStampMap.getString("date");
      String shape = textStampMap.getString("shape");
      String color = textStampMap.getString("color");
      TextStampShape textStampShape = CPDFEnumConvertUtil.stringToStampShape(shape);
      TextStampColor textStampColor = CPDFEnumConvertUtil.stringToStampColor(color);
      TextStamp textStamp = new TextStamp(content, date, textStampShape.id, textStampColor.id);
      style.setTextStamp(textStamp);
    }
    styleManager.updateStyle(style);
  }

  public WritableMap fetchDefaultAnnotationStyle(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView == null) {
      return Arguments.createMap();
    }
    HashMap<String, Object> map = CPDFAttrUtils.getDefaultAnnotAttr(
      pdfView.documentFragment.pdfView);
    return Arguments.makeNativeMap(map);
  }

  public void updateDefaultAnnotationStyle(int tag, ReadableMap styleMap) {
    CPDFView pdfView = mDocumentViews.get(tag);

    if (pdfView == null) {
      return;
    }

    Map<String, Object> map = styleMap.toHashMap();
    String annotType = styleMap.getString("type");
    if (TextUtils.isEmpty(annotType)) {
      return;
    }
    try {

      CPDFAttrUtils.setDefaultAnnotAttr(pdfView.documentFragment.pdfView, annotType, map);
      pdfView.documentFragment.annotationToolbar.updateItemColor();
    } catch (Exception e) {
      e.printStackTrace();
    }

  }

  public ReadableMap fetchDefaultWidgetStyle(int tag) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView == null) {
      return Arguments.createMap();
    }
    HashMap<String, Object> map = CPDFAttrUtils.getDefaultWidgetAttr(
      pdfView.documentFragment.pdfView);
    return Arguments.makeNativeMap(map);
  }

  public void updateDefaultWidgetStyle(int tag, ReadableMap styleMap) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView == null) {
      return;
    }
    Map<String, Object> map = styleMap.toHashMap();
    String annotType = styleMap.getString("type");
    if (TextUtils.isEmpty(annotType)) {
      return;
    }
    CPDFAttrUtils.setDefaultAnnotAttr(pdfView.documentFragment.pdfView, annotType, map);
  }

  public void removeEditArea(int tag, int pageIndex, String uuid, String type) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView != null) {
      CPDFReaderView readerView = pdfView.getCPDFReaderView();
      CPDFDocument document = readerView.getPDFDocument();
      CPDFEditAreaUtil.removeEditArea(document, pageIndex, uuid, type);
      readerView.getContextMenuShowListener().dismissContextMenu();
    }
  }

  public boolean createNewTextArea(int tag, ReadableMap textAreaMap) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView != null) {
      CPDFReaderView readerView = pdfView.getCPDFReaderView();
      HashMap<String, Object> map = textAreaMap.toHashMap();

      int pageIndex = textAreaMap.getInt("page_index");

      boolean isEditMode = readerView.getViewMode() == ViewMode.PDFEDIT;
      map.put("isEditMode", isEditMode);

      CPDFEditorTextAttr normalEditorAttr = readerView.getReaderAttribute().getAnnotAttribute()
        .getEditorTextAttr();
      CPDFDocument document = readerView.getPDFDocument();
      CPDFEditArea editArea = CPDFEditAreaUtil.createNewTextArea(document, map, normalEditorAttr);

      CPDFPageView pageView = (CPDFPageView) readerView.getChild(pageIndex);
      if (pageView != null) {
        ViewMode viewMode = readerView.getViewMode();
        if (viewMode != ViewMode.PDFEDIT) {
          pageView.endEdit();
        }
        pageView.onUpdateUI(pageIndex);
      }

      return editArea != null && editArea.isValid();
    } else {
      return false;
    }
  }

  public void createNewImageArea(int tag, ReadableMap imageAreaMap, Promise promise) {
    CPDFView pdfView = mDocumentViews.get(tag);
    if (pdfView != null) {
      CPDFReaderView readerView = pdfView.getCPDFReaderView();
      HashMap<String, Object> map = imageAreaMap.toHashMap();

      int pageIndex = imageAreaMap.getInt("page_index");

      boolean isEditMode = readerView.getViewMode() == ViewMode.PDFEDIT;
      map.put("isEditMode", isEditMode);

      CPDFDocument document = readerView.getPDFDocument();
      CPDFEditAreaUtil.createNewImageArea(document, map, editArea -> {
        CPDFPageView pageView = (CPDFPageView) readerView.getChild(pageIndex);
        if (pageView != null) {
          ViewMode viewMode = readerView.getViewMode();
          if (viewMode != ViewMode.PDFEDIT) {
            pageView.endEdit();
          }
          pageView.onUpdateUI(pageIndex);
        }
        promise.resolve(editArea != null && editArea.isValid());
      });
    }
  }

  public void updateAnnotation(int tag, ReadableMap annotMap, Promise promise) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();

    int pageIndex = annotMap.getInt("page");
    String uuid = annotMap.getString("uuid");
    CPDFPageUtil pageUtil = pdfView.getCPDFPageUtil();
    pageUtil.setDocument(readerView.getPDFDocument());

    CPDFAnnotation annotation = pageUtil.getAnnotation(pageIndex, uuid);
    if (annotation == null || !annotation.isValid()) {
      promise.reject("UPDATE_ANNOTATION_FAIL", "not found this annotation");
      return;
    }
    try {
      pageUtil.updateAnnotation(annotation, annotMap);
      CPDFPageView pageView = (CPDFPageView) readerView.getChild(pageIndex);
      if (pageView != null) {
        CPDFBaseAnnotImpl annotImpl = pageView.getAnnotImpl(annotation);
        if (annotImpl != null) {
          annotImpl.onAnnotAttrChange();
          pageView.invalidate();
        }else {
          pageView.addAnnotation(annotation, false);
          pageView.invalidate();
        }
      }
      promise.resolve(true);
    } catch (Exception e) {
      promise.reject("UPDATE_ANNOTATION_FAIL", e.getMessage());
    }

  }

  public void updateWidget(int tag, ReadableMap widgetMap, Promise promise) {
    CPDFView pdfView = mDocumentViews.get(tag);
    CPDFReaderView readerView = pdfView.getCPDFReaderView();

    int pageIndex = widgetMap.getInt("page");
    String uuid = widgetMap.getString("uuid");
    CPDFPageUtil pageUtil = pdfView.getCPDFPageUtil();
    pageUtil.setDocument(readerView.getPDFDocument());

    CPDFAnnotation annotation = pageUtil.getAnnotation(pageIndex, uuid);
    if (annotation == null || !annotation.isValid()) {
      promise.reject("UPDATE_WIDGET_FAIL", "not found this widget");
      return;
    }
    try {
      pageUtil.updateWidget(annotation, widgetMap);
      CPDFPageView pageView = (CPDFPageView) readerView.getChild(pageIndex);
      if (pageView != null) {
        CPDFBaseAnnotImpl annotImpl = pageView.getAnnotImpl(annotation);
        if (annotImpl != null) {
          annotImpl.onAnnotAttrChange();
          pageView.invalidate();
        }
      }
      promise.resolve(true);
    } catch (Exception e) {
      promise.reject("UPDATE_ANNOTATION_FAIL", e.getMessage());
    }
  }

  public void addAnnotations(int tag, ReadableArray annotationsArray) {
      CPDFView pdfView = mDocumentViews.get(tag);
      CPDFReaderView readerView = pdfView.getCPDFReaderView();
      CPDFPageUtil pageUtil = pdfView.getCPDFPageUtil();
      pageUtil.setDocument(readerView.getPDFDocument());
      pageUtil.addAnnotations(readerView, annotationsArray);
  }

  public void addWidgets(int tag, ReadableArray widgetsArray) {
      CPDFView pdfView = mDocumentViews.get(tag);
      CPDFReaderView readerView = pdfView.getCPDFReaderView();
      CPDFPageUtil pageUtil = pdfView.getCPDFPageUtil();
      pageUtil.setDocument(readerView.getPDFDocument());
      pageUtil.addWidgets(readerView, widgetsArray);
  }


}
