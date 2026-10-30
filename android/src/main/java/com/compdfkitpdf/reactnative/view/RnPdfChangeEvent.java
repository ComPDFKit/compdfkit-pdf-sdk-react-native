/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.view;

import androidx.annotation.Nullable;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;

/**
 * Carries reader callbacks to the JS `onChange` prop through the event dispatcher.
 */
class RnPdfChangeEvent extends Event<RnPdfChangeEvent> {

  static final String EVENT_NAME = "topChange";

  private final WritableMap payload;

  RnPdfChangeEvent(int surfaceId, int viewTag, WritableMap payload) {
    super(surfaceId, viewTag);
    this.payload = payload;
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

  @Override
  public boolean canCoalesce() {
    // Every reader callback is distinct and must reach JS.
    return false;
  }

  @Nullable
  @Override
  protected WritableMap getEventData() {
    return payload;
  }
}
