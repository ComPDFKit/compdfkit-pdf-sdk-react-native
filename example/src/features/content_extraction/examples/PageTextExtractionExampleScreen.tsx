/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { CPDFReaderView, CPDFTextLine } from '@compdfkit_pdf_sdk/react_native';

import { useAppTheme } from '../../../theme/appTheme';
import { ContentExtractionExampleScaffold } from '../shared/ContentExtractionExampleScaffold';

type TextDialogState = {
  title: string;
  content: string;
} | null;

export default function PageTextExtractionExampleScreen() {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);
  const { height: windowHeight } = useWindowDimensions();
  const [dialog, setDialog] = useState<TextDialogState>(null);
  const dialogContentMaxHeight = Math.max(260, windowHeight * 0.62);

  const showTextDialog = (title: string, content: string) => {
    const visibleContent = content.trim().length > 0
      ? content
      : 'No text content found.';
    setDialog({ title, content: visibleContent });
  };

  const showMessage = (title: string, message: string) => {
    setDialog({ title, content: message });
  };

  const extractCurrentPageText = async (reader: CPDFReaderView) => {
    try {
      const pageIndex = await reader.getCurrentPageIndex();
      const page = reader._pdfDocument.pageAtIndex(pageIndex);
      const text = await page.getAllText();
      showTextDialog(`Page ${pageIndex + 1} Text`, text);
    } catch (error) {
      showMessage('Extract Current Page Text', errorMessage(error));
    }
  };

  const extractFirstTextLine = async (reader: CPDFReaderView) => {
    try {
      const pageIndex = await reader.getCurrentPageIndex();
      const page = reader._pdfDocument.pageAtIndex(pageIndex);
      const line = await findFirstTextLine(page);

      if (!line) {
        showMessage('Extract First Text Line', 'No text line found on the current page.');
        return;
      }

      const text = await page.getTextByLine(line);
      await reader.setDisplayPageIndex(line.pageIndex, { rectList: [line.rect] });
      showTextDialog(
        `Page ${line.pageIndex + 1}, Line ${line.lineIndex + 1}`,
        [
          `Line index: ${line.lineIndex}`,
          `Range: ${line.location}, ${line.length}`,
          `Rect: ${formatRect(line.rect)}`,
          '',
          text,
        ].join('\n'),
      );
    } catch (error) {
      showMessage('Extract First Text Line', errorMessage(error));
    }
  };

  const extractTextFromFirstLineRect = async (reader: CPDFReaderView) => {
    try {
      const pageIndex = await reader.getCurrentPageIndex();
      const page = reader._pdfDocument.pageAtIndex(pageIndex);
      const line = await findFirstTextLine(page);

      if (!line) {
        showMessage('Extract Text From Rect', 'No text line found on the current page.');
        return;
      }

      const text = await page.getTextInRect(line.rect);
      await reader.setDisplayPageIndex(line.pageIndex, { rectList: [line.rect] });
      showTextDialog(
        `Rect Text - Page ${line.pageIndex + 1}, Line ${line.lineIndex + 1}`,
        [
          `Rect ${formatCompactRect(line.rect)} | ${text.length} chars`,
          '',
          text,
        ].join('\n'),
      );
    } catch (error) {
      showMessage('Extract Text From Rect', errorMessage(error));
    }
  };

  return (
    <ContentExtractionExampleScaffold
      title="Page Text Extraction"
      subtitle="Use the menu to extract page text, line text, or bounded text."
      actions={[
        {
          key: 'extract-current-page-text',
          label: 'Extract Current Page Text',
          onPress: extractCurrentPageText,
        },
        {
          key: 'extract-first-text-line',
          label: 'Extract First Text Line',
          onPress: extractFirstTextLine,
        },
        {
          key: 'extract-text-from-rect',
          label: 'Extract Text From Rect',
          onPress: extractTextFromFirstLineRect,
        },
      ]}>
      <Modal
        visible={dialog !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDialog(null)}>
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={() => setDialog(null)} />
          <View style={styles.dialogCard}>
            <Text style={styles.dialogTitle}>{dialog?.title}</Text>
            <ScrollView
              style={[
                styles.dialogScroll,
                { maxHeight: dialogContentMaxHeight },
              ]}
              contentContainerStyle={styles.dialogScrollContent}
              persistentScrollbar>
              <Text selectable style={styles.dialogContent}>
                {dialog?.content}
              </Text>
            </ScrollView>
            <Pressable
              style={styles.closeButton}
              onPress={() => setDialog(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ContentExtractionExampleScaffold>
  );
}

async function findFirstTextLine(page: ReturnType<CPDFReaderView['_pdfDocument']['pageAtIndex']>) {
  const lines = await page.getTextLines();
  for (const line of lines) {
    const text = await page.getTextByLine(line);
    if (text.trim().length > 0) {
      return line;
    }
  }
  return null;
}

function formatRect(lineRect: CPDFTextLine['rect']) {
  return `left ${round(lineRect.left)}, top ${round(lineRect.top)}, right ${round(lineRect.right)}, bottom ${round(lineRect.bottom)}`;
}

function formatCompactRect(lineRect: CPDFTextLine['rect']) {
  return `(${round(lineRect.left)}, ${round(lineRect.top)}) - (${round(lineRect.right)}, ${round(lineRect.bottom)})`;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Operation failed.';
}

function createStyles(appTheme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    modalRoot: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(17, 24, 39, 0.42)',
    },
    dialogCard: {
      width: '100%',
      maxWidth: 560,
      maxHeight: '86%',
      borderRadius: 8,
      backgroundColor: appTheme.colors.surface,
      padding: 18,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    dialogTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: appTheme.colors.textPrimary,
    },
    dialogScroll: {
      marginTop: 12,
      borderRadius: 6,
      backgroundColor: appTheme.colors.background,
    },
    dialogScrollContent: {
      padding: 12,
    },
    dialogContent: {
      fontSize: 13,
      lineHeight: 19,
      color: appTheme.colors.textPrimary,
    },
    closeButton: {
      alignSelf: 'flex-end',
      height: 40,
      minWidth: 92,
      marginTop: 14,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appTheme.colors.primary,
      paddingHorizontal: 16,
    },
    closeButtonText: {
      fontSize: 14,
      fontWeight: '700',
      color: appTheme.colors.inverseText,
    },
  });
}
