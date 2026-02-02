/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.util;

import android.text.TextUtils;
import android.util.Log;
import com.compdfkit.core.document.CPDFDestination;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.document.CPDFOutline;
import com.compdfkit.core.document.action.CPDFAction;
import com.compdfkit.core.document.action.CPDFGoToAction;
import com.compdfkit.core.document.action.CPDFUriAction;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import javax.annotation.Nullable;


public class CPDFOutlineUtil {

  public static WritableMap newOutlineRoot(CPDFDocument document) {
    if (document.getOutlineRoot() != null) {
      return getOutlineMap(document);
    }
    document.newOutlineRoot();
    return getOutlineMap(document);
  }

  public static WritableMap getOutlineMap(CPDFDocument document) {
    CPDFOutline outline = document.getOutlineRoot();
    if (outline == null) {
      return null;
    }
    try {
      return getOutlineMap(document, outline);
    } catch (Exception e) {
      return null;
    }
  }

  private static WritableMap getOutlineMap(CPDFDocument document, CPDFOutline outline)  {
    WritableMap map = Arguments.createMap();
    if (outline.outlinePtr == 0){
      return map;
    }
    map.putString("uuid", outline.outlinePtr + "");
    map.putString("tag", outline.getTag());
    map.putString("title", outline.getTitle());
    map.putInt("level", outline.getLevel());

    WritableMap actionMap = getActionMap(document, outline.getAction());
    if (actionMap != null) {
      map.putMap("action", actionMap);
    }
    WritableMap destinationMap = getDestinationMap(outline.getDestination());
    if (destinationMap != null) {
      map.putMap("destination", destinationMap);
      WritableMap gotoMap = Arguments.createMap();
      gotoMap.putInt("pageIndex", outline.getDestination().getPageIndex());
      gotoMap.putString("actionType", "goTo");
      map.putMap("action", gotoMap);
    }

    if (outline.getChildList() != null && outline.getChildList().length > 0) {
      WritableArray array = Arguments.createArray();
      for (CPDFOutline child : outline.getChildList()) {
        WritableMap childMap = getOutlineMap(document, child);
        if (childMap.getEntryIterator().hasNext()){
          array.pushMap(childMap);
        }
      }
      map.putArray("childList", array);
    }
    return map;
  }

  private static @Nullable WritableMap getActionMap(CPDFDocument document, CPDFAction action) {
    WritableMap map = Arguments.createMap();
    if (action == null) {
      return null;
    }
    switch (action.getActionType()) {
      case PDFActionType_URI:
        map.putString("actionType", "uri");
        CPDFUriAction uriAction = (CPDFUriAction) action;
        map.putString("uri", uriAction.getUri());
        break;
      case PDFActionType_GoTo:
        CPDFGoToAction goToAction = (CPDFGoToAction) action;
        map.putString("actionType", "goTo");
        CPDFDestination destination = goToAction.getDestination(document);
        if (destination != null) {
          map.putMap("destination", getDestinationMap(destination));
        }
        break;
    }
    return map;
  }

  private static @Nullable WritableMap getDestinationMap(CPDFDestination destination) {
    WritableMap map = Arguments.createMap();

    if (destination == null) {
      return null;
    }

    map.putInt("pageIndex", destination.getPageIndex());
    map.putDouble("zoom", destination.getZoom());
    map.putDouble("positionX", destination.getPosition_x());
    map.putDouble("positionY", destination.getPosition_y());
    return map;
  }

  public static boolean addOutline(CPDFDocument document, String parentUuid, String title, int insertIndex, int pageIndex) {
    if (TextUtils.isEmpty(parentUuid) ){
      Log.w("ComPDFKit", "add outline failed: parentUuid is empty");
      return false;
    }
    CPDFOutline parentOutline = findOutlineByUUid(document.getOutlineRoot(), parentUuid);

    if (insertIndex == -1) {
      insertIndex = parentOutline.getChildList() != null ? parentOutline.getChildList().length : 0;
    }
    CPDFOutline newOutline = parentOutline.insertChildAtIndex(insertIndex);
    newOutline.setTitle(title);
    CPDFDestination destination = new CPDFDestination(pageIndex, 0, 0, 1F);
    newOutline.setDestination(destination);
    return true;
  }

  public static boolean moveTo(CPDFDocument document, String uuid, String newParentUuid,
    int insertIndex) {
    CPDFOutline outline = findOutlineByUUid(document.getOutlineRoot(), uuid);
    CPDFOutline newParentOutline = findOutlineByUUid(document.getOutlineRoot(), newParentUuid);
    if (outline == null || newParentOutline == null) {
      return false;
    }
    if (insertIndex == -1) {
      insertIndex =
        newParentOutline.getChildList() != null ? newParentOutline.getChildList().length : 0;
    }
    return outline.moveTo(newParentOutline, insertIndex);
  }


  public static boolean deleteOutline(CPDFDocument document, String uuid) {
    CPDFOutline outline = findOutlineByUUid(document.getOutlineRoot(), uuid);
    if (outline == null) {
      return false;
    }
    return outline.removeFromParent();
  }

  public static boolean updateOutline(CPDFDocument document, String uuid, String newTitle,
    int pageIndex) {
    CPDFOutline outline = findOutlineByUUid(document.getOutlineRoot(), uuid);
    if (outline == null) {
      return false;
    }
    outline.setTitle(newTitle);
    outline.setDestination(new CPDFDestination(pageIndex, 0, 0, 1F));
    return true;
  }

  private static CPDFOutline findOutlineByUUid(CPDFOutline rootOutline, String uuid) {
    if (rootOutline == null || uuid == null) {
      return null;
    }
    if ((rootOutline.outlinePtr + "").equals(uuid)) {
      return rootOutline;
    }
    if (rootOutline.getChildList() != null) {
      for (CPDFOutline child : rootOutline.getChildList()) {
        CPDFOutline result = findOutlineByUUid(child, uuid);
        if (result != null) {
          return result;
        }
      }
    }
    return null;
  }


}
