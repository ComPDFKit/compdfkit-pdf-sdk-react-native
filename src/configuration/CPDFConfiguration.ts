/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { BorderWidth, ColorAlpha, CPDFAlignment, CPDFAnnotationType, CPDFBorderStyle, CPDFCheckStyle, CPDFConfigTool, CPDFContentEditorType, CPDFDisplayMode, CPDFFormType, CPDFLineType, CPDFThemes, CPDFToolbarAction, CPDFToolbarMenuAction, CPDFTypeface, CPDFViewMode, DashGap, FontSize, HexColor, CPDFThemeMode } from "./CPDFOptions";

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
        initialViewMode?: CPDFViewMode,

        readerOnly?: boolean,
        /**
         * Configure supported modes
         */
        availableViewModes?: CPDFViewMode[]
    }

    /**
     * Configuration for top toolbar functionality
     */
    toolbarConfig?: {
        /**
         * Top toolbar actions for Android platform
         *
         * Default: thumbnail, search, bota, menu.
         *
         * {@link CPDFToolbarAction.BACK} button will be shown only on the far left
         */
        androidAvailableActions?: CPDFToolbarAction[],
        /**
          * Left toolbar actions for iOS platform
          *
          * Default: back, thumbnail
          */
        iosLeftBarAvailableActions?: CPDFToolbarAction[],
        /**
         * Right toolbar actions for iOS platform
         *
         * Default: search, bota, menu
         */
        iosRightBarAvailableActions?: CPDFToolbarAction[],

        /**
         * Configure the menu options opened in the top toolbar {@link CPDFToolbarAction.MENU}
         */
        availableMenus?: CPDFToolbarMenuAction[]
    }

    /**
     * annotation config
     */
    annotationsConfig?: {

        annotationAuthor?: string,
        /**
         * {@link CPDFViewMode.ANNOTATIONS} mode, list of annotation functions shown at the bottom of the view.
         */
        availableTypes?: CPDFAnnotationType[],
        /**
         * {@link CPDFViewMode.ANNOTATIONS} mode, annotation tools shown at the bottom of the view.
         */
        availableTools?: CPDFConfigTool[],
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
                color?: HexColor,
                alpha?: ColorAlpha
            },
            /**
             * Highlight annotation attribute configuration.
             * @param { HexColor } [color] HEX color: #1460F3.
             * @param { ColorAlpha } [alpha] Color opacity, value range: 0~255.
             */
            highlight?: {
                color?: HexColor,
                alpha?: ColorAlpha
            },
            /**
             * Underline annotation attribute configuration.
             * @param { HexColor } [color] HEX color: #1460F3
             * @param { number } [alpha] Color opacity, value range: 0~255
             */
            underline?: {
                color?: HexColor,
                alpha?: ColorAlpha
            },
            /**
             * Squiggly annotation attribute configuration.
             * @param { HexColor } [color] HEX color: #1460F3
             * @param { ColorAlpha } [alpha] Color opacity, value range: 0~255
             */
            squiggly?: {
                color?: HexColor,
                alpha?: ColorAlpha
            },
            /**
             * Strikeout annotation attribute configuration.
             * @param { HexColor } [color] HEX color: #1460F3
             * @param { ColorAlpha } [alpha] Color opacity, value range: 0~255
             */
            strikeout?: {
                color?: HexColor,
                alpha?: ColorAlpha
            },
            /**
             * Ink annotation attribute configuration.
             * @param { HexColor } [color] HEX color: #1460F3
             * @param { ColorAlpha } [alpha] Color opacity, value range: 0~255
             * @param { BorderWidth } [borderWidth] Brush thickness, value range: 1~10
             */
            ink?: {
                color?: HexColor,
                alpha?: ColorAlpha,
                borderWidth?: BorderWidth
            },
            /**
             * square annotation attribute configuration.
             * @param { HexColor } [fillColor] HEX color: #1460F3
             * @param { HexColor } [borderColor] HEX color: #1460F3
             * @param { ColorAlpha } [colorAlpha] fill color and border color opacity. value range:0~255
             * @param { BorderWidth } [borderWidth] border thickness, value range:1~10
             * @param { object } [borderStyle] Set the border style to dashed or solid.
             */
            square?: {
                fillColor?: HexColor,
                borderColor?: HexColor,
                colorAlpha?: ColorAlpha,
                borderWidth?: BorderWidth,
                borderStyle?: {
                    /**
                     * default: {@link CPDFBorderStyle.SOLID}
                     */
                    style?: CPDFBorderStyle,
                    /**
                     * Dashed gap, only style={@link CPDFBorderStyle.DASHED} is valid.
                     */
                    dashGap?: DashGap
                }
            },
            /**
             * Circle annotation attribute configuration.
             * @param { HexColor } [fillColor] HEX color: #1460F3
             * @param { HexColor } [borderColor] HEX color: #1460F3
             * @param { ColorAlpha } [colorAlpha] fill color and border color opacity. value range:0~255
             * @param { BorderWidth } [borderWidth] border thickness, value range:1~10
             * @param { object } [borderStyle] Set the border style to dashed or solid.
             */
            circle?: {
                fillColor?: HexColor,
                borderColor?: HexColor,
                colorAlpha?: ColorAlpha,
                borderWidth?: BorderWidth,
                borderStyle?: {
                     /**
                     * default: {@link CPDFBorderStyle.SOLID}
                     */
                      style?: CPDFBorderStyle,
                      /**
                       * Dashed gap, only style={@link CPDFBorderStyle.DASHED} is valid.
                       */
                      dashGap?: DashGap
                }
            },
            /**
             * Line annotation attribute configuration.
             * @param { HexColor } [borderColor] HEX color: #1460F3
             * @param { ColorAlpha } [borderAlpha] line color opacity. value range:0~255
             * @param { BorderWidth } [borderWidth] border thickness, value range:1~10
             * @param { object } [borderStyle] Set the border style to dashed or solid.
             */
            line?: {
                borderColor?: HexColor,
                borderAlpha?: ColorAlpha,
                borderWidth?: BorderWidth,
                borderStyle?: {
                    /**
                     * default: {@link CPDFBorderStyle.SOLID}
                     */
                     style?: CPDFBorderStyle,
                     /**
                      * Dashed gap, only style={@link CPDFBorderStyle.DASHED} is valid.
                      */
                     dashGap?: DashGap
                }
            },
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
                borderColor?: HexColor,
                borderAlpha?: ColorAlpha,
                borderWidth?: BorderWidth,
                borderStyle?: {
                    /**
                     * default: {@link CPDFBorderStyle.SOLID}
                     */
                     style?: CPDFBorderStyle,
                     /**
                      * Dashed gap, only style={@link CPDFBorderStyle.DASHED} is valid.
                      */
                     dashGap?: DashGap
                },
                startLineType?: CPDFLineType
                tailLineType?: CPDFLineType
            },
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
                fontColor?: HexColor,
                fontColorAlpha?: ColorAlpha,
                fontSize?: FontSize,
                isBold?: boolean,
                isItalic?: boolean,
                alignment?: CPDFAlignment,
                typeface?: CPDFTypeface
            }
        }
    }

    contentEditorConfig?: {
        /**
         * Content editing mode, the editing mode displayed at the bottom of the view
         * Default order: editorText, editorImage
         */
        availableTypes?: CPDFContentEditorType[],
        /**
         * Available tools, including: Setting, Undo, Redo
         */
        availableTools?: CPDFConfigTool[]

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
                fontColor?: HexColor,
                fontColorAlpha?: ColorAlpha,
                fontSize?: FontSize,
                isBold?: boolean,
                isItalic?: boolean,
                alignment?: CPDFAlignment,
                typeface?: CPDFTypeface
            }
        }
    }

    formsConfig?: {
        /**
         * In {@link CPDFViewMode.Forms} mode, the list of form types at the bottom of the view.
         */
        availableTypes?: CPDFFormType[]

        /**
         * Only supports {@link CPDFConfigTool.UNDO} and  {@link CPDFConfigTool.UNDO} .
         */
        availableTools?: CPDFConfigTool[]

        /**
         * Form default attribute configuration
         */
        initAttribute?: {
            /**
             * Text field default properties, such as fill color, border color, text style, etc.
             */
            textField?: {
                fillColor?: HexColor,
                borderColor?: HexColor,
                borderWidth?: BorderWidth,
                fontColor?: HexColor,
                fontSize?: FontSize,
                isBold?: boolean,
                isItalic?: boolean,
                alignment?: CPDFAlignment,
                multiline?: boolean,
                typeface?: CPDFTypeface
            },
            checkBox?: CheckBoxAttr,
            radioButton?: RadioButtonAttr,
            listBox?: ListBoxAttr,
            comboBox?: ComboBoxAttr,
            pushButton?: {
                fillColor?: HexColor,
                borderColor?: HexColor,
                borderWidth?: BorderWidth,
                fontColor?: HexColor,
                fontSize?: FontSize,
                title?: string,
                typeface?: CPDFTypeface,
                isBold?: boolean,
                isItalic?: boolean,
            },
            signaturesFields?: {
                fillColor?: HexColor,
                borderColor?: HexColor,
                borderWidth?: number
            }
        }
    }
    /**
     * PDF View configuration.
     */
    readerViewConfig?: {
        /**
         * Sets whether hyperlinks in the PDF document annotations are highlighted.
         */
        linkHighlight?: boolean,
        /**
         * Sets whether form fields in the PDF document are highlighted.
         */
        formFieldHighlight?: boolean,
        /**
         * Display mode of the PDF document, single page, double page, or book mode.
         * Default: {@link CPDFDisplayMode.SINGLE_PAGE}
         */
        displayMode?: CPDFDisplayMode,
        /**
         * Whether PDF page flipping is continuous scrolling.
         */
        continueMode?: boolean,
        /**
         * Whether scrolling is in vertical direction.
         * `true`: Vertical scrolling, `false`: Horizontal scrolling.
         * Default: true
         */
        verticalMode?: boolean,
        /**
         * Cropping mode.
         * Whether to crop blank areas of PDF pages.
         * Default: false
         */
        cropMode?: boolean,
        /**
         * Theme color.
         * Default: {@link CPDFThemes.light}
         */
        themes?: CPDFThemes,
        /**
         * Whether to display the sidebar quick scroll bar.
         */
        enableSliderBar?: boolean,
        /**
         * Whether to display the bottom page indicator.
         */
        enablePageIndicator?: boolean,
        /**
         * Spacing between each page of the PDF, default 10px.
         */
        pageSpacing?: number,
        /**
         * Page scale value, default 1.0.
         */
        pageScale?: number,
        /**
         * only android platform.
         */
        pageSameWidth?: boolean
    }

    global? : {
        themeMode?: CPDFThemeMode,
        fileSaveExtraFontSubset?: boolean
    }
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
    fillColor?: HexColor
    borderColor?: HexColor
    borderWidth?: BorderWidth
    checkedColor?: HexColor
    isChecked?: boolean
    checkedStyle?: CPDFCheckStyle
}

export class RadioButtonAttr extends CheckBoxAttr{}

export class ListBoxAttr {
    fillColor?: string
    borderColor?: string
    borderWidth?: number
    fontColor?: string
    fontSize?: number
    typeface?: CPDFTypeface
    isBold?: boolean
    isItalic?: boolean
}

export class ComboBoxAttr extends ListBoxAttr{}


