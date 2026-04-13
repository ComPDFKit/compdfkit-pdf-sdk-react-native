/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';

import { setReaderScale } from '../shared/readerControllerActions';
import { ReaderControllerExampleScaffold } from '../shared/ReaderControllerExampleScaffold';

export default function ZoomScaleExampleScreen() {
  return (
    <ReaderControllerExampleScaffold
      title="Zoom Scale"
      subtitle="Set a fixed scale and inspect the effective zoom value."
      actions={[
        {
          key: 'set-reader-scale',
          label: 'Set Scale 2.3x',
          onPress: setReaderScale,
        },
      ]}
    />
  );
}