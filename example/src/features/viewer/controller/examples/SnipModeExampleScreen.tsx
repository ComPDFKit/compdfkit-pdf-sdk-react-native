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
  enterSnipMode,
  exitSnipMode,
} from '../shared/readerControllerActions';
import { ReaderControllerExampleScaffold } from '../shared/ReaderControllerExampleScaffold';

export default function SnipModeExampleScreen() {
  return (
    <ReaderControllerExampleScaffold
      title="Snip Mode"
      subtitle="Enter or exit snip mode directly from the embedded reader."
      actions={[
        {
          key: 'enter-snip-mode',
          label: 'Enter Snip Mode',
          onPress: enterSnipMode,
        },
        {
          key: 'exit-snip-mode',
          label: 'Exit Snip Mode',
          onPress: exitSnipMode,
        },
      ]}
    />
  );
}