/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';

import { moveSecondPageToFirst } from '../shared/pageExampleActions';
import { PageExampleScaffold } from '../shared/PageExampleScaffold';

export default function MovePageExampleScreen() {
  return (
    <PageExampleScaffold
      title="Move Page"
      subtitle="Move the second page to the first position."
      actions={[
        {
          key: 'move-page',
          label: 'Move Page 2 to 1',
          onPress: moveSecondPageToFirst,
        },
      ]}
    />
  );
}