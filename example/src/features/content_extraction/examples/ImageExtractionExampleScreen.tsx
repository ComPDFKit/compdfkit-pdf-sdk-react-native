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
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import { CPDFReaderView } from '@compdfkit_pdf_sdk/react_native';

import { useAppTheme } from '../../../theme/appTheme';
import { ContentExtractionExampleScaffold } from '../shared/ContentExtractionExampleScaffold';

type DialogState = {
  title: string;
  message?: string;
} | null;

const TEMP_ROOT =
  RNFS.TemporaryDirectoryPath ?? RNFS.CachesDirectoryPath ?? RNFS.DocumentDirectoryPath;

export default function ImageExtractionExampleScreen() {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [isExtracting, setIsExtracting] = useState(false);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [dialog, setDialog] = useState<DialogState>(null);
  const dialogContentHeight = Math.max(280, Math.min(520, windowHeight * 0.58));
  const imageTileSize = getImageTileSize(windowWidth);

  const showImageResultDialog = (message?: string) => {
    setDialog({ title: 'Extracted Images', message });
  };

  const extractImages = async (reader: CPDFReaderView) => {
    if (isExtracting) {
      return;
    }

    setIsExtracting(true);
    setImagePaths([]);

    try {
      const outputDirectory = `${TEMP_ROOT}/extracted_images_${Date.now()}`;
      if (await RNFS.exists(outputDirectory)) {
        await RNFS.unlink(outputDirectory);
      }
      await RNFS.mkdir(outputDirectory);

      const result = await reader._pdfDocument.extractImages(outputDirectory);
      setImagePaths(result.imagePaths);
      setIsExtracting(false);

      if (!result.success) {
        showImageResultDialog('Extract images failed.');
        return;
      }

      showImageResultDialog(
        result.imagePaths.length === 0
          ? 'No embedded images were extracted.'
          : undefined,
      );
    } catch (error) {
      setIsExtracting(false);
      showImageResultDialog(`Extract images failed: ${errorMessage(error)}`);
    }
  };

  const clearPreview = () => {
    setImagePaths([]);
    setDialog(null);
  };

  return (
    <ContentExtractionExampleScaffold
      title="Extract Images"
      subtitle="Extract embedded images from the current reader document."
      actions={[
        {
          key: 'extract-images',
          label: isExtracting ? 'Extracting Images...' : 'Extract Images',
          onPress: extractImages,
        },
        ...(imagePaths.length > 0
          ? [
              {
                key: 'view-extracted-images',
                label: 'View Extracted Images',
                onPress: () => showImageResultDialog(),
              },
              {
                key: 'clear-preview',
                label: 'Clear Preview',
                onPress: clearPreview,
              },
            ]
          : []),
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
            <View style={[styles.dialogContentWrap, { height: dialogContentHeight }]}>
              {dialog?.message ? (
                <View style={styles.messageWrap}>
                  <Text style={styles.messageText}>{dialog.message}</Text>
                </View>
              ) : (
                <ScrollView
                  contentContainerStyle={styles.imageGrid}
                  persistentScrollbar>
                  {imagePaths.map((imagePath) => (
                    <View
                      key={imagePath}
                      style={[
                        styles.imageTile,
                        { width: imageTileSize, height: imageTileSize },
                      ]}>
                      <Image
                        source={{ uri: toFileUri(imagePath) }}
                        style={styles.thumbnailImage}
                        resizeMode="contain"
                      />
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
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

function errorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function toFileUri(path: string) {
  return path.startsWith('file://') ? path : `file://${path}`;
}

function getImageTileSize(windowWidth: number) {
  const modalHorizontalPadding = 40;
  const dialogPadding = 36;
  const gridPadding = 20;
  const gridGap = 10;
  const maxDialogWidth = 560;
  const maxTileSize = 148;
  const dialogWidth = Math.min(windowWidth - modalHorizontalPadding, maxDialogWidth);
  const gridWidth = Math.max(0, dialogWidth - dialogPadding - gridPadding);
  const columnCount = Math.max(2, Math.ceil(gridWidth / maxTileSize));

  return Math.floor((gridWidth - gridGap * (columnCount - 1)) / columnCount);
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
      backgroundColor: 'rgba(15, 23, 42, 0.44)',
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
      color: appTheme.colors.textPrimary,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
    },
    dialogContentWrap: {
      borderRadius: 8,
      backgroundColor: appTheme.colors.surfaceAlt,
      overflow: 'hidden',
    },
    messageWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 18,
    },
    messageText: {
      color: appTheme.colors.textPrimary,
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
    },
    imageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      padding: 10,
    },
    imageTile: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      backgroundColor: appTheme.colors.surface,
      padding: 6,
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
    },
    closeButton: {
      alignSelf: 'flex-end',
      marginTop: 14,
      borderRadius: 8,
      backgroundColor: appTheme.colors.primary,
      paddingHorizontal: 18,
      paddingVertical: 10,
    },
    closeButtonText: {
      color: appTheme.colors.inverseText,
      fontSize: 14,
      fontWeight: '700',
    },
  });
}
