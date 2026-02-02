/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
package com.compdfkitpdf.reactnative.util.annotation.forms;

import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.form.CPDFWidget;
import com.compdfkit.core.document.CPDFDocument;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;


public interface RCPDFWidget {


  public WritableMap getWidget(CPDFAnnotation annotation);

  public void updateWidget(
    CPDFAnnotation annotation,
    ReadableMap annotMap);

  CPDFWidget addWidget(CPDFDocument document, ReadableMap widgetMap);

}
