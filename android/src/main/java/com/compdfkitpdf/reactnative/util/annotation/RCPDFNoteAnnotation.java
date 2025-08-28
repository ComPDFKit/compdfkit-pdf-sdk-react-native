package com.compdfkitpdf.reactnative.util.annotation;


import com.compdfkit.core.annotation.CPDFAnnotation;
import com.facebook.react.bridge.WritableMap;

public class RCPDFNoteAnnotation extends RCPDFBaseAnnotation{


  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    map.putString("type", "note");
  }
}
