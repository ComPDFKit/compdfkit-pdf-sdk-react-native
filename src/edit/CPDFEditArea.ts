/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFEditType } from "../configuration/CPDFOptions";


export class CPDFEditArea {

  readonly type: CPDFEditType;

  readonly uuid: string;

  readonly page: number;

  constructor(params: { type: CPDFEditType; uuid: string; page: number }) {
    this.type = params.type;
    this.uuid = params.uuid;
    this.page = params.page;
  }

  static create(json: any): CPDFEditArea {
    const type = this.stringToCPDFEditType(json?.type ?? "none");
    if (type === CPDFEditType.TEXT) {
      const CPDFEditTextArea = require("./CPDFEditTextArea").CPDFEditTextArea;
      return CPDFEditTextArea.fromJson(json);
    } else if (type === CPDFEditType.IMAGE) {
      const CPDFEditImageArea = require("./CPDFEditImageArea").CPDFEditImageArea;
      return CPDFEditImageArea.fromJson(json);
    } else {
      return this.fromJson(json);
    }
  }


  static fromJson(json: any): CPDFEditArea {

    const type = this.stringToCPDFEditType(json?.type ?? "none");

    return new CPDFEditArea({
      type,
      uuid: json?.uuid ?? "",
      page: Number(json?.page ?? 0),
    });
  }

  toJson(): Record<string, any> {
    return {
      type: CPDFEditArea.editTypeToString(this.type),
      uuid: this.uuid,
      page: this.page,
    };
  }

  public static stringToCPDFEditType(typeString: string): CPDFEditType {
    switch (typeString) {
      case "none":
        return CPDFEditType.NONE;
      case "text":
        return CPDFEditType.TEXT;
      case "image":
        return CPDFEditType.IMAGE;
      case "path":
        return CPDFEditType.PATH;
      default:
        return CPDFEditType.NONE;
    }
  }

  public static editTypeToString(editType: CPDFEditType): string {
    switch (editType) {
      case CPDFEditType.NONE:
        return "none";
      case CPDFEditType.TEXT:
        return "text";
      case CPDFEditType.IMAGE:
        return "image";
      case CPDFEditType.PATH:
        return "path";
      default:
        return "none";
    }
  }
}
