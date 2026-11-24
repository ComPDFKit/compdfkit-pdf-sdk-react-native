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
  CPDFAnnotationType,
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
    ? 'file:///android_asset/annotation_interception_test.pdf'
    : 'annotation_interception_test.pdf';

const annotationNames: Partial<Record<CPDFAnnotationType, string>> = {
  line: 'Line or arrow',
  arrow: 'Line or arrow',
  stamp: 'Stamp, picture, or signature',
  pictures: 'Stamp, picture, or signature',
  signature: 'Stamp, picture, or signature',
  freetext: 'Free text',
  redact: 'Redaction',
};

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
    if (!pdfReaderRef.current) {
      return;
    }
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
          if (/^mailto:/i.test(uri)) {
            Alert.alert('Email Link', uri.slice('mailto:'.length));
          } else {
            Alert.alert('Web Link', uri);
          }
          break;
        }
        case 'goTo': {
          const goToAction = action as CPDFGoToAction;
          const reader = pdfReaderRef.current;
          Alert.alert('Go To Page', `Jump to page ${goToAction.pageIndex + 1}`, [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Go',
              onPress: () => {
                if (reader && pdfReaderRef.current === reader) {
                  reader.setDisplayPageIndex(goToAction.pageIndex).catch(
                    (error) => Logger.error('Could not jump to link target:', error),
                  );
                }
              },
            },
          ]);
          break;
        }
        default:
          Alert.alert('Link Annotation', 'No supported link action.');
          break;
      }
      return;
    }
    const name = annotationNames[annotation.type] ??
      annotation.type.charAt(0).toUpperCase() + annotation.type.slice(1);
    Alert.alert(`${name} Annotation`, `Action intercepted on page ${annotation.page + 1}.`);
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
                interceptAllAnnotationActions: true,
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
