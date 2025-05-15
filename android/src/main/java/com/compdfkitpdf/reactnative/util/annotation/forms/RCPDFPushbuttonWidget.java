package com.compdfkitpdf.reactnative.util.annotation.forms;

import android.text.TextUtils;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFCheckboxWidget;
import com.compdfkit.core.annotation.form.CPDFPushbuttonWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.document.CPDFDestination;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.document.action.CPDFAction;
import com.compdfkit.core.document.action.CPDFAction.ActionType;
import com.compdfkit.core.document.action.CPDFGoToAction;
import com.compdfkit.core.document.action.CPDFUriAction;
import com.compdfkit.core.font.CPDFFont;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class RCPDFPushbuttonWidget extends RCPDFBaseWidget {

  private CPDFDocument document;

  public void setDocument(CPDFDocument document) {
    this.document = document;
  }

  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFPushbuttonWidget pushbuttonWidget = (CPDFPushbuttonWidget) widget;
    map.putString("type", "pushButton");
    map.putString("buttonTitle", pushbuttonWidget.getButtonTitle());
    CPDFAction action = pushbuttonWidget.getButtonAction();
    if (action != null){
      WritableMap actionMap = Arguments.createMap();
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
    map.putString("fontColor", CAppUtils.toHexColor(pushbuttonWidget.getFontColor()));
    map.putDouble("fontSize", pushbuttonWidget.getFontSize());
    String fontName = pushbuttonWidget.getFontName();
    String familyName = CPDFFont.getFamilyName(pushbuttonWidget.getFontName());
    String styleName = "Regular";
    if (TextUtils.isEmpty(familyName)){
      familyName = pushbuttonWidget.getFontName();
    }else {
      List<String> styleNames = CPDFFont.getStyleName(familyName);
      if (styleNames != null) {
        for (String styleNameItem : styleNames) {
          if (fontName.endsWith(styleNameItem)){
            styleName = styleNameItem;
          }
        }
      }
    }

    map.putString("familyName", familyName);
    map.putString("styleName", styleName);
  }


  public static String getActionType(CPDFAction action) {
    ActionType actionType = action.getActionType();
    switch (actionType) {
      case PDFActionType_Unknown:
        return "unknown";
      case PDFActionType_GoTo:
        return "goTo";
      case PDFActionType_GoToR:
        return "goToR";
      case PDFActionType_GoToE:
        return "goToE";
      case PDFActionType_Launch:
        return "launch";
      case PDFActionType_Thread:
        return "thread";
      case PDFActionType_URI:
        return "uri";
      case PDFActionType_Sound:
        return "sound";
      case PDFActionType_Movie:
        return "movie";
      case PDFActionType_Hide:
        return "hide";
      case PDFActionType_Named:
        return "named";
      case PDFActionType_SubmitForm:
        return "submitForm";
      case PDFActionType_ResetForm:
        return "resetForm";
      case PDFActionType_ImportData:
        return "importData";
      case PDFActionType_JavaScript:
        return "javaScript";
      case PDFActionType_SetOCGState:
        return "setOCGState";
      case PDFActionType_Rendition:
        return "rendition";
      case PDFActionType_Trans:
        return "trans";
      case PDFActionType_GoTo3DView:
        return "goTo3DView";
      case PDFActionType_UOP:
        return "uop";
      case PDFActionType_Error:
        return "error";
      default:
        return "unknown";
    }
  }
}
