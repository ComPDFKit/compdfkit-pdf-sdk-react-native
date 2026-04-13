/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { ReactNode, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PDFReaderContext, { CPDFReaderView, ComPDFKit } from '@compdfkit_pdf_sdk/react_native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { AppToolbar } from '../../../widgets/common/AppToolbar';
import { ToolbarActionMenu } from '../../../widgets/common/ToolbarActionMenu';
import { getDefaultSecurityDocument } from './defaultDocument';

type SecurityRouteName =
  | 'CPDFSetPasswordExample'
  | 'CPDFRemovePasswordExample'
  | 'CPDFAddWatermarkExample'
  | 'CPDFDocumentPermissionsExample'
  | 'CPDFDigitalSignatureExample';

type SecurityRoute = RouteProp<AppStackParamList, SecurityRouteName>;

type ActionButton = {
  key: string;
  label: string;
  onPress: (reader: CPDFReaderView) => Promise<unknown> | unknown;
};

type SecurityExampleScaffoldProps = {
  title: string;
  subtitle: string;
  actions?: ActionButton[];
  children?: ReactNode;
};

export function SecurityExampleScaffold({
  title,
  subtitle,
  actions = [],
  children,
}: SecurityExampleScaffoldProps) {
  const pdfReaderRef = useRef<CPDFReaderView | null>(null);
  const navigation = useNavigation<any>();
  const route = useRoute<SecurityRoute>();
  const [document] = useState(route.params?.document ?? getDefaultSecurityDocument());

  return (
    <PDFReaderContext.Provider value={pdfReaderRef.current}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <AppToolbar
            title={title}
            subtitle={subtitle}
            onBackPress={() => navigation.goBack()}
            rightAccessory={
              actions.length > 0 ? (
                <ToolbarActionMenu
                  actions={actions.map((action) => ({
                    key: action.key,
                    label: action.label,
                    onPress: async () => {
                      if (pdfReaderRef.current) {
                        await action.onPress(pdfReaderRef.current);
                      }
                    },
                  }))}
                />
              ) : undefined
            }
          />

          <View style={styles.viewerWrap}>
            <CPDFReaderView
              ref={pdfReaderRef}
              document={document}
              configuration={ComPDFKit.getDefaultConfig({})}
              onIOSClickBackPressed={() => navigation.goBack()}
            />
            {children}
          </View>
        </View>
      </SafeAreaView>
    </PDFReaderContext.Provider>
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
  viewerWrap: {
    flex: 1,
  },
});