/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFAnnotation } from "./CPDFAnnotation";

/**
 * @class CPDFInkAnnotation
 * @group Annotations
 * @property {string} color - The color of the ink annotation.
 * @property {number} alpha - The alpha value of the ink annotation.
 * @property {number} borderWidth - The border width of the ink annotation.
 * @property {number[][][]} [inkPath] - The ink path data representing the strokes of the ink annotation.
 */
export class CPDFInkAnnotation extends CPDFAnnotation {

    color : string;

    alpha : number;

    borderWidth : number;

    inkPath?: number[][][];

    constructor(params: Partial<CPDFInkAnnotation>) {
        super({...params, rect: params.rect ?? {left: 0, top: 0, right: 0, bottom: 0}});
        this.type = 'ink';
        this.color = params.color ?? '#FF0000';
        const alpha = params.alpha ?? 255;
        this.alpha = Math.max(0, Math.min(255, alpha));
        const bw = params.borderWidth ?? 0;
        this.borderWidth = Math.max(0, bw);
        this.inkPath = params.inkPath ?? undefined;
    }

    /**
     * Update ink annotation properties with type safety
     * @param updates Partial object containing properties to update
     * @returns this instance for chaining
     * 
     * @example
     * inkAnnotation.update({
     *   title: 'Updated Title',
     *   content: 'Updated content',
     *   color: '#FF0000',
     *   alpha: 200,
     *   borderWidth: 2,
     * });
     * await document.updateAnnotation(inkAnnotation);
     */
    update(updates: Partial<Pick<CPDFInkAnnotation, 'title' | 'content' | 'color' | 'alpha' | 'borderWidth'>>): this {
        Object.assign(this, updates);
        return this;
    }


    toJSON() {
        return {
            ...super.toJSON(),
            color: this.color,
            alpha: this.alpha,
            borderWidth: this.borderWidth,
            inkPath: this.inkPath,
        };
    }
}