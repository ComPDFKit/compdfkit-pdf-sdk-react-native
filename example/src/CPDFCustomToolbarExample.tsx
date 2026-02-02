/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState, useRef } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import {
  CPDFReaderView,
  CPDFToolbarConfig,
  CPDFViewMode,
  ComPDFKit,
} from "@compdfkit_pdf_sdk/react_native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";
import { SafeAreaView } from "react-native-safe-area-context";

type RootStackParamList = {
  CPDFReaderViewExample: { document?: string };
};

type CPDFCustomToolbarExampleRouteProp = RouteProp<
  RootStackParamList,
  "CPDFReaderViewExample"
>;

const CPDFCustomToolbarExampleScreen = () => {
  const pdfReaderRef = useRef<CPDFReaderView>(null);

  const navigation = useNavigation();

  const route = useRoute<CPDFCustomToolbarExampleRouteProp>();

  const [samplePDF] = useState(
    route.params?.document ||
      (Platform.OS === "android"
        ? "file:///android_asset/PDF_Document.pdf"
        : "PDF_Document.pdf")
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const renderToolbar = () => {
    return (
      <View style={styles.toolbar}>
        <HeaderBackButton onPress={handleBack} />
        <Text style={styles.toolbarTitle}>Custom Toolbar Example</Text>
      </View>
    );
  };

  const customToolbarConfig: CPDFToolbarConfig = {
    customToolbarLeftItems: [
      {
        action: "back",
        icon: "ic_test_back",
      },
      {
        action: "custom",
        identifier: "custom_editor",
        icon: "ic_test_edit",
      },
    ],
    customToolbarRightItems: [
      {
        action: "bota",
        icon: "ic_test_book",
      },
      {
        action: "custom",
        icon: "ic_test_search",
        identifier: "custom_text_search",
      },
      {
        action: "menu",
        icon: "ic_test_more",
      },
    ],
    customMoreMenuItems: [
      {
        action: "viewSettings",
        title: "Custom View Settings",
        icon: "ic_test_setting",
      },
      {
        action: "custom",
        title: "Custom Share",
        icon: "ic_test_share",
        identifier: "custom_share",
      },
      {
        action: "bota",
        title: "Custom BOTA",
      },
    ],
  };

  const onCustomToolbarItemTapped = async (identifier: string) => {
    console.log("Custom toolbar item tapped: " + identifier);
    switch (identifier) {
      case "custom_editor":
        // Handle custom editor action
        const currentMode = await pdfReaderRef.current?.getPreviewMode();
        await pdfReaderRef.current?.setPreviewMode(currentMode === CPDFViewMode.CONTENT_EDITOR ? CPDFViewMode.VIEWER : CPDFViewMode.CONTENT_EDITOR);
        break;
      case "custom_text_search":
        // Handle custom text search action
        await pdfReaderRef.current?.showSearchTextView();
        break;
        case "custom_share":
        // Handle custom share action
        const filePath = await pdfReaderRef.current?._pdfDocument.getDocumentPath();
        if (filePath) {
          console.log("Document path for sharing: " + filePath);
        }
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFCFF" }}>
      <View style={{ flex: 1 }}>
        {renderToolbar()}
        <CPDFReaderView
          ref={pdfReaderRef}
          document={samplePDF}
          configuration={ComPDFKit.getDefaultConfig({
            toolbarConfig: customToolbarConfig,
          })}
          onIOSClickBackPressed={handleBack}
          onCustomToolbarItemTapped={onCustomToolbarItemTapped}
        />
      </View>
    </SafeAreaView>
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

export default CPDFCustomToolbarExampleScreen;
