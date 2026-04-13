/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { ReactNode, useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PDFReaderContext, { CPDFReaderView, ComPDFKit } from '@compdfkit_pdf_sdk/react_native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { AppToolbar } from '../../../widgets/common/AppToolbar';
import { ToolbarActionMenu } from '../../../widgets/common/ToolbarActionMenu';
import { getDefaultPageDocument } from './defaultDocument';

type PageRouteName =
  | 'CPDFInsertPageExample'
  | 'CPDFDeletePageExample'
  | 'CPDFRotatePageExample'
  | 'CPDFMovePageExample'
  | 'CPDFSplitDocumentExample'
  | 'CPDFPageThumbnailExample';

type PageExampleRoute = RouteProp<AppStackParamList, PageRouteName>;

type ActionButton = {
  key: string;
  label: string;
  onPress: (reader: CPDFReaderView) => Promise<unknown> | unknown;
};

type PageExampleScaffoldProps = {
  title: string;
  subtitle: string;
  actions?: ActionButton[];
  children?: ReactNode;
};

export function PageExampleScaffold({
  title,
  subtitle,
  actions = [],
  children,
}: PageExampleScaffoldProps) {
  const pdfReaderRef = useRef<CPDFReaderView | null>(null);
  const [reader, setReader] = useState<CPDFReaderView | null>(null);
  const navigation = useNavigation<any>();
  const route = useRoute<PageExampleRoute>();
  const [document] = useState(route.params?.document ?? getDefaultPageDocument());
  const handleReaderRef = useCallback((instance: CPDFReaderView | null) => {
    pdfReaderRef.current = instance;
    setReader((prevReader) => (prevReader === instance ? prevReader : instance));
  }, []);

  return (
    <PDFReaderContext.Provider value={reader}>
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
              ref={handleReaderRef}
              document={document}
              onIOSClickBackPressed={() => navigation.goBack()}
              configuration={ComPDFKit.getDefaultConfig({})}
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