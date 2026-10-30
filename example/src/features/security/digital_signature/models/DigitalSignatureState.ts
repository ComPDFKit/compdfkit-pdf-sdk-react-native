/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type { CPDFSignatureWidget } from "@compdfkit_pdf_sdk/react_native";
import type { SignatureDetails } from "./SignatureDetails";

/** Only one business dialog is active for the current document generation. */
export type SignatureDialog =
  | { type: "none" }
  | { type: "sign"; widget: CPDFSignatureWidget }
  | { type: "info"; widget: CPDFSignatureWidget; details: SignatureDetails };
export type DigitalSignatureState = {
  document: string | null;
  generation: number;
  ready: boolean;
  dialog: SignatureDialog;
  busy: string | null;
  message: string | null;
  error: string | null;
};
