package com.compdfkitpdf.reactnative.codec;

import com.compdfkit.core.document.CPDFDestination;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.document.action.CPDFAction;
import com.compdfkit.core.document.action.CPDFAction.ActionType;
import com.compdfkit.core.document.action.CPDFGoToAction;
import com.compdfkit.core.document.action.CPDFUriAction;
import com.compdfkitpdf.reactnative.util.RnEnumConverter;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

/**
 * Encodes and decodes native PDF actions to and from React Native-friendly maps.
 */
public final class RnActionCodec {

  /**
   * Creates a new RnActionCodec instance.
   */
  private RnActionCodec() {
  }

  /**
   * Encodes a native action into a React Native-friendly map.
   */
  public static WritableMap encodeAction(CPDFDocument document, CPDFAction action) {
    if (action == null) {
      return null;
    }
    WritableMap actionMap = Arguments.createMap();
    actionMap.putString("actionType", RnEnumConverter.actionTypeToString(action));
    if (action.getActionType() == ActionType.PDFActionType_URI) {
      CPDFUriAction uriAction = (CPDFUriAction) action;
      String uri = uriAction.getUri();
      if (uri != null && uri.startsWith("mailto:")) {
        uri = uri.replace("mailto:", "");
      }
      actionMap.putString("uri", uri);
    } else if (action.getActionType() == ActionType.PDFActionType_GoTo && document != null) {
      CPDFGoToAction goToAction = (CPDFGoToAction) action;
      CPDFDestination destination = goToAction.getDestination(document);
      if (destination != null) {
        actionMap.putInt("pageIndex", destination.getPageIndex());
      }
    }
    return actionMap;
  }

  /**
   * Decodes a React Native action map into a native action.
   */
  public static CPDFAction decodeAction(CPDFDocument document, ReadableMap actionMap) {
    if (document == null || actionMap == null) {
      return null;
    }
    String actionType = actionMap.getString("actionType");
    if ("uri".equals(actionType)) {
      String uri = actionMap.getString("uri");
      CPDFUriAction uriAction = new CPDFUriAction();
      uriAction.setUri(uri);
      return uriAction;
    }
    if ("goTo".equals(actionType)) {
      int pageIndex = actionMap.getInt("pageIndex");
      float height = document.pageAtIndex(pageIndex).getSize().height();
      CPDFDestination destination = new CPDFDestination(pageIndex, 0F, height, 1F);
      CPDFGoToAction goToAction = new CPDFGoToAction();
      goToAction.setDestination(document, destination);
      return goToAction;
    }
    return null;
  }
}
