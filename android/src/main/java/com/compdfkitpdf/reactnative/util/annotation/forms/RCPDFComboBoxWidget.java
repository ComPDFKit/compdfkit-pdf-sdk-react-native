package com.compdfkitpdf.reactnative.util.annotation.forms;

import android.text.TextUtils;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFComboboxWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.annotation.form.CPDFWidgetItem;
import com.compdfkit.core.font.CPDFFont;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;


public class RCPDFComboBoxWidget extends RCPDFBaseWidget {
  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFComboboxWidget comboBoxWidget = (CPDFComboboxWidget) widget;
    map.putString("type", "comboBox");
    WritableArray options = Arguments.createArray();
    CPDFWidgetItem[] items = comboBoxWidget.getOptions();
    if (items != null && items.length > 0){
      for (CPDFWidgetItem item : items) {
        WritableMap option = Arguments.createMap();
        option.putString("text", item.text);
        option.putString("value", item.value);
        options.pushMap(option);
      }
    }
    map.putArray("options", options);
    WritableArray selectedArray = CAppUtils.intArrayToWritableArray(comboBoxWidget.getSelectedIndexes());
    map.putArray("selectedIndexes", selectedArray);
    map.putString("fontColor", CAppUtils.toHexColor(comboBoxWidget.getFontColor()));
    map.putDouble("fontSize", comboBoxWidget.getFontSize());

    String fontName = comboBoxWidget.getFontName();
    String familyName = CPDFFont.getFamilyName(comboBoxWidget.getFontName());
    String styleName = "Regular";
    if (TextUtils.isEmpty(familyName)){
      familyName = comboBoxWidget.getFontName();
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
