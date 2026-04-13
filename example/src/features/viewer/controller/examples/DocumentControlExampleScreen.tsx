/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';

import { CPDFReaderView } from '@compdfkit_pdf_sdk/react_native';

import {
  logDocumentChangeState,
  openDocument,
  saveDocument,
  saveDocumentAs,
} from '../shared/readerControllerActions';
import { ReaderControllerExampleScaffold } from '../shared/ReaderControllerExampleScaffold';
import { AppToast, ConfirmDialog } from '../../../../widgets/common/ConfirmDialog';

export default function DocumentControlExampleScreen() {
  const [reader, setReader] = useState<CPDFReaderView | null>(null);
  const [savedFilePath, setSavedFilePath] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const handleSaveDocumentAs = async (currentReader: CPDFReaderView) => {
    const result = await saveDocumentAs(currentReader);
    if (result.success && result.filePath) {
      setSavedFilePath(result.filePath);
      setDialogVisible(true);
    }
    return result;
  };

  const handleSaveDocument = async (currentReader: CPDFReaderView) => {
    const success = await saveDocument(currentReader);
    setToastMessage(success ? 'Document saved successfully' : 'Document save failed');
    setToastVisible(true);
    return success;
  };

  const handleCancelDialog = () => {
    setDialogVisible(false);
  };

  const handleConfirmDialog = async () => {
    if (reader && savedFilePath) {
      await reader._pdfDocument.open(savedFilePath, '', 0);
    }
    setDialogVisible(false);
  };

  const handleLogDocumentChangeState = async (currentReader: CPDFReaderView) => {
    const hasChange = await logDocumentChangeState(currentReader);
    setToastMessage(hasChange ? 'Document has unsaved changes' : 'Document has no changes');
    setToastVisible(true);
    return hasChange;
  };

  const handleHideToast = () => {
    setToastVisible(false);
  };

  return (
    <ReaderControllerExampleScaffold
      title="Document Control"
      subtitle="Open a document, save current changes, or create a Save As copy."
      onReaderReady={setReader}
      actions={[
        {
          key: 'open-document',
          label: 'Open Document',
          onPress: openDocument,
        },
        {
          key: 'save-document',
          label: 'Save',
          onPress: handleSaveDocument,
        },
        {
          key: 'save-document-as',
          label: 'Save As',
          onPress: handleSaveDocumentAs,
        },
        {
          key: 'log-has-change',
          label: 'Has Change',
          onPress: handleLogDocumentChangeState,
        },
      ]}
    >
      <AppToast
        visible={toastVisible}
        message={toastMessage}
        onHide={handleHideToast}
      />
      <ConfirmDialog
        visible={dialogVisible}
        title="Save As Completed"
        message={`The document was saved to:\n${savedFilePath}`}
        cancelLabel="Cancel"
        confirmLabel="Open Document"
        onCancel={handleCancelDialog}
        onConfirm={handleConfirmDialog}
      />
    </ReaderControllerExampleScaffold>
  );
}