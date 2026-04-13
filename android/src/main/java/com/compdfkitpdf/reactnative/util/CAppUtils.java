/*
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 *
 */

package com.compdfkitpdf.reactnative.util;


import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import androidx.annotation.ColorInt;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

public class CAppUtils {


  public static String toHexColor(@ColorInt int color){
    int rgb = color & 0x00FFFFFF;
    String hex = Integer.toHexString(rgb).toUpperCase();
    while (hex.length() < 6) {
      hex = "0" + hex;
    }
    return "#" + hex;
  }

  public static long toTimes(String time){
    try {
      SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
      Date date = inputFormat.parse(time);
      return date.getTime();
    } catch (ParseException e) {
      return 0L;
    }
  }

  public static WritableArray intArrayToWritableArray(int[] intArray) {
    WritableArray writableArray = Arguments.createArray();
    if (intArray != null) {
      for (int value : intArray) {
        writableArray.pushInt(value);
      }
    }
    return writableArray;
  }


  public static double roundTo2(double value) {
    if (Double.isNaN(value) || Double.isInfinite(value)) {
      return value;
    }
    return BigDecimal.valueOf(value)
      .setScale(2, RoundingMode.HALF_UP)
      .doubleValue();
  }

  public static float roundTo2f(float value) {
    if (Float.isNaN(value) || Float.isInfinite(value)) {
      return value;
    }
    return BigDecimal.valueOf(value)
      .setScale(2, RoundingMode.HALF_UP)
      .floatValue();
  }

  public static <K, V> void putIfAbsentCompat(Map<K, V> map, K key, V value) {
    if (map.get(key) == null) {
      map.put(key, value);
    }
  }

  public static void putLongCompat(WritableMap map, String key, long value) {
    map.putDouble(key, (double) value);
  }

  public static Bitmap base64ToBitmap(String base64Image) {
    base64Image = base64Image.replaceAll("\\s+", "");
    byte[] decodedBytes = Base64.decode(base64Image, Base64.DEFAULT);
    return BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
  }

  public static String getDefaultFiledName(String widgetType) {
    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
    String dateStr = df.format(new Date());
    return String.format("%s%s", widgetType, dateStr);
  }
}
