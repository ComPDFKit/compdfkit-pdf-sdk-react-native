package com.compdfkitpdf.reactnative.util.annotation;


import android.text.TextUtils;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFFreetextAnnotation;
import com.compdfkit.core.annotation.CPDFTextAttribute;
import com.compdfkit.core.font.CPDFFont;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import java.util.List;

public class RCCPDFFreeTextAnnotation extends RCPDFBaseAnnotation {

  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    CPDFFreetextAnnotation freetextAnnotation = (CPDFFreetextAnnotation) annotation;
    map.putInt("alpha", freetextAnnotation.getAlpha());

    CPDFTextAttribute textAttribute = freetextAnnotation.getFreetextDa();
    WritableMap textAttributeMap = Arguments.createMap();

    textAttributeMap.putString("color", CAppUtils.toHexColor(textAttribute.getColor()));
    textAttributeMap.putDouble("fontSize", textAttribute.getFontSize());
    switch (freetextAnnotation.getFreetextAlignment()){
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

    String fontName = textAttribute.getFontName();
    String familyName = CPDFFont.getFamilyName(textAttribute.getFontName());
    String styleName = "Regular";
    if (TextUtils.isEmpty(familyName)){
      familyName = textAttribute.getFontName();
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

    textAttributeMap.putString("familyName", familyName);
    textAttributeMap.putString("styleName", styleName);

    map.putMap("textAttribute", textAttributeMap);

  }
}
