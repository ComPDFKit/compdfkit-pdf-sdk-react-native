/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type {
  CPDFDigitalSignature,
  CPDFSignatureWidget,
} from "@compdfkit_pdf_sdk/react_native";

/** Match the tapped field on its page. Native signatureIndex is not an array position. */
export function findSignature(
  widget: CPDFSignatureWidget,
  signatures: CPDFDigitalSignature[]
): CPDFDigitalSignature | undefined {
  const page = signatures.filter((item) => item.pageIndex === widget.page);
  const named = widget.title
    ? page.filter((item) => item.fieldName === widget.title)
    : [];
  if (named.length === 1) return named[0];
  const rect = widget.rect;
  if (!rect) return undefined;
  const bounded = page.filter(
    (item) =>
      item.bounds &&
      (["left", "top", "right", "bottom"] as const).every(
        (key) => Math.abs(item.bounds![key] - rect[key]) <= 1.5
      )
  );
  return bounded.length === 1 ? bounded[0] : undefined;
}
