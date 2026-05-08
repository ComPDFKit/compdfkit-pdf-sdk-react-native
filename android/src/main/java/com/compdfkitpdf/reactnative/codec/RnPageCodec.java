/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.codec;


import android.graphics.Bitmap;
import android.graphics.PointF;
import android.graphics.RectF;
import android.util.Log;
import androidx.annotation.Nullable;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.Type;
import com.compdfkit.core.annotation.form.CPDFCheckboxWidget;
import com.compdfkit.core.annotation.form.CPDFRadiobuttonWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.annotation.form.CPDFWidget.WidgetType;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.edit.CPDFEditImageArea;
import com.compdfkit.core.edit.CPDFEditPathArea;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.ui.edit.CPDFEditTextSelections;
import com.compdfkit.ui.reader.CPDFPageView;
import com.compdfkit.ui.reader.CPDFReaderView;
import com.compdfkitpdf.reactnative.codec.annotation.RnFreeTextAnnotationCodec;
import com.compdfkitpdf.reactnative.codec.annotation.RnAnnotationCodec;
import com.compdfkitpdf.reactnative.codec.annotation.RnCircleAnnotationCodec;
import com.compdfkitpdf.reactnative.codec.annotation.RnInkAnnotationCodec;
import com.compdfkitpdf.reactnative.codec.annotation.RnLineAnnotationCodec;
import com.compdfkitpdf.reactnative.codec.annotation.RnLinkAnnotationCodec;
import com.compdfkitpdf.reactnative.codec.annotation.RnMarkupAnnotationCodec;
import com.compdfkitpdf.reactnative.codec.annotation.RnNoteAnnotationCodec;
import com.compdfkitpdf.reactnative.codec.annotation.RnSoundAnnotationCodec;
import com.compdfkitpdf.reactnative.codec.annotation.RnSquareAnnotationCodec;
import com.compdfkitpdf.reactnative.codec.annotation.RnStampAnnotationCodec;
import com.compdfkitpdf.reactnative.codec.widget.RnCheckBoxWidgetCodec;
import com.compdfkitpdf.reactnative.codec.widget.RnComboBoxWidgetCodec;
import com.compdfkitpdf.reactnative.codec.widget.RnListBoxWidgetCodec;
import com.compdfkitpdf.reactnative.codec.widget.RnPushButtonWidgetCodec;
import com.compdfkitpdf.reactnative.codec.widget.RnRadioButtonWidgetCodec;
import com.compdfkitpdf.reactnative.codec.widget.RnSignatureFieldWidgetCodec;
import com.compdfkitpdf.reactnative.codec.widget.RnTextFieldWidgetCodec;
import com.compdfkitpdf.reactnative.codec.widget.RnWidgetCodec;
import com.compdfkitpdf.reactnative.util.RnEditAreaMapper;
import com.compdfkitpdf.reactnative.util.RnEnumConverter;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Coordinates annotation and widget codecs for page-level React Native data exchange.
 */
public class RnPageCodec {

  private CPDFDocument document;

  private final HashMap<Type, RnAnnotationCodec> annotImpls;

  private final HashMap<WidgetType, RnWidgetCodec> widgetsImpls;

  /**
   * Creates a new RnPageCodec instance.
   */
  public RnPageCodec() {
    annotImpls = createAnnotationImpl();
    widgetsImpls = getWidgetsImpl();
  }


  /**
   * Creates annotation impl.
   */
  private HashMap<Type, RnAnnotationCodec> createAnnotationImpl() {
    HashMap<Type, RnAnnotationCodec> map = new HashMap<>();
    RnMarkupAnnotationCodec markupAnnotation = new RnMarkupAnnotationCodec();
    map.put(Type.TEXT, new RnNoteAnnotationCodec());
    map.put(Type.HIGHLIGHT, markupAnnotation);
    map.put(Type.UNDERLINE, markupAnnotation);
    map.put(Type.SQUIGGLY, markupAnnotation);
    map.put(Type.STRIKEOUT, markupAnnotation);
    map.put(Type.INK, new RnInkAnnotationCodec());
    map.put(Type.CIRCLE, new RnCircleAnnotationCodec());
    map.put(Type.SQUARE, new RnSquareAnnotationCodec());
    map.put(Type.LINE, new RnLineAnnotationCodec());
    map.put(Type.STAMP, new RnStampAnnotationCodec());
    map.put(Type.FREETEXT, new RnFreeTextAnnotationCodec());
    map.put(Type.SOUND, new RnSoundAnnotationCodec());
    map.put(Type.LINK, new RnLinkAnnotationCodec());
    return map;
  }

  /**
   * Returns the widgets impl.
   */
  private HashMap<WidgetType, RnWidgetCodec> getWidgetsImpl() {
    HashMap<WidgetType, RnWidgetCodec> map = new HashMap<>();
    map.put(WidgetType.Widget_TextField, new RnTextFieldWidgetCodec());
    map.put(WidgetType.Widget_ListBox, new RnListBoxWidgetCodec());
    map.put(WidgetType.Widget_ComboBox, new RnComboBoxWidgetCodec());
    map.put(WidgetType.Widget_RadioButton, new RnRadioButtonWidgetCodec());
    map.put(WidgetType.Widget_CheckBox, new RnCheckBoxWidgetCodec());
    map.put(WidgetType.Widget_SignatureFields, new RnSignatureFieldWidgetCodec());
    map.put(WidgetType.Widget_PushButton, new RnPushButtonWidgetCodec());
    return map;
  }

  /**
   * Sets the document.
   */
  public void setDocument(CPDFDocument document) {
    this.document = document;
  }

  /**
   * Returns the annotations.
   */
  public WritableArray getAnnotations(int pageIndex) {
    WritableArray array = Arguments.createArray();
    for (CPDFAnnotation annotation : getPageAnnotations(pageIndex)) {
      WritableMap map = getAnnotationData(annotation);
      if (map != null && map.hasKey("type")) {
        array.pushMap(map);
      }
    }
    return array;
  }

  /**
   * Returns the widgets.
   */
  public WritableArray getWidgets(int pageIndex) {
    WritableArray array = Arguments.createArray();

    for (CPDFAnnotation annotation : getPageAnnotations(pageIndex)) {
      if (annotation.getType() != Type.WIDGET) {
        continue;
      }
      WritableMap writableMap = getWidgetData((CPDFWidget) annotation);
      if (writableMap != null && writableMap.hasKey("type")) {
        array.pushMap(writableMap);
      }
    }
    return array;
  }

  /**
   * Sets the text widget text.
   */
  public void setTextWidgetText(int pageIndex, String annotPtr, String text) {
    if (document == null) {
      return;
    }
    CPDFAnnotation annotation = getAnnotation(pageIndex, annotPtr);
    RnTextFieldWidgetCodec textFieldWidget = ((RnTextFieldWidgetCodec) widgetsImpls.get(
      WidgetType.Widget_TextField));
    if (textFieldWidget != null && annotation != null) {
      textFieldWidget.setText(annotation, text);
    }
  }

  /**
   * Updates ap.
   */
  public void updateAp(int pageIndex, String annotPtr) {
    CPDFAnnotation annotation = getAnnotation(pageIndex, annotPtr);
    if (annotation != null) {
      annotation.updateAp();
    }
  }

  /**
   * Sets the checked.
   */
  public void setChecked(int pageIndex, String annotPtr, boolean checked) {
    if (document == null) {
      return;
    }
    CPDFAnnotation annotation = getAnnotation(pageIndex, annotPtr);
    if (annotation.getType() != Type.WIDGET) {
      return;
    }
    CPDFWidget widget = (CPDFWidget) annotation;
    if (widget instanceof CPDFRadiobuttonWidget) {
      ((CPDFRadiobuttonWidget) widget).setChecked(checked);
    } else if (widget instanceof CPDFCheckboxWidget) {
      ((CPDFCheckboxWidget) widget).setChecked(checked);
    }
  }

  /**
   * Adds widget image signature.
   */
  public boolean addWidgetImageSignature(int pageIndex, String annotPtr, String imagePath) {
    CPDFAnnotation annotation = getAnnotation(pageIndex, annotPtr);
    RnSignatureFieldWidgetCodec signatureFieldsWidget = ((RnSignatureFieldWidgetCodec) widgetsImpls.get(
      WidgetType.Widget_SignatureFields));
    if (signatureFieldsWidget != null && annotation != null) {
      return signatureFieldsWidget.addImageSignatures(document.getContext(), annotation, imagePath);
    }
    return false;
  }


  /**
   * Returns the annotation.
   */
  public CPDFAnnotation getAnnotation(int pageIndex, String annotPtr) {
    for (CPDFAnnotation annotation : getPageAnnotations(pageIndex)) {
      if (annotation.getAnnotPtr() == Long.parseLong(annotPtr)) {
        return annotation;
      }
    }
    return null;
  }


  /**
   * Returns delete annotation.
   */
  public boolean deleteAnnotation(int pageIndex, String annotPtr) {
    CPDFAnnotation annotation = getAnnotation(pageIndex, annotPtr);
    if (annotation != null) {
      CPDFPage page = document.pageAtIndex(pageIndex);
      return page.deleteAnnotation(annotation);
    } else {
      return false;
    }
  }

  /**
   * Returns the annotation data.
   */
  public WritableMap getAnnotationData(CPDFAnnotation annotation) {
    if (document == null) {
      return Arguments.createMap();
    }
    RnAnnotationCodec rcpdfAnnotation = resolveAnnotationCodec(annotation);
    if (rcpdfAnnotation != null) {
      return rcpdfAnnotation.getAnnotation(annotation);
    }
    return Arguments.createMap();
  }

  /**
   * Returns the widget data.
   */
  public WritableMap getWidgetData(CPDFWidget widget) {
    if (document == null) {
      return Arguments.createMap();
    }
    RnWidgetCodec rcpdfWidget = resolveWidgetCodec(widget);
    if (rcpdfWidget != null) {
      return rcpdfWidget.getWidget(widget);
    }
    return Arguments.createMap();
  }


  /**
   * Parses custom context menu event.
   */
  public WritableMap parseCustomContextMenuEvent(Map<String, Object> extraMap) {
    WritableMap result = Arguments.createMap();
    if (extraMap == null) {
      return result;
    }
    for (Map.Entry<String, Object> entry : extraMap.entrySet()) {
      String key = entry.getKey();
      Object value = entry.getValue();
      if ("customEventType".equals(key)) {
        continue;
      }
      switch (key) {
        case "rect":
          if (value instanceof RectF) {
            result.putMap("rect", toRectMap((RectF) value));
          }
          break;
        case "widget":
          if (value instanceof CPDFWidget) {
            CPDFWidget widget = (CPDFWidget) value;
            result.putMap("widget", getWidgetData(widget));
          }
          break;
        case "annotation":
          if (value instanceof CPDFAnnotation) {
            CPDFAnnotation annotation = (CPDFAnnotation) value;
            result.putMap("annotation", getAnnotationData(annotation));
          }
          break;
        case "editArea":
          WritableMap editAreaMap = toEditAreaMap(value);
          if (editAreaMap != null) {
            result.putMap("editArea", editAreaMap);
          }
          break;
        case "point":
          if (value instanceof PointF) {
            result.putMap("point", toPointMap((PointF) value));
          }
          break;
        case "image":
          // screenshot Context menu.
          if (value instanceof Bitmap) {
            result.putString("image", toBase64Image((Bitmap) value));
          }
          break;
        default:
          putPrimitiveValue(result, key, value);
          break;
      }
    }
    return result;
  }

  /**
   * Updates annotation.
   */
  public boolean updateAnnotation(CPDFAnnotation annotation,
    ReadableMap properties) {
    if (annotation != null) {
      RnAnnotationCodec rcpdfAnnotation = resolveAnnotationCodec(annotation);
      if (rcpdfAnnotation != null) {
        rcpdfAnnotation.updateAnnotation(annotation, properties);
        annotation.updateAp();
        return true;
      }
    }
    return false;
  }

  /**
   * Updates widget.
   */
  public boolean updateWidget(CPDFAnnotation annotation,
    ReadableMap properties) {
    if (annotation != null && annotation.getType() == Type.WIDGET) {
      CPDFWidget widget = (CPDFWidget) annotation;
      RnWidgetCodec rcpdfWidget = resolveWidgetCodec(widget);
      if (rcpdfWidget != null) {
        rcpdfWidget.updateWidget(widget, properties);
        annotation.updateAp();
        return true;
      }
    }
    return false;
  }

  /**
   * Adds annotations.
   */
  public boolean addAnnotations(@Nullable CPDFReaderView readerView, ReadableArray annotations) {
    if (document == null) {
      return false;
    }
    boolean allSuccess = true;
    ArrayList<Object> annots = annotations.toArrayList();
    for (Object annotObj : annots) {
      HashMap<String, Object> annotMap = (HashMap<String, Object>) annotObj;
      double pageIndex = (double) annotMap.get("page");
      String annotationType = (String) annotMap.get("type");
      CPDFAnnotation.Type type = RnEnumConverter.stringToCPDFAnnotType(annotationType);
      RnAnnotationCodec rcpdfAnnotation = prepareCodec(annotImpls.get(type));
      if (rcpdfAnnotation != null) {
        ReadableMap readableMap = Arguments.makeNativeMap(annotMap);
        CPDFAnnotation annotation = rcpdfAnnotation.addAnnotation(document, readableMap);
        if (annotation != null && annotation.isValid()) {
          addToPageView(readerView, (int) pageIndex, annotation);
        }
      } else {
        allSuccess = false;
      }
    }
    return allSuccess;
  }

  /**
   * Adds widgets.
   */
  public void addWidgets(@Nullable CPDFReaderView readerView, ReadableArray widgets) {
    if (document == null) {
      return;
    }
    ArrayList<Object> widgetsArrayList = widgets.toArrayList();

    for (Object widgetObj : widgetsArrayList) {
      HashMap<String, Object> widgetMap = (HashMap<String, Object>) widgetObj;
      double pageIndex = (double) widgetMap.get("page");
      String widgetTypeStr = widgetMap.get("type").toString();
      WidgetType type = RnEnumConverter.stringToWidgetType(widgetTypeStr);

      RnWidgetCodec cpdfWidget = prepareCodec(widgetsImpls.get(type));
      if (cpdfWidget != null) {
        ReadableMap readableMap = Arguments.makeNativeMap(widgetMap);
        CPDFWidget widget = cpdfWidget.addWidget(document, readableMap);
        if (widget != null && widget.isValid()) {
          addToPageView(readerView, (int) pageIndex, widget);
        }
      }
    }
  }

  /**
   * Returns the page annotations.
   */
  private List<CPDFAnnotation> getPageAnnotations(int pageIndex) {
    if (document == null) {
      return new ArrayList<>();
    }
    CPDFPage page = document.pageAtIndex(pageIndex);
    if (page == null || !page.isValid()) {
      return new ArrayList<>();
    }
    List<CPDFAnnotation> annotations = page.getAnnotations();
    return annotations == null ? new ArrayList<>() : annotations;
  }

  /**
   * Resolves annotation codec.
   */
  private RnAnnotationCodec resolveAnnotationCodec(CPDFAnnotation annotation) {
    return prepareCodec(annotImpls.get(annotation.getType()));
  }

  /**
   * Resolves widget codec.
   */
  private RnWidgetCodec resolveWidgetCodec(CPDFWidget widget) {
    return prepareCodec(widgetsImpls.get(widget.getWidgetType()));
  }

  /**
   * Prepares codec.
   */
  private <T> T prepareCodec(T codec) {
    if (codec instanceof RnDocumentAware) {
      ((RnDocumentAware) codec).setDocument(document);
    }
    return codec;
  }

  /**
   * Adds to page view.
   */
  private void addToPageView(@Nullable CPDFReaderView readerView, int pageIndex,
    CPDFAnnotation annotation) {
    if (readerView == null) {
      return;
    }
    CPDFPageView pageView = (CPDFPageView) readerView.getChild(pageIndex);
    if (pageView != null) {
      pageView.addAnnotation(annotation, false);
    }
  }

  /**
   * Converts the input value to rect map.
   */
  private WritableMap toRectMap(RectF rectF) {
    WritableMap rectMap = Arguments.createMap();
    rectMap.putDouble("left", rectF.left);
    rectMap.putDouble("top", rectF.top);
    rectMap.putDouble("right", rectF.right);
    rectMap.putDouble("bottom", rectF.bottom);
    return rectMap;
  }

  /**
   * Converts the input value to point map.
   */
  private WritableMap toPointMap(PointF pointF) {
    WritableMap pointMap = Arguments.createMap();
    pointMap.putDouble("x", pointF.x);
    pointMap.putDouble("y", pointF.y);
    return pointMap;
  }

  /**
   * Converts the input value to edit area map.
   */
  private WritableMap toEditAreaMap(Object value) {
    if (value instanceof CPDFEditImageArea) {
      return RnEditAreaMapper.getEditImageAreaMap((CPDFEditImageArea) value);
    }
    if (value instanceof CPDFEditPathArea) {
      return RnEditAreaMapper.getEditPathAreaMap((CPDFEditPathArea) value);
    }
    if (value instanceof CPDFEditTextSelections) {
      return RnEditAreaMapper.getEditTextAreaMap((CPDFEditTextSelections) value);
    }
    return null;
  }

  /**
   * Converts the input value to base64 image.
   */
  private String toBase64Image(Bitmap bitmap) {
    ByteArrayOutputStream pngStream = new ByteArrayOutputStream();
    bitmap.compress(Bitmap.CompressFormat.PNG, 100, pngStream);
    byte[] pngByteArray = pngStream.toByteArray();
    return android.util.Base64.encodeToString(pngByteArray, android.util.Base64.NO_WRAP);
  }

  /**
   * Handles put primitive value.
   */
  private void putPrimitiveValue(WritableMap result, String key, Object value) {
    if (value instanceof String) {
      result.putString(key, (String) value);
    } else if (value instanceof Integer) {
      result.putInt(key, (Integer) value);
    } else if (value instanceof Boolean) {
      result.putBoolean(key, (Boolean) value);
    } else if (value instanceof Double) {
      result.putDouble(key, (Double) value);
    }
  }

}
