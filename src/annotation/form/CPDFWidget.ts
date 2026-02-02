/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFWidgetType } from "../../configuration/CPDFOptions";
import { CPDFRectF } from "../../util/CPDFRectF";

/**
 * Base class for form widgets, storing essential form information.
 * 
 * This class represents a form widget in a PDF document, containing basic attributes
 * such as type, title, and the page it appears on.
 * The `fromJson` method allows converting JSON data into form widget objects.
 *
 * @class CPDFWidget
 * @group Forms
 * @property {CPDFWidgetType} type - The type of the form widget.
 * @property {string} title - The title of the form widget (default: empty string).
 * @property {number} page - The page number where the form widget appears (default: 0).
 * @property {string} uuid - The unique identifier for the form widget (default: empty string).
 * @property {Date | null} modifyDate - The date when the form widget was last modified (default: null).
 * @property {Date | null} createDate - The date when the form widget was created (default: null).
 * @property {CPDFRectF | null} rect - The rectangular coordinates of the form widget (default: null).
 * @property {string} borderColor - The border color of the form widget (default: '#000000').
 * @property {string} fillColor - The fill color of the form widget (default: '#000000').
 */
export class CPDFWidget {

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
    readonly page: number;

    readonly uuid: string;
    
    createDate : Date | null = null;

    rect : CPDFRectF | null = null;

    borderColor : string;

    fillColor : string;

    borderWidth: number;

    constructor(params: Partial<CPDFWidget>) {
        this.type = CPDFWidget.parseType(params.type);
        this.title = params.title ?? "";
        this.page = params.page ?? 0;
        this.uuid = params.uuid ?? "";
        this.createDate = params.createDate != null ? new Date(params.createDate) : null;
        this.rect = params.rect ?? null;
        this.borderColor = params.borderColor ?? '#000000';
        this.fillColor = params.fillColor ?? '#000000';
        this.borderWidth = params.borderWidth ?? 0;
    }

    static fromJson<T extends CPDFWidget>(this: new (params: Partial<T>) => T, json: any): T {
        return new this(json);
    }

    static fromJsonArray<T extends CPDFWidget>(this: new (params: Partial<T>) => T, jsonArray: any[]): T[] {
        return jsonArray.map(item => new this(item));  
    }

    static parseType(type: any): CPDFWidgetType {
        return Object.values(CPDFWidgetType).includes(type) ? type as CPDFWidgetType : CPDFWidgetType.UNKNOWN;
    }

    toJSON() {
        const { createDate, ...data } = this;
        return {
            ...data,
            ...(createDate && { createDate: createDate.getTime() }),
            borderColor: this.borderColor,
            fillColor: this.fillColor,
            borderWidth: this.borderWidth
        }
    }

    /**
     * Update widget properties in a type-safe way
     * @param updates Partial object containing properties to update
     * @returns this instance for chaining
     * 
     * @example
     * widget.update({ title: 'New Title', fillColor: '#FF0000', borderColor: '#00FF00' });
     * await document.updateWidget(widget);
     */
    update(updates: Partial<Omit<this, 'type' | 'page' | 'uuid' | 'createDate'>>): this {
        Object.assign(this, updates);
        return this;
    }
}