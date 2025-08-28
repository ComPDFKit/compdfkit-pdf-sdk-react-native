/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */
package com.compdfkitpdf.reactnative.util.annotation.forms;


import android.graphics.RectF;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.common.CPDFDate;
import com.compdfkit.tools.common.utils.date.CDateUtil;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public abstract class RCPDFBaseWidget implements RCPDFWidget {


  @Override
  public WritableMap getWidget(CPDFAnnotation annotation) {
    WritableMap map = Arguments.createMap();
    CPDFWidget widget = (CPDFWidget) annotation;
    map.putInt("page", widget.pdfPage.getPageNum());
    map.putString("title", widget.getFieldName());
    map.putString("uuid", widget.getAnnotPtr()+"");
    RectF rect = annotation.getRect();
    WritableMap rectMap = Arguments.createMap();
    rectMap.putDouble("left", rect.left);
    rectMap.putDouble("top", rect.top);
    rectMap.putDouble("right", rect.right);
    rectMap.putDouble("bottom", rect.bottom);
    map.putMap("rect", rectMap);

    CPDFDate modifyDate = annotation.getRecentlyModifyDate();
    CPDFDate createDate = annotation.getCreationDate();
    if (modifyDate != null) {
      map.putDouble("modifyDate", CDateUtil.transformToTimestamp(modifyDate));
    }
    if (createDate != null) {
      map.putDouble("createDate", CDateUtil.transformToTimestamp(createDate));
    }

    map.putString("borderColor", CAppUtils.toHexColor(widget.getBorderColor()));
    map.putString("fillColor", CAppUtils.toHexColor(widget.getFillColor()));
    covert(widget, map);
    return  map;
  }

  public abstract void covert(CPDFWidget widget, WritableMap map);
}
