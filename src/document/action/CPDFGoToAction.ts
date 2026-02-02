/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFAction } from "./CPDFAction"


export class CPDFGoToAction extends CPDFAction {

    pageIndex: number;

    constructor(params: Partial<CPDFGoToAction>) {
        super(params);
        this.actionType = 'goTo';
        this.pageIndex = params.pageIndex ?? 0;
    }

    static toPage(pageIndex: number): CPDFGoToAction {
        return new CPDFGoToAction({ actionType: 'goTo', pageIndex: pageIndex });
    }

    static fromJson(json: any): CPDFGoToAction {
        return new this(json);
    }

    toJSON() {
        return {
            ...super.toJSON(),
            pageIndex: this.pageIndex
        };
    }

}