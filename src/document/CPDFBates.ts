import type { HexColor } from '../configuration/CPDFOptions';
import type { CPDFHeaderFooterPosition } from './CPDFHeaderFooter';

export type CPDFBatesRule = 'v1' | 'v2';
export type CPDFBatesSlot = {
  position: CPDFHeaderFooterPosition;
  text: string;
  fontName?: string;
  fontSize?: number;
  textColor?: HexColor;
};
export type CPDFBates = {
  pages: number[];
  margin: { left: number; top: number; right: number; bottom: number };
  pageOffset?: number;
  rule?: CPDFBatesRule;
  slots: CPDFBatesSlot[];
};
export type NativeBatesPayload = { pages?: unknown; margin?: unknown; page_offset?: unknown; rule?: unknown; slots?: unknown };

const positions: CPDFHeaderFooterPosition[] = ['header_left', 'header_center', 'header_right', 'footer_left', 'footer_center', 'footer_right'];
const num = (value: unknown, fallback = 0) => typeof value === 'number' && Number.isFinite(value) ? value : fallback;
const pagesFromNative = (value: unknown) => {
  if (typeof value !== 'string') return [];
  const result: number[] = [];
  for (const part of value.split(',')) {
    const range = part.trim().split('-');
    if (range.length === 2) {
      const start = Number(range[0]); const end = Number(range[1]);
      if (Number.isInteger(start) && Number.isInteger(end) && start >= 0 && end >= start) {
        for (let page = start; page <= end; page += 1) result.push(page);
      }
    } else {
      const page = Number(range[0]);
      if (Number.isInteger(page) && page >= 0) result.push(page);
    }
  }
  return result;
};

export function fromNativeBates(payload: NativeBatesPayload): CPDFBates {
  const margin = payload.margin && typeof payload.margin === 'object' ? payload.margin as Record<string, unknown> : {};
  const slots = Array.isArray(payload.slots) ? payload.slots.map(raw => {
    const slot = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
    const position = positions.includes(slot.position as CPDFHeaderFooterPosition) ? slot.position as CPDFHeaderFooterPosition : 'header_left';
    const size = num(slot.font_size ?? slot.fontSize, 12);
    return { position, text: typeof slot.text === 'string' ? slot.text : '', fontName: typeof (slot.font_name ?? slot.fontName) === 'string' ? (slot.font_name ?? slot.fontName) as string : 'Helvetica', fontSize: size > 0 ? size : 12, textColor: (typeof (slot.text_color ?? slot.textColor) === 'string' ? slot.text_color ?? slot.textColor : '#FF000000') as HexColor };
  }) : [];
  return { pages: pagesFromNative(payload.pages), margin: { left: num((margin as any).left), top: num((margin as any).top), right: num((margin as any).right), bottom: num((margin as any).bottom) }, pageOffset: Number.isInteger(payload.page_offset) ? payload.page_offset as number : 0, rule: payload.rule === 1 ? 'v1' : 'v2', slots };
}

export function toNativeBates(value: CPDFBates): NativeBatesPayload {
  if (!value.pages.length || value.pages.some(page => !Number.isInteger(page) || page < 0)) throw new Error('Bates pages must contain zero-based page indexes.');
  if (!value.slots.length) throw new Error('Bates slots cannot be empty.');
  const seen = new Set<string>();
  const slots = value.slots.map(slot => {
    if (!positions.includes(slot.position) || seen.has(slot.position)) throw new Error('Bates slot positions must be unique and valid.');
    if (slot.fontSize != null && (!Number.isFinite(slot.fontSize) || slot.fontSize <= 0)) throw new Error('Bates fontSize must be greater than zero.');
    seen.add(slot.position);
    return { position: slot.position, text: slot.text ?? '', font_name: slot.fontName ?? 'Helvetica', font_size: slot.fontSize ?? 12, text_color: slot.textColor ?? '#FF000000' };
  });
  return { pages: value.pages.join(','), margin: value.margin, page_offset: Number.isInteger(value.pageOffset) ? value.pageOffset : 0, rule: value.rule === 'v1' ? 1 : 2, slots };
}
