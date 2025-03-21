package com.compdfkitpdf.reactnative.util.annotation;


import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFStampAnnotation;
import com.facebook.react.bridge.WritableMap;

public class RCPDFStampAnnotation extends RCPDFBaseAnnotation{


  @Override
  public void covert(CPDFAnnotation annotation, WritableMap map) {
    CPDFStampAnnotation stampAnnotation = (CPDFStampAnnotation) annotation;
    if (stampAnnotation.isStampSignature()) {
      map.putString("type", "signature");
    }else {
      switch (stampAnnotation.getStampType()) {
        case STANDARD_STAMP, TEXT_STAMP:
          map.putString("type", "stamp");
          break;
        case IMAGE_STAMP :
          map.putString("type", "pictures");
          break;
      }
    }
  }
}
