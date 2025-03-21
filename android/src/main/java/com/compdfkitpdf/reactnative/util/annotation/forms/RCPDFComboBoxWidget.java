package com.compdfkitpdf.reactnative.util.annotation.forms;

import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFComboboxWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.annotation.form.CPDFWidgetItem;
import com.compdfkit.core.page.CPDFPage;
import com.facebook.react.bridge.WritableMap;


public class RCPDFComboBoxWidget extends RCPDFBaseWidget {
  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFComboboxWidget comboBoxWidget = (CPDFComboboxWidget) widget;
    map.putString("type", "comboBox");
  }
}
