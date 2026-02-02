/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
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
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.FrameLayout;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentManager;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.Type;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.edit.CPDFEditArea;
import com.compdfkit.core.edit.OnEditStatusChangeListener;
import com.compdfkit.tools.common.interfaces.CPDFCustomEventCallback;
import com.compdfkit.tools.common.pdf.CPDFDocumentFragment;
import com.compdfkit.tools.common.pdf.config.CPDFConfiguration;
import com.compdfkit.tools.common.utils.customevent.CPDFCustomEventCallbackHelper;
import com.compdfkit.tools.common.views.pdfproperties.CAnnotationType;
import com.compdfkit.tools.common.views.pdfview.CPDFIReaderViewCallback;
import com.compdfkit.tools.contenteditor.CEditToolbar;
import com.compdfkit.ui.proxy.CPDFBaseAnnotImpl;
import com.compdfkit.ui.reader.CPDFPageView;
import com.compdfkit.ui.reader.CPDFReaderView;
import com.compdfkit.ui.reader.CPDFSelectAnnotCallback;
import com.compdfkitpdf.reactnative.util.CPDFDocumentUtil;
import com.compdfkitpdf.reactnative.util.CPDFEditAreaUtil;
import com.compdfkitpdf.reactnative.util.CPDFPageUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import java.util.Map;


public class CPDFView extends FrameLayout implements CPDFCustomEventCallback {

  private boolean isPasswordSet = false;

  private boolean isPageIndexSet = false;

  public CPDFDocumentFragment documentFragment;

  private FragmentManager fragmentManager;

  public CPDFView(@NonNull Context context) {
    super(context);
    setClickable(true);
    setFocusableInTouchMode(true);
  }

  private String document;

  private String password;

  private int pageIndex;

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

  public void setPageIndex(int pageIndex){
    this.pageIndex = pageIndex;
    this.isPageIndexSet = true;
    initDocumentFragment();
  }

  public void setConfiguration(CPDFConfiguration configuration) {
    this.configuration = configuration;
    initDocumentFragment();
  }

  private void initDocumentFragment() {
    if (TextUtils.isEmpty(document) || configuration == null || !isPasswordSet || !isPageIndexSet) {
      return;
    }
    if (documentFragment == null) {
      Bundle bundle = new Bundle();
      bundle.putInt(CPDFDocumentFragment.EXTRA_PAGE_INDEX, pageIndex);
      bundle.putString(CPDFDocumentFragment.EXTRA_FILE_PASSWORD, password);
      bundle.putSerializable(CPDFDocumentFragment.EXTRA_CONFIGURATION, configuration);
      if (document.startsWith(CPDFDocumentUtil.CONTENT_SCHEME) ||
        document.startsWith(CPDFDocumentUtil.FILE_SCHEME)) {
        bundle.putParcelable(CPDFDocumentFragment.EXTRA_FILE_URI, Uri.parse(document));
      } else {
        bundle.putString(CPDFDocumentFragment.EXTRA_FILE_PATH, document);
      }
      documentFragment = CPDFDocumentFragment.newInstance(bundle);
      prepareFragment(documentFragment);
    }
  }

  private void prepareFragment(CPDFDocumentFragment documentFragment) {
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
        } catch (Exception ignored) {
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

        CPDFReaderView readerView = pdfView.getCPdfReaderView();
        documentFragment.setAddAnnotCallback((cpdfPageView, cpdfBaseAnnot) -> {
          WritableMap annotData = getAnnotData(
            documentFragment.pdfView.getCPdfReaderView()
              .getPDFDocument(), cpdfBaseAnnot.onGetAnnotation());
          WritableMap params = Arguments.createMap();
          if (cpdfBaseAnnot.getAnnotType() == Type.WIDGET) {
            params.putMap("formFieldsCreated", annotData);
          } else {
            params.putMap("annotationsCreated", annotData);
          }
          onReceiveNativeEvent(params);
        });

        readerView.setSelectAnnotCallback(new CPDFSelectAnnotCallback() {
          @Override
          public void onAnnotationSelected(CPDFPageView cpdfPageView,
            CPDFBaseAnnotImpl<CPDFAnnotation> cpdfBaseAnnot) {
            WritableMap annotData = getAnnotData(
              documentFragment.pdfView.getCPdfReaderView()
                .getPDFDocument(), cpdfBaseAnnot.onGetAnnotation());
            WritableMap params = Arguments.createMap();
            if (cpdfBaseAnnot.getAnnotType() == Type.WIDGET) {
              params.putMap("formFieldsSelected", annotData);
            } else {
              params.putMap("annotationsSelected", annotData);
            }
            onReceiveNativeEvent(params);
          }

          @Override
          public void onAnnotationDeselected(CPDFPageView cpdfPageView,
            @Nullable CPDFBaseAnnotImpl<CPDFAnnotation> cpdfBaseAnnot) {
            if (cpdfBaseAnnot != null) {
              WritableMap annotData = getAnnotData(
                documentFragment.pdfView.getCPdfReaderView()
                  .getPDFDocument(), cpdfBaseAnnot.onGetAnnotation());
              WritableMap params = Arguments.createMap();
              if (cpdfBaseAnnot.getAnnotType() == Type.WIDGET) {
                params.putMap("formFieldsDeselected", annotData);
              } else {
                params.putMap("annotationsDeselected", annotData);
              }
              onReceiveNativeEvent(params);
            }
          }
        });

        pdfView.addSelectEditAreaChangeListener(type -> {
          if (type == CEditToolbar.SELECT_AREA_NONE){
            onReceiveNativeEvent("editorSelectionDeselected", null);
            return;
          }
          CPDFEditArea editArea = readerView.getSelectEditArea();
          if (editArea == null){
            return;
          }
          CPDFPageView pageView = (CPDFPageView) readerView.getChild(
            editArea.getPageNum());
          if (pageView == null){
            return;
          }
          WritableMap map = CPDFEditAreaUtil.getEditAreaMap(pageView,
            readerView.getSelectEditArea());
          WritableMap params = Arguments.createMap();
          params.putMap("editorSelectionSelected", map);
          onReceiveNativeEvent(params);
        });

        documentFragment.annotationToolbar.addAnnotationCreatePreparedListener((type, cpdfAnnotation) -> {
          WritableMap map = Arguments.createMap();
          if (type == CAnnotationType.PIC){
            map.putString("type", "pictures");
          }else {
            map.putString("type", type.name().toLowerCase());
          }
          if (cpdfAnnotation != null){
            map.putMap("annotation", getAnnotData(readerView.getPDFDocument(), cpdfAnnotation));
          }
          WritableMap params = Arguments.createMap();
          params.putMap("onAnnotationCreationPrepared", map);
          onReceiveNativeEvent(params);
        });

      });
  }

  private WritableMap getAnnotData(CPDFDocument document, CPDFAnnotation annotation) {
    WritableMap annotMap;
    pageUtil.setDocument(document);
    if (annotation.getType() == Type.WIDGET) {
      CPDFWidget widget = (CPDFWidget) annotation;
      annotMap = pageUtil.getWidgetData(widget);
    } else {
      annotMap = pageUtil.getAnnotationData(
        annotation);
    }
    return annotMap;
  }

  @Override
  public void click(Map<String, Object> map) {
    String customEventType = map.get("customEventType").toString();
    switch (customEventType){
      case "CustomToolbarItemTapped":
        // click CPDFToolbar custom action.
        onReceiveNativeEvent("onCustomToolbarItemTapped", (String) map.get("identifier"));
        break;
      case "ContextMenuItem":
        // click context menu custom item.
        WritableMap params = getCPDFPageUtil().parseCustomContextMenuEvent(map);
        WritableMap extraMap = Arguments.createMap();
        extraMap.putMap("onCustomContextMenuItemTapped", params);
        onReceiveNativeEvent(extraMap);
        break;
      default:
//                    methodChannel.invokeMethod("onCustomEvent", extraMap);
        break;
    }
  }

  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    Log.i("ComPDFKit", "CPDFView-onAttachedToWindow()");
    // add custom event callback
    CPDFCustomEventCallbackHelper.getInstance().addCustomEventCallback(this);
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
    // add custom event callback
    CPDFCustomEventCallbackHelper.getInstance().removeCustomEventCallback(this);
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
