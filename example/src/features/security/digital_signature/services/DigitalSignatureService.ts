/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type {
  CPDFDocument,
  CPDFSignatureWidget,
} from "@compdfkit_pdf_sdk/react_native";
import type { SignatureRequest } from "../models/SignatureRequest";
import type { SignatureDetails } from "../models/SignatureDetails";
import { findSignature } from "../utils/signatureMatching";
import { SignatureFileService } from "./SignatureFileService";

/** The reusable document calls for signing and inspecting one selected field. */
export class DigitalSignatureService {
  constructor(private readonly files: SignatureFileService) {}

  /** Preserve the source PDF and accept success only after the output file exists. */
  async sign(
    document: CPDFDocument,
    widget: CPDFSignatureWidget,
    request: SignatureRequest
  ): Promise<string> {
    if (widget.isSigned !== false)
      throw new Error(
        "The field is signed or its signed state is unavailable."
      );
    const path = await this.files.outputPath("signed_document");
    const success = await document.writeSignature(
      widget.page,
      widget.uuid,
      path,
      {
        certificatePath: request.certificate.path,
        password: request.certificate.password,
        name: request.name,
        reason: request.reason,
        location: request.location,
        permissions: request.permissions,
        appearance: request.appearance,
        timestampServerUrl: request.timestampServerUrl,
      }
    );
    return this.files.requireOutput(success, path);
  }

  async inspect(
    document: CPDFDocument,
    widget: CPDFSignatureWidget
  ): Promise<SignatureDetails> {
    const signature = findSignature(
      widget,
      await document.getDigitalSignatures()
    );
    if (!signature) throw new Error("Signed field metadata is unavailable.");
    const details: SignatureDetails = { signature };
    try {
      details.verification = await document.verifyDigitalSignature(
        signature.signatureIndex
      );
      details.signature =
        findSignature(widget, await document.getDigitalSignatures()) ??
        signature;
    } catch {
      details.verificationError = "Signature verification is unavailable.";
    }
    try {
      details.readiness = await document.getLtvReadiness();
    } catch {
      details.readinessError = "LTV inspection is unavailable.";
    }
    return details;
  }
}
