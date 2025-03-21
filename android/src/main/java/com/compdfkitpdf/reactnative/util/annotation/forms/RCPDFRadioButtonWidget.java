package com.compdfkitpdf.reactnative.util.annotation.forms;

import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFRadiobuttonWidget;
import com.compdfkit.core.annotation.form.CPDFSignatureWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.page.CPDFPage;
import com.facebook.react.bridge.WritableMap;


public class RCPDFRadioButtonWidget extends RCPDFBaseWidget {

  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFRadiobuttonWidget radiobuttonWidget = (CPDFRadiobuttonWidget) widget;
    map.putString("type", "radioButton");
    map.putBoolean("isChecked", radiobuttonWidget.isChecked());
  }
}
