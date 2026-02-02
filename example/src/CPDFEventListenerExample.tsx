/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState, useRef } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CPDFAnnotation,
  CPDFAnnotationType,
  CPDFEditArea,
  CPDFEvent,
  CPDFReaderView,
  CPDFWidget,
  ComPDFKit,
} from "@compdfkit_pdf_sdk/react_native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

type RootStackParamList = {
  CPDFEventListenerExample: { document?: string };
};

type CPDFEventListenerExampleRouteProp = RouteProp<
  RootStackParamList,
  "CPDFEventListenerExample"
>;

const CPDFEventListenerExampleScreen = () => {
  const pdfReaderRef = useRef<CPDFReaderView>(null);

  const [selectAnnotation, setSelectAnnotation] =
    useState<CPDFAnnotation | null>(null);

  const [selectWidget, setSelectWidget] = useState<CPDFWidget | null>(null);

  const [selectEditArea, setSelectEditArea] = useState<CPDFEditArea | null>(
    null
  );

  const navigation = useNavigation();

  const route = useRoute<CPDFEventListenerExampleRouteProp>();

  const [samplePDF] = useState(
    route.params?.document ||
      (Platform.OS === "android"
        ? "file:///android_asset/PDF_Document.pdf"
        : "PDF_Document.pdf")
  );

  const handleBack = () => {
    navigation.goBack();
  };
  const menuOptions = ["Show Default Annotation Style", "Remove Edit Area"];

  const handleMenuItemPress = async (action: string) => {
    switch (action) {
      case "Show Default Annotation Style":
        await pdfReaderRef.current?.showDefaultAnnotationPropertiesView(
          CPDFAnnotationType.NOTE
        );
        break;
      case "Remove Edit Area":
        if(selectEditArea){
          await pdfReaderRef.current?._pdfDocument.removeEditArea(selectEditArea);
          setSelectEditArea(null);
        }
        break;
      default:
        break;
    }
  };

  const renderToolbar = () => {
    return (
      <View style={styles.toolbar}>
        <HeaderBackButton onPress={handleBack} />
        <Text style={styles.toolbarTitle}>Custom Toolbar Example</Text>

        <View style={{ flexDirection: "row" }}>
          {selectAnnotation != null ||
          selectWidget != null ||
          selectEditArea != null ? (
            <TouchableOpacity
              onPress={async () => {
                if (selectAnnotation) {
                  await pdfReaderRef.current?.showAnnotationPropertiesView(
                    selectAnnotation
                  );
                } else if (selectWidget) {
                  await pdfReaderRef.current?.showWidgetPropertiesView(
                    selectWidget
                  );
                } else if (selectEditArea) {
                  await pdfReaderRef.current?.showEditAreaPropertiesView(
                    selectEditArea
                  );
                }
              }}
            >
              <Image
                source={require("../assets/ic_setting.png")}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: "black",
                  marginRight: 8,
                }}
              />
            </TouchableOpacity>
          ) : null}

          <Menu>
            <MenuTrigger>
              <Image
                source={require("../assets/more.png")}
                style={{ width: 24, height: 24, marginEnd: 8 }}
              />
            </MenuTrigger>

            <MenuOptions>
              {menuOptions.map((option, index) => (
                <MenuOption
                  key={index}
                  onSelect={() => handleMenuItemPress(option)}
                >
                  <Text style={styles.menuOption}>{option}</Text>
                </MenuOption>
              ))}
            </MenuOptions>
          </Menu>
        </View>
      </View>
    );
  };

  const eventListeners = () => {
    pdfReaderRef.current?.addEventListener(
      CPDFEvent.ANNOTATIONS_CREATED,
      (annotation) => {
        // console.log(JSON.stringify(annotation, null, 2));
        console.log("Create Annotation: ------>");
        console.log(JSON.stringify(annotation, null, 2));
      }
    );

    pdfReaderRef.current?.addEventListener(
      CPDFEvent.ANNOTATIONS_SELECTED,
      (annotation) => {
        // console.log(JSON.stringify(annotation, null, 2));
        console.log("Select Annotation: ------>");
        console.log(JSON.stringify(annotation, null, 2));
        setSelectAnnotation(annotation);
      }
    );

    pdfReaderRef.current?.addEventListener(
      CPDFEvent.ANNOTATIONS_DESELECTED,
      (annotation) => {
        // console.log(JSON.stringify(annotation, null, 2));
        console.log("Deselect Annotation: ------>");
        console.log(JSON.stringify(annotation, null, 2));
        setSelectAnnotation(null);
      }
    );

    pdfReaderRef.current?.addEventListener(
      CPDFEvent.FORM_FIELDS_CREATED,
      (widget) => {
        // console.log(JSON.stringify(widget, null, 2));
        console.log("Create Form Field: ------>");
        console.log(JSON.stringify(widget, null, 2));
      }
    );

    pdfReaderRef.current?.addEventListener(
      CPDFEvent.FORM_FIELDS_SELECTED,
      (widget) => {
        // console.log(JSON.stringify(widget, null, 2));
        console.log("Select Form Field: ------>");
        console.log(JSON.stringify(widget, null, 2));
        setSelectWidget(widget);
      }
    );

    pdfReaderRef.current?.addEventListener(
      CPDFEvent.FORM_FIELDS_DESELECTED,
      (widget) => {
        // console.log(JSON.stringify(widget, null, 2));
        console.log("Deselect Form Field: ------>");
        console.log(JSON.stringify(widget, null, 2));
        setSelectWidget(null);
      }
    );

    pdfReaderRef.current?.addEventListener(
      CPDFEvent.EDITOR_SELECTION_SELECTED,
      (editArea) => {
        // console.log(JSON.stringify(editArea, null, 2));
        console.log("Select Edit Area:");
        console.log(JSON.stringify(editArea, null, 2));
        setSelectEditArea(editArea);
      }
    );

    pdfReaderRef.current?.addEventListener(
      CPDFEvent.EDITOR_SELECTION_DESELECTED,
      (_editArea) => {
        // console.log(JSON.stringify(editArea, null, 2));
        console.log("Deselect Edit Area:");
        setSelectEditArea(null);
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFCFF" }}>
      <View style={{ flex: 1 }}>
        {renderToolbar()}
        <CPDFReaderView
          ref={pdfReaderRef}
          document={samplePDF}
          configuration={ComPDFKit.getDefaultConfig({
            modeConfig: {
              initialViewMode: "annotations",
            },
          })}
          onIOSClickBackPressed={handleBack}
          onViewCreated={() => {
            eventListeners();
          }}
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

export default CPDFEventListenerExampleScreen;
