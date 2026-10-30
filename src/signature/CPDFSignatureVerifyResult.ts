/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

/** Cryptographic verification plus optional native timestamp and document evidence state. */
export type CPDFSignatureVerifyResult = {
  signatureValid: boolean;
  documentUnmodified: boolean;
  certificateTrusted: boolean;
  certificateExpired: boolean;
  timestampTrusted: boolean;
  /** Native time source; absent on older bridges. */
  timestampSource?: number;
  /** Whether the embedded timestamp validated; undefined when unavailable. */
  embeddedTimestampValid?: boolean;
  /** Document-level LTV readiness, independent of signer trust. */
  ltvEnabled?: boolean;
};
/** Older bridges may omit evidence fields; absence is preserved as unavailable. */
export function fromNativeVerifyResult(value: any): CPDFSignatureVerifyResult {
  return {
    signatureValid: value?.signature_valid === true,
    documentUnmodified: value?.document_unmodified === true,
    certificateTrusted: value?.certificate_trusted === true,
    certificateExpired: value?.certificate_expired === true,
    timestampTrusted: value?.timestamp_trusted === true,
    timestampSource:
      typeof value?.timestamp_source === "number"
        ? value.timestamp_source
        : undefined,
    embeddedTimestampValid:
      typeof value?.embedded_timestamp_valid === "boolean"
        ? value.embedded_timestamp_valid
        : undefined,
    ltvEnabled:
      typeof value?.ltv_enabled === "boolean" ? value.ltv_enabled : undefined,
  };
}
