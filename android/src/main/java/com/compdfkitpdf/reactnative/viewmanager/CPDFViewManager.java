/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.viewmanager;


import android.app.Activity;

import android.net.Uri;
import android.util.Log;
import android.util.SparseArray;
import android.view.View;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;

import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.tools.common.pdf.CPDFConfigurationUtils;
import com.compdfkit.tools.common.pdf.config.CPDFConfiguration;
import com.compdfkit.tools.common.utils.CFileUtils;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl.COnSaveCallback;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl.COnSaveError;
import com.compdfkit.ui.reader.CPDFReaderView;
import com.compdfkitpdf.reactnative.util.CPDFDocumentUtil;
import com.compdfkitpdf.reactnative.view.CPDFView;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
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
      }catch (Exception e){
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
    Log.d(TAG, "CPDFViewManager-setPassword(password: " + password + ")");
    pdfView.setPassword(password);
  }

  @ReactProp(name = "configuration")
  public void setConfiguration(CPDFView pdfView, String configurationJson) {
    Log.d(TAG, "CPDFViewManager-setConfiguration()");
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

  public boolean removeAllAnnotations(int tag){
    try {
      CPDFView pdfView = mDocumentViews.get(tag);
      if (pdfView != null) {
        CPDFReaderView readerView = pdfView.documentFragment.pdfView.getCPdfReaderView();
        boolean result = readerView.getPDFDocument().removeAllAnnotations();
        if (result){
          readerView.invalidateAllChildren();
        }
        return result;
      }
      return false;
    }catch (Exception e){
      return false;
    }
  }

  public boolean importAnnotations(int tag, String xfdfFilePath) throws Exception{
    String xfdf = CPDFDocumentUtil.getImportAnnotationPath(reactContext, xfdfFilePath);
    Log.i("ComPDFKitRN", "xfdf:" + xfdf);
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

  public boolean hasChange(int tag){
    CPDFView pdfView = mDocumentViews.get(tag);
    return pdfView.getCPDFReaderView().getPDFDocument().hasChanges();
  }

}
