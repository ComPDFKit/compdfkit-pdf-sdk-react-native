/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFWidget } from "./CPDFWidget";

/**
 * Class representing a signature form widget, storing basic information about the signature form.
 * It includes general form attributes as well as the signature content.
 * 
 * @class CPDFSignatureWidget
 * @group Forms
 */
export class CPDFSignatureWidget extends CPDFWidget {

    constructor(params: Partial<CPDFSignatureWidget>) {
        super(params);
        this.type = 'signaturesFields';
    }

    /**
     * Update signature widget properties with type safety
     * @param updates Partial object containing properties to update
     * @returns this instance for chaining
     * 
     * @example
     * signatureWidget.update({
     *   title: 'Updated Title',
     *   borderColor: '#FF0000',
     *   fillColor: '#FFFFFF'
     * });
     * await document.updateWidget(signatureWidget);
     */
    update(updates: Partial<Pick<CPDFSignatureWidget, 'title' | 'borderColor' | 'fillColor' | 'borderWidth'>>): this {
        Object.assign(this, updates);
        return this;
    }

}