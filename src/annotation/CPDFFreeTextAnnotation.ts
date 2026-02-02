/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFAlignment } from "../configuration/CPDFOptions";
import { safeParseEnumValue } from "../util/CPDFEnumUtils";
import { CPDFAnnotation } from "./CPDFAnnotation";
import { CPDFTextAttribute } from "./CPDFTextAttribute";

/**
 * @class CPDFFreeTextAnnotation
 * @group Annotations
 * @property {CPDFAlignment} alignment - The alignment of the text in the annotation.
 * @property {CPDFTextAttribute} textAttribute - The text attribute of the annotation.
 * @property { number } [alpha] The alpha of the annotation
 */
export class CPDFFreeTextAnnotation extends CPDFAnnotation {

    alignment : CPDFAlignment;

    textAttribute : CPDFTextAttribute;

    alpha : number;

    constructor(params: Partial<CPDFFreeTextAnnotation>) {
        super(params);
        this.type = 'freetext';
        this.alignment = safeParseEnumValue(params.alignment, Object.values(CPDFAlignment), CPDFAlignment.LEFT);
        this.textAttribute = params.textAttribute ?? { color: '#000000', familyName: 'Helvetica', styleName: '', fontSize: 14 };
        const alpha = params.alpha ?? 255;
        this.alpha = Math.max(0, Math.min(255, alpha));
    }

    /**
     * Update free text annotation properties with type safety
     * @param updates Partial object containing properties to update
     * @returns this instance for chaining
     * 
     * @example
     * freeTextAnnotation.update({
     *   title: 'Updated Title',
     *   content: 'Updated content',
     *   alignment: CPDFAlignment.CENTER,
     *   textAttribute: {
     *     fontSize: 14,
     *     fontFamily: 'Times',
     *     styleName: 'Bold',
     *     color: '#00FF00'
     *   },
     *   alpha: 200
     * });
     * await document.updateAnnotation(freeTextAnnotation);
     */
    update(updates: Partial<Pick<CPDFFreeTextAnnotation, 'title' | 'content' | 'alignment' | 'textAttribute' | 'alpha'>>): this {
        Object.assign(this, updates);
        return this;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            alignment: this.alignment,
            textAttribute: this.textAttribute,
            alpha: this.alpha
        };
    }

    
}