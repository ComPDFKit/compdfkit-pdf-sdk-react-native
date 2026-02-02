/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { HexColor } from "@compdfkit_pdf_sdk/react_native";

/**
 * Fixed-length padding tuple: [left, top, right, bottom]
 */
export type Padding = readonly [number, number, number, number];

/**
 * Menu item type with optional sub-items.
 * Use readonly arrays to encourage immutability.
 */
export type CPDFContextMenuItem<T extends string = string> = {
  key: T;
  subItems?: readonly string[];
  identifier?: string;
  title?: string;
  icon?: string;
  showType: 'text' | 'icon'
};

/** Common actions reused across multiple annotation menus */
export type CommonAnnotationAction = "properties" | "note" | "reply" | "viewReply" | "delete";

/** Global */
export type GlobalMenuKey = "exit" | "share" | "custom";

/** View mode */
export type ViewTextSelectKey = "copy" | "custom";

/** Annotation mode */
export type AnnotationTextSelectKey =
  | "copy"
  | "highlight"
  | "underline"
  | "strikeout"
  | "squiggly"
  | "custom";

export type MarkupContentKey = CommonAnnotationAction | "custom";
export type SoundContentKey = "reply" | "viewReply" | "play" | "record" | "delete" | "custom";
export type InkContentKey = CommonAnnotationAction | "custom";
export type ShapeContentKey = CommonAnnotationAction | "custom";
export type FreeTextContentKey = CommonAnnotationAction | "edit" | "custom";
export type SignStampContentKey = "signHere" | "delete" | "rotate" | "custom";
export type StampContentKey =  "note" | "reply" | "viewReply" | "delete" | "rotate" | "custom";
export type LinkContentKey = "edit" | "delete" | "custom";
export type LongPressContentKey = "paste" | "note" | "textBox" | "stamp" | "image" | "custom";

/** Content editor mode */
export type EditTextAreaContentKey = "properties" | "edit" | "cut" | "copy" | "delete" | "custom";
export type EditSelectTextContentKey = "properties" | "opacity" | "cut" | "copy" | "delete" | "custom";
export type EditTextContentKey = "select" | "selectAll" | "paste";

/** Image area content */
export type ImageAreaContentKey =
  | "properties"
  | "rotateLeft"
  | "rotateRight"
  | "replace"
  | "export"
  | "opacity"
  | "flipHorizontal"
  | "flipVertical"
  | "crop"
  | "delete"
  | "copy"
  | "cut"
  | "custom";

/** Crop mode */
export type ImageCropModeKey = "done" | "cancel";

/** Path in editor */
export type EditPathContentKey = "delete";



/** Long press in edit text mode */
export type LongPressWithEditTextModeKey = "addText" | "paste" | 'keepSourceFormatingPaste' | "custom";

/** Long press in edit image mode (typo-compatible) */
export type LongPressWithEditImageModeKey = "addImages" | "paste" | "custom";

/** Long press for all modes (typo-compatible) */
export type LongPressWithAllModeKey = "paste" | 'keepSourceFormatingPaste' | "custom";

/** Search replace */
export type SearchReplaceKey = "replace";

/** Form mode keys */
export type FormPropertiesDeleteKey = "properties" | "delete" | "custom";
export type FormOptionsPropertiesDeleteKey = "options" | "properties" | "delete" | "custom";
export type SignatureFieldKey = "startToSign" | "delete" | "custom";


/**
 * Context menu configuration interface.
 * Used to customize long-press menu options in different modes.
 * For example, selecting a highlight annotation in annotation mode,
 * or long-pressing a blank area in text editing mode.
 * @group Configuration
 */
export interface CPDFContextMenuConfig {

    /**
     * Background color of the context menu.
     * Only support HEX color format, e.g. #1460F3
     * Only supported on Android platform.
     */
    backgroundColor?: HexColor;

    /**
     * Font size of the context menu text.
     * defalut value: 14 dp
     */
    fontSize?: number;

    /**
     * Padding of the context menu.
     * Order: [left, top, right, bottom]
     * Only supported on Android platform.
     */
    padding?: Padding;

    /**
     * Icon size of the context menu.
     * defalut value: 36 dp
     */
    iconSize?: number;

    global?: {
      /**
       * Context menu for using the screenshot feature.
       * @example
       * ```typescript
       * screenshot: menus('exit', 'share')
       * ```
       */
      screenshot?: CPDFContextMenuItem<GlobalMenuKey>[];
    };

    viewMode?: {
      /**
       * Menu options when long-pressing selected text in viewer mode.
       * @example
       * ```typescript
       * textSelect: menus('copy')
       * ```
       */
      textSelect?: CPDFContextMenuItem<ViewTextSelectKey>[];
    };

    /**
     * Context menu configuration in annotation mode.
     */
    annotationMode?: {
      /**
       * Menu options shown when long-pressing selected text in annotation mode.
       * @example
       * ```typescript
       * textSelect: menus('copy', 'highlight', 'underline', 'strikeout', 'squiggly')
       * ```
       */
      textSelect?: CPDFContextMenuItem<AnnotationTextSelectKey>[];
      /**
       * Menu options shown when long-pressing a blank area in the PDF document.
       * @example
       * ```typescript
       * longPressContent: menus('paste', 'note', 'textBox', 'stamp', 'image')
       * ```
       */
      longPressContent?: CPDFContextMenuItem<LongPressContentKey>[];
      /**
       * Menu options shown when selecting markup annotations in annotation mode.
       * @example
       * ```typescript
       * markupContent: menus('properties', 'note', 'reply', 'viewReply', 'delete')
       * ```
       */
      markupContent?: CPDFContextMenuItem<MarkupContentKey>[];
      /**
       * Menu options shown for sound annotations in annotation mode.
       * @example
       * ```typescript
       * soundContent: menus('reply', 'viewReply', 'play', 'record', 'delete')
       * ```
       */
      soundContent?: CPDFContextMenuItem<SoundContentKey>[];
      /**
       * Menu options shown for ink annotations in annotation mode.
       * @example
       * ```typescript
       * inkContent: menus('properties', 'note', 'reply', 'viewReply', 'delete')
       * ```
       */
      inkContent?: CPDFContextMenuItem<InkContentKey>[];
      /**
       * Menu options shown for shape annotations in annotation mode.
       * Includes: rectangle, circle, line, and arrow annotations.
       * @example
       * ```typescript
       * shapeContent: menus('properties', 'note', 'reply', 'viewReply', 'delete')
       * ```
       */
      shapeContent?: CPDFContextMenuItem<ShapeContentKey>[];
      /**
       * Menu options shown for free text annotations in annotation mode.
       * @example
       * ```typescript
       * freeTextContent: menus('properties', 'edit', 'reply', 'viewReply', 'delete')
       * ```
       */
      freeTextContent?: CPDFContextMenuItem<FreeTextContentKey>[];
      /**
       * Menu options shown for signature stamp annotations in annotation mode.
       * Includes: sign, delete, and rotate.
       * @example
       * ```typescript
       * signStampContent: menus('signHere', 'delete', 'rotate')
       * ```
       */
      signStampContent?: CPDFContextMenuItem<SignStampContentKey>[];
      /**
       * Menu options shown for stamp annotations in annotation mode.
       * @example
       * ```typescript
       * stampContent: menus('note', 'reply', 'viewReply', 'delete', 'rotate')
       * ```
       */
      stampContent?: CPDFContextMenuItem<StampContentKey>[];
      /**
       * Menu options shown for link annotations in annotation mode.
       * @example
       * ```typescript
       * linkContent: menus('edit', 'delete')
       * ```
       */
      linkContent?: CPDFContextMenuItem<LinkContentKey>[];
    };

    /**
     * Context menu configuration in content editor mode.
     */
    contentEditorMode?: {
      /**
       * this is the menu options shown when clicking on a text area in content editor mode.
       * @example
       * ```typescript
       * editTextAreaContent: menus('properties', 'edit', 'cut', 'copy', 'delete')
       * ```
       */
      editTextAreaContent?: CPDFContextMenuItem<EditTextAreaContentKey>[];

      /**
       * This is the menu options shown when the text area enters edit mode and text is selected.
       * @example
       * ```typescript
       * editSelectTextContent: menus(
       *   'properties',
       *   { key: 'opacity', subItems:['25%', '50%', '75%', '100%'] },
       *   'cut',
       *   'copy',
       *   'delete'
       * )
       * ```
       */
      editSelectTextContent?: CPDFContextMenuItem<EditSelectTextContentKey>[];

      /**
       * This is the menu options shown when clicking anywhere in the text area edit state.
       * @example
       * ```typescript
       * editTextAreaClickContent: menus('select', 'selectAll', 'paste')
       * ```
       *
       */
      editTextContent?: CPDFContextMenuItem<EditTextContentKey>[];

      /**
       * This is the menu options shown when clicking on an image in content editor mode.
       * @example
       * ```typescript
       * imageAreaContent: menus(
       *  'properties',
       * 'rotateLeft',
       * 'rotateRight',
       * 'replace',
       * 'export',
       * { key: 'opacity', subItems:['25%', '50%', '75%', '100%'] },
       * 'flipHorizontal',
       * 'flipVertical',
       * 'crop',
       * 'delete',
       * 'copy',
       * 'cut'
       * ```
       */
      imageAreaContent?: CPDFContextMenuItem<ImageAreaContentKey>[];

      /**
       * this is the menu options shown when the image enters crop mode.
       * @example
       * ```typescript
       * imageCropMode: menus('done', 'cancel')
       * ```
       */
      imageCropMode?: CPDFContextMenuItem<ImageCropModeKey>[];

      /**
       * This is the menu options shown when clicking on a path in content editor mode.
       */
      editPathContent?: CPDFContextMenuItem<EditPathContentKey>[];

      /**
       * Content Editing Mode: Menu options when you long press on a blank area of ​​a PDF in text editing mode.
       * 
       * @example
       * ```typescript
       * longPressWithEditTextMode: menus('addText', 'paste', 'keepSourceFormatingPaste')
       * ```
       */
      longPressWithEditTextMode?: CPDFContextMenuItem<LongPressWithEditTextModeKey>[];

      /**
       * Content Editing Mode: Menu options when you long press on the blank area of ​​the PDF in the Edit Image mode.
       * @example
       * ```typescript
       * longPressWithEditImageMode: menus('addImage', 'paste')
       * ```
       */
      longPressWithEditImageMode?: CPDFContextMenuItem<LongPressWithEditImageModeKey>[];

      /**
       * In content editing mode, long press the blank area of ​​the PDF to select the menu option.
       * @example
       * ```typescript
       * longPressWithAllMode: menus('paste', 'keepSourceFormatingPaste')
       * ```
       */
      longPressWithAllMode?: CPDFContextMenuItem<LongPressWithAllModeKey>[];

      /**
       * In content editing mode, when performing text search and replacement, 
       * a menu option pops up after selecting the searched text.
       * @example
       * ```typescript
       * searchReplace: menus('replace')
       * ```
       */
      searchReplace?: CPDFContextMenuItem<SearchReplaceKey>[];
    }

    formMode?: {
        /**
         * Form mode, menu options that pop up after the text field form is selected.
         * @example
         * ```typescript
         * textFieldContent: menus('properties', 'delete')
         * ```
         */
        textField?: CPDFContextMenuItem<FormPropertiesDeleteKey>[];

        /**
         * Form mode, menu options that pop up after the checkbox form is selected.
         * @example
         * ```typescript
         * checkBoxContent: menus('properties', 'delete')
         * ```
         */
        checkBox?: CPDFContextMenuItem<FormPropertiesDeleteKey>[];

        /**
         * Form mode, menu options that pop up after the radio button form is selected.
         * @example
         * ```typescript
         * radioButton: menus('properties', 'delete')
         * ```
         */
        radioButton?: CPDFContextMenuItem<FormPropertiesDeleteKey>[];

        /**
         * Form mode, menu options that pop up after the list box form is selected.
         * @example
         * ```typescript
         * listBox: menus('options', 'properties', 'delete')
         * ```
         */
        listBox?: CPDFContextMenuItem<FormOptionsPropertiesDeleteKey>[];

        /**
         * Form mode, menu options that pop up after the combo box form is selected.
         * @example
         * ```typescript
         * comboBox: menus('options', 'properties', 'delete')
         * ```
         */
        comboBox?: CPDFContextMenuItem<FormOptionsPropertiesDeleteKey>[];

        /**
         * Form mode, menu options that pop up after the push button form is selected.
         * @example
         * ```typescript
         * pushButton: menus('options' , 'properties', 'delete')
         * ```
         */
        pushButton?: CPDFContextMenuItem<FormOptionsPropertiesDeleteKey>[];

        /**
         * Form mode, menu options that pop up after the signature field form is selected.
         * @example
         * ```typescript
         * signatureField: menus('startToSign', 'delete')
         * ```
         */
        signatureField?: CPDFContextMenuItem<SignatureFieldKey>[];
    }
  };