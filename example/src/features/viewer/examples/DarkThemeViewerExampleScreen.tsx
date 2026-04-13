/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CPDFReaderView,
  CPDFThemes,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { AppToolbar } from '../../../widgets/common/AppToolbar';
import { getDefaultViewerDocument } from '../shared/defaultDocument';

type DarkThemeViewerRoute = RouteProp<
  AppStackParamList,
  'CPDFDarkThemeViewerExample'
>;

export default function DarkThemeViewerExampleScreen() {
  const pdfReaderRef = useRef<CPDFReaderView>(null);
  const navigation = useNavigation();
  const route = useRoute<DarkThemeViewerRoute>();
  const [document] = useState(route.params?.document ?? getDefaultViewerDocument());


  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <AppToolbar
          title="Dark Theme Viewer"
          subtitle="Apply the dark reading theme after the viewer is created."
          onBackPress={() => navigation.goBack()}
        />
        <CPDFReaderView
          ref={pdfReaderRef}
          document={document}
          onIOSClickBackPressed={() => navigation.goBack()}
          configuration={ComPDFKit.getDefaultConfig({
            readerViewConfig: {
              themes: CPDFThemes.DARK,
            },
            global:{
                themeMode:'dark'
            }
          })}
          onViewCreated={() => {

          }}
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
});