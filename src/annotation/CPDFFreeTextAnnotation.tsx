/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
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
 * @memberof CPDFFreeTextAnnotation
 * @property {CPDFAlignment} alignment - The alignment of the text in the annotation.
 * @property {CPDFTextAttribute} textAttribute - The text attribute of the annotation.
 */
export class CPDFFreeTextAnnotation extends CPDFAnnotation {

    alignment : CPDFAlignment;

    textAttribute : CPDFTextAttribute;

    alpha : number;

    constructor(viewerRef: any,params: Partial<CPDFFreeTextAnnotation>) {
        super(viewerRef,params);
        this.alignment = safeParseEnumValue(params.alignment, Object.values(CPDFAlignment), CPDFAlignment.LEFT);
        this.textAttribute = CPDFTextAttribute.fromJson(params.textAttribute ?? {});
        this.alpha = params.alpha ?? 255;
    }

}