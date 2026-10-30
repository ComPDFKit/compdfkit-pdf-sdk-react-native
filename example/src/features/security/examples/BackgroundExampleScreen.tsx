/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 */

import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CPDFBackground } from '@compdfkit_pdf_sdk/react_native';

import { AppToast } from '../../../widgets/common/ConfirmDialog';
import { CPDFFileUtil } from '../../../util/CPDFFileUtil';
import { SecurityExampleScaffold } from '../shared/SecurityExampleScaffold';
import { describeError } from '../../../util/exampleError';

const BACKGROUND_IMAGE_ASSET = 'test_sign_pic.png';
const BACKGROUND_IMAGE_FILE = 'background-example.png';
const UPDATED_ROTATION = 15;

export default function BackgroundExampleScreen() {
  const [background, setBackground] = useState<CPDFBackground | null>(null);
  const [isReadDialogVisible, setReadDialogVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const run = async (action: () => Promise<boolean>, successMessage: string, failureMessage: string) => {
    try {
      setToastMessage((await action()) ? successMessage : failureMessage);
    } catch (error) {
      Alert.alert('Document Background', describeError(error));
    }
  };

  return (
    <SecurityExampleScaffold
      title="Document Background"
      subtitle="Set, inspect, update, and clear color or image backgrounds."
      actions={[
        {
          key: 'add-color-background',
          label: 'Add Color Background',
          onPress: (reader) => run(
            async () => reader._pdfDocument.updateBackground(
              await createColorBackground(reader._pdfDocument, '#FFFFC107', 0.35),
            ),
            'Color background added',
            'Failed to add color background',
          ),
        },
        {
          key: 'add-image-background',
          label: 'Add Image Background',
          onPress: (reader) => run(
            async () => reader._pdfDocument.updateBackground(
              await createImageBackground(reader._pdfDocument, 0.25, 0.5),
            ),
            'Image background added at 0°',
            'Failed to add image background',
          ),
        },
        {
          key: 'read-background',
          label: 'Read Background',
          onPress: async (reader) => {
            try {
              setBackground(await reader._pdfDocument.getBackground());
              setReadDialogVisible(true);
            } catch (error) {
              Alert.alert('Document Background', describeError(error));
            }
          },
        },
        {
          key: 'update-background',
          label: `Update Background (${UPDATED_ROTATION}° clockwise)`,
          onPress: async (reader) => {
            try {
              const current = await reader._pdfDocument.getBackground();
              if (!current) {
                setToastMessage('No background to update');
                return;
              }
              await run(
                async () => reader._pdfDocument.updateBackground(
                  await createUpdatedBackground(current),
                ),
                `Background updated to ${UPDATED_ROTATION}° clockwise`,
                'Failed to update background',
              );
            } catch (error) {
              Alert.alert('Document Background', describeError(error));
            }
          },
        },
        {
          key: 'clear-background',
          label: 'Clear Background',
          onPress: (reader) => run(
            () => reader._pdfDocument.clearBackground(),
            'Background cleared',
            'Failed to clear background',
          ),
        },
      ]}
    >
      <BackgroundDetailsDialog
        value={background}
        visible={isReadDialogVisible}
        onClose={() => setReadDialogVisible(false)}
      />
      <AppToast visible={Boolean(toastMessage)} message={toastMessage} onHide={() => setToastMessage('')} />
    </SecurityExampleScaffold>
  );
}

async function createColorBackground(document: { getPageCount: () => Promise<number> }, color: string, opacity: number): Promise<CPDFBackground> {
  return { ...await createBaseBackground(document), type: 'color', color: color as CPDFBackground['color'], opacity };
}

async function createImageBackground(document: { getPageCount: () => Promise<number> }, opacity: number, scale: number): Promise<CPDFBackground> {
  return { ...await createBaseBackground(document), type: 'image', imagePath: await getBackgroundImagePath(), opacity, scale };
}

async function createUpdatedBackground(current: CPDFBackground): Promise<CPDFBackground> {
  if (current.type === 'color') return { ...current, color: '#FF03A9F4', opacity: 0.55, rotation: UPDATED_ROTATION };
  return { ...current, imagePath: await getBackgroundImagePath(), opacity: 0.45, rotation: UPDATED_ROTATION };
}

async function createBaseBackground(document: { getPageCount: () => Promise<number> }) {
  const pageCount = await document.getPageCount();
  return {
    pages: Array.from({ length: pageCount }, (_, index) => index),
    scale: 1,
    rotation: 0,
    horizontalAlignment: 'center' as const,
    verticalAlignment: 'center' as const,
    horizontalOffset: 0,
    verticalOffset: 0,
    allowView: true,
    allowPrint: true,
  };
}

function getBackgroundImagePath() {
  return CPDFFileUtil.copyAssetToDevice(BACKGROUND_IMAGE_ASSET, BACKGROUND_IMAGE_FILE);
}

function BackgroundDetailsDialog({ value, visible, onClose }: { value: CPDFBackground | null; visible: boolean; onClose: () => void }) {
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <View style={styles.backdrop}>
      <View style={styles.card}>
        <View style={styles.header}><View><Text style={styles.title}>Document Background</Text><Text style={styles.subtitle}>Current document configuration</Text></View><Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}><Text style={styles.closeButtonText}>×</Text></Pressable></View>
        <ScrollView contentContainerStyle={styles.content}>
          {!value ? <Text style={styles.emptyText}>No background applied</Text> : <>
            <InfoCard label="Type" value={value.type === 'color' ? 'Color' : 'Image'} />
            <InfoCard label="Applied pages" value={value.pages.length ? value.pages.map(page => page + 1).join(', ') : 'None'} />
            <InfoCard label="Appearance" value={`Opacity ${(value.opacity ?? 1).toFixed(2)}  Scale ${(value.scale ?? 1).toFixed(2)}  Rotation ${(value.rotation ?? 0).toFixed(1)}° clockwise`} />
            <InfoCard label="Position" value={`${labelHorizontal(value.horizontalAlignment)} / ${labelVertical(value.verticalAlignment)}  Offset ${(value.horizontalOffset ?? 0).toFixed(1)}, ${(value.verticalOffset ?? 0).toFixed(1)}`} />
            <InfoCard label="Permissions" value={`View ${value.allowView ?? true ? 'Allowed' : 'Hidden'}  Print ${value.allowPrint ?? true ? 'Allowed' : 'Hidden'}`} />
            {value.type === 'image' && <Text style={styles.note}>The native SDK does not expose the source path of an existing image background.</Text>}
          </>}
        </ScrollView>
        <Pressable accessibilityRole="button" onPress={onClose} style={styles.doneButton}><Text style={styles.doneButtonText}>Close</Text></Pressable>
      </View>
    </View>
  </Modal>;
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return <View style={styles.infoCard}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

function labelHorizontal(value: CPDFBackground['horizontalAlignment']) {
  return value === 'left' ? 'Left' : value === 'right' ? 'Right' : 'Center';
}

function labelVertical(value: CPDFBackground['verticalAlignment']) {
  return value === 'top' ? 'Top' : value === 'bottom' ? 'Bottom' : 'Center';
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15, 23, 42, 0.42)' },
  card: { maxHeight: '84%', backgroundColor: '#FAFCFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 },
  title: { color: '#102A43', fontSize: 20, fontWeight: '700' },
  subtitle: { color: '#627D98', fontSize: 13, marginTop: 4 },
  closeButton: { padding: 2, marginTop: -4 },
  closeButtonText: { color: '#627D98', fontSize: 30, lineHeight: 30 },
  content: { paddingBottom: 8 },
  emptyText: { color: '#627D98', fontSize: 15, paddingVertical: 32, textAlign: 'center' },
  infoCard: { backgroundColor: '#EAF2FF', borderRadius: 12, padding: 12, marginBottom: 8 },
  infoLabel: { color: '#486581', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  infoValue: { color: '#102A43', fontSize: 14, lineHeight: 20 },
  note: { color: '#627D98', fontSize: 12, lineHeight: 18, marginTop: 4 },
  doneButton: { backgroundColor: '#335CFF', borderRadius: 12, alignItems: 'center', paddingVertical: 13, marginTop: 8 },
  doneButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
