/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import {
  BorderWidth,
  ColorAlpha,
  CPDFAlignment,
  CPDFBorderStyle,
  CPDFLineType,
  DashGap,
  FontSize,
  HexColor
} from "@compdfkit_pdf_sdk/react_native";

export interface CPDFBorderStyleAttr {
  style: CPDFBorderStyle;
  dashGap: DashGap;
}

/**
 * Attribute configuration for text (note) annotations.
 *
 * Controls the color and opacity of the note content.
 */
export interface CPDFTextAttr {
  /** Read-only discriminator for runtime type checks. */
  readonly type: 'note';
  /** Text color in HEX format (e.g. `#1460F3`). */
  color?: HexColor;

  /** Text opacity. Valid range: 0–255. */
  alpha?: ColorAlpha;
}

/**
 * Attribute configuration for markup annotations (e.g. highlight).
 *
 * Controls the highlight color and its opacity.
 */
export interface CPDFMarkupAttr {
  /** Markup color in HEX format (e.g. `#1460F3`). */
  color?: HexColor;

  /** Markup opacity. Valid range: 0–255. */
  alpha?: ColorAlpha;
}

export interface CPDFHighlightAttr extends CPDFMarkupAttr {
  /** Read-only discriminator for runtime type checks. */
  readonly type: 'highlight';
}

export interface CPDFUnderlineAttr extends CPDFMarkupAttr {
  /** Read-only discriminator for runtime type checks. */
  readonly type: 'underline';
}

export interface CPDFStrikeoutAttr extends CPDFMarkupAttr {
  /** Read-only discriminator for runtime type checks. */
  readonly type: 'strikeout';
}

export interface CPDFSquigglyAttr extends CPDFMarkupAttr {
  /** Read-only discriminator for runtime type checks. */
  readonly type: 'squiggly';
}

/**
 * Attribute configuration for ink annotations.
 *
 * Defines stroke color, opacity, and brush thickness.
 */
export interface CPDFInkAttr {
  /** Read-only discriminator for runtime type checks. */
  readonly type: 'ink';
  /** Stroke color in HEX format (e.g. `#1460F3`). */
  color?: HexColor;

  /** Stroke opacity. Valid range: 0–255. */
  alpha?: ColorAlpha;

  /** Brush thickness. Valid range: 1–10. */
  borderWidth?: BorderWidth;
}

/**
 * Attribute configuration for square annotations.
 *
 * Controls fill color, border style, and transparency.
 */
export interface CPDFSquareAttr {
  /** Read-only discriminator for runtime type checks. */
  readonly type: 'square';
  /** Fill color in HEX format (e.g. `#1460F3`). */
  fillColor?: HexColor;

  /** Border color in HEX format (e.g. `#1460F3`). */
  borderColor?: HexColor;

  /** Opacity applied to both fill and border colors. Valid range: 0–255. */
  colorAlpha?: ColorAlpha;

  /** Border thickness. Valid range: 1–10. */
  borderWidth?: BorderWidth;

  /** Border style configuration (solid or dashed). */
  borderStyle?: CPDFBorderStyleAttr;
}

/**
 * Attribute configuration for circle annotations.
 *
 * Controls fill color, border style, and transparency.
 */
export interface CPDFCircleAttr {
  /** Read-only discriminator for runtime type checks. */
  readonly type: 'circle';
  /** Fill color in HEX format (e.g. `#1460F3`). */
  fillColor?: HexColor;

  /** Border color in HEX format (e.g. `#1460F3`). */
  borderColor?: HexColor;

  /** Opacity applied to both fill and border colors. Valid range: 0–255. */
  colorAlpha?: ColorAlpha;

  /** Border thickness. Valid range: 1–10. */
  borderWidth?: BorderWidth;

  /** Border style configuration (solid or dashed). */
  borderStyle?: CPDFBorderStyleAttr;
}

/**
 * Attribute configuration for line and arrow annotations.
 *
 * Controls stroke appearance and arrow styles.
 */
interface CPDFLineBase {
  /** Line color in HEX format (e.g. `#1460F3`). */
  borderColor?: HexColor;

  /** Line opacity. Valid range: 0–255. */
  borderAlpha?: ColorAlpha;

  /** Line thickness. Valid range: 0–10. */
  borderWidth?: BorderWidth;

  /** Line border style configuration (solid or dashed). */
  borderStyle?: CPDFBorderStyleAttr;

  /** Arrow style at the starting point of the line. */
  startLineType?: CPDFLineType;

  /** Arrow style at the ending point of the line. */
  tailLineType?: CPDFLineType;
}

/** Attribute configuration for straight line annotations. */
export interface CPDFLineAttr extends CPDFLineBase {
  /** Read-only discriminator for runtime type checks. */
  readonly type: 'line';
}

/** Attribute configuration for arrow annotations. */
export interface CPDFArrowAttr extends CPDFLineBase {
  /** Read-only discriminator for runtime type checks. */
  readonly type: 'arrow';
}

/**
 * Attribute configuration for free text annotations.
 *
 * Controls text appearance, font, and alignment.
 */
export interface CPDFFreeTextAttr {
  /** Read-only discriminator for runtime type checks. */
  readonly type: 'freetext';
  /** Text color in HEX format (e.g. `#1460F3`). */
  fontColor?: HexColor;

  /** Text opacity. Valid range: 0–255. */
  fontColorAlpha?: ColorAlpha;

  /** Font size. Valid range: 1–100. */
  fontSize?: FontSize;

  /** Text alignment. Default is {@link CPDFAlignment.LEFT}. */
  alignment?: CPDFAlignment;

  /** Font family name. Default is "Helvetica". */
  familyName?: string;

  /** Font style name. Default is "Regular". */
  styleName?: string;
}

export interface CPDFAnnotationAttr {
  /** Note annotation attribute configuration. */
  note?: CPDFTextAttr;

  /** Highlight annotation attribute configuration. */
  highlight?: CPDFHighlightAttr;

  /** Underline annotation attribute configuration. */
  underline?: CPDFUnderlineAttr;

  /** Squiggly annotation attribute configuration. */
  squiggly?: CPDFSquigglyAttr;

  /** Strikeout annotation attribute configuration. */
  strikeout?: CPDFStrikeoutAttr;

  /** Ink annotation attribute configuration. */
  ink?: CPDFInkAttr;

  /** Square annotation attribute configuration. */
  square?: CPDFSquareAttr;

  /** Circle annotation attribute configuration. */
  circle?: CPDFCircleAttr;

  /** Line annotation attribute configuration. */
  line?: CPDFLineAttr;

  /** Arrow annotation attribute configuration. */
  arrow?: CPDFArrowAttr;

  /** Freetext annotation attribute configuration. */
  freeText?: CPDFFreeTextAttr;
}

export type CPDFAnnotationAttrUnion =
  | CPDFTextAttr
  | CPDFHighlightAttr
  | CPDFUnderlineAttr
  | CPDFSquigglyAttr
  | CPDFStrikeoutAttr
  | CPDFInkAttr
  | CPDFSquareAttr
  | CPDFCircleAttr
  | CPDFLineAttr
  | CPDFArrowAttr
  | CPDFFreeTextAttr;
