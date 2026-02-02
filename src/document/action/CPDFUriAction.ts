/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFAction } from "./CPDFAction"


export class CPDFUriAction extends CPDFAction {

    uri : string;

    /**
     * Create an email type URI Action
     * @param email Email address
     * @returns CPDFUriAction instance
     */
    static createEmail(email: string): CPDFUriAction {
        return new CPDFUriAction({ actionType: 'uri',uri: `mailto:${email}` });
    }

    /**
     * Create a web type URI Action
     * @param url Website address (e.g. https://...)
     * @returns CPDFUriAction instance
     */
    static createWeb(url: string): CPDFUriAction {
        // Use http/https protocol directly
        return new CPDFUriAction({ actionType: 'uri', uri: url });
    }


    constructor(params: Partial<CPDFUriAction>) {
        super(params);
        this.uri = params.uri ?? '';
    }

    static fromJson(json: any): CPDFUriAction {
        return new this(json);
    }

    toJSON() {
        return {
            ...super.toJSON(),
            uri: this.uri
        };
    }
}