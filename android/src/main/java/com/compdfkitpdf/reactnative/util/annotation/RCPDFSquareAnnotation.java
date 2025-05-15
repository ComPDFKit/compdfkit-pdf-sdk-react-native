package com.compdfkitpdf.reactnative.util.annotation;


import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.CPDFBorderEffectType;
import com.compdfkit.core.annotation.CPDFSquareAnnotation;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.facebook.react.bridge.WritableMap;

public class RCPDFSquareAnnotation extends RCPDFBaseAnnotation{

  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    CPDFSquareAnnotation squareAnnotation = (CPDFSquareAnnotation) annotation;
    map.putString("borderColor", CAppUtils.toHexColor(squareAnnotation.getBorderColor()));
    map.putInt("borderAlpha", squareAnnotation.getBorderAlpha());
    map.putString("fillColor", CAppUtils.toHexColor(squareAnnotation.getFillColor()));
    map.putInt("fillAlpha", squareAnnotation.getFillAlpha());
    map.putDouble("borderWidth", squareAnnotation.getBorderWidth());
    map.putString("bordEffectType", squareAnnotation.getBordEffectType() == CPDFBorderEffectType.CPDFBorderEffectTypeSolid ? "solid" : "cloudy");

  }
}
