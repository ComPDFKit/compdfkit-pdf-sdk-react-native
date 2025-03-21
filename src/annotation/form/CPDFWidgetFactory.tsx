/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
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
    
    private static widgetMap = new Map<CPDFWidgetType, (viewerRef: any, json: any) => CPDFWidget>([
        [CPDFWidgetType.TEXT_FIELD, (viewerRef, json) => CPDFTextWidget.fromJson(json, viewerRef)],
        [CPDFWidgetType.SIGNATURES_FIELDS, (viewerRef, json) => CPDFSignatureWidget.fromJson(json, viewerRef)],
        [CPDFWidgetType.RADIO_BUTTON, (viewerRef, json) => CPDFRadiobuttonWidget.fromJson(json, viewerRef)],
        [CPDFWidgetType.PUSH_BUTTON, (viewerRef, json) => CPDFPushbuttonWidget.fromJson(json, viewerRef)],
        [CPDFWidgetType.LISTBOX, (viewerRef, json) => CPDFListboxWidget.fromJson(json, viewerRef)],
        [CPDFWidgetType.COMBOBOX, (viewerRef, json) => CPDFComboboxWidget.fromJson(json, viewerRef)],
        [CPDFWidgetType.CHECKBOX, (viewerRef, json) => CPDFCheckboxWidget.fromJson(json, viewerRef)]
    ]);

    static create(viewerRef: any, json: any): CPDFWidget {
        const type = CPDFWidget.parseType(json.type);
        const widgetCreator = CPDFWidgetFactory.widgetMap.get(type);
        return widgetCreator ? widgetCreator(viewerRef, json) : CPDFWidget.fromJson(json, viewerRef);
    }

    static createFromArray(viewerRef: any, jsonArray: any[]): CPDFWidget[] {
        return jsonArray.map(item => CPDFWidgetFactory.create(viewerRef, item));
    }
}