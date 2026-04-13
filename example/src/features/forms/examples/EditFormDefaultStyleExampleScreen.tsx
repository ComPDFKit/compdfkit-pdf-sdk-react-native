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
  applySampleDefaultWidgetStyles,
  logDefaultWidgetStyles,
} from '../shared/formExampleActions';
import { FormExampleScaffold } from '../shared/FormExampleScaffold';

export default function EditFormDefaultStyleExampleScreen() {
  return (
    <FormExampleScaffold
      title="Edit Form Default Style"
      subtitle="Inspect and update the default styles used for new form fields."
      actions={[
        {
          key: 'get-default-widget-styles',
          label: 'Get Styles',
          onPress: logDefaultWidgetStyles,
        },
        {
          key: 'apply-default-widget-styles',
          label: 'Apply Sample Styles',
          onPress: applySampleDefaultWidgetStyles,
        },
      ]}
    />
  );
}