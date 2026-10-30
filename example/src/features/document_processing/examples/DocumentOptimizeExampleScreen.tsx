import React, { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import { ComPDFKit, CPDFReaderView, PDFReaderContext } from '@compdfkit_pdf_sdk/react_native';

import { AppToolbar } from '../../../widgets/common/AppToolbar';
import { describeError } from '../../../util/exampleError';
import { EXAMPLE_ROUTES } from '../../../examples/shared/exampleRoutes';
import { OptimizeControls } from '../components/OptimizeControls';
import { OptimizeLogPanel } from '../components/OptimizeLogPanel';
import { getDefaultDocumentProcessingDocument } from '../shared/defaultDocument';
import { createOptimizeLogEntry, getOptimizeOutputPath, initialOptimizeState, OptimizeState } from '../shared/optimizeSaveAsCopy';

const temporaryDirectory = RNFS.TemporaryDirectoryPath ?? RNFS.CachesDirectoryPath ?? RNFS.DocumentDirectoryPath;

export default function DocumentOptimizeExampleScreen() {
  const navigation = useNavigation<any>();
  const readerRef = useRef<CPDFReaderView | null>(null);
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<OptimizeState>(() => initialOptimizeState());

  const optimize = async () => {
    const reader = readerRef.current;
    if (!reader || state.isOptimizing) return;

    setState(current => ({ ...current, isOptimizing: true, progressPage: null, outputPath: null }));
    let documentName = 'PDF_Document.pdf';
    let sourceSize = 0;
    const outputPath = getOptimizeOutputPath(temporaryDirectory);
    try {
      documentName = await reader._pdfDocument.getFileName();
      try { sourceSize = await getFileSize(await reader._pdfDocument.getDocumentPath()); } catch { sourceSize = 0; }
      const result = await reader._pdfDocument.optimizeSaveAsCopy(outputPath, state.options, state.fontSubset,
        pageIndex => setState(current => ({ ...current, progressPage: pageIndex + 1 })));
      if (result.cancelled) {
        setState(current => ({ ...current, entries: [createOptimizeLogEntry({ status: 'cancelled', documentName, sourceSize, outputSize: 0, detail: `Cancelled after ${result.pagesProcessed} page(s).` }), ...current.entries].slice(0, 12) }));
        return;
      }
      const outputSize = await getFileSize(outputPath);
      if (!result.ok || outputSize === 0) throw new Error('The optimized output file was not created.');

      setState(current => ({ ...current, outputPath, entries: [createOptimizeLogEntry({ status: 'success', documentName, sourceSize, outputSize, detail: `Output: ${outputPath}` }), ...current.entries].slice(0, 12) }));
    } catch (error) {
      const detail = describeError(error);
      setState(current => ({ ...current, entries: [createOptimizeLogEntry({ status: 'error', documentName, sourceSize, outputSize: 0, detail }), ...current.entries].slice(0, 12) }));
      Alert.alert('Document Optimization', detail);
    } finally {
      setState(current => ({ ...current, isOptimizing: false, progressPage: null }));
    }
  };

  const cancel = () => {
    void readerRef.current?._pdfDocument.cancelOptimize();
  };

  const openOutput = async () => {
    if (!state.outputPath) return;
    if (!(await RNFS.exists(state.outputPath))) return Alert.alert('Document Optimization', 'The optimized output file no longer exists.');
    navigation.navigate(EXAMPLE_ROUTES.viewerBasic, { document: state.outputPath });
  };

  return <PDFReaderContext.Provider value={readerRef.current}>
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <AppToolbar title="Document Optimization" subtitle="Compress a PDF into a separate copy. Unsaved changes are discarded." onBackPress={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 16 + insets.bottom }]} keyboardShouldPersistTaps="handled">
          <OptimizeControls options={state.options} fontSubset={state.fontSubset} isOptimizing={state.isOptimizing} progressPage={state.progressPage} canOpenOutput={state.outputPath != null} onOptionsChange={options => setState(current => ({ ...current, options }))} onFontSubsetChange={fontSubset => setState(current => ({ ...current, fontSubset }))} onOptimize={() => void optimize()} onCancel={cancel} onOpenOutput={() => void openOutput()} />
          <OptimizeLogPanel entries={state.entries} />
        </ScrollView>
        <CPDFReaderView ref={readerRef} document={getDefaultDocumentProcessingDocument()} configuration={ComPDFKit.getDefaultConfig({})} style={styles.hiddenReader} />
      </View>
    </SafeAreaView>
  </PDFReaderContext.Provider>;
}

async function getFileSize(path: string): Promise<number> { return Number((await RNFS.stat(path)).size) || 0; }

const styles = StyleSheet.create({ safeArea: { backgroundColor: '#F5F7FA', flex: 1 }, container: { backgroundColor: '#F5F7FA', flex: 1 }, content: { flexGrow: 1, paddingBottom: 16 }, hiddenReader: { height: 1, opacity: 0, position: 'absolute', width: 1 } });
