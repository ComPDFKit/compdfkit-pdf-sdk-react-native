/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFRadiobuttonWidget } from "./CPDFRadiobuttonWidget";

/**
 * Class representing a checkbox form widget, storing basic information about the checkbox form.
 * 
 * @class CPDFCheckboxWidget
 * @memberof CPDFCheckboxWidget
 */
export class CPDFCheckboxWidget extends CPDFRadiobuttonWidget {


    constructor(viewerRef : any, params: Partial<CPDFCheckboxWidget>) {
        super(viewerRef, params);
    }
}

