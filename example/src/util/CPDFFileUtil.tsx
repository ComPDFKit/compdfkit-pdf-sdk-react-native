/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import * as RNFS from "react-native-fs";
import { Platform } from "react-native";

export class CPDFFileUtil {
  private cacheDirectory: string;

  constructor(cacheDirectory: string = RNFS.CachesDirectoryPath) {
    this.cacheDirectory = cacheDirectory;
  }

  async getUniqueFilePath(
    baseName: string,
    extension: string
  ): Promise<string> {
    let counter = 1;
    let filePath = `${this.cacheDirectory}/${baseName}.${extension}`;

    while (await RNFS.exists(filePath)) {
      filePath = `${this.cacheDirectory}/${baseName}(${counter}).${extension}`;
      counter++;
    }

    return filePath;
  }

  /**
   * Copy an asset file to a target directory
   * @param assetPath - Relative path under assets directory (e.g., 'sign/signature_1.png')
   * @param fileName - Target file name
   * @param targetDir - Target directory path (default: DocumentDirectory/assets)
   * @returns The absolute path of the copied file
   */
  static async copyAssetToDevice(
    assetPath: string,
    fileName: string,
    targetDir?: string
  ): Promise<string> {
    try {
      // 1️⃣ Determine target directory
      const destDir = targetDir || `${RNFS.DocumentDirectoryPath}/assets`;

      // 2️⃣ Ensure the directory exists
      const dirExists = await RNFS.exists(destDir);
      if (!dirExists) {
        await RNFS.mkdir(destDir);
        console.log("Created directory:", destDir);
      }

      // 3️⃣ Target file path
      const destPath = `${destDir}/${fileName}`;

      // 4️⃣ Return directly if the file already exists
      const fileExists = await RNFS.exists(destPath);
      if (fileExists) {
        console.log("File already exists:", destPath);
        return destPath;
      }

      console.log("Copying from:", assetPath, "to:", destPath);

      // 5️⃣ Copy logic based on platform
      if (Platform.OS === "android") {
        /**
         * Android:
         * assetPath must be a relative path under the assets directory
         * Example: sign/signature_1.png
         */
        await RNFS.copyFileAssets(assetPath, destPath);
      } else if (Platform.OS === "ios") {
        /**
         * iOS:
         * assets are located in the main bundle
         */
        const srcPath = `${RNFS.MainBundlePath}/${assetPath}`;
        await RNFS.copyFile(srcPath, destPath);
      } else {
        throw new Error(`Unsupported platform: ${Platform.OS}`);
      }

      console.log("File copied successfully to:", destPath);
      return destPath;
    } catch (error) {
      console.error("Error copying asset file:", error);
      throw error;
    }
  }

  static copyAssetsFolderToStorage = async (assetsFolder: string) => {
    try {
      // Define the target storage directory
      const targetDir = `${RNFS.DocumentDirectoryPath}/${assetsFolder}`;

      // Ensure the target directory exists
      const dirExists = await RNFS.exists(targetDir);
      if (!dirExists) {
        await RNFS.mkdir(targetDir);
      }

      if (Platform.OS === "android") {
        // Android: Read all files in the folder
        const files = await RNFS.readDirAssets(assetsFolder); // Returns an array of file objects
        for (const file of files) {
          if (file.isFile()) {
            const fileContents = await RNFS.readFileAssets(
              `${assetsFolder}/${file.name}`,
              "base64"
            ); // Read file from assets
            const targetFilePath = `${targetDir}/${file.name}`;
            await RNFS.writeFile(targetFilePath, fileContents, "base64"); // Write to target
          }
        }
      } else if (Platform.OS === "ios") {
        // iOS: Copy files directly
        const files = await RNFS.readDir(
          `${RNFS.MainBundlePath}/${assetsFolder}`
        );

        for (const file of files) {
          if (file.isFile()) {
            const sourcePath = file.path;
            const targetFilePath = `${targetDir}/${file.name}`;
            if (await RNFS.exists(targetFilePath)) {
              continue;
            }
            await RNFS.copyFile(sourcePath, targetFilePath);
          }
        }
      } else {
        throw new Error("Unsupported platform");
      }

      return targetDir; // Return the target directory path
    } catch (error) {
      console.error("Error copying folder:", error);
      throw new Error("Failed to copy folder to storage.");
    }
  };
}
