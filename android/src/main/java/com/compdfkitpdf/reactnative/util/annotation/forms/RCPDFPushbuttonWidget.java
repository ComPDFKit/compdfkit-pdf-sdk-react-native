package com.compdfkitpdf.reactnative.util.annotation.forms;

import android.graphics.Color;
import android.graphics.RectF;
import android.text.TextUtils;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFTextAttribute;
import com.compdfkit.core.annotation.form.CPDFPushbuttonWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.annotation.form.CPDFWidget.BorderStyle;
import com.compdfkit.core.annotation.form.CPDFWidget.WidgetType;
import com.compdfkit.core.document.CPDFDestination;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.document.action.CPDFAction;
import com.compdfkit.core.document.action.CPDFAction.ActionType;
import com.compdfkit.core.document.action.CPDFGoToAction;
import com.compdfkit.core.document.action.CPDFUriAction;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.compdfkitpdf.reactnative.util.CPDFEnumConvertUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;


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
    map.putString("fontColor", CAppUtils.toHexColor(pushbuttonWidget.getFontColor()));
    map.putDouble("fontSize", pushbuttonWidget.getFontSize());
    String psName = pushbuttonWidget.getFontName();
    String[] names = CPDFEnumConvertUtil.parseFamilyAndStyleFromPsName(psName);

    map.putString("familyName", names[0]);
    map.putString("styleName", names[1]);
  }


  @Override
  public void updateWidget(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateWidget(annotation, annotMap);
    CPDFPushbuttonWidget pushButtonWidget = (CPDFPushbuttonWidget) annotation;

    String buttonTitle = annotMap.getString("buttonTitle");
    String fontColor = annotMap.getString("fontColor");
    double fontSize = annotMap.getDouble("fontSize");
    String familyName = annotMap.getString("familyName");
    String styleName = annotMap.getString("styleName");
    String psName = CPDFTextAttribute.FontNameHelper.obtainFontName(familyName, styleName);

    pushButtonWidget.setFontName(psName);
    pushButtonWidget.setButtonTitle(buttonTitle);
    pushButtonWidget.setFontSize((float) fontSize);
    pushButtonWidget.setFontColor(Color.parseColor(fontColor));

    ReadableMap actionMap = annotMap.getMap("action");
    if (actionMap != null){
      String actionType = actionMap.getString("actionType");
      if ("uri".equals(actionType)){
        String uri = actionMap.getString("uri");
        CPDFUriAction uriAction = new CPDFUriAction();
        uriAction.setUri(uri);
        pushButtonWidget.setButtonAction(uriAction);
      } else if ("goTo".equals(actionType)){
        int pageIndex = actionMap.getInt("pageIndex");
        float height = document.pageAtIndex(pageIndex).getSize().height();
        CPDFDestination destination = new CPDFDestination(pageIndex, 0F, height, 1F);
        CPDFGoToAction goToAction = new CPDFGoToAction();
        goToAction.setDestination(document, destination);
        pushButtonWidget.setButtonAction(goToAction);
      }
    }
  }

  @Override
  public CPDFWidget addWidget(CPDFDocument document, ReadableMap widgetMap) {
    int pageIndex = widgetMap.getInt("page");
    ReadableMap rectMap = widgetMap.getMap("rect");
    double left =  rectMap.getDouble("left");
    double top =  rectMap.getDouble("top");
    double right =  rectMap.getDouble("right");
    double bottom =  rectMap.getDouble("bottom");
    String title = widgetMap.getString("title");

    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFPushbuttonWidget widget = (CPDFPushbuttonWidget) page.addFormWidget(
      WidgetType.Widget_PushButton);

    if (widget.isValid()){

      RectF rectF = new RectF((float) left, (float) top, (float) right, (float) bottom);
      widget.setRect(rectF);
      widget.setBorderStyles(BorderStyle.BS_Solid);
      if (TextUtils.isEmpty(title)){
        widget.setFieldName(CAppUtils.getDefaultFiledName("Push Button_"));
      } else {
        widget.setFieldName(title);
      }
      if (widgetMap.hasKey("createDate") ){
        Double createDateTimestamp = widgetMap.getDouble("createDate");
        widget.setCreationDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
        widget.setRecentlyModifyDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
      } else {
        widget.setCreationDate(TTimeUtil.getCurrentDate());
        widget.setRecentlyModifyDate(TTimeUtil.getCurrentDate());
      }
      updateWidget(widget, widgetMap);
      widget.updateAp();
    }
    return widget;
  }

}
