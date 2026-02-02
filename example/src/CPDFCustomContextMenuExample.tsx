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
  Alert,
  Platform,
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  CPDFComboboxWidget,
  CPDFContextMenuConfig,
  CPDFEditImageArea,
  CPDFEditTextArea,
  CPDFListboxWidget,
  CPDFReaderView,
  CPDFWidgetItem,
  ComPDFKit,
  menus,
} from "@compdfkit_pdf_sdk/react_native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormOptionsModal } from "./screens/form/FormOptionsModal";

type RootStackParamList = {
  CPDFCustomContextMenuExample: { document?: string };
};

type CPDFCustomContextMenuExampleRouteProp = RouteProp<
  RootStackParamList,
  "CPDFCustomContextMenuExample"
>;

/**
 * Custom Context Menu Configuration
 * Demonstrates how to customize context menus for different modes
 */
const getContextMenuConfig = (): CPDFContextMenuConfig => ({
  padding: [4, 0, 4, 0],
  iconSize: 40,
  fontSize: 14,

  // Global menus (screenshot)
  global: {
    screenshot: menus(
      { key: "exit", title: "Exit Screenshot" },
      { key: "share", showType: "icon", icon: "ic_test_share" },
      {
        key: "custom",
        identifier: "custom_screenshot_action",
        showType: "icon",
        icon: "ic_test_download",
        title: "Capture Screenshot",
      }
    ),
  },

  // View mode menus
  viewMode: {
    textSelect: menus(
      { key: "copy", title: "Copy Text" },
      {
        key: "custom",
        identifier: "custom_text_select_action",
        title: "Draw Rect",
      }
    ),
  },

  // Annotation mode menus
  annotationMode: {
    textSelect: menus(
      { key: "copy", icon: "ic_test_copy", showType: "icon", title: "Copy Test" },
      { key: "highlight", icon: "ic_test_highlight", showType: "icon" , title: "Highlight Test" },
      { key: "underline", icon: "ic_test_underline", showType: "icon" , title: "Underline Test" },
      { key: "strikeout", icon: "ic_test_strikeout", showType: "icon" , title: "Strikeout Test" },
      { key: "squiggly", icon: "ic_test_wavyline", showType: "icon" , title: "Squiggly Test" },
      {
        key: "custom",
        identifier: "custom_annotation_text_select_show_rect",
        icon: "ic_test_rect",
        showType: "icon",
        title: "Draw Rect",
      }
    ),
    longPressContent: menus(
      "paste",
      {
        key: "custom",
        title: "Get Point",
        identifier: "custom_event_get_point",
      },
      { key: "note", icon: "ic_test_note", showType: "icon", title: 'Add Note Test' }
    ),
    markupContent: menus(
      {
        key: "custom",
        icon: "ic_test_properties",
        showType: "icon",
        identifier: "custom_show_annotation_properties_action",
        title: 'Show Properties',
      },
      { key: "note", icon: "ic_test_note", showType: "icon" },
      {
        key: "custom",
        icon: "ic_test_delete",
        showType: "icon",
        identifier: "custom_annotation_delete_action",
        title: 'Delete Annotation',
      }
    ),
    soundContent: menus(
      { key: "play", icon: "ic_test_play", showType: "icon", title: "Play Sound" },
      { key: "record", icon: "ic_test_record", showType: "icon", title: "Record Sound" },
      { key: "delete", icon: "ic_test_delete", showType: "icon", title: "Delete Sound" },
      {
        key: "custom",
        title: "Get Annotation",
        identifier: "custom_event_get_sound_annotation",
      }
    ),
    inkContent: menus(
      {
        key: "custom",
        icon: "ic_test_properties",
        showType: "icon",
        identifier: "custom_show_annotation_properties_action",
        title: 'Show Properties',
      },
      {
        key: "custom",
        icon: "ic_test_delete",
        showType: "icon",
        identifier: "custom_annotation_delete_action",
        title: 'Delete Annotation',
      }
    ),
    shapeContent: menus(
      {
        key: "custom",
        icon: "ic_test_properties",
        showType: "icon",
        identifier: "custom_show_annotation_properties_action",
        title: 'Show Properties',
      },
      {
        key: "custom",
        icon: "ic_test_delete",
        showType: "icon",
        identifier: "custom_annotation_delete_action",
        title: 'Delete Annotation',
      }
    ),
    freeTextContent: menus(
      {
        key: "custom",
        icon: "ic_test_properties",
        showType: "icon",
        identifier: "custom_show_annotation_properties_action",
        title: 'Show Properties',
      },
      {
        key: "custom",
        icon: "ic_test_delete",
        showType: "icon",
        identifier: "custom_annotation_delete_action",
        title: 'Delete Annotation',
      }
    ),
    signStampContent: menus(
      "signHere",
      {
        key: "custom",
        icon: "ic_test_delete",
        showType: "icon",
        identifier: "custom_annotation_delete_action",
        title: 'Delete Annotation',
      },
      { key: "rotate", icon: "ic_test_rotate", showType: "icon", title: "Rotate Test" }
    ),
    stampContent: menus(
      { key: "note", icon: "ic_test_note", showType: "icon", title: 'Add Note Test' },
      {
        key: "custom",
        icon: "ic_test_delete",
        showType: "icon",
        identifier: "custom_annotation_delete_action",
        title: 'Delete Annotation',
      }
    ),
    linkContent: menus(
      { key: "edit", icon: "ic_test_edit", showType: "icon" },
      {
        key: "custom",
        icon: "ic_test_edit",
        showType: "icon",
        identifier: "custom_link_annotation_edit_action",
        title: 'Edit Link',
      },
      {
        key: "custom",
        icon: "ic_test_delete",
        showType: "icon",
        identifier: "custom_annotation_delete_action",
        title: 'Delete Annotation',
      }
    ),
  },

  // Content editor mode menus
  contentEditorMode: {
    editTextAreaContent: menus(
      { key: "properties", title: "Text Properties" },
      "edit",
      "cut",
      "copy",
      "delete",
      {
        key: "custom",
        identifier: "custom_edit_get_text",
        title: "Get Text",
      }
    ),
    editSelectTextContent: menus(
      { key: "properties", icon: "ic_test_properties", showType: "icon" },
      {
        key: "opacity",
        subItems: ["25%", "50%", "75%", "100%"],
      },
      {
        key: "custom",
        title: "Get Text",
        identifier: "custom_edit_get_text",
      }
    ),
    imageAreaContent: menus(
      {
        key: "custom",
        icon: "ic_test_properties",
        showType: "icon",
        identifier: "custom_show_edit_image_properties_action",
        title: "Image Properties",
      },
      {
        key: "custom",
        icon: "ic_test_download",
        showType: "icon",
        identifier: "custom_get_image",
        title: "Get Image",
      },
      { key: "crop", icon: "ic_test_crop", showType: "icon", title: "Crop Test" },
      { key: "delete", icon: "ic_test_delete", showType: "icon" }
    ),
    imageCropMode: menus(
      { key: "done", icon: "ic_test_done", showType: "icon" },
      { key: "cancel", icon: "ic_test_cancel", showType: "icon" }
    ),
    editPathContent: menus({
      key: "delete",
      icon: "ic_test_delete",
      showType: "icon",
    }),
    longPressWithEditTextMode: menus(
      { key: "addText", icon: "ic_test_add_text", showType: "icon" },
      "paste",
      "keepSourceFormatingPaste",
      {
        key: "custom",
        identifier: "custom_event_get_point",
        title: "Get Point",
      }
    ),
    longPressWithEditImageMode: menus(
      { key: "addImages", icon: "ic_test_add_image", showType: "icon" },
      "paste",
      {
        key: "custom",
        identifier: "custom_event_get_point",
        title: "Get Point",
      }
    ),
    longPressWithAllMode: menus("paste", "keepSourceFormatingPaste", {
      key: "custom",
      identifier: "custom_event_get_point",
      title: "Get Point",
    }),
  },

  // Form mode menus
  formMode: {
    textField: menus(
      { key: "properties", icon: "ic_test_properties", showType: "icon" },
      {
        key: "custom",
        icon: "ic_test_delete",
        showType: "icon",
        identifier: "custom_widget_delete_action",
        title: 'Delete Widget',
      }
    ),
    checkBox: menus(
      {
        key: "custom",
        icon: "ic_test_properties",
        showType: "icon",
        identifier: "custom_widget_show_properties_action",
        title: 'Show Properties',
      },
      {
        key: "custom",
        icon: "ic_test_delete",
        showType: "icon",
        identifier: "custom_widget_delete_action",
        title: 'Delete Widget',
      }
    ),
    radioButton: menus(
      { key: "properties", icon: "ic_test_properties", showType: "icon" },
      {
        key: "custom",
        icon: "ic_test_delete",
        showType: "icon",
        identifier: "custom_widget_delete_action",
        title: 'Delete Widget',
      }
    ),
    listBox: menus(
      {
        key: "custom",
        icon: "ic_test_edit",
        showType: "icon",
        identifier: "custom_widget_show_options_action",
        title: 'Edit Options',
      },
      // { key: "options", icon: "ic_test_edit", showType: "icon" },
      { key: "properties", icon: "ic_test_properties", showType: "icon" },
      {
        key: "custom",
        icon: "ic_test_delete",
        showType: "icon",
        identifier: "custom_widget_delete_action",
        title: 'Delete Widget',
      }
    ),
    comboBox: menus(
      { key: "options", icon: "ic_test_edit", showType: "icon" },
      { key: "properties", icon: "ic_test_properties", showType: "icon" },
      {
        key: "custom",
        icon: "ic_test_delete",
        showType: "icon",
        identifier: "custom_widget_delete_action",
        title: 'Delete Widget',
      }
    ),
    signatureField: menus(
      { key: "startToSign", icon: "ic_test_done", showType: "icon" },
      {
        key: "custom",
        icon: "ic_test_delete",
        showType: "icon",
        identifier: "custom_widget_delete_action",
        title: 'Delete Widget',
      }
    ),
    pushButton: menus(
      { key: "properties", icon: "ic_test_properties", showType: "icon" },
      {
        key: "custom",
        icon: "ic_test_delete",
        showType: "icon",
        identifier: "custom_widget_delete_action",
        title: 'Delete Widget',
      }
    ),
  },
});

/**
 * Image Preview Modal Component
 */
const ImagePreviewModal: React.FC<{
  visible: boolean;
  imageBase64: string | null;
  onClose: () => void;
}> = ({ visible, imageBase64, onClose }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Captured Screenshot</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {imageBase64 && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: `data:image/png;base64,${imageBase64}` }}
              style={styles.capturedImage}
              resizeMode="contain"
            />
          </View>
        )}

        <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
          <Text style={styles.confirmButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const CPDFCustomContextMenuExampleScreen = () => {
  const pdfReaderRef = useRef<CPDFReaderView>(null);
  const navigation = useNavigation();
  const route = useRoute<CPDFCustomContextMenuExampleRouteProp>();

  const [samplePDF] = useState(
    route.params?.document ||
      (Platform.OS === "android"
        ? "file:///android_asset/PDF_Document.pdf"
        : "PDF_Document.pdf")
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const [formOptionsModalVisible, setFormOptionsModalVisible] = useState(false);
  const [formOptionsTitle, setFormOptionsTitle] = useState("");
  const [selectWidget, setSelectWidget] = useState<CPDFListboxWidget | CPDFComboboxWidget | null>(null);
  const handleBack = () => navigation.goBack();

  const showImageModal = (base64Image: string) => {
    setCapturedImage(base64Image);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setCapturedImage(null);
  };

  // ==================== Event Handlers ====================

  /**
   * Handle text selection events (view mode and annotation mode)
   */
  const handleTextSelection = (event: any) => {
    const { pageIndex, rect, text } = event;
    console.log(`Selected text: ${text}`);

    if (pageIndex !== undefined && rect) {
      pdfReaderRef.current?.setDisplayPageIndex(pageIndex, {
        rectList: [rect],
      });
    }
  };

  /**
   * Handle screenshot capture
   */
  const handleScreenshotCapture = (event: any) => {
    console.log(JSON.stringify(event, null, 2));
    if (event?.image) {
      showImageModal(event.image);
    } else {
      Alert.alert("Screenshot", "No image data available");
    }
  };

  /**
   * Handle long press to get point coordinates
   */
  const handleGetPoint = (event: any) => {
    const { point, pageIndex } = event;
    console.log(
      `Long pressed point: ${JSON.stringify(point)} on page ${pageIndex}`
    );

    Alert.alert(
      "Get Point",
      `Point coordinates:\nX: ${point?.x.toFixed(2)}, Y: ${point?.y.toFixed(
        2
      )}\non page ${pageIndex}`
    );
  };

  /**
   * Handle annotation operations (show properties, delete)
   */
  const handleAnnotationOperation = async (identifier: string, event: any) => {
    const annotation = event?.annotation;
    if (!annotation) return;

    switch (identifier) {
      case "custom_show_annotation_properties_action":
        pdfReaderRef.current?.showAnnotationPropertiesView(annotation);
        break;
      case "custom_annotation_delete_action":
        await pdfReaderRef.current?._pdfDocument.removeAnnotation(annotation);
        break;
      case "custom_event_get_sound_annotation":
        console.log("Sound annotation:", annotation);
        Alert.alert("Sound Annotation", JSON.stringify(annotation, null, 2));
        break;
      case "custom_link_annotation_edit_action":
        console.log(JSON.stringify(annotation, null, 2));
        Alert.alert("Edit Link", "Custom link edit action");
        break;
    }
  };

  /**
   * Handle edit area operations (text/image editing)
   */
  const handleEditAreaOperation = (identifier: string, event: any) => {
    const editArea = event?.editArea;
    if (!editArea) return;

    switch (identifier) {
      case "custom_edit_get_text":
        const editTextArea = editArea as CPDFEditTextArea;
        Alert.alert("Text Content", editTextArea.text || "No text");
        break;
      case "custom_show_edit_image_properties_action":
        pdfReaderRef.current?.showEditAreaPropertiesView(editArea);
        break;
      case "custom_get_image":
        const editImageArea = editArea as CPDFEditImageArea;
        console.log(JSON.stringify(editImageArea, null, 2));
        break;
    }
  };

  /**
   * Handle widget/form operations (show properties, delete)
   */
  const handleWidgetOperation = async (identifier: string, event: any) => {
    const widget = event?.widget;
    if (!widget) return;

    switch (identifier) {
      case "custom_widget_show_options_action":
        setFormOptionsTitle("Edit Options");
        setSelectWidget(event.widget as CPDFListboxWidget | CPDFComboboxWidget);
        setFormOptionsModalVisible(true);
        break;
      case "custom_widget_show_properties_action":
        pdfReaderRef.current?.showWidgetPropertiesView(widget);
        break;
      case "custom_widget_delete_action":
        await pdfReaderRef.current?._pdfDocument.removeWidget(widget);
        break;
    }
  };

  /**
   * Main custom context menu item handler
   * Routes to specific handlers based on identifier
   */
  /**
   * Main custom context menu item handler
   * Routes to specific handlers based on identifier
   */
  const handleCustomContextMenuItemTapped = async (
    identifier: string,
    event: any
  ) => {
    console.log("Custom menu item tapped:", identifier, event);

    // Text selection events
    if (
      identifier === "custom_text_select_action" ||
      identifier === "custom_annotation_text_select_show_rect"
    ) {
      handleTextSelection(event);
      return;
    }

    // Screenshot capture
    if (identifier === "custom_screenshot_action") {
      handleScreenshotCapture(event);
      return;
    }

    // Get point coordinates
    if (identifier === "custom_event_get_point") {
      handleGetPoint(event);
      return;
    }

    // Annotation operations
    if (
      identifier === "custom_show_annotation_properties_action" ||
      identifier === "custom_annotation_delete_action" ||
      identifier === "custom_event_get_sound_annotation" ||
      identifier === "custom_link_annotation_edit_action"
    ) {
      await handleAnnotationOperation(identifier, event);
      return;
    }

    // Edit area operations
    if (
      identifier === "custom_edit_get_text" ||
      identifier === "custom_show_edit_image_properties_action" ||
      identifier === "custom_get_image"
    ) {
      handleEditAreaOperation(identifier, event);
      return;
    }

    // Widget/Form operations
    if (
      identifier === "custom_widget_show_properties_action" ||
      identifier === "custom_widget_delete_action" ||
      identifier === "custom_widget_show_options_action"
    ) {
      await handleWidgetOperation(identifier, event);
      return;
    }

    console.log(`Unknown identifier: ${identifier}`);
  };

  // ==================== Render ====================

  const renderToolbar = () => (
    <View style={styles.toolbar}>
      <HeaderBackButton onPress={handleBack} />
      <Text style={styles.toolbarTitle}>Custom Context Menu Example</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {renderToolbar()}

        <CPDFReaderView
          ref={pdfReaderRef}
          document={samplePDF}
          configuration={ComPDFKit.getDefaultConfig({
            contextMenuConfig: getContextMenuConfig(),
          })}
          onIOSClickBackPressed={handleBack}
          onCustomContextMenuItemTapped={handleCustomContextMenuItemTapped}
        />
      </View>

      <ImagePreviewModal
        visible={modalVisible}
        imageBase64={capturedImage}
        onClose={closeImageModal}
      />

      <FormOptionsModal
        visible={formOptionsModalVisible}
        title={formOptionsTitle}
        options={selectWidget ? selectWidget.options : []}
        onClose={() => {
          setFormOptionsModalVisible(false);
        }}
        onConfirm={ async (options) => {
          if (selectWidget) {
            selectWidget.update({
              options: options,
            })
            await pdfReaderRef.current?._pdfDocument.updateWidget(selectWidget);
          }
          
        }}
      />
    </SafeAreaView>
  );
};

// ==================== Styles ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFCFF",
  },
  toolbar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FAFCFF",
    paddingHorizontal: 4,
  },
  toolbarTitle: {
    flex: 1,
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    marginStart: 8,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    width: Dimensions.get("window").width * 0.9,
    maxHeight: Dimensions.get("window").height * 0.8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "bold",
  },
  imageContainer: {
    width: "100%",
    height: Dimensions.get("window").height * 0.5,
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  capturedImage: {
    width: "100%",
    height: "100%",
  },
  confirmButton: {
    backgroundColor: "#1460F3",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CPDFCustomContextMenuExampleScreen;
