/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { NativeModules, findNodeHandle } from 'react-native';
import { CPDFHistoryManagerBase } from './CPDFHistoryManagerBase';
const { CPDFViewManager } = NativeModules;

/**
 * Manages the undo and redo history for PDF annotation actions within a viewer component.
 * 
 * This class extends `CPDFHistoryManagerBase` and provides methods to interact with the annotation history,
 * including checking if undo/redo actions are available and performing those actions. It also allows
 * registering a listener to monitor changes in the annotation history state.
 * 
 * **Usage:**
 * - Instantiate with a reference to the PDF viewer component.
 * - Use `canUndo()` and `canRedo()` to check if undo/redo actions are available.
 * - Call `undo()` and `redo()` to perform undo/redo operations.
 * - Register a listener with `setOnHistoryStateChangedListener()` to be notified when the history state changes.
 * 
 * 
 * @example
 * ```typescript
 * const historyManager = pdfReader._annotationsHistoryManager;
 * historyManager.setOnHistoryStateChangedListener((canUndo, canRedo) => {
 *   // Update UI based on undo/redo availability
 * });
 * ```
 */
export class CPDFAnnotationHistoryManager extends CPDFHistoryManagerBase {

    private _viewerRef: any;
    private _onHistoryStateChanged?: (canUndo: boolean, canRedo: boolean) => void;

    constructor(viewerRef: any) {
        super();
        this._viewerRef = viewerRef;
    }

    handle(event: any) {
        const { canUndo, canRedo } = event.nativeEvent.onAnnotationHistoryChanged;
        if (this._onHistoryStateChanged) {
            this._onHistoryStateChanged(canUndo, canRedo);
        }
    }

    /**
     * Sets a listener to monitor changes in annotation history state.
     * This should be called during annotation operations to indicate whether undo or redo actions are available.
     * @param listener A callback function with two parameters: 
     *                 canUndo (whether undo is available) and canRedo (whether redo is available).
     * @example
     * ```typescript
     * const historyManager = pdfReader._annotationsHistoryManager;
     * historyManager.setOnHistoryStateChangedListener((canUndo, canRedo) => {
     *   // Update UI based on undo/redo availability
     * });
     * ```
     */
    setOnHistoryStateChangedListener(listener: (canUndo: boolean, canRedo: boolean) => void) {
        this._onHistoryStateChanged = listener;
    }


    /**
     * Checks if an undo operation is possible.
     * 
     * @example
     * ```typescript
     * const manager = pdfReader._annotationsHistoryManager
     * await manager.canUndo();
     * ```
     * @returns  {Promise<boolean>} A promise that resolves to `true` if an undo operation is possible, otherwise `false`.
     */
    async canUndo() : Promise<boolean> {
        const tag = findNodeHandle(this._viewerRef);
        if (tag) {
            try {
                return await CPDFViewManager.annotationCanUndo(tag);
            } catch (e) {
                return false;
            }
        }
        return false;
    }

    /**
     * Checks if an undo operation is possible.
     * 
     * @example
     * ```typescript
     * const manager = pdfReader._annotationsHistoryManager
     * await manager.canRedo();
     * ```
     * @returns  {Promise<boolean>} A promise that resolves to `true` if a redo operation is possible, otherwise `false`.
     */
    async canRedo() : Promise<boolean>{
        const tag = findNodeHandle(this._viewerRef);
        if (tag) {
            try {
                return await CPDFViewManager.annotationCanRedo(tag);
            } catch (e) {
                return false;
            }
        }
        return false;
    }

    /**
     * Checks if a redo operation is possible.
     * 
     * @example
     * ```typescript
     * const manager = pdfReader._annotationsHistoryManager
     * await manager.redo();
     * ```
     * 
     * @returns {Promise<void>} A promise that resolves when the undo operation is complete.
     */
    async undo() : Promise<void>{
        const tag = findNodeHandle(this._viewerRef);
        if (tag) {
            try {
                return await CPDFViewManager.annotationUndo(tag);
            } catch (e) {
                return Promise.reject(new Error('Unable to undo the annotation action'));
            }
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }

    /**
     * Performs a redo operation on the annotation history.
     * 
     * @example
     * ```typescript
     * const manager = pdfReader._annotationsHistoryManager
     * await manager.redo();
     * ```
     * 
     * @returns {Promise<void>} A promise that resolves when the redo operation is complete.
     */
    async redo() : Promise<void>{
        const tag = findNodeHandle(this._viewerRef);
        if (tag) {
            try {
                return await CPDFViewManager.annotationRedo(tag);
            } catch (e) {
                return Promise.reject(new Error('Unable to redo the annotation action'));
            }
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }
}