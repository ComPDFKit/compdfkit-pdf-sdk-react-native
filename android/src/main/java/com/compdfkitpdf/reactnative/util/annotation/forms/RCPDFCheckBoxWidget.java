package com.compdfkitpdf.reactnative.util.annotation.forms;

import com.compdfkit.core.annotation.form.CPDFCheckboxWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.facebook.react.bridge.WritableMap;


public class RCPDFCheckBoxWidget extends RCPDFBaseWidget {

  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFCheckboxWidget checkboxWidget = (CPDFCheckboxWidget) widget;
    map.putString("type", "checkBox");
    map.putBoolean("isChecked", checkboxWidget.isChecked());
    map.putString("checkStyle",
      checkboxWidget.getCheckStyle().name().replaceAll("CK_", "").toLowerCase());
    map.putString("checkColor", CAppUtils.toHexColor(checkboxWidget.getCheckColor()));
  }
}
