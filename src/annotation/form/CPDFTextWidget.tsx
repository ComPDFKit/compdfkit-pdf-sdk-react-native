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
 * Class representing a text field form widget, storing basic information about the text field form.
 * It includes general form attributes as well as the text content of the text field.
 *
 * @class CPDFTextWidget
 * @memberof CPDFTextWidget
 * @property {string} [text] - The text content of the text field.
 */
export class CPDFTextWidget extends CPDFWidget {

    /**
     * The text content of the text field.
     */
    text: string;

    constructor(viewerRef: any, params: Partial<CPDFTextWidget>) {
        super(viewerRef, params);
        this.text = params.text ?? '';
    }

    /**
     * Set the text content of this text field form widget.
     * @param text The text content to set.
     * @example
     * await textWidget.setText('Hello World');
     * // Update the appearance of this text field form widget.
     * await textWidget.updateAp();
     * @returns 
     */
    setText = async (text: string): Promise<void> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag) {
            try {
                await CPDFViewManager.setTextWidgetText(tag, this.page, this.uuid, text);
                this.text = text;
                return;
            } catch (e) {
                return Promise.reject(e);
            }
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }

}
