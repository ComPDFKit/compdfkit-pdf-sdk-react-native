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
import { CPDFReaderView, CPDFRedactAnnotation } from '@compdfkit_pdf_sdk/react_native';

import { SecurityExampleScaffold } from '../shared/SecurityExampleScaffold';
import { describeError } from '../../../util/exampleError';

export default function RedactionAnnotationExampleScreen() {
  return (
    <SecurityExampleScaffold
      title="Redaction"
      subtitle="Add, inspect, and update redactions, then permanently apply them."
      actions={[
        {
          key: 'add-redaction',
          label: 'Add Redaction',
          onPress: async (reader) => run(async () => {
            await reader._pdfDocument.addAnnotations([
              new CPDFRedactAnnotation({
                page: 0,
                rect: { left: 60, top: 557, right: 438, bottom: 500 },
                overlayText: 'REDACTED',
                fillColor: '#000000',
                outlineColor: '#FF0000',
                textAttribute: { color: '#FFFFFF', familyName: 'Helvetica', styleName: '', fontSize: 14 },
              }),
            ]);
            Alert.alert('Redaction', 'Added a pending redaction on page 1. Its content stays until it is applied.');
          }),
        },
        {
          key: 'read-redactions',
          label: 'Read Redactions',
          onPress: async (reader) => run(async () => {
            const redactions = await readRedactions(reader);
            Alert.alert(
              'Redaction',
              redactions.length === 0
                ? 'Page 1 has no pending redactions.'
                : redactions.map((item, index) =>
                  `#${index + 1} "${item.overlayText}" fill ${item.fillColor}, outline ${item.outlineColor ?? 'none'}, ${item.alignment}`,
                ).join('\n'),
            );
          }),
        },
        {
          key: 'update-redaction',
          label: 'Update First',
          onPress: async (reader) => run(async () => {
            const [first] = await readRedactions(reader);
            if (!first) {
              Alert.alert('Redaction', 'Add a redaction first.');
              return;
            }
            first.update({ overlayText: 'CONFIDENTIAL', fillColor: '#B71C1C' });
            await reader._pdfDocument.updateAnnotation(first);
            Alert.alert('Redaction', 'Updated the overlay text and fill color. It is still pending.');
          }),
        },
        {
          key: 'apply-redaction',
          label: 'Apply First',
          onPress: async (reader) => run(async () => {
            const [first] = await readRedactions(reader);
            if (!first) {
              Alert.alert('Redaction', 'Add a redaction first.');
              return;
            }
            await confirmApply('Permanently apply this redaction?', async () => {
              const applied = await reader._pdfDocument.applyRedaction(first);
              Alert.alert('Redaction', applied ? 'The covered content was removed.' : 'The redaction no longer exists.');
            });
          }),
        },
        {
          key: 'apply-redactions',
          label: 'Apply All',
          onPress: (reader) => confirmApply('Permanently apply all redactions?', async () => {
            const applied = await reader._pdfDocument.applyRedactions();
            Alert.alert('Redaction', applied ? 'All redactions were applied.' : 'There was nothing to apply.');
          }),
        },
      ]}
    />
  );
}

async function readRedactions(reader: CPDFReaderView): Promise<CPDFRedactAnnotation[]> {
  const annotations = await reader._pdfDocument.pageAtIndex(0).getAnnotations();
  return annotations.filter((annotation): annotation is CPDFRedactAnnotation => annotation instanceof CPDFRedactAnnotation);
}

async function run(action: () => Promise<unknown>) {
  try {
    await action();
  } catch (error) {
    Alert.alert('Redaction', describeError(error));
  }
}

/** Applying a redaction is irreversible, so it always asks for confirmation first. */
function confirmApply(title: string, apply: () => Promise<void>) {
  return new Promise<void>((resolve) => Alert.alert(
    title,
    'This removes the covered content and cannot be undone.',
    [
      { text: 'Cancel', style: 'cancel', onPress: () => resolve() },
      { text: 'Apply', style: 'destructive', onPress: () => void run(apply).then(resolve) },
    ],
  ));
}
