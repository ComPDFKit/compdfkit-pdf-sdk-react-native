/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFWidget } from "./CPDFWidget";
import { CPDFWidgetItem } from "./CPDFWidgetItem";

/**
 * Class representing a combobox form widget, storing basic information about the combobox form.
 * 
 * @class CPDFComboboxWidget
 * @memberof CPDFComboboxWidget
 * @property {CPDFWidgetItem[]} options - The list of options available in the combobox.
 * @property {number[]} selectedIndexes - The indexes of the selected options in the combobox (default: []).
 * @property {string} fontColor - The font color of the combobox (default: '#000000').
 * @property {number} fontSize - The font size of the combobox (default: 0).
 */
export class CPDFComboboxWidget extends CPDFWidget {

    readonly options : CPDFWidgetItem[];

    readonly selectedIndexes : number[];

    fontColor : string;

    fontSize : number;

    familyName : string;

    styleName : string;

    constructor(viewerRef : any, params: Partial<CPDFComboboxWidget>) {
        super(viewerRef, params);
        this.options = params.options ?? [];
        this.selectedIndexes = params.selectedIndexes ?? [];
        this.fontColor = params.fontColor ?? "#000000";
        this.fontSize = params.fontSize ?? 0;
        this.familyName = params.familyName ?? "";
        this.styleName = params.styleName ?? "";
    }

}