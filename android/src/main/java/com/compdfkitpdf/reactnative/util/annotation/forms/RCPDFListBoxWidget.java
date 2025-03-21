package com.compdfkitpdf.reactnative.util.annotation.forms;

import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFListboxWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.annotation.form.CPDFWidgetItem;
import com.compdfkit.core.page.CPDFPage;
import com.facebook.react.bridge.WritableMap;


public class RCPDFListBoxWidget extends RCPDFBaseWidget {

  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFListboxWidget listboxWidget = (CPDFListboxWidget) widget;
    map.putString("type", "listBox");
  }
}
