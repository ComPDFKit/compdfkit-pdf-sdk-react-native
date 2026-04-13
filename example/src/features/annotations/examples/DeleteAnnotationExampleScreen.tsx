/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useRef, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  CPDFAnnotation,
  CPDFReaderView,
  CPDFViewMode,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { CPDFAnnotationListScreen } from '../modal/CPDFAnnotationListScreen';
import {
  AnnotationExampleScaffold,
  type AnnotationExampleAction,
} from '../shared/AnnotationExampleScaffold';
import {
  annotationExampleMenuActions,
  toAnnotationExampleAction,
} from '../shared/annotationExampleActionRegistry';
import {
  deleteAnnotation,
  fetchAllAnnotations,
  removeAllAnnotations,
} from '../shared/annotationExampleActions';
import { getDefaultAnnotationDocument } from '../shared/defaultDocument';

type DeleteAnnotationRoute = RouteProp<
  AppStackParamList,
  'CPDFDeleteAnnotationExample'
>;

export default function DeleteAnnotationExampleScreen() {
  const navigation = useNavigation();
  const route = useRoute<DeleteAnnotationRoute>();
  const readerRef = useRef<CPDFReaderView | null>(null);
  const [document] = useState(route.params?.document ?? getDefaultAnnotationDocument());
  const [annotationModalVisible, setAnnotationModalVisible] = useState(false);
  const [annotations, setAnnotations] = useState<CPDFAnnotation[]>([]);

  const refreshAnnotations = async () => {
    const allAnnotations = await fetchAllAnnotations(readerRef.current);
    setAnnotations(allAnnotations);
    return allAnnotations;
  };

  const actions: AnnotationExampleAction[] = [
    toAnnotationExampleAction(annotationExampleMenuActions.addSampleAnnotations, {
      tone: 'secondary',
    }),
    {
      key: 'remove-all-annotations',
      label: 'Remove All',
      tone: 'danger',
      onPress: async () => {
        await removeAllAnnotations(readerRef.current);
        await refreshAnnotations();
      },
    },
  ];

  return (
    <AnnotationExampleScaffold
      title="Delete Annotation"
      subtitle="Delete a single annotation from the list or clear the whole document in one action."
      document={document}
      readerRef={readerRef}
      configuration={ComPDFKit.getDefaultConfig({
        modeConfig: {
          initialViewMode: CPDFViewMode.ANNOTATIONS,
        },
      })}
      actions={actions}
      overlay={
        <CPDFAnnotationListScreen
          visible={annotationModalVisible}
          annotations={annotations}
          onClose={() => {
            setAnnotationModalVisible(false);
          }}
          onDelete={async (annotation) => {
            await deleteAnnotation(readerRef.current, annotation);
            const latestAnnotations = await refreshAnnotations();
            if (latestAnnotations.length === 0) {
              setAnnotationModalVisible(false);
            }
          }}
        />
      }
      onBackPress={() => navigation.goBack()}
    />
  );
}