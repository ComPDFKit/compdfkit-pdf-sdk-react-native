/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFAnnotation } from "./CPDFAnnotation";

export class CPDFAnnotationFactory {
    static create(viewerRef: any, json: any): CPDFAnnotation {
        return CPDFAnnotation.fromJson(json, viewerRef);
    }

    static createFromArray(viewerRef: any, jsonArray: any[]): CPDFAnnotation[] {
        return jsonArray.map(item => CPDFAnnotationFactory.create(viewerRef, item));
    }
}