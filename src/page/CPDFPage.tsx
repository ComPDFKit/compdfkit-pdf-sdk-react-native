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

    pageIndex : number

    private _viewerRef: any;

    constructor(viewerRef: any, pageIndex : number) {
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
    getAnnotations = async () : Promise<CPDFAnnotation[]> =>{
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            try {
                const data = await CPDFViewManager.getAnnotations(tag, this.pageIndex);
                return CPDFAnnotationFactory.createFromArray(this._viewerRef, data);
            }catch(e){
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
    getWidgets = async () : Promise<CPDFWidget[]> =>{
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            try{
                const data = await CPDFViewManager.getForms(tag, this.pageIndex);
                return CPDFWidgetFactory.createFromArray(this._viewerRef, data);
            }catch(e){
                console.error('Failed to retrieve form widgets:', e);
                return [];
            }
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }
}