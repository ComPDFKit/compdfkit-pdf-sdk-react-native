package com.compdfkitpdf.reactnative.util.annotation;


import android.graphics.Color;
import android.graphics.PointF;
import android.graphics.RectF;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFBorderStyle;
import com.compdfkit.core.annotation.CPDFBorderStyle.Style;
import com.compdfkit.core.annotation.CPDFLineAnnotation;
import com.compdfkit.core.annotation.CPDFLineAnnotation.LineType;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.compdfkitpdf.reactnative.util.CPDFEnumConvertUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.util.ArrayList;
import java.util.List;

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
    map.putString("lineHeadType",
      CPDFEnumConvertUtil.lineTypeToString(lineAnnotation.getLineHeadType()));
    map.putString("lineTailType",
      CPDFEnumConvertUtil.lineTypeToString(lineAnnotation.getLineTailType()));

    PointF[] linePoints = lineAnnotation.getLinePoints();
    WritableArray pointsArray = Arguments.createArray();
    if (linePoints != null) {
      for (PointF linePoint : linePoints) {
        WritableArray pointArray = Arguments.createArray();
        pointArray.pushDouble(linePoint.x);
        pointArray.pushDouble(linePoint.y);
        pointsArray.pushArray(pointArray);
      }
    }
    map.putArray("points", pointsArray);

    CPDFBorderStyle borderStyle = lineAnnotation.getBorderStyle();
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
    CPDFLineAnnotation lineAnnotation = (CPDFLineAnnotation) annotation;
    String borderColor = annotMap.getString("borderColor");
    double borderAlpha = annotMap.getDouble("borderAlpha");
    double borderWidth = annotMap.getDouble("borderWidth");

    String fillColor = annotMap.getString("fillColor");
    double fillAlpha = annotMap.getDouble("fillAlpha");

    double dashGap = annotMap.getDouble("dashGap");

    Style style;
    if (dashGap == 0.0) {
      style = Style.Border_Solid;
    } else {
      style = Style.Border_Dashed;
    }
    CPDFBorderStyle borderStyle = new CPDFBorderStyle(style,
      (float) borderWidth, new float[]{8.0F, (float) dashGap});
    lineAnnotation.setBorderStyle(borderStyle);

    lineAnnotation.setBorderColor(Color.parseColor(borderColor));
    lineAnnotation.setBorderAlpha((int) borderAlpha);
    lineAnnotation.setBorderWidth((float) borderWidth);
    lineAnnotation.setFillColor(Color.parseColor(fillColor));
    lineAnnotation.setFillAlpha((int) fillAlpha);

    LineType startLineType = CPDFEnumConvertUtil.stringToLineType(
      annotMap.getString("lineHeadType"));
    LineType tailLineType = CPDFEnumConvertUtil.stringToLineType(
      annotMap.getString("lineTailType"));

    lineAnnotation.setLineType(startLineType, tailLineType);
  }

  @Override
  public CPDFAnnotation addAnnotation(CPDFDocument document, ReadableMap annotMap) {
    super.addAnnotation(document, annotMap);
    int pageIndex = annotMap.getInt("page");
    String title = annotMap.getString("title");
    String content = annotMap.getString("content");
    double borderWidth = annotMap.getDouble("borderWidth");

    List<PointF> pointList = new ArrayList<>();
    if (annotMap.hasKey("points")) {
      ReadableArray pointsArray = annotMap.getArray("points");
      if (pointsArray != null && pointsArray.size() == 2) {
        for (int i = 0; i < 2; i++) {
          ReadableArray pointArray = pointsArray.getArray(i);
          if (pointArray != null && pointArray.size() == 2) {
            float x = (float) pointArray.getDouble(0);
            float y = (float) pointArray.getDouble(1);
            pointList.add(new PointF(x, y));
          }
        }
      }
    }

    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFLineAnnotation lineAnnotation = (CPDFLineAnnotation) page.addAnnot(
      CPDFAnnotation.Type.LINE);
    if (lineAnnotation.isValid()) {
      if (pointList.size() == 2) {
        PointF startPoint = pointList.get(0);
        PointF endPoint = pointList.get(1);
        RectF rectF = convertLinePoint(startPoint, endPoint, (float) borderWidth);
        lineAnnotation.setRect(rectF);
        lineAnnotation.setLinePoints(startPoint, endPoint);
      }

      if (annotMap.hasKey("createDate")){
        Double createDateTimestamp = annotMap.getDouble("createDate");
        lineAnnotation.setCreationDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
        lineAnnotation.setRecentlyModifyDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
      } else {
        lineAnnotation.setCreationDate(TTimeUtil.getCurrentDate());
        lineAnnotation.setRecentlyModifyDate(TTimeUtil.getCurrentDate());
      }

      // Set endpoints: from bottom-left to top-right within rect
      lineAnnotation.setTitle(title);
      lineAnnotation.setContent(content);

      updateAnnotation(lineAnnotation, annotMap);

      lineAnnotation.updateAp();
    }
    return lineAnnotation;
  }


  private RectF convertLinePoint(PointF startPoint, PointF endPoint, float borderWidth) {
    RectF area = new RectF();
    area.left = Math.min(startPoint.x, endPoint.x);
    area.right = Math.max(startPoint.x, endPoint.x);
    area.top = Math.max(startPoint.y, endPoint.y);
    area.bottom = Math.min(startPoint.y, endPoint.y);
    area.left -= borderWidth * 2;
    area.top += borderWidth * 2;
    area.right += borderWidth * 2;
    area.bottom -= borderWidth * 2;
    return area;
  }


}
