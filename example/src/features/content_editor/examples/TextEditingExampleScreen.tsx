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
  enableTextEditMode,
  insertSampleText,
  disableEditMode
} from '../shared/contentEditorActions';
import { ContentEditorExampleScaffold } from '../shared/ContentEditorExampleScaffold';

export default function TextEditingExampleScreen() {
  return (
    <ContentEditorExampleScaffold
      title="Text Editing"
      subtitle="Switch to text edit mode and insert sample text blocks."
      actions={[
        {
          key: 'enable-text-edit',
          label: 'Enable Text Edit',
          onPress: enableTextEditMode,
        },
        {
          key: 'disable-edit-mode',
          label: 'Disable Edit Mode',
          onPress: disableEditMode,
        },
        {
          key: 'insert-sample-text',
          label: 'Insert Text',
          onPress: insertSampleText,
        },
      ]}
    />
  );
}