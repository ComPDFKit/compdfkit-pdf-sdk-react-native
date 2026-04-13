/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CPDFReaderView, ComPDFKit } from '@compdfkit_pdf_sdk/react_native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { AppToolbar } from '../../../widgets/common/AppToolbar';
import { getDefaultViewerDocument } from '../shared/defaultDocument';

type BasicViewerRoute = RouteProp<AppStackParamList, 'CPDFBasicViewerExample'>;

export default function BasicViewerExampleScreen() {
  const navigation = useNavigation();
  const route = useRoute<BasicViewerRoute>();
  const [document] = useState(route.params?.document ?? getDefaultViewerDocument());

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <AppToolbar
          title="Basic Viewer"
          subtitle="Open a PDF with the default reader configuration."
          onBackPress={() => navigation.goBack()}
        />
        <CPDFReaderView
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
});