/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
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
 * @memberof CPDFpushbuttonWidget
 * @property {string} buttonTitle - The title of the push button form widget.
 * @property {CPDFAction | null} action - The action associated with the push button (default: null).
 * @property {string} fontColor - The font color of the push button (default: '#000000').
 * @property {number} fontSize - The font size of the push button (default: 0).
 * @property {string} fontName - The font name of the push button (default: empty string).
 */
export class CPDFPushbuttonWidget extends CPDFWidget {

    buttonTitle : string;

    action : CPDFAction | null = null;

    fontColor : string;

    fontSize : number;

    familyName : string;

    styleName : string;

    constructor(viewerRef : any, params: Partial<CPDFPushbuttonWidget>) {
        super(viewerRef, params);
        this.buttonTitle = params.buttonTitle ?? "";
        this.action = CPDFAction.fromJson(params.action ?? {});
        this.fontColor = params.fontColor ?? "#000000";
        this.fontSize = params.fontSize ?? 0;
        this.familyName = params.familyName ?? "";
        this.styleName = params.styleName ?? "";
    }

}