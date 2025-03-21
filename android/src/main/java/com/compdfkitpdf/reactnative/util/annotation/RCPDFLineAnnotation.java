package com.compdfkitpdf.reactnative.util.annotation;


import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFLineAnnotation;
import com.compdfkit.core.annotation.CPDFLineAnnotation.LineType;
import com.compdfkit.core.page.CPDFPage;
import com.facebook.react.bridge.WritableMap;

public class RCPDFLineAnnotation extends RCPDFBaseAnnotation {


  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    CPDFLineAnnotation lineAnnotation = (CPDFLineAnnotation) annotation;
    if (lineAnnotation.getLineHeadType() == LineType.LINETYPE_NONE && lineAnnotation.getLineTailType() == LineType.LINETYPE_NONE){
      map.putString("type", "line");
    }else {
      map.putString("type", "arrow");
    }
  }
}
