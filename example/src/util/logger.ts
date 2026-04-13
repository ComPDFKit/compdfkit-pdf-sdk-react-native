/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

const TAG = 'ComPDFKitRN';

/**
 * Whether debug logging is enabled.
 * Set to `false` before shipping to suppress all SDK example logs.
 */
let debugEnabled: boolean = __DEV__;

export const Logger = {
  setEnabled(enabled: boolean) {
    debugEnabled = enabled;
  },

  log(...args: unknown[]) {
    if (debugEnabled) {
      console.log(TAG, ...args);
    }
  },

  warn(...args: unknown[]) {
    if (debugEnabled) {
      console.warn(TAG, ...args);
    }
  },

  error(...args: unknown[]) {
    // Errors are always printed regardless of debug flag.
    console.error(TAG, ...args);
  },
};
