/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
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
 * @property {string} [familyName] - The font family name (e.g., 'Arial', 'Times New Roman').
 * @property {string} [styleName] - The font style name (e.g., 'Bold', 'Italic').
 * @property {number} [fontSize] - The size of the font in points.
 * @see CPDFFreeTextAnnotation
 */
export interface CPDFTextAttribute {

  color: string;

  familyName: string;

  styleName: string;

  fontSize: number;

}
