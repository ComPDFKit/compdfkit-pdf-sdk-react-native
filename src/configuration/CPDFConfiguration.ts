/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */




import { CPDFAnnotationConfig } from "./config/CPDFAnnotationConfig";
import { CPDFContentEditorConfig } from "./config/CPDFContentEditorConfig";
import { CPDFContextMenuConfig } from "./config/CPDFContextMenuConfig";
import { CPDFFormConfig } from "./config/CPDFFormConfig";
import { CPDFGlobalConfig } from "./config/CPDFGlobalConfig";
import { CPDFModeConfig } from "./config/CPDFModeConfig";
import { CPDFReaderViewConfig } from "./config/CPDFReaderViewConfig";
import { CPDFToolbarConfig } from "./config/CPDFToolbarConfig";

/**
 * PDF configuration class for customizing display and interaction via ComPDFKit.openDocument.
 * Supports flexible customization of UI elements, PDF properties, toolbars, annotations, forms, content editing, etc.
 * @group Configuration
 * @example
 * const configuration: CPDFConfiguration = {
 *   modeConfig: {
 *     initialViewMode: CPDFModeConfig.ViewMode.VIEWER,
 *     availableViewModes: [
 *       CPDFModeConfig.ViewMode.VIEWER,
 *       CPDFModeConfig.ViewMode.ANNOTATIONS,
 *       CPDFModeConfig.ViewMode.CONTENT_EDITOR,
 *       CPDFModeConfig.ViewMode.FORMS,
 *       CPDFModeConfig.ViewMode.SIGNATURES
 *     ]
 *   }
 * };
 *
 * ComPDFKit.openDocument(document, 'password', JSON.stringify(configuration));
 * 
 * CPDFReaderView(
 *  configuration={ComPDFKit.getDefaultConfig({
 *               modeConfig: {
 *                  initialViewMode: CPDFViewMode.ANNOTATIONS,
 *                  uiVisibilityMode: "automatic",
 *                },
 *                toolbarConfig: {
 *                  annotationToolbarVisible: false,
 *                },
 *              })}
 * );
 */
export class CPDFConfiguration {
  /**
   * PDF mode configuration. Used to set initial and available view modes (reading, annotation, content editing, forms, signatures, etc.),
   * as well as behaviors like auto fullscreen and toolbar visibility.
   */
  modeConfig?: CPDFModeConfig;

  /**
   * Configuration for the top toolbar and bottom toolbars in different modes.
   */
  toolbarConfig?: CPDFToolbarConfig;

  /**
   * Annotation configuration. Defines available annotation types, tools, and default properties in annotation mode.
   */
  annotationsConfig?: CPDFAnnotationConfig;

  /**
   * Content editor mode configuration. Sets editing tools, types, and default properties for content editing mode.
   */
  contentEditorConfig?: CPDFContentEditorConfig;

  /**
   * Form configuration. Customizes form filling and field properties.
   */
  formsConfig?: CPDFFormConfig;
  /**
   * PDF view configuration. Sets page layout, scroll direction, theme color, etc.
   */
  readerViewConfig?: CPDFReaderViewConfig;

  /**
   * Global configuration. Sets global features such as theme mode, watermark, error prompts, etc.
   */
  global?: CPDFGlobalConfig;

  /**
   * Context menu configuration. Customizes context menu options for annotations, forms, text, etc. in various modes.
   */
  contextMenuConfig?: CPDFContextMenuConfig;
}

