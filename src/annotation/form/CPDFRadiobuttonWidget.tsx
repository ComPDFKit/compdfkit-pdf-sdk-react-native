/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFWidget } from "./CPDFWidget";
import { NativeModules, findNodeHandle } from 'react-native';
const { CPDFViewManager } = NativeModules;

/**
 * Class representing a radiobutton form widget, storing basic information about the radiobutton form.
 */
export class CPDFRadiobuttonWidget extends CPDFWidget {

    /**
     * The state of the radiobutton form widget.
     */
    isChecked: boolean;

    constructor(viewerRef : any, params: Partial<CPDFRadiobuttonWidget>) {
        super(viewerRef, params);
        this.isChecked = params.isChecked ?? false;
    }

    /**
     * Set the checked state of a radiobutton form widget.
     * @param isChecked whether the radiobutton is checked or not.
     * @example
     * // Set the checked state of a radiobutton form widget.
     * await widget.setChecked(true);
     * // Update the appearance of the radiobutton form widget.
     * await widget.updateAp();
     * @returns 
     */
    setChecked = async (isChecked: boolean): Promise<void> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            await CPDFViewManager.setWidgetIsChecked(tag, this.page, this.uuid, isChecked);
            this.isChecked = isChecked;
            return;
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }
}

