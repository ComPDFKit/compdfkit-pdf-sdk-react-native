/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.util;


import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.Type;
import com.compdfkit.core.annotation.form.CPDFCheckboxWidget;
import com.compdfkit.core.annotation.form.CPDFRadiobuttonWidget;
import com.compdfkit.core.annotation.form.CPDFTextWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.annotation.form.CPDFWidget.WidgetType;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkitpdf.reactnative.util.annotation.RCCPDFFreeTextAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFCircleAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFInkAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFLineAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFLinkAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFMarkupAnnotation;
import com.compdfkitpdf.reactnative.util.annotation.RCPDFNoteAnnotation;
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
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.util.HashMap;
import java.util.List;

public class CPDFPageUtil {
  private CPDFDocument document;

  HashMap<Type, RCPDFAnnotation> annotImpls = new HashMap<>();

  HashMap<WidgetType, RCPDFWidget> widgetsImpls = new HashMap<>();

  public CPDFPageUtil() {
    annotImpls = createAnnotationImpl();
    widgetsImpls = getWidgetsImpl();
  }


  private HashMap<Type, RCPDFAnnotation> createAnnotationImpl(){
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
    map.put(Type.FREETEXT, new RCCPDFFreeTextAnnotation());
    map.put(Type.SOUND, markupAnnotation);
    map.put(Type.LINK, new RCPDFLinkAnnotation());
    return map;
  }

  private HashMap<WidgetType, RCPDFWidget> getWidgetsImpl(){
    HashMap<WidgetType, RCPDFWidget> map = new HashMap<>();
    map.put(WidgetType.Widget_TextField, new RCPDFTextFieldWidget());
    map.put(WidgetType.Widget_ListBox, new RCPDFListBoxWidget());
    map.put(WidgetType.Widget_ComboBox,  new RCPDFComboBoxWidget());
    map.put(WidgetType.Widget_RadioButton,  new RCPDFRadioButtonWidget());
    map.put(WidgetType.Widget_CheckBox,  new RCPDFCheckBoxWidget());
    map.put(WidgetType.Widget_SignatureFields,  new RCPDFSignatureFieldsWidget());
    map.put(WidgetType.Widget_PushButton,  new RCPDFPushbuttonWidget());
    return map;
  }

  public void setDocument(CPDFDocument document) {
    this.document = document;
  }

  public WritableArray getAnnotations(int pageIndex){
    if (document == null) {
      return null;
    }
    CPDFPage page = document.pageAtIndex(pageIndex);
    List<CPDFAnnotation> annotations = page.getAnnotations();
    if (annotations == null || !page.isValid()){
      return null;
    }
    WritableArray array = Arguments.createArray();
    for (CPDFAnnotation annotation : annotations) {
      RCPDFAnnotation rcpdfAnnotation = annotImpls.get(annotation.getType());
      if (rcpdfAnnotation != null){
        if (rcpdfAnnotation instanceof RCPDFLinkAnnotation){
          ((RCPDFLinkAnnotation) rcpdfAnnotation).setDocument(document);
        }
        WritableMap map = rcpdfAnnotation.getAnnotation(annotation);
        if (map != null){
          array.pushMap(map);
        }
      }
    }
    return array;
  }

  public WritableArray getWidgets(int pageIndex){
    if (document == null) {
      return null;
    }
    CPDFPage page = document.pageAtIndex(pageIndex);
    List<CPDFAnnotation> annotations = page.getAnnotations();
    if (annotations == null || !page.isValid()){
      return null;
    }
    WritableArray array = Arguments.createArray();
    for (CPDFAnnotation annotation : annotations) {
      if (annotation.getType() != Type.WIDGET){
        continue;
      }
      CPDFWidget widget = (CPDFWidget) annotation;
      RCPDFWidget rcpdfWidget = widgetsImpls.get(widget.getWidgetType());
      if (rcpdfWidget != null){
        WritableMap writableMap = rcpdfWidget.getWidget(annotation);
        if (writableMap != null){
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
    RCPDFTextFieldWidget textFieldWidget = ((RCPDFTextFieldWidget) widgetsImpls.get(WidgetType.Widget_TextField));
    if (textFieldWidget != null && annotation != null) {
      textFieldWidget.setText(annotation, text);
    }
  }

  public void updateAp(int pageIndex, String annotPtr){
    CPDFAnnotation annotation = getAnnotation(pageIndex, annotPtr);
    if (annotation != null){
      annotation.updateAp();
    }
  }

  public void setChecked(int pageIndex, String annotPtr, boolean checked) {
    if (document == null) {
      return;
    }
    CPDFAnnotation annotation = getAnnotation(pageIndex, annotPtr);
    if (annotation.getType() != Type.WIDGET){
      return;
    }
    CPDFWidget widget = (CPDFWidget) annotation;
    if (widget instanceof CPDFRadiobuttonWidget){
      ((CPDFRadiobuttonWidget) widget).setChecked(checked);
    } else if (widget instanceof CPDFCheckboxWidget) {
      ((CPDFCheckboxWidget) widget).setChecked(checked);
    }
  }

  public boolean addWidgetImageSignature(int pageIndex, String annotPtr, String imagePath){
    CPDFAnnotation annotation = getAnnotation(pageIndex, annotPtr);
    RCPDFSignatureFieldsWidget signatureFieldsWidget = ((RCPDFSignatureFieldsWidget) widgetsImpls.get(WidgetType.Widget_SignatureFields));
    if (signatureFieldsWidget != null && annotation != null) {
      return signatureFieldsWidget.addImageSignatures(document.getContext(), annotation, imagePath);
    }
    return false;
  }


  public CPDFAnnotation getAnnotation(int pageIndex, String annotPtr){
    CPDFPage page = document.pageAtIndex(pageIndex);
    List<CPDFAnnotation> annotations = page.getAnnotations();
    if (annotations == null || !page.isValid()){
      return null;
    }
    for (CPDFAnnotation annotation : annotations) {
      if (annotation.getAnnotPtr() == Long.parseLong(annotPtr)){
        return annotation;
      }
    }
    return null;
  }


  public boolean deleteAnnotation(int pageIndex, String annotPtr){
    CPDFAnnotation annotation = getAnnotation(pageIndex, annotPtr);
    if (annotation != null){
      CPDFPage page = document.pageAtIndex(pageIndex);
      return page.deleteAnnotation(annotation);
    }else {
      return false;
    }
  }

}
