package com.compdfkitpdf.reactnative.codec.annotation;


import android.graphics.Color;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFFreetextAnnotation;
import com.compdfkit.core.annotation.CPDFTextAttribute;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.util.RnAppUtils;
import com.compdfkitpdf.reactnative.util.RnEnumConverter;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

/**
 * Maps free text annotation annotation data between native objects and React Native maps.
 */
public class RnFreeTextAnnotationCodec extends RnBaseAnnotationCodec {

  /**
   * Writes native properties into the React Native map.
   */
  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    CPDFFreetextAnnotation freetextAnnotation = (CPDFFreetextAnnotation) annotation;
    map.putDouble("alpha", freetextAnnotation.getAlpha());
    CPDFTextAttribute textAttribute = freetextAnnotation.getFreetextDa();
    WritableMap textAttributeMap = Arguments.createMap();
    textAttributeMap.putString("color", RnAppUtils.toHexColor(textAttribute.getColor()));
    String[] names = RnEnumConverter.parseFamilyAndStyleFromPsName(textAttribute.getFontName());
    map.putString("alignment", RnEnumConverter.freeTextAlignmentToString(freetextAnnotation.getFreetextAlignment()));
    textAttributeMap.putString("familyName", names[0]);
    textAttributeMap.putString("styleName", names[1]);
    textAttributeMap.putDouble("fontSize", textAttribute.getFontSize());
    map.putMap("textAttribute", textAttributeMap);
  }


  /**
   * Updates annotation.
   */
  @Override
  public void updateAnnotation(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateAnnotation(annotation, annotMap);
    CPDFFreetextAnnotation freetextAnnotation = (CPDFFreetextAnnotation) annotation;
    double alpha = annotMap.getDouble("alpha");
    String alignment = annotMap.getString("alignment");
    ReadableMap textAttributeMap = annotMap.getMap("textAttribute");
    String textColor = textAttributeMap.getString("color");
    double fontSize =  textAttributeMap.getDouble("fontSize");
    String familyName = textAttributeMap.getString("familyName");
    String styleName = textAttributeMap.getString("styleName");
    String psName = CPDFTextAttribute.FontNameHelper.obtainFontName(familyName, styleName);
    freetextAnnotation.setAlpha((int) alpha);
    freetextAnnotation.setFreetextAlignment(RnEnumConverter.stringToFreeTextAlignment(alignment));
    freetextAnnotation.setFreetextDa(new CPDFTextAttribute(psName, (float) fontSize,
      Color.parseColor(textColor)));

  }

  /**
   * Adds annotation.
   */
  @Override
  public CPDFAnnotation addAnnotation(CPDFDocument document, ReadableMap annotMap) {
    int pageIndex =  annotMap.getInt("page");
    String title = annotMap.getString("title");
    String content = annotMap.getString("content");
    ReadableMap rectMap = annotMap.getMap("rect");
    double left =  rectMap.getDouble("left");
    double top =  rectMap.getDouble("top");
    double right =  rectMap.getDouble("right");
    double bottom =  rectMap.getDouble("bottom");

    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFFreetextAnnotation freetextAnnotation = (CPDFFreetextAnnotation) page.addAnnot(CPDFAnnotation.Type.FREETEXT);
    if (freetextAnnotation.isValid()){
      android.graphics.RectF rectF = new android.graphics.RectF((float) left, (float) top, (float) right, (float) bottom);
      freetextAnnotation.setRect(rectF);
      freetextAnnotation.setTitle(title);
      freetextAnnotation.setContent(content);
      freetextAnnotation.setBorderWidth(0);

      if (annotMap.hasKey("createDate")){
        Double createDateTimestamp = annotMap.getDouble("createDate");
        freetextAnnotation.setCreationDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
        freetextAnnotation.setRecentlyModifyDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
      } else {
        freetextAnnotation.setCreationDate(TTimeUtil.getCurrentDate());
        freetextAnnotation.setRecentlyModifyDate(TTimeUtil.getCurrentDate());
      }

      updateAnnotation(freetextAnnotation, annotMap);

      freetextAnnotation.updateAp();
    }
    return freetextAnnotation;
  }
}
