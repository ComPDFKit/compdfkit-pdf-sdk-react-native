package com.compdfkitpdf.reactnative.util.annotation;


import android.graphics.RectF;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.Type;
import com.compdfkit.core.annotation.CPDFMarkupAnnotation;
import com.compdfkit.core.common.CPDFDate;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.tools.common.utils.date.CDateUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class RCPDFBaseAnnotation implements RCPDFAnnotation{

  @Override
  public WritableMap getAnnotation(CPDFAnnotation annotation) {
    WritableMap map = Arguments.createMap();
    map.putString("type", annotation.getType().name().toLowerCase());
    map.putInt("page", annotation.pdfPage.getPageNum());
    map.putString("title", annotation.getTitle());
    map.putString("content", annotation.getContent());
    map.putString("uuid", annotation.getAnnotPtr()+"");
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
    covert(annotation, map);
    return map;
  }

  public abstract void covert(CPDFAnnotation annotation, WritableMap map);
}
