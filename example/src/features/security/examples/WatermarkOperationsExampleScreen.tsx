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
  createImageWatermarkExample,
  createTextWatermarkExample,
  removeAllWatermarksExample,
  showAddWatermarkView,
} from '../shared/securityActions';
import { SecurityExampleScaffold } from '../shared/SecurityExampleScaffold';

export default function WatermarkOperationsExampleScreen() {
  return (
    <SecurityExampleScaffold
      title="Watermark Operations"
      subtitle="Create watermarks, remove all watermarks, and open the native watermark flow."
      actions={[
        {
          key: 'create-text-watermark',
          label: 'Create Text Watermark',
          onPress: createTextWatermarkExample,
        },
        {
          key: 'create-image-watermark',
          label: 'Create Image Watermark',
          onPress: createImageWatermarkExample,
        },
        {
          key: 'remove-all-watermarks',
          label: 'Remove All Watermarks',
          onPress: removeAllWatermarksExample,
        },
        {
          key: 'open-add-watermark',
          label: 'Open Native Watermark UI',
          onPress: showAddWatermarkView,
        },
      ]}
    />
  );
}
