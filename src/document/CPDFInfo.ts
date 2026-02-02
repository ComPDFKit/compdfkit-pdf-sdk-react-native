/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

/**
 * Interface representing metadata information of a PDF document.
 * Contains standard PDF document properties according to PDF specification.
 */
export interface CPDFInfo {
    /**
     * The document's title.
     */
    title?: string;

    /**
     * The name of the person who created the document.
     */
    author?: string;

    /**
     * The subject of the document.
     */
    subject?: string;

    /**
     * Keywords associated with the document.
     * Multiple keywords are typically separated by commas or semicolons.
     */
    keywords?: string;

    /**
     * The name of the application that created the original document
     * (if the document was converted from another format).
     */
    creator?: string;

    /**
     * The name of the application that produced the PDF document.
     */
    producer?: string;

    /**
     * The date and time when the document was created.
     */
    creationDate?: Date;

    /**
     * The date and time when the document was most recently modified.
     */
    modificationDate?: Date;
}