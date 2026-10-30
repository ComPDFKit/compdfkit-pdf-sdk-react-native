/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { isTimestampServerUrl } from "./CPDFSignatureTimestamp";

/** One labeled line in a native signature appearance. */
export type CPDFSignatureConfigItem = { key: string; value: string };
/** Native appearance options. Content accepts labeled items or an exact multiline override. */
export type CPDFSignatureAppearance = {
  text?: string;
  content?: CPDFSignatureConfigItem[] | string;
  textColor?: string;
  contentColor?: string;
  logoPath?: string;
  imagePath?: string;
  drawLogo?: boolean;
  drawOnlyContent?: boolean;
  contentAlignLeft?: boolean;
};
/** PKCS#12 signing input. Credentials are used only for the native operation. */
export type CPDFSignatureConfig = {
  certificatePath: string;
  password: string;
  reason?: string;
  location?: string;
  name?: string;
  permissions?: number;
  appearance?: CPDFSignatureAppearance;
  /** Optional RFC 3161 http/https TSA URL. Failure rejects; no unsigned timestamp fallback. */
  timestampServerUrl?: string;
};
/** Keeps legacy appearance arrays compatible with the common Android/iOS payload. */
export function toNativeSignatureConfig(
  config: CPDFSignatureConfig
): Record<string, unknown> {
  if (!config.certificatePath)
    throw new Error("Signature config requires certificatePath.");
  if (
    config.timestampServerUrl !== undefined &&
    !isTimestampServerUrl(config.timestampServerUrl)
  )
    throw new Error("Timestamp server must be an http or https URL.");
  return {
    ...(config.timestampServerUrl === undefined
      ? {}
      : { timestamp_server_url: config.timestampServerUrl }),
    certificate_path: config.certificatePath,
    password: config.password,
    reason: config.reason,
    location: config.location,
    name: config.name,
    permissions: config.permissions,
    appearance: config.appearance
      ? {
          ...config.appearance,
          text_color: config.appearance.textColor,
          content_color: config.appearance.contentColor,
          logo_path: config.appearance.logoPath,
          image_path: config.appearance.imagePath,
          draw_logo: config.appearance.drawLogo,
          draw_only_content: config.appearance.drawOnlyContent,
          content_align_left: config.appearance.contentAlignLeft,
          content:
            typeof config.appearance.content === "string"
              ? config.appearance.content
              : config.appearance.content
                  ?.map((i) => `${i.key}: ${i.value}`)
                  .join("\n"),
        }
      : undefined,
  };
}
