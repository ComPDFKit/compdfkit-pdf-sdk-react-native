package com.compdfkitpdf.reactnative.util.annotation;


import android.graphics.Color;
import android.graphics.RectF;
import android.util.Log;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.BorderEffectIntensity;
import com.compdfkit.core.annotation.CPDFAnnotation.CPDFBorderEffectType;
import com.compdfkit.core.annotation.CPDFAnnotation.Type;
import com.compdfkit.core.annotation.CPDFBorderStyle;
import com.compdfkit.core.annotation.CPDFBorderStyle.Style;
import com.compdfkit.core.annotation.CPDFSquareAnnotation;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.compdfkitpdf.reactnative.util.CPDFEnumConvertUtil;
import com.facebook.react.bridge.ReadableMap;
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
    CPDFBorderStyle borderStyle = squareAnnotation.getBorderStyle();
    if (borderStyle != null){
      float[] dashArr = borderStyle.getDashArr();
      if (dashArr != null && dashArr.length == 2){
        map.putDouble("dashGap", borderStyle.getDashArr()[1]);
      }
    }
  }


  @Override
  public void updateAnnotation(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateAnnotation(annotation, annotMap);
    CPDFSquareAnnotation squareAnnotation = (CPDFSquareAnnotation) annotation;
    String borderColor = annotMap.getString("borderColor");
    double borderAlpha =  annotMap.getDouble("borderAlpha");
    String fillColor = annotMap.getString("fillColor");
    double fillAlpha =  annotMap.getDouble("fillAlpha");
    double borderWidth = annotMap.getDouble("borderWidth");
    String bordEffectType = annotMap.getString("bordEffectType");
    double dashGap = annotMap.getDouble("dashGap");

    squareAnnotation.setBorderColor(Color.parseColor(borderColor));
    squareAnnotation.setBorderAlpha((int) borderAlpha);
    squareAnnotation.setFillColor(Color.parseColor(fillColor));
    squareAnnotation.setFillAlpha((int) fillAlpha);
    squareAnnotation.setBorderWidth((float) borderWidth);
    CPDFBorderEffectType cpdfBorderEffectType = CPDFEnumConvertUtil.stringToBordEffectType(bordEffectType);
    if (cpdfBorderEffectType != squareAnnotation.getBordEffectType()){
      squareAnnotation.setBordEffectType(cpdfBorderEffectType);
      if (cpdfBorderEffectType == CPDFBorderEffectType.CPDFBorderEffectTypeCloudy){
        squareAnnotation.setBordEffectIntensity(BorderEffectIntensity.INTENSITY_ONE);
      }else {
        squareAnnotation.setBordEffectIntensity(BorderEffectIntensity.INTENSITY_ZERO);
      }
    }
    CPDFBorderStyle borderStyle = squareAnnotation.getBorderStyle();
    if (borderStyle != null){
      float[] dashArr = borderStyle.getDashArr();
      if (dashArr != null && dashArr.length == 2){
        dashArr[1] = (float) dashGap;
      }else {
        dashArr = new float[]{8.0F, (float) dashGap};
      }
      if (dashGap > 0){
        borderStyle.setStyle(Style.Border_Dashed);
      }else {
        borderStyle.setStyle(Style.Border_Solid);
      }
      borderStyle.setDashArr(dashArr);
      squareAnnotation.setBorderStyle(borderStyle);
    } else {
      Style style;
      if (dashGap == 0.0){
        style = Style.Border_Solid;
      } else {
        style = Style.Border_Dashed;
      }
      CPDFBorderStyle newBorderStyle = new CPDFBorderStyle(style, (float) borderWidth, new float[]{8.0F, (float) dashGap});
      squareAnnotation.setBorderStyle(newBorderStyle);
    }
  }

  @Override
  public CPDFAnnotation addAnnotation(CPDFDocument document, ReadableMap annotMap) {
    super.addAnnotation(document, annotMap);
    int pageIndex = annotMap.getInt("page");
    String title = annotMap.getString("title");
    String content = annotMap.getString("content");
    ReadableMap rectMap =annotMap.getMap("rect");
    double left = rectMap.getDouble("left");
    double top = rectMap.getDouble("top");
    double right = rectMap.getDouble("right");
    double bottom = rectMap.getDouble("bottom");

    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFSquareAnnotation squareAnnotation = (CPDFSquareAnnotation) page.addAnnot(Type.SQUARE);
    if (squareAnnotation.isValid()){
      RectF rectF = new RectF((float) left, (float) top, (float) right, (float) bottom);
      squareAnnotation.setRect(rectF);
      squareAnnotation.setTitle(title);
      squareAnnotation.setContent(content);
      if (annotMap.hasKey("createDate")){
        Double createDateTimestamp = annotMap.getDouble("createDate");
        squareAnnotation.setCreationDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
        squareAnnotation.setRecentlyModifyDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
      } else {
        squareAnnotation.setCreationDate(TTimeUtil.getCurrentDate());
        squareAnnotation.setRecentlyModifyDate(TTimeUtil.getCurrentDate());
      }

      updateAnnotation(squareAnnotation, annotMap);
      squareAnnotation.updateAp();
    }
    return squareAnnotation;
  }
}
