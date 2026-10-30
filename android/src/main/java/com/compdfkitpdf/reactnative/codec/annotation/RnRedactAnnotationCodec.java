package com.compdfkitpdf.reactnative.codec.annotation;

import android.graphics.Color;
import android.graphics.RectF;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFRedactAnnotation;
import com.compdfkit.core.annotation.CPDFTextAttribute;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkitpdf.reactnative.util.RnAppUtils;
import com.compdfkitpdf.reactnative.util.RnEnumConverter;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.util.Map;

/** Maps redact annotations to the public React Native representation. */
public class RnRedactAnnotationCodec extends RnBaseAnnotationCodec {
  @Override public void covert(CPDFAnnotation annotation, WritableMap map) {
    CPDFRedactAnnotation redact = (CPDFRedactAnnotation) annotation;
    map.putString("overlayText", redact.getOverLayText());
    map.putString("fillColor", RnAppUtils.toHexColor(redact.getFillColor()));
    int outlineColor = redact.getOutlineColor();
    // A transparent outline means no border; report it as absent, like iOS.
    if (Color.alpha(outlineColor) == 0) map.putNull("outlineColor");
    else map.putString("outlineColor", RnAppUtils.toHexColor(outlineColor));
    map.putString("alignment", RnEnumConverter.freeTextAlignmentToString(redact.getTextAlignment()));
    CPDFTextAttribute attr = redact.getTextDa();
    if (attr != null) {
      WritableMap text = com.facebook.react.bridge.Arguments.createMap();
      text.putString("color", RnAppUtils.toHexColor(attr.getColor()));
      text.putString("familyName", attr.getFontName());
      text.putString("styleName", "");
      text.putDouble("fontSize", attr.getFontSize());
      map.putMap("textAttribute", text);
    }
  }

  @Override public void updateAnnotation(CPDFAnnotation annotation, ReadableMap map) {
    super.updateAnnotation(annotation, map);
    CPDFRedactAnnotation redact = (CPDFRedactAnnotation) annotation;
    if (map.hasKey("overlayText")) redact.setOverLayText(map.getString("overlayText"));
    if (map.hasKey("fillColor")) redact.setFillColor(Color.parseColor(map.getString("fillColor")));
    if (map.hasKey("outlineColor")) {
      if (map.isNull("outlineColor")) redact.clearOutlineColor();
      else redact.setOutlineColor(Color.parseColor(map.getString("outlineColor")));
    }
    if (map.hasKey("alignment")) redact.setTextAlignment(RnEnumConverter.stringToFreeTextAlignment(map.getString("alignment")));
    if (map.hasKey("textAttribute") && !map.isNull("textAttribute")) {
      ReadableMap text = map.getMap("textAttribute");
      String font = text.hasKey("familyName") ? text.getString("familyName") : "Helvetica";
      float size = text.hasKey("fontSize") ? (float) text.getDouble("fontSize") : 12f;
      int color = text.hasKey("color") ? Color.parseColor(text.getString("color")) : Color.BLACK;
      redact.setTextDa(new CPDFTextAttribute(font, size, color));
    }
  }

  @Override public CPDFAnnotation addAnnotation(CPDFDocument document, ReadableMap map) {
    CPDFPage page = document.pageAtIndex(map.getInt("page"));
    if (page == null) return null;
    CPDFRedactAnnotation redact = (CPDFRedactAnnotation) page.addAnnot(CPDFAnnotation.Type.REDACT);
    if (redact == null || !redact.isValid()) return redact;
    ReadableMap rect = map.getMap("rect");
    redact.setRect(new RectF((float) rect.getDouble("left"), (float) rect.getDouble("top"),
        (float) rect.getDouble("right"), (float) rect.getDouble("bottom")));
    redact.setTitle(map.getString("title")); redact.setContent(map.getString("content"));
    long now = map.hasKey("createDate") ? (long) map.getDouble("createDate") : System.currentTimeMillis();
    redact.setCreationDate(TTimeUtil.fromTimestamp(now)); redact.setRecentlyModifyDate(TTimeUtil.fromTimestamp(now));
    updateAnnotation(redact, map); redact.updateAp(); return redact;
  }
}
