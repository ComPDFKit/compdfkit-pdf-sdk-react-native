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

import com.compdfkit.tools.common.pdf.CPDFConfigurationUtils;
import com.compdfkit.tools.common.pdf.config.CPDFConfiguration;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl.COnSaveCallback;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl.COnSaveError;
import com.compdfkitpdf.reactnative.view.CPDFView;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
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
      Log.d(TAG, "add to map: " + v.getId());
      mDocumentViews.put(v.getId(), documentView);
    }

    @Override
    public void onViewDetachedFromWindow(View v) {
      Log.d(TAG, "remove from map: " + v.getId());
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

  @Override
  public boolean needsCustomLayoutForChildren() {
    return true;
  }

}
