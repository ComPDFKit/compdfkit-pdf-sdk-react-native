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
  CPDFAnnotation,
  CPDFViewMode,
  CPDFAnnotationType,
  CPDFWidgetType,
  CPDFTextStampColor,
  CPDFTextStampShape,
  CPDFDateUtil,
  CPDFEvent,
  CPDFListboxWidget,
  CPDFComboboxWidget,
  CPDFWidgetItem,
  CPDFPushbuttonWidget,
  CPDFUriAction,
  CPDFGoToAction,
  CPDFLinkAnnotation,
} from "@compdfkit_pdf_sdk/react_native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignatureListModal } from "./screens/annotation/SignatureListModal";
import { StampListModal } from "./screens/annotation/StampListModal";
import { FormOptionsModal } from "./screens/form/FormOptionsModal";
import { PushButtonOptionsModal } from "./screens/form/PushButtonOptionsModal";
import { launchImageLibrary } from "react-native-image-picker";

type RootStackParamList = {
  CPDFCustomAnnotationCreateExample: { document?: string };
};

type CPDFCustomAnnotationCreateExampleScreenRouteProp = RouteProp<
  RootStackParamList,
  "CPDFCustomAnnotationCreateExample"
>;

const CPDFCustomAnnotationCreateExampleScreen = () => {
  const pdfReaderRef = useRef<CPDFReaderView>(null);

  const [pdfReader, setPdfReader] = useState<CPDFReaderView | null>(null);

  const navigation = useNavigation();

  const route = useRoute<CPDFCustomAnnotationCreateExampleScreenRouteProp>();

  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [stampModalVisible, setStampModalVisible] = useState(false);
  const [formOptionsModalVisible, setFormOptionsModalVisible] = useState(false);
  const [formOptionsTitle, setFormOptionsTitle] = useState('');
  const [formOptions, setFormOptions] = useState<CPDFWidgetItem[]>([]);
  const [currentWidget, setCurrentWidget] = useState<CPDFListboxWidget | CPDFComboboxWidget | null>(null);
  const [pushButtonModalVisible, setPushButtonModalVisible] = useState(false);
  const [pushButtonPageCount, setPushButtonPageCount] = useState(0);
  const [currentPushButton, setCurrentPushButton] = useState<CPDFPushbuttonWidget | null>(null);

  const [samplePDF] = useState(
    route.params?.document ||
      (Platform.OS === "android"
        ? "file:///android_asset/PDF_Document.pdf"
        : "PDF_Document.pdf")
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

  const menuOptions = ["openDocument"];

  const handleMenuItemPress = async (action: string) => {
    switch (action) {
      case "Save":
        handleSave();
        break;
      default:
        break;
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

  const renderToolbar = () => {
    return (
      <View style={styles.toolbar}>
        <HeaderBackButton onPress={handleBack} />
        <Text style={styles.toolbarTitle}>
          Custom Annotation Create Example
        </Text>

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

  const onAnnotationCreationPrepared = (
    type: CPDFAnnotationType,
    event: CPDFAnnotation | null
  ) => {
    console.log(`onAnnotationCreationPrepared: ----------->`);
    console.log(`type: ${type}`);
    console.log(JSON.stringify(event, null, 2));
    console.log(`onAnnotationCreationPrepared: <-----------`);
    switch (type) {
      case CPDFAnnotationType.SIGNATURE:
        setSignatureModalVisible(true);
        break;
      case CPDFAnnotationType.STAMP:
        setStampModalVisible(true);
        // handleTextStampSelected();
        break;
      case CPDFAnnotationType.PICTURES:
        handleImageSelected();
        break;
      case CPDFAnnotationType.LINK:
        handleLinkSelected(event!);
        break;
      default:
        break;
    }
  };

  const handleLinkSelected = async (annotation: CPDFAnnotation) => {
    if (pdfReaderRef.current) {
      const linkAnnotation = annotation as CPDFLinkAnnotation;
      linkAnnotation.update({ action: CPDFUriAction.createWeb('https://www.compdf.com') });
      console.log('Updated link annotation action to https://www.compdf.com');
      await pdfReaderRef.current._pdfDocument.updateAnnotation(linkAnnotation);
    }
  }

  const handleSignatureSelected = async (imagePath: string) => {
    if (pdfReaderRef.current) {
      console.log("Adding signature to document with path:", imagePath);
      await pdfReaderRef.current.prepareNextSignature(imagePath);
    }
  };

  const handleStampStandardSelected = async (standardStamp: any) => {
    if (pdfReaderRef.current) {
      console.log("Preparing standard stamp:", standardStamp);
      await pdfReaderRef.current.prepareNextStamp({
        standardStamp: standardStamp,
      });
    }
  };

  const handleTextStampSelected = async () => {
    if (pdfReaderRef.current) {
      await pdfReaderRef.current.prepareNextStamp({
        textStamp: {
          content: "ComPDFKit",
          date: CPDFDateUtil.getTextStampDate({
            timeSwitch: true,
            dateSwitch: true,
          }),
          color: CPDFTextStampColor.blue,
          shape: CPDFTextStampShape.leftTriangle,
        },
      });
    }
  };

  const handleStampCustomSelected = async (imagePath: string) => {
    if (pdfReaderRef.current) {
      console.log("Preparing custom stamp from path:", imagePath);
      await pdfReaderRef.current.prepareNextStamp({ imagePath: imagePath });
    }
  };

  const handleImageSelected = async () => {
    // Photo Library Example:
    launchImageLibrary(
      {
        mediaType: "photo",
      },
      async (res) => {
        if (res.didCancel) {
          return false;
        }
        const uri = res.assets?.[0]?.uri;
        console.log("Selected image URI:", uri);
        if (!uri) {
          console.log("ComPDFKitRN insertImagePage: invalid image asset");
          return false;
        }

        await pdfReaderRef.current?.prepareNextImage(uri);
        return true;
      }
    );

    // Android Platform Assets Example:
    // await pdfReaderRef.current?.prepareNextImage(
    //   "file:///android_asset/test_sign_pic.png"
    // );

    // Android Platform Uri Example:
    // await pdfReaderRef.current?.prepareNextImage(
    //   'content://com.android.providers.media.documents/document/image%3A1000000686'
    // );
  };

  const handleFormOptionsConfirm = async (options: CPDFWidgetItem[]) => {
    if (currentWidget) {
      if (options.length === 0) {
        console.log('No options provided, aborting update.');
        return;
      }
      console.log('Updating form options:');
      console.log(JSON.stringify(options, null, 2));
      // Update the widget's options
      if (currentWidget instanceof CPDFListboxWidget) {
        currentWidget.update({options: options});
        pdfReaderRef.current?._pdfDocument.updateWidget(currentWidget);
      } else if (currentWidget instanceof CPDFComboboxWidget) {
        currentWidget.update({options: options});
        pdfReaderRef.current?._pdfDocument.updateWidget(currentWidget);
      }
      setCurrentWidget(null);
    }
  };

  const handlePushButtonConfirm = async (payload: { type: 'url'; url: string } | { type: 'page'; page: number }) => {
    if (!currentPushButton) return;

    if (payload.type === 'url') {
      currentPushButton.action = CPDFUriAction.createWeb(payload.url);
      console.log('PushButton action set to URL:', payload.url);
    } else {
      currentPushButton.action = new CPDFGoToAction({ pageIndex: payload.page });
      console.log('PushButton action set to page:', payload.page);
    }
    await pdfReaderRef.current?._pdfDocument.updateWidget(currentPushButton);
    setCurrentPushButton(null);
  };

  const onViewCreated = () => {
    console.log("CPDFReaderView Create ----------------")
    pdfReaderRef.current?.addEventListener(CPDFEvent.FORM_FIELDS_CREATED, (widget) => {
      console.log('FORM_FIELDS_CREATED event received for widget:');
      console.log(JSON.stringify(widget, null, 2));
      switch (widget.type) {
        case CPDFWidgetType.COMBOBOX:
        case CPDFWidgetType.LISTBOX:
          // Show options dialog
          if (widget instanceof CPDFListboxWidget) {
            setFormOptions([...widget.options]);
            setCurrentWidget(widget);
            setFormOptionsTitle('ListBox Options');
            setFormOptionsModalVisible(true);
          } else if (widget instanceof CPDFComboboxWidget) {
            setFormOptions([...widget.options]);
            setCurrentWidget(widget);
            setFormOptionsTitle('ComboBox Options');
            setFormOptionsModalVisible(true);
          }
          break;
        case CPDFWidgetType.PUSH_BUTTON:
          if (widget instanceof CPDFPushbuttonWidget) {
            setCurrentPushButton(widget);
            (async () => {
              try {
                const count = await pdfReaderRef.current?._pdfDocument?.getPageCount?.();
                setPushButtonPageCount(typeof count === 'number' ? count : 0);
              } catch (error) {
                console.warn('Failed to get page count for push button', error);
                setPushButtonPageCount(0);
              }
              setPushButtonModalVisible(true);
            })();
          }
          break;
      }
    });

    pdfReaderRef.current?.addEventListener(CPDFEvent.ANNOTATIONS_SELECTED, (widget) => {
      console.log(JSON.stringify(widget, null, 2));
    });

    pdfReaderRef.current?.addEventListener(CPDFEvent.FORM_FIELDS_SELECTED, (widget) => {
      console.log(JSON.stringify(widget, null, 2));
    });
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
            onAnnotationCreationPrepared={onAnnotationCreationPrepared}
            onViewCreated={onViewCreated}
            configuration={ComPDFKit.getDefaultConfig({
              annotationsConfig: {
                autoShowLinkDialog: false,
                autoShowPicPicker: false,
                autoShowSignPicker: false,
                autoShowStampPicker: false,
                availableTypes: [
                  CPDFAnnotationType.SIGNATURE,
                  CPDFAnnotationType.STAMP,
                  CPDFAnnotationType.PICTURES,
                  CPDFAnnotationType.LINK,
                ],
              },
              formsConfig: {
                showCreateComboBoxOptionsDialog: false,
                showCreateListBoxOptionsDialog: false,
                showCreatePushButtonOptionsDialog: false,
                availableTypes: [
                  CPDFWidgetType.LISTBOX,
                  CPDFWidgetType.COMBOBOX,
                  CPDFWidgetType.PUSH_BUTTON,
                ],
              },
              modeConfig: {
                initialViewMode: CPDFViewMode.ANNOTATIONS,
                uiVisibilityMode: "automatic",
              },
            })}
          />
        </View>

        <SignatureListModal
          visible={signatureModalVisible}
          onClose={() => setSignatureModalVisible(false)}
          onSelectSignature={handleSignatureSelected}
        />
        <StampListModal
          visible={stampModalVisible}
          onClose={() => setStampModalVisible(false)}
          onSelectStandard={handleStampStandardSelected}
          onSelectCustom={handleStampCustomSelected}
        />
        <PushButtonOptionsModal
          visible={pushButtonModalVisible}
          pageCount={pushButtonPageCount}
          onClose={() => {
            setPushButtonModalVisible(false);
            setCurrentPushButton(null);
          }}
          onConfirm={(payload) => {
            handlePushButtonConfirm(payload);
            setPushButtonModalVisible(false);
          }}
        />
        <FormOptionsModal
          visible={formOptionsModalVisible}
          title={formOptionsTitle}
          options={formOptions}
          onClose={() => {
            setFormOptionsModalVisible(false);
            setCurrentWidget(null);
          }}
          onConfirm={handleFormOptionsConfirm}
        />
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

export default CPDFCustomAnnotationCreateExampleScreen;
