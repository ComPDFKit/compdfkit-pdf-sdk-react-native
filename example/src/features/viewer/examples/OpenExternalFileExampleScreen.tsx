/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CPDFReaderView, ComPDFKit } from '@compdfkit_pdf_sdk/react_native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { AppToolbar } from '../../../widgets/common/AppToolbar';
import { getDefaultViewerDocument } from '../shared/defaultDocument';

type OpenExternalRoute = RouteProp<
  AppStackParamList,
  'CPDFOpenExternalFileExample'
>;

export default function OpenExternalFileExampleScreen() {
  const pdfReaderRef = useRef<CPDFReaderView>(null);
  const navigation = useNavigation();
  const route = useRoute<OpenExternalRoute>();
  const [document] = useState(route.params?.document ?? getDefaultViewerDocument());

  const handleOpenFile = async () => {
    const nextDocument = await ComPDFKit.pickFile();
    if (!nextDocument) {
      return;
    }

    await pdfReaderRef.current?._pdfDocument.open(nextDocument);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <AppToolbar
          title="Open External File"
          subtitle="Pick a local PDF file and load it into the viewer."
          onBackPress={() => navigation.goBack()}
          rightAccessory={
            <TouchableOpacity onPress={() => void handleOpenFile()} style={styles.openButton}>
              <Text style={styles.openButtonText}>Open File</Text>
            </TouchableOpacity>
          }
        />
        <CPDFReaderView
          ref={pdfReaderRef}
          document={document}
          onIOSClickBackPressed={() => navigation.goBack()}
          configuration={ComPDFKit.getDefaultConfig({})}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFCFF',
  },
  container: {
    flex: 1,
  },
  openButton: {
    borderRadius: 10,
    backgroundColor: '#1460F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  openButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});