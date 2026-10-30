/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type { CPDFCertificateInfo } from "@compdfkit_pdf_sdk/react_native";

/** Compare native certificate fingerprints, never display names or chain roots. */
export function sameCertificate(
  selected: CPDFCertificateInfo,
  signer?: CPDFCertificateInfo
): boolean {
  const digest = (value?: string) => value?.replace(/[:\s]/g, "").toLowerCase();
  const selectedDigest = digest(selected.sha1Digest);
  return (
    !!selectedDigest &&
    /^[a-f0-9]{40}$/.test(selectedDigest) &&
    selectedDigest === digest(signer?.sha1Digest)
  );
}
