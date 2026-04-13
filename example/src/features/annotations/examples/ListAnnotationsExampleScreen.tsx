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
  fetchAllAnnotations,
} from '../shared/annotationExampleActions';
import { getDefaultAnnotationDocument } from '../shared/defaultDocument';

type ListAnnotationRoute = RouteProp<AppStackParamList, 'CPDFListAnnotationsExample'>;

export default function ListAnnotationsExampleScreen() {
  const navigation = useNavigation();
  const route = useRoute<ListAnnotationRoute>();
  const readerRef = useRef<CPDFReaderView | null>(null);
  const [document] = useState(route.params?.document ?? getDefaultAnnotationDocument());
  const [annotationModalVisible, setAnnotationModalVisible] = useState(false);
  const [annotations, setAnnotations] = useState<CPDFAnnotation[]>([]);

  const openAnnotationList = async () => {
    const allAnnotations = await fetchAllAnnotations(readerRef.current);
    setAnnotations(allAnnotations);
    setAnnotationModalVisible(true);
  };

  const actions: AnnotationExampleAction[] = [
    {
      key: 'open-annotation-list',
      label: 'Open Annotation List',
      onPress: openAnnotationList,
    },
  ];

  return (
    <AnnotationExampleScaffold
      title="List Annotations"
      subtitle="Collect annotations across all pages and jump to their bounding rectangles from a list."
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
        />
      }
      onBackPress={() => navigation.goBack()}
    />
  );
}