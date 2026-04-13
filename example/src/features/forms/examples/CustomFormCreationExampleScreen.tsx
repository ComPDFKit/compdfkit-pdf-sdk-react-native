/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import { CPDFWidgetType } from '@compdfkit_pdf_sdk/react_native';

import { FormCreationManagedScreen } from '../shared/FormCreationManagedScreen';

export default function CustomFormCreationExampleScreen() {
  return (
    <FormCreationManagedScreen
      title="Custom Form Creation"
      subtitle="Create ListBox, ComboBox, and PushButton fields with custom option dialogs."
      availableTypes={[
        CPDFWidgetType.LISTBOX,
        CPDFWidgetType.COMBOBOX,
        CPDFWidgetType.PUSH_BUTTON,
      ]}
      enableCustomCreationDialogs={true}
      showCreationToolbar={false}
    />
  );
}