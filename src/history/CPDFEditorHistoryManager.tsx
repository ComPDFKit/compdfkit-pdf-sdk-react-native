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
 * Manages the history of editing actions within a PDF document, allowing for undo and redo operations.
 * This class extends the `CPDFHistoryManagerBase` and provides methods to interact with the native PDF view.
 * @example
 * ```typescript
 * const manager = pdfReaderRef.current._editManager;
 * const historyManager = manager.historyManager;
 * ```
 */
export class CPDFEditorHistoryManager extends CPDFHistoryManagerBase {

    private _viewerRef: any;

    private _onHistoryStateChanged?: (pageIndex: number, canUndo: boolean, canRedo: boolean) => void;

    constructor(viewerRef: any) {
        super();
        this._viewerRef = viewerRef;
    }

    handle(event: any) {
        const { pageIndex, canUndo, canRedo } = event.nativeEvent.onContentEditorHistoryChanged;
        if (this._onHistoryStateChanged) {
            this._onHistoryStateChanged(pageIndex, canUndo, canRedo);
        }
    }

    /**
     * Sets a listener that is invoked when the history state changes.
     * @param listener A callback function that is invoked when the history state changes. The function receives three parameters: `pageIndex` (the current page index), `canUndo` (a boolean indicating if an undo operation is possible), and `canRedo` (a boolean indicating if a redo operation is possible).
     */
    setOnHistoryStateChangedListener(listener: (pageIndex: number, canUndo: boolean, canRedo: boolean) => void) {
        this._onHistoryStateChanged = listener;
    }


    /**
     * Checks if an undo operation is possible.
     * 
     * @example
     * ```typescript
     * const manager = pdfReader._editorHistoryManager
     * await manager.canUndo();
     * ```
     * @returns  {Promise<boolean>} A promise that resolves to `true` if an undo operation is possible, otherwise `false`.
     */
    async canUndo() : Promise<boolean> {
        const tag = findNodeHandle(this._viewerRef);
        if (tag) {
            try {
                return await CPDFViewManager.editorCanUndo(tag);
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
     * const manager = pdfReader._editorHistoryManager
     * await manager.canRedo();
     * ```
     * @returns  {Promise<boolean>} A promise that resolves to `true` if a redo operation is possible, otherwise `false`.
     */
    async canRedo() : Promise<boolean>{
        const tag = findNodeHandle(this._viewerRef);
        if (tag) {
            try {
                return await CPDFViewManager.editorCanRedo(tag);
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
     * const manager = pdfReader._editorHistoryManager
     * await manager.redo();
     * ```
     * 
     * @returns {Promise<void>} A promise that resolves when the undo operation is complete.
     */
    async undo() : Promise<void>{
        const tag = findNodeHandle(this._viewerRef);
        if (tag) {
            try {
                return await CPDFViewManager.editorUndo(tag);
            } catch (e) {
                return Promise.reject(new Error('Unable to undo the editor action'));
            }
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }

    /**
     * Performs a redo operation on the editor history.
     * 
     * @example
     * ```typescript
     * const manager = pdfReader._editorHistoryManager
     * await manager.redo();
     * ```
     * 
     * @returns {Promise<void>} A promise that resolves when the redo operation is complete.
     */
    async redo() : Promise<void>{
        const tag = findNodeHandle(this._viewerRef);
        if (tag) {
            try {
                return await CPDFViewManager.editorRedo(tag);
            } catch (e) {
                return Promise.reject(new Error('Unable to redo the editor action'));
            }
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }
}