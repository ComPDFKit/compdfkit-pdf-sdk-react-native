/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFAnnotationType, CPDFConfigTool } from "@compdfkit_pdf_sdk/react_native";
import { CPDFAnnotationAttr } from "../attributes/CPDFAnnotationAttr";

/**
 * @class CPDFAnnotationConfig
 * @group Configuration
 */
export interface CPDFAnnotationConfig {

    /**
     * {@link CPDFViewMode.ANNOTATIONS} mode, default author for new annotations.
     */
    annotationAuthor?: string;


    /**
     * In annotation mode, when tapping the bottom toolbar or calling
     * pdfReaderRef.current?.setAnnotationMode('signature'), whether to automatically show the signature picker dialog.
     * Default: true. If set to false, the signature picker dialog will not be displayed.
     * You can handle signature selection yourself via the onAnnotationCreationPrepared callback.
     * For example, show a custom signature picker, then call controller.prepareNextSignature(signPath) with the chosen signature path;
     * a subsequent tap will place the custom signature into the PDF.
     */
    autoShowSignPicker?: boolean;

    /**
     * In annotation mode, when tapping the bottom toolbar or calling
     * pdfReaderRef.current?.setAnnotationMode('picture'), whether to automatically show the picture picker dialog.
     * Default: true. If set to false, the picture picker dialog will not be displayed.
     * You can handle picture selection yourself via the onAnnotationCreationPrepared callback.
     * For example, show a custom image picker, then call controller.prepareNextPicture(imagePath) with the chosen image path;
     * a subsequent tap will add the custom image to the PDF.
     */
    autoShowPicPicker?: boolean;

    /**
     * In annotation mode, when tapping the bottom toolbar or calling
     * pdfReaderRef.current?.setAnnotationMode('stamp'), whether to automatically show the stamp picker dialog.
     * Default: true. If set to false, the stamp picker dialog will not be displayed.
     * You can handle stamp selection yourself via the onAnnotationCreationPrepared callback.
     * For example, show a custom stamp picker, then call controller.prepareNextStamp(stampPath) with the chosen stamp path;
     * a subsequent tap will add the custom stamp to the PDF.
     */
    autoShowStampPicker?: boolean;

    /**
     * In annotation mode, when tapping the bottom toolbar or calling
     * pdfReaderRef.current?.setAnnotationMode('link'), whether to automatically show the link settings dialog after the link area is drawn.
     * Default: true. If set to false, the link settings dialog will not be displayed.
     * You can handle link configuration yourself via the onAnnotationCreationPrepared callback.
     * For example, show a custom link dialog, then call controller.prepareNextLink(link) with the configured link;
     * a subsequent tap will add the custom link to the PDF.
     */
    autoShowLinkDialog?: boolean;

    /**
     * {@link CPDFViewMode.ANNOTATIONS} mode, list of annotation functions shown at the bottom of the view.
     */
    availableTypes?: CPDFAnnotationType[];

    /**
     * {@link CPDFViewMode.ANNOTATIONS} mode, annotation tools shown at the bottom of the view.
     */
    availableTools?: CPDFConfigTool[];

    /**
     * When adding an annotation, the annotation’s default attributes.
     */
    initAttribute?: CPDFAnnotationAttr;

    /**
     * Intercept click actions on existing note annotations.
     * Default is false (not intercepted). Clicking a note annotation will directly pop up the note content editing dialog.
     * When set to true, the click event is intercepted via [CPDFReaderView.onInterceptAnnotationActionCallback].
     * Developers can handle custom note content editing dialogs through the callback.
     */
    interceptNoteAction?: boolean;

    /**
     * Intercept click actions on existing link annotations.
     * Default is false (not intercepted). Clicking a link annotation will directly execute the link jump action.
     * When set to true, the click event is intercepted via [CPDFReaderView.onInterceptAnnotationActionCallback].
     * Developers can handle custom link jump actions through the callback.
     */
    interceptLinkAction?: boolean;


};