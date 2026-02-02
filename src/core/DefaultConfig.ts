/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { Platform } from "react-native";
import { CPDFConfiguration } from "../configuration/CPDFConfiguration";
import {
  CPDFAlignment,
  CPDFAnnotationType,
  CPDFBorderStyle,
  CPDFCheckStyle,
  CPDFConfigTool,
  CPDFContentEditorType,
  CPDFDisplayMode,
  CPDFLineType,
  CPDFThemeMode,
  CPDFThemes,
  CPDFToolbarAction,
  CPDFViewMode,
  CPDFWidgetType,
} from "../configuration/CPDFOptions";
import { botaMenus, menus, mergeDeep } from "./ConfigHelpers";
import { CPDFUIStyle } from "../configuration/config/CPDFReaderViewConfig";

const DEFAULT_ANDROID_TOOLBAR_LEFT: CPDFToolbarAction[] = [];

const DEFAULT_ANDROID_TOOLBAR_RIGHT: CPDFToolbarAction[] = [
  CPDFToolbarAction.THUMBNAIL,
  CPDFToolbarAction.SEARCH,
  CPDFToolbarAction.BOTA,
  CPDFToolbarAction.MENU,
];

const DEFAULT_IOS_TOOLBAR_LEFT: CPDFToolbarAction[] = [
  CPDFToolbarAction.BACK,
  CPDFToolbarAction.THUMBNAIL,
];

const DEFAULT_IOS_TOOLBAR_RIGHT: CPDFToolbarAction[] = [
  CPDFToolbarAction.SEARCH,
  CPDFToolbarAction.BOTA,
  CPDFToolbarAction.MENU,
];

const DEFAULT_IOS_UI_STYLE : CPDFUIStyle = {
        selectTextColor: "#00000033",
        bookmarkIcon: "",
        icons: {
          selectTextIcon: "",
          selectTextLeftIcon: "",
          selectTextRightIcon: "",
          rotationAnnotationIcon: "",
        },
        displayPageRect: {
          fillColor: "#1460F34D",
          borderColor: "#6499FF",
          borderWidth: 5,
          borderDashPattern: [10, 0],
        },
        screenshot: {
          outsideColor: "#00000000",
          fillColor: "#00000000",
          borderColor: "#6499FF",
          borderWidth: 2,
          borderDashPattern: [8, 5],
        },
        formPreview: {
          style: "fill",
          color: "#1460F34D",
          strokeWidth: 2,
        },
        defaultBorderStyle: {
          borderColor: "#888888FF",
          borderWidth: 1,
          borderDashPattern: [8, 5],
        },
        focusBorderStyle: {
          nodeColor: "#6499FF",
          borderColor: "#6499FF",
          borderWidth: 1,
          borderDashPattern: [8, 5],
        },
        cropImageStyle: {
          borderColor: "#6499FF",
          borderWidth: 2,
          borderDashPattern: [8, 5],
        },
      };

const DEFAULT_ANDROID_UI_STYLE: CPDFUIStyle = {
  ...DEFAULT_IOS_UI_STYLE,
  defaultBorderStyle: {
    borderColor: "#888888FF",
    borderWidth: 2,
    borderDashPattern: [20, 10],
  },
  focusBorderStyle: {
    nodeColor: "#6499FF",
    borderColor: "#6499FF",
    borderWidth: 2,
    borderDashPattern: [20, 10],
  },
  cropImageStyle: {
    borderColor: "#6499FF",
    borderWidth: 2,
    borderDashPattern: [20, 10],
  },
};


export function getDefaultConfig(
  overrides: Partial<CPDFConfiguration> = {}
): string {
  const isAndroid = Platform.OS === "android";
  const defaultConfig: CPDFConfiguration = {
    modeConfig: {
      initialViewMode: CPDFViewMode.VIEWER,
      uiVisibilityMode: "automatic",
      availableViewModes: [
        CPDFViewMode.VIEWER,
        CPDFViewMode.ANNOTATIONS,
        CPDFViewMode.CONTENT_EDITOR,
        CPDFViewMode.FORMS,
        CPDFViewMode.SIGNATURES,
      ],
    },
    toolbarConfig: {
      mainToolbarVisible: true,
      annotationToolbarVisible: true,
      showInkToggleButton: true,
      toolbarLeftItems: isAndroid
        ? DEFAULT_ANDROID_TOOLBAR_LEFT
        : DEFAULT_IOS_TOOLBAR_LEFT,
      toolbarRightItems: isAndroid
        ? DEFAULT_ANDROID_TOOLBAR_RIGHT
        : DEFAULT_IOS_TOOLBAR_RIGHT,
      availableMenus: [
        CPDFToolbarAction.VIEW_SETTINGS,
        CPDFToolbarAction.DOCUMENT_EDITOR,
        CPDFToolbarAction.DOCUMENT_INFO,
        CPDFToolbarAction.WATERMARK,
        CPDFToolbarAction.SECURITY,
        CPDFToolbarAction.FLATTENED,
        CPDFToolbarAction.SAVE,
        CPDFToolbarAction.SHARE,
        CPDFToolbarAction.OPEN_DOCUMENT,
        CPDFToolbarAction.SNIP,
      ],
    },
    annotationsConfig: {
      annotationAuthor: "",
      autoShowSignPicker: true,
      autoShowLinkDialog: true,
      autoShowPicPicker: true,
      autoShowStampPicker: true,
      availableTypes: [
        CPDFAnnotationType.NOTE,
        CPDFAnnotationType.HIGHLIGHT,
        CPDFAnnotationType.UNDERLINE,
        CPDFAnnotationType.SQUIGGLY,
        CPDFAnnotationType.STRIKEOUT,
        CPDFAnnotationType.INK,
        CPDFAnnotationType.INK_ERASER,
        CPDFAnnotationType.CIRCLE,
        CPDFAnnotationType.SQUARE,
        CPDFAnnotationType.ARROW,
        CPDFAnnotationType.LINE,
        CPDFAnnotationType.FREETEXT,
        CPDFAnnotationType.SIGNATURE,
        CPDFAnnotationType.STAMP,
        CPDFAnnotationType.PICTURES,
        CPDFAnnotationType.LINK,
        CPDFAnnotationType.SOUND,
      ],
      availableTools: [
        CPDFConfigTool.SETTING,
        CPDFConfigTool.UNDO,
        CPDFConfigTool.REDO,
      ],
      initAttribute: {
        note: {
          type: "note",
          color: "#1460F3",
          alpha: 255,
        },
        highlight: {
          type: "highlight",
          color: "#1460F3",
          alpha: 77,
        },
        underline: {
          type: "underline",
          color: "#1460F3",
          alpha: 77,
        },
        squiggly: {
          type: "squiggly",
          color: "#1460F3",
          alpha: 77,
        },
        strikeout: {
          type: "strikeout",
          color: "#1460F3",
          alpha: 77,
        },
        ink: {
          type: "ink",
          color: "#1460F3",
          alpha: 100,
          borderWidth: 10,
        },
        square: {
          type: "square",
          fillColor: "#1460F3",
          borderColor: "#000000",
          colorAlpha: 128,
          borderWidth: 2,
          borderStyle: {
            style: CPDFBorderStyle.SOLID,
            dashGap: 0.0,
          },
        },
        circle: {
          type: "circle",
          fillColor: "#1460F3",
          borderColor: "#000000",
          colorAlpha: 128,
          borderWidth: 2,
          borderStyle: {
            style: CPDFBorderStyle.SOLID,
            dashGap: 0.0,
          },
        },
        line: {
          type: "line",
          borderColor: "#1460F3",
          borderAlpha: 100,
          borderWidth: 5,
          borderStyle: {
            style: CPDFBorderStyle.SOLID,
            dashGap: 0.0,
          },
        },
        arrow: {
          type: "arrow",
          borderColor: "#1460F3",
          borderAlpha: 100,
          borderWidth: 5,
          borderStyle: {
            style: CPDFBorderStyle.SOLID,
            dashGap: 0.0,
          },
          startLineType: CPDFLineType.NONE,
          tailLineType: CPDFLineType.OPEN_ARROW,
        },
        freeText: {
          type: "freetext",
          fontColor: "#000000",
          fontColorAlpha: 255,
          fontSize: 30,
          alignment: CPDFAlignment.LEFT,
          familyName: "Helvetica",
          styleName: "Regular",
        },
      },
    },
    contentEditorConfig: {
      availableTypes: [
        CPDFContentEditorType.EDITOR_TEXT,
        CPDFContentEditorType.EDITOR_IMAGE,
      ],
      availableTools: [
        CPDFConfigTool.SETTING,
        CPDFConfigTool.UNDO,
        CPDFConfigTool.REDO,
      ],
      initAttribute: {
        text: {
          fontColor: "#000000",
          fontColorAlpha: 255,
          fontSize: 30,
          familyName: "Helvetica",
          styleName: "Regular",
          alignment: CPDFAlignment.LEFT,
        },
      },
    },
    formsConfig: {
      showCreateComboBoxOptionsDialog: true,
      showCreateListBoxOptionsDialog: true,
      showCreatePushButtonOptionsDialog: true,
      availableTypes: [
        CPDFWidgetType.TEXT_FIELD,
        CPDFWidgetType.CHECKBOX,
        CPDFWidgetType.RADIO_BUTTON,
        CPDFWidgetType.LISTBOX,
        CPDFWidgetType.COMBOBOX,
        CPDFWidgetType.SIGNATURES_FIELDS,
        CPDFWidgetType.PUSH_BUTTON,
      ],
      availableTools: [CPDFConfigTool.UNDO, CPDFConfigTool.REDO],
      initAttribute: {
        textField: {
          type: "textField",
          fillColor: "#DDE9FF",
          borderColor: "#1460F3",
          borderWidth: 2,
          fontColor: "#000000",
          fontSize: 20,
          alignment: CPDFAlignment.LEFT,
          multiline: true,
          familyName: "Helvetica",
          styleName: "Regular",
        },
        checkBox: {
          type: "checkBox",
          fillColor: "#DDE9FF",
          borderColor: "#1460F3",
          borderWidth: 2,
          checkedColor: "#43474D",
          isChecked: false,
          checkedStyle: CPDFCheckStyle.CHECK,
        },
        radioButton: {
          type: "radioButton",
          fillColor: "#DDE9FF",
          borderColor: "#1460F3",
          borderWidth: 2,
          checkedColor: "#43474D",
          isChecked: false,
          checkedStyle: CPDFCheckStyle.CIRCLE,
        },
        listBox: {
          type: "listBox",
          fillColor: "#DDE9FF",
          borderColor: "#1460F3",
          borderWidth: 2,
          fontColor: "#000000",
          fontSize: 20,
          familyName: "Helvetica",
          styleName: "Regular",
        },
        comboBox: {
          type: "comboBox",
          fillColor: "#DDE9FF",
          borderColor: "#1460F3",
          borderWidth: 2,
          fontColor: "#000000",
          fontSize: 20,
          familyName: "Helvetica",
          styleName: "Regular",
        },
        pushButton: {
          type: "pushButton",
          fillColor: "#DDE9FF",
          borderColor: "#1460F3",
          borderWidth: 2,
          fontColor: "#000000",
          fontSize: 20,
          title: "Button",
          familyName: "Helvetica",
          styleName: "Regular",
        },
        signaturesFields: {
          type: "signaturesFields",
          fillColor: "#DDE9FF",
          borderColor: "#000000",
          borderWidth: 2,
        },
      },
    },
    readerViewConfig: {
      linkHighlight: true,
      formFieldHighlight: true,
      displayMode: CPDFDisplayMode.SINGLE_PAGE,
      continueMode: true,
      verticalMode: true,
      cropMode: false,
      themes: CPDFThemes.LIGHT,
      enableSliderBar: true,
      enablePageIndicator: true,
      pageScale: 1.0,
      margins: [0, 0, 0, 0],
      pageSpacing: 10,
      pageSameWidth: true,
      annotationsVisible: true,
      enableCreateEditTextInput: true,
      enableCreateImagePickerDialog: true,
      enableDoubleTapZoom: false,
      uiStyle: isAndroid ? DEFAULT_ANDROID_UI_STYLE : DEFAULT_IOS_UI_STYLE,
    },
    global: {
      themeMode: CPDFThemeMode.SYSTEM,
      fileSaveExtraFontSubset: true,
      useSaveIncremental: true,
      watermark: {
        types: ["text", "image"],
        saveAsNewFile: true,
        text: "Watermark",
        textSize: 40,
        textColor: "#000000",
        opacity: 255,
        rotation: -45,
        isFront: false,
        isTilePage: false,
      },
      signatureType: "manual",
      enableExitSaveTips: false,
      thumbnail: {
        editMode: true,
      },
      enableErrorTips: true,
      bota: {
        tabs: ["outline", "bookmark", "annotations"],
        menus: {
          annotations: {
            global: botaMenus(
              "importAnnotation",
              "exportAnnotation",
              "removeAllAnnotation",
              "removeAllReply"
            ),
            item: botaMenus(
              {
                id: "reviewStatus",
                subMenus: [
                  "accepted",
                  "rejected",
                  "cancelled",
                  "completed",
                  "none",
                ],
              },
              "markedStatus",
              { id: "more", subMenus: ["addReply", "viewReply", "delete"] }
            ),
          },
        },
      },
      search: {
        normalKeyword: {
          borderColor: "#00000000",
          fillColor: "#FFFF0077",
        },
        focusKeyword: {
          borderColor: "#00000000",
          fillColor: "#FD7338CC",
        },
      },
      pageEditor: {
        menus: [
          "insertPage",
          "replacePage",
          "extractPage",
          "copyPage",
          "rotatePage",
          "deletePage",
        ],
      },
      pencilMenus: ["touch", "discard", "save"],
    },
    contextMenuConfig: {
      fontSize: 14,
      padding: [0, 0, 0, 0],
      iconSize: 36,
      global: {
        screenshot: menus("exit", "share"),
      },
      viewMode: {
        textSelect: menus("copy"),
      },
      annotationMode: {
        textSelect: menus(
          "copy",
          "highlight",
          "underline",
          "strikeout",
          "squiggly"
        ),
        longPressContent: menus("paste", "note", "textBox", "stamp", "image"),
        markupContent: menus(
          "properties",
          "note",
          "reply",
          "viewReply",
          "delete"
        ),
        soundContent: menus("reply", "viewReply", "play", "record", "delete"),
        inkContent: menus("properties", "note", "reply", "viewReply", "delete"),
        shapeContent: menus(
          "properties",
          "note",
          "reply",
          "viewReply",
          "delete"
        ),
        freeTextContent: menus(
          "properties",
          "edit",
          "reply",
          "viewReply",
          "delete"
        ),
        signStampContent: menus("signHere", "delete", "rotate"),
        stampContent: menus("note", "reply", "viewReply", "delete", "rotate"),
        linkContent: menus("edit", "delete"),
      },
      contentEditorMode: {
        editTextAreaContent: menus(
          "properties",
          "edit",
          "cut",
          "copy",
          "delete"
        ),
        editSelectTextContent: menus(
          "properties",
          { key: "opacity", subItems: ["25%", "50%", "75%", "100%"] },
          "cut",
          "copy",
          "delete"
        ),
        editTextContent: menus("select", "selectAll", "paste"),
        imageAreaContent: menus(
          "properties",
          "rotateLeft",
          "rotateRight",
          "replace",
          "export",
          { key: "opacity", subItems: ["25%", "50%", "75%", "100%"] },
          "flipHorizontal",
          "flipVertical",
          "crop",
          "delete",
          "copy",
          "cut"
        ),
        imageCropMode: menus("done", "cancel"),
        editPathContent: menus("delete"),
        longPressWithEditTextMode: menus(
          "addText",
          "paste",
          "keepSourceFormatingPaste"
        ),
        longPressWithEditImageMode: menus("addImages", "paste"),
        longPressWithAllMode: menus("paste", "keepSourceFormatingPaste"),
        searchReplace: menus("replace"),
      },

      formMode: {
        textField: menus("properties", "delete"),
        checkBox: menus("properties", "delete"),
        radioButton: menus("properties", "delete"),
        listBox: menus("options", "properties", "delete"),
        comboBox: menus("options", "properties", "delete"),
        signatureField: menus("startToSign", "delete"),
        pushButton: menus("options", "properties", "delete"),
      },
    },
  };
  return JSON.stringify(mergeDeep(defaultConfig, overrides), null, 2);
}
