/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.viewer;

import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl;
import com.compdfkit.ui.reader.CPDFReaderView;
import com.compdfkitpdf.reactnative.codec.RnPageCodec;
import com.compdfkitpdf.reactnative.view.RnPdfView;

/**
 * Bundles the native viewer objects associated with a single React Native view instance.
 */
final class RnPdfViewContext {

  final RnPdfView view;
  final CPDFReaderView readerView;
  final CPDFDocument document;
  final RnPageCodec pageUtil;
  final CPDFViewCtrl viewCtrl;

  /**
   * Creates a new RnPdfViewContext instance.
   */
  RnPdfViewContext(RnPdfView view) {
    this.view = view;
    this.readerView = view.getCPDFReaderView();
    this.document = readerView.getPDFDocument();
    this.pageUtil = view.getCPDFPageUtil();
    this.pageUtil.setDocument(document);
    this.viewCtrl = view.documentFragment.pdfView;
  }
}
