package com.compdfkitpdf.reactnative.util.annotation.forms;

import android.content.Context;
import android.graphics.Bitmap;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFImageScaleType;
import com.compdfkit.core.annotation.form.CPDFSignatureWidget;
import com.compdfkit.core.annotation.form.CPDFTextWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.tools.common.utils.image.CBitmapUtil;
import com.compdfkitpdf.reactnative.util.CPDFDocumentUtil;
import com.facebook.react.bridge.WritableMap;


public class RCPDFSignatureFieldsWidget extends RCPDFBaseWidget {

  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
    CPDFSignatureWidget signatureWidget = (CPDFSignatureWidget) widget;
    map.putString("type", "signaturesFields");
  }

  public boolean addImageSignatures(Context context, CPDFAnnotation widget, String imagePath){
    CPDFSignatureWidget signatureWidget = (CPDFSignatureWidget) widget;
    try{
      String path = CPDFDocumentUtil.getImportFilePath(context, imagePath);
      Bitmap bitmap = CBitmapUtil.decodeBitmap(path);
      if (bitmap != null){
        return signatureWidget.updateApWithBitmap(bitmap, CPDFImageScaleType.SCALETYPE_fitCenter);
      }
    }catch (Exception e){
      e.printStackTrace();
      return false;
    }
    return false;
  }
}
