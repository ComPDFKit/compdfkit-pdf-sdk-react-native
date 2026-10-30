/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

/** Passwords belong to this in-memory session only, never to navigation params. */
export type CertificateSession = {
  path: string;
  name: string;
  password: string;
  generated: boolean;
};

export type CertificateStackParams = {
  CertificateHome: undefined;
  GenerateCertificate: undefined;
  LoadCertificate: undefined;
  CertificateDetails: undefined;
};
