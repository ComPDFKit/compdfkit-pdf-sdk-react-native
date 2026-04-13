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
import PDFReaderContext, {
  CPDFReaderView,
  CPDFViewMode,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { AppToolbar } from '../../../widgets/common/AppToolbar';
import { ToolbarActionMenu } from '../../../widgets/common/ToolbarActionMenu';
import { getDefaultContentEditorDocument } from './defaultDocument';

type ContentEditorRouteName =
  | 'CPDFTextEditingExample'
  | 'CPDFImageEditingExample'
  | 'CPDFContentEditingModeExample'
  | 'CPDFEditorHistoryExample';

type ContentEditorRoute = RouteProp<AppStackParamList, ContentEditorRouteName>;

type ActionButton = {
  key: string;
  label: string;
  onPress: (reader: CPDFReaderView) => Promise<unknown> | unknown;
};

type ContentEditorExampleScaffoldProps = {
  title: string;
  subtitle: string;
  actions?: ActionButton[];
  onReaderReady?: (reader: CPDFReaderView) => void;
  bottomAccessory?: (reader: CPDFReaderView) => ReactNode;
  children?: ReactNode;
};

export function ContentEditorExampleScaffold({
  title,
  subtitle,
  actions = [],
  onReaderReady,
  bottomAccessory,
  children,
}: ContentEditorExampleScaffoldProps) {
  const pdfReaderRef = useRef<CPDFReaderView | null>(null);
  const [readyReader, setReadyReader] = useState<CPDFReaderView | null>(null);
  const navigation = useNavigation<any>();
  const route = useRoute<ContentEditorRoute>();
  const [document] = useState(
    route.params?.document ?? getDefaultContentEditorDocument(),
  );

  const handleReaderRef = useCallback((instance: CPDFReaderView | null) => {
    pdfReaderRef.current = instance;

    if (!instance) {
      setReadyReader(null);
    }
  }, []);

  const handleReaderReady = useCallback(() => {
    const reader = pdfReaderRef.current;

    if (!reader || reader === readyReader) {
      return;
    }

    setReadyReader(reader);
    onReaderReady?.(reader);
  }, [onReaderReady, readyReader]);

  return (
    <PDFReaderContext.Provider value={readyReader}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
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
                      if (readyReader) {
                        await action.onPress(readyReader);
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
              onViewCreated={handleReaderReady}
              onIOSClickBackPressed={() => navigation.goBack()}
              configuration={ComPDFKit.getDefaultConfig({
                modeConfig: {
                  initialViewMode: CPDFViewMode.CONTENT_EDITOR,
                },
                readerViewConfig: {
                  enableCreateEditTextInput: true,
                  enableCreateImagePickerDialog: true,
                },
              })}
            />
            {children}
          </View>

          {readyReader && bottomAccessory ? bottomAccessory(readyReader) : null}
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