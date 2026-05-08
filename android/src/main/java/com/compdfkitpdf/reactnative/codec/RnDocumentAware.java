package com.compdfkitpdf.reactnative.codec;

import com.compdfkit.core.document.CPDFDocument;

/**
 * Defines the contract for codecs that need access to the active PDF document.
 */
public interface RnDocumentAware {

  /**
   * Sets the document.
   */
  void setDocument(CPDFDocument document);
}
