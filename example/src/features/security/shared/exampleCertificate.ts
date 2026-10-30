/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import RNFS from 'react-native-fs';
import { ComPDFKit, CPDFCertificateInfo } from '@compdfkit_pdf_sdk/react_native';

/** Shared by the certificate and digital signature examples. Demo values only. */
export const EXAMPLE_CERTIFICATE_PATH = `${RNFS.DocumentDirectoryPath}/compdfkit-example.p12`;
export const EXAMPLE_CERTIFICATE_PASSWORD = 'compdfkit';
export const EXAMPLE_CERTIFICATE_COMMON_NAME = 'ComPDFKit RN Example';

/** Creates the PKCS#12 file when it does not exist yet. Returns `true` when it was generated. */
export async function ensureExampleCertificate(path: string, password: string): Promise<boolean> {
  if (await RNFS.exists(path)) {
    return false;
  }
  const created = await ComPDFKit.generatePkcs12Certificate({
    subject: { commonName: EXAMPLE_CERTIFICATE_COMMON_NAME, organization: 'ComPDFKit', country: 'CN' },
    password,
    outputPath: path,
  });
  if (!created || !(await RNFS.exists(path))) {
    throw new Error(`The certificate could not be generated at ${path}.`);
  }
  return true;
}

export function describeCertificate(info: CPDFCertificateInfo): string[] {
  return [
    `Subject: ${info.subject ?? '-'}`,
    `Issuer: ${info.issuer ?? '-'}`,
    `Serial: ${info.serialNumber ?? '-'}`,
    `Valid: ${info.validFrom ?? '-'} to ${info.validTo ?? '-'}`,
    `Algorithm: ${info.signatureAlgorithm ?? '-'}`,
    `Trusted: ${info.isTrusted ? 'yes' : 'no'}${info.isExpired == null ? '' : `, expired: ${info.isExpired ? 'yes' : 'no'}`}`,
  ];
}
