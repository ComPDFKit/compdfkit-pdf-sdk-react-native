/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type {
  CPDFReaderView,
  CPDFSignatureLtvResult,
} from "@compdfkit_pdf_sdk/react_native";
import { SignatureFileService } from "./SignatureFileService";

/** Collects evidence into distinct saved copies; network failures are returned to the dialog. */
export class SignatureLtvService {
  constructor(private readonly files: SignatureFileService) {}
  async add(
    reader: CPDFReaderView,
    root: string,
    append: boolean
  ): Promise<CPDFSignatureLtvResult> {
    const modified = await reader._pdfDocument.hasChange();
    if (modified && !(await reader.save()))
      throw new Error(
        "The current PDF could not be saved before adding LTV material."
      );
    const result = await reader._pdfDocument.addSignatureLtv(
      await this.files.outputPath("ltv_document"),
      {
        trustedCertificatePath: root,
        appendDocumentTimestamp: append,
        timestampServerUrl: append
          ? "http://timestamp.digicert.com"
          : undefined,
        timestampOutputPath: append
          ? await this.files.outputPath("lta_document")
          : undefined,
      }
    );
    if (!result.success)
      throw new Error(
        result.errors
          .map((issue) => `${issue.code}: ${issue.message}`)
          .join("\n") || "The LTV material could not be added."
      );
    await this.files.requireOutput(result.success, result.finalPath);
    return result;
  }
}
