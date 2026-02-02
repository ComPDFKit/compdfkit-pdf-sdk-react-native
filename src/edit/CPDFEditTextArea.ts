/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */


import { CPDFAlignment, CPDFEditType } from "../configuration/CPDFOptions";
import { CPDFEditArea } from "./CPDFEditArea";


export class CPDFEditTextArea extends CPDFEditArea {

  readonly text: string;

  readonly alignment: CPDFAlignment;

  readonly fontSize: number;
  
  readonly color: string;
  // 0-255
  readonly alpha: number;

  readonly familyName: string;

  readonly styleName: string;

  constructor(params: {
    uuid: string;
    page: number;
    text?: string;
    alignment?: CPDFAlignment;
    fontSize?: number;
    color?: string; // hex string like "#000000"
    alpha?: number; // 0-255
    familyName?: string;
    styleName?: string;
  }) {
    super({ type: CPDFEditType.TEXT, uuid: params.uuid, page: params.page });

    this.text = params.text ?? '';
    this.alignment = (params.alignment as CPDFAlignment) ?? (('left' as unknown) as CPDFAlignment);
    this.fontSize = params.fontSize ?? 12.0;
    this.color = params.color ?? '#000000';
    this.alpha = params.alpha ?? 255;
    this.familyName = params.familyName ?? 'Helvetica';
    this.styleName = params.styleName ?? 'Regular';
  }

  static fromJson(json: any): CPDFEditTextArea {
    return new CPDFEditTextArea({
      uuid: json?.uuid ?? '',
      page: Number(json?.page ?? 0),
      text: json?.text ?? '',
      alignment: (json?.alignment as CPDFAlignment) ?? (('left' as unknown) as CPDFAlignment),
      fontSize: Number((json?.fontSize ?? 12.0)),
      color: (json?.color as string) ?? '#000000',
      alpha: Number((json?.alpha ?? 255)),
      familyName: json?.familyName ?? 'Helvetica',
      styleName: json?.styleName ?? 'Regular',
    });
  }

  toJson(): Record<string, any> {
    return {
      type: 'text',
      uuid: this.uuid,
      page: this.page,
      text: this.text,
      alignment: this.alignment,
      fontSize: this.fontSize,
      color: this.color,
      alpha: this.alpha,
      familyName: this.familyName,
      styleName: this.styleName,
    };
  }
}