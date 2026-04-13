/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';

import { CPDFFormWidgetListScreen } from '../modal/CPDFFormWidgetListScreen';
import { fetchAllWidgets } from '../shared/formExampleActions';
import { FormExampleScaffold } from '../shared/FormExampleScaffold';
import { CPDFWidget } from '@compdfkit_pdf_sdk/react_native';

export default function FormFieldOperationsExampleScreen() {
  const [widgets, setWidgets] = useState<CPDFWidget[]>([]);
  const [visible, setVisible] = useState(false);

  return (
    <FormExampleScaffold
      title="Form Field Operations"
      subtitle="Fetch the current form fields and inspect them in a dedicated list."
      actions={[
        {
          key: 'load-form-fields',
          label: 'Open Field List',
          onPress: async reader => {
            const allWidgets = await fetchAllWidgets(reader);
            setWidgets(allWidgets);
            setVisible(true);
          },
        },
      ]}>
      {() => (
        <CPDFFormWidgetListScreen
          visible={visible}
          widgets={widgets}
          onClose={() => setVisible(false)}
        />
      )}
    </FormExampleScaffold>
  );
}