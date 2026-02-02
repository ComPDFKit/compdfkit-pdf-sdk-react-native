package com.compdfkitpdf.reactnative.util.annotation;


import android.graphics.Color;
import android.graphics.PointF;
import android.graphics.RectF;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.Type;
import com.compdfkit.core.annotation.CPDFInkAnnotation;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

public class RCPDFInkAnnotation extends RCPDFBaseAnnotation{


  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    CPDFInkAnnotation inkAnnotation = (CPDFInkAnnotation) annotation;
    map.putString("color", CAppUtils.toHexColor(inkAnnotation.getColor()));
    map.putInt("alpha", inkAnnotation.getAlpha());
    map.putDouble("borderWidth", inkAnnotation.getBorderWidth());
    PointF[][] pointfs = inkAnnotation.getInkPath();
    WritableArray inkPathArray = Arguments.createArray();
    if (pointfs != null) {
      for (PointF[] stroke : pointfs) {
        WritableArray strokeArray = Arguments.createArray();
        for (PointF point : stroke) {
          WritableArray pointArray = Arguments.createArray();
          pointArray.pushDouble(point.x);
          pointArray.pushDouble(point.y);
          strokeArray.pushArray(pointArray);
        }
        inkPathArray.pushArray(strokeArray);
      }
    }
    map.putArray("inkPath", inkPathArray);
  }



  @Override
  public void updateAnnotation(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateAnnotation(annotation, annotMap);
    String hexColor = annotMap.getString("color").toString();
    double alpha = annotMap.getDouble("alpha");
    double borderWidth = annotMap.getDouble("borderWidth");
    CPDFInkAnnotation inkAnnotation = (CPDFInkAnnotation) annotation;
    inkAnnotation.setColor(Color.parseColor(hexColor));
    inkAnnotation.setAlpha((int) alpha);
    inkAnnotation.setBorderWidth((float) borderWidth);
  }

  @Override
  public CPDFAnnotation addAnnotation(CPDFDocument document, ReadableMap annotMap) {
    int pageIndex = annotMap.getInt("page");
    String title = annotMap.getString("title");
    String content = annotMap.getString("content");
    ReadableMap rectMap =  annotMap.getMap("rect");
    if (rectMap == null){
      rectMap = Arguments.createMap();
    }

    double left =  rectMap.getDouble("left");
    double top =  rectMap.getDouble("top");
    double right =  rectMap.getDouble("right");
    double bottom =  rectMap.getDouble("bottom");

    String color = annotMap.getString("color");
    double alpha =  annotMap.getDouble("alpha");
    double borderWidth =  annotMap.getDouble("borderWidth");

    ReadableArray inkPathArray = annotMap.hasKey("inkPath") ? annotMap.getArray("inkPath") : null;

    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFInkAnnotation inkAnnotation = (CPDFInkAnnotation) page.addAnnot(
      Type.INK);

    if (inkAnnotation.isValid()) {

      inkAnnotation.setTitle(title);
      inkAnnotation.setContent(content);
      inkAnnotation.setBorderWidth((float) borderWidth);
      inkAnnotation.setColor(Color.parseColor(color));
      inkAnnotation.setAlpha((int) alpha);

      if (annotMap.hasKey("createDate")){
        Double createDateTimestamp = annotMap.getDouble("createDate");
        inkAnnotation.setCreationDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
        inkAnnotation.setRecentlyModifyDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
      } else {
        inkAnnotation.setCreationDate(TTimeUtil.getCurrentDate());
        inkAnnotation.setRecentlyModifyDate(TTimeUtil.getCurrentDate());
      }

      RectF pageSize = document.getPageSize(pageIndex);
      if (pageSize == null || pageSize.isEmpty()) {
        return inkAnnotation;
      }

      int lineCount = inkPathArray != null ? inkPathArray.size() : 0;
      PointF[][] path = new PointF[lineCount][];
      RectF rect = null;
      for (int lineIndex = 0; lineIndex < lineCount; lineIndex++) {
        ReadableArray strokeArray = inkPathArray.getArray(lineIndex);
        int pointCount = strokeArray != null ? strokeArray.size() : 0;
        PointF[] linePath = new PointF[pointCount];
        for (int pointIndex = 0; pointIndex < pointCount; pointIndex++) {
          ReadableArray pointArray = strokeArray.getArray(pointIndex);
          double x = (pointArray != null && pointArray.size() > 0) ? pointArray.getDouble(0) : 0d;
          double y = (pointArray != null && pointArray.size() > 1) ? pointArray.getDouble(1) : 0d;
          float fx = (float) x;
          float fy = (float) y;
          if (rect == null) {
            rect = new RectF(fx, fy, fx, fy);
          } else {
            rect.union(fx, fy);
          }
          linePath[pointIndex] = new PointF(fx, fy);
        }
        path[lineIndex] = linePath;
      }
      if (rect != null) {
        float scaleValue = 1F;
        float dx = (float) borderWidth / scaleValue / 2f;
        rect.inset(-dx, -dx);
      } else {
        rect = new RectF((float) left, (float) top, (float) right, (float) bottom);
      }
      inkAnnotation.setInkPath(path);
      inkAnnotation.setRect(rect);
      inkAnnotation.updateAp();
    }
    return inkAnnotation;
  }


}
