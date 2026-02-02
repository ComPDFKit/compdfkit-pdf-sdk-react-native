/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */


export interface CPDFFontNameProps {
    familyName: string;
    styleNames: string[];
}

export class CPDFFontName {
    readonly familyName: string;
    readonly styleNames: string[];

    constructor({ familyName = '', styleNames = [] }: Partial<CPDFFontNameProps> = {}) {
        this.familyName = familyName;
        this.styleNames = styleNames;
    }

    // Create a CPDFFontName from a JSON-like object returned by native/platform code.
    // Expected keys: `familyName` (string), `styleNames` (string[])
    static fromJson(json: any): CPDFFontName {
        const familyName = typeof json?.familyName === 'string' ? json.familyName : '';
        const styleNames = Array.isArray(json?.styleNames)
            ? json.styleNames.filter((v: any) => typeof v === 'string')
            : [];
        return new CPDFFontName({ familyName, styleNames });
    }

    toJson(): { familyName: string; styleNames: string[] } {
        return {
            familyName: this.familyName,
            styleNames: this.styleNames,
        };
    }
}

export default CPDFFontName;