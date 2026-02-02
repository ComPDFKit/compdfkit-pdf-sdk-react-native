/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFAction } from "../../document/action/CPDFAction";
import { CPDFWidget } from "./CPDFWidget";

/**
 * A class representing a push button form widget, storing basic information about the button form.
 * 
 * @class CPDFPushbuttonWidget
 * @group Forms
 * @property {string} buttonTitle - The title of the push button form widget.
 * @property {CPDFAction | null} action - The action associated with the push button (default: null).
 * @property {string} fontColor - The font color of the push button (default: '#000000').
 * @property {number} fontSize - The font size of the push button (default: 0).
 * @property {string} familyName - The font family name of the push button.
 * @property {string} styleName - The font style name of the push button.
 */
export class CPDFPushbuttonWidget extends CPDFWidget {

    buttonTitle : string;

    action : CPDFAction | null = null;

    fontColor : string;

    fontSize : number;

    familyName : string;

    styleName : string;

    constructor(params: Partial<CPDFPushbuttonWidget>) {
        super(params);
        this.type = 'pushButton';
        this.buttonTitle = params.buttonTitle ?? "";
        this.action = CPDFAction.fromJson(params.action ?? {});
        this.fontColor = params.fontColor ?? "#000000";
        this.fontSize = params.fontSize ?? 14;
        this.familyName = params.familyName ?? "";
        this.styleName = params.styleName ?? "";
    }

    /**
     * Update push button widget properties with type safety
     * @param updates Partial object containing properties to update
     * @returns this instance for chaining
     * 
     * @example
     * pushbuttonWidget.update({
     *   title: 'Updated Title',
     *   buttonTitle: 'Click Me',
     *   fontColor: '#FF0000',
     *   fontSize: 12,
     *   familyName: 'Helvetica',
     *   styleName: 'Bold',
     *   action: CPDFGotoAction.toPage(2)
     * });
     * await document.updateWidget(pushbuttonWidget);
     */
    update(updates: Partial<Pick<CPDFPushbuttonWidget, 'title' | 'buttonTitle' | 'action' | 'fontColor' | 'fontSize' | 'familyName' | 'styleName' | 'borderColor' | 'fillColor' | 'borderWidth'>>): this {
        Object.assign(this, updates);
        return this;
    }

}