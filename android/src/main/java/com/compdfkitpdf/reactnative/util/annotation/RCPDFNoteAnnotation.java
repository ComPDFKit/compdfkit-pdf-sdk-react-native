package com.compdfkitpdf.reactnative.util.annotation;


import android.graphics.Color;
import android.util.Log;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFTextAnnotation;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

public class RCPDFNoteAnnotation extends RCPDFBaseAnnotation{


  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    CPDFTextAnnotation textAnnotation = (CPDFTextAnnotation) annotation;
    map.putString("type", "note");
    map.putString("color", CAppUtils.toHexColor(textAnnotation.getColor()));
    map.putDouble("alpha", textAnnotation.getAlpha());
  }



  @Override
  public void updateAnnotation(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateAnnotation(annotation, annotMap);
    String hexColor = annotMap.getString("color");
    double alpha = annotMap.getDouble("alpha");
    CPDFTextAnnotation textAnnotation = (CPDFTextAnnotation) annotation;
    textAnnotation.setColor(Color.parseColor(hexColor));
    textAnnotation.setAlpha((int) alpha);
  }

  @Override
  public CPDFAnnotation addAnnotation(CPDFDocument document, ReadableMap annotMap) {
    super.addAnnotation(document, annotMap);
    int pageIndex = annotMap.getInt("page");
    String title = annotMap.getString("title");
    String content = annotMap.getString("content");
    ReadableMap rectMap = annotMap.getMap("rect");
    double left =  rectMap.getDouble("left");
    double top =  rectMap.getDouble("top");
    double right =  rectMap.getDouble("right");
    double bottom =  rectMap.getDouble("bottom");

    String hexColor = annotMap.getString("color");
    double alpha = annotMap.getDouble("alpha");

    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFTextAnnotation textAnnotation = (CPDFTextAnnotation) page.addAnnot(CPDFAnnotation.Type.TEXT);
    if (textAnnotation.isValid()){
      android.graphics.RectF rectF = new android.graphics.RectF((float) left, (float) top, (float) right, (float) bottom);
      textAnnotation.setRect(rectF);
      textAnnotation.setTitle(title);
      textAnnotation.setContent(content);
      textAnnotation.setColor(Color.parseColor(hexColor));
      textAnnotation.setAlpha((int) alpha);
      if (annotMap.hasKey("createDate")){
        Double createDateTimestamp = annotMap.getDouble("createDate");
        textAnnotation.setCreationDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
        textAnnotation.setRecentlyModifyDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
      }else {
        textAnnotation.setCreationDate(TTimeUtil.getCurrentDate());
        textAnnotation.setRecentlyModifyDate(TTimeUtil.getCurrentDate());
      }
      textAnnotation.updateAp();
    }
    return textAnnotation;
  }
}
