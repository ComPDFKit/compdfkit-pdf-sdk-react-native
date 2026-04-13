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
  CPDFToolbarConfig,
  CPDFViewMode,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';
import { HeaderBackButton } from '@react-navigation/elements';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { Logger } from '../../../util/logger';

type CustomToolbarRoute = RouteProp<
  AppStackParamList,
  'CPDFCustomToolbarExample'
>;

const customToolbarConfig: CPDFToolbarConfig = {
  customToolbarLeftItems: [
    {
      action: 'back',
      icon: 'ic_test_back',
    },
    {
      action: 'custom',
      identifier: 'custom_editor',
      icon: 'ic_test_edit',
    },
  ],
  customToolbarRightItems: [
    {
      action: 'bota',
      icon: 'ic_test_book',
    },
    {
      action: 'custom',
      icon: 'ic_test_search',
      identifier: 'custom_text_search',
    },
    {
      action: 'menu',
      icon: 'ic_test_more',
    },
  ],
  customMoreMenuItems: [
    {
      action: 'viewSettings',
      title: 'Custom View Settings',
      icon: 'ic_test_setting',
    },
    {
      action: 'custom',
      title: 'Custom Share',
      icon: 'ic_test_share',
      identifier: 'custom_share',
    },
    {
      action: 'bota',
      title: 'Custom BOTA',
    },
  ],
};

export default function CustomToolbarExampleScreen() {
  const pdfReaderRef = useRef<CPDFReaderView>(null);
  const navigation = useNavigation();
  const route = useRoute<CustomToolbarRoute>();
  const [samplePDF] = useState(
    route.params?.document ||
      (Platform.OS === 'android'
        ? 'file:///android_asset/PDF_Document.pdf'
        : 'PDF_Document.pdf'),
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const onCustomToolbarItemTapped = async (identifier: string) => {
    Logger.log('Custom toolbar item tapped: ' + identifier);
    switch (identifier) {
      case 'custom_editor': {
        const currentMode = await pdfReaderRef.current?.getPreviewMode();
        await pdfReaderRef.current?.setPreviewMode(
          currentMode === CPDFViewMode.CONTENT_EDITOR
            ? CPDFViewMode.VIEWER
            : CPDFViewMode.CONTENT_EDITOR,
        );
        break;
      }
      case 'custom_text_search':
        await pdfReaderRef.current?.showSearchTextView();
        break;
      case 'custom_share': {
        const filePath = await pdfReaderRef.current?._pdfDocument.getDocumentPath();
        if (filePath) {
          Logger.log('Document path for sharing: ' + filePath);
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <HeaderBackButton onPress={handleBack} />
          <Text style={styles.toolbarTitle}>Custom Toolbar Example</Text>
        </View>

        <CPDFReaderView
          ref={pdfReaderRef}
          document={samplePDF}
          configuration={ComPDFKit.getDefaultConfig({
            toolbarConfig: customToolbarConfig,
          })}
          onIOSClickBackPressed={handleBack}
          onCustomToolbarItemTapped={onCustomToolbarItemTapped}
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