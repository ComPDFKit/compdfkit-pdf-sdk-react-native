/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.util;


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
import com.compdfkitpdf.reactnative.util.annotation.RCPDFFreeTextAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFCircleAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFInkAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFLineAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFLinkAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFMarkupAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFNoteAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFSoundAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFSquareAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFStampAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.forms.RCPDFCheckBoxWidget;
import com.compdfkitpdf.reactnative.util.annotation.forms.RCPDFComboBoxWidget;
import com.compdfkitpdf.reactnative.util.annotation.forms.RCPDFListBoxWidget;
import com.compdfkitpdf.reactnative.util.annotation.forms.RCPDFPushbuttonWidget;
import com.compdfkitpdf.reactnative.util.annotation.forms.RCPDFRadioButtonWidget;
import com.compdfkitpdf.reactnative.util.annotation.forms.RCPDFSignatureFieldsWidget;
import com.compdfkitpdf.reactnative.util.annotation.forms.RCPDFTextFieldWidget;
import com.compdfkitpdf.reactnative.util.annotation.forms.RCPDFWidget;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

public class CPDFPageUtil {

  private CPDFDocument document;

  HashMap<Type, RCPDFAnnotation> annotImpls = new HashMap<>();

  HashMap<WidgetType, RCPDFWidget> widgetsImpls = new HashMap<>();

  public CPDFPageUtil() {
    annotImpls = createAnnotationImpl();
    widgetsImpls = getWidgetsImpl();
  }


  private HashMap<Type, RCPDFAnnotation> createAnnotationImpl() {
    HashMap<Type, RCPDFAnnotation> map = new HashMap<>();
    RCPDFMarkupAnnotation markupAnnotation = new RCPDFMarkupAnnotation();
    map.put(Type.TEXT, new RCPDFNoteAnnotation());
    map.put(Type.HIGHLIGHT, markupAnnotation);
    map.put(Type.UNDERLINE, markupAnnotation);
    map.put(Type.SQUIGGLY, markupAnnotation);
    map.put(Type.STRIKEOUT, markupAnnotation);
    map.put(Type.INK, new RCPDFInkAnnotation());
    map.put(Type.CIRCLE, new RCPDFCircleAnnotation());
    map.put(Type.SQUARE, new RCPDFSquareAnnotation());
    map.put(Type.LINE, new RCPDFLineAnnotation());
    map.put(Type.STAMP, new RCPDFStampAnnotation());
    map.put(Type.FREETEXT, new RCPDFFreeTextAnnotation());
    map.put(Type.SOUND, new RCPDFSoundAnnotation());
    map.put(Type.LINK, new RCPDFLinkAnnotation());
    return map;
  }

  private HashMap<WidgetType, RCPDFWidget> getWidgetsImpl() {
    HashMap<WidgetType, RCPDFWidget> map = new HashMap<>();
    map.put(WidgetType.Widget_TextField, new RCPDFTextFieldWidget());
    map.put(WidgetType.Widget_ListBox, new RCPDFListBoxWidget());
    map.put(WidgetType.Widget_ComboBox, new RCPDFComboBoxWidget());
    map.put(WidgetType.Widget_RadioButton, new RCPDFRadioButtonWidget());
    map.put(WidgetType.Widget_CheckBox, new RCPDFCheckBoxWidget());
    map.put(WidgetType.Widget_SignatureFields, new RCPDFSignatureFieldsWidget());
    map.put(WidgetType.Widget_PushButton, new RCPDFPushbuttonWidget());
    return map;
  }

  public void setDocument(CPDFDocument document) {
    this.document = document;
  }

  public WritableArray getAnnotations(int pageIndex) {
    WritableArray array = Arguments.createArray();
    if (document == null) {
      return array;
    }
    CPDFPage page = document.pageAtIndex(pageIndex);
    List<CPDFAnnotation> annotations = page.getAnnotations();
    if (annotations == null || !page.isValid()) {
      return array;
    }
    for (CPDFAnnotation annotation : annotations) {
      RCPDFAnnotation rcpdfAnnotation = annotImpls.get(annotation.getType());
      if (rcpdfAnnotation != null) {
        if (rcpdfAnnotation instanceof RCPDFLinkAnnotation) {
          ((RCPDFLinkAnnotation) rcpdfAnnotation).setDocument(document);
        }
        WritableMap map = rcpdfAnnotation.getAnnotation(annotation);
        if (map != null) {
          array.pushMap(map);
        }
      }
    }
    return array;
  }

  public WritableArray getWidgets(int pageIndex) {
    WritableArray array = Arguments.createArray();

    if (document == null) {
      return array;
    }
    CPDFPage page = document.pageAtIndex(pageIndex);
    List<CPDFAnnotation> annotations = page.getAnnotations();
    if (annotations == null || !page.isValid()) {
      return array;
    }
    for (CPDFAnnotation annotation : annotations) {
      if (annotation.getType() != Type.WIDGET) {
        continue;
      }
      CPDFWidget widget = (CPDFWidget) annotation;
      RCPDFWidget rcpdfWidget = widgetsImpls.get(widget.getWidgetType());
      if (rcpdfWidget != null) {
        WritableMap writableMap = rcpdfWidget.getWidget(annotation);
        if (writableMap != null) {
          array.pushMap(writableMap);
        }
      }
    }
    return array;
  }

  public void setTextWidgetText(int pageIndex, String annotPtr, String text) {
    if (document == null) {
      return;
    }
    CPDFAnnotation annotation = getAnnotation(pageIndex, annotPtr);
    RCPDFTextFieldWidget textFieldWidget = ((RCPDFTextFieldWidget) widgetsImpls.get(
      WidgetType.Widget_TextField));
    if (textFieldWidget != null && annotation != null) {
      textFieldWidget.setText(annotation, text);
    }
  }

  public void updateAp(int pageIndex, String annotPtr) {
    CPDFAnnotation annotation = getAnnotation(pageIndex, annotPtr);
    if (annotation != null) {
      annotation.updateAp();
    }
  }

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

  public boolean addWidgetImageSignature(int pageIndex, String annotPtr, String imagePath) {
    CPDFAnnotation annotation = getAnnotation(pageIndex, annotPtr);
    RCPDFSignatureFieldsWidget signatureFieldsWidget = ((RCPDFSignatureFieldsWidget) widgetsImpls.get(
      WidgetType.Widget_SignatureFields));
    if (signatureFieldsWidget != null && annotation != null) {
      return signatureFieldsWidget.addImageSignatures(document.getContext(), annotation, imagePath);
    }
    return false;
  }


  public CPDFAnnotation getAnnotation(int pageIndex, String annotPtr) {
    CPDFPage page = document.pageAtIndex(pageIndex);
    List<CPDFAnnotation> annotations = page.getAnnotations();
    if (annotations == null || !page.isValid()) {
      return null;
    }
    for (CPDFAnnotation annotation : annotations) {
      if (annotation.getAnnotPtr() == Long.parseLong(annotPtr)) {
        return annotation;
      }
    }
    return null;
  }


  public boolean deleteAnnotation(int pageIndex, String annotPtr) {
    CPDFAnnotation annotation = getAnnotation(pageIndex, annotPtr);
    if (annotation != null) {
      CPDFPage page = document.pageAtIndex(pageIndex);
      return page.deleteAnnotation(annotation);
    } else {
      return false;
    }
  }

  public WritableMap getAnnotationData(CPDFAnnotation annotation) {
    if (document == null) {
      return Arguments.createMap();
    }
    RCPDFAnnotation rcpdfAnnotation = annotImpls.get(annotation.getType());
    if (rcpdfAnnotation != null) {
      if (rcpdfAnnotation instanceof RCPDFLinkAnnotation) {
        ((RCPDFLinkAnnotation) rcpdfAnnotation).setDocument(document);
      }
      return rcpdfAnnotation.getAnnotation(annotation);
    }
    return Arguments.createMap();
  }

  public WritableMap getWidgetData(CPDFWidget widget) {
    if (document == null) {
      return Arguments.createMap();
    }
    RCPDFWidget rcpdfWidget = widgetsImpls.get(widget.getWidgetType());
    if (rcpdfWidget != null) {
      if (rcpdfWidget instanceof RCPDFPushbuttonWidget) {
        ((RCPDFPushbuttonWidget) rcpdfWidget).setDocument(document);
      }
      return rcpdfWidget.getWidget(widget);
    }
    return Arguments.createMap();
  }


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
            RectF rectF = (RectF) value;
            WritableMap rectMap = Arguments.createMap();
            rectMap.putDouble("left", rectF.left);
            rectMap.putDouble("top", rectF.top);
            rectMap.putDouble("right", rectF.right);
            rectMap.putDouble("bottom", rectF.bottom);
            result.putMap("rect", rectMap);
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
          if (value instanceof CPDFEditImageArea) {
            WritableMap editAreaMap = CPDFEditAreaUtil.getEditImageAreaMap(
              (CPDFEditImageArea) value);
            result.putMap("editArea", editAreaMap);
          } else if (value instanceof CPDFEditPathArea) {
            WritableMap editAreaMap = CPDFEditAreaUtil.getEditPathAreaMap(
              (CPDFEditPathArea) value);
            result.putMap("editArea", editAreaMap);
          } else if (value instanceof CPDFEditTextSelections) {
            WritableMap editAreaMap = CPDFEditAreaUtil.getEditTextAreaMap(
              (CPDFEditTextSelections) value);
            result.putMap("editArea", editAreaMap);
          }
          break;
        case "point":
          PointF pointF = (PointF) value;
          WritableMap pointMap = Arguments.createMap();
          pointMap.putDouble("x", pointF.x);
          pointMap.putDouble("y", pointF.y);
          result.putMap("point", pointMap);
          break;
        case "image":
          // screenshot Context menu.
          if (value instanceof Bitmap) {
            Bitmap bitmap = (Bitmap) value;
            ByteArrayOutputStream pngStream = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, pngStream);
            byte[] pngByteArray = pngStream.toByteArray();
            String base64String = android.util.Base64.encodeToString(pngByteArray,
              android.util.Base64.NO_WRAP);
            result.putString("image", base64String);
          }
          break;
        default:
          if (value instanceof String) {
            result.putString(key, (String) value);
          } else if (value instanceof Integer) {
            result.putInt(key, (Integer) value);
          } else if (value instanceof Boolean) {
            result.putBoolean(key, (Boolean) value);
          } else if (value instanceof Double) {
            result.putDouble(key, (Double) value);
          }
          break;
      }
    }
    return result;
  }

  public boolean updateAnnotation(CPDFAnnotation annotation,
    ReadableMap properties) {
    if (annotation != null) {
      RCPDFAnnotation rcpdfAnnotation = annotImpls.get(annotation.getType());
      if (rcpdfAnnotation != null) {
        if (rcpdfAnnotation instanceof RCPDFLinkAnnotation) {
          ((RCPDFLinkAnnotation) rcpdfAnnotation).setDocument(document);
        }
        rcpdfAnnotation.updateAnnotation(annotation, properties);
        annotation.updateAp();
        return true;
      }
    }
    return false;
  }

  public boolean updateWidget(CPDFAnnotation annotation,
    ReadableMap properties) {
    if (annotation != null && annotation.getType() == Type.WIDGET) {
      CPDFWidget widget = (CPDFWidget) annotation;
      RCPDFWidget rcpdfWidget = widgetsImpls.get(widget.getWidgetType());
      if (rcpdfWidget != null) {
        if (rcpdfWidget instanceof RCPDFPushbuttonWidget) {
          ((RCPDFPushbuttonWidget) rcpdfWidget).setDocument(document);
        }
        rcpdfWidget.updateWidget(widget, properties);
        annotation.updateAp();
        return true;
      }
    }
    return false;
  }

  public boolean addAnnotations(@Nullable CPDFReaderView readerView, ReadableArray annotations) {
    if (document == null) {
      return false;
    }
    boolean allSuccess = true;
    HashSet<Integer> pageIndexes = new HashSet<>();
    ArrayList<Object> annots = annotations.toArrayList();
    for (Object annotObj : annots) {
      HashMap<String, Object> annotMap = (HashMap<String, Object>) annotObj;
      double pageIndex = (double) annotMap.get("page");
      String annotationType = (String) annotMap.get("type");
      CPDFAnnotation.Type type = CPDFEnumConvertUtil.stringToCPDFAnnotType(annotationType);
      pageIndexes.add((int) pageIndex);
      if (pageIndex < 0 || pageIndex >= document.getPageCount()) {
        Log.w("ComPDFKit",
          "Failed to add annotation of type: " + annotationType + " due to invalid page index: "
            + pageIndex + ". Skipping.");
        continue;
      }
      RCPDFAnnotation rcpdfAnnotation = annotImpls.get(type);
      if (rcpdfAnnotation != null) {
        if (rcpdfAnnotation instanceof RCPDFLinkAnnotation) {
          ((RCPDFLinkAnnotation) rcpdfAnnotation).setDocument(document);
        }
        ReadableMap readableMap = Arguments.makeNativeMap(annotMap);
        CPDFAnnotation annotation = rcpdfAnnotation.addAnnotation(document, readableMap);
        if (annotation != null && annotation.isValid()) {
          if (readerView != null) {
            CPDFPageView pageView = (CPDFPageView) readerView.getChild((int) pageIndex);
            if (pageView != null) {
              pageView.addAnnotation(annotation, false);
            }
          }
        }
      } else {
        allSuccess = false;
      }
    }
    return allSuccess;
  }

  public void addWidgets(@Nullable CPDFReaderView readerView, ReadableArray widgets) {
    if (document == null) {
      return;
    }
    ArrayList<Object> widgetsArrayList = widgets.toArrayList();

    for (Object widgetObj : widgetsArrayList) {
      HashMap<String, Object> widgetMap = (HashMap<String, Object>) widgetObj;
      double pageIndex = (double) widgetMap.get("page");
      String widgetTypeStr = widgetMap.get("type").toString();
      WidgetType type = CPDFEnumConvertUtil.stringToWidgetType(widgetTypeStr);
      if (pageIndex < 0 || pageIndex >= document.getPageCount()) {
        Log.w("ComPDFKit",
          "Failed to add widget of type: " + widgetTypeStr + " due to invalid page index: "
            + pageIndex + ". Skipping.");
        continue;
      }

      RCPDFWidget cpdfWidget = widgetsImpls.get(type);
      if (cpdfWidget != null) {
        if (cpdfWidget instanceof RCPDFPushbuttonWidget) {
          ((RCPDFPushbuttonWidget) cpdfWidget).setDocument(document);
        }
        ReadableMap readableMap = Arguments.makeNativeMap(widgetMap);
        CPDFWidget widget = cpdfWidget.addWidget(document, readableMap);
        if (widget != null && widget.isValid()) {
          if (readerView != null) {
            CPDFPageView pageView = (CPDFPageView) readerView.getChild((int) pageIndex);
            if (pageView != null) {
              pageView.addAnnotation(widget, false);
            }
          }
        }
      }
    }
  }

}
