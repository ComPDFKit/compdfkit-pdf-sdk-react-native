/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';

import { CPDFDisplaySettingsScreen } from '../../shared/modal/CPDFDisplaySettingsScreen';
import { openNativeDisplaySettingView } from '../shared/readerControllerActions';
import { ReaderControllerExampleScaffold } from '../shared/ReaderControllerExampleScaffold';

export default function DisplaySettingsExampleScreen() {
  const [visible, setVisible] = useState(false);

  return (
    <ReaderControllerExampleScaffold
      title="Display Settings"
      subtitle="Open the custom settings sheet or the native display settings UI."
      actions={[
        {
          key: 'open-custom-display-settings',
          label: 'Custom Settings',
          onPress: async () => {
            setVisible(true);
          },
        },
        {
          key: 'open-native-display-settings',
          label: 'Native Settings',
          onPress: openNativeDisplaySettingView,
        },
      ]}>
      <CPDFDisplaySettingsScreen
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </ReaderControllerExampleScaffold>
  );
}