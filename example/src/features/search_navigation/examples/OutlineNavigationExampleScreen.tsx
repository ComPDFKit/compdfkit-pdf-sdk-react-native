/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';

import { CPDFBotaScreen } from '../../viewer/bota/CPDFBotaScreen';
import { SearchNavigationExampleScaffold } from '../shared/SearchNavigationExampleScaffold';

export default function OutlineNavigationExampleScreen() {
  const [visible, setVisible] = useState(false);

  return (
    <SearchNavigationExampleScaffold
      title="Outline Navigation"
      subtitle="Open the outline panel and jump through the document structure."
      actions={[
        {
          key: 'open-outline-panel',
          label: 'Open Outline',
          onPress: async () => {
            setVisible(true);
          },
        },
      ]}>
      <CPDFBotaScreen
        visible={visible}
        initialTab="outline"
        onClose={() => setVisible(false)}
      />
    </SearchNavigationExampleScaffold>
  );
}