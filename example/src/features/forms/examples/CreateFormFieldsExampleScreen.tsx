/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';

import { addCommonFormFields } from '../shared/formExampleActions';
import { FormExampleScaffold } from '../shared/FormExampleScaffold';
import { ComPDFKit } from '@compdfkit_pdf_sdk/react_native';

export default function CreateFormFieldsExampleScreen() {
  return (
    <FormExampleScaffold
      title="Create Form Fields"
      subtitle="Add a prepared set of common form fields to the current document."
      actions={[
        {
          key: 'add-common-form-fields',
          label: 'Add Common Fields',
          onPress: addCommonFormFields,
        },
      ]}
      configuration={ComPDFKit.getDefaultConfig({
        formsConfig: {
          showCreateComboBoxOptionsDialog: false,
          showCreateListBoxOptionsDialog: false,
          showCreatePushButtonOptionsDialog: false,
        }
      })}
    />
  );
}