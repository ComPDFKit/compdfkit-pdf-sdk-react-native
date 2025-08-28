package com.compdfkitpdf.reactnative.util.annotation;


import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFInkAnnotation;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.facebook.react.bridge.WritableMap;

public class RCPDFInkAnnotation extends RCPDFBaseAnnotation{


  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    CPDFInkAnnotation inkAnnotation = (CPDFInkAnnotation) annotation;
    map.putString("color", CAppUtils.toHexColor(inkAnnotation.getColor()));
    map.putInt("alpha", inkAnnotation.getAlpha());
    map.putDouble("borderWidth", inkAnnotation.getBorderWidth());
  }


}
