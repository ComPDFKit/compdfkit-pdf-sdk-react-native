package com.compdfkitpdf.reactnative.codec.widget;

import android.graphics.Color;
import android.graphics.RectF;
import android.text.TextUtils;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFTextAttribute;
import com.compdfkit.core.annotation.form.CPDFPushbuttonWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.annotation.form.CPDFWidget.BorderStyle;
import com.compdfkit.core.annotation.form.CPDFWidget.WidgetType;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.document.action.CPDFAction;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.codec.RnActionCodec;
import com.compdfkitpdf.reactnative.util.RnAppUtils;
import com.compdfkitpdf.reactnative.util.RnEnumConverter;
import com.compdfkitpdf.reactnative.codec.RnDocumentAware;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;


/**
 * Maps push button widget data between native objects and React Native maps.
 */
public class RnPushButtonWidgetCodec extends RnBaseWidgetCodec implements RnDocumentAware {

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
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFPushbuttonWidget pushbuttonWidget = (CPDFPushbuttonWidget) widget;
    map.putString("type", "pushButton");
    map.putString("buttonTitle", pushbuttonWidget.getButtonTitle());
    CPDFAction action = pushbuttonWidget.getButtonAction();
    WritableMap actionMap = RnActionCodec.encodeAction(document, action);
    if (actionMap != null) {
      map.putMap("action", actionMap);
    }
    map.putString("fontColor", RnAppUtils.toHexColor(pushbuttonWidget.getFontColor()));
    map.putDouble("fontSize", pushbuttonWidget.getFontSize());
    String psName = pushbuttonWidget.getFontName();
    String[] names = RnEnumConverter.parseFamilyAndStyleFromPsName(psName);

    map.putString("familyName", names[0]);
    map.putString("styleName", names[1]);
  }


  /**
   * Updates widget.
   */
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
    CPDFAction action = RnActionCodec.decodeAction(document, actionMap);
    if (action != null) {
      pushButtonWidget.setButtonAction(action);
    }
  }

  /**
   * Adds widget.
   */
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
        widget.setFieldName(RnAppUtils.getDefaultFiledName("Push Button_"));
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
