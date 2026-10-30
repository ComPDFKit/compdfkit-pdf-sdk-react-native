/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type {
  CPDFSignatureAppearance,
  CPDFSignaturePermission,
  CPDFCertificateSubject,
} from "@compdfkit_pdf_sdk/react_native";
import type { CertificateSession } from "./CertificateSession";

/** Complete input collected before any document write begins. */
export type SignatureRequest = {
  certificate: CertificateSession;
  name: string;
  reason: string;
  location: string;
  permissions: CPDFSignaturePermission;
  appearance: CPDFSignatureAppearance;
  timestampServerUrl?: string;
};

/** New certificate input; output filenames are generated independently of the password. */
export type CertificateRequest = {
  subject: CPDFCertificateSubject;
  password: string;
};
