/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { CPDFAnnotation } from "./CPDFAnnotation";
import { CPDFRectF } from "../util/CPDFRectF";
import { CPDFImageData } from "../util/CPDFImageData";

/**
 * @class CPDFImageAnnotation
 * @group Annotations
 * @property { string } [image] - Legacy Base64 encoded image string representing the image annotation.
 * @property { CPDFImageData } [imageData] - Preferred image source descriptor.
 */
export class CPDFImageAnnotation extends CPDFAnnotation {

    /**
     * Legacy Base64 encoded image string representing the image annotation.
     * 
     * example: "iVBORw0KGgoAAAANSUhEUgAA..."
     */
    image?: string;

    /**
     * Preferred image source descriptor.
     */
    imageData?: CPDFImageData;

    constructor(params: Partial<CPDFImageAnnotation> & { imageData?: unknown }) {
        super(params);
        this.type = 'pictures';
        this.image = typeof params.image === 'string' ? params.image : undefined;
        this.imageData = params.imageData instanceof CPDFImageData
            ? params.imageData
            : params.imageData != null
                ? CPDFImageData.fromJson(params.imageData)
                : undefined;
    }

    static fromBase64(params: {
        page: number;
        rect: CPDFRectF;
        base64: string;
        title?: string;
        content?: string;
        createDate?: Date;
        uuid?: string;
    }): CPDFImageAnnotation {
        return new CPDFImageAnnotation({
            title: params.title,
            content: params.content,
            createDate: params.createDate,
            page: params.page,
            uuid: params.uuid,
            rect: params.rect,
            imageData: CPDFImageData.fromBase64(params.base64),
        });
    }

    static fromDataUri(params: {
        page: number;
        rect: CPDFRectF;
        dataUri: string;
        title?: string;
        content?: string;
        createDate?: Date;
        uuid?: string;
    }): CPDFImageAnnotation {
        return new CPDFImageAnnotation({
            title: params.title,
            content: params.content,
            createDate: params.createDate,
            page: params.page,
            uuid: params.uuid,
            rect: params.rect,
            imageData: CPDFImageData.fromDataUri(params.dataUri),
        });
    }

    static fromPath(params: {
        page: number;
        rect: CPDFRectF;
        filePath: string;
        title?: string;
        content?: string;
        createDate?: Date;
        uuid?: string;
    }): CPDFImageAnnotation {
        return new CPDFImageAnnotation({
            title: params.title,
            content: params.content,
            createDate: params.createDate,
            page: params.page,
            uuid: params.uuid,
            rect: params.rect,
            imageData: CPDFImageData.fromPath(params.filePath),
        });
    }

    static fromAsset(params: {
        page: number;
        rect: CPDFRectF;
        assetPath: string;
        title?: string;
        content?: string;
        createDate?: Date;
        uuid?: string;
    }): CPDFImageAnnotation {
        return new CPDFImageAnnotation({
            title: params.title,
            content: params.content,
            createDate: params.createDate,
            page: params.page,
            uuid: params.uuid,
            rect: params.rect,
            imageData: CPDFImageData.fromAsset(params.assetPath),
        });
    }

    static fromUri(params: {
        page: number;
        rect: CPDFRectF;
        uri: string;
        title?: string;
        content?: string;
        createDate?: Date;
        uuid?: string;
    }): CPDFImageAnnotation {
        return new CPDFImageAnnotation({
            title: params.title,
            content: params.content,
            createDate: params.createDate,
            page: params.page,
            uuid: params.uuid,
            rect: params.rect,
            imageData: CPDFImageData.fromUri(params.uri),
        });
    }

    toJSON() {
        return {
            ...super.toJSON(),
            image: this.image,
            imageData: this.imageData?.toJson(),
            stampType: 'image'
        };
    }

}