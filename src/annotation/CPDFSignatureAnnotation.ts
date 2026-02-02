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
 * @class CPDFSignatureAnnotation
 * @group Annotations
 * @property { string } image - Base64 encoded image string representing the image annotation.
 */
export class CPDFSignatureAnnotation extends CPDFAnnotation {

    /**
     * Base64 encoded image string representing the image annotation.
     * 
     * example: "iVBORw0KGgoAAAANSUhEUgAA..."
     */
    image: string;

    constructor(params: Partial<CPDFSignatureAnnotation>) {
        super(params);
        this.type = 'signature';
        this.image = params.image ?? '';
    }

    toJSON() {
        return {
            ...super.toJSON(),
            image: this.image,
            stampType: 'image',
            isStampSignature: true
        };
    }

}