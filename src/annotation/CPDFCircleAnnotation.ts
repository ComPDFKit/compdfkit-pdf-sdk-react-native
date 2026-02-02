/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFSquareAnnotation } from "./CPDFSquareAnnotation";

/**
 * @class CPDFCircleAnnotation
 * @group Annotations
 */
export class CPDFCircleAnnotation extends CPDFSquareAnnotation {


    constructor(params: Partial<CPDFCircleAnnotation>) {
        super(params);
        this.type = 'circle';
    }
}