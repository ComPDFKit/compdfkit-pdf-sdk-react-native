/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { ColorAlpha, CPDFAlignment, CPDFConfigTool, CPDFContentEditorType, FontSize, HexColor } from "@compdfkit_pdf_sdk/react_native";

/**
 * @class CPDFContentEditorConfig
 * @group Configuration
 */
export interface CPDFContentEditorConfig {
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
     * @param { CPDFAlignment } [alignment] Text alignment, {@link CPDFAlignment.LEFT} aligned by default.
     * @param { string } [familyName] The font family name used by default for text. The default is: "Helvetica".
     * @param { string } [styleName] The font style name used by default for text. The default is: "Regular".
     */
    text?: CPDFEditorTextAttr;
  };
};

export interface CPDFEditorTextAttr {
  fontColor?: HexColor;
  fontColorAlpha?: ColorAlpha;
  fontSize?: FontSize;
  alignment?: CPDFAlignment;
  familyName?: string;
  styleName?: string;
}