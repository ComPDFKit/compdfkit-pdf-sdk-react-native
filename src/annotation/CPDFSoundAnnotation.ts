/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFAnnotation } from "./CPDFAnnotation";

/**
 * @class CPDFSoundAnnotation
 * @group Annotations
 * @property { string } soundPath - Path to the sound file representing the sound annotation.
 */
export class CPDFSoundAnnotation extends CPDFAnnotation {

    /**
     * Path to the sound file representing the sound annotation.
     * 
     */
    soundPath: string;

    constructor(params: Partial<CPDFSoundAnnotation>) {
        super(params);
        this.type = 'sound';
        this.soundPath = params.soundPath ?? '';
    }

    toJSON() {
        return {
            ...super.toJSON(),
            soundPath: this.soundPath,
        };
    }
}