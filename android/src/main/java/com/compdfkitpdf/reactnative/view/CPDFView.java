/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.view;

import android.content.Context;
import android.graphics.Rect;
import android.net.Uri;
import android.text.TextUtils;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.FrameLayout;
import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentManager;
import com.compdfkit.tools.common.pdf.CPDFDocumentFragment;
import com.compdfkit.tools.common.pdf.config.CPDFConfiguration;
import com.compdfkitpdf.reactnative.util.CPDFDocumentUtil;
import com.facebook.react.uimanager.ThemedReactContext;


public class CPDFView extends FrameLayout {

  private boolean isPasswordSet = false;

  public CPDFDocumentFragment documentFragment;

  private FragmentManager fragmentManager;

  public CPDFView(@NonNull Context context) {
    super(context);
  }

  private String document;

  private String password;

  private CPDFConfiguration configuration;

  public void setup(ThemedReactContext reactContext, FragmentManager fragmentManager) {
    this.fragmentManager = fragmentManager;
    int width = ViewGroup.LayoutParams.MATCH_PARENT;
    int height = ViewGroup.LayoutParams.MATCH_PARENT;
    ViewGroup.LayoutParams params = new ViewGroup.LayoutParams(width, height);
    setLayoutParams(params);
  }

  public void setDocument(String document) {
    if (document.startsWith(CPDFDocumentUtil.ASSETS_SCHEME)) {
      this.document = CPDFDocumentUtil.getAssetsDocument(getContext(), document);
    } else if (document.startsWith(CPDFDocumentUtil.CONTENT_SCHEME)) {
      this.document = document;
    } else if (document.startsWith(CPDFDocumentUtil.FILE_SCHEME)) {
      Uri uri = Uri.parse(document);
      this.document = uri.toString();
    } else {
      this.document = document;
    }
    initDocumentFragment();
  }

  public void setPassword(String password) {
    this.password = password;
    isPasswordSet = true;
    initDocumentFragment();
  }

  public void setConfiguration(CPDFConfiguration configuration) {
    this.configuration = configuration;
    initDocumentFragment();
  }

  private void initDocumentFragment() {
    if (TextUtils.isEmpty(document) || configuration == null || !isPasswordSet) {
      return;
    }
    if (documentFragment == null) {
      if (document.startsWith(CPDFDocumentUtil.CONTENT_SCHEME) ||
        document.startsWith(CPDFDocumentUtil.FILE_SCHEME)) {
        documentFragment = CPDFDocumentFragment.newInstance(Uri.parse(document), password,
          configuration);
      } else {
        documentFragment = CPDFDocumentFragment.newInstance(document, password, configuration);
      }
      prepareFragment(documentFragment, true);
    }
  }

  private void prepareFragment(CPDFDocumentFragment documentFragment, boolean attachFragment) {
    if (attachFragment) {
      fragmentManager.beginTransaction()
        .add(documentFragment, "CPDFViewRN")
        .commitNow();
      View fragmentView = documentFragment.getView();
      addView(fragmentView, ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT);
    }
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    getViewTreeObserver().addOnGlobalLayoutListener(mOnGlobalLayoutListener);
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    getViewTreeObserver().removeOnGlobalLayoutListener(mOnGlobalLayoutListener);
  }

  private boolean mShouldHandleKeyboard = false;

  private final ViewTreeObserver.OnGlobalLayoutListener mOnGlobalLayoutListener = () -> {
    Rect r = new Rect();
    getWindowVisibleDisplayFrame(r);
    int screenHeight = getRootView().getHeight();

    // r.bottom is the position above soft keypad or device button.
    // if keypad is shown, the r.bottom is smaller than that before.
    int keypadHeight = screenHeight - r.bottom;

    if (keypadHeight
      > screenHeight * 0.15) { // 0.15 ratio is perhaps enough to determine keypad height.
      // keyboard is opened
      mShouldHandleKeyboard = true;
    } else {
      // keyboard is closed
      if (mShouldHandleKeyboard) {
        mShouldHandleKeyboard = false;
        requestLayout();
      }
    }
  };

  private final Runnable mLayoutRunnable = () -> {
    measure(
      MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
      MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
    layout(getLeft(), getTop(), getRight(), getBottom());
  };


  @Override
  public void requestLayout() {
    super.requestLayout();
    post(mLayoutRunnable);
  }
}
