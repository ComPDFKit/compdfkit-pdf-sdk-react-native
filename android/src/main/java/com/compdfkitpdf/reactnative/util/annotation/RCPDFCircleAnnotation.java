package com.compdfkitpdf.reactnative.util.annotation;


import android.graphics.Color;
import android.graphics.RectF;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.BorderEffectIntensity;
import com.compdfkit.core.annotation.CPDFAnnotation.CPDFBorderEffectType;
import com.compdfkit.core.annotation.CPDFBorderStyle;
import com.compdfkit.core.annotation.CPDFBorderStyle.Style;
import com.compdfkit.core.annotation.CPDFCircleAnnotation;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.compdfkitpdf.reactnative.util.CPDFEnumConvertUtil;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

public class RCPDFCircleAnnotation extends RCPDFBaseAnnotation {


  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    CPDFCircleAnnotation circleAnnotation = (CPDFCircleAnnotation) annotation;
    map.putString("borderColor", CAppUtils.toHexColor(circleAnnotation.getBorderColor()));
    map.putInt("borderAlpha", circleAnnotation.getBorderAlpha());
    map.putString("fillColor", CAppUtils.toHexColor(circleAnnotation.getFillColor()));
    map.putInt("fillAlpha", circleAnnotation.getFillAlpha());
    map.putDouble("borderWidth", circleAnnotation.getBorderWidth());
    map.putString("bordEffectType",
      circleAnnotation.getBordEffectType() == CPDFBorderEffectType.CPDFBorderEffectTypeSolid
        ? "solid" : "cloudy");
    CPDFBorderStyle borderStyle = circleAnnotation.getBorderStyle();
    if (borderStyle != null) {
      float[] dashArr = borderStyle.getDashArr();
      if (dashArr != null && dashArr.length == 2) {
        map.putDouble("dashGap", borderStyle.getDashArr()[1]);
      }
    }
  }


  @Override
  public void updateAnnotation(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateAnnotation(annotation, annotMap);
    CPDFCircleAnnotation circleAnnotation = (CPDFCircleAnnotation) annotation;
    String borderColor = annotMap.getString("borderColor");
    double borderAlpha = annotMap.getDouble("borderAlpha");
    String fillColor = annotMap.getString("fillColor");
    double fillAlpha = annotMap.getDouble("fillAlpha");
    double borderWidth = annotMap.getDouble("borderWidth");
    String bordEffectType = annotMap.getString("bordEffectType");
    double dashGap = annotMap.getDouble("dashGap");
    circleAnnotation.setBorderColor(Color.parseColor(borderColor));
    circleAnnotation.setBorderAlpha((int) borderAlpha);
    circleAnnotation.setFillColor(Color.parseColor(fillColor));
    circleAnnotation.setFillAlpha((int) fillAlpha);
    circleAnnotation.setBorderWidth((float) borderWidth);
    CPDFBorderEffectType cpdfBorderEffectType = CPDFEnumConvertUtil.stringToBordEffectType(
      bordEffectType);
    if (cpdfBorderEffectType != circleAnnotation.getBordEffectType()) {
      circleAnnotation.setBordEffectType(cpdfBorderEffectType);
      if (cpdfBorderEffectType == CPDFBorderEffectType.CPDFBorderEffectTypeCloudy){
        circleAnnotation.setBordEffectIntensity(BorderEffectIntensity.INTENSITY_ONE);
      }else {
        circleAnnotation.setBordEffectIntensity(BorderEffectIntensity.INTENSITY_ZERO);
      }
    }
    CPDFBorderStyle borderStyle = circleAnnotation.getBorderStyle();
    if (borderStyle != null) {
      float[] dashArr = borderStyle.getDashArr();
      if (dashArr != null && dashArr.length == 2) {
        dashArr[1] = (float) dashGap;
      } else {
        dashArr = new float[]{8.0F, (float) dashGap};
      }
      if (dashGap > 0) {
        borderStyle.setStyle(Style.Border_Dashed);
      } else {
        borderStyle.setStyle(Style.Border_Solid);
      }
      borderStyle.setDashArr(dashArr);
      circleAnnotation.setBorderStyle(borderStyle);
    }else {
      Style style;
      if (dashGap == 0.0) {
        style = Style.Border_Solid;
      } else {
        style = Style.Border_Dashed;
      }
      CPDFBorderStyle newBorderStyle = new CPDFBorderStyle(style,
        (float) borderWidth, new float[]{8.0F, (float) dashGap});
      circleAnnotation.setBorderStyle(newBorderStyle);
    }
  }

  @Override
  public CPDFAnnotation addAnnotation(CPDFDocument document, ReadableMap annotMap) {
    super.addAnnotation(document, annotMap);
    int pageIndex = annotMap.getInt("page");
    String title = annotMap.getString("title");
    String content = annotMap.getString("content");
    ReadableMap rectMap = annotMap.getMap("rect");
    double left = rectMap.getDouble("left");
    double top = rectMap.getDouble("top");
    double right = rectMap.getDouble("right");
    double bottom = rectMap.getDouble("bottom");

    com.compdfkit.core.page.CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFCircleAnnotation circleAnnotation = (CPDFCircleAnnotation) page.addAnnot(
      CPDFAnnotation.Type.CIRCLE);
    if (circleAnnotation.isValid()) {
      RectF rectF = new RectF((float) left, (float) top, (float) right, (float) bottom);

      circleAnnotation.setRect(rectF);
      circleAnnotation.setTitle(title);
      circleAnnotation.setContent(content);

      if (annotMap.hasKey("createDate")) {
        Double createDateTimestamp = annotMap.getDouble("createDate");
        circleAnnotation.setCreationDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
        circleAnnotation.setRecentlyModifyDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
      } else {
        circleAnnotation.setCreationDate(TTimeUtil.getCurrentDate());
        circleAnnotation.setRecentlyModifyDate(TTimeUtil.getCurrentDate());
      }

      updateAnnotation(circleAnnotation, annotMap);

      circleAnnotation.updateAp();
    }
    return circleAnnotation;
  }
}
