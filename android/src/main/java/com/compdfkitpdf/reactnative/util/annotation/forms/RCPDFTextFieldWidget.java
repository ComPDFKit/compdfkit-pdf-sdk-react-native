package com.compdfkitpdf.reactnative.util.annotation.forms;

import android.text.TextUtils;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFTextWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.font.CPDFFont;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.facebook.react.bridge.WritableMap;
import java.util.List;


public class RCPDFTextFieldWidget extends RCPDFBaseWidget {


  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFTextWidget textWidget = (CPDFTextWidget) widget;
    map.putString("type", "textField");
    map.putString("text", textWidget.getText());
    map.putBoolean("isMultiline", textWidget.isMultiLine());
    map.putString("fontColor", CAppUtils.toHexColor(textWidget.getFontColor()));
    map.putDouble("fontSize", textWidget.getFontSize());
    switch (textWidget.getTextAlignment()){
      case ALIGNMENT_RIGHT:
        map.putString("alignment", "right");
        break;
      case ALIGNMENT_CENTER:
        map.putString("alignment", "center");
        break;
      default:
        map.putString("alignment", "left");
        break;
    }
    String fontName = textWidget.getFontName();
    String familyName = CPDFFont.getFamilyName(textWidget.getFontName());
    String styleName = "Regular";
    if (TextUtils.isEmpty(familyName)){
      familyName = textWidget.getFontName();
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


  public void setText(CPDFAnnotation annotation, String text) {
    CPDFTextWidget textWidget = (CPDFTextWidget) annotation;
    textWidget.setText(text);
  }
}
