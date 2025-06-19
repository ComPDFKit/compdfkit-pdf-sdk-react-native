/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */


import {
  BorderWidth,
  ColorAlpha,
  CPDFAlignment,
  CPDFAnnotationType,
  CPDFBorderStyle,
  CPDFCheckStyle,
  CPDFConfigTool,
  CPDFContentEditorType,
  CPDFDisplayMode,
  CPDFLineType,
  CPDFThemes,
  CPDFToolbarAction,
  CPDFToolbarMenuAction,
  CPDFTypeface,
  CPDFViewMode,
  DashGap,
  FontSize,
  HexColor,
  CPDFThemeMode,
  CPDFSignatureType,
  CPDFWidgetType,
} from "./CPDFOptions";

/**
 * Configuration information for displaying PDF using the ComPDFKit.openDocument method.
 * Used to configure UI elements, PDF properties, etc.
 *
 * @example
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
 */
export class CPDFConfiguration {
  /**
   * PDF mode configuration
   */
  modeConfig?: {
    /**
     * Default mode to display when opening the PDF View, default is [CPDFToolbarAction.VIEWER]
     */
    initialViewMode?: CPDFViewMode;

    readerOnly?: boolean;
    /**
     * Configure supported modes
     */
    availableViewModes?: CPDFViewMode[];
  };

  /**
   * Configuration for top toolbar functionality
   */
  toolbarConfig?: {
    /**
     * Set whether to display the top toolbar
     *
     * Default: true
     */
    mainToolbarVisible?: boolean;

    /**
     * Set whether to display the annotation toolbar
     */
    annotationToolbarVisible?: boolean;
    /**
     * Top toolbar actions for Android platform
     *
     * Default: thumbnail, search, bota, menu.
     *
     * {@link CPDFToolbarAction.BACK} button will be shown only on the far left
     */
    androidAvailableActions?: CPDFToolbarAction[];
    /**
     * Left toolbar actions for iOS platform
     *
     * Default: back, thumbnail
     */
    iosLeftBarAvailableActions?: CPDFToolbarAction[];
    /**
     * Right toolbar actions for iOS platform
     *
     * Default: search, bota, menu
     */
    iosRightBarAvailableActions?: CPDFToolbarAction[];

    /**
     * Configure the menu options opened in the top toolbar {@link CPDFToolbarAction.MENU}
     */
    availableMenus?: CPDFToolbarMenuAction[];
  };

  /**
   * annotation config
   */
  annotationsConfig?: {
    annotationAuthor?: string;
    /**
     * {@link CPDFViewMode.ANNOTATIONS} mode, list of annotation functions shown at the bottom of the view.
     */
    availableTypes?: CPDFAnnotationType[];
    /**
     * {@link CPDFViewMode.ANNOTATIONS} mode, annotation tools shown at the bottom of the view.
     */
    availableTools?: CPDFConfigTool[];
    /**
     * When adding an annotation, the annotation’s default attributes.
     */
    initAttribute?: {
      /**
       * Note annotation attribute configuration.
       * @param { HexColor } [color] HEX color: #1460F3
       * @param { ColorAlpha } [alpha] Color opacity, value range: 0~255
       */
      note?: {
        color?: HexColor;
        alpha?: ColorAlpha;
      };
      /**
       * Highlight annotation attribute configuration.
       * @param { HexColor } [color] HEX color: #1460F3.
       * @param { ColorAlpha } [alpha] Color opacity, value range: 0~255.
       */
      highlight?: {
        color?: HexColor;
        alpha?: ColorAlpha;
      };
      /**
       * Underline annotation attribute configuration.
       * @param { HexColor } [color] HEX color: #1460F3
       * @param { number } [alpha] Color opacity, value range: 0~255
       */
      underline?: {
        color?: HexColor;
        alpha?: ColorAlpha;
      };
      /**
       * Squiggly annotation attribute configuration.
       * @param { HexColor } [color] HEX color: #1460F3
       * @param { ColorAlpha } [alpha] Color opacity, value range: 0~255
       */
      squiggly?: {
        color?: HexColor;
        alpha?: ColorAlpha;
      };
      /**
       * Strikeout annotation attribute configuration.
       * @param { HexColor } [color] HEX color: #1460F3
       * @param { ColorAlpha } [alpha] Color opacity, value range: 0~255
       */
      strikeout?: {
        color?: HexColor;
        alpha?: ColorAlpha;
      };
      /**
       * Ink annotation attribute configuration.
       * @param { HexColor } [color] HEX color: #1460F3
       * @param { ColorAlpha } [alpha] Color opacity, value range: 0~255
       * @param { BorderWidth } [borderWidth] Brush thickness, value range: 1~10
       */
      ink?: {
        color?: HexColor;
        alpha?: ColorAlpha;
        borderWidth?: BorderWidth;
      };
      /**
       * square annotation attribute configuration.
       * @param { HexColor } [fillColor] HEX color: #1460F3
       * @param { HexColor } [borderColor] HEX color: #1460F3
       * @param { ColorAlpha } [colorAlpha] fill color and border color opacity. value range:0~255
       * @param { BorderWidth } [borderWidth] border thickness, value range:1~10
       * @param { object } [borderStyle] Set the border style to dashed or solid.
       */
      square?: {
        fillColor?: HexColor;
        borderColor?: HexColor;
        colorAlpha?: ColorAlpha;
        borderWidth?: BorderWidth;
        borderStyle?: {
          /**
           * default: {@link CPDFBorderStyle.SOLID}
           */
          style?: CPDFBorderStyle;
          /**
           * Dashed gap, only style={@link CPDFBorderStyle.DASHED} is valid.
           */
          dashGap?: DashGap;
        };
      };
      /**
       * Circle annotation attribute configuration.
       * @param { HexColor } [fillColor] HEX color: #1460F3
       * @param { HexColor } [borderColor] HEX color: #1460F3
       * @param { ColorAlpha } [colorAlpha] fill color and border color opacity. value range:0~255
       * @param { BorderWidth } [borderWidth] border thickness, value range:1~10
       * @param { object } [borderStyle] Set the border style to dashed or solid.
       */
      circle?: {
        fillColor?: HexColor;
        borderColor?: HexColor;
        colorAlpha?: ColorAlpha;
        borderWidth?: BorderWidth;
        borderStyle?: {
          /**
           * default: {@link CPDFBorderStyle.SOLID}
           */
          style?: CPDFBorderStyle;
          /**
           * Dashed gap, only style={@link CPDFBorderStyle.DASHED} is valid.
           */
          dashGap?: DashGap;
        };
      };
      /**
       * Line annotation attribute configuration.
       * @param { HexColor } [borderColor] HEX color: #1460F3
       * @param { ColorAlpha } [borderAlpha] line color opacity. value range:0~255
       * @param { BorderWidth } [borderWidth] border thickness, value range:1~10
       * @param { object } [borderStyle] Set the border style to dashed or solid.
       */
      line?: {
        borderColor?: HexColor;
        borderAlpha?: ColorAlpha;
        borderWidth?: BorderWidth;
        borderStyle?: {
          /**
           * default: {@link CPDFBorderStyle.SOLID}
           */
          style?: CPDFBorderStyle;
          /**
           * Dashed gap, only style={@link CPDFBorderStyle.DASHED} is valid.
           */
          dashGap?: DashGap;
        };
      };
      /**
       * Arrow annotation attribute configuration.
       * @param { HexColor } [borderColor] HEX color: #1460F3
       * @param { ColorAlpha } [borderAlpha] line color opacity. value range:0~255
       * @param { BorderWidth } [borderWidth] border thickness, value range:0~10
       * @param { object } [borderStyle] Set the border style to dashed or solid.
       * @param { CPDFLineType } [startLineType] Arrow starting position shape.
       * @param { CPDFLineType } [tailLineType] Arrow tail position shape.
       */
      arrow?: {
        borderColor?: HexColor;
        borderAlpha?: ColorAlpha;
        borderWidth?: BorderWidth;
        borderStyle?: {
          /**
           * default: {@link CPDFBorderStyle.SOLID}
           */
          style?: CPDFBorderStyle;
          /**
           * Dashed gap, only style={@link CPDFBorderStyle.DASHED} is valid.
           */
          dashGap?: DashGap;
        };
        startLineType?: CPDFLineType;
        tailLineType?: CPDFLineType;
      };
      /**
       * Freetext annotation attribute configuration.
       * @param { HexColor } [fontColor] HEX color: #1460F3
       * @param { ColorAlpha } [fontColorAlpha] text color opacity. value range:0~255
       * @param { FontSize } [fontSize] font size, value range:1~100
       * @param { boolean } [isBold] Whether the font is bold.
       * @param { boolean } [isItalic] Is the font italicized.
       * @param { CPDFAlignment } [alignment] Text alignment, {@link CPDFAlignment.LEFT} aligned by default.
       * @param { CPDFTypeface } [typeface] The font used by default for text. The default is:{@link CPDFTypeface.HELVETICA}.
       */
      freeText?: {
        fontColor?: HexColor;
        fontColorAlpha?: ColorAlpha;
        fontSize?: FontSize;
        isBold?: boolean;
        isItalic?: boolean;
        alignment?: CPDFAlignment;
        typeface?: CPDFTypeface;
      };
    };
  };

  contentEditorConfig?: {
    /**
     * Content editing mode, the editing mode displayed at the bottom of the view
     * Default order: editorText, editorImage
     */
    availableTypes?: CPDFContentEditorType[];
    /**
     * Available tools, including: Setting, Undo, Redo
     */
    availableTools?: CPDFConfigTool[];

    initAttribute?: {
      /**
       * When adding text, the text default properties
       * @param { HexColor } [fontColor] HEX color: #1460F3
       * @param { ColorAlpha } [fontColorAlpha] text color opacity. value range:0~255
       * @param { FontSize } [fontSize] font size, value range:1~100
       * @param { boolean } [isBold] Whether the font is bold.
       * @param { boolean } [isItalic] Is the font italicized.
       * @param { CPDFAlignment } [alignment] Text alignment, {@link CPDFAlignment.LEFT} aligned by default.
       * @param { CPDFTypeface } [typeface] The font used by default for text. The default is:{@link CPDFTypeface.HELVETICA}.
       */
      text?: {
        fontColor?: HexColor;
        fontColorAlpha?: ColorAlpha;
        fontSize?: FontSize;
        isBold?: boolean;
        isItalic?: boolean;
        alignment?: CPDFAlignment;
        typeface?: CPDFTypeface;
      };
    };
  };

  formsConfig?: {
    /**
     * In {@link CPDFViewMode.Forms} mode, the list of form types at the bottom of the view.
     */
    availableTypes?: CPDFWidgetType[];

    /**
     * Only supports {@link CPDFConfigTool.UNDO} and  {@link CPDFConfigTool.UNDO} .
     */
    availableTools?: CPDFConfigTool[];

    /**
     * Form default attribute configuration
     */
    initAttribute?: {
      /**
       * Text field default properties, such as fill color, border color, text style, etc.
       */
      textField?: {
        fillColor?: HexColor;
        borderColor?: HexColor;
        borderWidth?: BorderWidth;
        fontColor?: HexColor;
        fontSize?: FontSize;
        isBold?: boolean;
        isItalic?: boolean;
        alignment?: CPDFAlignment;
        multiline?: boolean;
        typeface?: CPDFTypeface;
      };
      checkBox?: CheckBoxAttr;
      radioButton?: RadioButtonAttr;
      listBox?: ListBoxAttr;
      comboBox?: ComboBoxAttr;
      pushButton?: {
        fillColor?: HexColor;
        borderColor?: HexColor;
        borderWidth?: BorderWidth;
        fontColor?: HexColor;
        fontSize?: FontSize;
        title?: string;
        typeface?: CPDFTypeface;
        isBold?: boolean;
        isItalic?: boolean;
      };
      signaturesFields?: {
        fillColor?: HexColor;
        borderColor?: HexColor;
        borderWidth?: number;
      };
    };
  };
  /**
   * PDF View configuration.
   */
  readerViewConfig?: {
    /**
     * Sets whether hyperlinks in the PDF document annotations are highlighted.
     */
    linkHighlight?: boolean;
    /**
     * Sets whether form fields in the PDF document are highlighted.
     */
    formFieldHighlight?: boolean;
    /**
     * Display mode of the PDF document, single page, double page, or book mode.
     * Default: {@link CPDFDisplayMode.SINGLE_PAGE}
     */
    displayMode?: CPDFDisplayMode;
    /**
     * Whether PDF page flipping is continuous scrolling.
     */
    continueMode?: boolean;
    /**
     * Whether scrolling is in vertical direction.
     * `true`: Vertical scrolling, `false`: Horizontal scrolling.
     * Default: true
     */
    verticalMode?: boolean;
    /**
     * Cropping mode.
     * Whether to crop blank areas of PDF pages.
     * Default: false
     */
    cropMode?: boolean;
    /**
     * Theme color.
     * Default: {@link CPDFThemes.light}
     */
    themes?: CPDFThemes;
    /**
     * Whether to display the sidebar quick scroll bar.
     */
    enableSliderBar?: boolean;
    /**
     * Whether to display the bottom page indicator.
     */
    enablePageIndicator?: boolean;
    /**
     * Spacing between each page of the PDF, default 10px.
     */
    pageSpacing?: number;

    /**
     * Sets the outer margins for the PDF reading view.
     * - `index 0`: margin left
     * - `index 1`: margin top
     * - `index 2`: margin right
     * - `index 3`: margin bottom
     *
     * **Default:** `[0,0,0,0]`
     */
    margins?: number[];
    /**
     * Page scale value, default 1.0.
     */
    pageScale?: number;
    /**
     * only android platform.
     */
    pageSameWidth?: boolean;
  };

  global?: {
    themeMode?: CPDFThemeMode;
    fileSaveExtraFontSubset?: boolean;
    watermark?: {
      saveAsNewFile?: boolean;
      outsideBackgroundColor?: string | null;
    };
    signatureType?: CPDFSignatureType;
    enableExitSaveTips?: boolean;
  };

  /**
   * Configuration for the context menu.
   *
   */
  contextMenuConfig?: {
    global?: {
      /**
       * Context menu for using the screenshot feature.
       * @example
       * ```typescript
       * screenshot: menus('exit', 'share')
       * ```
       */
      screenshot?: CPDFContextMenuItem<"exit" | "share">[];
    };

    viewMode?: {
      /**
       * Menu options when long-pressing selected text in viewer mode.
       * @example
       * ```typescript
       * textSelect: menus('copy')
       * ```
       */
      textSelect?: CPDFContextMenuItem<"copy">[];
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
      textSelect?: CPDFContextMenuItem<
        "copy" | "highlight" | "underline" | "strikeout" | "squiggly"
      >[];
      /**
       * Menu options shown when long-pressing a blank area in the PDF document.
       * @example
       * ```typescript
       * longPressContent: menus('paste', 'note', 'textBox', 'stamp', 'image')
       * ```
       */
      longPressContent?: CPDFContextMenuItem<
        "paste" | "note" | "textBox" | "stamp" | "image"
      >[];
      /**
       * Menu options shown when selecting markup annotations in annotation mode.
       * @example
       * ```typescript
       * markupContent: menus('properties', 'note', 'reply', 'viewReply', 'delete')
       * ```
       */
      markupContent?: CPDFContextMenuItem<
        "properties" | "note" | "reply" | "viewReply" | "delete"
      >[];
      /**
       * Menu options shown for sound annotations in annotation mode.
       * @example
       * ```typescript
       * soundContent: menus('reply', 'viewReply', 'play', 'record', 'delete')
       * ```
       */
      soundContent?: CPDFContextMenuItem<
        "reply" | "viewReply" | "play" | "record" | "delete"
      >[];
      /**
       * Menu options shown for ink annotations in annotation mode.
       * @example
       * ```typescript
       * inkContent: menus('properties', 'note', 'reply', 'viewReply', 'delete')
       * ```
       */
      inkContent?: CPDFContextMenuItem<
        "properties" | "note" | "reply" | "viewReply" | "delete"
      >[];
      /**
       * Menu options shown for shape annotations in annotation mode.
       * Includes: rectangle, circle, line, and arrow annotations.
       * @example
       * ```typescript
       * shapeContent: menus('properties', 'note', 'reply', 'viewReply', 'delete')
       * ```
       */
      shapeContent?: CPDFContextMenuItem<
        "properties" | "note" | "reply" | "viewReply" | "delete"
      >[];
      /**
       * Menu options shown for free text annotations in annotation mode.
       * @example
       * ```typescript
       * freeTextContent: menus('properties', 'edit', 'reply', 'viewReply', 'delete')
       * ```
       */
      freeTextContent?: CPDFContextMenuItem<
        "properties" | "edit" | "reply" | "viewReply" | "delete"
      >[];
      /**
       * Menu options shown for signature stamp annotations in annotation mode.
       * Includes: sign, delete, and rotate.
       * @example
       * ```typescript
       * signStampContent: menus('signHere', 'delete', 'rotate')
       * ```
       */
      signStampContent?: CPDFContextMenuItem<
        "signHere" | "delete" | "rotate"
      >[];
      /**
       * Menu options shown for stamp annotations in annotation mode.
       * @example
       * ```typescript
       * stampContent: menus('note', 'reply', 'viewReply', 'delete', 'rotate')
       * ```
       */
      stampContent?: CPDFContextMenuItem<
        "note" | "reply" | "viewReply" | "delete" | "rotate"
      >[];
      /**
       * Menu options shown for link annotations in annotation mode.
       * @example
       * ```typescript
       * linkContent: menus('edit', 'delete')
       * ```
       */
      linkContent?: CPDFContextMenuItem<"edit" | "delete">[];
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
      editTextAreaContent?: CPDFContextMenuItem<
        "properties" | "edit" | "cut" | "copy" | "delete"
      >[];

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
      editSelectTextContent?: CPDFContextMenuItem<
        "properties" | "opacity" | "cut" | "copy" | "delete"
      >[];

      /**
       * This is the menu options shown when clicking anywhere in the text area edit state.
       * @example
       * ```typescript
       * editTextAreaClickContent: menus('select', 'selectAll', 'paste')
       * ```
       *
       */
      editTextContent?: CPDFContextMenuItem<"select" | "selectAll" | "paste">[];

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
      imageAreaContent?: CPDFContextMenuItem<
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
      >[];

      /**
       * this is the menu options shown when the image enters crop mode.
       * @example
       * ```typescript
       * imageCropMode: menus('done', 'cancel')
       * ```
       */
      imageCropMode?: CPDFContextMenuItem<'done' | 'cancel'>[];

      /**
       * This is the menu options shown when clicking on a path in content editor mode.
       */
      editPathContent?: CPDFContextMenuItem<'delete'>[];

      /**
       * Content Editing Mode: Menu options when you long press on a blank area of ​​a PDF in text editing mode.
       * 
       * @example
       * ```typescript
       * longPressWithEditTextMode: menus('addText', 'paste', 'keepSourceFormatingPaste')
       * ```
       */
      longPressWithEditTextMode?: CPDFContextMenuItem<'addText' | 'paste' | 'keepSourceFormatingPaste'>[];

      /**
       * Content Editing Mode: Menu options when you long press on the blank area of ​​the PDF in the Edit Image mode.
       * @example
       * ```typescript
       * longPressWithEditImageMode: menus('addImage', 'paste')
       * ```
       */
      longPressWithEditImageMode?: CPDFContextMenuItem<'addImages' | 'paste'>[];

      /**
       * In content editing mode, long press the blank area of ​​the PDF to select the menu option.
       * @example
       * ```typescript
       * longPressWithAllMode: menus('paste', 'keepSourceFormatingPaste')
       * ```
       */
      longPressWithAllMode?: CPDFContextMenuItem<'paste' | 'keepSourceFormatingPaste'>[];

      /**
       * In content editing mode, when performing text search and replacement, 
       * a menu option pops up after selecting the searched text.
       * @example
       * ```typescript
       * searchReplace: menus('replace')
       * ```
       */
      searchReplace?: CPDFContextMenuItem<'replace'>[];
    }

    formMode?: {
        /**
         * Form mode, menu options that pop up after the text field form is selected.
         * @example
         * ```typescript
         * textFieldContent: menus('properties', 'delete')
         * ```
         */
        textField?: CPDFContextMenuItem<'properties' | 'delete'>[];

        /**
         * Form mode, menu options that pop up after the checkbox form is selected.
         * @example
         * ```typescript
         * checkBoxContent: menus('properties', 'delete')
         * ```
         */
        checkBox?: CPDFContextMenuItem<'properties' | 'delete'>[];

        /**
         * Form mode, menu options that pop up after the radio button form is selected.
         * @example
         * ```typescript
         * radioButton: menus('properties', 'delete')
         * ```
         */
        radioButton?: CPDFContextMenuItem<'properties' | 'delete'>[];

        /**
         * Form mode, menu options that pop up after the list box form is selected.
         * @example
         * ```typescript
         * listBox: menus('options', 'properties', 'delete')
         * ```
         */
        listBox?: CPDFContextMenuItem<'options' | 'properties' | 'delete'>[];

        /**
         * Form mode, menu options that pop up after the combo box form is selected.
         * @example
         * ```typescript
         * comboBox: menus('options', 'properties', 'delete')
         * ```
         */
        comboBox?: CPDFContextMenuItem<'options' | 'properties' | 'delete'>[];

        /**
         * Form mode, menu options that pop up after the push button form is selected.
         * @example
         * ```typescript
         * pushButton: menus('options' , 'properties', 'delete')
         * ```
         */
        pushButton?: CPDFContextMenuItem<'options' | 'properties' | 'delete'>[];

        /**
         * Form mode, menu options that pop up after the signature field form is selected.
         * @example
         * ```typescript
         * signatureField: menus('startToSign', 'delete')
         * ```
         */
        signatureField?: CPDFContextMenuItem<'startToSign' | 'delete'>[];
    }
  };
}

export type CPDFContextMenuItem<T extends string = string> = {
  key: T;
  subItems?: string[];
};

/**
 * @param { HexColor } [fillColor] HEX color: #1460F3
 * @param { HexColor } [borderColor] HEX color: #1460F3
 * @param { BorderWidth } [borderWidth] border thickness, value range:0~10
 * @param { HexColor } [checkedColor]
 * @param { boolean } [isChecked]
 * @param { CPDFCheckStyle } [checkedStyle]
 */
export class CheckBoxAttr {
  fillColor?: HexColor;
  borderColor?: HexColor;
  borderWidth?: BorderWidth;
  checkedColor?: HexColor;
  isChecked?: boolean;
  checkedStyle?: CPDFCheckStyle;
}

export class RadioButtonAttr extends CheckBoxAttr {}

export class ListBoxAttr {
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  fontColor?: string;
  fontSize?: number;
  typeface?: CPDFTypeface;
  isBold?: boolean;
  isItalic?: boolean;
}

export class ComboBoxAttr extends ListBoxAttr {}
