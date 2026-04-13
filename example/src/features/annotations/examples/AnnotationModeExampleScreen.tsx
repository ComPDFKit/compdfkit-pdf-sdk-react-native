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
  CPDFReaderView,
  CPDFViewMode,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { CPDFAnnotationToolbar } from '../components/CPDFAnnotationToolbar';
import { AnnotationExampleScaffold } from '../shared/AnnotationExampleScaffold';
import { annotationExampleScreenActions } from '../shared/annotationExampleActionRegistry';
import { getDefaultAnnotationDocument } from '../shared/defaultDocument';

type AnnotationModeRoute = RouteProp<
  AppStackParamList,
  'CPDFAnnotationModeExample'
>;

export default function AnnotationModeExampleScreen() {
  const navigation = useNavigation();
  const route = useRoute<AnnotationModeRoute>();
  const readerRef = useRef<CPDFReaderView | null>(null);
  const [document] = useState(route.params?.document ?? getDefaultAnnotationDocument());

  return (
    <AnnotationExampleScaffold
      title="API Annotation Mode"
      subtitle="Enter annotation mode immediately, draw ink, save the current stroke, and clear focus rectangles."
      document={document}
      readerRef={readerRef}
      configuration={ComPDFKit.getDefaultConfig({
        modeConfig: {
          initialViewMode: CPDFViewMode.ANNOTATIONS,
          uiVisibilityMode: 'automatic',
        },
        toolbarConfig: {
          annotationToolbarVisible: false,
        },
      })}
      actions={annotationExampleScreenActions.annotationModeExample}
      showAnnotationToolbar
      annotationToolbar={<CPDFAnnotationToolbar />}
      onBackPress={() => navigation.goBack()}
    />
  );
}