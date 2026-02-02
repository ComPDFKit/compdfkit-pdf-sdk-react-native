/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import { ColorAlpha, FontSize, HexColor } from '../CPDFOptions';

/**
 * Global watermark configuration.
 * @group Configuration
 */
export class CPDFWatermarkConfig {
  types?: ('text' | 'image')[] = ['text', 'image'];
  saveAsNewFile?: boolean = false;
  outsideBackgroundColor?: string | null = null;
  text?: string = 'Watermark';
  image?: string = '';
  textSize?: FontSize = 40;
  textColor?: HexColor = '#000000';
  scale?: number = 1.0;
  rotation?: number = -45;
  opacity?: ColorAlpha = 255;
  isFront?: boolean = false;
  isTilePage?: boolean = false;
}
