/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

/** Native source of the signing time; embedded and document timestamps are different evidence. */
export const CPDFSignatureTimestampSource = {
  NONE: 0,
  LOCAL_CLOCK: 1,
  EMBEDDED: 2,
  DOCUMENT: 3,
} as const;

/** Accepts only an absolute HTTP(S) TSA URL with a nonempty host. */
export function isTimestampServerUrl(value: string): boolean {
  // RN 0.76's global URL has throwing protocol/hostname getters. Validate
  // the authority without that polyfill; native parsers validate the request too.
  if (
    /\s|\\/.test(value) ||
    Array.from(value).some(
      (character) =>
        character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127
    )
  )
    return false;
  const match = /^https?:\/\/([^/?#]+)(?:[/?#].*)?$/i.exec(value);
  if (!match) return false;
  const authority = match[1]!.split("@").pop()!;
  const host = /^(\[[a-f\d:.]+\]|[^:[\]@%]+)(?::(\d+))?$/i.exec(authority);
  if (!host) return false;
  return host[2] === undefined || Number(host[2]) <= 65535;
}
