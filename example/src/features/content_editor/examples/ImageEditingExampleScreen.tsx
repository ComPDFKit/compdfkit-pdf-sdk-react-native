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
  disableEditMode,
  enableImageEditMode,
  insertPickedImage,
} from '../shared/contentEditorActions';
import { ContentEditorExampleScaffold } from '../shared/ContentEditorExampleScaffold';

export default function ImageEditingExampleScreen() {
  return (
    <ContentEditorExampleScaffold
      title="Image Editing"
      subtitle="Switch to image edit mode and insert a picked image."
      actions={[
        {
          key: 'enable-image-edit',
          label: 'Enable Image Edit',
          onPress: enableImageEditMode,
        },
        {
          key: 'disable-edit-mode',
          label: 'Disable Edit Mode',
          onPress: disableEditMode,
        },
        {
          key: 'insert-picked-image',
          label: 'Insert Image',
          onPress: insertPickedImage,
        },
      ]}
    />
  );
}