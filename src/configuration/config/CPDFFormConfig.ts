/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFConfigTool, CPDFWidgetType } from "@compdfkit_pdf_sdk/react_native";
import { CPDFWidgetAttr } from "../attributes/CPDFWidgetAttr";

/**
 * @class CPDFFormConfig
 * @group Configuration
 */
export interface CPDFFormConfig {
    /**
     * In {@link CPDFViewMode.FORMS} mode, the list of form types at the bottom of the view.
     */
    availableTypes?: CPDFWidgetType[];

    /**
     * Only supports {@link CPDFConfigTool.UNDO} and  {@link CPDFConfigTool.UNDO} .
     */
    availableTools?: CPDFConfigTool[];

    /**
     * Whether to show the create list box options dialog when creating a list box.
     * Default: true
     */
    showCreateListBoxOptionsDialog?: boolean;

    /**
     * Whether to show the create combo box options dialog when creating a combo box.
     * Default: true
     */
    showCreateComboBoxOptionsDialog?: boolean;

    /**
     * Whether to show the create push button options dialog when creating a push button.
     * Default: true
     */
    showCreatePushButtonOptionsDialog?: boolean;

    /**
     * Form default attribute configuration
     */
    initAttribute?: CPDFWidgetAttr;
  }