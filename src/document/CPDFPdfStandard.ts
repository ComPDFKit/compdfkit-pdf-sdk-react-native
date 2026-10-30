/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

/**
 * PDF standard conformance level.
 *
 * Starting with 3.2.0 this covers PDF/A, PDF/X, PDF/E, PDF/UA and PDF/VT. The
 * values map one to one onto the Android `CPDFDocument.PDFDocumentType` enum.
 *
 * On iOS, `'pdf'` and `'pdf_e_2'` are not conversion targets:
 * `convertToPdfStandard` rejects them with `UNSUPPORTED_PDF_STANDARD`.
 */
export type CPDFPdfStandardType =
  | 'pdf'
  | 'pdf_a_1a'
  | 'pdf_a_1b'
  | 'pdf_a_2a'
  | 'pdf_a_2u'
  | 'pdf_a_2b'
  | 'pdf_a_3a'
  | 'pdf_a_3u'
  | 'pdf_a_3b'
  | 'pdf_x_1a'
  | 'pdf_x_3'
  | 'pdf_x_4'
  | 'pdf_e_1'
  | 'pdf_e_2'
  | 'pdf_ua_1'
  | 'pdf_vt_1'
  | 'pdf_vt_2';

/**
 * The 17 standard types in a stable order, for example pickers and tests to
 * reuse.
 */
export const PDF_STANDARD_TYPES: readonly CPDFPdfStandardType[] = [
  'pdf',
  'pdf_a_1a',
  'pdf_a_1b',
  'pdf_a_2a',
  'pdf_a_2u',
  'pdf_a_2b',
  'pdf_a_3a',
  'pdf_a_3u',
  'pdf_a_3b',
  'pdf_x_1a',
  'pdf_x_3',
  'pdf_x_4',
  'pdf_e_1',
  'pdf_e_2',
  'pdf_ua_1',
  'pdf_vt_1',
  'pdf_vt_2',
];

/**
 * Maps an unknown native value onto a `CPDFPdfStandardType`, falling back to
 * `'pdf'` so a newer native SDK cannot break the TypeScript contract.
 *
 * @internal
 */
export function fromNativePdfStandardType(value: unknown): CPDFPdfStandardType {
  return PDF_STANDARD_TYPES.includes(value as CPDFPdfStandardType)
    ? (value as CPDFPdfStandardType)
    : 'pdf';
}
