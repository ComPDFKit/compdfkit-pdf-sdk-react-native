import { safeParseEnumValue } from "../util/CPDFEnumUtils";
/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */


export class CPDFTextStamp {

  readonly content: string;

  readonly date: string;

  readonly shape: CPDFTextStampShape;
  
  readonly color: CPDFTextStampColor;

  constructor(params: {
    content: string;
    date: string;
    shape?: CPDFTextStampShape;
    color?: CPDFTextStampColor;
  }) {
    this.content = params.content;
    this.date = params.date;
    this.shape = params.shape ?? CPDFTextStampShape.rect;
    this.color = params.color ?? CPDFTextStampColor.white;
  }

  static fromJson(json: any): CPDFTextStamp {
    return new CPDFTextStamp({
      content: json?.content ?? '',
      date: json?.date ?? '',
      shape: safeParseEnumValue(json?.shape, Object.values(CPDFTextStampShape), CPDFTextStampShape.rect),
      color: safeParseEnumValue(json?.color, Object.values(CPDFTextStampColor), CPDFTextStampColor.white),
    });
  }

}

export enum CPDFTextStampShape {
  rect = 'rect',
  leftTriangle = 'leftTriangle',
  rightTriangle = 'rightTriangle',
  none = 'none',
}

export enum CPDFTextStampColor {
  white = 'white',
  red = 'red',
  green = 'green',
  blue = 'blue',
}