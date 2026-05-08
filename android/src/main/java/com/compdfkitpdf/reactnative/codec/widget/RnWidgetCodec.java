/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
package com.compdfkitpdf.reactnative.codec.widget;

import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.document.CPDFDocument;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;


/**
 * Maps widget data between native objects and React Native maps.
 */
public interface RnWidgetCodec {


  /**
   * Returns the widget.
   */
  public WritableMap getWidget(CPDFAnnotation annotation);

  /**
   * Updates widget.
   */
  public void updateWidget(
    CPDFAnnotation annotation,
    ReadableMap annotMap);

  /**
   * Adds widget.
   */
  CPDFWidget addWidget(CPDFDocument document, ReadableMap widgetMap);

}
