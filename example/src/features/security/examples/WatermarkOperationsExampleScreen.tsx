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
  getAllWatermarksExample,
  getFirstWatermarkExample,
  getWatermarkCountExample,
  removeAllWatermarksExample,
  removeFirstWatermarkExample,
  showAddWatermarkView,
  updateFirstWatermarkExample,
} from '../shared/securityActions';
import { SecurityExampleScaffold } from '../shared/SecurityExampleScaffold';

export default function WatermarkOperationsExampleScreen() {
  return (
    <SecurityExampleScaffold
      title="Watermark Operations"
      subtitle="Create, inspect, update, and remove document watermarks, or open the native watermark flow."
      actions={[
        {
          key: 'create-text-watermark',
          label: 'Add Text Watermark',
          onPress: createTextWatermarkExample,
        },
        {
          key: 'create-image-watermark',
          label: 'Add Image Watermark',
          onPress: createImageWatermarkExample,
        },
        {
          key: 'get-watermark-count',
          label: 'Get Watermark Count',
          onPress: getWatermarkCountExample,
        },
        {
          key: 'get-first-watermark',
          label: 'Get First Watermark',
          onPress: getFirstWatermarkExample,
        },
        {
          key: 'get-all-watermarks',
          label: 'Get All Watermarks',
          onPress: getAllWatermarksExample,
        },
        {
          key: 'update-first-watermark',
          label: 'Update First Watermark',
          onPress: updateFirstWatermarkExample,
        },
        {
          key: 'remove-first-watermark',
          label: 'Remove First Watermark',
          onPress: removeFirstWatermarkExample,
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
