/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState, useRef, useEffect } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import PDFReaderContext, {
  CPDFReaderView,
  ComPDFKit,
  CPDFViewMode,
  CPDFWidget,
  CPDFTextWidget,
  CPDFCheckboxWidget,
  CPDFCheckStyle,
  CPDFRadiobuttonWidget,
  CPDFListboxWidget,
  CPDFComboboxWidget,
  CPDFSignatureWidget,
  CPDFPushbuttonWidget,
  CPDFGoToAction,
  CPDFUriAction,
  CPDFWidgetUtil,
  CPDFEvent,
} from "@compdfkit_pdf_sdk/react_native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { CPDFFormCreationToolbar } from "./screens/form/CPDFFormCreationToolbar";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

type RootStackParamList = {
  CPDFFormCreationExample: { document?: string };
};

type CPDFFormCreationExampleScreenRouteProp = RouteProp<
  RootStackParamList,
  "CPDFFormCreationExample"
>;

const CPDFFormCreationExampleScreen = () => {
  const pdfReaderRef = useRef<CPDFReaderView>(null);

  const [pdfReader, setPdfReader] = useState<CPDFReaderView | null>(null);

  const navigation = useNavigation();

  const route = useRoute<CPDFFormCreationExampleScreenRouteProp>();

  const [samplePDF] = useState(
    route.params?.document ||
      (Platform.OS === "android"
        ? "file:///android_asset/annot_test.pdf"
        : "annot_test.pdf")
  );

  const handleSave = async () => {
    if (pdfReaderRef.current) {
      const success = await pdfReaderRef.current.save();
      if (success) {
        console.log("ComPDFKitRN save() : Document saved successfully");
      } else {
        console.log("ComPDFKitRN save() : Failed to save document");
      }
    }
  };

  useEffect(() => {
    if (pdfReaderRef.current) {
      setPdfReader(pdfReaderRef.current);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      // Save document changes
      handleSave();
      navigation.dispatch(e.data.action);
    });
    return unsubscribe;
  }, [navigation]);

  const handleBack = async () => {
    navigation.goBack();
  };

  const menuOptions = [
    "Add Text Fields",
    "Add Checkboxes",
    "Add Radio Buttons",
    "Add List/Combobox",
    "Add Signature",
    "Add Buttons",
    "Add All Widgets",
  ];

  const handleMenuItemPress = async (action: string) => {
    switch (action) {
      case "Add Text Fields":
        await pdfReaderRef.current?._pdfDocument.addWidgets(
          widgetExamples.textFields
        );
        break;
      case "Add Checkboxes":
        await pdfReaderRef.current?._pdfDocument.addWidgets(
          widgetExamples.checkboxes
        );
        break;
      case "Add Radio Buttons":
        await pdfReaderRef.current?._pdfDocument.addWidgets(
          widgetExamples.radioButtons
        );
        break;
      case "Add List/Combobox":
        await pdfReaderRef.current?._pdfDocument.addWidgets(
          widgetExamples.listAndCombobox
        );
        break;
      case "Add Signature":
        await pdfReaderRef.current?._pdfDocument.addWidgets(
          widgetExamples.signature
        );
        break;
      case "Add Buttons":
        await pdfReaderRef.current?._pdfDocument.addWidgets(
          widgetExamples.buttons
        );
        break;
      case "Add All Widgets":
        await pdfReaderRef.current?._pdfDocument.addWidgets(widgetExamples.all);
        break;
      default:
        break;
    }
  };

  const onViewCreated = () => {
    pdfReaderRef.current?.addEventListener(
      CPDFEvent.FORM_FIELDS_SELECTED,
      (event) => {
        console.log(JSON.stringify(event, null, 2));
      }
    );
  };

  const renderToolbar = () => {
    return (
      <View style={styles.toolbar}>
        <HeaderBackButton onPress={handleBack} />
        <Text style={styles.toolbarTitle}>Form Creation Example</Text>
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
    );
  };

  return (
    <PDFReaderContext.Provider value={pdfReader}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFCFF" }}>
        <View style={{ flex: 1 }}>
          {renderToolbar()}
          <CPDFReaderView
            ref={pdfReaderRef}
            document={samplePDF}
            onViewCreated={onViewCreated}
            onIOSClickBackPressed={() => {
              console.log("onIOSClickBackPressed");
              navigation.goBack();
            }}
            configuration={ComPDFKit.getDefaultConfig({
              modeConfig: {
                initialViewMode: CPDFViewMode.FORMS,
                uiVisibilityMode: "automatic",
              },
              toolbarConfig: {
                formToolbarVisible: false,
              },
              formsConfig: {
                showCreateComboBoxOptionsDialog: false,
                showCreateListBoxOptionsDialog: false,
                showCreatePushButtonOptionsDialog: false,
              }
            })}
          />
          <CPDFFormCreationToolbar />
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

/**
 * Widget Examples organized by type
 * Each category contains pre-configured widget examples
 */
const widgetExamples = {
  /**
   * Text Input Fields Example
   * - Basic text field with custom styling
   * - Single and multi-line text inputs
   */
  textFields: [
    new CPDFTextWidget({
      title: CPDFWidgetUtil.createFieldName("TextField"),
      page: 0,
      rect: { left: 40, top: 799, right: 320, bottom: 701 },
      createDate: new Date(1735696800000),
      text: "This is Text Fields",
      isMultiline: true,
      fillColor: "#BEBEBE",
      borderColor: "#8BC34A",
      borderWidth: 5,
      fontColor: "#000000",
      fontSize: 14,
      familyName: "Times",
      styleName: "Bold",
      alignment: "right",
    }),
  ],

  /**
   * Checkbox Widget Example
   * - Single checkbox with custom check style
   * - Supports CIRCLE, SQUARE, and other check styles
   */
  checkboxes: [
    new CPDFCheckboxWidget({
      title: CPDFWidgetUtil.createFieldName("Checkbox"),
      page: 0,
      rect: { left: 361, top: 778, right: 442, bottom: 704 },
      isChecked: true,
      checkStyle: CPDFCheckStyle.CIRCLE,
      checkColor: "#3CE930",
      fillColor: "#e0e0e0",
      borderColor: "#000000",
      borderWidth: 5,
    }),
  ],

  /**
   * Radio Button Widget Example
   * - Single radio button with custom styling
   * - Supports CROSS, CIRCLE, and other check styles
   */
  radioButtons: [
    new CPDFRadiobuttonWidget({
      title: CPDFWidgetUtil.createFieldName("Radiobutton"),
      page: 0,
      rect: { left: 479, top: 789, right: 549, bottom: 715 },
      isChecked: true,
      checkStyle: CPDFCheckStyle.CROSS,
      checkColor: "#FF0000",
      fillColor: "#00FF00",
      borderColor: "#000000",
      borderWidth: 5,
    }),
  ],

  /**
   * List and Combobox Widgets Example
   * - Listbox: displays all options in a list
   * - Combobox: dropdown selection field
   */
  listAndCombobox: [
    new CPDFListboxWidget({
      title: CPDFWidgetUtil.createFieldName("Listbox"),
      page: 0,
      rect: { left: 53, top: 294, right: 294, bottom: 191 },
      selectItemAtIndex: 0,
      options: [
        { text: "options-1", value: "options-1" },
        { text: "options-2", value: "options-2" },
      ],
      familyName: "Times",
      styleName: "Bold",
      fillColor: "#FFFF00",
      borderColor: "#FF0000",
      borderWidth: 3,
    }),
    new CPDFComboboxWidget({
      title: CPDFWidgetUtil.createFieldName("Combobox"),
      page: 0,
      rect: { left: 354, top: 288, right: 557, bottom: 170 },
      selectItemAtIndex: 1,
      options: [
        { text: "options-1", value: "options-1" },
        { text: "options-2", value: "options-2" },
      ],
      familyName: "Times",
      styleName: "Bold",
      fillColor: "#FFFF00",
      borderColor: "#FF0000",
      borderWidth: 3,
    }),
  ],

  /**
   * Signature Widget Example
   * - Field for capturing digital signatures
   * - Custom styling with colors and borders
   */
  signature: [
    new CPDFSignatureWidget({
      title: CPDFWidgetUtil.createFieldName("Signature"),
      page: 0,
      rect: { left: 64, top: 649, right: 319, bottom: 527 },
      fillColor: "#E0e0e0",
      borderColor: "#FF0000",
      borderWidth: 5,
    }),
  ],

  /**
   * Push Button Examples
   * - Button with "Go To Page" action
   * - Button with "Open URL" action
   */
  buttons: [
    new CPDFPushbuttonWidget({
      title: CPDFWidgetUtil.createFieldName("Pushbutton"),
      page: 0,
      rect: { left: 366, top: 632, right: 520, bottom: 541 },
      fillColor: "#e0e0e0",
      borderColor: "#ff0000",
      borderWidth: 5,
      fontSize: 14,
      buttonTitle: "Jump Page 2",
      action: CPDFGoToAction.toPage(1),
    }),

    new CPDFPushbuttonWidget({
      title: CPDFWidgetUtil.createFieldName("Pushbutton"),
      page: 0,
      rect: { left: 365, top: 503, right: 501, bottom: 413 },
      fillColor: "#e0e0e0",
      borderColor: "#ff0000",
      borderWidth: 5,
      fontSize: 14,
      buttonTitle: "Click Me",
      action: CPDFUriAction.createWeb("https://www.compdf.com"),
    }),
  ],

  /**
   * All Widgets Combined
   * - Includes all widget types in a single array
   * - Useful for batch addition of all examples
   */
  get all(): CPDFWidget[] {
    return [
      ...this.textFields,
      ...this.checkboxes,
      ...this.radioButtons,
      ...this.listAndCombobox,
      ...this.signature,
      ...this.buttons,
    ];
  },
};

export default CPDFFormCreationExampleScreen;
