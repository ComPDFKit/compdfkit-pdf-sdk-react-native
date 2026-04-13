/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFPageSize, CPDFReaderView } from '@compdfkit_pdf_sdk/react_native';
import { Logger } from '../../../util/logger';
import { launchImageLibrary } from 'react-native-image-picker';

import { CPDFFileUtil } from '../../../util/CPDFFileUtil';

/**
 * Inserts a blank A4-sized page at the beginning of the document.
 *
 * Uses `CPDFDocument.insertBlankPage(pageIndex, pageSize)` to add a new empty page.
 * `CPDFPageSize.a4` provides the standard 595×842 pt dimension.
 */
export async function insertBlankPage(reader: CPDFReaderView) {
  const result = await reader._pdfDocument.insertBlankPage(0, CPDFPageSize.a4);
  Logger.log('insertBlankPage:', result);
  return result;
}

/**
 * Lets the user pick an image from the device gallery and inserts it as a new page.
 *
 * Uses `CPDFDocument.insertImagePage(pageIndex, imagePath, pageSize)` where the page
 * size is derived from the actual image dimensions via `CPDFPageSize.custom(w, h)`.
 * After insertion, calls `reloadPages2()` to refresh the viewer.
 */
export async function insertImagePage(reader: CPDFReaderView) {
  return new Promise<boolean>(resolve => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      async response => {
        if (response.didCancel) {
          resolve(false);
          return;
        }

        const uri = response.assets?.[0]?.uri;
        const asset = response.assets?.[0];
        if (!uri || !asset?.width || !asset?.height) {
          Logger.log('insertImagePage: invalid image asset');
          resolve(false);
          return;
        }

        const result = await reader._pdfDocument.insertImagePage(
          0,
          uri,
          CPDFPageSize.custom(asset.width, asset.height)
        );

        if (result) {
          await reader.reloadPages2();
        }

        Logger.log('insertImagePage:', result);
        resolve(result);
      }
    );
  });
}

/**
 * Removes the first three pages (indices 0, 1, 2) from the document.
 *
 * Uses `CPDFDocument.removePages(pageIndices)` which accepts an array of
 * zero-based page indices. Calls `reloadPages2()` afterwards to synchronize the viewer.
 */
export async function removeSamplePages(reader: CPDFReaderView) {
  const result = await reader._pdfDocument.removePages([0, 1, 2]);
  if (result) {
    await reader.reloadPages2();
  }
  Logger.log('deletePageAtIndex:', result);
  return result;
}

/**
 * Rotates the first page by 90° clockwise.
 *
 * Retrieves the current rotation via `CPDFPage.getRotation()`, then sets
 * `CPDFPage.setRotation(degrees)` with the incremented value. Calls
 * `reloadPages()` to apply the visual change.
 */
export async function rotateFirstPage(reader: CPDFReaderView) {
  const page = await reader._pdfDocument.pageAtIndex(0);
  const rotation = await page?.getRotation();
  const result = await page?.setRotation((rotation ?? 0) + 90);
  if (result) {
    await reader.reloadPages();
  }
  Logger.log('rotatePage:', result);
  return result;
}

/**
 * Moves the second page to the first position.
 *
 * Uses `CPDFDocument.movePage(fromIndex, toIndex)` to reorder pages.
 * After a successful move, `reloadPages2()` refreshes the viewer.
 */
export async function moveSecondPageToFirst(reader: CPDFReaderView) {
  const result = await reader._pdfDocument.movePage(1, 0);
  if (result) {
    await reader.reloadPages2();
  }
  Logger.log('movePage:', result);
  return result;
}

/**
 * Splits the first page into a new standalone PDF document.
 *
 * Uses `CPDFDocument.splitDocumentPages(outputPath, pageIndices)` to extract
 * specific pages into a new file. On success, opens the newly created file
 * with `CPDFDocument.open(filePath)`.
 */
export async function splitFirstPage(reader: CPDFReaderView) {
  const fileUtil = new CPDFFileUtil();
  const uniqueFilePath = await fileUtil.getUniqueFilePath('split_document_test', 'pdf');
  const result = await reader._pdfDocument.splitDocumentPages(uniqueFilePath, [0]);
  Logger.log('splitDocumentPages:', result);

  if (result) {
    await reader._pdfDocument.open(uniqueFilePath);
  }

  return result;
}