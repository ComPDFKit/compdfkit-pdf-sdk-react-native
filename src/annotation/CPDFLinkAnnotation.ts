/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFAction } from "../document/action/CPDFAction";
import { CPDFAnnotation } from "./CPDFAnnotation";

/**
 * @class CPDFLinkAnnotation
 * @group Annotations
 * @property {CPDFAction} action - The action associated with the link annotation.
 */
export class CPDFLinkAnnotation extends CPDFAnnotation {

    /**
     * The action associated with the link annotation.
     * example: 
     * - web link:
     * { type: 'uri', uri: 'https://www.compdf.com' }
     * 
     * - email link:
     * { type: 'uri', uri: 'mailto:support@compdf.com' }
     * 
     * - go to page:
     * { type: 'goTo', pageIndex: 2 }
     * 
     * @see {@link CPDFURIAction}
     * @see {@link CPDFGoToAction}
     */
    action?: CPDFAction;

    constructor(params: Partial<CPDFLinkAnnotation>) {
        super(params);
        this.type = 'link';
        if (params.action != null) {
            this.action = CPDFAction.fromJson(params.action);
        }
    }

    /**
     * Update link annotation properties with type safety
     * @param updates Partial object containing properties to update
     * @returns this instance for chaining
     * 
     * @example
     * linkAnnotation.update({
     *   title: 'Updated Title',
     *   content: 'Updated content',
     *   action: CPDFGoToAction.toPage(2)
     * });
     * await document.updateAnnotation(linkAnnotation);
     */
    update(updates: Partial<Pick<CPDFLinkAnnotation, 'title' | 'content' | 'action'>>): this {
        Object.assign(this, updates);
        return this;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            action: this.action ? this.action.toJSON?.() ?? this.action : undefined,
        };
    }


}