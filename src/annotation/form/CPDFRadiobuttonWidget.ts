/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFCheckStyle } from "../../configuration/CPDFOptions";
import { safeParseEnumValue } from "../../util/CPDFEnumUtils";
import { CPDFWidget } from "./CPDFWidget";

/**
 * Class representing a radiobutton form widget, storing basic information about the radiobutton form.
 * 
 * @class CPDFRadiobuttonWidget
 * @group Forms
 * @property {boolean} isChecked The state of the radiobutton form widget.
 * @property {string} checkColor The checked state color of a radio button form widget.
 * @property {CPDFCheckStyle} checkStyle The style of the radiobutton form widget.
 */
export class CPDFRadiobuttonWidget extends CPDFWidget {

    /**
     * The state of the radiobutton form widget.
     */
    isChecked: boolean;

    checkColor : string;

    checkStyle : CPDFCheckStyle;

    constructor(params: Partial<CPDFRadiobuttonWidget>) {
        super(params);
        this.type = 'radioButton';
        this.isChecked = params.isChecked ?? false;
        this.checkColor = params.checkColor ?? '#000000';
        this.checkStyle = safeParseEnumValue(params.checkStyle, Object.values(CPDFCheckStyle), CPDFCheckStyle.CHECK);
    }

    /**
     * Update radiobutton widget properties with type safety
     * @param updates Partial object containing properties to update
     * @returns this instance for chaining
     * 
     * @example
     * radiobuttonWidget.update({
     *   title: 'Updated Title',
     *   isChecked: true,
     *   checkColor: '#FF0000',
     *   checkStyle: CPDFCheckStyle.CIRCLE
     * });
     * await document.updateWidget(radiobuttonWidget);
     */
    update(updates: Partial<Pick<CPDFRadiobuttonWidget, 'title' | 'isChecked' | 'checkColor' | 'checkStyle' | 'borderColor' | 'fillColor' | 'borderWidth'>>): this {
        Object.assign(this, updates);
        return this;
    }

}

