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


import android.text.TextUtils;
import com.compdfkit.core.common.CPDFDate;
import com.compdfkit.core.document.CPDFBookmark;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.utils.TTimeUtil;
import com.compdfkit.tools.common.utils.date.CDateUtil;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class CPDFBookmarkUtil {

  public static WritableArray getBookmarks(CPDFDocument document) {
    try {

      WritableArray bookmarkArray = Arguments.createArray();

      List<CPDFBookmark> bookmarks = document.getBookmarks();
      if (bookmarks == null || bookmarks.isEmpty()) {
        return bookmarkArray;
      }
      for (CPDFBookmark bookmark : bookmarks) {
        WritableMap map = Arguments.createMap();
        if (!TextUtils.isEmpty(bookmark.getTitle())) {
          map.putString("title", bookmark.getTitle());
        }
        map.putInt("pageIndex", bookmark.getPageIndex());
        if (!TextUtils.isEmpty(bookmark.getDate())) {
          try {
            if (bookmark.getDate().startsWith("D:")) {
              CPDFDate createDate = CPDFDate.standardDateStr2LocalDate(
                bookmark.getDate());
              CAppUtils.putLongCompat(map, "date", CDateUtil.transformToTimestamp(createDate));
            } else {
              SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmZ",
                Locale.ENGLISH);
              Date date = sdf.parse(bookmark.getDate());
              if (date != null) {
                long timestampMillis = date.getTime();
                CAppUtils.putLongCompat(map, "date", timestampMillis);
              }
            }
          } catch (Exception ignored) {

          }
        }
        map.putString("uuid", bookmark.bookmarkPtr + "");
        bookmarkArray.pushMap(map);
      }
      return bookmarkArray;
    } catch (Exception e) {
      return Arguments.createArray();
    }
  }

  public static boolean addBookmark(CPDFDocument document, String title, int pageIndex) {
    try {
      return document.addBookmark(
        new CPDFBookmark(pageIndex, title, CPDFDate.toStandardDate(
          TTimeUtil.getCurrentDate())));
    } catch (Exception e) {
      return false;
    }
  }

  public static boolean updateBookmark(CPDFDocument document, String uuid, String newTitle) {
    try {
      List<CPDFBookmark> bookmarks = document.getBookmarks();
      if (bookmarks == null || bookmarks.isEmpty()) {
        return false;
      }
      for (CPDFBookmark bookmark : bookmarks) {
        if ((bookmark.bookmarkPtr + "").equals(uuid)) {
          bookmark.setTitle(newTitle);
          return true;
        }
      }
      return false;
    } catch (Exception e) {
      return false;
    }
  }
}
