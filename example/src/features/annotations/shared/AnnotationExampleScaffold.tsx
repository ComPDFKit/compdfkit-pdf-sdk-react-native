/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import PDFReaderContext, { CPDFReaderView } from '@compdfkit_pdf_sdk/react_native';

import { useAppTheme } from '../../../theme/appTheme';
import { AppToolbar } from '../../../widgets/common/AppToolbar';
import { ToolbarActionMenu } from '../../../widgets/common/ToolbarActionMenu';
import { Logger } from '../../../util/logger';

type ActionTone = 'primary' | 'secondary' | 'danger';

export type AnnotationExampleAction = {
  key: string;
  label: string;
  onPress: (reader: CPDFReaderView) => void | Promise<void>;
  tone?: ActionTone;
};

type AnnotationExampleScaffoldProps = {
  title: string;
  subtitle: string;
  document: string;
  readerRef: React.MutableRefObject<CPDFReaderView | null>;
  configuration: any;
  actions?: ReadonlyArray<AnnotationExampleAction>;
  showAnnotationToolbar?: boolean;
  annotationToolbar?: React.ReactNode;
  overlay?: React.ReactNode;
  onBackPress: () => void;
};

export function AnnotationExampleScaffold({
  title,
  subtitle,
  document,
  readerRef,
  configuration,
  actions = [],
  showAnnotationToolbar = false,
  annotationToolbar,
  overlay,
  onBackPress,
}: AnnotationExampleScaffoldProps) {
  const navigation = useNavigation();
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);
  const [pdfReader, setPdfReader] = useState<CPDFReaderView | null>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      event.preventDefault();

      Promise.resolve(readerRef.current?.save())
        .catch((error) => {
          Logger.log('Annotations example save before exit failed:', error);
        })
        .finally(() => {
          navigation.dispatch(event.data.action);
        });
    });

    return unsubscribe;
  }, [navigation, readerRef]);

  return (
    <PDFReaderContext.Provider value={pdfReader}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <AppToolbar
            title={title}
            subtitle={subtitle}
            onBackPress={onBackPress}
            rightAccessory={
              actions.length > 0 ? (
                <ToolbarActionMenu
                  actions={actions.map((action) => ({
                    key: action.key,
                    label: action.label,
                    tone: action.tone,
                    onPress: async () => {
                      if (readerRef.current) {
                        await action.onPress(readerRef.current);
                      }
                    },
                  }))}
                />
              ) : undefined
            }
          />

          <CPDFReaderView
            ref={(instance) => {
              readerRef.current = instance;
              setPdfReader(instance);
            }}
            document={document}
            configuration={configuration}
            onIOSClickBackPressed={onBackPress}
          />

          {showAnnotationToolbar ? annotationToolbar : null}
          {overlay}
        </View>
      </SafeAreaView>
    </PDFReaderContext.Provider>
  );
}

function createStyles(appTheme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: appTheme.colors.surface,
    },
    container: {
      flex: 1,
      backgroundColor: appTheme.colors.surface,
    },
  });
}