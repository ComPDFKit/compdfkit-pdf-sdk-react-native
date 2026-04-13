/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFReaderView } from '@compdfkit_pdf_sdk/react_native';
import { Logger } from '../../../util/logger';

export async function showSearchTextView(reader: CPDFReaderView) {
  await reader.showSearchTextView();
}

export async function hideSearchTextView(reader: CPDFReaderView) {
  await reader.hideSearchTextView();
}

export async function jumpToFirstPage(reader: CPDFReaderView) {
  await reader.setDisplayPageIndex(0);
}

export async function jumpToPreviousPage(reader: CPDFReaderView) {
  const currentPage = await reader.getCurrentPageIndex();
  await reader.setDisplayPageIndex(Math.max(0, currentPage - 1));
}

export async function jumpToNextPage(reader: CPDFReaderView) {
  const currentPage = await reader.getCurrentPageIndex();
  const pageCount = await reader._pdfDocument.getPageCount();
  await reader.setDisplayPageIndex(Math.min(pageCount - 1, currentPage + 1));
}

export async function jumpToLastPage(reader: CPDFReaderView) {
  const pageCount = await reader._pdfDocument.getPageCount();
  await reader.setDisplayPageIndex(Math.max(0, pageCount - 1));
}