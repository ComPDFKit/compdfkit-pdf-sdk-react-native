package com.compdfkitpdf.reactnative.util.annotation.forms;

import android.graphics.Color;
import android.graphics.RectF;
import android.text.TextUtils;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFTextAttribute;
import com.compdfkit.core.annotation.form.CPDFTextWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.annotation.form.CPDFWidget.BorderStyle;
import com.compdfkit.core.annotation.form.CPDFWidget.WidgetType;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.compdfkitpdf.reactnative.util.CPDFEnumConvertUtil;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;


public class RCPDFTextFieldWidget extends RCPDFBaseWidget {


  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFTextWidget textWidget = (CPDFTextWidget) widget;
    map.putString("type", "textField");
    map.putString("text", textWidget.getText());
    map.putBoolean("isMultiline", textWidget.isMultiLine());
    map.putString("fontColor", CAppUtils.toHexColor(textWidget.getFontColor()));
    map.putDouble("fontSize", textWidget.getFontSize());
    map.putString("alignment", CPDFEnumConvertUtil.textAlignmentToString(textWidget.getTextAlignment()));

    String psName = textWidget.getFontName();
    String[] names = CPDFEnumConvertUtil.parseFamilyAndStyleFromPsName(psName);

    map.putString("familyName", names[0]);
    map.putString("styleName", names[1]);
  }


  public void setText(CPDFAnnotation annotation, String text) {
    CPDFTextWidget textWidget = (CPDFTextWidget) annotation;
    textWidget.setText(text);
  }


  @Override
  public void updateWidget(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateWidget(annotation, annotMap);
    if (!annotation.isValid()){
      return;
    }
    CPDFTextWidget textWidget = (CPDFTextWidget) annotation;

    String text = annotMap.getString("text");
    String fontColor = annotMap.getString("fontColor");
    double fontSize = annotMap.getDouble("fontSize");
    String alignment = annotMap.getString("alignment");
    boolean isMultiline = annotMap.getBoolean("isMultiline");
    String familyName = annotMap.getString("familyName");
    String styleName = annotMap.getString("styleName");
    String psName = CPDFTextAttribute.FontNameHelper.obtainFontName(familyName, styleName);

    textWidget.setText(text);
    textWidget.setFontColor(Color.parseColor(fontColor));
    textWidget.setFontSize((float) fontSize);

    textWidget.setTextAlignment(CPDFEnumConvertUtil.stringToTextAlignment(alignment));
    textWidget.setMultiLine(isMultiline);
    textWidget.setFontName(psName);
  }

  @Override
  public CPDFWidget addWidget(CPDFDocument document, ReadableMap widgetMap) {
    int pageIndex = widgetMap.getInt("page");
    String title = widgetMap.getString("title");
    ReadableMap rectMap = widgetMap.getMap("rect");
    double left =  rectMap.getDouble("left");
    double top =  rectMap.getDouble("top");
    double right =  rectMap.getDouble("right");
    double bottom =  rectMap.getDouble("bottom");

    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFTextWidget textWidget = (CPDFTextWidget) page.addFormWidget(
      WidgetType.Widget_TextField);
    if (textWidget.isValid()){
      RectF rectF = new RectF((float) left, (float) top, (float) right, (float) bottom);
      textWidget.setRect(rectF);
      if (TextUtils.isEmpty(title)){
        textWidget.setFieldName(CAppUtils.getDefaultFiledName("Text Field_"));
      } else {
        textWidget.setFieldName(title);
      }
      if (widgetMap.hasKey("createDate") ){
        Double createDateTimestamp = widgetMap.getDouble("createDate");
        textWidget.setCreationDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
        textWidget.setRecentlyModifyDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
      } else {
        textWidget.setCreationDate(TTimeUtil.getCurrentDate());
        textWidget.setRecentlyModifyDate(TTimeUtil.getCurrentDate());
      }
      textWidget.setTextFieldSpecial(false);
      textWidget.setBorderStyles(BorderStyle.BS_Solid);
      updateWidget(textWidget, widgetMap);
      textWidget.updateAp();
    }
    return textWidget;
  }
}
