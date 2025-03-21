/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */
package com.compdfkitpdf.reactnative.util.annotation.forms;



import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.Type;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.annotation.form.CPDFWidget.WidgetType;
import com.compdfkit.core.page.CPDFPage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.util.List;

public abstract class RCPDFBaseWidget implements RCPDFWidget {


  @Override
  public WritableMap getWidget(CPDFAnnotation annotation) {
    WritableMap map = Arguments.createMap();
    CPDFWidget widget = (CPDFWidget) annotation;
    map.putInt("page", widget.pdfPage.getPageNum());
    map.putString("title", widget.getFieldName());
    map.putString("uuid", widget.getAnnotPtr()+"");
    covert(widget, map);
    return  map;
  }

  public abstract void covert(CPDFWidget widget, WritableMap map);
}
