/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

/**
 * Controls what happens after an annotation or form field is created interactively with the
 * reader tools.
 *
 * It does not affect programmatic APIs such as `addAnnotations()` and `addWidgets()`, and it is
 * applied when the reader is created: change it by recreating the reader with a new configuration.
 *
 * @example
 * ComPDFKit.getDefaultConfig({
 *   creationConfig: {
 *     continuousCreation: false,
 *     autoSelectCreatedAnnotation: false,
 *   },
 * });
 *
 * @group Configuration
 */
export interface CPDFCreationConfig {
  /**
   * Keeps the current annotation or form creation tool active after an object is created.
   *
   * When `false`, the reader exits the current creation tool but stays in the annotation or form
   * mode. Default: `true`.
   */
  continuousCreation?: boolean;

  /**
   * Selects the newly created annotation or form field.
   *
   * When `false`, the new object shows no focus frame, editing handles, or property panel and no
   * selection event is emitted. Default: `true`.
   */
  autoSelectCreatedAnnotation?: boolean;
}
