/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */


export function safeParseEnumValue<T extends string>(
    value: string | undefined,
    values: readonly T[],
    fallback: T
  ): T {
    return value && values.includes(value as T) ? (value as T) : fallback;
  }

export function normalizeColorToARGB(color: string): string {
  if (!color.startsWith('#')) {
    throw new Error('Color must start with #');
  }

  let hex = color.slice(1);

  // expand short format (#RGB -> #RRGGBB, #RGBA -> #RRGGBBAA)
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('') + 'FF'; // default alpha = FF
  } else if (hex.length === 4) {
    hex = hex.split('').map(c => c + c).join(''); // RGBA -> RRGGBBAA
  } else if (hex.length === 6) {
    hex = hex + 'FF'; // default alpha = FF
  } else if (hex.length !== 8) {
    throw new Error('Invalid color format');
  }

  // extract RRGGBBAA
  const rr = hex.slice(0, 2);
  const gg = hex.slice(2, 4);
  const bb = hex.slice(4, 6);
  const aa = hex.slice(6, 8);

  // return  ARGB format
  return `#${aa}${rr}${gg}${bb}`;
}