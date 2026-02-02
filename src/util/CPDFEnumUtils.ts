/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type { CPDFAnnotationAttrUnion } from '../configuration/attributes/CPDFAnnotationAttr';
import type { CPDFWidgetAttrUnion } from '../configuration/attributes/CPDFWidgetAttr';

export function safeParseEnumValue<T extends string>(
    value: string | undefined,
    values: readonly T[],
    fallback: T
  ): T {
    return value && values.includes(value as T) ? (value as T) : fallback;
  }

export function normalizeColorToARGB(color: string): string {
  // Check type first before calling string methods
  if (typeof color !== 'string' || !color || color.trim() === '') {
    return color; // Return as-is if invalid
  }
  
  if (!color.startsWith('#')) {
    throw new Error('Color must start with #');
  }

  let hex = color.slice(1);

  // expand short format (#RGB -> #RRGGBB, #RGBA -> #RRGGBBAA)
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('') + 'FF'; // default alpha = FF
  } else if (hex.length === 4) {
    hex = hex.split('').map(c => c + c).join(''); // RGBA -> RRGGBBAA
  } else if (hex.length === 6) {
    hex = hex + 'FF'; // default alpha = FF
  } else if (hex.length !== 8) {
    throw new Error('Invalid color format');
  }

  // extract RRGGBBAA
  const rr = hex.slice(0, 2);
  const gg = hex.slice(2, 4);
  const bb = hex.slice(4, 6);
  const aa = hex.slice(6, 8);

  // return  ARGB format
  return `#${aa}${rr}${gg}${bb}`;
}

/**
 * Normalizes all HexColor properties in annotation attributes to ARGB format.
 * @param attr The annotation attributes to normalize
 * @returns A new object with normalized color values
 */
export function normalizeColorsInAnnotationAttr(attr: CPDFAnnotationAttrUnion): CPDFAnnotationAttrUnion {
  const normalized = { ...attr } as any;

  // Define color fields for each annotation type
  const colorFieldMap: { [key: string]: string[] } = {
    'note': ['color'],
    'highlight': ['color'],
    'underline': ['color'],
    'strikeout': ['color'],
    'squiggly': ['color'],
    'ink': ['color'],
    'square': ['fillColor', 'borderColor'],
    'circle': ['fillColor', 'borderColor'],
    'line': ['borderColor'],
    'arrow': ['borderColor'],
    'freetext': ['fontColor'],
  };

  const annotationType = (attr as any).type;
  const colorFields = colorFieldMap[annotationType] || [];

  // Normalize each color field
  colorFields.forEach((field) => {
    if (normalized[field] && typeof normalized[field] === 'string') {
      const colorValue = normalized[field];
      // Check if it's a hex color format
      if (colorValue.startsWith('#')) {
        normalized[field] = normalizeColorToARGB(colorValue);
      }
    }
  });

  return normalized;
}

/**
 * Normalizes all HexColor properties in widget attributes to ARGB format.
 * @param attr The widget attributes to normalize
 * @returns A new object with normalized color values
 */
export function normalizeColorsInWidgetAttr(attr: CPDFWidgetAttrUnion): CPDFWidgetAttrUnion {
  const normalized = { ...attr } as any;

  // Define color fields for each widget type
  const colorFieldMap: { [key: string]: string[] } = {
    'textField': ['fillColor', 'borderColor', 'fontColor'],
    'checkBox': ['fillColor', 'borderColor', 'checkedColor'],
    'radioButton': ['fillColor', 'borderColor', 'checkedColor'],
    'listBox': ['fillColor', 'borderColor', 'fontColor'],
    'comboBox': ['fillColor', 'borderColor', 'fontColor'],
    'pushButton': ['fillColor', 'borderColor', 'fontColor'],
    'signaturesFields': ['fillColor', 'borderColor'],
  };

  const widgetType = (attr as any).type;
  const colorFields = colorFieldMap[widgetType] || [];

  // Normalize each color field
  colorFields.forEach((field) => {
    if (normalized[field] && typeof normalized[field] === 'string') {
      const colorValue = normalized[field];
      // Check if it's a hex color format
      if (colorValue.startsWith('#')) {
        normalized[field] = normalizeColorToARGB(colorValue);
      }
    }
  });

  return normalized;
}

/**
 * Normalizes all HexColor properties in annotation object (CPDFAnnotation instance) to ARGB format.
 * This function handles actual annotation instances, not annotation attribute configurations.
 * @param annotData The annotation object data (from annotation.toJSON())
 * @returns A new object with normalized color values
 */
export function normalizeColorsInAnnotation(annotData: any): any {
  const normalized = { ...annotData };

  // Helper function to normalize a color field if it exists
  const normalizeField = (field: string) => {
    if (normalized[field] && typeof normalized[field] === 'string' && normalized[field].startsWith('#')) {
      try {
        normalized[field] = normalizeColorToARGB(normalized[field]);
      } catch (e) {
        // Keep original value if normalization fails
        console.warn(`Failed to normalize color field '${field}':`, e);
      }
    }
  };

  // Helper function to normalize nested textAttribute color
  const normalizeTextAttribute = () => {
    if (normalized.textAttribute && typeof normalized.textAttribute === 'object') {
      const textAttr = { ...normalized.textAttribute };
      if (textAttr.color && typeof textAttr.color === 'string' && textAttr.color.startsWith('#')) {
        try {
          textAttr.color = normalizeColorToARGB(textAttr.color);
        } catch (e) {
          console.warn('Failed to normalize textAttribute.color:', e);
        }
      }
      normalized.textAttribute = textAttr;
    }
  };

  // Normalize color fields based on annotation type
  const annotationType = normalized.type;
  
  switch (annotationType) {
    case 'note':
      normalizeField('color');
      break;
    case 'highlight':
    case 'underline':
    case 'strikeout':
    case 'squiggly':
      normalizeField('color');
      break;
    case 'ink':
      normalizeField('color');
      break;
    case 'square':
    case 'circle':
      normalizeField('borderColor');
      normalizeField('fillColor');
      break;
    case 'line':
    case 'arrow':
      normalizeField('borderColor');
      normalizeField('fillColor');
      break;
    case 'freetext':
      normalizeTextAttribute();
      break;
    default:
      // For unknown types, don't normalize
      break;
  }

  return normalized;
}

/**
 * Normalizes all HexColor properties in widget object (CPDFWidget instance) to ARGB format.
 * This function handles actual widget instances, not widget attribute configurations.
 * @param widgetData The widget object data (from widget.toJSON())
 * @returns A new object with normalized color values
 */
export function normalizeColorsInWidget(widgetData: any): any {
  const normalized = { ...widgetData };

  // Helper function to normalize a color field if it exists
  const normalizeField = (field: string) => {
    if (normalized[field] && typeof normalized[field] === 'string' && normalized[field].startsWith('#')) {
      try {
        normalized[field] = normalizeColorToARGB(normalized[field]);
      } catch (e) {
        // Keep original value if normalization fails
        console.warn(`Failed to normalize color field '${field}':`, e);
      }
    }
  };

  // Normalize color fields based on widget type
  const widgetType = normalized.type;
  
  switch (widgetType) {
    case 'textField':
      normalizeField('fontColor');
      normalizeField('fillColor');
      normalizeField('borderColor');
      break;
    case 'checkBox':
    case 'radioButton':
      normalizeField('checkColor');
      normalizeField('fillColor');
      normalizeField('borderColor');
      break;
    case 'pushButton':
      normalizeField('fontColor');
      normalizeField('fillColor');
      normalizeField('borderColor');
      break;
    case 'listBox':
    case 'comboBox':
      normalizeField('fontColor');
      normalizeField('fillColor');
      normalizeField('borderColor');
      break;
    case 'signaturesFields':
      normalizeField('fillColor');
      normalizeField('borderColor');
      break;
    default:
      // For unknown types, try to normalize common color fields
      normalizeField('fontColor');
      normalizeField('fillColor');
      normalizeField('borderColor');
      normalizeField('checkColor');
      break;
  }

  return normalized;
}