/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { NativeModules } from "react-native";
import CPDFFontName from "../document/CPDFFontName";
import type { CPDFConfiguration } from "../configuration/CPDFConfiguration";
import { getDefaultConfig } from "./DefaultConfig";

type NativeCPDFFontName = {
  familyName: string;
  styleNames: string[];
};

interface NativeComPDFKitModule {
  /**
   * Get the version number of the ComPDFKit SDK.
   * For example : '2.0.0'
   * @returns { Promise<string> } A Promise returning ComPDFKit PDF SDK Version Code
   *
   * @example
   * ComPDFKit.getVersionCode().then((versionCode : string) => {
   *   console.log('ComPDFKit SDK Version:', versionCode)
   * })
   */
  getVersionCode(): Promise<string>;

  /**
   * Get the build tag of the ComPDFKit PDF SDK.
   *
   * For example: "build_beta_2.0.0_42db96987_202404081007"
   * @returns { Promise<string> } A Promise returning ComPDFKit PDF SDK Build Tag.
   *
   * @example
   * ComPDFKit.getSDKBuildTag().then((buildTag : string) => {
   *  console.log('ComPDFKit Build Tag:', buildTag)
   * })
   */
  getSDKBuildTag(): Promise<string>;

  /**
   * Initialize the ComPDFKit PDF SDK using offline authentication.
   * Each ComPDFKit license is bound to a specific app bundle ID(Android Application ID).
   *
   * @param { string } [license] Your ComPDFKit for React Native license key.
   * @returns { Promise<boolean> } Returns `true` if initialization is successful, otherwise returns `false`.
   *
   * @example
   * ComPDFKit.init_('your compdfkit license')
   */
  init_(license: string): Promise<boolean>;

  /**
   * Initialize the ComPDFKit PDF SDK using online authentication.
   * Each ComPDFKit license is bound to a specific app bundle ID(Android Application ID).
   *
   * @param { string } [androidOnlineLicense] Your ComPDFKit for React Native Android online license key.
   * @param { string } [iosOnlineLicense] Your ComPDFKit for React Native iOS online license key.
   * @returns { Promise<boolean> } Returns `true` if initialization is successful, otherwise returns `false`.
   *
   * @example
   * ComPDFKit.initialize('your android compdfkit license', 'your ios compdfkit license')
   */
  initialize(
    androidOnlineLicense: string,
    iosOnlineLicense: string
  ): Promise<boolean>;

  /**
   * Initialize the ComPDFKit PDF SDK using a license file.
   * This method is supported only on Android and iOS platforms.
   * Each ComPDFKit license is bound to a specific app bundle ID(Android Application ID).
   *
   * @param { string } [licensePath] The path to the license file.
   * - For Android, the path should be in the format: `assets://license_key.xml`
   * - For iOS, the path should be in the format: `license_key.xml`
   * @returns { Promise<boolean> } Returns `true` if initialization is successful, otherwise returns `false`.
   *
   * @example
   * // For Android
   * const result = await ComPDFKit.initWithPath('assets://license_key.xml')
   *
   * // For iOS
   * const result = await ComPDFKit.initWithPath('license_key.xml')
   */
  initWithPath(licensePath: string): Promise<boolean>;

  /**
   * Used to present a PDF document.
   * @param { string } [document] The path to the PDF document to be presented.
   *
   * * (Android) For local storage file path:
   * ```tsx
   * document = 'file:///storage/emulated/0/Download/sample.pdf'
   * ```
   * * (Android) For content Uri:
   * ```tsx
   * document = 'content://...'
   * ```
   * * (Android) For assets path:
   * ```tsx
   * document = 'file:///android_asset/...'
   * ```
   * ---
   * * (iOS)
   * ```tsx
   * document = 'pdf_document.pdf'
   * ```
   *
   * @param { string } [password] PDF document password.
   * @param { string } [configurationJson] Configuration objects serialized as JSON.
   * @returns { void }
   */
  openDocument(
    document: string,
    password: string,
    configurationJson: string
  ): void;

  /**
   * Delete the saved signature file from the annotation signature list.
   *
   * @example
   * ComPDFKit.removeSignFileList().then((result : boolean) => {
   *  console.log('ComPDFKit removeSignFileList:', result)
   * })
   */
  removeSignFileList(): Promise<boolean>;

  /**
   * Opens the system file picker to select a PDF document.
   * @returns A promise that resolves to the file path of the selected PDF document.
   */
  pickFile(): Promise<string>;

  /**
   * Imports font files to support displaying additional languages.
   * Imported fonts will appear in the font list for FreeText annotations and text editing.
   *
   * Fonts must be imported before initializing the SDK.
   *
   * @param {string} fontDir The path to the folder containing font files to import.
   * @param {boolean} addSysFont Whether to include system fonts in the font list.
   * @returns A promise that resolves when the fonts have been successfully imported.
   *
   * @example
   * await ComPDFKit.setImportFontDir('fontdir', true);
   */
  setImportFontDir: (fontDir: string, addSysFont: boolean) => Promise<boolean>;

  /**
   * Updates the font directory and configures whether to include system fonts.
   * This method is primarily used to dynamically update the font directory after initializing the SDK.
   *
   * @param {string} fontDir The directory path where the font files are stored.
   * @param {boolean} addSysFont Whether to include system fonts.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the font directory was successfully updated, or `false` if an error occurred.
   *
   * @example
   * await ComPDFKit.updateImportFontDir('path/to/your/font', true);
   */
  updateImportFontDir: (
    fontDir: string,
    addSysFont: boolean
  ) => Promise<boolean>;

  /**
   * This method is supported only on the Android platform. It is used to create a URI for saving a file on the Android device.
   * The file is saved in the `Downloads` directory by default, but you can specify a subdirectory within `Downloads` using the
   * `childDirectoryName` parameter. If the `childDirectoryName` is not provided, the file will be saved directly in the `Downloads` directory.
   *
   * @example
   * const uri: string = await ComPDFKit.createUri('test.pdf', '', 'application/pdf');
   */
  createUri?: (
    fileName: string,
    childDirectoryName: string | null,
    mimeType: string
  ) => Promise<string>;

  /**
   * Get the list of fonts available in the ComPDFKit PDF SDK.
   * Mainly used to configure fonts for FreeText annotations and content editing.
   */
  getFonts(): Promise<NativeCPDFFontName[]>;
}

export interface ComPDFKitModule
  extends Omit<NativeComPDFKitModule, "createUri" | "getFonts"> {
  /**
   * Builds the default ComPDFKit configuration JSON string.
   * The provided overrides are merged into the platform-specific defaults.
   */
  getDefaultConfig(overrides?: Partial<CPDFConfiguration>): string;

  /**
   * Creates a writable URI for saving a file.
   * This method is only supported on Android and rejects on unsupported platforms.
   */
  createUri(
    fileName: string,
    childDirectoryName: string | null,
    mimeType: string
  ): Promise<string>;

  /**
   * Returns the available fonts as `CPDFFontName` model instances instead of raw native objects.
   */
  getFonts(): Promise<CPDFFontName[]>;
}

const nativeMethodNames = [
  "getVersionCode",
  "getSDKBuildTag",
  "init_",
  "initialize",
  "initWithPath",
  "openDocument",
  "removeSignFileList",
  "pickFile",
  "setImportFontDir",
  "updateImportFontDir",
  "getFonts",
] as const;

const nativeComPDFKit = NativeModules.ComPDFKit as
  | Partial<NativeComPDFKitModule>
  | undefined;

function getAvailableNativeMethodNames(): string[] {
  if (!nativeComPDFKit) {
    return [];
  }

  return Object.keys(nativeComPDFKit)
    .filter((key) => typeof nativeComPDFKit[key as keyof NativeComPDFKitModule] === "function")
    .sort();
}

function createMissingNativeMethodError(methodName: string): Error {
  const availableMethods = getAvailableNativeMethodNames();
  const moduleState = nativeComPDFKit ? "loaded" : "missing";
  const availableMethodsText = availableMethods.length
    ? availableMethods.join(", ")
    : "none";

  return new Error(
    [
      `ComPDFKit native method '${methodName}' is unavailable.`,
      `NativeModules.ComPDFKit is ${moduleState}.`,
      `Available native methods: ${availableMethodsText}.`,
      "This usually means the JavaScript sources are newer than the installed native app.",
      "Rebuild and reinstall the host app after changing Android/iOS native module APIs.",
    ].join(" ")
  );
}

function getRequiredNativeMethod<K extends (typeof nativeMethodNames)[number]>(
  methodName: K
): NonNullable<NativeComPDFKitModule[K]> {
  const method = nativeComPDFKit?.[methodName];
  if (typeof method !== "function") {
    throw createMissingNativeMethodError(methodName);
  }

  return method as NonNullable<NativeComPDFKitModule[K]>;
}

const comPDFKitBase: Partial<ComPDFKitModule> = {
  ...(nativeComPDFKit ?? {}),
  getDefaultConfig,
  async createUri(fileName, childDirectoryName, mimeType) {
    const createUri = nativeComPDFKit?.createUri;
    if (typeof createUri !== "function") {
      return Promise.reject(
        new Error("createUri() is only supported on Android.")
      );
    }

    return createUri(
      fileName,
      childDirectoryName,
      mimeType
    );
  },
  async getFonts(): Promise<CPDFFontName[]> {
    const getFonts = nativeComPDFKit?.getFonts;
    if (typeof getFonts !== "function") {
      throw createMissingNativeMethodError("getFonts");
    }

    const fonts = await getFonts();
    return Array.isArray(fonts)
      ? fonts.map((font) => CPDFFontName.fromJson(font))
      : [];
  },
};

const ComPDFKit = new Proxy(comPDFKitBase, {
  get(target, property, receiver) {
    const value = Reflect.get(target, property, receiver);

    if (
      typeof property === "string" &&
      (nativeMethodNames as readonly string[]).includes(property) &&
      typeof value === "undefined"
    ) {
      return (...args: unknown[]) => {
        const method = getRequiredNativeMethod(
          property as (typeof nativeMethodNames)[number]
        ) as (...methodArgs: unknown[]) => unknown;
        return method(...args);
      };
    }

    return value;
  },
}) as ComPDFKitModule;

export { ComPDFKit };
