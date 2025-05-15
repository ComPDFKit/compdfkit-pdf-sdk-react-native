/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { NativeModules } from 'react-native';
import { CPDFConfiguration } from './configuration/CPDFConfiguration';
import { CPDFAlignment, CPDFAnnotationType, CPDFBorderStyle, CPDFCheckStyle, CPDFConfigTool, CPDFContentEditorType, CPDFDisplayMode, CPDFFormType, CPDFLineType,CPDFThemeMode, CPDFThemes, CPDFToolbarAction, CPDFToolbarMenuAction, CPDFTypeface, CPDFViewMode } from './configuration/CPDFOptions';
import React from 'react';
import { CPDFReaderView } from './view/CPDFReaderView';

declare module 'react-native' {
  interface NativeModulesStatic {
    ComPDFKit: {
      getDefaultConfig(overrides : Partial<CPDFConfiguration>) : string;
      /**
       * Get the version number of the ComPDFKit SDK.
       * For example : '2.0.0'
       * @memberof ComPDFKit
       * @returns { Promise<string> } A Promise returning ComPDFKit PDF SDK Version Code
       *
       * @example
       * ComPDFKit.getVersionCode().then((versionCode : string) => {
       *   console.log('ComPDFKit SDK Version:', versionCode)
       * })
       */
      getVersionCode(): () => Promise<string>;
      /**
       * Get the build tag of the ComPDFKit PDF SDK.
       *
       * For example: "build_beta_2.0.0_42db96987_202404081007"
       * @memberof ComPDFKit
       * @returns { Promise<string> } A Promise returning ComPDFKit PDF SDK Build Tag.
       *
       * @example
       * ComPDFKit.getSDKBuildTag().then((buildTag : string) => {
       *  console.log('ComPDFKit Build Tag:', buildTag)
       * })
       */
      getSDKBuildTag(): () => Promise<string>;
      /**
       * Initialize the ComPDFKit PDF SDK using offline authentication.
       * Each ComPDFKit license is bound to a specific app bundle ID(Android Application ID).
       *
       * @method init_
       * @memberof ComPDFKit
       * @param { string } [license] Your ComPDFKit for React Native license key.
       * @returns { Promise<boolean> } Returns ```true``` if initialization is successful, otherwise returns ```false```.
       *
       * @example
       * ComPDFKit.init_('your compdfkit license')
       *
       */
      init_: (license: string) => Promise<boolean>;
      /**
       * Initialize the ComPDFKit PDF SDK using online authentication.
       * Each ComPDFKit license is bound to a specific app bundle ID(Android Application ID).
       *
       * @method initialize
       * @memberof ComPDFKit
       * @param { string } [androidOnlineLicense] Your ComPDFKit for React Native Android online license key.
       * @param { string } [iosOnlineLicense] Your ComPDFKit for React Native iOS online license key.
       * @returns { Promise<boolean> } Returns ```true``` if initialization is successful, otherwise returns ```false```.
       *
       * @example
       * ComPDFKit.initialize('your android compdfkit license', 'your ios compdfkit license')
       */
      initialize: (androidOnlineLicense: string, iosOnlineLicense: string) => Promise<boolean>;
      /**
       * Used to present a PDF document.
       * @method openDocument
       * @memberof ComPDFKit
       * @param { string } [document]  document The path to the PDF document to be presented.
       *
       * * (Android) For local storage file path:
       * ```tsx
       *    document = 'file:///storage/emulated/0/Download/sample.pdf'
       * ```
       * * (Android) For content Uri:
       * ```tsx
       *    document = 'content://...'
       * ```
       * * (Android) For assets path:
       * ```tsx
       *    document = "file:///android_asset/..."
       * ```
       * ---
       * * ios
       * ```tsx
       *    document = 'pdf_document.pdf'
       * ```
       *
       * @param { string } [password] PDF document password.
       * @param { string } [configuration] Configuration objects to customize the appearance and behavior of ComPDFKit. See [CPDFConfiguration](configuration/CPDFConfiguration.ts)
       * @returns { void }
       *
       * @example
       * const fileName = 'pdf_document.pdf';
       * const document =
       * Platform.OS === 'ios' ? fileName
       * : 'file:///android_asset/' + fileName;
       *
       * const configuration : CPDFConfiguration = {
       *    modeConfig: {
       *       initialViewMode: CPDFModeConfig.ViewMode.VIEWER,
       *       availableViewModes: [
       *         CPDFModeConfig.ViewMode.VIEWER,
       *         CPDFModeConfig.ViewMode.ANNOTATIONS,
       *         CPDFModeConfig.ViewMode.CONTENT_EDITOR,
       *         CPDFModeConfig.ViewMode.FORMS,
       *         CPDFModeConfig.ViewMode.SIGNATURES
       *       ]
       *     }
       * }
       *
       * ComPDFKit.openDocument(document, 'password', JSON.stringify(configuration))
       *
       */
      openDocument: (document: string, password: string, configuration: string) => void;

      /**
       * Delete the saved signature file from the annotation signature list
       *
       * @example
       * ComPDFKit.removeSignFileList().then((result : boolean) => {
       *  console.log('ComPDFKit removeSignFileList:', result)
       * })
       *
       * @returns
       */
      removeSignFileList : () => Promise<boolean>;
      
      /**
       * Opens the system file picker to select a PDF document.
       * @returns A promise that resolves to the file path of the selected PDF document.
       **/
      pickFile: () => Promise<string>;

      /**
       * Imports font files to support displaying additional languages. 
       * Imported fonts will appear in the font list for FreeText annotations and text editing.
       * 
       * **Note:** Fonts must be imported before initializing the SDK.
       * 
       * Steps to import fonts:
       * 1. Copy the fonts you want to import into a custom folder.
       * 2. Call `setImportFontDir` with the folder path as a parameter.
       * 3. Initialize the SDK using `ComPDFKit.init_`.
       * 
       * @param {string} fontDir - The path to the folder containing font files to import.
       * @param {boolean} addSysFont - Whether to include system fonts in the font list.
       * 
       * @example
       * ComPDFKit.setImportFontDir('fontdir', true);
       * @returns A promise that resolves when the fonts have been successfully imported.
       */
      setImportFontDir: (fontDir: string, addSysFont: boolean) => Promise<boolean>;
      
      
      /**
       * This method is supported only on the Android platform. It is used to create a URI for saving a file on the Android device.
       * The file is saved in the `Downloads` directory by default, but you can specify a subdirectory within `Downloads` using the
       * [childDirectoryName] parameter. If the [childDirectoryName] is not provided, the file will be saved directly in the `Downloads` directory.
       * The [fileName] parameter is required to specify the name of the file (e.g., `test.pdf`).
       *
       * @example
       * const uri: string = await ComPDFKit.createUri('test.pdf', '', 'application/pdf');
       *
       * @param { string } fileName(required): specifies the name of the file, for example `test.pdf`.
       * @param { string } childDirectoryName (optional): specifies a subdirectory within the `Downloads` folder.
       * @param { string } mimeType (optional): the MIME type of the file, defaulting to `application/pdf`.
       */
      createUri : (fileName : string, childDirectoryName : string | null, mimeType : string) => Promise<string>;
    };
  }
}

interface ComPDFKit {
  testConfig(configuration: string): Promise<string>;
  getVersionCode(): Promise<string>;
  getSDKBuildTag(): Promise<string>;
  init_(license: string): Promise<boolean>;
  initialize(androidOnlineLicense: string, iosOnlineLicense: string): Promise<boolean>;
  openDocument(document: string, password: string, configurationJson: string): void;
  removeSignFileList() : Promise<boolean>;
  pickFile() : Promise<string>;
  setImportFontDir: (fontDir: string, addSysFont: boolean) => Promise<boolean>;
  createUri : (fileName : string, childDIrectoryName : string | null, mimeType : string) => Promise<string>;
}

const ComPDFKit = NativeModules.ComPDFKit

export { ComPDFKit };
// === Options & Configs ===
export * from './configuration/CPDFOptions';
export { CPDFConfiguration } from './configuration/CPDFConfiguration';

// === Core Views ===
export { CPDFReaderView } from './view/CPDFReaderView';
// === Document & Pages ===
export { CPDFDocument } from './document/CPDFDocument';
export * from './page/CPDFPage';

// === Actions ===
export * from './document/action/CPDFAction';
export { CPDFGoToAction } from './document/action/CPDFGoToAction';
export { CPDFUriAction } from './document/action/CPDFUriAction';

// === Annotations ===
export { CPDFAnnotation } from './annotation/CPDFAnnotation';
export { CPDFCircleAnnotation } from './annotation/CPDFCircleAnnotation';
export { CPDFFreeTextAnnotation } from './annotation/CPDFFreeTextAnnotation';
export { CPDFInkAnnotation } from './annotation/CPDFInkAnnotation';
export { CPDFLineAnnotation } from './annotation/CPDFLineAnnotation';
export { CPDFLinkAnnotation } from './annotation/CPDFLinkAnnotation';
export { CPDFMarkupAnnotation } from './annotation/CPDFMarkupAnnotation';
export { CPDFSquareAnnotation } from './annotation/CPDFSquareAnnotation';
export { CPDFTextAttribute } from './annotation/CPDFTextAttribute';

// === Form Widgets ===
export { CPDFWidget } from './annotation/form/CPDFWidget';
export { CPDFCheckboxWidget } from './annotation/form/CPDFCheckboxWidget';
export { CPDFComboboxWidget } from './annotation/form/CPDFComboboxWidget';
export { CPDFListboxWidget } from './annotation/form/CPDFListboxWidget';
export { CPDFPushbuttonWidget } from './annotation/form/CPDFPushbuttonWidget';
export { CPDFRadiobuttonWidget } from './annotation/form/CPDFRadiobuttonWidget';
export { CPDFSignatureWidget } from './annotation/form/CPDFSignatureWidget';
export { CPDFTextWidget } from './annotation/form/CPDFTextWidget';
export { CPDFWidgetItem } from './annotation/form/CPDFWidgetItem';

// === Utils ===
export { CPDFRectF } from './util/CPDFRectF';


ComPDFKit.getDefaultConfig = getDefaultConfig

function getDefaultConfig(overrides : Partial<CPDFConfiguration> = {}) : string {
  const defaultConfig : CPDFConfiguration = {
    modeConfig:{
      initialViewMode: CPDFViewMode.VIEWER,
      readerOnly: false,
      availableViewModes: [
        CPDFViewMode.VIEWER,
        CPDFViewMode.ANNOTATIONS,
        CPDFViewMode.CONTENT_EDITOR,
        CPDFViewMode.FORMS,
        CPDFViewMode.SIGNATURES,
      ]
    },
    toolbarConfig: {
      mainToolbarVisible : true,
      androidAvailableActions: [
        CPDFToolbarAction.THUMBNAIL,
        CPDFToolbarAction.SEARCH,
        CPDFToolbarAction.BOTA,
        CPDFToolbarAction.MENU,
      ],
      iosLeftBarAvailableActions:[
        CPDFToolbarAction.BACK,
        CPDFToolbarAction.THUMBNAIL
      ],
      iosRightBarAvailableActions: [
        CPDFToolbarAction.SEARCH,
        CPDFToolbarAction.BOTA,
        CPDFToolbarAction.MENU
      ],
      availableMenus: [
        CPDFToolbarMenuAction.VIEW_SETTINGS,
        CPDFToolbarMenuAction.DOCUMENT_EDITOR,
        CPDFToolbarMenuAction.DOCUMENT_INFO,
        CPDFToolbarMenuAction.WATERMARK,
        CPDFToolbarMenuAction.SECURITY,
        CPDFToolbarMenuAction.FLATTENED,
        CPDFToolbarMenuAction.SAVE,
        CPDFToolbarMenuAction.SHARE,
        CPDFToolbarMenuAction.OPEN_DOCUMENT,
        CPDFToolbarMenuAction.SNIP
      ]
    },
    annotationsConfig: {
      annotationAuthor: '',
      availableTypes: [
        CPDFAnnotationType.NOTE,
        CPDFAnnotationType.HIGHLIGHT,
        CPDFAnnotationType.UNDERLINE,
        CPDFAnnotationType.SQUIGGLY,
        CPDFAnnotationType.STRIKEOUT,
        CPDFAnnotationType.INK,
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
        CPDFConfigTool.REDO
      ],
      initAttribute: {
        note: {
          color: '#1460F3',
          alpha: 255
        },
        highlight: {
          color: '#1460F3',
          alpha: 77
        },
        underline: {
          color: '#1460F3',
          alpha: 77
        },
        squiggly: {
          color: '#1460F3',
          alpha: 77
        },
        strikeout: {
          color: '#1460F3',
          alpha: 77
        },
        ink: {
          color: '#1460F3',
          alpha: 100,
          borderWidth: 10
        },
        square: {
          fillColor: '#1460F3',
          borderColor: '#000000',
          colorAlpha : 128,
          borderWidth: 2,
          borderStyle: {
            style: CPDFBorderStyle.SOLID,
            dashGap: 8.0
          }
        },
        circle: {
          fillColor: '#1460F3',
          borderColor: '#000000',
          colorAlpha : 128,
          borderWidth: 2,
          borderStyle: {
            style: CPDFBorderStyle.SOLID,
            dashGap: 8.0
          }
        },
        line: {
          borderColor: '#1460F3',
          borderAlpha: 100,
          borderWidth: 5,
          borderStyle: {
            style: CPDFBorderStyle.SOLID,
            dashGap: 8.0
          }
        },
        arrow: {
          borderColor: '#1460F3',
          borderAlpha: 100,
          borderWidth: 5,
          borderStyle: {
            style: CPDFBorderStyle.SOLID,
            dashGap: 8.0
          },
          startLineType: CPDFLineType.NONE,
          tailLineType: CPDFLineType.OPEN_ARROW
        },
        freeText: {
          fontColor: '#000000',
          fontColorAlpha: 255,
          fontSize: 30,
          isBold: false,
          isItalic: false,
          alignment: CPDFAlignment.LEFT,
          typeface: CPDFTypeface.HELVETICA
        }
      }
    },
    contentEditorConfig: {
        availableTypes: [
          CPDFContentEditorType.EDITOR_TEXT,
          CPDFContentEditorType.EDITOR_IMAGE
        ],
        availableTools: [
          CPDFConfigTool.SETTING,
          CPDFConfigTool.UNDO,
          CPDFConfigTool.REDO
        ],
        initAttribute: {
          text: {
            fontColor: '#000000',
            fontColorAlpha: 255,
            fontSize: 30,
            isBold: false,
            isItalic: false,
            typeface: CPDFTypeface.HELVETICA,
            alignment: CPDFAlignment.LEFT
          }
        }
    },
    formsConfig: {
      availableTypes: [
        CPDFFormType.TEXT_FIELD,
        CPDFFormType.CHECKBOX,
        CPDFFormType.RADIO_BUTTON,
        CPDFFormType.LISTBOX,
        CPDFFormType.COMBOBOX,
        CPDFFormType.SIGNATURES_FIELDS,
        CPDFFormType.PUSH_BUTTON,
      ],
      availableTools: [
        CPDFConfigTool.UNDO,
        CPDFConfigTool.REDO
      ],
      initAttribute: {
        textField: {
          fillColor: '#DDE9FF',
          borderColor: '#1460F3',
          borderWidth: 2,
          fontColor: '#000000',
          fontSize: 20,
          isBold: false,
          isItalic: false,
          alignment: CPDFAlignment.LEFT,
          multiline: true,
          typeface: CPDFTypeface.HELVETICA
        },
        checkBox: {
          fillColor: '#DDE9FF',
          borderColor: '#1460F3',
          borderWidth: 2,
          checkedColor: '#43474D',
          isChecked: false,
          checkedStyle: CPDFCheckStyle.CHECK
        },
        radioButton: {
          fillColor: '#DDE9FF',
          borderColor: '#1460F3',
          borderWidth: 2,
          checkedColor: '#43474D',
          isChecked: false,
          checkedStyle: CPDFCheckStyle.CIRCLE
        },
        listBox: {
          fillColor: '#DDE9FF',
          borderColor: '#1460F3',
          borderWidth: 2,
          fontColor: '#000000',
          fontSize: 20,
          typeface: CPDFTypeface.HELVETICA,
          isBold: false,
          isItalic: false
        },
        comboBox: {
          fillColor: '#DDE9FF',
          borderColor: '#1460F3',
          borderWidth: 2,
          fontColor: '#000000',
          fontSize: 20,
          typeface: CPDFTypeface.HELVETICA,
          isBold: false,
          isItalic: false
        },
        pushButton: {
          fillColor: '#DDE9FF',
          borderColor: '#1460F3',
          borderWidth: 2,
          fontColor: '#000000',
          fontSize: 20,
          title: 'Button',
          typeface: CPDFTypeface.HELVETICA,
          isBold: false,
          isItalic: false
        },
        signaturesFields: {
          fillColor: '#DDE9FF',
          borderColor: '#000000',
          borderWidth: 2
        }
      }
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
      margins: [0,0,0,0],
      pageSpacing: 10,
      pageSameWidth: true
    },
    global: {
      themeMode: CPDFThemeMode.SYSTEM,
      fileSaveExtraFontSubset: true,
      watermark: {
        saveAsNewFile: true,
      },
      signatureType : 'manual',
      enableExitSaveTips: false
    }
  }
  return JSON.stringify(mergeDeep(defaultConfig, overrides), null, 2);
}


function mergeDeep(defaults: any, overrides: any): any {
  const merged = { ...defaults };

  for (const key in overrides) {
      if (Array.isArray(overrides[key]) && Array.isArray(defaults[key])) {
          merged[key] = [...overrides[key]];
      } else if (overrides[key] instanceof Object && key in defaults) {
          merged[key] = mergeDeep(defaults[key], overrides[key]);
      } else {
          merged[key] = overrides[key];
      }
  }

  return merged;
}

const PDFReaderContext = React.createContext<CPDFReaderView | null>(null);

export default PDFReaderContext;
