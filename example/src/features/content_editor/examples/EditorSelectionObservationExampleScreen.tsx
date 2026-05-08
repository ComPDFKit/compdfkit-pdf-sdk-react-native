/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  CPDFEditArea,
  CPDFEvent,
  CPDFEditType,
  CPDFReaderView,
} from '@compdfkit_pdf_sdk/react_native';

import {
  disableEditMode,
  enableTextEditMode,
  insertSampleText,
} from '../shared/contentEditorActions';
import { ContentEditorExampleScaffold } from '../shared/ContentEditorExampleScaffold';

function formatEditAreaLabel(editArea: CPDFEditArea) {
  switch (editArea.type) {
    case CPDFEditType.TEXT:
      return 'Text area';
    case CPDFEditType.IMAGE:
      return 'Image area';
    case CPDFEditType.PATH:
      return 'Path area';
    default:
      return 'Editable content';
  }
}

export default function EditorSelectionObservationExampleScreen() {
  const attachedReaderRef = useRef<CPDFReaderView | null>(null);
  const [message, setMessage] = useState(
    'Tap editable content to observe selection and deselection events exposed by the RN bridge.'
  );

  const handleReaderReady = useCallback((reader: CPDFReaderView) => {
    if (attachedReaderRef.current === reader) {
      return;
    }

    attachedReaderRef.current = reader;

    reader.addEventListener(CPDFEvent.EDITOR_SELECTION_SELECTED, editArea => {
      setMessage(
        `${formatEditAreaLabel(editArea)} selected on page ${editArea.page + 1}`
      );
    });

    reader.addEventListener(CPDFEvent.EDITOR_SELECTION_DESELECTED, editArea => {
      if (!editArea) {
        setMessage('Content selection cleared.');
        return;
      }

      setMessage(
        `${formatEditAreaLabel(editArea)} deselected on page ${editArea.page + 1}`
      );
    });
  }, []);

  return (
    <ContentEditorExampleScaffold
      title="Editor Selection Observation"
      subtitle="Listen for content editor selection and deselection events exposed by the RN bridge."
      onReaderReady={handleReaderReady}
      actions={[
        {
          key: 'enable-text-edit',
          label: 'Enable Text Edit',
          onPress: enableTextEditMode,
        },
        {
          key: 'disable-edit-mode',
          label: 'Disable Edit Mode',
          onPress: disableEditMode,
        },
        {
          key: 'insert-sample-text',
          label: 'Insert Text',
          onPress: insertSampleText,
        },
      ]}>
      <View style={styles.statusCard} pointerEvents="none">
        <Text style={styles.statusTitle}>Latest Selection Event</Text>
        <Text style={styles.statusBody}>{message}</Text>
      </View>
    </ContentEditorExampleScaffold>
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