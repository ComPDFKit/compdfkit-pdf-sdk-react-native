/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

// React & React Native
import React, { useState, useRef, useEffect } from "react";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Navigation
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";


// ComPDFKit - Core
import PDFReaderContext, {
  CPDFReaderView,
  ComPDFKit,
  CPDFViewMode,
  CPDFAnnotation,
  CPDFNoteAnnotation,
  CPDFLinkAnnotation,
  CPDFGoToAction,
  CPDFUriAction,
} from "@compdfkit_pdf_sdk/react_native";


// Types
type RootStackParamList = {
  CPDFReaderViewExample: { document?: string };
};

type CPDFReaderViewExampleScreenRouteProp = RouteProp<
  RootStackParamList,
  "CPDFReaderViewExample"
>;


const DEFAULT_DOCUMENT = Platform.OS === "android"
  ? "file:///android_asset/PDF_Document.pdf"
  : "PDF_Document.pdf";


/**
 * Main component for PDF Annotations Example
 */
const CPDFInterceptAnnotationActionExampleScreen = () => {
  // Refs & State
  const pdfReaderRef = useRef<CPDFReaderView>(null);
  const [pdfReader, setPdfReader] = useState<CPDFReaderView | null>(null);
  
  const navigation = useNavigation();
  const route = useRoute<CPDFReaderViewExampleScreenRouteProp>();
  
  const [samplePDF] = useState(route.params?.document || DEFAULT_DOCUMENT);

  useEffect(() => {
    if (pdfReaderRef.current) {
      setPdfReader(pdfReaderRef.current);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      navigation.dispatch(e.data.action);
    });
    return unsubscribe;
  }, [navigation]);

  const handleBack = async () => {
    navigation.goBack();
  };

  const renderToolbar = () => {
    return (
      <View style={styles.toolbar}>
        <HeaderBackButton onPress={handleBack} />
        <Text style={styles.toolbarTitle}>Intercept Annotations Action</Text>
      </View>
    );
  };

  const onInterceptAnnotationActionCallback = (annotation : CPDFAnnotation) => {
    if(annotation instanceof CPDFNoteAnnotation){
      const content = annotation.content;
      Alert.alert('Note Annotation', content || 'No content');
    } else if (annotation instanceof CPDFLinkAnnotation){
      const action = annotation.action;
      switch (action?.actionType) {
        case 'uri':
          const uriAction = action as CPDFUriAction;
          const uri = uriAction.uri;
          if (uri.startsWith('mailto:')) {
            const email = uri.replace('mailto:', '');
            Alert.alert('Email Link', email);
          } else {
            Alert.alert('Web Link', uri);
          }
          break;
        case 'goTo':
          const goToAction = action as CPDFGoToAction;
          const pageNumber = goToAction.pageIndex + 1;
          Alert.alert('Go To Page', `Jump to page ${pageNumber}`);
          break;
        default:
          break;
      }  
    }
  };

  return (
    <PDFReaderContext.Provider value={pdfReader}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFCFF" }}>
        <View style={{ flex: 1 }}>
          {renderToolbar()}
          <CPDFReaderView
            ref={pdfReaderRef}
            document={samplePDF}
            onIOSClickBackPressed={() => {
              console.log("onIOSClickBackPressed");
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
            onInterceptAnnotationActionCallback={onInterceptAnnotationActionCallback}
          />
        </View>
      </SafeAreaView>
    </PDFReaderContext.Provider>
  );
};

const styles = StyleSheet.create({
  toolbar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FAFCFF",
    paddingHorizontal: 4,
  },
  toolbarButton: {
    padding: 8,
  },
  toolbarTitle: {
    flex: 1,
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginStart: 8,
  },
  menuOption: {
    padding: 8,
    fontSize: 14,
    color: "black",
  },
});

export default CPDFInterceptAnnotationActionExampleScreen;
