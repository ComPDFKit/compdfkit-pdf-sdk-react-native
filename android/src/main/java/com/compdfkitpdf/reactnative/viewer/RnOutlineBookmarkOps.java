/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.viewer;

import com.compdfkitpdf.reactnative.util.RnBookmarkMapper;
import com.compdfkitpdf.reactnative.util.RnOutlineMapper;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

/**
 * Handles outline bookmark ops for the native PDF viewer layer.
 */
final class RnOutlineBookmarkOps {

  private boolean isAvailable(RnPdfViewContext context) {
    return context != null && context.document != null && context.readerView != null;
  }

  /**
   * Returns the outline root.
   */
  WritableMap getOutlineRoot(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return null;
    }
    return RnOutlineMapper.getOutlineMap(context.document);
  }

  /**
   * Returns new outline root.
   */
  WritableMap newOutlineRoot(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return null;
    }
    return RnOutlineMapper.newOutlineRoot(context.document);
  }

  /**
   * Adds outline.
   */
  boolean addOutline(RnPdfViewContext context, String parentUuid, String title, int insertIndex,
    int pageIndex) {
    if (!isAvailable(context)) {
      return false;
    }
    return RnOutlineMapper.addOutline(context.document, parentUuid, title, insertIndex, pageIndex);
  }

  /**
   * Removes outline.
   */
  boolean removeOutline(RnPdfViewContext context, String uuid) {
    if (!isAvailable(context)) {
      return false;
    }
    return RnOutlineMapper.deleteOutline(context.document, uuid);
  }

  /**
   * Updates outline.
   */
  boolean updateOutline(RnPdfViewContext context, String uuid, String newTitle, int newPageIndex) {
    if (!isAvailable(context)) {
      return false;
    }
    return RnOutlineMapper.updateOutline(context.document, uuid, newTitle, newPageIndex);
  }

  /**
   * Returns move outline.
   */
  boolean moveOutline(RnPdfViewContext context, String uuid, String newParentUuid, int newIndex) {
    if (!isAvailable(context)) {
      return false;
    }
    return RnOutlineMapper.moveTo(context.document, uuid, newParentUuid, newIndex);
  }

  /**
   * Returns the bookmarks.
   */
  WritableArray getBookmarks(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return Arguments.createArray();
    }
    return RnBookmarkMapper.getBookmarks(context.document);
  }

  /**
   * Adds bookmark.
   */
  boolean addBookmark(RnPdfViewContext context, String title, int pageIndex) {
    if (!isAvailable(context)) {
      return false;
    }
    boolean result = RnBookmarkMapper.addBookmark(context.document, title, pageIndex);
    context.readerView.invalidateAllChildren();
    return result;
  }

  /**
   * Removes bookmark.
   */
  boolean removeBookmark(RnPdfViewContext context, int pageIndex) {
    if (!isAvailable(context)) {
      return false;
    }
    boolean result = context.document.removeBookmark(pageIndex);
    context.readerView.invalidateAllChildren();
    return result;
  }

  /**
   * Returns whether the current state has bookmark.
   */
  boolean hasBookmark(RnPdfViewContext context, int pageIndex) {
    return isAvailable(context) && context.document.hasBookmark(pageIndex);
  }

  /**
   * Updates bookmark.
   */
  boolean updateBookmark(RnPdfViewContext context, String uuid, String newTitle) {
    if (!isAvailable(context)) {
      return false;
    }
    boolean result = RnBookmarkMapper.updateBookmark(context.document, uuid, newTitle);
    context.readerView.invalidateAllChildren();
    return result;
  }
}
