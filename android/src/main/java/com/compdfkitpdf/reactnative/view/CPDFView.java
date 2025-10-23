/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
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
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.FrameLayout;
import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentManager;
import com.compdfkit.core.edit.CPDFEditManager;
import com.compdfkit.core.edit.OnEditStatusChangeListener;
import com.compdfkit.tools.common.pdf.CPDFDocumentFragment;
import com.compdfkit.tools.common.pdf.config.CPDFConfiguration;
import com.compdfkit.tools.common.views.pdfview.CPDFIReaderViewCallback;
import com.compdfkit.ui.reader.CPDFReaderView;
import com.compdfkitpdf.reactnative.util.CPDFDocumentUtil;
import com.compdfkitpdf.reactnative.util.CPDFPageUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import java.util.HashMap;
import java.util.Map;


public class CPDFView extends FrameLayout {

  private boolean isPasswordSet = false;

  public CPDFDocumentFragment documentFragment;

  private FragmentManager fragmentManager;

  public CPDFView(@NonNull Context context) {
    super(context);
    setClickable(true);
    setFocusableInTouchMode(true);
  }

  private String document;

  private String password;

  private CPDFConfiguration configuration;

  private ThemedReactContext themedReactContext;

  private CPDFPageUtil pageUtil = new CPDFPageUtil();

  public void setup(ThemedReactContext reactContext, FragmentManager fragmentManager) {
    this.themedReactContext = reactContext;
    this.fragmentManager = fragmentManager;
    int width = ViewGroup.LayoutParams.MATCH_PARENT;
    int height = ViewGroup.LayoutParams.MATCH_PARENT;
    ViewGroup.LayoutParams params = new ViewGroup.LayoutParams(width, height);
    setLayoutParams(params);
    setFocusable(true);
    setFocusableInTouchMode(true);
    post(() -> {
      requestFocus();
      requestFocusFromTouch();
    });
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
        .add(documentFragment, "documentFragment")
        .commitNowAllowingStateLoss();
      View fragmentView = documentFragment.getView();
      addView(fragmentView, ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT);
      documentFragment.setInitListener((pdfView) -> {
        try {
          documentFragment.pdfView.indicatorView.setRNMeasureLayout(true);
          WritableMap params = Arguments.createMap();
          params.putNull("onDocumentIsReady");
          onReceiveNativeEvent(params);
          Log.i("ComPDFKit", "CPDFView-onDocumentIsReady()");
        } catch (Exception e) {
        }
        documentFragment.pdfView.addReaderViewCallback(new CPDFIReaderViewCallback() {
          @Override
          public void onMoveToChild(int pageIndex) {
            super.onMoveToChild(pageIndex);
            WritableMap params = Arguments.createMap();
            params.putInt("onPageChanged", pageIndex);
            onReceiveNativeEvent(params);
          }

          @Override
          public void onTapMainDocArea() {
            super.onTapMainDocArea();
            WritableMap params = Arguments.createMap();
            params.putNull("onTapMainDocArea");
            onReceiveNativeEvent(params);
          }
        });
        documentFragment.pdfView.setSaveCallback((s, uri) -> {
          WritableMap event = Arguments.createMap();
          event.putString("saveDocument", "saveDocument");
          event.putString("path", s);
          event.putString("uri", uri.toString());
          onReceiveNativeEvent(event);
        }, e -> {

        });
        documentFragment.setPageEditDialogOnBackListener(() -> {
          WritableMap params = Arguments.createMap();
          params.putNull("onPageEditDialogBackPress");
          onReceiveNativeEvent(params);
        });
        documentFragment.setFillScreenChangeListener(isFillScreen -> {
          WritableMap params = Arguments.createMap();
          params.putBoolean("onFullScreenChanged", isFillScreen);
          onReceiveNativeEvent(params);
        });
        pdfView.getCPdfReaderView().getUndoManager()
          .addOnUndoHistoryChangeListener((cpdfUndoManager, operation, type) -> {
            WritableMap historyState = Arguments.createMap();
            historyState.putBoolean("canUndo", cpdfUndoManager.canUndo());
            historyState.putBoolean("canRedo", cpdfUndoManager.canRedo());
            WritableMap params = Arguments.createMap();
            params.putMap("onAnnotationHistoryChanged", historyState);
            onReceiveNativeEvent(params);
          });
        pdfView.addEditStatusChangeListener(new OnEditStatusChangeListener() {
          @Override
          public void onBegin(int i) {

          }

          @Override
          public void onUndoRedo(int pageIndex, boolean canUndo, boolean canRedo) {
            WritableMap historyState = Arguments.createMap();
            historyState.putBoolean("canUndo", canUndo);
            historyState.putBoolean("canRedo", canRedo);
            historyState.putInt("pageIndex", pageIndex);
            WritableMap params = Arguments.createMap();
            params.putMap("onContentEditorHistoryChanged", historyState);
            onReceiveNativeEvent(params);
          }

          @Override
          public void onExit() {

          }
        });
      });
    }
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    Log.i("ComPDFKit", "CPDFView-onAttachedToWindow()");
    getViewTreeObserver().addOnGlobalLayoutListener(mOnGlobalLayoutListener);
    if (themedReactContext != null) {
      themedReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
        getId(),
        "topChange",
        Arguments.createMap()
      );
    }
  }

  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    Log.i("ComPDFKit", "CPDFView-onDetachedFromWindow()");
    getViewTreeObserver().removeOnGlobalLayoutListener(mOnGlobalLayoutListener);
  }

  public CPDFPageUtil getCPDFPageUtil() {
    pageUtil.setDocument(getCPDFReaderView().getPDFDocument());
    return pageUtil;
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

  public CPDFReaderView getCPDFReaderView() {
    return documentFragment.pdfView.getCPdfReaderView();
  }


  @Override
  public void requestLayout() {
    super.requestLayout();
    post(mLayoutRunnable);
  }

  public void onReceiveNativeEvent(String key, String message) {
    ReactContext reactContext = (ReactContext) getContext();
    WritableMap event = Arguments.createMap();
    event.putString(key, message);
    themedReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
      getId(),
      "topChange",
      event);
  }

  public void onReceiveNativeEvent(String key, int message) {
    WritableMap event = Arguments.createMap();
    event.putInt(key, message);
    themedReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
      getId(),
      "topChange",
      event);
  }

  public void onReceiveNativeEvent(WritableMap event) {
    themedReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
      getId(),
      "topChange",
      event);
  }
}
