/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import RNFS from 'react-native-fs';

export type PersistedSettings = {
  highlightLinkArea: boolean;
  highlightFormArea: boolean;
  annotationAuthor: string;
};

export const DEFAULT_PERSISTED_SETTINGS: PersistedSettings = {
  highlightLinkArea: true,
  highlightFormArea: true,
  annotationAuthor: 'ComPDF',
};

const SETTINGS_FILE_PATH = `${RNFS.DocumentDirectoryPath}/compdfkit-example-settings.json`;
let cachedSettings: PersistedSettings = DEFAULT_PERSISTED_SETTINGS;

export async function loadPersistedSettings(): Promise<PersistedSettings> {
  try {
    const exists = await RNFS.exists(SETTINGS_FILE_PATH);
    if (!exists) {
      cachedSettings = DEFAULT_PERSISTED_SETTINGS;
      return DEFAULT_PERSISTED_SETTINGS;
    }

    const raw = await RNFS.readFile(SETTINGS_FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Partial<PersistedSettings>;

    cachedSettings = {
      highlightLinkArea:
        typeof parsed.highlightLinkArea === 'boolean'
          ? parsed.highlightLinkArea
          : DEFAULT_PERSISTED_SETTINGS.highlightLinkArea,
      highlightFormArea:
        typeof parsed.highlightFormArea === 'boolean'
          ? parsed.highlightFormArea
          : DEFAULT_PERSISTED_SETTINGS.highlightFormArea,
      annotationAuthor:
        typeof parsed.annotationAuthor === 'string' && parsed.annotationAuthor.trim()
          ? parsed.annotationAuthor
          : DEFAULT_PERSISTED_SETTINGS.annotationAuthor,
    };

    return cachedSettings;
  } catch {
    cachedSettings = DEFAULT_PERSISTED_SETTINGS;
    return DEFAULT_PERSISTED_SETTINGS;
  }
}

export function getPersistedSettingsSnapshot(): PersistedSettings {
  return cachedSettings;
}

export async function savePersistedSettings(
  settings: PersistedSettings,
): Promise<void> {
  cachedSettings = settings;
  await RNFS.writeFile(
    SETTINGS_FILE_PATH,
    JSON.stringify(settings, null, 2),
    'utf8',
  );
}
