package com.compdfkitpdf.reactnative.util.annotation.forms;

import android.graphics.Color;
import android.graphics.RectF;
import android.text.TextUtils;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFRadiobuttonWidget;
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


public class RCPDFRadioButtonWidget extends RCPDFBaseWidget {

  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFRadiobuttonWidget radiobuttonWidget = (CPDFRadiobuttonWidget) widget;
    map.putString("type", "radioButton");
    map.putBoolean("isChecked", radiobuttonWidget.isChecked());
    map.putString("checkStyle", CPDFEnumConvertUtil.checkStyleToString(radiobuttonWidget.getCheckStyle()));
    map.putString("checkColor", CAppUtils.toHexColor(radiobuttonWidget.getCheckColor()));
  }

  @Override
  public void updateWidget(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateWidget(annotation, annotMap);
    CPDFRadiobuttonWidget radiobuttonWidget = (CPDFRadiobuttonWidget) annotation;

    boolean isChecked = annotMap.getBoolean("isChecked");
    String checkStyle = annotMap.getString("checkStyle");
    String checkColor = annotMap.getString("checkColor");

    radiobuttonWidget.setChecked(isChecked);
    radiobuttonWidget.setCheckStyle(CPDFEnumConvertUtil.stringToCheckStyle(checkStyle));
    radiobuttonWidget.setColor(Color.parseColor(checkColor));
  }

  @Override
  public CPDFWidget addWidget(CPDFDocument document, ReadableMap widgetMap) {
    int pageIndex = widgetMap.getInt("page");
    ReadableMap rectMap = widgetMap.getMap("rect");
    double left = rectMap.getDouble("left");
    double top = rectMap.getDouble("top");
    double right = rectMap.getDouble("right");
    double bottom = rectMap.getDouble("bottom");
    String title = widgetMap.getString("title");

    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFRadiobuttonWidget widget = (CPDFRadiobuttonWidget) page.addFormWidget(
      WidgetType.Widget_RadioButton);

    if (widget.isValid()){
      RectF rectF = new RectF((float) left, (float) top, (float) right, (float) bottom);

      widget.setRect(rectF);
      widget.setBorderStyles(BorderStyle.BS_Solid);
      if (TextUtils.isEmpty(title)){
        widget.setFieldName(CAppUtils.getDefaultFiledName("Radio Button_"));
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
