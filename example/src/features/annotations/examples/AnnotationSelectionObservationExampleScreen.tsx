/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useEffect, useRef, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import {
  CPDFAnnotation,
  CPDFEvent,
  CPDFReaderView,
  CPDFViewMode,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { AnnotationExampleScaffold } from '../shared/AnnotationExampleScaffold';
import {
  annotationExampleMenuActions,
  toAnnotationExampleAction,
} from '../shared/annotationExampleActionRegistry';
import { getDefaultAnnotationDocument } from '../shared/defaultDocument';

type AnnotationSelectionObservationRoute = RouteProp<
  AppStackParamList,
  'CPDFAnnotationSelectionObservationExample'
>;

function formatAnnotationLabel(annotation: CPDFAnnotation) {
  if (annotation.title?.trim()) {
    return annotation.title.trim();
  }
  if (annotation.content?.trim()) {
    return annotation.content.trim();
  }
  return `${annotation.type.toUpperCase()} annotation`;
}

export default function AnnotationSelectionObservationExampleScreen() {
  const navigation = useNavigation();
  const route = useRoute<AnnotationSelectionObservationRoute>();
  const readerRef = useRef<CPDFReaderView | null>(null);
  const [document] = useState(route.params?.document ?? getDefaultAnnotationDocument());
  const [message, setMessage] = useState(
    'Tap an annotation to observe selection and deselection events exposed by the RN bridge.'
  );

  useEffect(() => {
    const reader = readerRef.current;

    if (!reader) {
      return;
    }

    reader.addEventListener(CPDFEvent.ANNOTATIONS_SELECTED, annotation => {
      setMessage(
        `${formatAnnotationLabel(annotation)} selected on page ${annotation.page + 1}`
      );
    });

    reader.addEventListener(CPDFEvent.ANNOTATIONS_DESELECTED, annotation => {
      if (!annotation) {
        setMessage('Annotation selection cleared.');
        return;
      }

      setMessage(
        `${formatAnnotationLabel(annotation)} deselected on page ${annotation.page + 1}`
      );
    });
  }, []);

  return (
    <AnnotationExampleScaffold
      title="Annotation Selection Observation"
      subtitle="Listen for annotation selection and deselection events exposed by the RN bridge."
      document={document}
      readerRef={readerRef}
      configuration={ComPDFKit.getDefaultConfig({
        modeConfig: {
          initialViewMode: CPDFViewMode.ANNOTATIONS,
        },
      })}
      actions={[
        toAnnotationExampleAction(annotationExampleMenuActions.addSampleAnnotations),
      ]}
      overlay={
        <View style={styles.statusCard} pointerEvents="none">
          <Text style={styles.statusTitle}>Latest Selection Event</Text>
          <Text style={styles.statusBody}>{message}</Text>
        </View>
      }
      onBackPress={() => navigation.goBack()}
    />
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