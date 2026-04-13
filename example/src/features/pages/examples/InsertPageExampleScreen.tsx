/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';

import { insertBlankPage, insertImagePage } from '../shared/pageExampleActions';
import { PageExampleScaffold } from '../shared/PageExampleScaffold';

export default function InsertPageExampleScreen() {
  return (
    <PageExampleScaffold
      title="Insert Page"
      subtitle="Insert a blank page or an image page into the current document."
      actions={[
        {
          key: 'insert-blank-page',
          label: 'Insert Blank Page',
          onPress: insertBlankPage,
        },
        {
          key: 'insert-image-page',
          label: 'Insert Image Page',
          onPress: insertImagePage,
        },
      ]}
    />
  );
}