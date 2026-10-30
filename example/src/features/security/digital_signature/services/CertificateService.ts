/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { ComPDFKit } from "@compdfkit_pdf_sdk/react_native";
import type { CertificateSession } from "../models/CertificateSession";
import type { CertificateRequest } from "../models/SignatureRequest";
import { SignatureFileService } from "./SignatureFileService";

/** Certificate SDK calls with in-memory credentials and explicit password validation. */
export class CertificateService {
  constructor(private readonly files: SignatureFileService) {}
  async load(path: string, password: string): Promise<CertificateSession> {
    if (!password) throw new Error("Enter the certificate password.");
    if (!(await ComPDFKit.checkPkcs12CertificatePassword(path, password)))
      throw new Error("Incorrect certificate password.");
    const info = await ComPDFKit.loadPkcs12Certificate(path, password);
    if (!info) throw new Error("The certificate metadata could not be loaded.");
    return { path, password, info };
  }
  async create(request: CertificateRequest): Promise<CertificateSession> {
    const path = await this.files.outputPath("certificate", "p12");
    if (
      !(await ComPDFKit.generatePkcs12Certificate({
        ...request,
        outputPath: path,
      }))
    )
      throw new Error("The certificate could not be created.");
    return this.load(path, request.password);
  }
  async trust(session: CertificateSession): Promise<void> {
    if (
      !(await ComPDFKit.addTrustedCertificate(session.path, session.password))
    )
      throw new Error("The certificate could not be trusted.");
  }
}
