/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */
package com.compdfkitpdf.reactnative.codec.widget;


import android.graphics.Color;
import android.graphics.RectF;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.common.CPDFDate;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.tools.common.utils.date.CDateUtil;
import com.compdfkitpdf.reactnative.util.RnAppUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

/**
 * Maps base widget data between native objects and React Native maps.
 */
public abstract class RnBaseWidgetCodec implements RnWidgetCodec {


  /**
   * Returns the widget.
   */
  @Override
  public WritableMap getWidget(CPDFAnnotation annotation) {
    WritableMap map = Arguments.createMap();
    CPDFWidget widget = (CPDFWidget) annotation;
    map.putInt("page", widget.pdfPage.getPageNum());
    map.putString("title", widget.getFieldName());
    map.putString("uuid", widget.getAnnotPtr()+"");
    RectF rect = annotation.getRect();
    WritableMap rectMap = Arguments.createMap();
    rectMap.putDouble("left",RnAppUtils.roundTo2f(rect.left));
    rectMap.putDouble("top", RnAppUtils.roundTo2f(rect.top));
    rectMap.putDouble("right", RnAppUtils.roundTo2f(rect.right));
    rectMap.putDouble("bottom", RnAppUtils.roundTo2f(rect.bottom));
    map.putMap("rect", rectMap);

    CPDFDate modifyDate = annotation.getRecentlyModifyDate();
    CPDFDate createDate = annotation.getCreationDate();
    if (modifyDate != null) {
      map.putDouble("modifyDate", CDateUtil.transformToTimestamp(modifyDate));
    }
    if (createDate != null) {
      map.putDouble("createDate", CDateUtil.transformToTimestamp(createDate));
    }

    map.putString("borderColor", RnAppUtils.toHexColor(widget.getBorderColor()));
    map.putString("fillColor", RnAppUtils.toHexColor(widget.getFillColor()));
    map.putDouble("borderWidth", widget.getBorderWidth());
    covert(widget, map);
    return  map;
  }

  /**
   * Writes native properties into the React Native map.
   */
  public abstract void covert(CPDFWidget widget, WritableMap map);


  /**
   * Updates widget.
   */
  @Override
  public void updateWidget(CPDFAnnotation annotation, ReadableMap annotMap) {
    CPDFWidget widget = (CPDFWidget) annotation;
    String title = annotMap.getString("title");
    String fillColor = annotMap.getString("fillColor");
    String borderColor = annotMap.getString("borderColor");
    double borderWidth = annotMap.getDouble("borderWidth");
    widget.setFieldName(title);
    widget.setFillColor(Color.parseColor(fillColor));
    widget.setBorderColor(Color.parseColor(borderColor));
    widget.setBorderWidth((float) borderWidth);
  }

  /**
   * Adds widget.
   */
  @Override
  public CPDFWidget addWidget(CPDFDocument document, ReadableMap widgetMap) {
    return null;
  }
}
