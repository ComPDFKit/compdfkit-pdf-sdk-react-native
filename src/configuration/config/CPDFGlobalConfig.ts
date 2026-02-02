/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFBotaTabs, CPDFSignatureType, CPDFThemeMode, HexColor } from "@compdfkit_pdf_sdk/react_native";
import { CPDFWatermarkConfig } from "./CPDFWatermarkConfig";

export type CPDFBotaMenuItem<T extends string = string> = {
  id: T;
  subMenus?: string[];
};

/**
 * @class CPDFGlobalConfig
 * @group Configuration
 */
export interface CPDFGlobalConfig {

    themeMode?: CPDFThemeMode;

    /**
     * Whether to save extra font subsets when saving the PDF file.
     * Default: true
     */
    fileSaveExtraFontSubset?: boolean;

    /**
     * Whether to use incremental saving when saving the PDF file.
     * Default: true
     */
    useSaveIncremental?: boolean;

    watermark?: CPDFWatermarkConfig;

    /**
     * set the signature type for the signature picker dialog when clicking on a signature form field
     * Default Value: {@link CPDFSignatureType.MANUAL}
     */
    signatureType?: CPDFSignatureType;

    /**
     * Whether to enable exit save tips when closing the PDF document.
     * Default: true
     */
    enableExitSaveTips?: boolean;

    enableErrorTips?: boolean;

    thumbnail?: {
      title?: string;
      backgroundColor?: string | null;
      editMode?: boolean;
    };

    bota?: {
      tabs?: CPDFBotaTabs[];
      menus?: {
        annotations?: {
          global?: CPDFBotaMenuItem<'importAnnotation' | 'exportAnnotation' | 'removeAllAnnotation' | 'removeAllReply'>[];
          item?: CPDFBotaMenuItem<'reviewStatus' | 'markedStatus' | 'more'>[];
        }
      }
    },

    search?: {
      normalKeyword?: {
        borderColor?: HexColor;
        fillColor?: HexColor;
      };
      focusKeyword?: {
        borderColor?: HexColor;
        fillColor?: HexColor;
      };
    },

    pageEditor?: {
      menus?: ('insertPage' | 'replacePage' | 'extractPage' | 'copyPage' | 'rotatePage' | 'deletePage')[];
    },

    /**
     * set ios platform pencil tool menus in annotation mode
     * default value: ['touch', 'discard', 'save']
     */
    pencilMenus?: ('touch' | 'discard' | 'save')[];

  };