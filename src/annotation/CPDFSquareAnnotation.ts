/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
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
 * @group Annotations
 * @property { string } [borderColor] The color of the border.
 * @property { number } [borderAlpha] The alpha of the border.
 * @property { string } [fillColor] The color of the fill.
 * @property { number } [fillAlpha] The alpha of the fill.
 * @property { number } [borderWidth] The width of the border.
 * @property { CPDFBorderEffectType } [bordEffectType] The border effect type.
 * @property { number } [dashGap] The dash gap for dashed border effect.
 */
export class CPDFSquareAnnotation extends CPDFAnnotation {

    borderColor : string;

    borderAlpha : number;

    fillColor : string;

    fillAlpha : number;

    borderWidth : number;

    bordEffectType : CPDFBorderEffectType;

    dashGap: number;

    constructor(params: Partial<CPDFSquareAnnotation>) {
        super(params);
        this.type = 'square';
        this.borderColor = params.borderColor ?? '#000000';
        this.borderAlpha = params.borderAlpha ?? 255;
        this.fillColor = params.fillColor ?? '#FFFFFF';
        this.fillAlpha = params.fillAlpha ?? 255;
        this.borderWidth = params.borderWidth ?? 1;
        this.dashGap = params.dashGap ?? 0;
        this.bordEffectType = safeParseEnumValue(params.bordEffectType, Object.values(CPDFBorderEffectType), CPDFBorderEffectType.SOLID);
    }
    
    /**
     * Update square annotation properties with type safety
     * @param updates Partial object containing properties to update
     * @returns this instance for chaining
     * 
     * @example
     * squareAnnotation.update({
     *   title: 'Updated Title',
     *   content: 'Updated content',
     *   borderColor: '#FF0000',
     *   borderAlpha: 200,
     *   fillColor: '#00FF00',
     *   fillAlpha: 150,
     *   borderWidth: 2,
     *   bordEffectType: CPDFBorderEffectType.DASHED,
     *   dashGap: 4
     * });
     * await document.updateAnnotation(squareAnnotation);
     */
    update(updates: Partial<Pick<CPDFSquareAnnotation, 'title' | 'content' | 'borderColor' | 'borderAlpha' | 'fillColor' | 'fillAlpha' | 'borderWidth' | 'bordEffectType' | 'dashGap'>>): this {
        Object.assign(this, updates);
        return this;
    }
    

    toJSON() {
        return {
            ...super.toJSON(),
            borderColor: this.borderColor,
            borderAlpha: this.borderAlpha,
            fillColor: this.fillColor,
            fillAlpha: this.fillAlpha,
            borderWidth: this.borderWidth,
            bordEffectType: this.bordEffectType,
            dashGap: this.dashGap,
        };
    }
}