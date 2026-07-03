/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  CPDFAnnotation,
  CPDFReaderView,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { useAppTheme } from '../../../theme/appTheme';
import { Logger } from '../../../util/logger';
import {
  AnnotationExampleScaffold,
  type AnnotationExampleAction,
} from '../shared/AnnotationExampleScaffold';
import { getDefaultAnnotationDocument } from '../shared/defaultDocument';
import {
  AnnotationReplyPickerSheet,
  AnnotationReplyThreadSheet,
  EmptyAnnotationRepliesSheet,
} from '../replies/AnnotationReplySheets';
import { createAnnotationReplyStyles } from '../replies/annotationReplyStyles';
import {
  ANNOTATION_REPLY_AUTHOR,
  type AnnotationReplyPanelMode,
  type ReplyCounts,
} from '../replies/annotationReplyUtils';

type AnnotationReplyRoute = RouteProp<
  AppStackParamList,
  'CPDFAnnotationReplyExample'
>;

export default function AnnotationReplyExampleScreen() {
  const navigation = useNavigation();
  const route = useRoute<AnnotationReplyRoute>();
  const readerRef = useRef<CPDFReaderView | null>(null);
  const appTheme = useAppTheme();
  const styles = createAnnotationReplyStyles(appTheme);
  const [document] = useState(route.params?.document ?? getDefaultAnnotationDocument());
  const [panelVisible, setPanelVisible] = useState(false);
  const [panelMode, setPanelMode] = useState<AnnotationReplyPanelMode>('picker');
  const [pageIndex, setPageIndex] = useState(0);
  const [annotations, setAnnotations] = useState<CPDFAnnotation[]>([]);
  const [replyCounts, setReplyCounts] = useState<ReplyCounts>({});
  const [selectedAnnotation, setSelectedAnnotation] = useState<CPDFAnnotation | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getDocumentApi = () => readerRef.current?._pdfDocument;

  const handleReplyCountChange = useCallback((annotationUuid: string, count: number) => {
    setReplyCounts((previous) => ({
      ...previous,
      [annotationUuid]: count,
    }));
  }, []);

  const openReplies = async () => {
    const reader = readerRef.current;
    const pdfDocument = reader?._pdfDocument;
    if (!reader || !pdfDocument) {
      setPanelMode('empty');
      setMessage('Document is not ready.');
      setPanelVisible(true);
      return;
    }

    setPanelVisible(true);
    setPanelMode('picker');
    setLoading(true);
    setMessage('');
    setSelectedAnnotation(null);

    try {
      const currentPage = await reader.getCurrentPageIndex();
      const pageAnnotations = await pdfDocument.pageAtIndex(currentPage).getAnnotations();
      const counts: ReplyCounts = {};
      for (const annotation of pageAnnotations) {
        // Mirrors the Flutter sample: prefetch reply counts before opening a thread.
        const annotationReplies = await pdfDocument.getAnnotationReplies(annotation);
        counts[annotation.uuid] = annotationReplies.length;
      }
      setPageIndex(currentPage);
      setAnnotations(pageAnnotations);
      setReplyCounts(counts);
      if (pageAnnotations.length === 0) {
        setPanelMode('empty');
        setMessage('');
      } else if (pageAnnotations.length === 1) {
        const [annotation] = pageAnnotations;
        if (annotation) {
          openThread(annotation);
        }
      }
    } catch (error) {
      Logger.error('open annotation replies failed:', error);
      setMessage('Failed to load annotations.');
    } finally {
      setLoading(false);
    }
  };

  const openThread = (annotation: CPDFAnnotation) => {
    setSelectedAnnotation(annotation);
    setPanelMode('thread');
  };

  const actions: AnnotationExampleAction[] = [
    {
      key: 'replies',
      label: 'Replies',
      onPress: openReplies,
    },
  ];

  return (
    <>
      <AnnotationExampleScaffold
        title="Annotation Replies"
        subtitle="Manage annotation reply threads"
        document={document}
        readerRef={readerRef}
        configuration={ComPDFKit.getDefaultConfig({
          modeConfig: { initialViewMode: 'annotations' },
          annotationsConfig: { annotationAuthor: ANNOTATION_REPLY_AUTHOR },
        })}
        actions={actions}
        onBackPress={() => navigation.goBack()}
      />

      <Modal
        visible={panelVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPanelVisible(false)}
      >
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setPanelVisible(false)} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.sheetWrap}
          >
            <View
              style={[
                styles.sheet,
                panelMode === 'picker' ? styles.pickerSheet : null,
                panelMode === 'empty' ? styles.emptySheet : null,
              ]}
            >
              {panelMode === 'empty' ? (
                <EmptyAnnotationRepliesSheet
                  pageIndex={pageIndex}
                  styles={styles}
                  onClose={() => setPanelVisible(false)}
                />
              ) : panelMode === 'picker' ? (
                <AnnotationReplyPickerSheet
                  annotations={annotations}
                  loading={loading}
                  message={message}
                  pageIndex={pageIndex}
                  replyCounts={replyCounts}
                  styles={styles}
                  onClose={() => setPanelVisible(false)}
                  onSelect={openThread}
                />
              ) : selectedAnnotation ? (
                <AnnotationReplyThreadSheet
                  annotation={selectedAnnotation}
                  documentApi={getDocumentApi()}
                  styles={styles}
                  placeholderTextColor={appTheme.colors.textSecondary}
                  onClose={() => setPanelVisible(false)}
                  onReplyCountChange={handleReplyCountChange}
                />
              ) : null}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}
