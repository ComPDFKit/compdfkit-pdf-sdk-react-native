/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

export class CPDFTextRange {
    
    pageIndex: number;
    
    location: number;

    length: number;

    textRangeIndex: number;

    constructor(pageIndex: number, location: number, length: number, textRangeIndex: number) {
        this.pageIndex = pageIndex;
        this.location = location;
        this.length = length;
        this.textRangeIndex = textRangeIndex;
    }

    static fromJson(json: any): CPDFTextRange {
        return new CPDFTextRange(
            json.pageIndex,
            json.location,
            json.length,
            json.textRangeIndex
        );
    }

    toJson(): any {
        return {
            pageIndex: this.pageIndex,
            location: this.location,
            length: this.length,
            textRangeIndex: this.textRangeIndex
        };
    }

    /**
     * Returns a new CPDFTextRange that expands the current range by the given number of characters
     * before and after the original range.
     *
     * If the `before` value causes the start position to be less than 0, it will automatically
     * clamp the start to 0 and reduce the total length accordingly to avoid overflow.
     *
     * @param before The number of characters to include before the original range. Default is 0.
     * @param after The number of characters to include after the original range. Default is 0.
     * @returns A new CPDFTextRange instance with adjusted `location` and `length`.
     */
    expanded(before: number = 0, after: number = 0): CPDFTextRange {
        let newStart = this.location - before;
        let newLength = this.length + before + after;

        if (newStart < 0) {
            newLength += newStart;
            newStart = 0;
        }

        return new CPDFTextRange(
            this.pageIndex,
            newStart,
            newLength,
            this.textRangeIndex
        );
    }

}