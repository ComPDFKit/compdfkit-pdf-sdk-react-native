/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { isTimestampServerUrl } from "./CPDFSignatureTimestamp";

/** Evidence sources for prolonging a saved signed PDF. Network access may be required. */
export type CPDFSignatureLtvOptions = {
  /** Local PEM root certificate for the signer chain. */
  trustedCertificatePath: string;
  ocspUrls?: string[];
  crlUrls?: string[];
  appendDocumentTimestamp?: boolean;
  /** Required when appendDocumentTimestamp is true. */
  timestampServerUrl?: string;
  /** Separate local output path for the LTA copy; must differ from the source and LTV copy. */
  timestampOutputPath?: string;
};

/** Validates LTA dependencies before dispatching the native operation. */
export function toNativeSignatureLtvOptions(
  options: CPDFSignatureLtvOptions
): Record<string, unknown> {
  if (!options.trustedCertificatePath)
    throw new Error("A trusted root certificate path is required.");
  if (
    options.appendDocumentTimestamp &&
    (!options.timestampOutputPath ||
      !isTimestampServerUrl(options.timestampServerUrl ?? ""))
  ) {
    throw new Error(
      "A document timestamp requires an http/https TSA URL and a separate output path."
    );
  }
  return {
    trusted_certificate_path: options.trustedCertificatePath,
    ocsp_urls: options.ocspUrls ?? [],
    crl_urls: options.crlUrls ?? [],
    append_document_timestamp: options.appendDocumentTimestamp ?? false,
    timestamp_server_url: options.timestampServerUrl,
    lta_output_path: options.timestampOutputPath,
  };
}
