/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { NativeModules, findNodeHandle } from 'react-native';
import { CPDFEditType } from "../configuration/CPDFOptions";
import { CPDFEditorHistoryManager } from '../history/CPDFEditorHistoryManager';
const { CPDFViewManager } = NativeModules;

export class CPDFEditManager {

    private _viewerRef: any;

    private _historyManager : CPDFEditorHistoryManager;

    constructor(viewerRef: any) {
        this._viewerRef = viewerRef;
        this._historyManager = new CPDFEditorHistoryManager(this._viewerRef);
    }

    /**
     * Gets the history manager associated with this edit manager.
     * @example
     * ```typescript
     * const manager = pdfReaderRef.current._editManager;
     * const historyManager = manager.historyManager;
     * await historyManager.canUndo();
     * ```
     * @returns {CPDFEditorHistoryManager} The history manager instance.
     */
    get historyManager() : CPDFEditorHistoryManager {
        return this._historyManager;
    }

    /**
     * Changes the current editing modes.
     * @example
     * ```typescript
     * const manager = pdfReaderRef.current._editManager;
     * await manager.changeEditType([CPDFEditType.Text, CPDFEditType.Image]);
     * ```
     * @param editTypes An array of `CPDFEditType` values representing the desired editing modes.
     * @returns 
     */
    changeEditType = (editTypes: CPDFEditType[]) : Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag) {
            return CPDFViewManager.changeEditType(tag, editTypes);
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }
}