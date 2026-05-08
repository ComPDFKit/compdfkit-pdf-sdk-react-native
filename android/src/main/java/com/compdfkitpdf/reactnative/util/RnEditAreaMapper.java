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

import android.content.Context;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Point;
import android.graphics.RectF;
import android.util.Log;
import androidx.annotation.Nullable;
import com.compdfkit.core.annotation.CPDFTextAttribute;
import com.compdfkit.core.annotation.CPDFTextAttribute.FontNameHelper;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.edit.CPDFEditArea;
import com.compdfkit.core.edit.CPDFEditCharItem;
import com.compdfkit.core.edit.CPDFEditCharPlace;
import com.compdfkit.core.edit.CPDFEditImageArea;
import com.compdfkit.core.edit.CPDFEditPage;
import com.compdfkit.core.edit.CPDFEditPathArea;
import com.compdfkit.core.edit.CPDFEditTextArea;
import com.compdfkit.core.edit.CPDFEditTextArea.PDFEditAlignType;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.tools.common.utils.threadpools.CThreadPoolUtils;
import com.compdfkit.ui.attribute.CPDFEditorTextAttr;
import com.compdfkit.ui.edit.CPDFEditTextSelections;
import com.compdfkit.ui.reader.CPDFPageView;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import java.util.HashMap;
import java.util.List;

/**
 * Provides edit area mapping and lookup helpers for React Native bridge operations.
 */
public class RnEditAreaMapper {

  /**
   * Returns the edit area.
   */
  public static @Nullable CPDFEditArea getEditArea(CPDFDocument document, int pageIndex,
    String uuid, String type) {
    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFEditPage editPage = page.getEditPage(false);
    List<? extends CPDFEditArea> editAreas;
    switch (type) {
      case "image":
        editAreas = editPage.getEditImageAreas();
        break;
      case "text":
        editAreas = editPage.getEditTextAreas();
        break;
      case "path":
        editAreas = editPage.getEditPathAreas();
        break;
      default:
        return null;
    }

    if (editAreas != null) {
      for (CPDFEditArea editArea : editAreas) {
        if (editArea == null || !editArea.isValid()) {
          continue;
        }
        String ptr = editArea.getPtr() + "";
        if (ptr.equals(uuid)) {
          return editArea;
        }
      }
    }
    return null;
  }


  /**
   * Returns the edit area map.
   */
  public static WritableMap getEditAreaMap(CPDFPageView pageView,
    CPDFEditArea editArea) {
    if (editArea instanceof CPDFEditTextArea) {
      return getEditTextAreaMap(pageView, (CPDFEditTextArea) editArea);
    } else if (editArea instanceof CPDFEditImageArea) {
      return getEditImageAreaMap((CPDFEditImageArea) editArea);
    } else if (editArea instanceof CPDFEditPathArea) {
      return getEditPathAreaMap((CPDFEditPathArea) editArea);
    }
    return Arguments.createMap();
  }

  /**
   * Returns the edit text area map.
   */
  public static WritableMap getEditTextAreaMap(
    CPDFEditTextSelections editTextSelections) {
    CPDFEditTextArea textArea = editTextSelections.getEditTextArea();
    WritableMap map = Arguments.createMap();
    if (textArea == null || !textArea.isValid()) {
      return map;
    }
    map.putString("type", "text");
    map.putInt("page", textArea.getPageNum());
    map.putString("uuid", textArea.getPtr() + "");
    CPDFEditCharPlace[] select = editTextSelections.getSelectBeginAndEndPlace();
    if (select != null && select.length == 2) {
      String text = textArea.getText(select[0], select[1]);
      map.putString("text", text);
      map.putString("alignment",
        RnEnumConverter.editAlignTypeToString(editTextSelections.getAlign()));
      map.putDouble("fontSize", editTextSelections.getFontSize());
      map.putString("color", RnAppUtils.toHexColor(editTextSelections.getColor()));
      map.putDouble("alpha", editTextSelections.getTransparancy());
      String psName = editTextSelections.getFontName();
      String[] names = RnEnumConverter.parseFamilyAndStyleFromPsName(psName);

      map.putString("familyName", names[0]);
      map.putString("styleName", names[1]);
    }
    return map;
  }

  /**
   * Returns the edit text area map.
   */
  public static WritableMap getEditTextAreaMap(CPDFPageView pageView,
    CPDFEditTextArea textArea) {
    CPDFEditTextSelections textSelections = new CPDFEditTextSelections(pageView, textArea,
      textArea.getCurrentAreaSelections());
    return getEditTextAreaMap(textSelections);
  }

  /**
   * Returns the edit image area map.
   */
  public static WritableMap getEditImageAreaMap(CPDFEditImageArea imageArea) {
    WritableMap map = Arguments.createMap();
    if (imageArea == null || !imageArea.isValid()) {
      return map;
    }
    map.putString("type", "image");
    map.putInt("page", imageArea.getPageNum());
    map.putDouble("alpha", imageArea.getTransparency());
    map.putString("uuid", imageArea.getPtr() + "");
    return map;
  }

  /**
   * Returns the edit path area map.
   */
  public static WritableMap getEditPathAreaMap(CPDFEditPathArea pathArea) {
    WritableMap map = Arguments.createMap();
    if (pathArea == null || !pathArea.isValid()) {
      return map;
    }
    map.putString("type", "path");
    map.putInt("page", pathArea.getPageNum());
    map.putString("uuid", pathArea.getPtr() + "");
    return map;
  }

  /**
   * Removes edit area.
   */
  public static boolean removeEditArea(CPDFDocument document, int pageIndex, String uuid,
    String type) {
    CPDFEditArea editArea = getEditArea(document, pageIndex, uuid, type);
    if (editArea == null || !editArea.isValid()) {
      return true;
    }
    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFEditPage editPage = page.getEditPage(false);
    if (editArea instanceof CPDFEditTextArea) {
      editPage.removeArea((CPDFEditTextArea) editArea);
    } else if (editArea instanceof CPDFEditImageArea) {
      editPage.removeArea((CPDFEditImageArea) editArea);
    } else if (editArea instanceof CPDFEditPathArea) {
      editPage.removeArea((CPDFEditPathArea) editArea);
    }
    return true;
  }

  /**
   * Creates new text area.
   */
  public static CPDFEditArea createNewTextArea(CPDFDocument document,
    HashMap<String, Object> dataMap, CPDFEditorTextAttr normalTextAttr) {
    double pageIndex = (double) dataMap.get("page_index");
    double pointX = (double) dataMap.get("x");
    double pointY = (double) dataMap.get("y");
    HashMap<String, Object> attrMap = (HashMap<String, Object>) dataMap.get("attr");
    String content = (String) dataMap.get("content");
    boolean isEditMode = (boolean) dataMap.get("isEditMode");
    double maxWidth = 0;
    if (dataMap.get("max_width") != null) {
      maxWidth = (double) dataMap.get("max_width");
    }
    CPDFPage page = document.pageAtIndex((int) pageIndex);

    Point point = new Point((int) pointX, (int) pointY);
    RectF area = new RectF(point.x, point.y, point.x, point.y);

    // Get the edit page object
    CPDFEditPage cpdfEditPage = page.getEditPage(false);
    cpdfEditPage.beginEdit(CPDFEditPage.LoadTextImage);

    if (cpdfEditPage == null || !cpdfEditPage.isValid()) {
      return null;
    }

    CPDFTextAttribute textAttribute = normalTextAttr.getTextAttribute();
    String[] names = RnEnumConverter.parseFamilyAndStyleFromPsName(textAttribute.getFontName());

    if (attrMap == null) {
      attrMap = new HashMap<>();
    }
    RnAppUtils.putIfAbsentCompat(attrMap, "familyName", names[0]);
    RnAppUtils.putIfAbsentCompat(attrMap, "styleName", names[1]);
    RnAppUtils.putIfAbsentCompat(attrMap, "fontSize", (double) textAttribute.getFontSize());
    RnAppUtils.putIfAbsentCompat(attrMap, "fontColor", RnAppUtils.toHexColor(textAttribute.getColor()));
    RnAppUtils.putIfAbsentCompat(attrMap, "fontColorAlpha", (double) normalTextAttr.getAlpha());
    RnAppUtils.putIfAbsentCompat(attrMap, "alignment", RnEnumConverter.editAlignTypeToString(
      normalTextAttr.getAlignment()));

    // Define the font, font size, and text color
    String familyName = (String) attrMap.get("familyName");
    String styleName = (String) attrMap.get("styleName");
    String psName = FontNameHelper.obtainFontName(familyName, styleName);
    double fontSize = (double) attrMap.get("fontSize");
    String fontColor = attrMap.get("fontColor").toString();
    double alpha = (double) attrMap.get("fontColorAlpha");
    String alignmentStr = attrMap.get("alignment").toString();
    PDFEditAlignType alignType = RnEnumConverter.stringToEditAlignType(alignmentStr);

    // Create a new text area
    CPDFEditTextArea editTextArea = cpdfEditPage.createNewTextArea(area, psName,
      (float) fontSize, Color.parseColor(fontColor), (int) alpha, false, false, alignType);

    if (editTextArea != null && editTextArea.isValid()) {
      // Get the start and end positions for text insertion
      CPDFEditCharItem begin = editTextArea.getBeginCharPlace();
      CPDFEditCharItem end = editTextArea.getEndCharPlace();
      // Insert the content into the text area
      CPDFEditCharItem charItem = editTextArea.insertTextRange(begin.getPlace(),
        end.getPlace(), content);

      RectF currentRect = editTextArea.getFrame(true);
      if (maxWidth != 0) {
        currentRect.right = area.left + (float) maxWidth;
        editTextArea.setFrame(currentRect, true);
      }
      if (!isEditMode) {
        page.endEdit();
      }
      return editTextArea;
    }
    return null;
  }

  /**
   * Creates new image area.
   */
  public static void createNewImageArea(CPDFDocument document, HashMap<String, Object> dataMap,
    CPDFFlutterCreateAreaCallback callback) {
    CThreadPoolUtils.getInstance().executeIO(() -> {

      double pageIndex = (double) dataMap.get("page_index");
      double pointX = (double) dataMap.get("x");
      double pointY = (double) dataMap.get("y");
      HashMap<String, Object> imageDataMap = (HashMap<String, Object>) dataMap.get("image_data");
      boolean isEditMode = (boolean) dataMap.get("isEditMode");
      double width = dataMap.get("width") != null ? (double) dataMap.get("width") : 200;
      CPDFPage page = document.pageAtIndex((int) pageIndex);

      // Get the edit page object
      CPDFEditPage cpdfEditPage = page.getEditPage(false);

      if (cpdfEditPage == null || !cpdfEditPage.isValid()) {
        if (callback != null) {
          callback.callback(null);
        }
        return;
      }

      // Start edit mode
      cpdfEditPage.beginEdit(CPDFEditPage.LoadImage);

      String imageType = (String) imageDataMap.get("type");
      String imageData = (String) imageDataMap.get("data");
      if (imageType == null || imageData == null) {
        Log.e("RnEditAreaMapper", "Invalid image data");
        if (callback != null) {
          callback.callback(null);
        }
        return;
      }

      String imagePath = getImagePath(document.getContext(), imageType, imageData);
      if (imagePath == null) {
        Log.e("RnEditAreaMapper", "Failed to get image path");
        callback.callback(null);
        return;
      }

      BitmapFactory.Options options = new BitmapFactory.Options();
      options.inJustDecodeBounds = true;
      BitmapFactory.decodeFile(imagePath, options);
      int bitmapWidth = options.outWidth;
      int bitmapHeight = options.outHeight;

      if (bitmapWidth <= 0 || bitmapHeight <= 0) {
        Log.e("RnEditAreaMapper", "Invalid bitmap dimensions");
        if (callback != null) {
          callback.callback(null);
        }
        return;
      }

      RectF insertRect = calculateInsertRect(
        page,
        pointX,
        pointY,
        bitmapWidth,
        bitmapHeight,
        width
      );

      try {
        CThreadPoolUtils.getInstance().executeMain(() -> {
          CPDFEditArea editArea = cpdfEditPage.createNewImageArea(
            insertRect,
            imagePath,
            null
          );
          if (!isEditMode) {
            page.endEdit();
          }
          if (callback != null) {
            callback.callback(editArea);
          }
        });
      } catch (Exception ignored) {
        callback.callback(null);
      }
    });
  }

  /**
   * Defines the contract for flutter create area callback.
   */
  public interface CPDFFlutterCreateAreaCallback {

    /**
     * Handles callback.
     */
    void callback(CPDFEditArea editArea);
  }


  /**
   * Returns the image path.
   */
  private static @Nullable String getImagePath(
    Context context,
    String type,
    String data
  ) {
    try {
      switch (type) {
        case "filePath":
        case "uri":
          return RnFileUtils.parseFilePath(context, data);

        case "base64":
          return RnFileUtils.base64ToTempFile(context, data);

        case "asset":
          return RnFileUtils.assetToTempFile(context, data);
        default:
          Log.e("RnEditAreaMapper", "Unknown image type: " + type);
          return null;
      }
    } catch (Exception e) {
      Log.e("RnEditAreaMapper", "Error processing image: " + type, e);
      return null;
    }
  }

  /**
   * Returns calculate insert rect.
   */
  private static RectF calculateInsertRect(
    CPDFPage page,
    double pointX,
    double pointY,
    int bitmapWidth,
    int bitmapHeight,
    @Nullable Double width
  ) {
    RectF pageSize = page.getSize();
    int pageWidth = (int) pageSize.width();
    int pageHeight = (int) pageSize.height();

    if (page.getRotation() == 90 || page.getRotation() == 270) {
      int temp = pageWidth;
      pageWidth = pageHeight;
      pageHeight = temp;
    }
    float ratio = (float) bitmapWidth / bitmapHeight;
    int finalWidth;
    int finalHeight;

    if (width != null && width > 0) {
      finalWidth = width.intValue();
      finalHeight = (int) (finalWidth / ratio);
    } else {
      finalWidth = bitmapWidth;
      finalHeight = bitmapHeight;
    }

    if (finalWidth > pageWidth) {
      finalWidth = pageWidth;
      finalHeight = (int) (finalWidth / ratio);
    }
    if (finalHeight > pageHeight) {
      finalHeight = pageHeight;
      finalWidth = (int) (finalHeight * ratio);
    }

    float left = (float) pointX;
    float top = (float) pointY;

    if (left + finalWidth > pageWidth) {
      left = pageWidth - finalWidth;
    }
    if (left < 0) {
      left = 0;
    }

    if (top - finalHeight < 0) {
      top = finalHeight;
    }
    if (top > pageHeight) {
      top = pageHeight;
    }

    return new RectF(
      left,
      top,
      left + finalWidth,
      top - finalHeight
    );
  }
}
