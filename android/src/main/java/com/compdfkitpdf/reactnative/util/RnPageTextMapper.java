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

import android.graphics.RectF;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.page.CPDFTextPage;
import com.compdfkit.core.page.CPDFTextRange;
import com.compdfkit.core.page.CPDFTextSelection;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

/**
 * Maps page text data between ComPDFKit Android SDK and React Native.
 */
public final class RnPageTextMapper {

  private RnPageTextMapper() {
  }

  /**
   * Returns all text on a page.
   */
  public static String getPageText(@NonNull CPDFDocument document, int pageIndex) {
    CPDFTextPage textPage = requireTextPage(document, pageIndex);
    int count = textPage.getCountChars();
    if (count <= 0) {
      return "";
    }
    String text = textPage.getText(new CPDFTextRange(0, count));
    return text == null ? "" : text;
  }

  /**
   * Returns text inside a page rectangle.
   */
  public static String getPageTextInRect(@NonNull CPDFDocument document, int pageIndex,
    @Nullable ReadableMap rectMap) {
    CPDFTextPage textPage = requireTextPage(document, pageIndex);
    if (rectMap == null) {
      return "";
    }
    String text = textPage.getBoundedText(toRectF(rectMap));
    return text == null ? "" : text;
  }

  /**
   * Returns page text lines.
   */
  public static WritableArray getPageTextLines(@NonNull CPDFDocument document, int pageIndex) {
    WritableArray result = Arguments.createArray();
    CPDFTextPage textPage = requireTextPage(document, pageIndex);
    int count = textPage.getCountChars();
    if (count <= 0) {
      return result;
    }
    CPDFTextSelection[] lines = textPage.getSelectionsByLineForRange(new CPDFTextRange(0, count));
    if (lines == null) {
      return result;
    }
    for (int i = 0; i < lines.length; i++) {
      CPDFTextSelection selection = lines[i];
      if (selection == null) {
        continue;
      }
      if (!selection.isValid() || selection.getTextRange() == null || selection.getRectF() == null) {
        continue;
      }
      CPDFTextRange range = selection.getTextRange();
      WritableMap lineMap = Arguments.createMap();
      lineMap.putInt("pageIndex", pageIndex);
      lineMap.putInt("lineIndex", result.size());
      lineMap.putInt("location", range.location);
      lineMap.putInt("length", range.length);
      lineMap.putMap("rect", toRectMap(selection.getRectF()));
      result.pushMap(lineMap);
    }
    return result;
  }

  private static CPDFTextPage requireTextPage(@NonNull CPDFDocument document, int pageIndex) {
    if (pageIndex < 0 || pageIndex >= document.getPageCount()) {
      throw new IllegalArgumentException("Invalid page index: " + pageIndex);
    }
    CPDFPage page = document.pageAtIndex(pageIndex);
    if (page == null || !page.isValid()) {
      throw new IllegalArgumentException("Invalid page index: " + pageIndex);
    }
    CPDFTextPage textPage = page.getTextPage();
    if (textPage == null || !textPage.isValid()) {
      throw new IllegalArgumentException("Text page is unavailable at index: " + pageIndex);
    }
    return textPage;
  }

  private static RectF toRectF(@NonNull ReadableMap rectMap) {
    return new RectF(
      (float) rectMap.getDouble("left"),
      (float) rectMap.getDouble("top"),
      (float) rectMap.getDouble("right"),
      (float) rectMap.getDouble("bottom")
    );
  }

  private static WritableMap toRectMap(@Nullable RectF rectF) {
    WritableMap rectMap = Arguments.createMap();
    if (rectF == null) {
      rectMap.putDouble("left", 0D);
      rectMap.putDouble("top", 0D);
      rectMap.putDouble("right", 0D);
      rectMap.putDouble("bottom", 0D);
      return rectMap;
    }
    rectMap.putDouble("left", rectF.left);
    rectMap.putDouble("top", rectF.top);
    rectMap.putDouble("right", rectF.right);
    rectMap.putDouble("bottom", rectF.bottom);
    return rectMap;
  }
}
