package com.compdfkitpdf.reactnative.util.annotation;


import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFMarkupAnnotation;
import com.facebook.react.bridge.WritableMap;

public class RCPDFMarkupAnnotation extends RCPDFBaseAnnotation{

  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    if (annotation instanceof CPDFMarkupAnnotation){
      CPDFMarkupAnnotation markupAnnotation = (CPDFMarkupAnnotation) annotation;
      map.putString("markedText", markupAnnotation.getMarkedText());
    }
  }
}
