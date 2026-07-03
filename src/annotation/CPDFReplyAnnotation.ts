/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import {
  CPDFAnnotation,
  CPDFAnnotationMarkState,
  CPDFAnnotationReviewState,
} from "./CPDFAnnotation";
import { CPDFAnnotationType } from "../configuration/CPDFOptions";
import { safeParseEnumValue } from "../util/CPDFEnumUtils";

export { CPDFAnnotationMarkState, CPDFAnnotationReviewState };

/**
 * A reply attached to a PDF annotation.
 *
 * The reply model includes the reply content and the current mark/review state
 * exposed by the native SDK. Native mark/review state reply nodes are still
 * implementation details and are not exposed through a public replyType field.
 */
export class CPDFReplyAnnotation extends CPDFAnnotation {
  modifyDate: Date | null = null;

  constructor(params: Partial<CPDFReplyAnnotation>) {
    super({
      ...params,
      type: safeParseEnumValue(
        params.type,
        Object.values(CPDFAnnotationType),
        CPDFAnnotationType.UNKNOWN
      ),
    });
    this.modifyDate =
      params.modifyDate != null ? new Date(params.modifyDate) : null;
    this.markState = safeParseEnumValue(
      params.markState,
      Object.values(CPDFAnnotationMarkState),
      CPDFAnnotationMarkState.UNMARKED
    );
    this.reviewState = safeParseEnumValue(
      params.reviewState,
      Object.values(CPDFAnnotationReviewState),
      CPDFAnnotationReviewState.NONE
    );
  }

  toJSON() {
    return {
      ...super.toJSON(),
      ...(this.modifyDate && { modifyDate: this.modifyDate.getTime() }),
      markState: this.markState,
      reviewState: this.reviewState,
    };
  }
}
