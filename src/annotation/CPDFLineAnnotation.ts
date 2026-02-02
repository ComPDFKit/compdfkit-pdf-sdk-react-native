/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFLineType } from "../configuration/CPDFOptions";
import { safeParseEnumValue } from "../util/CPDFEnumUtils";
import { CPDFAnnotation } from "./CPDFAnnotation";

/**
 * @class CPDFLineAnnotation
 * @group Annotations
 * @property { CPDFAnnotationType } [type] Annotation type identifier
 * @property { string } [borderColor] The color of the border.
 * @property { number } [borderAlpha] The alpha of the border.
 * @property { string } [fillColor] The color of the fill.
 * @property { number } [fillAlpha] The alpha of the fill.
 * @property { number } [borderWidth] The width of the border.
 * @property { CPDFLineType } [lineHeadType] The type of the line head.
 * @property { CPDFLineType } [lineTailType] The type of the line tail.
 * @property { number[][] } [points] The points defining the line annotation.
 */
export class CPDFLineAnnotation extends CPDFAnnotation {

    borderColor: string;

    borderAlpha: number;

    fillColor: string;

    fillAlpha: number;

    borderWidth: number;

    lineHeadType: CPDFLineType;

    lineTailType: CPDFLineType;

    points: number[][];

    dashGap: number;

    constructor(params: Partial<CPDFLineAnnotation> ) {
        super({ ...params, rect: params.rect ?? {left: 0, top: 0, right: 0, bottom: 0} });
        this.borderColor = params.borderColor ?? '#000000';
        {
            const a = params.borderAlpha ?? 255;
            this.borderAlpha = Math.max(0, Math.min(255, a));
        }
        this.fillColor = params.fillColor ?? '#000000';
        {
            const a = params.fillAlpha ?? 255;
            this.fillAlpha = Math.max(0, Math.min(255, a));
        }
        {
            const bw = params.borderWidth ?? 0;
            this.borderWidth = Math.max(0, bw);
        }
        this.lineHeadType = safeParseEnumValue(params.lineHeadType, Object.values(CPDFLineType), CPDFLineType.NONE);
        this.lineTailType = safeParseEnumValue(params.lineTailType, Object.values(CPDFLineType), CPDFLineType.NONE);
        this.type = this.lineHeadType == CPDFLineType.NONE && this.lineTailType == CPDFLineType.NONE ? 'line' : 'arrow';
        this.points = params.points ?? [];
        this.dashGap = params.dashGap ?? 0;
    }

    /**
     * Update line annotation properties with type safety
     * @param updates Partial object containing properties to update
     * @returns this instance for chaining
     * 
     * @example
     * lineAnnotation.update({
     *   title: 'Updated Title',
     *   content: 'Updated content',
     *   borderColor: '#FF0000',
     *   borderAlpha: 200,
     *   borderWidth: 2,
     *   fillColor: '#00FF00',
     *   fillAlpha: 150,
     *   lineHeadType: CPDFLineType.ARROW,
     *   lineTailType: CPDFLineType.NONE
     * });
     * await document.updateAnnotation(lineAnnotation);
     */
    update(updates: Partial<Pick<CPDFLineAnnotation, 'title' | 'content' | 'borderColor' | 'borderAlpha' | 'fillColor' | 'fillAlpha' | 'borderWidth' | 'lineHeadType' | 'lineTailType' | 'dashGap'>>): this {
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
            lineHeadType: this.lineHeadType,
            lineTailType: this.lineTailType,
            points: this.points,
            dashGap: this.dashGap,
        };
    }
}