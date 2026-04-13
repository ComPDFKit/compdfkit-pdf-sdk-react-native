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

import { DocumentInfoModal } from '../shared/DocumentInfoModal';
import { SecurityExampleScaffold } from '../shared/SecurityExampleScaffold';
import {
  DocumentPermissionsSnapshot,
  logDocumentPermissions,
} from '../shared/securityActions';

export default function DocumentPermissionsExampleScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snapshot, setSnapshot] = useState<DocumentPermissionsSnapshot | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleShowDocumentInfo = async (reader: CPDFReaderView) => {
    setModalVisible(true);
    setLoading(true);
    setErrorMessage(null);

    try {
      const nextSnapshot = await logDocumentPermissions(reader);
      setSnapshot(nextSnapshot);
    } catch (error) {
      setSnapshot(null);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SecurityExampleScaffold
      title="Document Permissions"
      subtitle="Inspect file metadata, encryption state, permissions, and owner unlock state."
      actions={[
        {
          key: 'show-document-permissions',
          label: 'Show Document Info',
          onPress: handleShowDocumentInfo,
        },
      ]}
    >
      <DocumentInfoModal
        visible={modalVisible}
        loading={loading}
        snapshot={snapshot}
        errorMessage={errorMessage}
        onClose={() => setModalVisible(false)}
      />
    </SecurityExampleScaffold>
  );
}