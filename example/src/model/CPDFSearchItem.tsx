/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFTextRange } from "@compdfkit_pdf_sdk/react_native";

export class CPDFSearchItem {

    keywordTextRange: CPDFTextRange;

    contentTextRange: CPDFTextRange;

    keywords: string;

    content: string;

    constructor(keywordTextRange: CPDFTextRange, contentTextRange: CPDFTextRange, keywords: string, content: string) {
        this.keywordTextRange = keywordTextRange;
        this.contentTextRange = contentTextRange;
        this.keywords = keywords;
        this.content = content;
    }
}