/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import {
  CPDFSignatureIssue,
  fromNativeSignatureIssues,
} from "./CPDFSignatureIssue";

/** Document-level evidence assessment. Readiness does not establish signer trust. */
export type CPDFLtvReadiness = {
  success: boolean;
  hasDss: boolean;
  hasVri: boolean;
  hasCertificates: boolean;
  hasRevocation: boolean;
  ltvReady: boolean;
  profileHint: string;
  missingMaterials: string[];
  certificatesCount: number;
  ocspResponsesCount: number;
  crlsCount: number;
  vriEntriesCount: number;
  errors: CPDFSignatureIssue[];
  warnings: CPDFSignatureIssue[];
};

/** Maps the common Android/iOS bridge response. Missing evidence stays false. */
export function fromNativeLtvReadiness(value: any): CPDFLtvReadiness {
  const count = (key: string): number =>
    typeof value?.dss?.[key] === "number" ? value.dss[key] : 0;
  return {
    success: value?.success === true,
    hasDss: value?.has_dss === true,
    hasVri: value?.has_vri === true,
    hasCertificates: value?.has_certificates === true,
    hasRevocation: value?.has_revocation === true,
    ltvReady: value?.ltv_ready === true,
    profileHint:
      typeof value?.profile_hint === "string" ? value.profile_hint : "",
    missingMaterials: Array.isArray(value?.missing_materials)
      ? value.missing_materials.filter(
          (item: unknown) => typeof item === "string"
        )
      : [],
    certificatesCount: count("certificates_count"),
    ocspResponsesCount: count("ocsp_responses_count"),
    crlsCount: count("crls_count"),
    vriEntriesCount: count("vri_entries_count"),
    errors: fromNativeSignatureIssues(value?.errors),
    warnings: fromNativeSignatureIssues(value?.warnings),
  };
}
