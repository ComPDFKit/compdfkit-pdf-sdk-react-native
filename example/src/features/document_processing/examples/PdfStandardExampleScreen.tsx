import React, { useRef, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import {
  ComPDFKit,
  CPDFPdfStandardType,
  CPDFReaderView,
  PDFReaderContext,
  PDF_STANDARD_TYPES,
} from '@compdfkit_pdf_sdk/react_native';

import { AppToolbar } from '../../../widgets/common/AppToolbar';
import { describeError } from '../../../util/exampleError';
import { PlatformNotice } from '../../../widgets/common/PlatformNotice';
import { EXAMPLE_ROUTES } from '../../../examples/shared/exampleRoutes';
import { PdfStandardControls } from '../components/PdfStandardControls';
import { PdfStandardLogPanel } from '../components/PdfStandardLogPanel';
import { getDefaultDocumentProcessingDocument } from '../shared/defaultDocument';
import {
  createPdfStandardLogEntry,
  getPdfStandardOutputPath,
  initialPdfStandardConversionState,
  PdfStandardConversionState,
} from '../shared/pdfStandardConversion';

const temporaryDirectory = RNFS.TemporaryDirectoryPath ?? RNFS.CachesDirectoryPath ?? RNFS.DocumentDirectoryPath;

export default function PdfStandardExampleScreen() {
  const navigation = useNavigation<any>();
  const readerRef = useRef<CPDFReaderView | null>(null);
  const [conversion, setConversion] = useState<PdfStandardConversionState>(initialPdfStandardConversionState);
  const [isPickerVisible, setPickerVisible] = useState(false);

  const appendEntry = (entry: Parameters<typeof createPdfStandardLogEntry>[0]) => {
    setConversion(current => ({
      ...current,
      entries: [createPdfStandardLogEntry(entry), ...current.entries].slice(0, 12),
    }));
  };

  const convert = async () => {
    const reader = readerRef.current;
    if (!reader || conversion.isConverting) return;

    setConversion(current => ({ ...current, isConverting: true }));
    let documentName = 'PDF_Document.pdf';
    let sourceType: CPDFPdfStandardType = 'pdf';
    const outputPath = getPdfStandardOutputPath(temporaryDirectory, conversion.targetType);

    try {
      documentName = await reader._pdfDocument.getFileName();
      sourceType = await reader._pdfDocument.getPdfStandardType();
      const success = await reader._pdfDocument.convertToPdfStandard(outputPath, conversion.targetType, conversion.fontSubset);
      if (!success || !(await RNFS.exists(outputPath))) throw new Error('The converted output file was not created.');

      setConversion(current => ({ ...current, outputPath }));
      appendEntry({ status: 'success', documentName, sourceType, targetType: conversion.targetType, detail: `Output: ${outputPath}` });
    } catch (error) {
      const message = describeError(error);
      appendEntry({ status: 'error', documentName, sourceType, targetType: conversion.targetType, detail: message });
      Alert.alert('PDF Standard', message);
    } finally {
      setConversion(current => ({ ...current, isConverting: false }));
    }
  };

  const openOutput = async () => {
    const outputPath = conversion.outputPath;
    if (!outputPath) return;

    try {
      if (!(await RNFS.exists(outputPath))) throw new Error('The converted output file no longer exists.');
      navigation.navigate(EXAMPLE_ROUTES.viewerBasic, { document: outputPath });
    } catch (error) {
      Alert.alert('PDF Standard', describeError(error));
    }
  };

  return (
    <PDFReaderContext.Provider value={readerRef.current}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <AppToolbar title="PDF Standard" subtitle="Convert a PDF to a target standard." onBackPress={() => navigation.goBack()} />
          <PlatformNotice
            ios="pdf and pdf_e_2 are not conversion targets on iOS (UNSUPPORTED_PDF_STANDARD)."
            android="A copy of the source file is converted, so unsaved changes in the reader are not included."
          />
          <PdfStandardControls
            targetType={conversion.targetType}
            fontSubset={conversion.fontSubset}
            isConverting={conversion.isConverting}
            canOpenOutput={conversion.outputPath != null}
            onTargetPress={() => setPickerVisible(true)}
            onFontSubsetChange={fontSubset => setConversion(current => ({ ...current, fontSubset }))}
            onConvert={() => void convert()}
            onOpenOutput={() => void openOutput()}
          />
          <View style={styles.logArea}>
            <PdfStandardLogPanel entries={conversion.entries} />
          </View>
          {/* The document API requires a mounted native reader, but this sample does not display it. */}
          <CPDFReaderView
            ref={readerRef}
            document={getDefaultDocumentProcessingDocument()}
            configuration={ComPDFKit.getDefaultConfig({})}
            style={styles.hiddenReader}
          />
          <StandardPickerModal
            selected={conversion.targetType}
            visible={isPickerVisible}
            onClose={() => setPickerVisible(false)}
            onSelect={targetType => {
              setConversion(current => ({ ...current, targetType }));
              setPickerVisible(false);
            }}
          />
        </View>
      </SafeAreaView>
    </PDFReaderContext.Provider>
  );
}


function StandardPickerModal({ visible, selected, onSelect, onClose }: { visible: boolean; selected: CPDFPdfStandardType; onSelect: (type: CPDFPdfStandardType) => void; onClose: () => void }) {
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
    <View style={styles.backdrop}>
      <View style={styles.modalCard}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Target Standard</Text>
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
            <Image source={require('../../../../assets/close.png')} style={styles.closeIcon} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.options}>
          {PDF_STANDARD_TYPES.map(type => <Pressable key={type} onPress={() => onSelect(type)} style={[styles.option, selected === type && styles.optionSelected]}><Text style={[styles.optionText, selected === type && styles.optionTextSelected]}>{type}</Text></Pressable>)}
        </ScrollView>
      </View>
    </View>
  </Modal>;
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#F5F7FA', flex: 1 }, container: { backgroundColor: '#F5F7FA', flex: 1 }, logArea: { flex: 1 },
  hiddenReader: { height: 1, opacity: 0, position: 'absolute', width: 1 },
  backdrop: { backgroundColor: 'rgba(15, 23, 42, 0.42)', flex: 1, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 8, borderTopRightRadius: 8, maxHeight: '72%', padding: 16 },
  modalHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }, modalTitle: { color: '#102A43', fontSize: 17, fontWeight: '700' },
  closeButton: { alignItems: 'center', backgroundColor: '#F5F7FA', borderRadius: 18, height: 36, justifyContent: 'center', width: 36 }, closeIcon: { height: 16, tintColor: '#1A1A1A', width: 16 },
  options: { gap: 6, paddingBottom: 12 }, option: { backgroundColor: '#FFFFFF', borderColor: '#D9E2EC', borderRadius: 6, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12, paddingVertical: 10 }, optionSelected: { backgroundColor: '#E8F0FF', borderColor: '#1460F3' }, optionText: { color: '#243B53', fontSize: 14 }, optionTextSelected: { color: '#1460F3', fontWeight: '700' },
});
