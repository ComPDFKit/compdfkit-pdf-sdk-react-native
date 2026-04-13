/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFReaderView, ComPDFKit } from '@compdfkit_pdf_sdk/react_native';

import { CPDFFileUtil } from '../../../../util/CPDFFileUtil';
import { Logger } from '../../../../util/logger';

export async function openDocument(reader: CPDFReaderView) {
  const document = await ComPDFKit.pickFile();
  if (document) {
    await reader._pdfDocument.open(document);
  }
}

export async function saveDocument(reader: CPDFReaderView) {
  const success = await reader.save();
  Logger.log('ComPDFKitRN save:', success);
  return success;
}

export async function saveDocumentAs(reader: CPDFReaderView) {
  const fileUtil = new CPDFFileUtil();
  const uniqueFilePath = await fileUtil.getUniqueFilePath('save_as_test', 'pdf');
  const success = await reader._pdfDocument.saveAs(uniqueFilePath, false, true);
  Logger.log('ComPDFKitRN saveAs:', success, uniqueFilePath);
  return {
    success,
    filePath: success ? uniqueFilePath : null,
  };
}

export async function logDocumentChangeState(reader: CPDFReaderView) {
  const hasChange = await reader._pdfDocument.hasChange();
  Logger.log('ComPDFKitRN hasChange:', hasChange);
  return hasChange;
}

export async function setReaderScale(reader: CPDFReaderView) {
  await reader.setScale(2.3);
  const scale = await reader.getScale();
  Logger.log('ComPDFKitRN scale:', scale);
  return scale;
}

export async function showThumbnailView(reader: CPDFReaderView) {
  await reader.showThumbnailView(false);
}

export async function showBotaView(reader: CPDFReaderView) {
  await reader.showBotaView();
}

export async function showAddWatermarkView(reader: CPDFReaderView) {
  await reader.showAddWatermarkView();
}

export async function showSecurityView(reader: CPDFReaderView) {
  await reader.showSecurityView();
}

export async function showSearchTextView(reader: CPDFReaderView) {
  await reader.showSearchTextView();
}

export async function hideSearchTextView(reader: CPDFReaderView) {
  await reader.hideSearchTextView();
}

export async function enterSnipMode(reader: CPDFReaderView) {
  await reader.enterSnipMode();
}

export async function exitSnipMode(reader: CPDFReaderView) {
  await reader.exitSnipMode();
}

export async function openNativeDisplaySettingView(reader: CPDFReaderView) {
  await reader.showDisplaySettingView();
}