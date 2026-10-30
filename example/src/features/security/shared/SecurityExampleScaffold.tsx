/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { ReactNode, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import PDFReaderContext, { CPDFReaderView, ComPDFKit } from '@compdfkit_pdf_sdk/react_native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { AppToolbar } from '../../../widgets/common/AppToolbar';
import { ToolbarActionMenu } from '../../../widgets/common/ToolbarActionMenu';
import { PlatformNotice } from '../../../widgets/common/PlatformNotice';
import { describeError } from '../../../util/exampleError';
import { getDefaultSecurityDocument } from './defaultDocument';

type SecurityRouteName =
  | 'CPDFBatesExample'
  | 'CPDFBackgroundExample'
  | 'CPDFRedactionExample'
  | 'CPDFCertificatesExample'
  | 'CPDFSignaturesExample'
  | 'CPDFSetPasswordExample'
  | 'CPDFRemovePasswordExample'
  | 'CPDFWatermarkOperationsExample'
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
  /** Platform differences shown in a notice bar above the reader. */
  platformNotice?: { ios?: string; android?: string };
  beforeViewer?: ReactNode;
  children?: ReactNode;
};

export function SecurityExampleScaffold({
  title,
  subtitle,
  actions = [],
  platformNotice,
  beforeViewer,
  children,
}: SecurityExampleScaffoldProps) {
  const pdfReaderRef = useRef<CPDFReaderView | null>(null);
  const navigation = useNavigation<any>();
  const route = useRoute<SecurityRoute>();
  const [document] = useState(route.params?.document ?? getDefaultSecurityDocument());
  const [busyLabel, setBusyLabel] = useState<string | null>(null);

  // Runs one action at a time with a visible busy state; errors not handled by the
  // action itself are shown with their native code.
  const runAction = async (action: ActionButton) => {
    const reader = pdfReaderRef.current;
    if (!reader || busyLabel) {
      return;
    }
    setBusyLabel(action.label);
    try {
      await action.onPress(reader);
    } catch (error) {
      Alert.alert(title, describeError(error));
    } finally {
      setBusyLabel(null);
    }
  };

  return (
    <PDFReaderContext.Provider value={pdfReaderRef.current}>
      <SafeAreaView style={styles.safeArea}>
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
                    onPress: () => runAction(action),
                  }))}
                />
              ) : undefined
            }
          />

          {platformNotice ? <PlatformNotice {...platformNotice} /> : null}
          {beforeViewer}
          <View style={styles.viewerWrap}>
            <CPDFReaderView
              ref={pdfReaderRef}
              document={document}
              configuration={ComPDFKit.getDefaultConfig({})}
              onIOSClickBackPressed={() => navigation.goBack()}
            />
            {children}
            {busyLabel ? (
              <View style={styles.busyOverlay} pointerEvents="auto">
                <ActivityIndicator color="#FFFFFF" />
                <Text style={styles.busyText}>{busyLabel}...</Text>
              </View>
            ) : null}
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
  busyOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    gap: 10,
    justifyContent: 'center',
  },
  busyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
