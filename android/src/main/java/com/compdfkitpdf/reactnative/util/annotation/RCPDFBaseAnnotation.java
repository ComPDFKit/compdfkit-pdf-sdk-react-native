package com.compdfkitpdf.reactnative.util.annotation;


import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.Type;
import com.compdfkit.core.annotation.CPDFMarkupAnnotation;
import com.compdfkit.core.page.CPDFPage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.util.List;

public abstract class RCPDFBaseAnnotation implements RCPDFAnnotation{

  @Override
  public WritableMap getAnnotation(CPDFAnnotation annotation) {
    WritableMap map = Arguments.createMap();
    map.putString("type", annotation.getType().name().toLowerCase());
    map.putInt("page", annotation.pdfPage.getPageNum());
    map.putString("title", annotation.getTitle());
    map.putString("content", annotation.getContent());
    map.putString("uuid", annotation.getAnnotPtr()+"");
    covert(annotation, map);
    return map;
  }

  public abstract void covert(CPDFAnnotation annotation, WritableMap map);
}
