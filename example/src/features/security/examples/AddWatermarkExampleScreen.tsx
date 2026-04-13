/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';

import { showAddWatermarkView } from '../shared/securityActions';
import { SecurityExampleScaffold } from '../shared/SecurityExampleScaffold';

export default function AddWatermarkExampleScreen() {
  return (
    <SecurityExampleScaffold
      title="Add Watermark"
      subtitle="Open the SDK watermark flow with text and image watermark presets."
      actions={[
        {
          key: 'open-add-watermark',
          label: 'Add Watermark',
          onPress: showAddWatermarkView,
        },
      ]}
    />
  );
}