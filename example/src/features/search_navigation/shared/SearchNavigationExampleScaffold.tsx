/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PDFReaderContext, { CPDFReaderView, ComPDFKit } from '@compdfkit_pdf_sdk/react_native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { AppToolbar } from '../../../widgets/common/AppToolbar';
import { ToolbarActionMenu } from '../../../widgets/common/ToolbarActionMenu';
import { getDefaultSearchDocument } from './defaultDocument';

type SearchNavigationRouteName =
  | 'CPDFShowHideSearchExample'
  | 'CPDFTextSearchApiExample'
  | 'CPDFOutlineNavigationExample'
  | 'CPDFBookmarkOperationsExample'
  | 'CPDFPageNavigationExample';

type SearchNavigationRoute = RouteProp<AppStackParamList, SearchNavigationRouteName>;

type ActionButton = {
  key: string;
  label: string;
  onPress: (reader: CPDFReaderView) => Promise<unknown> | unknown;
};

type SearchNavigationExampleScaffoldProps = {
  title: string;
  subtitle: string;
  actions?: ActionButton[];
  toolbarAccessory?: ReactNode;
  belowToolbarContent?: ReactNode;
  onReaderReady?: (reader: CPDFReaderView) => void;
  children?: ReactNode;
};

export function SearchNavigationExampleScaffold({
  title,
  subtitle,
  actions = [],
  toolbarAccessory,
  belowToolbarContent,
  onReaderReady,
  children,
}: SearchNavigationExampleScaffoldProps) {
  const pdfReaderRef = useRef<CPDFReaderView | null>(null);
  const [reader, setReader] = useState<CPDFReaderView | null>(null);
  const navigation = useNavigation<any>();
  const route = useRoute<SearchNavigationRoute>();
  const [document] = useState(route.params?.document ?? getDefaultSearchDocument());
  const handleReaderRef = useCallback((instance: CPDFReaderView | null) => {
    pdfReaderRef.current = instance;
    setReader((prevReader) => (prevReader === instance ? prevReader : instance));
  }, []);

  useEffect(() => {
    if (reader && onReaderReady) {
      onReaderReady(reader);
    }
  }, [onReaderReady, reader]);

  const toolbarRightAccessory =
    actions.length > 0 || toolbarAccessory ? (
      <View style={styles.toolbarActions}>
        {toolbarAccessory}
        {actions.length > 0 ? (
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
        ) : null}
      </View>
    ) : undefined;

  return (
    <PDFReaderContext.Provider value={reader}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <AppToolbar
            title={title}
            subtitle={subtitle}
            onBackPress={() => navigation.goBack()}
            rightAccessory={toolbarRightAccessory}
          />
          {belowToolbarContent ? (
            <View style={styles.belowToolbarContent}>{belowToolbarContent}</View>
          ) : null}

          <View style={styles.viewerWrap}>
            <CPDFReaderView
              ref={handleReaderRef}
              document={document}
              configuration={ComPDFKit.getDefaultConfig({
                toolbarConfig: {
                  mainToolbarVisible: false,
                },
              })}
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
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  belowToolbarContent: {
    backgroundColor: '#FAFCFF',
  },
});