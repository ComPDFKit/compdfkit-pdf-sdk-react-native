/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.viewer;

import android.text.TextUtils;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentManager;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFStampAnnotation.StandardStamp;
import com.compdfkit.core.annotation.CPDFStampAnnotation.TextStamp;
import com.compdfkit.core.annotation.CPDFStampAnnotation.TextStampColor;
import com.compdfkit.core.annotation.CPDFStampAnnotation.TextStampShape;
import com.compdfkit.core.annotation.form.CPDFWidget.WidgetType;
import com.compdfkit.core.edit.CPDFEditArea;
import com.compdfkit.core.edit.CPDFEditManager;
import com.compdfkit.core.undo.CPDFUndoManager;
import com.compdfkit.tools.common.pdf.CPDFConfigurationUtils;
import com.compdfkit.tools.common.utils.annotation.CPDFAnnotationManager;
import com.compdfkit.tools.common.views.pdfproperties.CAnnotationType;
import com.compdfkit.tools.common.views.pdfproperties.pdfstyle.CAnnotStyle;
import com.compdfkit.tools.common.views.pdfproperties.pdfstyle.CStyleType;
import com.compdfkit.tools.common.views.pdfproperties.pdfstyle.manager.CStyleManager;
import com.compdfkit.ui.attribute.CPDFEditorTextAttr;
import com.compdfkit.ui.proxy.CPDFBaseAnnotImpl;
import com.compdfkit.ui.proxy.form.CPDFSignatureWidgetImpl;
import com.compdfkit.ui.reader.CPDFPageView;
import com.compdfkit.ui.reader.CPDFReaderView.ViewMode;
import com.compdfkitpdf.reactnative.util.RnAttrUtils;
import com.compdfkitpdf.reactnative.util.RnEditAreaMapper;
import com.compdfkitpdf.reactnative.util.RnEnumConverter;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.util.HashMap;
import java.util.Map;

/**
 * Handles annotation ops for the native PDF viewer layer.
 */
final class RnAnnotationOps {

  private final ReactApplicationContext reactContext;

  /**
   * Creates a new RnAnnotationOps instance.
   */
  RnAnnotationOps(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
  }

  /**
   * Returns the annotations.
   */
  WritableArray getAnnotations(RnPdfViewContext context, int pageIndex) {
    return context.pageUtil.getAnnotations(pageIndex);
  }

  /**
   * Returns the forms.
   */
  WritableArray getForms(RnPdfViewContext context, int pageIndex) {
    return context.pageUtil.getWidgets(pageIndex);
  }

  /**
   * Sets the text widget text.
   */
  void setTextWidgetText(RnPdfViewContext context, int pageIndex, String uuid, String text) {
    context.pageUtil.setTextWidgetText(pageIndex, uuid, text);
  }

  /**
   * Updates ap.
   */
  void updateAp(RnPdfViewContext context, int pageIndex, String uuid) {
    CPDFPageView pageView = (CPDFPageView) context.readerView.getChild(pageIndex);
    if (pageView == null) {
      return;
    }
    CPDFAnnotation annotation = context.pageUtil.getAnnotation(pageIndex, uuid);
    CPDFBaseAnnotImpl impl = pageView.getAnnotImpl(annotation);
    if (impl == null) {
      context.pageUtil.updateAp(pageIndex, uuid);
      return;
    }
    if (impl instanceof CPDFSignatureWidgetImpl) {
      ((CPDFSignatureWidgetImpl) impl).refresh();
    } else {
      context.pageUtil.updateAp(pageIndex, uuid);
      impl.onAnnotAttrChange();
    }
    pageView.invalidate();
  }

  /**
   * Sets the widget is checked.
   */
  void setWidgetIsChecked(RnPdfViewContext context, int pageIndex, String uuid, boolean checked) {
    context.pageUtil.setChecked(pageIndex, uuid, checked);
  }

  /**
   * Adds widget image signature.
   */
  boolean addWidgetImageSignature(RnPdfViewContext context, int pageIndex, String uuid,
    String imagePath) {
    return context.pageUtil.addWidgetImageSignature(pageIndex, uuid, imagePath);
  }

  /**
   * Removes annotation.
   */
  boolean removeAnnotation(RnPdfViewContext context, int pageIndex, String uuid) {
    CPDFAnnotation annotation = context.pageUtil.getAnnotation(pageIndex, uuid);
    if (annotation == null) {
      return false;
    }
    CPDFPageView pageView = (CPDFPageView) context.readerView.getChild(pageIndex);
    if (pageView != null) {
      CPDFBaseAnnotImpl baseAnnot = pageView.getAnnotImpl(annotation);
      pageView.deleteAnnotation(baseAnnot);
      return true;
    }
    return context.pageUtil.deleteAnnotation(pageIndex, uuid);
  }

  /**
   * Sets the annotation mode.
   */
  void setAnnotationMode(RnPdfViewContext context, String mode) {
    CAnnotationType type;
    try {
      switch (mode) {
        case "note":
          type = CAnnotationType.TEXT;
          break;
        case "pictures":
          type = CAnnotationType.PIC;
          break;
        default:
          type = CAnnotationType.valueOf(mode.toUpperCase());
          break;
      }
    } catch (Exception e) {
      type = CAnnotationType.UNKNOWN;
    }
    context.view.documentFragment.annotationToolbar.switchAnnotationType(type);
  }

  /**
   * Returns the annotation mode.
   */
  String getAnnotationMode(RnPdfViewContext context) {
    CAnnotationType annotationType =
      context.view.documentFragment.annotationToolbar.toolListAdapter.getCurrentAnnotType();
    switch (annotationType) {
      case TEXT:
        return "note";
      case PIC:
        return "pictures";
      default:
        return annotationType.name().toLowerCase();
    }
  }

  /**
   * Returns annotation can undo.
   */
  boolean annotationCanUndo(RnPdfViewContext context) {
    CPDFUndoManager manager = context.readerView.getUndoManager();
    return manager.canUndo();
  }

  /**
   * Returns annotation can redo.
   */
  boolean annotationCanRedo(RnPdfViewContext context) {
    CPDFUndoManager manager = context.readerView.getUndoManager();
    return manager.canRedo();
  }

  /**
   * Handles annotation undo.
   */
  void annotationUndo(RnPdfViewContext context) {
    CPDFUndoManager manager = context.readerView.getUndoManager();
    if (manager == null || !manager.canUndo()) {
      return;
    }
    try {
      manager.undo();
    } catch (Exception e) {
      throw new IllegalStateException("Undo annotation failed.", e);
    }
  }

  /**
   * Handles annotation redo.
   */
  void annotationRedo(RnPdfViewContext context) {
    CPDFUndoManager manager = context.readerView.getUndoManager();
    if (manager == null || !manager.canRedo()) {
      return;
    }
    try {
      manager.redo();
    } catch (Exception e) {
      throw new IllegalStateException("Redo annotation failed.", e);
    }
  }

  /**
   * Handles change edit type.
   */
  void changeEditType(RnPdfViewContext context, int type, Promise promise) {
    if (context.readerView.getViewMode() != ViewMode.PDFEDIT
      && context.readerView.getViewMode() != ViewMode.ALL) {
      promise.reject("1002",
        "Current mode is not contentEditor mode, please switch to CPDFViewMode.contentEditor mode first.");
      return;
    }
    CPDFEditManager editManager = context.readerView.getEditManager();
    if (editManager != null) {
      editManager.changeEditType(type);
      context.view.documentFragment.editToolBar.updateTypeStatus();
      promise.resolve(true);
    } else {
      promise.reject("1001", "EditManager is null, please check if Edit feature is enabled.");
    }
  }

  /**
   * Returns editor can undo.
   */
  boolean editorCanUndo(RnPdfViewContext context) {
    CPDFEditManager editManager = context.readerView.getEditManager();
    return editManager != null && editManager.canUndo();
  }

  /**
   * Returns editor can redo.
   */
  boolean editorCanRedo(RnPdfViewContext context) {
    CPDFEditManager editManager = context.readerView.getEditManager();
    return editManager != null && editManager.canRedo();
  }

  /**
   * Returns editor undo.
   */
  boolean editorUndo(RnPdfViewContext context) {
    CPDFEditManager editManager = context.readerView.getEditManager();
    if (editManager == null) {
      return false;
    }
    if (editManager.canUndo()) {
      context.readerView.onEditUndo();
      context.view.documentFragment.editToolBar.updateUndoRedo();
      return true;
    }
    return false;
  }

  /**
   * Returns editor redo.
   */
  boolean editorRedo(RnPdfViewContext context) {
    CPDFEditManager editManager = context.readerView.getEditManager();
    if (editManager == null) {
      return false;
    }
    if (editManager.canRedo()) {
      context.readerView.onEditRedo();
      context.view.documentFragment.editToolBar.updateUndoRedo();
      return true;
    }
    return false;
  }

  /**
   * Sets the form creation mode.
   */
  void setFormCreationMode(RnPdfViewContext context, String formType) {
    WidgetType type = CPDFConfigurationUtils.getWidgetType(formType);
    context.view.documentFragment.formToolBar.switchFormMode(type);
  }

  /**
   * Returns the form creation mode.
   */
  String getFormCreationMode(RnPdfViewContext context) {
    switch (context.readerView.getCurrentFocusedFormType()) {
      case Widget_TextField:
        return "textField";
      case Widget_CheckBox:
        return "checkBox";
      case Widget_RadioButton:
        return "radioButton";
      case Widget_ListBox:
        return "listBox";
      case Widget_ComboBox:
        return "comboBox";
      case Widget_PushButton:
        return "pushButton";
      case Widget_SignatureFields:
        return "signaturesFields";
      default:
        return "unknown";
    }
  }

  /**
   * Handles verify digital signature status.
   */
  void verifyDigitalSignatureStatus(RnPdfViewContext context) {
    context.view.documentFragment.verifyDocumentSignStatus();
  }

  /**
   * Handles hide digital signature view.
   */
  void hideDigitalSignatureView(RnPdfViewContext context) {
    context.view.documentFragment.hideDigitalSignStatusView();
  }

  /**
   * Sets the annotations visible.
   */
  void setAnnotationsVisible(RnPdfViewContext context, boolean visible) {
    context.readerView.setAnnotationsVisible(visible);
  }

  /**
   * Returns are annotations visible.
   */
  boolean areAnnotationsVisible(RnPdfViewContext context) {
    return context.readerView.isAnnotationsVisible();
  }

  /**
   * Handles show default annotation properties view.
   */
  void showDefaultAnnotationPropertiesView(RnPdfViewContext context, String annotType) {
    CAnnotationType type = RnEnumConverter.strongToAnnotationType(annotType);
    context.view.documentFragment.annotationToolbar.showAnnotStyleDialog(type.getStyleType());
  }

  /**
   * Handles show annotation properties view.
   */
  void showAnnotationPropertiesView(RnPdfViewContext context, ReadableMap annotMap) {
    int pageIndex = annotMap.getInt("page");
    String uuid = annotMap.getString("uuid");
    CPDFAnnotation annotation = context.pageUtil.getAnnotation(pageIndex, uuid);
    if (annotation == null) {
      return;
    }
    FragmentManager fragmentManager = context.view.documentFragment.getParentFragmentManager();
    CPDFPageView pageView = (CPDFPageView) context.readerView.getChild(pageIndex);
    CPDFBaseAnnotImpl baseAnnot = null;
    if (pageView != null) {
      baseAnnot = pageView.getAnnotImpl(annotation);
    }
    if (baseAnnot != null) {
      CPDFAnnotationManager.showPropertiesDialog(fragmentManager, baseAnnot, pageView);
    } else {
      CPDFAnnotationManager.showPropertiesDialog(fragmentManager, annotation, pageView);
    }
  }

  /**
   * Handles show edit area properties view.
   */
  void showEditAreaPropertiesView(RnPdfViewContext context, ReadableMap editAreaMap) {
    int pageIndex = editAreaMap.getInt("page");
    String uuid = editAreaMap.getString("uuid");
    String areaType = editAreaMap.getString("type");
    CPDFEditArea editArea = RnEditAreaMapper.getEditArea(context.document, pageIndex, uuid,
      areaType);
    if (editArea != null) {
      FragmentManager fragmentManager = context.view.documentFragment.getParentFragmentManager();
      CPDFPageView pageView = (CPDFPageView) context.readerView.getChild(pageIndex);
      CPDFAnnotationManager.showPropertiesDialog(fragmentManager, editArea, pageView);
    }
  }

  /**
   * Prepares next signature.
   */
  void prepareNextSignature(@Nullable RnPdfViewContext context, String imagePath) {
    if (context == null) {
      return;
    }
    CStyleManager styleManager = new CStyleManager(context.viewCtrl);
    CAnnotStyle style = styleManager.getStyle(CStyleType.ANNOT_SIGNATURE);
    style.setImagePath(imagePath);
    styleManager.updateStyle(style);
  }

  /**
   * Prepares next image.
   */
  void prepareNextImage(@Nullable RnPdfViewContext context, String imagePath) {
    if (context == null) {
      return;
    }
    CStyleManager styleManager = new CStyleManager(context.viewCtrl);
    CAnnotStyle style = styleManager.getStyle(CStyleType.ANNOT_PIC);
    style.setImagePath(imagePath);
    styleManager.updateStyle(style);
  }

  /**
   * Prepares next stamp.
   */
  void prepareNextStamp(@Nullable RnPdfViewContext context, ReadableMap stampMap) {
    if (context == null) {
      return;
    }
    String stampType = stampMap.getString("type");
    CStyleManager styleManager = new CStyleManager(context.viewCtrl);
    CAnnotStyle style = styleManager.getStyle(CStyleType.ANNOT_STAMP);
    if ("image".equals(stampType)) {
      String imagePath = stampMap.getString("imagePath");
      String parseImagePath = com.compdfkitpdf.reactnative.util.RnFileUtils.parseFilePath(
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
      TextStampShape textStampShape = RnEnumConverter.stringToStampShape(shape);
      TextStampColor textStampColor = RnEnumConverter.stringToStampColor(color);
      TextStamp textStamp = new TextStamp(content, date, textStampShape.id, textStampColor.id);
      style.setTextStamp(textStamp);
    }
    styleManager.updateStyle(style);
  }

  /**
   * Returns fetch default annotation style.
   */
  WritableMap fetchDefaultAnnotationStyle(@Nullable RnPdfViewContext context) {
    if (context == null) {
      return Arguments.createMap();
    }
    HashMap<String, Object> map = RnAttrUtils.getDefaultAnnotAttr(context.viewCtrl);
    return Arguments.makeNativeMap(map);
  }

  /**
   * Updates default annotation style.
   */
  void updateDefaultAnnotationStyle(@Nullable RnPdfViewContext context, ReadableMap styleMap) {
    if (context == null) {
      return;
    }
    Map<String, Object> map = styleMap.toHashMap();
    String annotType = styleMap.getString("type");
    if (TextUtils.isEmpty(annotType)) {
      return;
    }
    try {
      RnAttrUtils.setDefaultAnnotAttr(context.viewCtrl, annotType, map);
      context.view.documentFragment.annotationToolbar.updateItemColor();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  /**
   * Returns fetch default widget style.
   */
  ReadableMap fetchDefaultWidgetStyle(@Nullable RnPdfViewContext context) {
    if (context == null) {
      return Arguments.createMap();
    }
    HashMap<String, Object> map = RnAttrUtils.getDefaultWidgetAttr(context.viewCtrl);
    return Arguments.makeNativeMap(map);
  }

  /**
   * Updates default widget style.
   */
  void updateDefaultWidgetStyle(@Nullable RnPdfViewContext context, ReadableMap styleMap) {
    if (context == null) {
      return;
    }
    Map<String, Object> map = styleMap.toHashMap();
    String annotType = styleMap.getString("type");
    if (TextUtils.isEmpty(annotType)) {
      return;
    }
    RnAttrUtils.setDefaultAnnotAttr(context.viewCtrl, annotType, map);
  }

  /**
   * Removes edit area.
   */
  void removeEditArea(@Nullable RnPdfViewContext context, int pageIndex, String uuid, String type) {
    if (context != null) {
      RnEditAreaMapper.removeEditArea(context.document, pageIndex, uuid, type);
      context.readerView.getContextMenuShowListener().dismissContextMenu();
    }
  }

  /**
   * Creates new text area.
   */
  boolean createNewTextArea(@Nullable RnPdfViewContext context, ReadableMap textAreaMap) {
    if (context == null) {
      return false;
    }
    HashMap<String, Object> map = textAreaMap.toHashMap();
    int pageIndex = textAreaMap.getInt("page_index");
    boolean isEditMode = context.readerView.getViewMode() == ViewMode.PDFEDIT;
    map.put("isEditMode", isEditMode);
    CPDFEditorTextAttr normalEditorAttr = context.readerView.getReaderAttribute()
      .getAnnotAttribute().getEditorTextAttr();
    CPDFEditArea editArea = RnEditAreaMapper.createNewTextArea(context.document, map,
      normalEditorAttr);

    CPDFPageView pageView = (CPDFPageView) context.readerView.getChild(pageIndex);
    if (pageView != null) {
      ViewMode viewMode = context.readerView.getViewMode();
      if (viewMode != ViewMode.PDFEDIT) {
        pageView.endEdit();
      }
      pageView.onUpdateUI(pageIndex);
    }
    return editArea != null && editArea.isValid();
  }

  /**
   * Creates new image area.
   */
  void createNewImageArea(@Nullable RnPdfViewContext context, ReadableMap imageAreaMap,
    Promise promise) {
    if (context == null) {
      return;
    }
    HashMap<String, Object> map = imageAreaMap.toHashMap();
    int pageIndex = imageAreaMap.getInt("page_index");
    boolean isEditMode = context.readerView.getViewMode() == ViewMode.PDFEDIT;
    map.put("isEditMode", isEditMode);

    RnEditAreaMapper.createNewImageArea(context.document, map, editArea -> {
      CPDFPageView pageView = (CPDFPageView) context.readerView.getChild(pageIndex);
      if (pageView != null) {
        ViewMode viewMode = context.readerView.getViewMode();
        if (viewMode != ViewMode.PDFEDIT) {
          pageView.endEdit();
        }
        pageView.onUpdateUI(pageIndex);
      }
      promise.resolve(editArea != null && editArea.isValid());
    });
  }

  /**
   * Updates annotation.
   */
  void updateAnnotation(RnPdfViewContext context, ReadableMap annotMap, Promise promise) {
    int pageIndex = annotMap.getInt("page");
    String uuid = annotMap.getString("uuid");
    CPDFAnnotation annotation = context.pageUtil.getAnnotation(pageIndex, uuid);
    if (annotation == null || !annotation.isValid()) {
      promise.reject("UPDATE_ANNOTATION_FAIL", "not found this annotation");
      return;
    }
    try {
      context.pageUtil.updateAnnotation(annotation, annotMap);
      CPDFPageView pageView = (CPDFPageView) context.readerView.getChild(pageIndex);
      if (pageView != null) {
        CPDFBaseAnnotImpl annotImpl = pageView.getAnnotImpl(annotation);
        if (annotImpl != null) {
          annotImpl.onAnnotAttrChange();
          pageView.invalidate();
        } else {
          pageView.addAnnotation(annotation, false);
          pageView.invalidate();
        }
      }
      promise.resolve(true);
    } catch (Exception e) {
      promise.reject("UPDATE_ANNOTATION_FAIL", e.getMessage());
    }
  }

  /**
   * Updates widget.
   */
  void updateWidget(RnPdfViewContext context, ReadableMap widgetMap, Promise promise) {
    int pageIndex = widgetMap.getInt("page");
    String uuid = widgetMap.getString("uuid");
    CPDFAnnotation annotation = context.pageUtil.getAnnotation(pageIndex, uuid);
    if (annotation == null || !annotation.isValid()) {
      promise.reject("UPDATE_WIDGET_FAIL", "not found this widget");
      return;
    }
    try {
      context.pageUtil.updateWidget(annotation, widgetMap);
      CPDFPageView pageView = (CPDFPageView) context.readerView.getChild(pageIndex);
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

  /**
   * Adds annotations.
   */
  void addAnnotations(RnPdfViewContext context, ReadableArray annotationsArray) {
    context.pageUtil.addAnnotations(context.readerView, annotationsArray);
  }

  /**
   * Adds widgets.
   */
  void addWidgets(RnPdfViewContext context, ReadableArray widgetsArray) {
    context.pageUtil.addWidgets(context.readerView, widgetsArray);
  }
}
