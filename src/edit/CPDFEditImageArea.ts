/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFEditType } from "../configuration/CPDFOptions";
import { CPDFEditArea } from "./CPDFEditArea";


export class CPDFEditImageArea extends CPDFEditArea {
    
  readonly alpha: number;

  readonly image: string | null;

  constructor(params: {
    uuid: string;
    page: number;
    alpha?: number;
    image?: string | null;
  }) {
    super({ type: CPDFEditType.IMAGE, uuid: params.uuid, page: params.page });

    this.alpha = params.alpha ?? 255;
    this.image = params.image ?? null;
  }

  static fromJson(json: any): CPDFEditImageArea {
    let image: string | null = null;
    if (typeof json?.image === "string") {
      image = json.image;
    } else {
      image = null;
    }

    return new CPDFEditImageArea({
      uuid: json?.uuid ?? '',
      page: Number(json?.page ?? 0),
      alpha: Number((json?.alpha ?? 255)),
      image,
    });
  }

  toJson(): Record<string, any> {
    return {
      type: 'image',
      uuid: this.uuid,
      page: this.page,
      alpha: this.alpha,
      image: this.image,
    };
  }
}