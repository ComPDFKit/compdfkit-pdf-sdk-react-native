/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFAnnotationType } from "../configuration/CPDFOptions";
import { safeParseEnumValue } from "../util/CPDFEnumUtils";
import { CPDFAnnotation } from "./CPDFAnnotation";
import { CPDFCircleAnnotation } from "./CPDFCircleAnnotation";
import { CPDFFreeTextAnnotation } from "./CPDFFreeTextAnnotation";
import { CPDFInkAnnotation } from "./CPDFInkAnnotation";
import { CPDFLineAnnotation } from "./CPDFLineAnnotation";
import { CPDFLinkAnnotation } from "./CPDFLinkAnnotation";
import { CPDFMarkupAnnotation } from "./CPDFMarkupAnnotation";
import { CPDFSquareAnnotation } from "./CPDFSquareAnnotation";

export class CPDFAnnotationFactory {

    private static annotationMap = new Map<CPDFAnnotationType, (json: any, viewerRef: any) => CPDFAnnotation>([
        [CPDFAnnotationType.HIGHLIGHT, (json,viewerRef) => CPDFMarkupAnnotation.fromJson(json, viewerRef)],
        [CPDFAnnotationType.UNDERLINE, (json,viewerRef) => CPDFMarkupAnnotation.fromJson(json, viewerRef)],
        [CPDFAnnotationType.SQUIGGLY, (json,viewerRef) => CPDFMarkupAnnotation.fromJson(json, viewerRef)],
        [CPDFAnnotationType.STRIKEOUT, (json,viewerRef) => CPDFMarkupAnnotation.fromJson(json, viewerRef)],
        [CPDFAnnotationType.INK, (json,viewerRef) => CPDFInkAnnotation.fromJson(json, viewerRef)],
        [CPDFAnnotationType.SQUARE, (json,viewerRef) => CPDFSquareAnnotation.fromJson(json, viewerRef)],
        [CPDFAnnotationType.CIRCLE, (json,viewerRef) => CPDFCircleAnnotation.fromJson(json, viewerRef)],
        [CPDFAnnotationType.LINE, (json,viewerRef) => CPDFLineAnnotation.fromJson(json, viewerRef)],
        [CPDFAnnotationType.ARROW, (json,viewerRef) => CPDFLineAnnotation.fromJson(json, viewerRef)],
        [CPDFAnnotationType.FREETEXT, (json,viewerRef) => CPDFFreeTextAnnotation.fromJson(json, viewerRef)],
        [CPDFAnnotationType.LINK, (json,viewerRef) => CPDFLinkAnnotation.fromJson(json, viewerRef)] 
    ]);

    static create(json: any, viewerRef: any): CPDFAnnotation {
        const type = safeParseEnumValue(json.type, Object.values(CPDFAnnotationType), CPDFAnnotationType.UNKNOWN);
        const annotationCreator = CPDFAnnotationFactory.annotationMap.get(type);
        return annotationCreator ? annotationCreator(json, viewerRef) : CPDFAnnotation.fromJson(json, viewerRef);
    }

    static createFromArray(viewerRef: any,jsonArray: any[]): CPDFAnnotation[] {
        return jsonArray.map(item => CPDFAnnotationFactory.create(item, viewerRef));
    }
}