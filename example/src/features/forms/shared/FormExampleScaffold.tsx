/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PDFReaderContext, {
  CPDFReaderView,
  CPDFViewMode,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { AppToolbar } from '../../../widgets/common/AppToolbar';
import { ToolbarActionMenu } from '../../../widgets/common/ToolbarActionMenu';
import { getDefaultFormDocument } from './defaultDocument';

type FormRouteName =
  | 'CPDFCreateFormFieldsExample'
  | 'CPDFFillFormExample'
  | 'CPDFEditFormDefaultStyleExample'
  | 'CPDFFormDataImportExportExample'
  | 'CPDFFormFieldOperationsExample'
  | 'CPDFCustomFormCreationExample'
  | 'CPDFApiFormCreationModeExample'
  | 'CPDFFormInterceptActionExample';

type FormExampleRoute = RouteProp<AppStackParamList, FormRouteName>;

type ActionButton = {
  key: string;
  label: string;
  onPress: (reader: CPDFReaderView) => Promise<unknown> | unknown;
};

type FormExampleScaffoldProps = {
  title: string;
  subtitle: string;
  actions?: ActionButton[];
  configuration?: string;
  bottomAccessory?: ReactNode;
  onViewCreated?: (reader: CPDFReaderView) => void;
  children?: (context: {
    pdfReader: CPDFReaderView | null;
    pdfReaderRef: React.RefObject<CPDFReaderView | null>;
  }) => ReactNode;
};

export function FormExampleScaffold({
  title,
  subtitle,
  actions = [],
  configuration,
  bottomAccessory,
  onViewCreated,
  children,
}: FormExampleScaffoldProps) {
  const pdfReaderRef = useRef<CPDFReaderView>(null);
  const [pdfReader, setPdfReader] = useState<CPDFReaderView | null>(null);
  const navigation = useNavigation<any>();
  const route = useRoute<FormExampleRoute>();
  const [document] = useState(route.params?.document ?? getDefaultFormDocument());

  useEffect(() => {
    if (pdfReaderRef.current) {
      setPdfReader(pdfReaderRef.current);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event: any) => {
      event.preventDefault();
      const save = async () => {
        if (pdfReaderRef.current) {
          await pdfReaderRef.current.save();
        }
      };
      void save().finally(() => {
        navigation.dispatch(event.data.action);
      });
    });

    return unsubscribe;
  }, [navigation]);

  const resolvedConfiguration =
    configuration ??
    ComPDFKit.getDefaultConfig({
      modeConfig: {
        initialViewMode: CPDFViewMode.FORMS,
      },
    });

  return (
    <PDFReaderContext.Provider value={pdfReader}>
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
              onIOSClickBackPressed={() => navigation.goBack()}
              onViewCreated={() => {
                if (pdfReaderRef.current) {
                  setPdfReader(pdfReaderRef.current);
                  onViewCreated?.(pdfReaderRef.current);
                }
              }}
              configuration={resolvedConfiguration}
            />
            {children?.({ pdfReader, pdfReaderRef })}
          </View>

          {bottomAccessory}
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