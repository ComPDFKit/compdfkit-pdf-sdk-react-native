/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { findNodeHandle, NativeModules } from "react-native";
import { CPDFTextRange } from "./CPDFTextRange";
import { CPDFSearchOptions } from "./CPDFSearchOptions";
const { CPDFViewManager } = NativeModules;

export class CPDFTextSearcher {

    private _viewerRef: any;

    constructor(viewerRef: any) {
        this._viewerRef = viewerRef;
    }

    /**
     * Searches for the specified text in the current PDF document.
     * 
     * This method performs a text search in the currently loaded PDF document
     * and returns an array of results. Each result is represented by a `CPDFTextRange` 
     * object containing the page index, location, length, and internal range index.
     * 
     * @param {string} searchText - The text string to search for in the document.
     * @param {CPDFSearchOptions} options - Optional search parameters such as 
     * case sensitivity, whole word match, etc.
     * 
     * @example
     * const textSearcher = pdfReaderRef.current?._pdfDocument.textSearcher();
     * const results = await textSearcher.searchText("example", new CPDFSearchOptions());
     * 
     * if (results.length > 0) {
     *   const resultText = await textSearcher.getText(results[0]);
     * }
     * 
     * @returns {Promise<CPDFTextRange[]>} A promise that resolves to an array of 
     * `CPDFTextRange` objects representing the matched text results.
     */
    searchText = async (searchText: string, options : CPDFSearchOptions) : Promise<CPDFTextRange[]> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag) {
            try {
                const jsonArray = await CPDFViewManager.searchText(tag, searchText, options);
                return jsonArray.map((item: { pageIndex: number, location: number, length: number, textRangeIndex: number }) => (
                    new CPDFTextRange(item.pageIndex, item.location, item.length, item.textRangeIndex)
                ));
            } catch (e) {
                console.error("ComPDFKitRN", "searchText error:", e);
                
            }
        }
        return Promise.resolve([]);
    }

    /**
     * Selects a specific search result and highlights it in the PDF viewer.
     * 
     * This method is typically used when a user taps on a search result or navigates 
     * through search results using next/previous controls.
     * 
     * @param {CPDFTextRange} range - The text range to select and highlight.
     * 
     * @example
     * const results = await textSearcher.searchText("example", options);
     * if (results.length > 0) {
     *   await textSearcher.selection(results[0]);
     * }
     * 
     * @returns {Promise<void>} A promise that resolves once the selection is applied.
     */
    selection = (range : CPDFTextRange): Promise<void> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            try {
                console.log('ComPDFKitRN', 'Setting selection:', range);
                return CPDFViewManager.selection(tag, range.toJson());
            } catch (e) {
                // Handle error if necessary
                return Promise.resolve();
            }
        }
        return Promise.resolve();
    }


    /**
     * Clears all search results and removes any highlights from the PDF viewer.
     * 
     * This is typically called when closing the search UI or performing a new search.
     * 
     * @example
     * await textSearcher.clearSearch();
     * 
     * @returns {Promise<void>} A promise that resolves when the search state is cleared.
     */
    clearSearch = (): Promise<void> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            try {
                return CPDFViewManager.clearSearch(tag);
            } catch (e) {
                // Handle error if necessary
                return Promise.resolve();
            }
        }
        return Promise.resolve();
    }

    /**
     * Retrieves the text content from a specific text range.
     * 
     * Can be used to extract the original matched text or additional surrounding content
     * by using the `expanded()` method on a `CPDFTextRange`.
     * 
     * @param {CPDFTextRange} range - The text range from which to extract text.
     * 
     * @example
     * const results = await textSearcher.searchText("example", options);
     * const originalText = await textSearcher.getText(results[0]);
     * const expandedText = await textSearcher.getText(results[0].expanded(10, 10));
     * 
     * @returns {Promise<string>} A promise that resolves with the extracted text content.
     */
    getText = (range : CPDFTextRange): Promise<string> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            try {
                return CPDFViewManager.getSearchText(tag, range.pageIndex, range.location, range.length);
            } catch (e) {
                return Promise.resolve('');
            }
        }
        return Promise.resolve('');
    }


}