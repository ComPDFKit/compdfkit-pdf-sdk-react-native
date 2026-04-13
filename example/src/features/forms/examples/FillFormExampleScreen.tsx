/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';

import { fillSampleWidgets } from '../shared/formExampleActions';
import { FormExampleScaffold } from '../shared/FormExampleScaffold';

export default function FillFormExampleScreen() {
  return (
    <FormExampleScaffold
      title="Fill Form"
      subtitle="Apply sample values to the existing form fields in the document."
      actions={[
        {
          key: 'fill-form-fields',
          label: 'Fill Form Fields',
          onPress: fillSampleWidgets,
        },
      ]}
    />
  );
}