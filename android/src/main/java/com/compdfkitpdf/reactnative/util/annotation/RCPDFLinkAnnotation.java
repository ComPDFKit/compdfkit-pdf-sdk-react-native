package com.compdfkitpdf.reactnative.util.annotation;


import android.graphics.RectF;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.Type;
import com.compdfkit.core.annotation.CPDFLinkAnnotation;
import com.compdfkit.core.document.CPDFDestination;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.document.action.CPDFAction;
import com.compdfkit.core.document.action.CPDFAction.ActionType;
import com.compdfkit.core.document.action.CPDFGoToAction;
import com.compdfkit.core.document.action.CPDFUriAction;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.util.CPDFEnumConvertUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

public class RCPDFLinkAnnotation extends RCPDFBaseAnnotation {

  private CPDFDocument document;

  public void setDocument(CPDFDocument document) {
    this.document = document;
  }

  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    CPDFLinkAnnotation linkAnnotation = (CPDFLinkAnnotation) annotation;
    CPDFAction action = linkAnnotation.getLinkAction();
    if (action != null){
      WritableMap actionMap =  Arguments.createMap();
      actionMap.putString("actionType", CPDFEnumConvertUtil.actionTypeToString(action));
      if (action.getActionType() == ActionType.PDFActionType_URI){
        CPDFUriAction uriAction = (CPDFUriAction) action;
        String uri = uriAction.getUri();
        if (uri.startsWith("mailto:")){
          uri = uri.replaceAll("mailto:", "");
        }
        actionMap.putString("uri", uri);
      } else if (action.getActionType() == ActionType.PDFActionType_GoTo){
        CPDFGoToAction goToAction = (CPDFGoToAction) action;
        if (document != null){
          CPDFDestination destination = goToAction.getDestination(document);
          actionMap.putInt("pageIndex", destination.getPageIndex());
        }
      }
      map.putMap("action", actionMap);
    }
  }


  @Override
  public void updateAnnotation(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateAnnotation(annotation, annotMap);

    CPDFLinkAnnotation linkAnnotation = (CPDFLinkAnnotation) annotation;
    ReadableMap actionMap = annotMap.getMap("action");
    if (actionMap != null){
      String actionType = actionMap.getString("actionType");
      if ("uri".equals(actionType)){
        String uri = actionMap.getString("uri");
        CPDFUriAction uriAction = new CPDFUriAction();
        uriAction.setUri(uri);
        linkAnnotation.setLinkAction(uriAction);
      } else if ("goTo".equals(actionType)){
        int pageIndex = actionMap.getInt("pageIndex");
        float height = document.pageAtIndex(pageIndex).getSize().height();
        CPDFDestination destination = new CPDFDestination(pageIndex, 0F, height, 1F);
        CPDFGoToAction goToAction = new CPDFGoToAction();
        goToAction.setDestination(document, destination);
        linkAnnotation.setLinkAction(goToAction);
      }
    }

  }


  @Override
  public CPDFAnnotation addAnnotation(CPDFDocument document,ReadableMap annotMap) {
    String annotationType = annotMap.getString("type");
    CPDFAnnotation.Type type = CPDFEnumConvertUtil.stringToCPDFAnnotType(annotationType);
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
