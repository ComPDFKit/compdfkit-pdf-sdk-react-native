/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */


export class CPDFWidgetUtil {
  /**
   * Creates a unique field name for a PDF form widget with timestamp
   * 
   * This method generates a field name by combining the widget type name with 
   * the current date and time.
   * 
   * @param widgetType - The type of the widget
   * @returns A unique field name in the format: `WidgetType_YYYYMMdd HH:mm:ss.SSS`
   * 
   * @example
   * const fieldName = CPDFWidgetUtil.createFieldName(CPDFWidgetType.TEXT_FIELD);
   * // Returns: 'Textfield_20260122 14:30:45.123'
   * 
   * @example
   * const checkboxName = CPDFWidgetUtil.createFieldName(CPDFWidgetType.CHECKBOX);
   * // Returns: 'Checkbox_20260122 14:30:45.456'
   */
  static createFieldName(widgetType: string): string {
    const now = new Date();
    const dateStr = `${now.getFullYear()}${this.twoDigits(now.getMonth() + 1)}${this.twoDigits(now.getDate())} ` +
      `${this.twoDigits(now.getHours())}:${this.twoDigits(now.getMinutes())}:${this.twoDigits(now.getSeconds())}.` +
      `${String(now.getMilliseconds()).padStart(3, "0")}`;

    const name = widgetType || "";
    const capitalized =
      name.length > 0 ? name.charAt(0).toUpperCase() + name.slice(1) : "";

    return `${capitalized}_${dateStr}`;
  }

  private static twoDigits(n: number): string {
    return String(n).padStart(2, "0");
  }
}