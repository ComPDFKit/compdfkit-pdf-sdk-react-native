/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  CPDFEvent,
  CPDFReaderView,
  CPDFViewMode,
  CPDFWidgetType,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';

import { addInteractiveFormFields } from '../shared/formExampleActions';
import { FormExampleScaffold } from '../shared/FormExampleScaffold';

export default function FieldSelectionObservationExampleScreen() {
  const [message, setMessage] = useState(
    'Tap a ListBox or ComboBox field to observe selection events exposed by the RN bridge.'
  );

  const bindSelectionListener = (reader: CPDFReaderView) => {
    reader.addEventListener(CPDFEvent.FORM_FIELDS_SELECTED, widget => {
      setMessage(
        `${widget.type} selected on page ${widget.page + 1}: ${widget.title || 'Untitled'}`
      );
    });
  };

  return (
    <FormExampleScaffold
      title="Field Selection Observation"
      subtitle="Listen for field selection events exposed by the RN bridge for interactive form fields."
      actions={[
        {
          key: 'add-interactive-fields',
          label: 'Add Interactive Fields',
          onPress: addInteractiveFormFields,
        },
      ]}
      configuration={ComPDFKit.getDefaultConfig({
        modeConfig: {
          initialViewMode: CPDFViewMode.FORMS,
        },
        formsConfig: {
          availableTypes: [CPDFWidgetType.LISTBOX, CPDFWidgetType.COMBOBOX],
        },
      })}
      onViewCreated={bindSelectionListener}>
      {() => (
        <View style={styles.statusCard} pointerEvents="none">
          <Text style={styles.statusTitle}>Latest Selection Event</Text>
          <Text style={styles.statusBody}>{message}</Text>
        </View>
      )}
    </FormExampleScaffold>
  );
}

const styles = StyleSheet.create({
  statusCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 100,
    borderRadius: 12,
    backgroundColor: 'rgba(17, 24, 39, 0.82)',
    padding: 14,
  },
  statusTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  statusBody: {
    color: '#E5E7EB',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
});
