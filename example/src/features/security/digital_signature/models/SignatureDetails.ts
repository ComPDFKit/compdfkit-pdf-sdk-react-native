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
  CPDFSignatureVerifyResult,
  CPDFLtvReadiness,
} from "@compdfkit_pdf_sdk/react_native";

/** Partial inspection results remain useful when verification or LTV inspection is unavailable. */
export type SignatureDetails = {
  signature: CPDFDigitalSignature;
  verification?: CPDFSignatureVerifyResult;
  readiness?: CPDFLtvReadiness;
  verificationError?: string;
  readinessError?: string;
};
