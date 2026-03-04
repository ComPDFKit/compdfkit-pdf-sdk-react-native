/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { ComPDFKit } from "./core/ComPDFKitModule";
import { getDefaultConfig } from "./core/DefaultConfig";
import { menus, botaMenus } from "./core/ConfigHelpers";
import PDFReaderContext from "./core/PDFReaderContext";

ComPDFKit.getDefaultConfig = getDefaultConfig;

// === Options & Configs ===
export * from "./configuration/CPDFOptions";
export type { CPDFConfiguration } from "./configuration/CPDFConfiguration";
export type { CPDFModeConfig } from "./configuration/config/CPDFModeConfig";
export type {
  CPDFToolbarConfig,
  CPDFToolbarItem,
} from "./configuration/config/CPDFToolbarConfig";
export type { CPDFAnnotationConfig } from "./configuration/config/CPDFAnnotationConfig";
export type { CPDFContentEditorConfig, CPDFEditorTextAttr } from "./configuration/config/CPDFContentEditorConfig";
export type { CPDFFormConfig } from "./configuration/config/CPDFFormConfig";
export type { CPDFGlobalConfig, CPDFBotaMenuItem } from "./configuration/config/CPDFGlobalConfig";
export type { CPDFWatermarkConfig } from "./configuration/config/CPDFWatermarkConfig";
export type * from "./configuration/config/CPDFReaderViewConfig";
export type * from "./configuration/config/CPDFContextMenuConfig";
export type * from "./configuration/attributes/CPDFAnnotationAttr";
export type * from "./configuration/attributes/CPDFWidgetAttr";

// === Core Views ===
export { CPDFReaderView } from "./view/CPDFReaderView";
export type { CPDFReaderViewProps } from "./view/CPDFReaderView";
export type { CPDFEventDataMap } from "./configuration/CPDFOptions";

// === Document & Pages ===
export { CPDFDocument } from "./document/CPDFDocument";
export * from "./page/CPDFPage";
export * from "./page/CPDFSearchOptions";
export * from "./page/CPDFTextRange";
export * from "./page/CPDFTextSearcher";
export { CPDFFontName } from "./document/CPDFFontName";
export type { CPDFFontNameProps } from "./document/CPDFFontName";
export type { CPDFInfo } from "./document/CPDFInfo";
export type { CPDFDocumentPermissionInfo } from "./document/CPDFDocumentPermissionInfo";


// === Actions ===
export * from "./document/action/CPDFAction";
export { CPDFGoToAction } from "./document/action/CPDFGoToAction";
export { CPDFUriAction } from "./document/action/CPDFUriAction";

// === Annotations ===
export { CPDFAnnotation } from "./annotation/CPDFAnnotation";
export { CPDFCircleAnnotation } from "./annotation/CPDFCircleAnnotation";
export { CPDFFreeTextAnnotation } from "./annotation/CPDFFreeTextAnnotation";
export { CPDFImageAnnotation } from "./annotation/CPDFImageAnnotation";
export { CPDFInkAnnotation } from "./annotation/CPDFInkAnnotation";
export { CPDFLineAnnotation } from "./annotation/CPDFLineAnnotation";
export { CPDFLinkAnnotation } from "./annotation/CPDFLinkAnnotation";
export { CPDFMarkupAnnotation, CPDFHighlightAnnotation, CPDFSquigglyAnnotation, CPDFStrikeOutAnnotation, CPDFUnderlineAnnotation} from "./annotation/CPDFMarkupAnnotation";
export { CPDFSquareAnnotation } from "./annotation/CPDFSquareAnnotation";
export { CPDFNoteAnnotation } from "./annotation/CPDFNoteAnnotation";
export { CPDFStampAnnotation } from "./annotation/CPDFStampAnnotation";
export { CPDFSignatureAnnotation } from "./annotation/CPDFSignatureAnnotation";
export { CPDFSoundAnnotation } from "./annotation/CPDFSoundAnnotation";
export { CPDFTextStamp, CPDFTextStampColor, CPDFTextStampShape } from "./annotation/CPDFTextStamp";
export type { CPDFTextAttribute } from "./annotation/CPDFTextAttribute";
export { CPDFAnnotationHistoryManager } from "./history/CPDFAnnotationHistoryManager";

// === Form Widgets ===
export { CPDFWidget } from "./annotation/form/CPDFWidget";
export { CPDFCheckboxWidget } from "./annotation/form/CPDFCheckboxWidget";
export { CPDFComboboxWidget } from "./annotation/form/CPDFComboboxWidget";
export { CPDFListboxWidget } from "./annotation/form/CPDFListboxWidget";
export { CPDFPushbuttonWidget } from "./annotation/form/CPDFPushbuttonWidget";
export { CPDFRadiobuttonWidget } from "./annotation/form/CPDFRadiobuttonWidget";
export { CPDFSignatureWidget } from "./annotation/form/CPDFSignatureWidget";
export { CPDFTextWidget } from "./annotation/form/CPDFTextWidget";
export type { CPDFWidgetItem } from "./annotation/form/CPDFWidgetItem";

// === Content Editor Area ===
export { CPDFEditManager } from "./edit/CPDFEditManager";
export { CPDFEditArea } from "./edit/CPDFEditArea";
export { CPDFEditTextArea } from "./edit/CPDFEditTextArea";
export { CPDFEditImageArea } from "./edit/CPDFEditImageArea";
export { CPDFEditorHistoryManager } from "./history/CPDFEditorHistoryManager";

// === Utils ===
export type { CPDFRectF } from "./util/CPDFRectF";
export { CPDFImageUtil } from "./util/CPDFImageUtil";
export { CPDFDateUtil } from "./util/CPDFDateUtil";
export { CPDFImageData, CPDFImageType } from "./util/CPDFImageData";
export { CPDFWidgetUtil } from "./util/CPDFWidgetUtil";

// === Outline ===
export type { CPDFOutline } from "./document/CPDFOutline";
export type { CPDFDestination } from "./document/CPDFDestination";

// === Bookmark ===
export type { CPDFBookmark } from "./document/CPDFBookmark";

// === Core Exports ===
export { ComPDFKit };
export { getDefaultConfig };
export { menus, botaMenus };
export type { CPDFContextMenuItemInput } from "./core/ConfigHelpers";

// Maintain default export of PDFReaderContext
export { default as PDFReaderContext } from "./core/PDFReaderContext";
export default PDFReaderContext;
