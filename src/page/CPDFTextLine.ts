/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type { CPDFRectF } from "../util/CPDFRectF";
import { CPDFTextRange } from "./CPDFTextRange";

export type CPDFTextLineJson = {
    pageIndex?: number;
    page_index?: number;
    lineIndex?: number;
    line_index?: number;
    location?: number;
    length?: number;
    rect?: CPDFRectF;
};

export class CPDFTextLine {

    pageIndex: number;

    lineIndex: number;

    location: number;

    length: number;

    rect: CPDFRectF;

    constructor(params: CPDFTextLineJson = {}) {
        this.pageIndex = params.pageIndex ?? params.page_index ?? 0;
        this.lineIndex = params.lineIndex ?? params.line_index ?? 0;
        this.location = params.location ?? 0;
        this.length = params.length ?? 0;
        this.rect = params.rect ?? { left: 0, top: 0, right: 0, bottom: 0 };
    }

    static fromJson(json: CPDFTextLineJson): CPDFTextLine {
        return new CPDFTextLine(json);
    }

    toJson(): CPDFTextLineJson {
        return {
            pageIndex: this.pageIndex,
            lineIndex: this.lineIndex,
            location: this.location,
            length: this.length,
            rect: this.rect,
        };
    }

    toTextRange(): CPDFTextRange {
        return new CPDFTextRange(
            this.pageIndex,
            this.location,
            this.length,
            this.lineIndex
        );
    }
}
