/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFWidgetType } from "../../configuration/CPDFOptions";
import { CPDFCheckboxWidget } from "./CPDFCheckboxWidget";
import { CPDFComboboxWidget } from "./CPDFComboboxWidget";
import { CPDFListboxWidget } from "./CPDFListboxWidget";
import { CPDFPushbuttonWidget } from "./CPDFPushbuttonWidget";
import { CPDFRadiobuttonWidget } from "./CPDFRadiobuttonWidget";
import { CPDFSignatureWidget } from "./CPDFSignatureWidget";
import { CPDFTextWidget } from "./CPDFTextWidget";
import { CPDFWidget } from "./CPDFWidget";

export class CPDFWidgetFactory {
    
    private static widgetMap = new Map<CPDFWidgetType, (json: any) => CPDFWidget>([
        [CPDFWidgetType.TEXT_FIELD, (json) => CPDFTextWidget.fromJson(json)],
        [CPDFWidgetType.SIGNATURES_FIELDS, (json) => CPDFSignatureWidget.fromJson(json)],
        [CPDFWidgetType.RADIO_BUTTON, (json) => CPDFRadiobuttonWidget.fromJson(json)],
        [CPDFWidgetType.PUSH_BUTTON, (json) => CPDFPushbuttonWidget.fromJson(json)],
        [CPDFWidgetType.LISTBOX, (json) => CPDFListboxWidget.fromJson(json)],
        [CPDFWidgetType.COMBOBOX, (json) => CPDFComboboxWidget.fromJson(json)],
        [CPDFWidgetType.CHECKBOX, (json) => CPDFCheckboxWidget.fromJson(json)]
    ]);

    static create(json: any): CPDFWidget {
        const type = CPDFWidget.parseType(json.type);
        const widgetCreator = CPDFWidgetFactory.widgetMap.get(type);
        return widgetCreator ? widgetCreator(json) : CPDFWidget.fromJson(json);
    }

    static createFromArray(jsonArray: any[]): CPDFWidget[] {
        return jsonArray.map(item => CPDFWidgetFactory.create(item));
    }
}