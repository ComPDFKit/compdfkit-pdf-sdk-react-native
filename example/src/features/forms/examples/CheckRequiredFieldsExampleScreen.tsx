/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import { Alert } from 'react-native';
import type { CPDFReaderView } from '@compdfkit_pdf_sdk/react_native';

import { getRequiredFieldsTestDocument } from '../shared/defaultDocument';
import { checkRequiredFields } from '../shared/formExampleActions';
import { FormExampleScaffold } from '../shared/FormExampleScaffold';

export default function CheckRequiredFieldsExampleScreen() {
  const onCheck = async (reader: CPDFReaderView) => {
    const { requiredCount, emptyFields } = await checkRequiredFields(reader);
    if (requiredCount === 0) {
      Alert.alert('Required Field Check', 'This document has no required fields.');
      return;
    }
    if (emptyFields.length === 0) {
      Alert.alert(
        'Required Field Check',
        `All ${requiredCount} required fields are filled.`,
      );
      return;
    }
    Alert.alert(
      'Required Field Check',
      `${emptyFields.length} of ${requiredCount} required fields are still empty:\n\n` +
        emptyFields.join('\n'),
    );
  };

  return (
    <FormExampleScaffold
      title="Check Required Fields"
      subtitle="Read the isRequired flag and validate required fields before submitting."
      document={getRequiredFieldsTestDocument()}
      actions={[
        {
          key: 'check-required-fields',
          label: 'Check Required Fields',
          onPress: onCheck,
        },
      ]}
    />
  );
}
