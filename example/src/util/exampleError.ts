/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

/**
 * Formats an SDK error for display. Native rejections carry a stable `code`
 * (for example `INVALID_OUTPUT_PATH`), which is shown before the message.
 */
export function describeError(error: unknown): string {
  const value = error as { code?: unknown; message?: unknown } | null;
  const message = error instanceof Error ? error.message : typeof value?.message === 'string' ? value.message : String(error);
  return typeof value?.code === 'string' && value.code.length > 0 ? `${value.code}: ${message}` : message;
}
