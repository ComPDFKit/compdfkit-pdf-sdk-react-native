package com.compdfkitpdf.reactnative.codec.widget;

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
import com.compdfkitpdf.reactnative.util.RnAppUtils;
import com.compdfkitpdf.reactnative.util.RnEnumConverter;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;


/**
 * Maps radio button widget data between native objects and React Native maps.
 */
public class RnRadioButtonWidgetCodec extends RnBaseWidgetCodec {

  /**
   * Writes native properties into the React Native map.
   */
  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFRadiobuttonWidget radiobuttonWidget = (CPDFRadiobuttonWidget) widget;
    map.putString("type", "radioButton");
    map.putBoolean("isChecked", radiobuttonWidget.isChecked());
    map.putString("checkStyle", RnEnumConverter.checkStyleToString(radiobuttonWidget.getCheckStyle()));
    map.putString("checkColor", RnAppUtils.toHexColor(radiobuttonWidget.getCheckColor()));
  }

  /**
   * Updates widget.
   */
  @Override
  public void updateWidget(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateWidget(annotation, annotMap);
    CPDFRadiobuttonWidget radiobuttonWidget = (CPDFRadiobuttonWidget) annotation;

    boolean isChecked = annotMap.getBoolean("isChecked");
    String checkStyle = annotMap.getString("checkStyle");
    String checkColor = annotMap.getString("checkColor");

    radiobuttonWidget.setChecked(isChecked);
    radiobuttonWidget.setCheckStyle(RnEnumConverter.stringToCheckStyle(checkStyle));
    radiobuttonWidget.setColor(Color.parseColor(checkColor));
  }

  /**
   * Adds widget.
   */
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
        widget.setFieldName(RnAppUtils.getDefaultFiledName("Radio Button_"));
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
