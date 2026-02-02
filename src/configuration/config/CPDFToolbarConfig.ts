/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFToolbarAction } from "@compdfkit_pdf_sdk/react_native";

/**
 * Configuration for the top toolbar and bottom toolbars in different modes.
 * @group Configuration
 */
export interface CPDFToolbarConfig {

  /**
   * Set whether to display the top toolbar
   *
   * Default: true
   */
  mainToolbarVisible?: boolean;

  /**
   * Set whether to display the annotation toolbar
   */
  annotationToolbarVisible?: boolean;

  /**
   * Set whether to display the content editor toolbar
   */
  contentEditorToolbarVisible?: boolean;

  /**
   * Set whether to display the form toolbar
   */
  formToolbarVisible?: boolean;

  /**
   * Set whether to display the signature toolbar
   */
  signatureToolbarVisible?: boolean;

  /**
   * Set whether to show the Ink annotation toggle button in the annotation toolbar
   */
  showInkToggleButton?: boolean;

  /**
   * Top toolbar actions on the left side.
   * Android Platform Default: back
   * iOS Platform Default: back, thumbnail
   * 
   * if set customToolbarLeftItems, the default left items will be ignored.
   */
  toolbarLeftItems?: CPDFToolbarAction[];

  /**
   * Top toolbar actions on the right side.
   * Android Platform Default: thumbnail, search, bota, menu
   * iOS Platform Default: search, bota, menu
   * 
   * if set customToolbarRightItems, the default right items will be ignored.
   */
  toolbarRightItems?: CPDFToolbarAction[];


  /**
   * Configure the menu options opened in the top toolbar {@link CPDFToolbarAction.MENU}
   * 
   * if set customMoreMenuItems, the default menu items will be ignored.
   */
  availableMenus?: CPDFToolbarAction[];

  /**
   * Custom toolbar items to be added to the toolbar.
   * These items will be added to the left sides of the top toolbar.
   * 
   * @example
   * // Adding a custom button to the left side of the toolbar
   * toolbarConfig: {
   *   customToolbarLeftItems: [
   *     {
   *       action: CPDFToolbarAction.CUSTOM,
   *       identifier: "custom_button_1",
   *       icon: "custom_icon", // name of the android drawable or iOS image asset
   *       title: "Custom" // This only takes effect in the "more" menu.
   *     }
   *   ]
   * }
   * 
   * // The custom button can be handled via the onToolbarItemPressed callback
   * <CPDFReaderView
   *   configuration={configuration}
   *   onToolbarItemPressed={(identifier) => {
   *     if (identifier === "custom_button_1") {
   *       // Handle custom button press
   *     }
   *   }}
   * />
   */
  customToolbarLeftItems?: CPDFToolbarItem[];

  /**
   * Custom toolbar items to be added to the toolbar.
   * These items will be added to the right sides of the top toolbar.
   * 
   * @example
   * // Adding a custom button to the right side of the toolbar
   * toolbarConfig: {
   *   customToolbarRightItems: [
   *     {
   *       action: CPDFToolbarAction.CUSTOM,
   *       identifier: "custom_button_1",
   *       icon: "custom_icon", // name of the android drawable or iOS image asset
   *       title: "Custom" // This only takes effect in the "more" menu.
   *     }
   *   ]
   * }
   * 
   * // The custom button can be handled via the onToolbarItemPressed callback
   * <CPDFReaderView
   *   configuration={configuration}
   *   onToolbarItemPressed={(identifier) => {
   *     if (identifier === "custom_button_1") {
   *       // Handle custom button press
   *     }
   *   }}
   * />
   */
  customToolbarRightItems?: CPDFToolbarItem[];


  /**
   * Custom toolbar items to be added to the "more" menu.
   * These items will be added to the bottom of the "more" menu.
   * 
   * @example
   * // Adding a custom button to the "more" menu
   * toolbarConfig: {
   *   customMoreMenuItems: [
   *     {
   *       action: CPDFToolbarAction.CUSTOM,
   *       identifier: "custom_button_1",
   *       icon: "custom_icon", // name of the android drawable or iOS image asset
   *       title: "Custom" // This only takes effect in the "more" menu.
   *     },
   *     {
   *      action: CPDFToolbarAction.VIEW_SETTINGS
   *      icon: "view_settings_icon",
   *      title: "View Settings"
   *     }
   *   ]
   * }
   */
  customMoreMenuItems?: CPDFToolbarItem[];

};

/**
 * Configuration for a custom toolbar item.
 * You can use this to add custom buttons to the toolbar.
 * 
 * @example
 * // custom item
 * CPDFToolbarItem {
 *    action: CPDFToolbarAction.CUSTOM,
 *    identifier: "custom_button_1",
 *    icon: "custom_icon", // name of the android drawable or iOS image asset
 *    title: "Custom" // This only takes effect in the "more" menu.
 * }
 */
export interface CPDFToolbarItem {
  action: CPDFToolbarAction;
  identifier?: string;
  icon?: string;
  title?: string;
}