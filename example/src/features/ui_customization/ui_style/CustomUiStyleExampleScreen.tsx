/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import {
  CPDFReaderView,
  CPDFUIStyle,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';
import { HeaderBackButton } from '@react-navigation/elements';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppStackParamList } from '../../../app/navigation/routes';

type CustomUiStyleRoute = RouteProp<
  AppStackParamList,
  'CPDFCustomUiStyleExample'
>;

const uiStyleConfig: CPDFUIStyle = {
  bookmarkIcon: 'ic_test_bookmark',
  icons: {
    selectTextLeftIcon: 'ic_test_cursor_left',
    selectTextRightIcon: 'ic_test_cursor_right',
    selectTextIcon: 'ic_test_cursor',
    rotationAnnotationIcon: 'ic_test_rotate',
  },
  selectTextColor: '#E7473BBC',
  displayPageRect: {
    fillColor: '#4D1460F3',
    borderColor: '#FF6499FF',
    borderWidth: 2,
    borderDashPattern: [10, 0],
  },
  screenshot: {
    fillColor: '#00000000',
    borderColor: '#FF6499FF',
    outsideColor: '#00000000',
    borderWidth: 5,
    borderDashPattern: [20, 10],
  },
  formPreview: {
    style: 'fill',
    color: '#48C2FF6C',
  },
  defaultBorderStyle: {
    borderColor: '#50507F',
    borderWidth: 5,
    borderDashPattern: [20, 10],
  },
  focusBorderStyle: {
    borderColor: '#FC534E',
    borderWidth: 5,
    borderDashPattern: [20, 10],
    nodeColor: '#FC534E',
  },
  cropImageStyle: {
    borderColor: '#FF6499FF',
    borderWidth: 2,
    borderDashPattern: [20, 10],
  },
};

export default function CustomUiStyleExampleScreen() {
  const pdfReaderRef = useRef<CPDFReaderView>(null);
  const navigation = useNavigation();
  const route = useRoute<CustomUiStyleRoute>();
  const [samplePDF] = useState(
    route.params?.document ||
      (Platform.OS === 'android'
        ? 'file:///android_asset/PDF_Document.pdf'
        : 'PDF_Document.pdf'),
  );

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <HeaderBackButton onPress={handleBack} />
          <Text style={styles.toolbarTitle}>Custom UI Style Example</Text>
        </View>

        <CPDFReaderView
          ref={pdfReaderRef}
          document={samplePDF}
          configuration={ComPDFKit.getDefaultConfig({
            modeConfig: {
              initialViewMode: 'annotations',
            },
            readerViewConfig: {
              uiStyle: uiStyleConfig,
            },
          })}
          onIOSClickBackPressed={handleBack}
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
  toolbar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FAFCFF',
    paddingHorizontal: 4,
  },
  toolbarTitle: {
    flex: 1,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginStart: 8,
  },
});