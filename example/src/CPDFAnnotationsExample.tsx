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
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as RNFS from 'react-native-fs';

// Navigation
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { HeaderBackButton } from "@react-navigation/elements";

// UI Components
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";

// Document Picker
import { keepLocalCopy, pick, types } from "@react-native-documents/picker";

// ComPDFKit - Core
import PDFReaderContext, {
  CPDFReaderView,
  ComPDFKit,
  CPDFViewMode,
} from "@compdfkit_pdf_sdk/react_native";

// ComPDFKit - Annotations
import {
  CPDFAnnotation,
  CPDFAnnotationType,
  CPDFNoteAnnotation,
  CPDFInkAnnotation,
  CPDFSquareAnnotation,
  CPDFCircleAnnotation,
  CPDFLineAnnotation,
  CPDFFreeTextAnnotation,
  CPDFLinkAnnotation,
  CPDFStampAnnotation,
  CPDFImageAnnotation,
  CPDFSignatureAnnotation,
  CPDFSoundAnnotation,
  CPDFMarkupAnnotation,
} from "@compdfkit_pdf_sdk/react_native";

// ComPDFKit - Attributes & Styles
import {
  CPDFTextAttr,
  CPDFHighlightAttr,
  CPDFUnderlineAttr,
  CPDFStrikeoutAttr,
  CPDFSquigglyAttr,
  CPDFInkAttr,
  CPDFSquareAttr,
  CPDFCircleAttr,
  CPDFLineAttr,
  CPDFArrowAttr,
  CPDFFreeTextAttr,
} from "@compdfkit_pdf_sdk/react_native";

// ComPDFKit - Actions & Types
import {
  CPDFUriAction,
  CPDFGoToAction,
  CPDFLineType,
  CPDFStampType,
  CPDFStandardStamp,
  CPDFTextStamp,
  CPDFTextStampShape,
  CPDFTextStampColor,
  CPDFBorderEffectType,
  CPDFAlignment,
  CPDFDateUtil,
} from "@compdfkit_pdf_sdk/react_native";

// Local Components & Utils
import { CPDFAnnotationListScreen } from "./screens/CPDFAnnotationListScreen";
import { CPDFAnnotationToolbar } from "./screens/annotation/CPDFAnnotationToolbar";
import { CPDFFileUtil } from "./util/CPDFFileUtil";

// Types
type RootStackParamList = {
  CPDFReaderViewExample: { document?: string };
};

type CPDFReaderViewExampleScreenRouteProp = RouteProp<
  RootStackParamList,
  "CPDFReaderViewExample"
>;

// Constants
const MENU_OPTIONS = [
  "openDocument",
  "Save",
  "Get Fonts",
  "Remove All Annotations",
  "Import Annotations 1",
  "Import Annotations 2",
  "Export Annotations",
  "Get Annotations",
  "Clear Rects",
  "SaveCurrentInk",
  "Get Annotation Attr",
  "Set Annotation Attr",
  "Update Annotation",
  "Add Annotations",
] as const;

const DEFAULT_DOCUMENT = Platform.OS === "android"
  ? "file:///android_asset/PDF_Document.pdf"
  : "PDF_Document.pdf";

const TEST_XFDF_PATH = Platform.OS === "android"
  ? "file:///android_asset/test.xfdf"
  : "test.xfdf";

/**
 * Main component for PDF Annotations Example
 */
const CPDFAnnotationsExampleScreen = () => {
  // Refs & State
  const pdfReaderRef = useRef<CPDFReaderView>(null);
  const [pdfReader, setPdfReader] = useState<CPDFReaderView | null>(null);
  const [annotationModalVisible, setAnnotationModalVisible] = useState(false);
  const [annotationData, setAnnotationData] = useState<CPDFAnnotation[]>([]);
  
  // Navigation
  const navigation = useNavigation();
  const route = useRoute<CPDFReaderViewExampleScreenRouteProp>();
  
  const [samplePDF] = useState(route.params?.document || DEFAULT_DOCUMENT);

  // ==================== Document Operations ====================
  
  /**
   * Save the current PDF document
   */
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

  /**
   * Open a new document
   */
  const handleOpenDocument = async () => {
    const document = await ComPDFKit.pickFile();
    if (document) {
      await pdfReaderRef.current?._pdfDocument.open(document);
    }
  };

  // ==================== Annotation Operations ====================

  /**
   * Remove all annotations from the document
   */
  const handleRemoveAllAnnotations = async () => {
    const removeResult = await pdfReaderRef.current?._pdfDocument.removeAllAnnotations();
    console.log("ComPDFKitRN removeAllAnnotations:", removeResult);
  };

  /**
   * Import annotations from a user-selected xfdf file
   */
  const handleImportAnnotationsFromFile = async () => {
    try {
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
          const importResult = await pdfReaderRef.current?._pdfDocument.importAnnotations(uri);
          console.log("ComPDFKitRN importAnnotations:", importResult);
        } else {
          console.log("ComPDFKitRN Please select a valid xfdf or xml file");
        }
      }
    } catch (err) {
      console.error("Error importing annotations:", err);
    }
  };

  /**
   * Import annotations from bundled assets
   */
  const handleImportAnnotationsFromAssets = async () => {
    const importResult = await pdfReaderRef.current?._pdfDocument.importAnnotations(TEST_XFDF_PATH);
    console.log("ComPDFKitRN importAnnotations:", importResult);
  };

  /**
   * Export annotations to xfdf file
   */
  const handleExportAnnotations = async () => {
    const exportXfdfFilePath = await pdfReaderRef.current?._pdfDocument.exportAnnotations();
    console.log("ComPDFKitRN exportAnnotations:", exportXfdfFilePath);
  };

  /**
   * Get all annotations from the document and display them
   */
  const handleGetAnnotations = async () => {
    const pageCount = await pdfReaderRef!.current!._pdfDocument.getPageCount();
    let allAnnotations: CPDFAnnotation[] = [];
    
    for (let i = 0; i < pageCount; i++) {
      const page = pdfReaderRef?.current?._pdfDocument.pageAtIndex(i);
      const annotations = await page?.getAnnotations();
      if (annotations) {
        allAnnotations = allAnnotations.concat(annotations);
      }
    }
    
    // Log freetext annotations for debugging
    try {
      for (const annot of allAnnotations) {
        if (annot.type === "freetext") {
          console.log(JSON.stringify(annot, null, 2));
        }
      }
    } catch (e) {
      console.error("Error logging annotations:", e);
    }

    setAnnotationData(allAnnotations);
    setAnnotationModalVisible(true);
  };

  // ==================== Viewer Operations ====================

  /**
   * Clear display rectangles
   */
  const handleClearRects = async () => {
    await pdfReaderRef.current?.clearDisplayRect();
  };

  /**
   * Save current ink annotation
   */
  const handleSaveCurrentInk = async () => {
    const saveInkResult = await pdfReaderRef.current?.saveCurrentInk();
    console.log("ComPDFKitRN saveCurrentInk:", saveInkResult);
  };

  // ==================== Font Operations ====================

  /**
   * Get available fonts
   */
  const handleGetFonts = async () => {
    const fonts = await ComPDFKit.getFonts();
    console.log("ComPDFKitRN getFonts: ---->");
    console.log(JSON.stringify(fonts, null, 2));
  };

  // ==================== Annotation Attributes ====================

  /**
   * Get default annotation styles
   */
  const handleGetAnnotationAttr = async () => {
    const annotationsAttr = await pdfReaderRef.current?.fetchDefaultAnnotationStyle();
    console.log("ComPDFKitRN fetchDefaultAnnotationStyle: --------->");
    console.log(JSON.stringify(annotationsAttr, null, 2));
  };

  /**
   * Set default annotation styles for all annotation types
   */
  const handleSetAnnotationAttr = async () => {
    const noteAttr: CPDFTextAttr = {
      type: "note",
      color: "#FF0000",
      alpha: 100,
    };
    await pdfReaderRef.current?.updateDefaultAnnotationStyle(noteAttr);

    const highlight: CPDFHighlightAttr = {
      type: "highlight",
      color: "#00FF00",
      alpha: 128,
    };
    await pdfReaderRef.current?.updateDefaultAnnotationStyle(highlight);

    const underline: CPDFUnderlineAttr = {
      type: "underline",
      color: "#45D9A8",
      alpha: 128,
    };
    await pdfReaderRef.current?.updateDefaultAnnotationStyle(underline);

    const strikeoutAttr: CPDFStrikeoutAttr = {
      type: "strikeout",
      color: "#0000FF",
      alpha: 128,
    };
    await pdfReaderRef.current?.updateDefaultAnnotationStyle(strikeoutAttr);

    const squigglyAttr: CPDFSquigglyAttr = {
      type: "squiggly",
      color: "#FFA500",
      alpha: 128,
    };
    await pdfReaderRef.current?.updateDefaultAnnotationStyle(squigglyAttr);

    const inkAttr: CPDFInkAttr = {
      type: "ink",
      color: "#800080",
      alpha: 255,
      borderWidth: 5,
    };
    await pdfReaderRef.current?.updateDefaultAnnotationStyle(inkAttr);

    const squareAttr: CPDFSquareAttr = {
      type: "square",
      borderColor: "#1460F3",
      fillColor: "#FFFF00",
      colorAlpha: 128,
      borderWidth: 3,
      borderStyle: {
        style: "dashed",
        dashGap: 4,
      },
    };
    await pdfReaderRef.current?.updateDefaultAnnotationStyle(squareAttr);

    const circleAttr: CPDFCircleAttr = {
      type: "circle",
      borderColor: "#1460F3",
      fillColor: "#00FFFF",
      colorAlpha: 128,
      borderWidth: 5,
      borderStyle: {
        style: "dashed",
        dashGap: 6,
      },
    };
    await pdfReaderRef.current?.updateDefaultAnnotationStyle(circleAttr);

    const lineAttr: CPDFLineAttr = {
      type: "line",
      borderColor: "#EC14F3",
      borderAlpha: 200,
    };
    await pdfReaderRef.current?.updateDefaultAnnotationStyle(lineAttr);

    const arrowAttr: CPDFArrowAttr = {
      type: "arrow",
      borderColor: "#FF8D37",
      startLineType: CPDFLineType.CLOSE_ARROW,
      tailLineType: CPDFLineType.NONE,
      borderAlpha: 200,
    };
    await pdfReaderRef.current?.updateDefaultAnnotationStyle(arrowAttr);

    const freeTextAttr: CPDFFreeTextAttr = {
      type: "freetext",
      fontColor: "#F1A22A",
      familyName: "Times",
      styleName: "Bold",
    };
    await pdfReaderRef.current?.updateDefaultAnnotationStyle(freeTextAttr);

    console.log("ComPDFKitRN set default annotation attributes completed.");
  };

  // ==================== Menu Handler ====================

  /**
   * Handle menu item selection
   */
  const handleMenuItemPress = async (action: string) => {
    switch (action) {
      case "Save":
        handleSave();
        break;
      case "openDocument":
        handleOpenDocument();
        break;
      case "Remove All Annotations":
        handleRemoveAllAnnotations();
        break;
      case "Import Annotations 1":
        handleImportAnnotationsFromFile();
        break;
      case "Import Annotations 2":
        handleImportAnnotationsFromAssets();
        break;
      case "Export Annotations":
        handleExportAnnotations();
        break;
      case "Get Annotations":
        handleGetAnnotations();
        break;
      case "Clear Rects":
        handleClearRects();
        break;
      case "SaveCurrentInk":
        handleSaveCurrentInk();
        break;
      case "Get Fonts":
        handleGetFonts();
        break;
      case "Get Annotation Attr":
        handleGetAnnotationAttr();
        break;
      case "Set Annotation Attr":
        handleSetAnnotationAttr();
        break;
      case "Update Annotation":
        updateAnnotation();
        break;
      case "Add Annotations":
        addAnnotations();
        break;
      default:
        break;
    }
  };

  // ==================== Update Annotations ====================

  /**
   * Update existing annotations in the document
   */
  const updateAnnotation = async () => {
    const document = pdfReaderRef?.current?._pdfDocument;
    if (!document) {
      return;
    }
    
    const page = document.pageAtIndex(0);
    const annotations = await page?.getAnnotations();
    
    if (!annotations || annotations.length === 0) {
      return;
    }

    for (const annot of annotations) {
      switch (annot.type) {
        case "note":
          updateNoteAnnotation(document, annot as CPDFNoteAnnotation);
          break;
        case "highlight":
        case "strikeout":
        case "underline":
        case "squiggly":
          updateMarkupAnnotation(document, annot as CPDFMarkupAnnotation);
          break;
        case "ink":
          updateInkAnnotation(document, annot as CPDFInkAnnotation);
          break;
        case "square":
          updateSquareAnnotation(document, annot as CPDFSquareAnnotation);
          break;
        case "circle":
          updateCircleAnnotation(document, annot as CPDFCircleAnnotation);
          break;
        case "line":
          updateLineAnnotation(document, annot as CPDFLineAnnotation);
          break;
        case "arrow":
          updateArrowAnnotation(document, annot as CPDFLineAnnotation);
          break;
        case "freetext":
          updateFreeTextAnnotation(document, annot as CPDFFreeTextAnnotation);
          break;
        case "link":
          updateLinkAnnotation(document, annot as CPDFLinkAnnotation);
          break;
        default:
          break;
      }
    }
  };

  const updateNoteAnnotation = async (document: any, noteAnnot: CPDFNoteAnnotation) => {
    noteAnnot.update({
      title: "Updated via update()",
      content: "This note annotation has been updated.",
      color: "#338AFF",
      alpha: 180,
    });
    await document.updateAnnotation(noteAnnot);
  };

  const updateMarkupAnnotation = async (document: any, markupAnnot: CPDFMarkupAnnotation) => {
    markupAnnot.update({
      title: `Updated ${markupAnnot.type} Annotation`,
      content: `This ${markupAnnot.type} annotation has been updated.`,
      color: "#FF33AA",
      alpha: 180,
    });
    await document.updateAnnotation(markupAnnot);
  };

  const updateInkAnnotation = async (document: any, inkAnnot: CPDFInkAnnotation) => {
    inkAnnot.update({
      title: "Updated Ink Annotation",
      content: "This ink annotation has been updated.",
      color: "#33FFAA",
      alpha: 200,
      borderWidth: 8,
    });
    await document.updateAnnotation(inkAnnot);
  };

  const updateSquareAnnotation = async (document: any, squareAnnot: CPDFSquareAnnotation) => {
    squareAnnot.update({
      title: "Updated Square Annotation",
      content: "This square annotation has been updated.",
      borderColor: "#FF5733",
      fillColor: "#33FF57",
      fillAlpha: 150,
      borderWidth: 4,
      bordEffectType: "dashed",
      dashGap: 6,
    });
    await document.updateAnnotation(squareAnnot);
  };

  const updateCircleAnnotation = async (document: any, circleAnnot: CPDFCircleAnnotation) => {
    circleAnnot.update({
      title: "Updated Circle Annotation",
      content: "This circle annotation has been updated.",
      borderColor: "#3357FF",
      fillColor: "#FF33A8",
      fillAlpha: 150,
      borderWidth: 4,
      bordEffectType: "dashed",
      dashGap: 10,
    });
    await document.updateAnnotation(circleAnnot);
  };

  const updateLineAnnotation = async (document: any, lineAnnot: CPDFLineAnnotation) => {
    lineAnnot.update({
      title: "Updated Line Annotation",
      content: "This line annotation has been updated.",
      borderColor: "#FF33D4",
      borderAlpha: 220,
      fillColor: "#33FFF3",
      fillAlpha: 180,
      borderWidth: 10,
      dashGap: 0,
    });
    await document.updateAnnotation(lineAnnot);
  };

  const updateArrowAnnotation = async (document: any, arrowAnnot: CPDFLineAnnotation) => {
    arrowAnnot.update({
      title: "AAA",
      content: "AAA",
      borderColor: "#B8FF33",
      borderAlpha: 255,
      fillColor: "#FF3333",
      fillAlpha: 255,
      borderWidth: 10,
      dashGap: 0,
    });
    await document.updateAnnotation(arrowAnnot);
  };

  const updateFreeTextAnnotation = async (document: any, freeTextAnnot: CPDFFreeTextAnnotation) => {
    freeTextAnnot.update({
      title: "Updated FreeText Annotation",
      content: "This free text annotation has been updated.",
      alignment: "center",
      textAttribute: {
        fontSize: 16,
        familyName: "Times",
        styleName: "Bold",
        color: "#52FF33",
      },
      alpha: 255,
    });
    await document.updateAnnotation(freeTextAnnot);
  };

  const updateLinkAnnotation = async (document: any, linkAnnot: CPDFLinkAnnotation) => {
    linkAnnot.update({
      title: "Updated Link Annotation",
      content: "This link annotation has been updated.",
      action: CPDFGoToAction.toPage(1),
    });
    await document.updateAnnotation(linkAnnot);
  };

  const addAnnotations = async () => {
    const document = pdfReaderRef?.current?._pdfDocument;
    if (!document) {
      return;
    }

    const createDate = new Date(1735696800000);
    const imageBase64 = "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";
    const textStampDate = CPDFDateUtil.getTextStampDate({ timeSwitch: false, dateSwitch: true });

    const soundPath = await CPDFFileUtil.copyAssetToDevice("Bird.wav", "Bird.wav", `${RNFS.DocumentDirectoryPath}/assets/sounds`);
    console.log("Sound Path: ", soundPath);
    const exampleAnnotations: CPDFAnnotation[] = [
      new CPDFNoteAnnotation({
        page: 0,
        createDate,
        title: "ComPDFKit-ReactNative",
        content: "This is Note Annotation",
        rect: { left: 260, top: 740, right: 300, bottom: 700 },
      }),
      new CPDFMarkupAnnotation({
        type: CPDFAnnotationType.HIGHLIGHT,
        page: 1,
        createDate,
        title: "ComPDFKit-ReactNative",
        content: "This is Highlight Annotation",
        rect: { left: 55, top: 800, right: 180, bottom: 770 },
        markedText: "Annotations",
        color: "#00aa00",
        alpha: 200,
      }),
      new CPDFMarkupAnnotation({
        type: CPDFAnnotationType.STRIKEOUT,
        page: 1,
        createDate,
        title: "ComPDFKit-ReactNative",
        content: "This is Strikeout Annotation",
        rect: { left: 60, top: 557, right: 438, bottom: 545 },
        markedText: "Annotate, Strikeout, and Underline",
        color: "#448aff",
        alpha: 200,
      }),
      new CPDFMarkupAnnotation({
        type: CPDFAnnotationType.SQUIGGLY,
        page: 1,
        createDate,
        title: "ComPDFKit-ReactNative",
        content: "This is Squiggly Annotation",
        rect: { left: 58, top: 746, right: 529, bottom: 703 },
        markedText: "Annotate, collaborate and share reports,",
        color: "#ff5722",
        alpha: 200,
      }),
      new CPDFMarkupAnnotation({
        type: CPDFAnnotationType.UNDERLINE,
        page: 1,
        createDate,
        title: "ComPDFKit-ReactNative",
        content: "This is Underline Annotation",
        rect: { left: 63, top: 437, right: 528, bottom: 397 },
        markedText: "Annotate, collaborate and share reports,",
        color: "#ffc107",
        alpha: 255,
      }),

      new CPDFSquareAnnotation({
        page: 0,
        title: "Square-A",
        content: "This is a square annotation with long content.",
        createDate,
        rect: { left: 20, top: 200, right: 200, bottom: 100 },
        borderWidth: 5,
        borderColor: "#ff5722",
        fillColor: "#8bc34a",
        bordEffectType: CPDFBorderEffectType.SOLID,
        borderAlpha: 200,
        dashGap: 0,
        fillAlpha: 100,
      }),
      new CPDFCircleAnnotation({
        page: 0,
        title: "Circle-A",
        content: "This is a circle annotation.",
        createDate,
        rect: { left: 220, top: 200, right: 360, bottom: 100 },
        borderWidth: 5,
        borderColor: "#448aff",
        fillColor: "#ffeb3b",
        bordEffectType: CPDFBorderEffectType.SOLID,
        borderAlpha: 255,
        fillAlpha: 120,
        dashGap: 0,
      }),
      new CPDFFreeTextAnnotation({
        title: "Freetext-A",
        page: 0,
        content: "Hello, ComPDFKit!",
        createDate,
        rect: { left: 30, top: 750, right: 230, bottom: 700 },
        textAttribute: {
          color: "#000000",
          familyName: "Times",
          styleName: "Bold",
          fontSize: 20,
        },
        alpha: 255,
        alignment: CPDFAlignment.LEFT,
      }),
      new CPDFLineAnnotation({
        title: "Line-A",
        page: 1,
        content: "This is a line annotation.",
        createDate,
        borderWidth: 6,
        borderColor: "#55FF26",
        borderAlpha: 255,
        fillColor: "#000000",
        fillAlpha: 255,
        points: [
          [504, 219],
          [320, 88],
        ],
      }),
      new CPDFLineAnnotation({
        title: "Arrow-A",
        page: 1,
        content: "This is an arrow annotation.",
        createDate,
        points: [
          [288, 342],
          [159, 209],
        ],
        borderWidth: 6,
        borderColor: "#009688",
        borderAlpha: 255,
        fillColor: "#009688",
        fillAlpha: 255,
        lineHeadType: CPDFLineType.SQUARE,
        lineTailType: CPDFLineType.OPEN_ARROW,
        dashGap: 0,
      }),
      new CPDFStampAnnotation({
        page: 0,
        title: "Stamp-A",
        content: "Approved",
        createDate,
        rect: { left: 20, top: 300, right: 200, bottom: 260 },
        stampType: CPDFStampType.STANDARD,
        standardStamp: CPDFStandardStamp.COMPLETED,
      }),
      new CPDFStampAnnotation({
        page: 0,
        title: "Stamp-A",
        content: "Custom Text Stamp",
        createDate,
        rect: { left: 220, top: 300, right: 350, bottom: 260 },
        stampType: CPDFStampType.TEXT,
        textStamp: new CPDFTextStamp({
          content: "Test Text",
          date: textStampDate,
          shape: CPDFTextStampShape.rightTriangle,
          color: CPDFTextStampColor.red,
        }),
      }),
      new CPDFImageAnnotation({
        page: 0,
        title: "Stamp-Image",
        content: "Custom Image Stamp",
        createDate,
        rect: { left: 380, top: 420, right: 550, bottom: 260 },
        image: imageBase64,
      }),
      new CPDFSignatureAnnotation({
        page: 1,
        title: "Stamp-Image",
        content: "Signature",
        createDate,
        rect: { left: 380, top: 420, right: 550, bottom: 260 },
        image: imageBase64,
      }),
      new CPDFLinkAnnotation({
        title: "ComPDFKit-ReactNative",
        page: 0,
        createDate,
        content: "Link Annotation",
        rect: { left: 248, top: 799, right: 407, bottom: 732 },
        action: CPDFUriAction.createWeb("https://www.compdf.com"),
      }),

      new CPDFLinkAnnotation({
        title: "ComPDFKit-ReactNative",
        page: 0,
        createDate,
        content: "Link Annotation",
        rect: { left: 374, top: 304, right: 530, bottom: 236 },
        action: CPDFGoToAction.toPage(2),
      }),
      new CPDFLinkAnnotation({
        title: "ComPDFKit-ReactNative",
        page: 0,
        content: "Link Annotation",
        createDate,
        rect: { left: 374, top: 199, right: 529, bottom: 121 },
        action: CPDFUriAction.createEmail("support@compdf.com"),
      }),
      new CPDFSoundAnnotation({
        title: "ComPDFKit-ReactNative",
        page: 0,
        content: "Sound Annotation",
        createDate,
        rect: { left: 75, top: 607, right: 119, bottom: 563 },
        soundPath,
      }),
      new CPDFInkAnnotation({
        page: 0,
        createDate,
        type: CPDFAnnotationType.INK,
        color: "#ff7043",
        borderWidth: 10,
        inkPath: [
          [
            [176.43, 72.22],
            [206.94, 78.95],
            [217.57, 82.21],
            [227.0, 85.49],
            [232.42, 87.92],
            [243.73, 91.83],
            [254.87, 97.98],
            [269.0, 104.22],
            [281.4, 110.47],
            [294.15, 117.05],
            [306.69, 123.26],
            [319.28, 129.37],
            [330.75, 135.57],
            [339.93, 140.95],
            [345.54, 144.18],
            [349.22, 146.23],
            [351.26, 147.44],
            [352.5, 147.42],
            [352.0, 144.9],
            [350.29, 142.36],
            [346.96, 138.59],
            [341.56, 133.63],
            [333.22, 126.14],
            [324.5, 117.81],
            [318.84, 109.6],
            [314.76, 103.47],
            [312.33, 96.86],
            [310.21, 92.71],
            [309.46, 89.06],
            [307.8, 85.29],
            [307.42, 81.58],
            [307.42, 77.51],
            [307.86, 74.61],
            [309.53, 71.71],
            [312.04, 69.7],
            [315.39, 68.91],
            [321.25, 68.91],
            [330.45, 71.91],
            [341.66, 77.0],
            [353.66, 81.84],
            [367.46, 87.3],
            [380.29, 94.45],
            [395.47, 102.62],
            [412.02, 110.93],
            [430.53, 120.95],
            [446.68, 131.62],
            [466.8, 140.72],
          ],
        ],
      }),
    ];

    await document.addAnnotations(exampleAnnotations);
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
        <Text style={styles.toolbarTitle}>Annotations Example</Text>

        <Menu>
          <MenuTrigger>
            <Image
              source={require("../assets/more.png")}
              style={{ width: 24, height: 24, marginEnd: 8 }}
            />
          </MenuTrigger>

          <MenuOptions>
            {MENU_OPTIONS.map((option, index) => (
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
            onIOSClickBackPressed={() => {
              console.log("onIOSClickBackPressed");
              navigation.goBack();
            }}
            configuration={ComPDFKit.getDefaultConfig({
              modeConfig: {
                initialViewMode: CPDFViewMode.ANNOTATIONS,
                uiVisibilityMode: "automatic",
              },
              toolbarConfig: {
                annotationToolbarVisible: true,
              },
              annotationsConfig: {
                initAttribute: {
                  freeText: {
                    type: "freetext",
                    fontSize: 18,
                    familyName: "Times",
                    styleName: "Bold",
                  },
                },
              },
            })}
          />
          <CPDFAnnotationToolbar />
          <CPDFAnnotationListScreen
            visible={annotationModalVisible}
            annotations={annotationData}
            onClose={() => {
              setAnnotationModalVisible(false);
            }}
            onDelete={async (annotation) => {
              // const page = pdfReaderRef.current?._pdfDocument.pageAtIndex(annotation.page);
              // page?.removeAnnotation(annotation);
              await pdfReaderRef.current?._pdfDocument.removeAnnotation(
                annotation
              );
              setAnnotationModalVisible(false);
            }}
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

export default CPDFAnnotationsExampleScreen;
