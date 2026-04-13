/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';

import {
  exportWidgets,
  importWidgetsFromPickedFile,
} from '../shared/formExampleActions';
import { FormExampleScaffold } from '../shared/FormExampleScaffold';

export default function FormDataImportExportExampleScreen() {
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
          onPress: exportWidgets,
        },
      ]}
    />
  );
}