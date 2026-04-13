/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';

import { CPDFPreviewModeListScreen } from '../../shared/modal/CPDFPreviewModeListScreen';
import { ReaderControllerExampleScaffold } from '../shared/ReaderControllerExampleScaffold';

export default function PreviewModeExampleScreen() {
  const [visible, setVisible] = useState(false);

  return (
    <ReaderControllerExampleScaffold
      title="Preview Mode"
      subtitle="Open the preview mode picker and switch the active reader mode."
      actions={[
        {
          key: 'open-preview-mode-picker',
          label: 'Open Preview Modes',
          onPress: async () => {
            setVisible(true);
          },
        },
      ]}>
      <CPDFPreviewModeListScreen
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </ReaderControllerExampleScaffold>
  );
}