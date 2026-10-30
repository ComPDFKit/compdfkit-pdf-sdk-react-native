/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type { HexColor } from '../configuration/CPDFOptions';

export type CPDFHeaderFooterPosition =
  | 'header_left'
  | 'header_center'
  | 'header_right'
  | 'footer_left'
  | 'footer_center'
  | 'footer_right';

export type CPDFHeaderFooterSlot = {
  position: CPDFHeaderFooterPosition;
  text: string;
  fontName?: string;
  fontSize?: number;
  textColor?: HexColor;
};

export type CPDFHeaderFooter = {
  pages: number[];
  margin: { left: number; top: number; right: number; bottom: number };
  slots: CPDFHeaderFooterSlot[];
};

/** @internal */
export type NativeHeaderFooterPayload = {
  pages?: unknown;
  margin?: unknown;
  slots?: unknown;
};

const positions: CPDFHeaderFooterPosition[] = [
  'header_left',
  'header_center',
  'header_right',
  'footer_left',
  'footer_center',
  'footer_right',
];

function numberValue(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function stringValue(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function parsePages(value: unknown): number[] {
  if (typeof value !== 'string') {
    return [];
  }
  const pages: number[] = [];
  for (const part of value.split(',')) {
    const trimmed = part.trim();
    const range = trimmed.split('-');
    if (range.length === 2) {
      const start = Number(range[0]);
      const end = Number(range[1]);
      if (Number.isInteger(start) && Number.isInteger(end) && start >= 0 && end >= start) {
        for (let page = start; page <= end; page += 1) pages.push(page);
      }
    } else {
      const page = Number(trimmed);
      if (Number.isInteger(page) && page >= 0) pages.push(page);
    }
  }
  return pages;
}

function normalizeSlot(value: unknown): CPDFHeaderFooterSlot {
  const slot = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const position = stringValue(slot.position, 'header_left');
  return {
    position: positions.includes(position as CPDFHeaderFooterPosition)
      ? position as CPDFHeaderFooterPosition
      : 'header_left',
    text: stringValue(slot.text, ''),
    fontName: stringValue(slot.font_name ?? slot.fontName, 'Helvetica'),
    fontSize: positiveNumberValue(slot.font_size ?? slot.fontSize, 12),
    textColor: stringValue(slot.text_color ?? slot.textColor, '#FF000000') as HexColor,
  };
}

function positiveNumberValue(value: unknown, fallback: number): number {
  const number = numberValue(value, fallback);
  return number > 0 ? number : fallback;
}

export function fromNativeHeaderFooter(payload: NativeHeaderFooterPayload): CPDFHeaderFooter {
  const margin = payload.margin && typeof payload.margin === 'object'
    ? payload.margin as Record<string, unknown>
    : {};
  return {
    pages: parsePages(payload.pages),
    margin: {
      left: numberValue(margin.left, 0),
      top: numberValue(margin.top, 0),
      right: numberValue(margin.right, 0),
      bottom: numberValue(margin.bottom, 0),
    },
    slots: Array.isArray(payload.slots) ? payload.slots.map(normalizeSlot) : [],
  };
}

export function toNativeHeaderFooter(value: CPDFHeaderFooter): NativeHeaderFooterPayload {
  if (!value.pages.length || value.pages.some(page => !Number.isInteger(page) || page < 0)) {
    throw new Error('Header/footer pages must contain zero-based page indexes.');
  }
  if (!value.slots.length) {
    throw new Error('Header/footer slots cannot be empty.');
  }
  const usedPositions = new Set<CPDFHeaderFooterPosition>();
  const slots = value.slots.map(slot => {
    if (!positions.includes(slot.position) || usedPositions.has(slot.position)) {
      throw new Error('Header/footer slot positions must be unique and valid.');
    }
    if (slot.fontSize != null && (!Number.isFinite(slot.fontSize) || slot.fontSize <= 0)) {
      throw new Error('Header/footer fontSize must be greater than zero.');
    }
    usedPositions.add(slot.position);
    return {
      position: slot.position,
      text: slot.text ?? '',
      font_name: slot.fontName ?? 'Helvetica',
      font_size: slot.fontSize ?? 12,
      text_color: slot.textColor ?? '#FF000000',
    };
  });
  return {
    pages: value.pages.join(','),
    margin: value.margin,
    slots,
  };
}
