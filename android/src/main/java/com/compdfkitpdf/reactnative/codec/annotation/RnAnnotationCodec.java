/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.codec.annotation;


import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.document.CPDFDocument;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

/**
 * Maps annotation annotation data between native objects and React Native maps.
 */
public interface RnAnnotationCodec {

  /**
   * Returns the annotation.
   */
  public WritableMap getAnnotation(CPDFAnnotation annotation);

  /**
   * Updates annotation.
   */
  void updateAnnotation(
    CPDFAnnotation annotation,
    ReadableMap annotMap);

  /**
   * Adds annotation.
   */
  CPDFAnnotation addAnnotation(CPDFDocument document, ReadableMap annotMap);

}
