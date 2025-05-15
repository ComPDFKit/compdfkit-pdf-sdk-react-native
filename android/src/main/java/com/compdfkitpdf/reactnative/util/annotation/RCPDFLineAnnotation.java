package com.compdfkitpdf.reactnative.util.annotation;


import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFLineAnnotation;
import com.compdfkit.core.annotation.CPDFLineAnnotation.LineType;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkitpdf.reactnative.util.CAppUtils;
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
    map.putString("borderColor", CAppUtils.toHexColor(lineAnnotation.getBorderColor()));
    map.putInt("borderAlpha", lineAnnotation.getBorderAlpha());
    map.putString("fillColor", CAppUtils.toHexColor(lineAnnotation.getFillColor()));
    map.putInt("fillAlpha", lineAnnotation.getFillAlpha());
    map.putDouble("borderWidth", lineAnnotation.getBorderWidth());
    map.putString("lineHeadType", getLineType(lineAnnotation.getLineHeadType()));
    map.putString("lineTailType", getLineType(lineAnnotation.getLineTailType()));
  }


  private String getLineType(CPDFLineAnnotation.LineType lineType) {
    return switch (lineType) {
      case LINETYPE_ARROW -> "arrow";
      case LINETYPE_CIRCLE -> "circle";
      case LINETYPE_DIAMOND -> "diamond";
      case LINETYPE_SQUARE -> "square";
      case LINETYPE_CLOSEDARROW -> "closedArrow";
      case LINETYPE_NONE -> "none";
      default -> "unknown";
    };
  }
}
