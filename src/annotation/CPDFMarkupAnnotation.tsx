/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFAnnotation } from "./CPDFAnnotation";

/**
 * @class CPDFMarkupAnnotation
 * @memberof CPDFMarkupAnnotation
 * @property { string } [markedText] The text that is marked by the annotation
 * @property { string } [color] The color of the annotation
 * @property { number } [alpha] The alpha of the annotation
 */
export class CPDFMarkupAnnotation extends CPDFAnnotation {

    markedText: string;

    color : string;

    alpha : number;

    constructor(viewerRef: any,params: Partial<CPDFMarkupAnnotation>) {
        super(viewerRef,params);
        this.markedText = params.markedText ?? '';
        this.color = params.color ?? '#000000';
        this.alpha = params.alpha ?? 255;
    }
}