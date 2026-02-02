/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { ColorAlpha, HexColor } from "../configuration/CPDFOptions";
import { CPDFAnnotation } from "./CPDFAnnotation";

/**
 * @class CPDFNoteAnnotation
 * @group Annotations
 * @property { string } [color] The color of the annotation
 * @property { number } [alpha] The alpha of the annotation
 */
export class CPDFNoteAnnotation extends CPDFAnnotation {

    color : HexColor;

    alpha : ColorAlpha;

    constructor(params: Partial<CPDFNoteAnnotation>) {
        super(params);
        this.type = 'note';
        this.color = params.color ?? '#FF0000';
        this.alpha = params.alpha ?? 255;
    }

    /**
     * Update note annotation properties with type safety
     * @param updates Partial object containing properties to update
     * @returns this instance for chaining
     * 
     * @example
     * noteAnnotation.update({
     *   title: 'Updated Title',
     *   content: 'Updated content',
     *   color: '#FF0000',
     *   alpha: 200
     * });
     * await document.updateAnnotation(noteAnnotation);
     */
    update(updates: Partial<Pick<CPDFNoteAnnotation, 'title' | 'content' | 'color' | 'alpha'>>): this {
        Object.assign(this, updates);
        return this;
    }


    toJSON(){
        return {
            ...super.toJSON(),
            color: this.color,
            alpha: this.alpha,
        };
    }
}