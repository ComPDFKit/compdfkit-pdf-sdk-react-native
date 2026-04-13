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
import { Share } from 'react-native';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { AnnotationExampleScaffold } from '../shared/AnnotationExampleScaffold';
import { ConfirmDialog } from '../../../widgets/common/ConfirmDialog';
import {
  annotationExampleMenuActions,
  toAnnotationExampleAction,
} from '../shared/annotationExampleActionRegistry';
import { exportAnnotations } from '../shared/annotationExampleActions';
import { getDefaultAnnotationDocument } from '../shared/defaultDocument';

type XfdfOperationsRoute = RouteProp<
  AppStackParamList,
  'CPDFXfdfOperationsExample'
>;

export default function XfdfOperationsExampleScreen() {
  const navigation = useNavigation();
  const route = useRoute<XfdfOperationsRoute>();
  const readerRef = useRef<CPDFReaderView | null>(null);
  const [document] = useState(route.params?.document ?? getDefaultAnnotationDocument());
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [exportedFilePath, setExportedFilePath] = useState<string | null>(null);

  const actions = [
    toAnnotationExampleAction(annotationExampleMenuActions.importAssetXfdf),
    toAnnotationExampleAction(annotationExampleMenuActions.pickXfdfFile),
    {
      ...toAnnotationExampleAction(annotationExampleMenuActions.exportXfdf),
      onPress: async (reader: CPDFReaderView) => {
        const filePath = await exportAnnotations(reader);
        setExportedFilePath(filePath ?? null);

        setDialogMessage(
          filePath
            ? `XFDF exported to:\n${filePath}`
            : 'XFDF export failed or no output path was returned.',
        );
        setDialogVisible(true);
      },
    },
  ] as const;

  const handleCloseDialog = () => {
    setDialogVisible(false);
  };

  const handleShareDialog = async () => {
    if (!exportedFilePath) {
      setDialogVisible(false);
      return;
    }

    const shareUrl = exportedFilePath.startsWith('file://')
      ? exportedFilePath
      : `file://${exportedFilePath}`;

    try {
      await Share.share({
        url: shareUrl,
        message: exportedFilePath,
      });
    } finally {
      setDialogVisible(false);
    }
  };

  return (
    <AnnotationExampleScaffold
      title="XFDF Operations"
      subtitle="Import XFDF from assets or the filesystem, then export the current annotations back out."
      document={document}
      readerRef={readerRef}
      configuration={ComPDFKit.getDefaultConfig({
        modeConfig: {
          initialViewMode: CPDFViewMode.ANNOTATIONS,
        },
      })}
      actions={actions}
      overlay={
        <ConfirmDialog
          visible={dialogVisible}
          title="Export XFDF"
          message={dialogMessage}
          cancelLabel="Close"
          confirmLabel="Share"
          onCancel={handleCloseDialog}
          onConfirm={handleShareDialog}
        />
      }
      onBackPress={() => navigation.goBack()}
    />
  );
}