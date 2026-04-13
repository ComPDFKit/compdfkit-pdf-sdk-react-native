/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';

import { CPDFBotaScreen } from '../../bota/CPDFBotaScreen';
import {
  showThumbnailView,
  showBotaView,
  showAddWatermarkView,
  showSecurityView
} from '../shared/readerControllerActions';
import { ReaderControllerExampleScaffold } from '../shared/ReaderControllerExampleScaffold';

export default function ViewOperationsExampleScreen() {
  const [botaVisible, setBotaVisible] = useState(false);

  return (
    <ReaderControllerExampleScaffold
      title="View Operations"
      subtitle="Show thumbnails, open BOTA, and toggle the built-in search UI."
      actions={[
        {
          key: 'show-thumbnail-view',
          label: 'Thumbnails',
          onPress: showThumbnailView,
        },
        {
          key: 'open-bota',
          label: 'BOTA',
          onPress: showBotaView,
        },
        {
          key: 'show-add-watermark-view',
          label: 'Add Watermark',
          onPress: showAddWatermarkView,
        },
        {
          key: 'show-security-view',
          label: 'Security',
          onPress: showSecurityView,
        },
        {
          key: 'show-custom-bota',
          label: 'Custom BOTA View',
          onPress: () => setBotaVisible(true),
        },
      ]}>
      <CPDFBotaScreen visible={botaVisible} onClose={() => setBotaVisible(false)} />
    </ReaderControllerExampleScaffold>
  );
}