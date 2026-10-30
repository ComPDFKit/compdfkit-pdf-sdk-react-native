/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFAlignment, CPDFAnnotationType, HexColor } from '../configuration/CPDFOptions';
import { CPDFAnnotation } from './CPDFAnnotation';
import type { CPDFTextAttribute } from './CPDFTextAttribute';
import { safeParseEnumValue } from '../util/CPDFEnumUtils';

/**
 * A redaction (redact) annotation marks an area whose content is removed when the redaction is
 * applied with `CPDFDocument.applyRedaction()` or `applyRedactions()`.
 *
 * Until it is applied it behaves like any other annotation: it can be added, read, updated, and
 * deleted. Applying it is permanent: the covered text and images are removed from the document
 * and the area is filled with `fillColor` and `overlayText`.
 *
 * Colors use `#RRGGBB`.
 *
 * @example
 * await pdfReaderRef.current?._pdfDocument.addAnnotations([
 *   new CPDFRedactAnnotation({
 *     page: 0,
 *     rect: { left: 60, top: 520, right: 320, bottom: 470 },
 *     overlayText: 'REDACTED',
 *     fillColor: '#000000',
 *     textAttribute: { color: '#FFFFFF', familyName: 'Helvetica', styleName: '', fontSize: 14 },
 *   }),
 * ]);
 *
 * @group Annotations
 */
export class CPDFRedactAnnotation extends CPDFAnnotation {
  /** Text drawn over the redacted area once applied. */
  overlayText: string;

  /** Fill color of the redacted area once applied. Default `#000000`. */
  fillColor: HexColor;

  /** Border color shown while the redaction is pending; `undefined` for no border. */
  outlineColor?: HexColor;

  /** Font, size, and color of `overlayText`. */
  textAttribute?: CPDFTextAttribute;

  /** Alignment of `overlayText`. Default `center`. */
  alignment: CPDFAlignment;

  constructor(params: Partial<CPDFRedactAnnotation>) {
    super(params);
    this.type = CPDFAnnotationType.REDACT;
    this.overlayText = params.overlayText ?? '';
    this.fillColor = params.fillColor ?? '#000000';
    this.outlineColor = params.outlineColor ?? undefined;
    this.textAttribute = params.textAttribute;
    this.alignment = safeParseEnumValue(params.alignment, Object.values(CPDFAlignment), CPDFAlignment.CENTER);
  }

  override toJSON() {
    const json = super.toJSON() as any;
    // Mark and review states are not part of the redaction model.
    delete json.markState;
    delete json.reviewState;
    delete json.outlineColor;
    delete json.textAttribute;
    return {
      ...json,
      overlayText: this.overlayText,
      fillColor: this.fillColor,
      ...(this.outlineColor !== undefined ? { outlineColor: this.outlineColor } : {}),
      ...(this.textAttribute !== undefined ? { textAttribute: this.textAttribute } : {}),
      alignment: this.alignment,
    };
  }
}
