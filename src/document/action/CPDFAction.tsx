/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFActionType } from "../../configuration/CPDFOptions";
import { safeParseEnumValue } from "../../util/CPDFEnumUtils";


export class CPDFAction {

    actionType : CPDFActionType;

    constructor(params: Partial<CPDFAction>) {
        this.actionType = safeParseEnumValue(params.actionType, Object.values(CPDFActionType), CPDFActionType.UNKNOWN);
    }

    static fromJson(json: any): CPDFAction {
        const actionType = safeParseEnumValue(json.actionType, Object.values(CPDFActionType), CPDFActionType.UNKNOWN);
        switch(actionType){
            case 'goTo':
                const { CPDFGoToAction } = require("./CPDFGoToAction");
                return CPDFGoToAction.fromJson(json);
            case 'uri':
                const { CPDFUriAction } = require("./CPDFUriAction");
                return CPDFUriAction.fromJson(json);
            default:
                return new CPDFAction(json);
        }
    }

}