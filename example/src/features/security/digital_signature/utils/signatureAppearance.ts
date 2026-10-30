/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

/** Native signature date format used by the Flutter example. */
export function signatureContent(
  name: string,
  reason: string,
  location: string,
  subject?: string,
  now = new Date()
): string {
  const two = (value: number) => String(value).padStart(2, "0");
  const date = `${now.getFullYear()}.${two(now.getMonth() + 1)}.${two(
    now.getDate()
  )} ${two(now.getHours())}:${two(now.getMinutes())}:${two(now.getSeconds())}`;
  return [
    `Name: ${name.trim()}`,
    `Date: ${date}`,
    `Reason: ${reason.trim()}`,
    `Location: ${location.trim()}`,
    ...(subject ? [`DN: ${subject}`] : []),
  ].join("\n");
}

/** Distinguishes absence of validation data from a negative result. */
export function booleanLabel(value?: boolean): string {
  return value === undefined ? "Unavailable" : value ? "Yes" : "No";
}
export function timestampLabel(source?: number): string {
  return source === undefined
    ? "Unavailable"
    : [
        "None",
        "Signer device clock",
        "Embedded RFC 3161 timestamp",
        "Document timestamp",
      ][source] ?? "Unknown";
}
