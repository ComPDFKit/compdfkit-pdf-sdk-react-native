/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFWidgetType } from "../../configuration/CPDFOptions";
import { NativeModules, findNodeHandle } from 'react-native';
const { CPDFViewManager } = NativeModules;

/**
 * Base class for form widgets, storing essential form information.
 * 
 * This class represents a form widget in a PDF document, containing basic attributes
 * such as type, title, and the page it appears on.
 * The `fromJson` method allows converting JSON data into form widget objects.
 *
 * @class CPDFWidget
 * @memberof CPDFWidget
 * 
 * @property {CPDFWidgetType} type - The type of the form widget.
 * @property {string} title - The title of the form widget (default: empty string).
 * @property {number} page - The page number where the form widget appears (default: 0).
 */
export class CPDFWidget {
    
    protected _viewerRef: any;

    /**
     * The type of the form widget.
     */
    type: CPDFWidgetType;

    /**
     *  The title of the form widget (default: empty string).
     */
    title: string;
    
    /**
     * The page number where the form widget appears (default: 0).
     */
    page: number;

    uuid: string;

    constructor(viewerRef : any, params: Partial<CPDFWidget>) {
        this.type = CPDFWidget.parseType(params.type);
        this.title = params.title ?? "";
        this.page = params.page ?? 0;
        this.uuid = params.uuid ?? "";
        this._viewerRef = viewerRef;
    }

    static fromJson<T extends CPDFWidget>(this: new (viewerRef : any, params: Partial<T>) => T, json: any,viewerRef : any): T {
        return new this(viewerRef, json);
    }

    static fromJsonArray<T extends CPDFWidget>(this: new (viewerRef : any, params: Partial<T>) => T, jsonArray: any[],viewerRef : any): T[] {
        return jsonArray.map(item => new this(viewerRef, item));  
    }

    static parseType(type: any): CPDFWidgetType {
        return Object.values(CPDFWidgetType).includes(type) ? type as CPDFWidgetType : CPDFWidgetType.UNKNOWN;
    }

    toJSON() {
        const { _viewerRef, ...data } = this;
        return data;
    }


    /**
     * Update the appearance of a form widget.
     * @returns 
     */
    updateAp = () : Promise<void> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag) {
            try {
                return CPDFViewManager.updateAp(tag, this.page, this.uuid);
            } catch (error) {
                console.log(error);
            }
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }
}