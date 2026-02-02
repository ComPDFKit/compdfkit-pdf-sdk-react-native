/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
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
 * @group Forms
 * @property {CPDFWidgetItem[]} options - The list of options available in the combobox.
 * @property {number} selectItemAtIndex - The index of the selected option in the combobox (default: 0).
 * @property {string} fontColor - The font color of the combobox (default: '#000000').
 * @property {number} fontSize - The font size of the combobox (default: 0).
 * @property {string} familyName - The font family name of the combobox.
 * @property {string} styleName - The font style name of the combobox.
 */
export class CPDFComboboxWidget extends CPDFWidget {

    options : CPDFWidgetItem[];

    selectItemAtIndex : number;

    fontColor : string;

    fontSize : number;

    familyName : string;

    styleName : string;

    constructor(params: Partial<CPDFComboboxWidget>) {
        super(params);
        this.type = 'comboBox';
        this.options = params.options ?? [];
        this.selectItemAtIndex = params.selectItemAtIndex ?? 0;
        this.fontColor = params.fontColor ?? "#000000";
        this.fontSize = params.fontSize ?? 14;
        this.familyName = params.familyName ?? "";
        this.styleName = params.styleName ?? "";
    }

    /**
     * Update combobox widget properties with type safety
     * @param updates Partial object containing properties to update
     * @returns this instance for chaining
     * 
     * @example
     * comboboxWidget.update({
     *   title: 'Updated Title',
     *   options: newOptions,
     *   fontColor: '#00FF00',
     *   fontSize: 12,
     *   familyName: 'Times',
     *   styleName: 'Italic'
     * });
     * await document.updateWidget(comboboxWidget);
     */
    update(updates: Partial<Pick<CPDFComboboxWidget, 'title' | 'options' | 'selectItemAtIndex' | 'fontColor' | 'fontSize' | 'familyName' | 'styleName' | 'borderColor' | 'fillColor' | 'borderWidth'>>): this {
        Object.assign(this, updates);
        return this;
    }

}