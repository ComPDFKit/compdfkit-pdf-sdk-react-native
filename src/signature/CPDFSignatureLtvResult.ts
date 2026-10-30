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

/** Outputs and diagnostics from adding LTV evidence and, optionally, an LTA timestamp. */
export type CPDFSignatureLtvResult = {
  success: boolean;
  ltvPath: string;
  ltaPath: string;
  /** LTA path when available, otherwise LTV path. Empty on failure. */
  finalPath: string;
  errors: CPDFSignatureIssue[];
  warnings: CPDFSignatureIssue[];
};

/** Failed native runs may echo requested paths; never expose those as usable output. */
export function fromNativeSignatureLtvResult(
  value: any
): CPDFSignatureLtvResult {
  const success = value?.success === true;
  const ltvPath =
    success && typeof value?.ltv_path === "string" ? value.ltv_path : "";
  const ltaPath =
    success && typeof value?.lta_path === "string" ? value.lta_path : "";
  return {
    success,
    ltvPath,
    ltaPath,
    finalPath: ltaPath || ltvPath,
    errors: fromNativeSignatureIssues(value?.errors),
    warnings: fromNativeSignatureIssues(value?.warnings),
  };
}
