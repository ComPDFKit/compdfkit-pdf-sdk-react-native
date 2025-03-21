package com.compdfkitpdf.reactnative.util.annotation.forms;

import android.util.Log;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFTextWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.page.CPDFPage;
import com.facebook.react.bridge.WritableMap;


public class RCPDFTextFieldWidget extends RCPDFBaseWidget {


  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFTextWidget textWidget = (CPDFTextWidget) widget;
    map.putString("type", "textField");
    map.putString("text", textWidget.getText());
  }


  public void setText(CPDFAnnotation annotation, String text) {
    CPDFTextWidget textWidget = (CPDFTextWidget) annotation;
    textWidget.setText(text);
  }
}
