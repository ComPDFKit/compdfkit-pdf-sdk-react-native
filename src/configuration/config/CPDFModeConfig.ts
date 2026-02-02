/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFUiVisibilityMode, CPDFViewMode } from "@compdfkit_pdf_sdk/react_native";


/**
 * PDF mode configuration. Used to set initial and available view modes (reading, annotation, content editing, forms, signatures, etc.),
 * as well as behaviors like auto fullscreen and toolbar visibility.
 * @group Configuration
 */
export interface CPDFModeConfig {
    /**
     * Default mode to display when opening the PDF View, default is [CPDFToolbarAction.VIEWER]
     */
    initialViewMode?: CPDFViewMode;

    /**
     * UI display mode, full screen, normal, or minimal mode.
     * Default: {@link CPDFUiVisibilityMode.AUTOMATIC}
     */
    uiVisibilityMode?: CPDFUiVisibilityMode;

    /**
     * Configure supported modes
     */
    availableViewModes?: CPDFViewMode[];
}