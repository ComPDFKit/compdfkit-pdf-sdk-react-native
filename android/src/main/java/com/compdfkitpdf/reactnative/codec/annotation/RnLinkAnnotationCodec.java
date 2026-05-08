package com.compdfkitpdf.reactnative.codec.annotation;


import android.graphics.RectF;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.Type;
import com.compdfkit.core.annotation.CPDFLinkAnnotation;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.document.action.CPDFAction;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.codec.RnActionCodec;
import com.compdfkitpdf.reactnative.util.RnEnumConverter;
import com.compdfkitpdf.reactnative.codec.RnDocumentAware;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

/**
 * Maps link annotation annotation data between native objects and React Native maps.
 */
public class RnLinkAnnotationCodec extends RnBaseAnnotationCodec implements RnDocumentAware {

  private CPDFDocument document;

  /**
   * Sets the document.
   */
  public void setDocument(CPDFDocument document) {
    this.document = document;
  }

  /**
   * Writes native properties into the React Native map.
   */
  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    CPDFLinkAnnotation linkAnnotation = (CPDFLinkAnnotation) annotation;
    CPDFAction action = linkAnnotation.getLinkAction();
    WritableMap actionMap = RnActionCodec.encodeAction(document, action);
    if (actionMap != null) {
      map.putMap("action", actionMap);
    }
  }


  /**
   * Updates annotation.
   */
  @Override
  public void updateAnnotation(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateAnnotation(annotation, annotMap);

    CPDFLinkAnnotation linkAnnotation = (CPDFLinkAnnotation) annotation;
    ReadableMap actionMap = annotMap.getMap("action");
    CPDFAction action = RnActionCodec.decodeAction(document, actionMap);
    if (action != null) {
      linkAnnotation.setLinkAction(action);
    }
  }


  /**
   * Adds annotation.
   */
  @Override
  public CPDFAnnotation addAnnotation(CPDFDocument document,ReadableMap annotMap) {
    String annotationType = annotMap.getString("type");
    CPDFAnnotation.Type type = RnEnumConverter.stringToCPDFAnnotType(annotationType);
    int pageIndex =  annotMap.getInt("page");
    String title = annotMap.getString("title");
    String content = annotMap.getString("content");
    ReadableMap rectMap =  annotMap.getMap("rect");
    double left =  rectMap.getDouble("left");
    double top =  rectMap.getDouble("top");
    double right =  rectMap.getDouble("right");
    double bottom =  rectMap.getDouble("bottom");

    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFLinkAnnotation linkAnnotation = (CPDFLinkAnnotation) page.addAnnot(Type.LINK);
    if (linkAnnotation.isValid()){
      RectF rectF = new RectF((float) left, (float) top, (float) right, (float) bottom);
      linkAnnotation.setTitle(title);
      linkAnnotation.setContent(content);
      linkAnnotation.setRect(rectF);

      if (annotMap.hasKey("createDate")){
        Double createDateTimestamp = annotMap.getDouble("createDate");
        linkAnnotation.setCreationDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
        linkAnnotation.setRecentlyModifyDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
      } else {
        linkAnnotation.setCreationDate(TTimeUtil.getCurrentDate());
        linkAnnotation.setRecentlyModifyDate(TTimeUtil.getCurrentDate());
      }

      updateAnnotation(linkAnnotation, annotMap);

      linkAnnotation.updateAp();
    }

    return linkAnnotation;
  }



}
