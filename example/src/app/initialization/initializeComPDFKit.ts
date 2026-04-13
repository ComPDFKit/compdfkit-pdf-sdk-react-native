/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { Platform } from 'react-native';
import { ComPDFKit } from '@compdfkit_pdf_sdk/react_native';

import { CPDFFileUtil } from '../../util/CPDFFileUtil';
import { Logger } from '../../util/logger';

let hasInitialized = false;
let initializationPromise: Promise<void> | null = null;

/**
 * Initializes the ComPDFKit SDK (singleton, safe to call multiple times).
 *
 * Steps:
 * 1. Copies bundled extra fonts from app assets to device storage
 *    via `CPDFFileUtil.copyAssetsFolderToStorage()`.
 * 2. Registers the font directory with `ComPDFKit.setImportFontDir(dir, addSystemFonts)`
 *    so the SDK can render custom typefaces.
 * 3. Activates the license using `ComPDFKit.initWithPath(licensePath)` where
 *    the license XML is bundled in platform-specific asset locations.
 */
export async function initializeComPDFKit(): Promise<void> {
  if (hasInitialized) {
    return;
  }

  if (!initializationPromise) {
    initializationPromise = (async () => {
      const fontDir = await CPDFFileUtil.copyAssetsFolderToStorage('extraFonts');
      Logger.log('fontDir:', fontDir);
      await ComPDFKit.setImportFontDir(fontDir, true);

      const licensePath =
        Platform.OS === 'android'
          ? 'assets://license_key_rn.xml'
          : 'license_key_rn.xml';
      const result = await ComPDFKit.initWithPath(licensePath);
      Logger.log('init:', result);
      hasInitialized = true;
    })().catch(error => {
      initializationPromise = null;
      Logger.error('initialize error:', error);
      throw error;
    });
  }

  return initializationPromise;
}