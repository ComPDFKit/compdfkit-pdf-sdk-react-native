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
import com.compdfkit.tools.common.utils.customevent.CPDFCustomEventField;
import com.compdfkit.tools.common.utils.customevent.CPDFCustomEventType;
import com.compdfkit.tools.common.views.pdfproperties.CAnnotationType;
import com.compdfkit.tools.common.views.pdfproperties.pdfstyle.CStyleType;
import com.compdfkit.tools.common.views.pdfview.CPDFIReaderViewCallback;
import com.compdfkit.tools.contenteditor.CEditToolbar;
import com.compdfkit.ui.proxy.CPDFBaseAnnotImpl;
import com.compdfkit.ui.reader.CPDFPageView;
import com.compdfkit.ui.reader.CPDFReaderView;
import com.compdfkit.ui.reader.CPDFSelectAnnotCallback;
import com.compdfkitpdf.reactnative.util.RnDocumentSourceResolver;
import com.compdfkitpdf.reactnative.util.RnEditAreaMapper;
import com.compdfkitpdf.reactnative.codec.RnPageCodec;
import com.compdfkitpdf.reactnative.util.RnEnumConverter;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import java.util.Map;


/**
 * Hosts the native PDF fragment and forwards viewer events back to React Native.
 */
public class RnPdfView extends FrameLayout implements CPDFCustomEventCallback {

  private static final String REACT_EVENT_NAME = "topChange";
  private static final String EVENT_DOCUMENT_READY = "onDocumentIsReady";
  private static final String EVENT_PAGE_CHANGED = "onPageChanged";
  private static final String EVENT_TAP_MAIN_DOC_AREA = "onTapMainDocArea";
  private static final String EVENT_SAVE_DOCUMENT = "onSaveDocument";
  private static final String EVENT_PAGE_EDIT_DIALOG_BACK_PRESS = "onPageEditDialogBackPress";
  private static final String EVENT_FULL_SCREEN_CHANGED = "onFullScreenChanged";
  private static final String EVENT_ANNOTATION_HISTORY_CHANGED = "onAnnotationHistoryChanged";
  private static final String EVENT_CONTENT_EDITOR_HISTORY_CHANGED = "onContentEditorHistoryChanged";
  private static final String EVENT_FORM_FIELDS_CREATED = "formFieldsCreated";
  private static final String EVENT_ANNOTATIONS_CREATED = "annotationsCreated";
  private static final String EVENT_FORM_FIELDS_SELECTED = "formFieldsSelected";
  private static final String EVENT_ANNOTATIONS_SELECTED = "annotationsSelected";
  private static final String EVENT_FORM_FIELDS_DESELECTED = "formFieldsDeselected";
  private static final String EVENT_ANNOTATIONS_DESELECTED = "annotationsDeselected";
  private static final String EVENT_EDITOR_SELECTION_DESELECTED = "editorSelectionDeselected";
  private static final String EVENT_EDITOR_SELECTION_SELECTED = "editorSelectionSelected";
  private static final String EVENT_ANNOTATION_CREATION_PREPARED = "onAnnotationCreationPrepared";
  private static final String EVENT_CUSTOM_TOOLBAR_ITEM_TAPPED = "onCustomToolbarItemTapped";
  private static final String EVENT_CUSTOM_CONTEXT_MENU_ITEM_TAPPED = "onCustomContextMenuItemTapped";
  private static final String EVENT_SEARCH_BACK_BUTTON_TAPPED = "onSearchBackButtonTapped";
  private static final String EVENT_ANNOTATION_STYLE_DIALOG_DISMISSED = "onAnnotationStyleDialogDismissed";
  private static final String EVENT_FORM_STYLE_DIALOG_DISMISSED = "onFormStyleDialogDismissed";
  private static final String EVENT_CONTENT_EDITOR_STYLE_DIALOG_DISMISSED = "onContentEditorStyleDialogDismissed";
  private static final String EVENT_INTERCEPT_ANNOTATION_ACTION = "onInterceptAnnotationAction";
  private static final String CUSTOM_EVENT_SEARCH_BACK_BUTTON_TAPPED = "SearchBackButtonTapped";

  private static final String EVENT_ADD_WATERMARK_DIALOG_DISMISSED = "onAddWatermarkDialogDismissed";

  private boolean isPasswordSet = false;

  private boolean isPageIndexSet = false;

  public CPDFDocumentFragment documentFragment;

  private FragmentManager fragmentManager;

  /**
   * Creates a new RnPdfView instance.
   */
  public RnPdfView(@NonNull Context context) {
    super(context);
    setClickable(true);
    setFocusableInTouchMode(true);
  }

  private String document;

  private String password;

  private int pageIndex;

  private CPDFConfiguration configuration;

  private ThemedReactContext themedReactContext;

  private RnPageCodec pageUtil = new RnPageCodec();

  /**
   * Sets the up.
   */
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

  /**
   * Sets the document.
   */
  public void setDocument(String document) {
    this.document = RnDocumentSourceResolver.resolveOpenDocumentSource(getContext(), document);
    initDocumentFragment();
  }

  /**
   * Sets the password.
   */
  public void setPassword(String password) {
    this.password = password;
    isPasswordSet = true;
    initDocumentFragment();
  }

  /**
   * Sets the page index.
   */
  public void setPageIndex(int pageIndex){
    this.pageIndex = pageIndex;
    this.isPageIndexSet = true;
    initDocumentFragment();
  }

  /**
   * Sets the configuration.
   */
  public void setConfiguration(CPDFConfiguration configuration) {
    this.configuration = configuration;
    initDocumentFragment();
  }

  /**
   * Handles init document fragment.
   */
  private void initDocumentFragment() {
    if (TextUtils.isEmpty(document) || configuration == null || !isPasswordSet || !isPageIndexSet) {
      return;
    }
    if (documentFragment == null) {
      Bundle bundle = new Bundle();
      bundle.putInt(CPDFDocumentFragment.EXTRA_PAGE_INDEX, pageIndex);
      bundle.putString(CPDFDocumentFragment.EXTRA_FILE_PASSWORD, password);
      bundle.putSerializable(CPDFDocumentFragment.EXTRA_CONFIGURATION, configuration);
      if (RnDocumentSourceResolver.isUriSource(document)) {
        bundle.putParcelable(CPDFDocumentFragment.EXTRA_FILE_URI, Uri.parse(document));
      } else {
        bundle.putString(CPDFDocumentFragment.EXTRA_FILE_PATH, document);
      }
      documentFragment = CPDFDocumentFragment.newInstance(bundle);
      prepareFragment(documentFragment);
    }
  }

  /**
   * Prepares fragment.
   */
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
          emitNullEvent(EVENT_DOCUMENT_READY);
          Log.i("ComPDFKit", "RnPdfView-onDocumentIsReady()");
        } catch (Exception ignored) {
        }
        documentFragment.pdfView.addReaderViewCallback(new CPDFIReaderViewCallback() {
          /**
           * Handles on move to child.
           */
          @Override
          public void onMoveToChild(int pageIndex) {
            super.onMoveToChild(pageIndex);
            emitIntEvent(EVENT_PAGE_CHANGED, pageIndex);
          }

          /**
           * Handles on tap main doc area.
           */
          @Override
          public void onTapMainDocArea() {
            super.onTapMainDocArea();
            emitNullEvent(EVENT_TAP_MAIN_DOC_AREA);
          }
        });
        documentFragment.pdfView.setSaveCallback((s, uri) -> {
          WritableMap event = createEvent();
          event.putString(EVENT_SAVE_DOCUMENT, EVENT_SAVE_DOCUMENT);
          event.putString("path", s);
          event.putString("uri", uri.toString());
          emitEvent(event);
        }, e -> {

        });
        documentFragment.setPageEditDialogOnBackListener(() -> emitNullEvent(EVENT_PAGE_EDIT_DIALOG_BACK_PRESS));
        documentFragment.setFillScreenChangeListener(isFillScreen -> emitBooleanEvent(EVENT_FULL_SCREEN_CHANGED, isFillScreen));
        pdfView.getCPdfReaderView().getUndoManager()
          .addOnUndoHistoryChangeListener((cpdfUndoManager, operation, type) -> {
            WritableMap historyState = createEvent();
            historyState.putBoolean("canUndo", cpdfUndoManager.canUndo());
            historyState.putBoolean("canRedo", cpdfUndoManager.canRedo());
            emitMapEvent(EVENT_ANNOTATION_HISTORY_CHANGED, historyState);
          });
        pdfView.addEditStatusChangeListener(new OnEditStatusChangeListener() {
          /**
           * Handles on begin.
           */
          @Override
          public void onBegin(int i) {

          }

          /**
           * Handles on undo redo.
           */
          @Override
          public void onUndoRedo(int pageIndex, boolean canUndo, boolean canRedo) {
            WritableMap historyState = createEvent();
            historyState.putBoolean("canUndo", canUndo);
            historyState.putBoolean("canRedo", canRedo);
            historyState.putInt("pageIndex", pageIndex);
            emitMapEvent(EVENT_CONTENT_EDITOR_HISTORY_CHANGED, historyState);
          }

          /**
           * Handles on exit.
           */
          @Override
          public void onExit() {

          }
        });

        CPDFReaderView readerView = pdfView.getCPdfReaderView();
        documentFragment.setAddAnnotCallback((cpdfPageView, cpdfBaseAnnot) -> {
          WritableMap annotData = getAnnotData(
            documentFragment.pdfView.getCPdfReaderView()
              .getPDFDocument(), cpdfBaseAnnot.onGetAnnotation());
          if (cpdfBaseAnnot.getAnnotType() == Type.WIDGET) {
            emitMapEvent(EVENT_FORM_FIELDS_CREATED, annotData);
          } else {
            emitMapEvent(EVENT_ANNOTATIONS_CREATED, annotData);
          }
        });

        readerView.setSelectAnnotCallback(new CPDFSelectAnnotCallback() {
          /**
           * Handles on annotation selected.
           */
          @Override
          public void onAnnotationSelected(CPDFPageView cpdfPageView,
            CPDFBaseAnnotImpl<CPDFAnnotation> cpdfBaseAnnot) {
            WritableMap annotData = getAnnotData(
              documentFragment.pdfView.getCPdfReaderView()
                .getPDFDocument(), cpdfBaseAnnot.onGetAnnotation());
            if (cpdfBaseAnnot.getAnnotType() == Type.WIDGET) {
              emitMapEvent(EVENT_FORM_FIELDS_SELECTED, annotData);
            } else {
              emitMapEvent(EVENT_ANNOTATIONS_SELECTED, annotData);
            }
          }

          /**
           * Handles on annotation deselected.
           */
          @Override
          public void onAnnotationDeselected(CPDFPageView cpdfPageView,
            @Nullable CPDFBaseAnnotImpl<CPDFAnnotation> cpdfBaseAnnot) {
            if (cpdfBaseAnnot != null) {
              WritableMap annotData = getAnnotData(
                documentFragment.pdfView.getCPdfReaderView()
                  .getPDFDocument(), cpdfBaseAnnot.onGetAnnotation());
              if (cpdfBaseAnnot.getAnnotType() == Type.WIDGET) {
                emitMapEvent(EVENT_FORM_FIELDS_DESELECTED, annotData);
              } else {
                emitMapEvent(EVENT_ANNOTATIONS_DESELECTED, annotData);
              }
            }
          }
        });

        pdfView.addSelectEditAreaChangeListener(type -> {
          if (type == CEditToolbar.SELECT_AREA_NONE){
            emitNullEvent(EVENT_EDITOR_SELECTION_DESELECTED);
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
          WritableMap map = RnEditAreaMapper.getEditAreaMap(pageView,
            readerView.getSelectEditArea());
          emitMapEvent(EVENT_EDITOR_SELECTION_SELECTED, map);
        });

        documentFragment.annotationToolbar.addAnnotationCreatePreparedListener((type, cpdfAnnotation) -> {
          WritableMap map = createEvent();
          if (type == CAnnotationType.PIC){
            map.putString("type", "pictures");
          }else {
            map.putString("type", type.name().toLowerCase());
          }
          if (cpdfAnnotation != null){
            map.putMap("annotation", getAnnotData(readerView.getPDFDocument(), cpdfAnnotation));
          }
          emitMapEvent(EVENT_ANNOTATION_CREATION_PREPARED, map);
        });

      });
  }

  /**
   * Returns the annot data.
   */
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

  /**
   * Handles click.
   */
  @Override
  public void click(Map<String, Object> map) {
    String customEventType = map.get(CPDFCustomEventField.CUSTOM_EVENT_TYPE).toString();

    switch (customEventType){
      case CPDFCustomEventType.ADD_WATERMARK_DIALOG_DISMISSED:
        emitCustomEvent(EVENT_ADD_WATERMARK_DIALOG_DISMISSED, map);
        break;
      case CUSTOM_EVENT_SEARCH_BACK_BUTTON_TAPPED:
        emitCustomEvent(EVENT_SEARCH_BACK_BUTTON_TAPPED, map);
        break;
      case CPDFCustomEventType.ANNOTATION_STYLE_DIALOG_DISMISSED:
        WritableMap params1 = Arguments.createMap();
        params1.putString("type", RnEnumConverter.styleTypeToString(CStyleType.valueOf(map.get(CPDFCustomEventField.STYLE_TYPE).toString())));
        emitMapEvent(EVENT_ANNOTATION_STYLE_DIALOG_DISMISSED, params1);
        break;
      case CPDFCustomEventType.FORM_STYLE_DIALOG_DISMISSED:
        WritableMap params2 = Arguments.createMap();
        params2.putString("type", RnEnumConverter.styleTypeToString(CStyleType.valueOf(map.get(CPDFCustomEventField.STYLE_TYPE).toString())));
        emitMapEvent(EVENT_FORM_STYLE_DIALOG_DISMISSED, params2);
        break;
      case CPDFCustomEventType.CONTENT_EDITOR_STYLE_DIALOG_DISMISSED:
        WritableMap params3 = Arguments.createMap();
        params3.putString("type", RnEnumConverter.styleTypeToString(CStyleType.valueOf(map.get(CPDFCustomEventField.STYLE_TYPE).toString())));
        emitMapEvent(EVENT_CONTENT_EDITOR_STYLE_DIALOG_DISMISSED, params3);
        break;
      case CPDFCustomEventType.TOOLBAR_ITEM_TAPPED:
        // click CPDFToolbar custom action.
        emitStringEvent(EVENT_CUSTOM_TOOLBAR_ITEM_TAPPED, (String) map.get("identifier"));
        break;
      case CPDFCustomEventType.CONTEXT_MENU_ITEM_TAPPED:
        // click context menu custom item.
        WritableMap params = getCPDFPageUtil().parseCustomContextMenuEvent(map);
        emitMapEvent(EVENT_CUSTOM_CONTEXT_MENU_ITEM_TAPPED, params);
        break;
      case CPDFCustomEventType.INTERCEPT_ANNOTATION_DO_ACTION:
        if (map.containsKey(CPDFCustomEventField.ANNOTATION)){
          CPDFAnnotation annotation = (CPDFAnnotation) map.get(CPDFCustomEventField.ANNOTATION);
          if (annotation != null){
            WritableMap annotData = getAnnotData(
              documentFragment.pdfView.getCPdfReaderView()
                .getPDFDocument(),
              annotation);
            emitMapEvent(EVENT_INTERCEPT_ANNOTATION_ACTION, annotData);
          }
        }
        break;
      default:
//                    methodChannel.invokeMethod("onCustomEvent", extraMap);
        break;
    }
  }

  /**
   * Handles on attached to window.
   */
  @Override
  protected void onAttachedToWindow() {
    super.onAttachedToWindow();
    Log.i("ComPDFKit", "RnPdfView-onAttachedToWindow()");
    // add custom event callback
    CPDFCustomEventCallbackHelper.getInstance().addCustomEventCallback(this);
    getViewTreeObserver().addOnGlobalLayoutListener(mOnGlobalLayoutListener);
    if (themedReactContext != null) {
      emitEvent(createEvent());
    }
  }

  /**
   * Handles on detached from window.
   */
  @Override
  protected void onDetachedFromWindow() {
    super.onDetachedFromWindow();
    // add custom event callback
    CPDFCustomEventCallbackHelper.getInstance().removeCustomEventCallback(this);
    Log.i("ComPDFKit", "RnPdfView-onDetachedFromWindow()");
    getViewTreeObserver().removeOnGlobalLayoutListener(mOnGlobalLayoutListener);
  }

  /**
   * Returns the cpdf page util.
   */
  public RnPageCodec getCPDFPageUtil() {
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

  /**
   * Returns the cpdf reader view.
   */
  public CPDFReaderView getCPDFReaderView() {
    return documentFragment.pdfView.getCPdfReaderView();
  }


  /**
   * Handles request layout.
   */
  @Override
  public void requestLayout() {
    super.requestLayout();
    post(mLayoutRunnable);
  }

  /**
   * Emits event.
   */
  private void emitEvent(WritableMap event) {
    themedReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(
      getId(),
      REACT_EVENT_NAME,
      event);
  }

  /**
   * Creates event.
   */
  private WritableMap createEvent() {
    return Arguments.createMap();
  }

  /**
   * Emits null event.
   */
  private void emitNullEvent(String eventName) {
    WritableMap event = createEvent();
    event.putNull(eventName);
    emitEvent(event);
  }

  /**
   * Emits boolean event.
   */
  private void emitBooleanEvent(String eventName, boolean value) {
    WritableMap event = createEvent();
    event.putBoolean(eventName, value);
    emitEvent(event);
  }

  /**
   * Emits int event.
   */
  private void emitIntEvent(String eventName, int value) {
    WritableMap event = createEvent();
    event.putInt(eventName, value);
    emitEvent(event);
  }

  /**
   * Emits string event.
   */
  private void emitStringEvent(String eventName, String value) {
    WritableMap event = createEvent();
    event.putString(eventName, value);
    emitEvent(event);
  }

  /**
   * Emits map event.
   */
  private void emitMapEvent(String eventName, WritableMap value) {
    WritableMap event = createEvent();
    event.putMap(eventName, value);
    emitEvent(event);
  }

  /**
   * Emits a custom event map without renaming payload fields.
   */
  private void emitCustomEvent(String eventName, Map<String, Object> value) {
    emitMapEvent(eventName, Arguments.makeNativeMap(value));
  }
}
