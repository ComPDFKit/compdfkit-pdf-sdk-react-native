/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';
import type { CPDFReaderView } from '@compdfkit_pdf_sdk/react_native';

import { setDocumentPassword } from '../shared/securityActions';
import { SecurityExampleScaffold } from '../shared/SecurityExampleScaffold';
import { SetPasswordModal } from '../shared/SetPasswordModal';
import { AppToast } from '../../../widgets/common/ConfirmDialog';

export default function SetPasswordExampleScreen() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reader, setReader] = useState<CPDFReaderView | null>(null);
  const [userPassword, setUserPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const closeDialog = () => {
    if (saving) {
      return;
    }

    setDialogVisible(false);
    setReader(null);
    setUserPassword('');
  };

  const openDialog = (nextReader: CPDFReaderView) => {
    setReader(nextReader);
    setUserPassword('');
    setDialogVisible(true);
  };

  const handleConfirm = async () => {
    if (!userPassword) {
      setToastMessage('Please enter a password.');
      return;
    }

    if (!reader) {
      setToastMessage('Reader is not ready yet. Please try again.');
      return;
    }

    try {
      setSaving(true);
      const success = await setDocumentPassword(
        reader,
        userPassword,
        userPassword,
      );

      setToastMessage(success ? 'Password applied successfully.' : 'Failed to apply password.');

      if (success) {
        closeDialog();
      }
    } catch (error) {
      setToastMessage(
        error instanceof Error ? error.message : 'Failed to apply password.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SecurityExampleScaffold
        title="Set Password"
        subtitle="Apply user and owner passwords with AES256 encryption."
        actions={[
          {
            key: 'set-password',
            label: 'Set Password',
            onPress: openDialog,
          },
        ]}
      >
        <SetPasswordModal
          visible={dialogVisible}
          saving={saving}
          userPassword={userPassword}
          onChangeUserPassword={setUserPassword}
          onClose={closeDialog}
          onConfirm={() => {
            void handleConfirm();
          }}
        />
      </SecurityExampleScaffold>
      <AppToast
        visible={!!toastMessage}
        message={toastMessage}
        onHide={() => setToastMessage('')}
      />
    </>
  );
}
