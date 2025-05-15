/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

/**
 * @class CPDFTextAttribute
 * This class is used to represent text attributes, including color, font name, font size, bold and italic, etc.
 * @property {string} [color] - The color of the text in hex format (e.g., '#FF0000' for red).
 * @property {string} [fontName] - The name of the font used for the text.
 * @property {number} [fontSize] - The size of the font in points.
 * @property {boolean} [isBold] - Indicates whether the text is bold.
 * @property {boolean} [isItalic] - Indicates whether the text is italic.
 * @see CPDFFreeTextAnnotation
 */
export class CPDFTextAttribute {

    color : string;

    familyName : string;

    styleName : string;

    fontSize : number;

    constructor(params: Partial<CPDFTextAttribute>) {
        this.color = params.color ?? '#000000';
        this.familyName = params.familyName ?? '';
        this.styleName = params.styleName ?? '';
        this.fontSize = params.fontSize ?? 0;
    }

    static fromJson(json: any): CPDFTextAttribute {
        return new CPDFTextAttribute(json);
    }
}

