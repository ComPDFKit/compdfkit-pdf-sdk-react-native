package com.compdfkitpdf.reactnative.util.annotation.forms;

import android.graphics.Color;
import android.graphics.RectF;
import android.text.TextUtils;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFTextAttribute;
import com.compdfkit.core.annotation.form.CPDFListboxWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.annotation.form.CPDFWidget.WidgetType;
import com.compdfkit.core.annotation.form.CPDFWidgetItem;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.compdfkitpdf.reactnative.util.CPDFEnumConvertUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;


public class RCPDFListBoxWidget extends RCPDFBaseWidget {

  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFListboxWidget listboxWidget = (CPDFListboxWidget) widget;
    map.putString("type", "listBox");
    WritableArray options = Arguments.createArray();
    CPDFWidgetItem[] items = listboxWidget.getOptions();
    if (items != null && items.length > 0){
      for (CPDFWidgetItem item : items) {
        WritableMap option = Arguments.createMap();
        option.putString("text", item.text);
        option.putString("value", item.value);
        options.pushMap(option);
      }
    }
    map.putArray("options", options);
    int[] selectedIndexes = listboxWidget.getSelectedIndexes();
    int index = (selectedIndexes != null && selectedIndexes.length > 0) ? selectedIndexes[0] : 0;
    map.putInt("selectItemAtIndex", index);
    map.putString("fontColor", CAppUtils.toHexColor(listboxWidget.getFontColor()));
    map.putDouble("fontSize", listboxWidget.getFontSize());

    String psName = listboxWidget.getFontName();
    String[] names = CPDFEnumConvertUtil.parseFamilyAndStyleFromPsName(psName);

    map.putString("familyName", names[0]);
    map.putString("styleName", names[1]);
  }


  @Override
  public void updateWidget(CPDFAnnotation annotation, ReadableMap annotMap) {
    super.updateWidget(annotation, annotMap);
    CPDFListboxWidget listBoxWidget = (CPDFListboxWidget) annotation;

    String fontColor = annotMap.getString("fontColor");
    double fontSize = annotMap.getDouble("fontSize");
    String familyName = annotMap.getString("familyName");
    String styleName = annotMap.getString("styleName");
    String psName = CPDFTextAttribute.FontNameHelper.obtainFontName(familyName, styleName);

    listBoxWidget.setFontColor(Color.parseColor(fontColor));
    listBoxWidget.setFontSize((float) fontSize);
    listBoxWidget.setFontName(psName);

    ReadableArray options = annotMap.getArray("options");
    CPDFWidgetItem[] optionItems = null;
    if (options != null && options.size() > 0) {
      optionItems = new CPDFWidgetItem[options.size()];
      for (int i = 0; i < options.size(); i++) {
        ReadableMap option = options.getMap(i);
        String text = option.getString("text");
        String value = option.getString("value");
        optionItems[i] = new CPDFWidgetItem(text, value);
      }
    }
    int selectItemAtIndex = annotMap.getInt("selectItemAtIndex");
    listBoxWidget.setOptionItems(optionItems);
    listBoxWidget.setSelectedIndexes(new int[]{selectItemAtIndex});
  }

  @Override
  public CPDFWidget addWidget(CPDFDocument document, ReadableMap widgetMap) {

    int pageIndex =  widgetMap.getInt("page");
    ReadableMap rectMap =  widgetMap.getMap("rect");
    double left =  rectMap.getDouble("left");
    double top =  rectMap.getDouble("top");
    double right =  rectMap.getDouble("right");
    double bottom =  rectMap.getDouble("bottom");
    String title = widgetMap.getString("title");

    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFListboxWidget widget = (CPDFListboxWidget) page.addFormWidget(
      WidgetType.Widget_ListBox);
    if (widget.isValid()){
      RectF rectF = new RectF((float) left, (float) top, (float) right, (float) bottom);
      widget.setRect(rectF);
      if (TextUtils.isEmpty(title)){
        widget.setFieldName(CAppUtils.getDefaultFiledName("List Choice_"));
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
