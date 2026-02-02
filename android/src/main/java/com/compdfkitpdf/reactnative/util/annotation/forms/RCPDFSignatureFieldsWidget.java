package com.compdfkitpdf.reactnative.util.annotation.forms;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.RectF;
import android.text.TextUtils;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFImageScaleType;
import com.compdfkit.core.annotation.form.CPDFSignatureWidget;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.annotation.form.CPDFWidget.BorderStyle;
import com.compdfkit.core.annotation.form.CPDFWidget.WidgetType;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkit.tools.common.utils.image.CBitmapUtil;
import com.compdfkitpdf.reactnative.util.CAppUtils;
import com.compdfkitpdf.reactnative.util.CPDFDocumentUtil;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;


public class RCPDFSignatureFieldsWidget extends RCPDFBaseWidget {

  @Override
  public void covert(CPDFWidget widget, WritableMap map) {
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
      return false;
    }
    return false;
  }


  @Override
  public CPDFWidget addWidget(CPDFDocument document, ReadableMap widgetMap) {
    int pageIndex =  widgetMap.getInt("page");
    String title = widgetMap.getString("title");
    ReadableMap rectMap = widgetMap.getMap("rect");
    double left = rectMap.getDouble("left");
    double top =  rectMap.getDouble("top");
    double right =  rectMap.getDouble("right");
    double bottom =  rectMap.getDouble("bottom");

    String fillColor = widgetMap.getString("fillColor");
    String borderColor = widgetMap.getString("borderColor");
    double borderWidth = widgetMap.getDouble("borderWidth");

    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFSignatureWidget widget = (CPDFSignatureWidget) page.addFormWidget(
      WidgetType.Widget_SignatureFields);
    if (widget.isValid()){
      RectF rectF = new RectF((float) left, (float) top, (float) right, (float) bottom);
      widget.setRect(rectF);
      if (TextUtils.isEmpty(title)){
        widget.setFieldName(CAppUtils.getDefaultFiledName("Signature_"));
      } else {
        widget.setFieldName(title);
      }
      if (widgetMap.hasKey("createDate") ){
        Double createDateTimestamp = widgetMap.getDouble("createDate");
        widget.setCreationDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
        widget.setRecentlyModifyDate(TTimeUtil.fromTimestamp(createDateTimestamp.longValue()));
      } else {
        widget.setCreationDate(TTimeUtil.getCurrentDate());
        widget.setRecentlyModifyDate(TTimeUtil.getCurrentDate());
      }
      widget.setBorderStyles(BorderStyle.BS_Solid);
      widget.setBorderColor(Color.parseColor(borderColor));
      widget.setBorderWidth((float) borderWidth);
      widget.setFillColor(Color.parseColor(fillColor));
      widget.updateAp();
    }
    return widget;
  }
}
