/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { Platform } from 'react-native';
import RNFS from 'react-native-fs';
import { errorCodes, isErrorWithCode, keepLocalCopy, pick } from '@react-native-documents/picker';

export const certificateOutputName = 'compdf-rn-development.p12';

/** A false SDK result cannot distinguish an invalid password from unsupported encryption. */
export const certificateOpenFailure =
  'Unable to open this PKCS#12 certificate. Check the password and file format; its encryption may not be supported by this SDK.';

/** Native certificate APIs require a filesystem path rather than a provider URI. */
export async function chooseCertificateFile(): Promise<{ path: string; name: string } | null> {
  try {
    const [file] = await pick({
      mode: 'import',
      allowMultiSelection: false,
      type:
        Platform.OS === 'ios'
          ? ['com.rsa.pkcs-12']
          : ['application/x-pkcs12', 'application/pkcs12'],
    });
    if (file.error) throw new Error('Unable to read the selected certificate file.');
    const name = file.name ?? '';
    if (!/\.(p12|pfx)$/i.test(name)) throw new Error('Choose a .p12 or .pfx certificate file.');
    const [copy] = await keepLocalCopy({
      files: [{ uri: file.uri, fileName: name }],
      destination: 'cachesDirectory',
    });
    if (copy.status !== 'success')
      throw new Error('Unable to copy the certificate into the application sandbox.');
    if (!copy.localUri.startsWith('file://'))
      throw new Error('The certificate has no readable local path.');
    return { path: decodeURIComponent(copy.localUri.slice('file://'.length)), name };
  } catch (error) {
    if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) return null;
    throw error;
  }
}

/** Generation writes only to the app's temporary directory, matching Flutter's export flow. */
export function certificateOutputPath(): string {
  return `${RNFS.TemporaryDirectoryPath}/${certificateOutputName}`;
}

/** Some native errors echo arguments; remove the runtime password before displaying them. */
export function certificateError(error: unknown, password = ''): string {
  const value = error as { message?: unknown; code?: unknown } | null;
  const message =
    typeof value?.message === 'string' ? value.message : 'Operation failed. Please try again.';
  const text = typeof value?.code === 'string' ? `${value.code}: ${message}` : message;
  return password ? text.split(password).join('[redacted]') : text;
}
