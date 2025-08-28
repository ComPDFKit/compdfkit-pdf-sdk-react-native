package com.compdfkitpdf.reactnative.util.annotation.forms;

import android.text.TextUtils;
import com.compdfkit.core.annotation.form.CPDFListboxWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.annotation.form.CPDFWidgetItem;
import com.compdfkit.core.font.CPDFFont;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.util.List;


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
    WritableArray selectedArray = CAppUtils.intArrayToWritableArray(listboxWidget.getSelectedIndexes());
    map.putArray("selectedIndexes", selectedArray);
    map.putString("fontColor", CAppUtils.toHexColor(listboxWidget.getFontColor()));
    map.putDouble("fontSize", listboxWidget.getFontSize());

    String fontName = listboxWidget.getFontName();
    String familyName = CPDFFont.getFamilyName(listboxWidget.getFontName());
    String styleName = "Regular";
    if (TextUtils.isEmpty(familyName)){
      familyName = listboxWidget.getFontName();
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
}
