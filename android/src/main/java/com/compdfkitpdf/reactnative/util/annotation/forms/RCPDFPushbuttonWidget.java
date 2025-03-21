package com.compdfkitpdf.reactnative.util.annotation.forms;

import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFCheckboxWidget;
import com.compdfkit.core.annotation.form.CPDFPushbuttonWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.page.CPDFPage;
import com.facebook.react.bridge.WritableMap;


public class RCPDFPushbuttonWidget extends RCPDFBaseWidget {

  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFPushbuttonWidget pushbuttonWidget = (CPDFPushbuttonWidget) widget;
    map.putString("type", "pushButton");
  }
}
