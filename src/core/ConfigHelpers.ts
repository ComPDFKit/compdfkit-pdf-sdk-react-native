/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type { CPDFContextMenuItem } from "../configuration/config/CPDFContextMenuConfig";
import type { CPDFBotaMenuItem } from "../configuration/config/CPDFGlobalConfig";
import { normalizeColorToARGB } from "../util/CPDFEnumUtils";

const HEX_COLOR_REGEX =
  /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

/**
 * Deep merge utility for configuration objects.
 * Handles arrays, objects, and color normalization.
 */
export function mergeDeep(defaults: any, overrides: any): any {
  const merged: any = {};

  const keys = new Set([
    ...Object.keys(defaults || {}),
    ...Object.keys(overrides || {}),
  ]);

  for (const key of keys) {
    const defaultValue = defaults?.[key];
    const overrideValue = overrides?.[key];

    let value: any;

    if (overrideValue !== undefined) {
      if (Array.isArray(overrideValue)) {
        value = [...overrideValue];
      } else if (overrideValue && typeof overrideValue === "object") {
        value = mergeDeep(defaultValue || {}, overrideValue);
      } else {
        value = overrideValue;
      }
    } else {
      if (Array.isArray(defaultValue)) {
        value = [...defaultValue];
      } else if (defaultValue && typeof defaultValue === "object") {
        value = mergeDeep(defaultValue, {});
      } else {
        value = defaultValue;
      }
    }

    if (typeof value === "string" && HEX_COLOR_REGEX.test(value)) {
      try {
        value = normalizeColorToARGB(value);
      } catch {}
    }
    merged[key] = value;
  }

  return merged;
}

export type CPDFContextMenuItemInput<T extends string = string> = Omit<
  CPDFContextMenuItem<T>,
  "showType"
> & { showType?: CPDFContextMenuItem<T>["showType"] };

/**
 * Helper function to create context menu items with default showType.
 */
export const menus = <
  T extends string,
  A extends readonly (T | CPDFContextMenuItemInput<T>)[]
>(
  ...items: A
): CPDFContextMenuItem<T>[] =>
  items.map((item) => {
    if (typeof item === "string") {
      // Provide default showType for simple string menu items
      return { key: item as T, showType: "text" };
    }
    // Ensure object items have a showType; preserve provided value if exists
    return (item as CPDFContextMenuItemInput<T>).showType
      ? (item as CPDFContextMenuItem<T>)
      : ({ ...item, showType: "text" } as CPDFContextMenuItem<T>);
  });

/**
 * Helper function to create BOTA menu items.
 */
export const botaMenus = <
  T extends string,
  A extends readonly (T | CPDFBotaMenuItem<T>)[]
>(
  ...items: A
): CPDFBotaMenuItem<T>[] =>
  items.map((item) => (typeof item === "string" ? { id: item } : item));
