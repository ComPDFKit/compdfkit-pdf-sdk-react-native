/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';

import { splitFirstPage } from '../shared/pageExampleActions';
import { PageExampleScaffold } from '../shared/PageExampleScaffold';

export default function SplitDocumentExampleScreen() {
  return (
    <PageExampleScaffold
      title="Split Document"
      subtitle="Split the first page into a new document and open the result."
      actions={[
        {
          key: 'split-first-page',
          label: 'Split First Page',
          onPress: splitFirstPage,
        },
      ]}
    />
  );
}