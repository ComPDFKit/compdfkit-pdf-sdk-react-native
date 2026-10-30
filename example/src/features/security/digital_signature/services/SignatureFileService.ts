/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { Platform } from "react-native";
import RNFS from "react-native-fs";
import {
  pick,
  keepLocalCopy,
  types,
  isErrorWithCode,
  errorCodes,
} from "@react-native-documents/picker";

/** File selection and path normalization stay out of signing and presentation code. */
export class SignatureFileService {
  private sequence = 0;
  readonly directory = `${RNFS.CachesDirectoryPath}/digital_signature`;

  async outputPath(prefix: string, extension = "pdf"): Promise<string> {
    await RNFS.mkdir(this.directory);
    return `${this.directory}/${prefix}_${Date.now()}_${this
      .sequence++}.${extension}`;
  }

  /** Copy the bundled sample to a writable local file, including on Android assets. */
  async initialDocument(): Promise<string> {
    const path = await this.outputPath("unsigned");
    if (Platform.OS === "android")
      await RNFS.copyFileAssets("unsigned_signature.pdf", path);
    else
      await RNFS.copyFile(
        `${RNFS.MainBundlePath}/unsigned_signature.pdf`,
        path
      );
    return path;
  }

  /** Returns null for cancellation; unreadable selections fail before native SDK calls. */
  async select(
    kind: "pdf" | "certificate" | "image" | "root"
  ): Promise<string | null> {
    try {
      const [file] = await pick({
        type:
          kind === "pdf"
            ? [types.pdf]
            : kind === "image"
            ? [types.images]
            : [types.allFiles],
        allowMultiSelection: false,
      });
      if (!file) return null;
      const extensions =
        kind === "certificate"
          ? ["p12", "pfx"]
          : kind === "root"
          ? ["pem"]
          : kind === "pdf"
          ? ["pdf"]
          : [];
      if (
        extensions.length &&
        !extensions.some((ext) => file.name?.toLowerCase().endsWith(`.${ext}`))
      )
        throw new Error(`Select a ${extensions.join(" or ")} file.`);
      const [copy] = await keepLocalCopy({
        destination: "cachesDirectory",
        files: [
          {
            uri: file.uri,
            fileName: `signature_${Date.now()}_${this.sequence++}_${
              file.name?.replace(/[^a-zA-Z0-9._-]/g, "_") ?? "file"
            }`,
          },
        ],
      });
      if (!copy || copy.status !== "success")
        throw new Error("The selected file could not be copied.");
      return decodeURI(copy.localUri.replace(/^file:\/\//, ""));
    } catch (error) {
      if (
        isErrorWithCode(error) &&
        error.code === errorCodes.OPERATION_CANCELED
      )
        return null;
      throw error;
    }
  }

  async requireOutput(success: boolean, path: string): Promise<string> {
    if (!success || !path || !(await RNFS.exists(path)))
      throw new Error("The output PDF was not created.");
    return path;
  }
}
