/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
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
import { CPDFImageAnnotation } from "./CPDFImageAnnotation";
import { CPDFInkAnnotation } from "./CPDFInkAnnotation";
import { CPDFLineAnnotation } from "./CPDFLineAnnotation";
import { CPDFLinkAnnotation } from "./CPDFLinkAnnotation";
import { CPDFHighlightAnnotation, CPDFSquigglyAnnotation, CPDFStrikeOutAnnotation, CPDFUnderlineAnnotation } from "./CPDFMarkupAnnotation";
import { CPDFNoteAnnotation } from "./CPDFNoteAnnotation";
import { CPDFSignatureAnnotation } from "./CPDFSignatureAnnotation";
import { CPDFSoundAnnotation } from "./CPDFSoundAnnotation";
import { CPDFSquareAnnotation } from "./CPDFSquareAnnotation";
import { CPDFStampAnnotation } from "./CPDFStampAnnotation";

export class CPDFAnnotationFactory {

    private static annotationMap = new Map<CPDFAnnotationType, (json: any) => CPDFAnnotation>([
        [CPDFAnnotationType.NOTE, (json) => CPDFNoteAnnotation.fromJson(json)],
        [CPDFAnnotationType.HIGHLIGHT, (json) => CPDFHighlightAnnotation.fromJson(json)],
        [CPDFAnnotationType.UNDERLINE, (json) => CPDFUnderlineAnnotation.fromJson(json)],
        [CPDFAnnotationType.SQUIGGLY, (json) => CPDFSquigglyAnnotation.fromJson(json)],
        [CPDFAnnotationType.STRIKEOUT, (json) => CPDFStrikeOutAnnotation.fromJson(json)],
        [CPDFAnnotationType.INK, (json) => CPDFInkAnnotation.fromJson(json)],
        [CPDFAnnotationType.FREETEXT, (json) => CPDFFreeTextAnnotation.fromJson(json)],
        [CPDFAnnotationType.SQUARE, (json) => CPDFSquareAnnotation.fromJson(json)],
        [CPDFAnnotationType.CIRCLE, (json) => CPDFCircleAnnotation.fromJson(json)],
        [CPDFAnnotationType.LINE, (json) => CPDFLineAnnotation.fromJson(json)],
        [CPDFAnnotationType.ARROW, (json) => CPDFLineAnnotation.fromJson(json)],
        [CPDFAnnotationType.LINK, (json) => CPDFLinkAnnotation.fromJson(json)],
        [CPDFAnnotationType.STAMP, (json) => CPDFStampAnnotation.fromJson(json)],
        [CPDFAnnotationType.PICTURES, (json) => CPDFImageAnnotation.fromJson(json)],
        [CPDFAnnotationType.SIGNATURE, (json) => CPDFSignatureAnnotation.fromJson(json)],
        [CPDFAnnotationType.SOUND, (json) => CPDFSoundAnnotation.fromJson(json)],
    ]);

    static create(json: any): CPDFAnnotation {
        const type = safeParseEnumValue(json.type, Object.values(CPDFAnnotationType), CPDFAnnotationType.UNKNOWN);
        const annotationCreator = CPDFAnnotationFactory.annotationMap.get(type);
        return annotationCreator ? annotationCreator(json) : CPDFAnnotation.fromJson(json);
    }

    static createFromArray(jsonArray: any[]): CPDFAnnotation[] {
        return jsonArray.map(item => CPDFAnnotationFactory.create(item));
    }
}