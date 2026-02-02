/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

/**
 * Utility class for date and time formatting, specifically for CPDFTextStamp.
 */
export class CPDFDateUtil {
  /**
   * Pads a number to two digits.
   * @param v - The number to pad
   * @returns The padded string
   */
  private static _two(v: number): string {
    return v < 10 ? `0${v}` : v.toString();
  }

  /**
   * Formats the current date and time based on switches.
   * @param params.timeSwitch - Whether to include time in the output
   * @param params.dateSwitch - Whether to include date in the output
   * @returns Formatted date/time string
   * 
   * @example
   * ```ts
   * // Returns: "2025/12/29"
   * CPDFDateUtil.formatDateTime({ timeSwitch: false, dateSwitch: true });
   * 
   * // Returns: "14:30:45"
   * CPDFDateUtil.formatDateTime({ timeSwitch: true, dateSwitch: false });
   * 
   * // Returns: "2025/12/29 14:30:45"
   * CPDFDateUtil.formatDateTime({ timeSwitch: true, dateSwitch: true });
   * 
   * // Returns: ""
   * CPDFDateUtil.formatDateTime({ timeSwitch: false, dateSwitch: false });
   * ```
   */
  static formatDateTime(params: {
    timeSwitch: boolean;
    dateSwitch: boolean;
  }): string {
    const { timeSwitch, dateSwitch } = params;

    if (!timeSwitch && !dateSwitch) {
      return '';
    }

    const now = new Date();
    const parts: string[] = [];

    if (dateSwitch) {
      const year = now.getFullYear();
      const month = this._two(now.getMonth() + 1); // Month is 0-indexed
      const day = this._two(now.getDate());
      parts.push(`${year}/${month}/${day}`);
    }

    if (timeSwitch) {
      const hour = this._two(now.getHours());
      const minute = this._two(now.getMinutes());
      const second = this._two(now.getSeconds());
      parts.push(`${hour}:${minute}:${second}`);
    }

    return parts.join(' ');
  }

  /**
   * Gets a formatted timestamp for CPDFTextStamp.
   * This is an alias for formatDateTime.
   * 
   * @param params.timeSwitch - Whether to include time in the output
   * @param params.dateSwitch - Whether to include date in the output
   * @returns Formatted date/time string
   * 
   * @example
   * ```ts
   * const timestamp = CPDFDateUtil.getTextStampDate({
   *   timeSwitch: true,
   *   dateSwitch: true
   * });
   * 
   * const textStamp = new CPDFTextStamp({
   *   content: 'Approved',
   *   date: timestamp,
   *   shape: CPDFTextStampShape.rect,
   *   color: CPDFTextStampColor.blue
   * });
   * ```
   */
  static getTextStampDate(params: {
    timeSwitch: boolean;
    dateSwitch: boolean;
  }): string {
    return this.formatDateTime(params);
  }
}
