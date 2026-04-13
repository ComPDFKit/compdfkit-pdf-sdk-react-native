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
  enableImageEditMode,
  enableNoEditMode,
  enablePathEditMode,
  enableTextEditMode,
} from '../shared/contentEditorActions';
import { ContentEditorExampleScaffold } from '../shared/ContentEditorExampleScaffold';

export default function ContentEditingModeExampleScreen() {
  return (
    <ContentEditorExampleScaffold
      title="Content Editing Mode"
      subtitle="Switch between none, text, image, and path editing modes."
      actions={[
        {
          key: 'mode-none',
          label: 'None',
          onPress: enableNoEditMode,
        },
        {
          key: 'mode-text',
          label: 'Text',
          onPress: enableTextEditMode,
        },
        {
          key: 'mode-image',
          label: 'Image',
          onPress: enableImageEditMode,
        },
        {
          key: 'mode-path',
          label: 'Path',
          onPress: enablePathEditMode,
        },
      ]}
    />
  );
}