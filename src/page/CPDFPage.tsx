/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { NativeModules, findNodeHandle } from 'react-native';
import { CPDFAnnotationFactory } from '../annotation/CPDFAnnotationFactory';
import { CPDFAnnotation } from '../annotation/CPDFAnnotation';
import { CPDFWidgetFactory } from '../annotation/form/CPDFWidgetFactory';
import { CPDFWidget } from '../annotation/form/CPDFWidget';
const { CPDFViewManager } = NativeModules;

/**
 * @class CPDFPage
 * @memberof CPDFPage
 * The `CPDFPage` class represents a page in a PDF document. 
 * It provides methods to retrieve annotations and form widgets present on the page.
 * @example
 * // Get the first page
 * const pageIndex = 0;
 * const cpdfPage : CPDFPage = pdfReaderRef?.current?._pdfDocument.pageAtIndex(pageIndex);
 * 
 */
export class CPDFPage {

    pageIndex: number

    private _viewerRef: any;

    constructor(viewerRef: any, pageIndex: number) {
        this.pageIndex = pageIndex;
        this._viewerRef = viewerRef;
    }

    /**
     * Retrieves all annotations on the current page.
     *
     * This method fetches all annotations present on the current page of the PDF document 
     * and returns a list of corresponding CPDFAnnotation instances.
     *
     * @example
     * const pageIndex = 0;
     * const page = pdfReaderRef?.current?._pdfDocument.pageAtIndex(pageIndex);
     * const annotations = await page?.getAnnotations();
     *
     * @returns {Promise<CPDFAnnotation[]>} A promise that resolves with all annotations on the current page, 
     * or an empty array if retrieval fails.
     */
    getAnnotations = async (): Promise<CPDFAnnotation[]> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            try {
                const data = await CPDFViewManager.getAnnotations(tag, this.pageIndex);
                return CPDFAnnotationFactory.createFromArray(this._viewerRef, data);
            } catch (e) {
                return [];
            }
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }

    /**
     * Retrieves all form widgets on the current page.
     *
     * This method fetches all form widgets available on the current page of the PDF document 
     * and returns a list of corresponding `CPDFWidget` instances.
     *
     * @example
     * const pageIndex = 0;
     * const page = pdfReaderRef?.current?._pdfDocument.pageAtIndex(pageIndex);
     * const widgets = await page?.getWidgets();
     *
     * @see CPDFWidget - Base class for all form widgets
     * @see CPDFTextWidget - Text input field widget
     * @see CPDFSignatureWidget - Signature widget
     * @see CPDFRadiobuttonWidget - Radio button widget
     * @see CPDFPushbuttonWidget - Button widget
     * @see CPDFListboxWidget - List box widget
     * @see CPDFComboboxWidget - Combo box widget
     * @see CPDFCheckboxWidget - Checkbox widget
     *
     * @returns {Promise<CPDFWidget[]>} A promise that resolves to an array of `CPDFWidget` instances 
     * representing form widgets on the current page. Returns an empty array if retrieval fails.
     * Rejects with an error if the native view reference is unavailable.
     */
    getWidgets = async (): Promise<CPDFWidget[]> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            try {
                const data = await CPDFViewManager.getForms(tag, this.pageIndex);
                return CPDFWidgetFactory.createFromArray(this._viewerRef, data);
            } catch (e) {
                console.error('Failed to retrieve form widgets:', e);
                return [];
            }
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }

    /**
     * Removes an annotation from the current page.
     * @param annotation The annotation to be removed.
     * @example
     * const pageIndex = 0;
     * const page = pdfReaderRef?.current?._pdfDocument.pageAtIndex(pageIndex);
     * const annotations = await page?.getAnnotations();
     * const annotationToRemove = annotations[0];
     * await page?.removeAnnotation(annotationToRemove);
     */
    removeAnnotation(annotation: CPDFAnnotation): Promise<boolean> {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.removeAnnotation(tag, annotation.page, annotation.uuid);
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }

    /**
     * Removes a form widget from the current page.
     * @example
     * const pageIndex = 0;
     * const page = pdfReaderRef?.current?._pdfDocument.pageAtIndex(pageIndex);
     * const widgets = await page?.getWidgets();
     * const widgetToRemove = widgets[0];
     * await page?.removeWidget(widgetToRemove);
     * @see CPDFWidget - Base class for all form widgets
     * @param widget The widget to be removed.
     * @returns 
     */
    removeWidget(widget: CPDFWidget): Promise<boolean> {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.removeWidget(tag, widget.page, widget.uuid);
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }

    /**
     * Gets the rotation angle of the current page.
     * @example
     * const pageIndex = 0;
     * const page = pdfReaderRef?.current?._pdfDocument.pageAtIndex(pageIndex);
     * const rotation = await page?.getRotation();
     * @returns 
     */
    getRotation(): Promise<number> {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.getPageRotation(tag, this.pageIndex);
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }

    /**
     * Sets the rotation angle of the current page.
     * @example
     * const pageIndex = 0;
     * const page = pdfReaderRef?.current?._pdfDocument.pageAtIndex(pageIndex);
     * const success = await page?.setRotation(90);
     * @param rotation The rotation angle in degrees (0, 90, 180, 270). 360 is treated as 0.
     * @returns 
     */
    setRotation(rotation: number): Promise<boolean> {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            const validRotations = [0, 90, 180, 270];
            if (rotation == 360) {
                rotation = 0;
            }
            if (!validRotations.includes(rotation)) {
                return Promise.reject(new Error('Invalid rotation value. Valid values are 0, 90, 180, 270.'));
            }
            return CPDFViewManager.setPageRotation(tag, this.pageIndex, rotation);
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }
}


export class CPDFPageSize {
    readonly width: number;
    readonly height: number;
    readonly name: string;
    readonly isCustom: boolean;

    private constructor(name: string, width: number, height: number, isCustom = false) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.isCustom = isCustom;
    }

    static readonly letter = new CPDFPageSize('letter', 612, 792);
    static readonly note = new CPDFPageSize('note', 540, 720);
    static readonly legal = new CPDFPageSize('legal', 612, 1008);
    static readonly a0 = new CPDFPageSize('a0', 2380, 3368);
    static readonly a1 = new CPDFPageSize('a1', 1684, 2380);
    static readonly a2 = new CPDFPageSize('a2', 1190, 1684);
    static readonly a3 = new CPDFPageSize('a3', 842, 1190);
    static readonly a4 = new CPDFPageSize('a4', 595, 842);
    static readonly a5 = new CPDFPageSize('a5', 421, 595);
    static readonly a6 = new CPDFPageSize('a6', 297, 421);
    static readonly a7 = new CPDFPageSize('a7', 210, 297);
    static readonly a8 = new CPDFPageSize('a8', 148, 210);
    static readonly a9 = new CPDFPageSize('a9', 105, 148);
    static readonly a10 = new CPDFPageSize('a10', 74, 105);
    static readonly b0 = new CPDFPageSize('b0', 2836, 4008);
    static readonly b1 = new CPDFPageSize('b1', 2004, 2836);
    static readonly b2 = new CPDFPageSize('b2', 1418, 2004);
    static readonly b3 = new CPDFPageSize('b3', 1002, 1418);
    static readonly b4 = new CPDFPageSize('b4', 709, 1002);
    static readonly b5 = new CPDFPageSize('b5', 501, 709);
    static readonly archE = new CPDFPageSize('archE', 2592, 3456);
    static readonly archD = new CPDFPageSize('archD', 1728, 2592);
    static readonly archC = new CPDFPageSize('archC', 1296, 1728);
    static readonly archB = new CPDFPageSize('archB', 864, 1296);
    static readonly archA = new CPDFPageSize('archA', 648, 864);
    static readonly flsa = new CPDFPageSize('flsa', 612, 936);
    static readonly flse = new CPDFPageSize('flse', 612, 936);
    static readonly halfLetter = new CPDFPageSize('halfLetter', 396, 612);
    static readonly s11x17 = new CPDFPageSize('11x17', 792, 1224);
    static readonly ledger = new CPDFPageSize('ledger', 1224, 792);

    static readonly values: CPDFPageSize[] = [
        CPDFPageSize.letter,
        CPDFPageSize.note,
        CPDFPageSize.legal,
        CPDFPageSize.a0,
        CPDFPageSize.a1,
        CPDFPageSize.a2,
        CPDFPageSize.a3,
        CPDFPageSize.a4,
        CPDFPageSize.a5,
        CPDFPageSize.a6,
        CPDFPageSize.a7,
        CPDFPageSize.a8,
        CPDFPageSize.a9,
        CPDFPageSize.a10,
        CPDFPageSize.b0,
        CPDFPageSize.b1,
        CPDFPageSize.b2,
        CPDFPageSize.b3,
        CPDFPageSize.b4,
        CPDFPageSize.b5,
        CPDFPageSize.archE,
        CPDFPageSize.archD,
        CPDFPageSize.archC,
        CPDFPageSize.archB,
        CPDFPageSize.archA,
        CPDFPageSize.flsa,
        CPDFPageSize.flse,
        CPDFPageSize.halfLetter,
        CPDFPageSize.s11x17,
        CPDFPageSize.ledger
    ];

    static custom(width: number, height: number): CPDFPageSize {
        if (width <= 0 || height <= 0) {
            throw new Error('Width and height must be positive numbers.');
        }
        return new CPDFPageSize('custom', width, height, true);
    }

    toString(): string {
        return `${this.name} (${this.width} x ${this.height})${this.isCustom ? ' [custom]' : ''}`;
    }
}