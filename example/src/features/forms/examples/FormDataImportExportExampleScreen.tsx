/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';
import { Share } from 'react-native';

import {
  exportWidgets,
  importWidgetsFromPickedFile,
} from '../shared/formExampleActions';
import { FormExampleScaffold } from '../shared/FormExampleScaffold';
import { ConfirmDialog } from '../../../widgets/common/ConfirmDialog';

export default function FormDataImportExportExampleScreen() {
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [exportedFilePath, setExportedFilePath] = useState<string | null>(null);

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  const handleShareDialog = async () => {
    if (!exportedFilePath) {
      setDialogVisible(false);
      return;
    }

    const shareUrl = exportedFilePath.startsWith('file://')
      ? exportedFilePath
      : `file://${exportedFilePath}`;

    try {
      await Share.share({
        url: shareUrl,
        message: exportedFilePath,
      });
    } finally {
      setDialogVisible(false);
    }
  };

  return (
    <FormExampleScaffold
      title="Form Data Import/Export"
      subtitle="Import form field data from XFDF/XML or export the current widget data."
      actions={[
        {
          key: 'import-widgets',
          label: 'Import Widgets',
          onPress: importWidgetsFromPickedFile,
        },
        {
          key: 'export-widgets',
          label: 'Export Widgets',
          onPress: async reader => {
            const filePath = await exportWidgets(reader);
            setExportedFilePath(filePath ?? null);
            setDialogMessage(
              filePath
                ? `Widgets exported to:\n${filePath}`
                : 'Widget export failed or no output path was returned.',
            );
            setDialogVisible(true);
          },
        },
      ]}>
      {() => (
        <ConfirmDialog
          visible={dialogVisible}
          title="Export Widgets"
          message={dialogMessage}
          cancelLabel="Close"
          confirmLabel="Share"
          onCancel={handleCloseDialog}
          onConfirm={handleShareDialog}
        />
      )}
    </FormExampleScaffold>
  );
}