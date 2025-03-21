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
 * @property { CPDFAnnotationType } [type] Annotation type identifier
 * @property { title } [title] Annotation title
 * @property { number } [page] The page number where the note is located
 * @property { string } [content] annotation content.
 * @property { string } [markedText] The text that is marked by the annotation
 */
export class CPDFMarkupAnnotation extends CPDFAnnotation {

    markedText: string;

    constructor(viewerRef: any,params: Partial<CPDFMarkupAnnotation>) {
        super(viewerRef,params);
        this.markedText = params.markedText ?? '';
    }
}