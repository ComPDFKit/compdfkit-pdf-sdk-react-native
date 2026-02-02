/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFStampType, CPDFStandardStamp } from "../configuration/CPDFOptions";
import { safeParseEnumValue } from "../util/CPDFEnumUtils";
import { CPDFAnnotation } from "./CPDFAnnotation";
import { CPDFTextStamp } from "./CPDFTextStamp";

/**
 * @class CPDFStampAnnotation
 * @group Annotations
 * @property { CPDFStandardStamp } standardStamp - The standard stamp type.
 * @property { CPDFStampType } stampType - The stamp type.
 * @property { CPDFTextStamp } textStamp - The text stamp details.
 */
export class CPDFStampAnnotation extends CPDFAnnotation {

    /**
     * * The standard stamp type.
     * only applicable if stampType is STANDARD
     */
    standardStamp?: CPDFStandardStamp;

    /**
     * The stamp type.
     * standard - A predefined standard stamp.
     * text - A custom text stamp.
     */
    stampType: CPDFStampType;

    /**
     * The text stamp details.
     * only applicable if stampType is TEXT
     */
    textStamp?: CPDFTextStamp;

    constructor(params: Partial<CPDFStampAnnotation>) {
        super(params);
        this.type = 'stamp';
        this.standardStamp = safeParseEnumValue(params.standardStamp, Object.values(CPDFStandardStamp), CPDFStandardStamp.UNKNOWN);
        this.stampType = safeParseEnumValue(params.stampType, Object.values(CPDFStampType), CPDFStampType.UNKNOWN);
        if (params.textStamp !== undefined){
            this.textStamp = CPDFTextStamp.fromJson(params.textStamp);
        }
    }

    toJSON() {
        return {
            ...super.toJSON(),
            standardStamp: this.standardStamp,
            stampType: this.stampType,
            textStamp: this.textStamp ? this.textStamp : undefined,
        };
    }

}