/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFAnnotationType } from "../configuration/CPDFOptions";

/**
 * @class CPDFAnnotation
 * @property { CPDFAnnotationType } [type] Annotation type identifier
 * @property { title } [title] Annotation title
 * @property { number } [page] The page number where the note is located
 * @property { string } [content] annotation content.
 */
export class CPDFAnnotation {

    private _viewerRef: any;

    type: CPDFAnnotationType;
    title: string;
    page: number;
    content: string;
    uuid: string;

    constructor(viewerRef: any, params: Partial<CPDFAnnotation>) {
        this.type = CPDFAnnotation.parseType(params.type);
        this.title = params.title ?? '';
        this.page = params.page ?? 0;
        this.content = params.content ?? "";
        this.uuid = params.uuid ?? "";
        this._viewerRef = viewerRef;
    }

    static fromJson<T extends CPDFAnnotation>(this: new (viewerRef: any, params: Partial<T>) => T, json: any, viewerRef : any): T {
        return new this(viewerRef, json);
    }

    static fromJsonArray<T extends CPDFAnnotation>(this: new (viewerRef: any, params: Partial<T>) => T, jsonArray: any[], viewerRef: any): T[] {
        return jsonArray.map(item => new this(viewerRef, item));
    }

    static parseType(type: any): CPDFAnnotationType {
        if (Object.values(CPDFAnnotationType).includes(type)) {
            return type as CPDFAnnotationType;
        }
        return CPDFAnnotationType.UNKNOWN;
    }

    toJSON() {
        const { _viewerRef, ...data } = this;
        return data;
    }
}