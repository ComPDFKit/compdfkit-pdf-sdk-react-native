/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
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
 * @memberof CPDFLinkAnnotation
 * @property {CPDFAction} action - The action associated with the link annotation.
 */
export class CPDFLinkAnnotation extends CPDFAnnotation {

    action : CPDFAction | null = null;

    constructor(viewerRef: any,params: Partial<CPDFLinkAnnotation>) {
        super(viewerRef,params);
        this.action = CPDFAction.fromJson(params.action ?? {});
    }
}