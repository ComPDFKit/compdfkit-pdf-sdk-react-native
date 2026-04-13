/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import {
  ComPDFKit,
  type CPDFConfiguration,
} from '@compdfkit_pdf_sdk/react_native';

import { getPersistedSettingsSnapshot } from './settingsStorage';

const originalGetDefaultConfig = ComPDFKit.getDefaultConfig.bind(ComPDFKit);
let hasPatchedDefaultConfig = false;

export function getExampleDefaultConfig(
  overrides: Partial<CPDFConfiguration> = {},
): string {
  const persistedSettings = getPersistedSettingsSnapshot();

  return originalGetDefaultConfig({
    ...overrides,
    readerViewConfig: {
      linkHighlight: persistedSettings.highlightLinkArea,
      formFieldHighlight: persistedSettings.highlightFormArea,
      ...overrides.readerViewConfig,
    },
    annotationsConfig: {
      annotationAuthor: persistedSettings.annotationAuthor,
      ...overrides.annotationsConfig,
    },
  });
}

export function applyPersistedReaderConfigDefaults(): void {
  if (hasPatchedDefaultConfig) {
    return;
  }

  ComPDFKit.getDefaultConfig = ((
    overrides: Partial<CPDFConfiguration> = {},
  ) => getExampleDefaultConfig(overrides)) as typeof ComPDFKit.getDefaultConfig;

  hasPatchedDefaultConfig = true;
}