package com.compdfkitpdf.reactnative.codec.annotation;


import android.graphics.RectF;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.common.CPDFDate;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.tools.common.utils.date.CDateUtil;
import com.compdfkitpdf.reactnative.util.RnAppUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

/**
 * Maps base annotation annotation data between native objects and React Native maps.
 */
public abstract class RnBaseAnnotationCodec implements RnAnnotationCodec{

  /**
   * Returns the annotation.
   */
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
    rectMap.putDouble("left", RnAppUtils.roundTo2f(rect.left));
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
    covert(annotation, map);
    return map;
  }

  /**
   * Writes native properties into the React Native map.
   */
  public abstract void covert(CPDFAnnotation annotation, WritableMap map);


  /**
   * Updates annotation.
   */
  @Override
  public void updateAnnotation(CPDFAnnotation annotation, ReadableMap annotMap) {
    String title = annotMap.getString("title");
    String content = annotMap.getString("content");
    annotation.setTitle(title);
    annotation.setContent(content);
  }

  /**
   * Adds annotation.
   */
  @Override
  public CPDFAnnotation addAnnotation(CPDFDocument document, ReadableMap annotMap) {
    return null;
  }
}
