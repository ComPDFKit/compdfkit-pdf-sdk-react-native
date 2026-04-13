/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

/**
 * Enumeration of supported image data types for inserting into PDF
 */
export enum CPDFImageType {
  /** Local file path */
  FilePath = 'filePath',
  /** Base64 encoded string */
  Base64 = 'base64',
  /** Asset path */
  Asset = 'asset',
  /** Android content Uri */
  Uri = 'uri',
}

/**
 * Represents different types of image data for inserting into PDF.
 * 
 * This class provides factory methods to create image data from various sources
 * such as file paths, base64 strings, assets, or Android content URIs.
 */
export class CPDFImageData {
  readonly type: CPDFImageType;
  readonly data: string;

  private constructor(type: CPDFImageType, data: string) {
    this.type = type;
    this.data = data;
  }

  /**
   * Create image data from a file path.
   * 
   * @example
   * - Android:
   * const imageData = CPDFImageData.fromPath('/data/user/0/com.example.app/cache/image.png');
   * // file://
   * const imageData = CPDFImageData.fromPath('file:///data/user/0/com.example.app/cache/image.png');
   * 
   * @param filePath The absolute file path to the image
   * @returns CPDFImageData instance
   */
  static fromPath(filePath: string): CPDFImageData {
    return new CPDFImageData(CPDFImageType.FilePath, filePath);
  }

  /**
   * Create image data from a base64 encoded string.
   * 
   * @example
   * const imageData = CPDFImageData.fromBase64('iVBORw0KGgoAAAANSUhEUgAAAAUA...');
   * 
   * @param base64String The base64 encoded image string
   * @returns CPDFImageData instance
   */
  static fromBase64(base64String: string): CPDFImageData {
    return new CPDFImageData(CPDFImageType.Base64, base64String);
  }

  /**
   * Create image data from a data URI string.
   *
   * @example
   * const imageData = CPDFImageData.fromDataUri('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...');
   *
   * @param dataUri The data URI string
   * @returns CPDFImageData instance
   */
  static fromDataUri(dataUri: string): CPDFImageData {
    return new CPDFImageData(CPDFImageType.Base64, dataUri);
  }

  /**
   * Create image data from an asset path.
   * 
   * @example
   * const imageData = CPDFImageData.fromAsset('logo.png');
   * 
   * @param assetPath The asset path to the image (relative path in assets directory)
   * @returns CPDFImageData instance
   */
  static fromAsset(assetPath: string): CPDFImageData {
    return new CPDFImageData(CPDFImageType.Asset, assetPath);
  }

  /**
   * Create image data from an Android content Uri.
   * This method is only applicable on Android platform.
   * 
   * @example
   * const imageData = CPDFImageData.fromUri('content://media/external/images/media/1000');
   * 
   * @param uri The Android content Uri to the image
   * @returns CPDFImageData instance
   */
  static fromUri(uri: string): CPDFImageData {
    return new CPDFImageData(CPDFImageType.Uri, uri);
  }

  /**
   * Create image data from serialized JSON.
   *
   * @param json Serialized image data object
   * @returns CPDFImageData instance
   */
  static fromJson(json: unknown): CPDFImageData {
    const object = json as { type?: string; data?: unknown } | null | undefined;
    const typeValue = object?.type;
    const type = Object.values(CPDFImageType).includes(typeValue as CPDFImageType)
      ? (typeValue as CPDFImageType)
      : CPDFImageType.Base64;

    return new CPDFImageData(type, object?.data?.toString() ?? '');
  }

  /**
   * Convert the image data to a JSON object for native communication.
   * 
   * @returns JSON object containing type and data
   */
  toJson(): Record<string, any> {
    return {
      type: this.type,
      data: this.data,
    };
  }
}
