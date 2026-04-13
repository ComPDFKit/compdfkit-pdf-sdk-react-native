/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBackButton } from '@react-navigation/elements';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import PDFReaderContext, {
  CPDFAnnotation,
  CPDFGoToAction,
  CPDFLinkAnnotation,
  CPDFNoteAnnotation,
  CPDFReaderView,
  CPDFUriAction,
  CPDFViewMode,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { Logger } from '../../../util/logger';

type InterceptAnnotationRoute = RouteProp<
  AppStackParamList,
  'CPDFInterceptAnnotationActionExample'
>;

const defaultDocument =
  Platform.OS === 'android'
    ? 'file:///android_asset/PDF_Document.pdf'
    : 'PDF_Document.pdf';

export default function InterceptAnnotationActionExampleScreen() {
  const pdfReaderRef = useRef<CPDFReaderView>(null);
  const [pdfReader, setPdfReader] = useState<CPDFReaderView | null>(null);
  const navigation = useNavigation();
  const route = useRoute<InterceptAnnotationRoute>();
  const [samplePDF] = useState(route.params?.document || defaultDocument);

  useEffect(() => {
    if (pdfReaderRef.current) {
      setPdfReader(pdfReaderRef.current);
    }
  }, []);

  const handleBack = async () => {
    navigation.goBack();
  };

  const onInterceptAnnotationActionCallback = (annotation: CPDFAnnotation) => {
    if (annotation instanceof CPDFNoteAnnotation) {
      Alert.alert('Note Annotation', annotation.content || 'No content');
      return;
    }

    if (annotation instanceof CPDFLinkAnnotation) {
      const action = annotation.action;
      switch (action?.actionType) {
        case 'uri': {
          const uriAction = action as CPDFUriAction;
          const uri = uriAction.uri;
          if (uri.startsWith('mailto:')) {
            Alert.alert('Email Link', uri.replace('mailto:', ''));
          } else {
            Alert.alert('Web Link', uri);
          }
          break;
        }
        case 'goTo': {
          const goToAction = action as CPDFGoToAction;
          Alert.alert('Go To Page', `Jump to page ${goToAction.pageIndex + 1}`);
          break;
        }
        default:
          break;
      }
    }
  };

  return (
    <PDFReaderContext.Provider value={pdfReader}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <HeaderBackButton onPress={handleBack} />
            <Text style={styles.toolbarTitle}>Intercept Annotations Action</Text>
          </View>

          <CPDFReaderView
            ref={pdfReaderRef}
            document={samplePDF}
            onIOSClickBackPressed={() => {
              Logger.log('onIOSClickBackPressed');
              navigation.goBack();
            }}
            configuration={ComPDFKit.getDefaultConfig({
              modeConfig: {
                initialViewMode: CPDFViewMode.ANNOTATIONS,
              },
              annotationsConfig: {
                interceptLinkAction: true,
                interceptNoteAction: true,
              },
            })}
            onInterceptAnnotationActionCallback={
              onInterceptAnnotationActionCallback
            }
          />
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