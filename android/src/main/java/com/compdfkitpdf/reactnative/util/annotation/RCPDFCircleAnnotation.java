package com.compdfkitpdf.reactnative.util.annotation;


import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.CPDFBorderEffectType;
import com.compdfkit.core.annotation.CPDFCircleAnnotation;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.facebook.react.bridge.WritableMap;

public class RCPDFCircleAnnotation extends RCPDFBaseAnnotation{


  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    CPDFCircleAnnotation circleAnnotation = (CPDFCircleAnnotation) annotation;
    map.putString("borderColor", CAppUtils.toHexColor(circleAnnotation.getBorderColor()));
    map.putInt("borderAlpha", circleAnnotation.getBorderAlpha());
    map.putString("fillColor", CAppUtils.toHexColor(circleAnnotation.getFillColor()));
    map.putInt("fillAlpha", circleAnnotation.getFillAlpha());
    map.putDouble("borderWidth", circleAnnotation.getBorderWidth());
    map.putString("bordEffectType", circleAnnotation.getBordEffectType() == CPDFBorderEffectType.CPDFBorderEffectTypeSolid ? "solid" : "cloudy");

  }
}
