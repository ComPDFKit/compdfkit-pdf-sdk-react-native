/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';

import { insertSampleText } from '../shared/contentEditorActions';
import { EditorHistoryBottomToolbar } from '../components/EditorHistoryBottomToolbar';
import { ContentEditorExampleScaffold } from '../shared/ContentEditorExampleScaffold';

export default function EditorHistoryExampleScreen() {
  return (
    <ContentEditorExampleScaffold
      title="Editor History"
      subtitle="Observe history callbacks and trigger undo or redo on content edits."
      bottomAccessory={reader => <EditorHistoryBottomToolbar reader={reader} />}
      actions={[
        {
          key: 'history-insert-text',
          label: 'Insert Text',
          onPress: insertSampleText,
        },
      ]}
    />
  );
}