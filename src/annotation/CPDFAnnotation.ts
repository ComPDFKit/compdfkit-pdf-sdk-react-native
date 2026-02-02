/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
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
 * @group Annotations
 * @property { CPDFAnnotationType } [type] Annotation type identifier
 * @property { title } [title] Annotation title
 * @property { number } [page] The page number where the note is located
 * @property { string } [content] annotation content.
 * @property { string } [uuid] annotation uuid.
 * @property { Date } [createDate] annotation create date.
 * @property { CPDFRectF } [rect] annotation rect.
 */
export class CPDFAnnotation {

    type: CPDFAnnotationType;

    title: string;
    
    readonly page: number;
    
    content: string;
    
    readonly uuid: string;
    
    createDate : Date | null = null;
    
    rect : CPDFRectF | null = null;

    constructor(params: Partial<CPDFAnnotation>) {
        this.type = safeParseEnumValue(params.type, Object.values(CPDFAnnotationType), CPDFAnnotationType.UNKNOWN);
        this.title = params.title ?? '';
        this.page = params.page ?? 0;
        this.content = params.content ?? "";
        this.uuid = params.uuid ?? "";
        this.createDate = params.createDate != null ? new Date(params.createDate) : null;
        this.rect = params.rect ?? null;
    }

    static fromJson<T extends CPDFAnnotation>(this: new (params: Partial<T>) => T, json: any): T {
        return new this(json);
    }

    static fromJsonArray<T extends CPDFAnnotation>(this: new (params: Partial<T>) => T, jsonArray: any[]): T[] {
        return jsonArray.map(item => new this(item));
    }

    /**
     * Update annotation properties in a type-safe way
     * @param updates Partial object containing properties to update
     * @returns this instance for chaining
     * 
     * @example
     * annotation.update({ title: 'New Title', content: 'New Content' });
     * await document.updateAnnotation(annotation);
     */
    update(updates: Partial<Omit<this, '_viewerRef' | 'page' | 'uuid' | 'createDate'>>): this {
        Object.assign(this, updates);
        return this;
    }

    toJSON() {
        const { createDate, ...data } = this;
        return {
            ...data,
            ...(createDate && { createDate: createDate.getTime() })
        }
    }
}