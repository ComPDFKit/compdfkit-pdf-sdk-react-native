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
 * markup annotation class, highlight, underline, squiggly, strikeout
 * @class CPDFMarkupAnnotation
 * @group Annotations
 * @property { string } [markedText] The text that is marked by the annotation
 * @property { string } [color] The color of the annotation
 * @property { number } [alpha] The alpha of the annotation
 */
export class CPDFMarkupAnnotation extends CPDFAnnotation {

    markedText: string;

    color : string;

    alpha : number;

    constructor(params: Partial<CPDFMarkupAnnotation>) {
        super(params);
        this.markedText = params.markedText ?? '';
        this.color = params.color ?? '#FFFF00';
        const alpha = params.alpha ?? 200;
        this.alpha = Math.max(0, Math.min(255, alpha));
    }

    /**
     * Update markup annotation properties with type safety
     * @param updates Partial object containing properties to update
     * @returns this instance for chaining
     *
     * @example
     * markupAnnotation.update({
     *   title: 'Updated Title',
     *   content: 'Updated content',
     *   markedText: 'New marked text',
     *   color: '#FF0000',
     *   alpha: 200
     * });
     * await document.updateAnnotation(markupAnnotation);
     */
    update(updates: Partial<Pick<CPDFMarkupAnnotation, 'title' | 'content' | 'color' | 'alpha' | 'markedText'>>): this {
        Object.assign(this, updates);
        return this;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            markedText: this.markedText,
            color: this.color,
            alpha: this.alpha,
        };
    }
}

export class CPDFHighlightAnnotation extends CPDFMarkupAnnotation {
    constructor(params: Partial<CPDFMarkupAnnotation>) {
        super(params);
        this.type = 'highlight';
    }
}

export class CPDFUnderlineAnnotation extends CPDFMarkupAnnotation {
    constructor(params: Partial<CPDFMarkupAnnotation>) {
        super(params);
        this.type = 'underline';
    }
}

export class CPDFSquigglyAnnotation extends CPDFMarkupAnnotation {
    constructor(params: Partial<CPDFMarkupAnnotation>) {
        super(params);
        this.type = 'squiggly';
    }
}

export class CPDFStrikeOutAnnotation extends CPDFMarkupAnnotation {
    constructor(params: Partial<CPDFMarkupAnnotation>) {
        super(params);
        this.type = 'strikeout';
    }
}
