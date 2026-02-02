package com.compdfkitpdf.reactnative.util.annotation.forms;

import android.graphics.Color;
import android.graphics.RectF;
import android.text.TextUtils;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFCheckboxWidget;
import com.compdfkit.core.annotation.form.CPDFCheckboxWidget.CheckboxStyle;
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


public class RCPDFCheckBoxWidget extends RCPDFBaseWidget {

  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFCheckboxWidget checkboxWidget = (CPDFCheckboxWidget) widget;
    map.putString("type", "checkBox");
    map.putBoolean("isChecked", checkboxWidget.isChecked());
    map.putString("checkStyle", CPDFEnumConvertUtil.checkStyleToString(checkboxWidget.getCheckStyle()));
    map.putString("checkColor", CAppUtils.toHexColor(checkboxWidget.getCheckColor()));
  }


  @Override
  public void updateWidget(CPDFAnnotation annotation,ReadableMap annotMap) {
    super.updateWidget(annotation, annotMap);
    CPDFCheckboxWidget checkboxWidget = (CPDFCheckboxWidget) annotation;

    boolean isChecked = annotMap.getBoolean("isChecked");
    String checkStyle = annotMap.getString("checkStyle");
    String checkColor = annotMap.getString("checkColor");

    checkboxWidget.setChecked(isChecked);
    checkboxWidget.setCheckStyle(CPDFEnumConvertUtil.stringToCheckStyle(checkStyle));
    checkboxWidget.setColor(Color.parseColor(checkColor));
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
    CPDFCheckboxWidget widget = (CPDFCheckboxWidget) page.addFormWidget(
      WidgetType.Widget_CheckBox);
    if (widget.isValid()){
      RectF rectF = new RectF((float) left, (float) top, (float) right, (float) bottom);
      widget.setRect(rectF);
      if (TextUtils.isEmpty(title)){
        widget.setFieldName(CAppUtils.getDefaultFiledName("Check Button_"));
      } else {
        widget.setFieldName(title);
      }
      if (widgetMap.hasKey("createDate")){
        Double createDateTimestamp = widgetMap.getDouble("createDate");
        widget.setCreationDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
        widget.setRecentlyModifyDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
      } else {
        widget.setCreationDate(TTimeUtil.getCurrentDate());
        widget.setRecentlyModifyDate(TTimeUtil.getCurrentDate());
      }
      widget.setCheckBoxStyle(CheckboxStyle.CHECKBOX_TICK);
      widget.setBorderStyles(BorderStyle.BS_Solid);

      updateWidget(widget, widgetMap);
      widget.updateAp();
    }
    return widget;
  }
}
