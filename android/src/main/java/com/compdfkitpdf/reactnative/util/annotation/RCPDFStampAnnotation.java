package com.compdfkitpdf.reactnative.util.annotation;


import android.graphics.Bitmap;
import android.graphics.RectF;
import android.text.TextUtils;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFStampAnnotation;
import com.compdfkit.core.annotation.CPDFStampAnnotation.TextStamp;
import com.compdfkit.core.annotation.CPDFStampAnnotation.TextStampShape;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.compdfkitpdf.reactnative.util.CPDFEnumConvertUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

public class RCPDFStampAnnotation extends RCPDFBaseAnnotation{


  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    CPDFStampAnnotation stampAnnotation = (CPDFStampAnnotation) annotation;
    if (stampAnnotation.isStampSignature()) {
      map.putString("type", "signature");
    } else {
      String stampTypeStr = CPDFEnumConvertUtil.stampTypeToString(
        stampAnnotation.getStampType());
      switch (stampAnnotation.getStampType()) {
        case STANDARD_STAMP:
          map.putString("type", "stamp");
          map.putString("stampType", stampTypeStr);
          String standardStampStr = CPDFEnumConvertUtil.standardStampToString(stampAnnotation.getStandardStamp());
          map.putString("standardStamp", standardStampStr);
          break;
        case TEXT_STAMP:
          map.putString("type", "stamp");
          map.putString("stampType", stampTypeStr);
          WritableMap textStampMap = Arguments.createMap();
          TextStamp textStamp = stampAnnotation.getTextStamp();
          textStampMap.putString("content", textStamp.getContent());
          textStampMap.putString("date", textStamp.getDate());
          textStampMap.putString("shape",
            CPDFEnumConvertUtil.stampShapeToString(textStamp.getTextStampShape()));
          textStampMap.putString("color",
            CPDFEnumConvertUtil.stampColorToString(textStamp.getTextStampColor()));
          map.putMap("textStamp", textStampMap);
          break;
        case IMAGE_STAMP:
          map.putString("type", "pictures");
          map.putString("stampType", stampTypeStr);
          break;
      }
    }
  }


  @Override
  public void updateAnnotation(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateAnnotation(annotation, annotMap);
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

    String stampTypeStr = annotMap.getString("stampType");

    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFStampAnnotation stampAnnotation = (CPDFStampAnnotation) page.addAnnot(
      CPDFAnnotation.Type.STAMP);
    if (stampAnnotation.isValid()) {

      stampAnnotation.setTitle(title);
      stampAnnotation.setContent(content);

      if (annotMap.hasKey("createDate")){
        Double createDateTimestamp = annotMap.getDouble("createDate");
        stampAnnotation.setCreationDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
        stampAnnotation.setRecentlyModifyDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
      } else {
        stampAnnotation.setCreationDate(TTimeUtil.getCurrentDate());
        stampAnnotation.setRecentlyModifyDate(TTimeUtil.getCurrentDate());
      }

      CPDFStampAnnotation.StampType stampType = CPDFEnumConvertUtil.stringToStampType(
        stampTypeStr);
      if (stampType == CPDFStampAnnotation.StampType.STANDARD_STAMP) {
        String standardStampStr = annotMap.getString("standardStamp");
        stampAnnotation.setStandardStamp(
          CPDFEnumConvertUtil.stringToStandardStamp(standardStampStr));
        RectF sourceRect = stampAnnotation.getRect();
        RectF adjusted = computeAdjustedRect(sourceRect, (float) left, (float) top, (float) right, (float) bottom);
        stampAnnotation.setRect(adjusted);
      } else if (stampType == CPDFStampAnnotation.StampType.TEXT_STAMP) {
        ReadableMap textStampMap = annotMap.getMap(
          "textStamp");
        String textStampContent = textStampMap.getString("content");
        String date = textStampMap.getString("date");
        TextStampShape shape = CPDFEnumConvertUtil.stringToStampShape(
          textStampMap.getString("shape"));
        CPDFStampAnnotation.TextStampColor color = CPDFEnumConvertUtil.stringToStampColor(
          textStampMap.getString("color"));
        TextStamp textStamp = new TextStamp(textStampContent, date, shape.id, color.id);
        stampAnnotation.setTextStamp(textStamp);
        RectF sourceRect = stampAnnotation.getRect();
        RectF adjusted = computeAdjustedRect(sourceRect, (float) left, (float) top, (float) right, (float) bottom);
        stampAnnotation.setRect(adjusted);
      } else if (stampType == CPDFStampAnnotation.StampType.IMAGE_STAMP) {
        // IMAGE_STAMP handling can be implemented here if needed.
        // Currently, we just set the rect as is.
        String base64Image = annotMap.getString("image");
        if (!TextUtils.isEmpty(base64Image)){
          Bitmap bitmap = CAppUtils.base64ToBitmap(base64Image);
          RectF sourceRect = new RectF(0, 0, bitmap.getWidth(), bitmap.getHeight());
          stampAnnotation.setRect(computeAdjustedRect(sourceRect,(float) left, (float) top, (float) right, (float) bottom));
          //base64Image convert to bitmap
          stampAnnotation.updateApWithBitmap(bitmap);
        }
        if (annotMap.hasKey("isStampSignature")){
          boolean isStampSignature = annotMap.getBoolean("isStampSignature");
          if (isStampSignature){
            stampAnnotation.setStampSignature(true);
          }
        }
      }
      // IMAGE_STAMP creation typically requires image resource prepared elsewhere.
      stampAnnotation.updateAp();
    }
    return stampAnnotation;
  }

  private RectF computeAdjustedRect(RectF sourceRect, float left, float top, float right, float bottom) {
    RectF rectF = new RectF(left, top, right, bottom);
    float targetWidth = rectF.width();
    float aspect = (sourceRect.width() == 0f) ? 1f : Math.abs(sourceRect.height() / sourceRect.width());
    float targetHeight = targetWidth * aspect;
    return new RectF(left, top, left + targetWidth, top + targetHeight);
  }


}
