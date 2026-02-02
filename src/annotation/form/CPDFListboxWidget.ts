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
 * Class representing a listbox form widget, storing basic information about the listbox form.
 * 
 * @class CPDFListboxWidget
 * @group Forms
 * @property {CPDFWidgetItem[]} options - The list of options available in the listbox.
 * @property {number} selectItemAtIndex - The index of the selected option in the listbox (default: 0).
 * @property {string} fontColor - The font color of the listbox (default: '#000000').
 * @property {number} fontSize - The font size of the listbox (default: 0).
 * @property {string} familyName - The font family name of the listbox.
 * @property {string} styleName - The font style name of the listbox.
 */
export class CPDFListboxWidget extends CPDFWidget {

    options: CPDFWidgetItem[];

    selectItemAtIndex: number;

    fontColor : string;

    fontSize : number;

    familyName : string;

    styleName : string;

    constructor(params: Partial<CPDFListboxWidget>) {
        super(params);
        this.type = 'listBox';
        this.options = params.options ?? [];
        this.selectItemAtIndex = params.selectItemAtIndex ?? 0;
        this.fontColor = params.fontColor ?? "#000000";
        this.fontSize = params.fontSize ?? 14;
        this.familyName = params.familyName ?? "";
        this.styleName = params.styleName ?? "";
    }

    /**
     * Update listbox widget properties with type safety
     * @param updates Partial object containing properties to update
     * @returns this instance for chaining
     * 
     * @example
     * listboxWidget.update({
     *   title: 'Updated Title',
     *   options: [
     *    { value: 'Option 1', displayText: 'Option 1' },
     *    { value: 'Option 2', displayText: 'Option 2' }],
     *   selectItemAtIndex: 1,
     *   fontColor: '#0000FF',
     *   fontSize: 14,
     *   familyName: 'Times',
     *   styleName: 'Bold'
     * });
     * await document.updateWidget(listboxWidget);
     */
    update(updates: Partial<Pick<CPDFListboxWidget, 'title' | 'options'| 'selectItemAtIndex' | 'fontColor' | 'fontSize' | 'familyName' | 'styleName' | 'borderColor' | 'fillColor' | 'borderWidth'>>): this {
        Object.assign(this, updates);
        return this;
    }

}