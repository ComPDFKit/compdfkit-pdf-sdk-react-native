package com.compdfkitpdf.reactnative.codec.annotation;


import android.graphics.Color;
import android.graphics.RectF;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFMarkupAnnotation;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.page.CPDFTextSelection;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.util.RnAppUtils;
import com.compdfkitpdf.reactnative.util.RnEnumConverter;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

/**
 * Maps markup annotation annotation data between native objects and React Native maps.
 */
public class RnMarkupAnnotationCodec extends RnBaseAnnotationCodec{

  /**
   * Writes native properties into the React Native map.
   */
  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    if (annotation instanceof CPDFMarkupAnnotation){
      CPDFMarkupAnnotation markupAnnotation = (CPDFMarkupAnnotation) annotation;
      map.putString("markedText", markupAnnotation.getMarkedText());
      map.putString("color", RnAppUtils.toHexColor(markupAnnotation.getColor()));
      map.putInt("alpha", markupAnnotation.getAlpha());
    }
  }


  /**
   * Updates annotation.
   */
  @Override
  public void updateAnnotation(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateAnnotation(annotation, annotMap);
    CPDFMarkupAnnotation markupAnnotation = (CPDFMarkupAnnotation) annotation;
    String hexColor = annotMap.getString("color");
    double alpha = annotMap.getDouble("alpha");
    markupAnnotation.setColor(Color.parseColor(hexColor));
    markupAnnotation.setAlpha((int) alpha);
  }

  /**
   * Adds annotation.
   */
  @Override
  public CPDFAnnotation addAnnotation(CPDFDocument document, ReadableMap annotMap) {
    String annotationType = annotMap.getString("type");
    CPDFAnnotation.Type type = RnEnumConverter.stringToCPDFAnnotType(annotationType);
    int pageIndex = annotMap.getInt("page");
    String title = annotMap.getString("title");
    String content = annotMap.getString("content");
    ReadableMap rectMap = annotMap.getMap("rect");
    double left =  rectMap.getDouble("left");
    double top =  rectMap.getDouble("top");
    double right =  rectMap.getDouble("right");
    double bottom =  rectMap.getDouble("bottom");

    String markedText = annotMap.getString("markedText");
    String color = annotMap.getString("color");
    double alpha = annotMap.getDouble("alpha");

    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFMarkupAnnotation markupAnnotation = (CPDFMarkupAnnotation) page.addAnnot(type);
    if (markupAnnotation.isValid()){
      RectF rectF = new RectF((float) left, (float) top, (float) right, (float) bottom);

      CPDFTextSelection[] selections  = page.getTextPage().getSelectionsByLineForRect(rectF);
      RectF[] rectFs;
      if (selections != null) {
        rectFs = new RectF[selections.length];
        for (int i = 0; i < selections.length; i++) {
          rectFs[i] = selections[i].getRectF();
        }
      }else {
        rectFs = new RectF[]{rectF};
      }
      markupAnnotation.setQuadRects(rectFs);
      markupAnnotation.setTitle(title);
      markupAnnotation.setContent(content);
      markupAnnotation.setMarkedText(markedText);
      markupAnnotation.setRect(rectF);
      markupAnnotation.setColor(Color.parseColor(color));
      markupAnnotation.setAlpha((int) alpha);
      if (annotMap.hasKey("createDate")){
        Double createDateTimestamp = annotMap.getDouble("createDate");
        markupAnnotation.setCreationDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
        markupAnnotation.setRecentlyModifyDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
      }else {
        markupAnnotation.setCreationDate(TTimeUtil.getCurrentDate());
        markupAnnotation.setRecentlyModifyDate(TTimeUtil.getCurrentDate());
      }
      markupAnnotation.updateAp();
    }

    return markupAnnotation;
  }
}
