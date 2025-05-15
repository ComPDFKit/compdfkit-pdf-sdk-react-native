/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFBorderEffectType } from "../configuration/CPDFOptions";
import { safeParseEnumValue } from "../util/CPDFEnumUtils";
import { CPDFAnnotation } from "./CPDFAnnotation";

/**
 * @class CPDFSquareAnnotation
 * @property { string } [borderColor] The color of the border.
 * @property { number } [borderAlpha] The alpha of the border.
 * @property { string } [fillColor] The color of the fill.
 * @property { number } [fillAlpha] The alpha of the fill.
 * @property { number } [borderWidth] The width of the border.
 * @property { CPDFBorderEffectType } [bordEffectType] The border effect type.
 */
export class CPDFSquareAnnotation extends CPDFAnnotation {

    borderColor : string;

    borderAlpha : number;

    fillColor : string;

    fillAlpha : number;

    borderWidth : number;

    bordEffectType : CPDFBorderEffectType;

    constructor(viewerRef: any,params: Partial<CPDFSquareAnnotation>) {
        super(viewerRef,params);
        this.borderColor = params.borderColor ?? '#000000';
        this.borderAlpha = params.borderAlpha ?? 255;
        this.fillColor = params.fillColor ?? '#000000';
        this.fillAlpha = params.fillAlpha ?? 255;
        this.borderWidth = params.borderWidth ?? 0;
        this.bordEffectType = safeParseEnumValue(params.bordEffectType, Object.values(CPDFBorderEffectType), CPDFBorderEffectType.SOLID);
    }
}