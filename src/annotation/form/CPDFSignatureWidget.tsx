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
 * Class representing a signature form widget, storing basic information about the signature form.
 * It includes general form attributes as well as the signature content.
 * 
 * @class CPDFSignatureWidget
 * @memberof CPDFSignatureWidget
 */
export class CPDFSignatureWidget extends CPDFWidget {


    constructor(viewerRef : any, params: Partial<CPDFSignatureWidget>) {
        super(viewerRef, params);
    }

    /**
     * Adds an image signature to the widget.
     * @param imagePath The path of the image to be added as a signature.
     * @example
     * android support uri format:
     * await widget.addImageSignature('content://media/external/images/media/123');
     * file path:
     * await widget.addImageSignature('/path/to/image');
     * // update the appearance
     * await widget.updateAp();
     * @returns 
     */
    addImageSignature = (imagePath : string) : Promise<boolean> => {
        const tag = findNodeHandle(this._viewerRef);
        if (tag != null) {
            return CPDFViewManager.addWidgetImageSignature(tag, this.page, this.uuid, imagePath);
        }
        return Promise.reject(new Error('Unable to find the native view reference'));
    }
}