/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import {
  CPDFDocumentEncryptAlgo,
  CPDFDocumentPermissionInfo,
  CPDFDocumentPermissions,
  CPDFReaderView,
} from '@compdfkit_pdf_sdk/react_native';
import { Logger } from '../../../util/logger';

export type DocumentPermissionsSnapshot = {
  fileName: string;
  documentPath: string;
  pageCount: number;
  isEncrypted: boolean;
  isImageDoc: boolean;
  permissions: CPDFDocumentPermissions;
  encryptAlgo: CPDFDocumentEncryptAlgo;
  ownerUnlocked: boolean;
  permissionsInfo: CPDFDocumentPermissionInfo;
};

/**
 * Collects a comprehensive snapshot of the document's security and permission state.
 *
 * Queries multiple `CPDFDocument` APIs in parallel:
 * - `getFileName()` / `getDocumentPath()` — file identity
 * - `isEncrypted()` / `getEncryptAlgo()` — encryption status and algorithm
 * - `getPermissions()` / `getPermissionsInfo()` — access control detail
 * - `checkOwnerUnlocked()` — whether the owner password has been verified
 */
export async function getDocumentPermissionsSnapshot(
  reader: CPDFReaderView,
): Promise<DocumentPermissionsSnapshot> {
  const document = reader._pdfDocument;

  const [
    fileName,
    documentPath,
    pageCount,
    isEncrypted,
    isImageDoc,
    permissions,
    encryptAlgo,
    ownerUnlocked,
    permissionsInfo,
  ] = await Promise.all([
    document.getFileName(),
    document.getDocumentPath(),
    document.getPageCount(),
    document.isEncrypted(),
    document.isImageDoc(),
    document.getPermissions(),
    document.getEncryptAlgo(),
    document.checkOwnerUnlocked(),
    document.getPermissionsInfo(),
  ]);

  return {
    fileName,
    documentPath,
    pageCount,
    isEncrypted,
    isImageDoc,
    permissions,
    encryptAlgo,
    ownerUnlocked,
    permissionsInfo,
  };
}

/**
 * Encrypts the document with user and owner passwords using AES-128.
 *
 * `CPDFDocument.setPassword(userPassword, ownerPassword, allowPrinting,
 * allowCopying, algorithm)` applies PDF encryption. The `userPassword` is
 * required to open the document; the `ownerPassword` controls editing rights.
 */
export async function setDocumentPassword(reader: CPDFReaderView) {
  const result = await reader._pdfDocument.setPassword(
    '1234',
    '4321',
    false,
    false,
    CPDFDocumentEncryptAlgo.AES128,
  );
  Logger.log('setPassword:', result);
  return result;
}

/**
 * Removes all password protection from the document.
 *
 * `CPDFDocument.removePassword()` strips both user and owner passwords.
 * The document must already be unlocked (owner password verified) for this to succeed.
 */
export async function removeDocumentPassword(reader: CPDFReaderView) {
  const result = await reader._pdfDocument.removePassword();
  Logger.log('removePassword:', result);
  return result;
}

/**
 * Presents the built-in watermark dialog.
 *
 * `CPDFReaderView.showAddWatermarkView(options)` opens a native UI for adding
 * text or image watermarks. Key options include `types` (text/image), `text`,
 * `rotation`, `image` (asset name), and `opacity` (0–255).
 */
export async function showAddWatermarkView(reader: CPDFReaderView) {
  await reader.showAddWatermarkView({
    saveAsNewFile: false,
    types: ['text', 'image'],
    text: 'ComPDFKit RN',
    rotation: -45,
    image: 'tools_logo',
    opacity: 255,
  });
}

export async function logDocumentPermissions(reader: CPDFReaderView) {
  const snapshot = await getDocumentPermissionsSnapshot(reader);

  Logger.log('fileName:', snapshot.fileName);
  Logger.log('documentPath:', snapshot.documentPath);
  Logger.log('pageCount:', snapshot.pageCount);
  Logger.log('isEncrypted:', snapshot.isEncrypted);
  Logger.log('isImageDoc:', snapshot.isImageDoc);
  Logger.log('permissions:', snapshot.permissions);
  Logger.log('ownerUnlocked:', snapshot.ownerUnlocked);
  Logger.log('getEncryptAlgo:', snapshot.encryptAlgo);
  Logger.log('getPermissionsInfo:', snapshot.permissionsInfo);

  return snapshot;
}

/**
 * Triggers verification of all digital signatures embedded in the document.
 *
 * `CPDFReaderView.verifyDigitalSignatureStatus()` checks each signature field
 * and displays the verification result overlay in the reader.
 */
export async function verifyDigitalSignature(reader: CPDFReaderView) {
  await reader.verifyDigitalSignatureStatus();
}

export async function hideDigitalSignatureStatus(reader: CPDFReaderView) {
  await reader.hideDigitalSignStatusView();
}