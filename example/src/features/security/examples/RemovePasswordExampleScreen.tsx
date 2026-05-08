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

import { removeDocumentPassword } from '../shared/securityActions';
import { SecurityExampleScaffold } from '../shared/SecurityExampleScaffold';
import { AppToast } from '../../../widgets/common/ConfirmDialog';

export default function RemovePasswordExampleScreen() {
  const [toastMessage, setToastMessage] = useState('');

  const handleRemovePassword = async (reader: CPDFReaderView) => {
    try {
      const success = await removeDocumentPassword(reader);
      setToastMessage(success ? 'Password removed successfully.' : 'Failed to remove password.');
    } catch (error) {
      setToastMessage(
        error instanceof Error ? error.message : 'Failed to remove password.',
      );
    }
  };

  return (
    <>
      <SecurityExampleScaffold
        title="Remove Password"
        subtitle="Remove existing document password protection from the active file."
        actions={[
          {
            key: 'remove-password',
            label: 'Remove Password',
            onPress: handleRemovePassword,
          },
        ]}
      />
      <AppToast
        visible={!!toastMessage}
        message={toastMessage}
        onHide={() => setToastMessage('')}
      />
    </>
  );
}