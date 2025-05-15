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
 * @class CPDFInkAnnotation
 * @memberof CPDFInkAnnotation
 * @property {string} color - The color of the ink annotation.
 * @property {number} alpha - The alpha value of the ink annotation.
 * @property {number} borderWidth - The border width of the ink annotation.
 */
export class CPDFInkAnnotation extends CPDFAnnotation {

    color : string;

    alpha : number;

    borderWidth : number;

    constructor(viewerRef: any,params: Partial<CPDFInkAnnotation>) {
        super(viewerRef,params);
        this.color = params.color ?? '#000000';
        this.alpha = params.alpha ?? 255;
        this.borderWidth = params.borderWidth ?? 0;
    }
}