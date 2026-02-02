/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFCheckStyle, HexColor, BorderWidth, FontSize, CPDFAlignment } from "@compdfkit_pdf_sdk/react_native";




/**
 * Attributes for a text field widget used in PDF forms.
 *
 * These properties control the appearance and basic behavior of text fields
 * when rendering or creating form widgets in the reader/editor.
 */
export interface CPDFTextFieldAttr {
    readonly type: 'textField';
    /** Background fill color of the text field. */
    fillColor?: HexColor;
    /** Border color of the text field. */
    borderColor?: HexColor;
    /** Border width of the text field. */
    borderWidth?: BorderWidth;
    /** Text (font) color used for the field value. */
    fontColor?: HexColor;
    /** Font size used for the field value. */
    fontSize?: FontSize;
    /** Text alignment inside the field. */
    alignment?: CPDFAlignment;
    /** Whether the field supports multiple lines. */
    multiline?: boolean;
    /** Optional font family name to use for the field text. */
    familyName?: string;
    /** Optional text style name (e.g., bold/italic) to use for the field text. */
    styleName?: string;
}


interface CPDFBaseCheckAttr {
    /** Background fill color of the checkbox box. */
    fillColor?: HexColor;
    /** Border color of the checkbox box. */
    borderColor?: HexColor;
    /** Border width of the checkbox box. */
    borderWidth?: BorderWidth;
    /** Color used to draw the check mark when selected. */
    checkedColor?: HexColor;
    /** Default checked state. */
    isChecked?: boolean;
    /** Visual style of the check mark (e.g., check, circle). */
    checkedStyle?: CPDFCheckStyle;
}

/**
 * Attributes for a checkbox widget used in PDF forms.
 *
 * Controls appearance and default state of a checkbox control.
 */
export interface CPDFCheckBoxAttr extends CPDFBaseCheckAttr {
    readonly type: 'checkBox';
}


/**
 * Attributes for a radio button widget used in PDF forms.
 *
 * Semantically similar to a checkbox but visually and behaviorally represents
 * a mutually exclusive selection within a radio group.
 */
export interface CPDFRadioButtonAttr extends CPDFBaseCheckAttr {
  readonly type: 'radioButton';
}


/**
 * Attributes for a list box widget used in PDF forms.
 *
 * Controls the visual appearance of the selection list and its text.
 */
export interface CPDFListBoxAttr {
    readonly type: 'listBox';
    /** Background fill color of the list box. */
    fillColor?: HexColor;
    /** Border color of the list box. */
    borderColor?: HexColor;
    /** Border width of the list box. */
    borderWidth?: BorderWidth;
    /** Font color for list items. */
    fontColor?: HexColor;
    /** Font size for list items. */
    fontSize?: FontSize;
    /** Optional font family name for list items. */
    familyName?: string;
    /** Optional text style name for list items. */
    styleName?: string;
}


/**
 * Attributes for a combo box (drop-down) widget used in PDF forms.
 *
 * Shares the same appearance properties as a list box but represents a
 * single-value selection control with a collapsed/expanded state.
 */
export interface CPDFComboBoxAttr {
    readonly type: 'comboBox';
    /** Background fill color of the combo box. */
    fillColor?: HexColor;
    /** Border color of the combo box. */
    borderColor?: HexColor;
    /** Border width of the combo box. */
    borderWidth?: BorderWidth;
    /** Font color for the displayed value. */
    fontColor?: HexColor;
    /** Font size for the displayed value. */
    fontSize?: FontSize;
    /** Optional font family name for the displayed value. */
    familyName?: string;
    /** Optional text style name for the displayed value. */
    styleName?: string;
}


/**
 * Attributes for a push button widget used in PDF forms.
 *
 * Controls appearance and label of the button.
 */
export interface CPDFPushButtonAttr {
    readonly type: 'pushButton';
    /** Background fill color of the button. */
    fillColor?: HexColor;
    /** Border color of the button. */
    borderColor?: HexColor;
    /** Border width of the button. */
    borderWidth?: BorderWidth;
    /** Font color for the button title. */
    fontColor?: HexColor;
    /** Font size for the button title. */
    fontSize?: FontSize;
    /** Default button title text. */
    title?: string;
    /** Optional font family name for the title. */
    familyName?: string;
    /** Optional text style name for the title. */
    styleName?: string;
}


/**
 * Attributes for a signature widget area used in PDF forms.
 *
 * Controls visual appearance of the signature field (background and border).
 */
export interface CPDFSignatureWidgetAttr {
    readonly type: 'signaturesFields';
    /** Background fill color of the signature field. */
    fillColor?: HexColor;
    /** Border color of the signature field. */
    borderColor?: HexColor;
    /** Border width of the signature field. */
    borderWidth?: number;
}



export interface CPDFWidgetAttr {
    /**
     * Text field default properties, such as fill color, border color, text style, etc.
     */
    textField?: CPDFTextFieldAttr;

    checkBox?: CPDFCheckBoxAttr;

    radioButton?: CPDFRadioButtonAttr;

    listBox?: CPDFListBoxAttr;

    comboBox?: CPDFComboBoxAttr;

    pushButton?: CPDFPushButtonAttr;

    signaturesFields?: CPDFSignatureWidgetAttr;
};

export type CPDFWidgetAttrUnion =
  | CPDFTextFieldAttr
  | CPDFCheckBoxAttr
  | CPDFRadioButtonAttr
  | CPDFListBoxAttr
  | CPDFComboBoxAttr
  | CPDFPushButtonAttr
  | CPDFSignatureWidgetAttr;