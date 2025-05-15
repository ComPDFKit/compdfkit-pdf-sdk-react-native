package com.compdfkitpdf.reactnative.util.annotation;


import static com.compdfkitpdf.reactnative.util.annotation.forms.RCPDFPushbuttonWidget.getActionType;

import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFLinkAnnotation;
import com.compdfkit.core.document.CPDFDestination;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.document.action.CPDFAction;
import com.compdfkit.core.document.action.CPDFAction.ActionType;
import com.compdfkit.core.document.action.CPDFGoToAction;
import com.compdfkit.core.document.action.CPDFUriAction;
import com.facebook.react.bridge.Arguments;
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
      actionMap.putString("actionType", getActionType(action));
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



}
