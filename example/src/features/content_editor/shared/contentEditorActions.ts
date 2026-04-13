/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import {
  CPDFAlignment,
  CPDFEditType,
  CPDFReaderView,
} from '@compdfkit_pdf_sdk/react_native';
import { launchImageLibrary } from 'react-native-image-picker';

import { CPDFImageData } from '../../../../../src/util/CPDFImageData';
import { Logger } from '../../../util/logger';

/**
 * Switches the reader's content editing mode.
 *
 * `CPDFEditManager.changeEditType(editTypes)` accepts an array of `CPDFEditType`
 * values (TEXT, IMAGE, PATH, NONE). Pass `[CPDFEditType.NONE]` to exit editing.
 */
async function changeEditType(reader: CPDFReaderView, editTypes: CPDFEditType[]) {
  const result = await reader._editManager.changeEditType(editTypes);
  Logger.log('changeEditType:', result);
  return result;
}

export async function enableNoEditMode(reader: CPDFReaderView) {
  return changeEditType(reader, [CPDFEditType.NONE]);
}

export async function enableTextEditMode(reader: CPDFReaderView) {
  return changeEditType(reader, [CPDFEditType.TEXT]);
}

export async function disableEditMode(reader: CPDFReaderView) {
  return changeEditType(reader, [CPDFEditType.NONE]);
}


export async function enableImageEditMode(reader: CPDFReaderView) {
  return changeEditType(reader, [CPDFEditType.IMAGE]);
}

export async function enablePathEditMode(reader: CPDFReaderView) {
  return changeEditType(reader, [CPDFEditType.PATH]);
}

/**
 * Creates a new editable text area on page 0.
 *
 * `CPDFDocument.createNewTextArea(options)` inserts a text block at the
 * given `offset` with the specified font attributes (`attr`). The `maxWidth`
 * parameter controls text wrapping width in points.
 */
export async function insertSampleText(reader: CPDFReaderView) {
  const result = await reader._pdfDocument.createNewTextArea({
    pageIndex: 0,
    content: 'Hello, ComPDFKit!',
    offset: { x: 100, y: 700 },
    maxWidth: 200,
    attr: {
      fontSize: 30,
      fontColor: '#2A2F2F',
      fontColorAlpha: 255,
      alignment: CPDFAlignment.LEFT,
      familyName: 'Times',
      styleName: 'Bold',
    },
  });

  Logger.log('insertSampleText:', result);
  return result;
}

/**
 * Lets the user pick an image and inserts it as an editable image area.
 *
 * `CPDFDocument.createNewImageArea(options)` places an image on the page.
 * The `imageData` is built from the local file URI via `CPDFImageData.fromPath(uri)`.
 */
export async function insertPickedImage(reader: CPDFReaderView) {
  return new Promise<void>(resolve => {
    launchImageLibrary({ mediaType: 'photo' }, async response => {
      if (response.didCancel) {
        resolve();
        return;
      }

      const uri = response.assets?.[0]?.uri;
      if (!uri) {
        resolve();
        return;
      }

      const imageData = CPDFImageData.fromPath(uri);
      await reader._pdfDocument.createNewImageArea({
        pageIndex: 0,
        offset: { x: 100, y: 400 },
        width: 300,
        imageData,
      });

      Logger.log('insertPickedImage: success');
      resolve();
    });
  });
}

export async function undoLastEdit(reader: CPDFReaderView) {
  const canUndo = await reader._editManager.historyManager.canUndo();
  if (canUndo) {
    await reader._editManager.historyManager.undo();
  }
  Logger.log('undoLastEdit:', canUndo);
}

export async function redoLastEdit(reader: CPDFReaderView) {
  const canRedo = await reader._editManager.historyManager.canRedo();
  if (canRedo) {
    await reader._editManager.historyManager.redo();
  }
  Logger.log('redoLastEdit:', canRedo);
}

export function attachHistoryStateLogger(reader: CPDFReaderView) {
  reader._editManager.historyManager.setOnHistoryStateChangedListener(
    (pageIndex, canUndo, canRedo) => {
      Logger.log(
        'ComPDFKitRN onContentEditorHistoryChanged:',
        pageIndex,
        canUndo,
        canRedo,
      );
    },
  );
}