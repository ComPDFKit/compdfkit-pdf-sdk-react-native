/*
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 *
 */

package com.compdfkitpdf.reactnative.util;


import androidx.annotation.ColorInt;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;

public class CAppUtils {


  public static String toHexColor(@ColorInt int color){
    int rgb = color & 0x00FFFFFF;
    String hex = Integer.toHexString(rgb).toUpperCase();
    while (hex.length() < 6) {
      hex = "0" + hex;
    }
    return "#" + hex;
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
}
