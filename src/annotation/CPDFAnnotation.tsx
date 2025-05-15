/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFAnnotationType } from "../configuration/CPDFOptions";
import { safeParseEnumValue } from "../util/CPDFEnumUtils";
import { CPDFRectF } from "../util/CPDFRectF";

/**
 * @class CPDFAnnotation
 * @property { CPDFAnnotationType } [type] Annotation type identifier
 * @property { title } [title] Annotation title
 * @property { number } [page] The page number where the note is located
 * @property { string } [content] annotation content.
 * @property { string } [uuid] annotation uuid.
 * @property { Date } [modifyDate] annotation modify date.
 * @property { Date } [createDate] annotation create date.
 * @property { CPDFRectF } [rect] annotation rect.
 */
export class CPDFAnnotation {

    private _viewerRef: any;

    type: CPDFAnnotationType;

    title: string;
    
    readonly page: number;
    
    content: string;
    
    readonly uuid: string;
    
    createDate : Date | null = null;
    
    rect : CPDFRectF | null = null;

    constructor(viewerRef: any, params: Partial<CPDFAnnotation>) {
        this._viewerRef = viewerRef;
        this.type = safeParseEnumValue(params.type, Object.values(CPDFAnnotationType), CPDFAnnotationType.UNKNOWN);
        this.title = params.title ?? '';
        this.page = params.page ?? 0;
        this.content = params.content ?? "";
        this.uuid = params.uuid ?? "";
        this.createDate = params.createDate != null ? new Date(params.createDate) : null;
        this.rect = params.rect ?? null;
    }

    static fromJson<T extends CPDFAnnotation>(this: new (viewerRef: any, params: Partial<T>) => T, json: any, viewerRef : any): T {
        return new this(viewerRef, json);
    }

    static fromJsonArray<T extends CPDFAnnotation>(this: new (viewerRef: any, params: Partial<T>) => T, jsonArray: any[], viewerRef: any): T[] {
        return jsonArray.map(item => new this(viewerRef, item));
    }

    private static formatDate(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
               `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    toJSON() {
        const { _viewerRef, createDate, ...data } = this;
        return {
            ...data,
            createDate: createDate? CPDFAnnotation.formatDate(createDate) : null
        }
    }
}