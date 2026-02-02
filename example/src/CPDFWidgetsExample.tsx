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
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PDFReaderContext, {
  CPDFReaderView,
  ComPDFKit,
  CPDFWidgetType,
  CPDFTextWidget,
  CPDFWidget,
  CPDFTextFieldAttr,
  CPDFCheckBoxAttr,
  CPDFCheckStyle,
  CPDFRadioButtonAttr,
  CPDFListBoxAttr,
  CPDFComboBoxAttr,
  CPDFPushButtonAttr,
  CPDFSignatureWidgetAttr,
  CPDFCheckboxWidget,
  CPDFRadiobuttonWidget,
  CPDFListboxWidget,
  CPDFComboboxWidget,
  CPDFPushbuttonWidget,
  CPDFSignatureWidget,
  CPDFUriAction,
} from "@compdfkit_pdf_sdk/react_native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";
import { keepLocalCopy, pick, types } from "@react-native-documents/picker";
import { CPDFWidgetListScreen } from "./screens/CPDFWidgetListScreen";
import { SafeAreaView } from "react-native-safe-area-context";
type RootStackParamList = {
  CPDFWidgetExample: { document?: string };
};

type CPDFWidgetsExampleScreenRouteProp = RouteProp<
  RootStackParamList,
  "CPDFWidgetExample"
>;

const CPDFWidgetsExampleScreen = () => {
  const pdfReaderRef = useRef<CPDFReaderView>(null);

  const navigation = useNavigation();

  const route = useRoute<CPDFWidgetsExampleScreenRouteProp>();

  const [widgetsModalVisible, setWidgetsModalVisible] = useState(false);

  const [textEditModalVisible, setTextEditModalVisible] = useState(false);

  const [widgetData, setWidgetData] = useState<CPDFWidget[]>([]);

  const [text, setText] = useState("");

  const [currentEditingWidget, setCurrentEditingWidget] = useState<
    CPDFWidget | null
  >(null);

  const [samplePDF] = useState(
    route.params?.document ||
      (Platform.OS === "android"
        ? "file:///android_asset/annot_test.pdf"
        : "annot_test.pdf")
  );

  const menuOptions = [
    "OpenDocument",
    "Import Widgets",
    "Export Widgets",
    "Get Widgets",
    "Get Widgets Attr",
    "Set Default Widget Attr",
    "Update Widgets",
    'Highlight Widgets'
  ];

  const handleMenuItemPress = async (action: string) => {
    switch (action) {
      case "OpenDocument":
        const document = await ComPDFKit.pickFile();
        if (document) {
          await pdfReaderRef.current?._pdfDocument.open(document);
        }
        break;
      case "Import Widgets":
        const [xfdfFile] = await pick({
          mode: "open",
          type: [types.allFiles],
          allowMultiSelection: false,
        });
        const [copyResult] = await keepLocalCopy({
          files: [
            {
              uri: xfdfFile!.uri,
              fileName: xfdfFile!.name ?? "fallback-name",
            },
          ],
          destination: "documentDirectory",
        });
        if (copyResult.status === "success") {
          console.log(copyResult.localUri);
          const uri = copyResult.localUri;
          if (uri.endsWith(".xfdf") || uri.endsWith(".xml")) {
            const importWidgetResult =
              await pdfReaderRef.current?._pdfDocument.importWidgets(uri);
            console.log("ComPDFKitRN importWidget:", importWidgetResult);
          } else {
            console.log("ComPDFKitRN Please select a valid xfdf or xml file");
          }
        }

        break;
      case "Export Widgets":
        const exportWidgetsPath =
          await pdfReaderRef.current?._pdfDocument.exportWidgets();
        console.log("ComPDFKitRN exportWidgets:", exportWidgetsPath);
        break;
      case "Get Widgets":
        const pageCount1 =
          await pdfReaderRef!.current!._pdfDocument.getPageCount();
        let allWidgets: CPDFWidget[] = [];
        for (let i = 0; i < pageCount1; i++) {
          const page = pdfReaderRef?.current?._pdfDocument.pageAtIndex(i);
          const widgets = await page?.getWidgets();
          if (widgets) {
            allWidgets = allWidgets.concat(widgets);
          }
        }
        setWidgetData(allWidgets);
        setWidgetsModalVisible(true);
        break;
      case "Get Widgets Attr":
        const widgetAttrs =
          await pdfReaderRef.current?.fetchDefaultWidgetStyle();
        console.log("ComPDFKitRN fetchDefaultWidgetStyle: --------->");
        console.log(JSON.stringify(widgetAttrs, null, 2));
        break;
      case "Set Default Widget Attr":
        updateDefaultWidgetsAttr();
        break;
      case "Update Widgets":
        updateWidget();
        break;
      case "Highlight Widgets":
        const highlightResult =
          await pdfReaderRef.current?.isFormFieldHighlight();
        await pdfReaderRef.current?.setFormFieldHighlight(!highlightResult);
        break;  
      default:
        break;
    }
  };

  const updateDefaultWidgetsAttr = async () => {
    const textFieldAttr: CPDFTextFieldAttr = {
      type: "textField",
      fillColor: "#FFFF00",
      borderColor: "#FF0000",
      borderWidth: 2,
    };
    await pdfReaderRef.current?.updateDefaultWidgetStyle(textFieldAttr);

    const checkBoxAttr: CPDFCheckBoxAttr = {
      type: "checkBox",
      fillColor: "#A4F482",
      borderColor: "#F6534A",
      borderWidth: 2,
      checkedStyle: CPDFCheckStyle.DIAMOND,
    };
    await pdfReaderRef.current?.updateDefaultWidgetStyle(checkBoxAttr);

    const radioButtonAttr: CPDFRadioButtonAttr = {
      type: "radioButton",
      fillColor: "#E0DA8B",
      borderColor: "#FA3350",
      borderWidth: 5,
      checkedStyle: CPDFCheckStyle.DIAMOND,
    };
    await pdfReaderRef.current?.updateDefaultWidgetStyle(radioButtonAttr);

    const listBoxAttr: CPDFListBoxAttr = {
      type: "listBox",
      fillColor: "#FFDCD1",
      borderColor: "#89E597",
      borderWidth: 2,
    };
    await pdfReaderRef.current?.updateDefaultWidgetStyle(listBoxAttr);

    const comboBoxAttr: CPDFComboBoxAttr = {
      type: "comboBox",
      fillColor: "#CAE29D",
      borderColor: "#6E92DA",
      borderWidth: 2,
    };
    await pdfReaderRef.current?.updateDefaultWidgetStyle(comboBoxAttr);

    const pushButtonAttr: CPDFPushButtonAttr = {
      type: "pushButton",
      fillColor: "#CAE29D",
      borderColor: "#6E92DA",
      borderWidth: 2,
    };
    await pdfReaderRef.current?.updateDefaultWidgetStyle(pushButtonAttr);

    const signatureFieldAttr: CPDFSignatureWidgetAttr = {
      type: "signaturesFields",
      fillColor: "#CAE29D",
      borderColor: "#6E92DA",
      borderWidth: 2,
    };
    await pdfReaderRef.current?.updateDefaultWidgetStyle(signatureFieldAttr);
  };

  const updateWidget = async () => {
    const document = pdfReaderRef.current?._pdfDocument;
    const widgets = await pdfReaderRef.current?._pdfDocument.pageAtIndex(1)?.getWidgets();
    if (!widgets || widgets.length === 0) {
      return;
    }
    for(const widget of widgets) {
      switch(widget.type){
        case 'textField':
          const textField = widget as CPDFTextWidget;
          textField.update({
            text: 'ComPDFKit-RN',
            title: 'ComPDFKit-RN TextField',
            fillColor: '#A2E195',
            borderColor: '#ED0E0E',
            fontColor: '#F55D1C',
            fontSize: 16,
            familyName: 'Times',
            styleName: 'Bold',
            borderWidth: 5
          });
          await document?.updateWidget(textField);
          break;
        case 'checkBox':
          const checkBox = widget as CPDFCheckboxWidget;
          checkBox.update({
            title: 'ComPDFKit-RN CheckBox',
            fillColor: '#FFFF00',
            borderColor: '#FF0000',
            isChecked: false,
            checkColor: '#3D84FF',
            checkStyle: CPDFCheckStyle.CIRCLE
          });
          await document?.updateWidget(checkBox);
          break;   
        case 'radioButton':
          const radioButton = widget as CPDFRadiobuttonWidget;
          radioButton.update({
            title: 'ComPDFKit-RN RadioButton',
            fillColor: '#7DF658',
            borderColor: '#FF0000',
            isChecked: false,
            checkColor: '#3D84FF',
            checkStyle: CPDFCheckStyle.DIAMOND
          });
          await document?.updateWidget(radioButton);
          break;
        case 'listBox':
          const listBox = widget as CPDFListboxWidget;
          listBox.update({
            title: 'ComPDFKit-RN ListBox',
            fillColor: '#FFFF00',
            borderColor: '#FF0000',
            fontColor: '#000000',
            fontSize: 12,
            familyName: 'Times',
            styleName: 'Bold',
            selectItemAtIndex: 0,
            options: [{
              text: 'Option 1',
              value: 'value1'
            }, {
              text: 'Option 2',
              value: 'value2'
            }],
          });
          await document?.updateWidget(listBox);
          break;
        case 'comboBox':
          const comboBox = widget as CPDFComboboxWidget;
          comboBox.update({
            title: 'ComPDFKit-RN ComboBox',
            fillColor: '#FFFF00',
            borderColor: '#FF0000',
            options: [{
              text: 'Option 1',
              value: 'value1'
            }, {
              text: 'Option 2',
              value: 'value2'
            }],
            selectItemAtIndex: 1,
            fontColor: '#000000',
            fontSize: 12,
            familyName: 'Times',
            styleName: 'Bold'

          });
          await document?.updateWidget(comboBox);
          break;  
        case 'pushButton':
          const pushButton = widget as CPDFPushbuttonWidget;
          pushButton.update({
            title: 'ComPDFKit-RN PushButton',
            fillColor: '#FFFF00',
            borderColor: '#FF0000',
            borderWidth: 10,
            buttonTitle: 'Click Me',
            fontColor: '#0000FF',
            fontSize: 16,
            familyName: 'Times',
            styleName: 'Bold',
            action: CPDFUriAction.createEmail('support@compdf.com')
          });
          await document?.updateWidget(pushButton);
          break;  
        case 'signaturesFields':
          // SignatureField widget update example
          const signWidget = widget as CPDFSignatureWidget;
          signWidget.update({
            title: 'ComPDFKit-RN SignatureField',
            fillColor: '#FFFF00',
            borderColor: '#FF0000',
            borderWidth: 10, 
          });
          await document?.updateWidget(signWidget);
          break;  
      }
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderToolbar = () => {
    return (
      <View style={styles.toolbar}>
        <HeaderBackButton onPress={handleBack} />
        <Text style={styles.toolbarTitle}>Widgets Example</Text>
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
    <PDFReaderContext.Provider value={pdfReaderRef.current}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFCFF" }}>
        <View style={{ flex: 1 }}>
          {renderToolbar()}
          <CPDFReaderView
            ref={pdfReaderRef}
            document={samplePDF}
            configuration={ComPDFKit.getDefaultConfig({})}
            onIOSClickBackPressed={handleBack}
          />
        </View>
        <CPDFWidgetListScreen
          visible={widgetsModalVisible}
          widgets={widgetData}
          onClose={() => setWidgetsModalVisible(false)}
          onEditText={(widget: CPDFWidget) => {
            setCurrentEditingWidget(widget);
            setWidgetsModalVisible(false);
            setTextEditModalVisible(true);
          }}
          onDelete={async (widget) => {
            const removeResult =
              await pdfReaderRef.current?._pdfDocument.removeWidget(widget);
            console.log("ComPDFKitRN removeWidget:", removeResult);
          }}
        />
        <Modal
          visible={textEditModalVisible}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.editTextModalContainer}>
            <View style={styles.editTextModalContent}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.modalTitle}>Edit Text</Text>
              </View>

              <TextInput
                style={styles.inputField}
                value={text}
                onChangeText={(newText) => setText(newText)}
                placeholder="Enter text here"
                multiline={true}
                numberOfLines={4}
                returnKeyType="done"
                blurOnSubmit={true}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setTextEditModalVisible(false);
                  }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    if (currentEditingWidget) {
                      const widget = currentEditingWidget;

                      console.log(JSON.stringify(widget, null, 2));
                      if (widget === undefined) {
                        return;
                      }
                      if (widget.type === CPDFWidgetType.TEXT_FIELD) {
                        const textWidget = widget as CPDFTextWidget;
                        try {
                          console.log("ComPDFKitRN setText:", text);
                          // change textFields text
                          textWidget.update({ text: text });
                          await pdfReaderRef.current?._pdfDocument.updateWidget(textWidget);
                          setWidgetData([]);
                          setText("");
                        } catch (error) {
                          console.error("Failed to update text widget:", error);
                        }
                      }
                      setTextEditModalVisible(false);
                    }
                  }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(3, 3, 3, 0.2)",
  },
  modalContent: {
    width: "100%",
    maxHeight: "60%",
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "black",
  },
  widgetItem: {
    fontSize: 14,
    paddingVertical: 5,
    fontWeight: "500",
    color: "black",
  },
  widgetBody: {
    fontSize: 14,
    paddingVertical: 5,
  },
  closeButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginEnd: 8,
  },
  closeButtonText: {
    color: "#007BFF",
    fontSize: 14,
  },
  editTextModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(3, 3, 3, 0.2)",
  },
  editTextModalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
  },
  inputField: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#1460F3",
    fontSize: 16,
  },
});

export default CPDFWidgetsExampleScreen;
