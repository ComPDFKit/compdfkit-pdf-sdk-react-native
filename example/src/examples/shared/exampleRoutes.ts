/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

export const EXAMPLE_ROUTES = {
  viewerBasic: 'CPDFBasicViewerExample',
  viewerOpenExternalFile: 'CPDFOpenExternalFileExample',
  viewerModal: 'CPDFModalViewerExample',
  viewerDarkTheme: 'CPDFDarkThemeViewerExample',
  readerDocumentControl: 'CPDFDocumentControlExample',
  readerZoomScale: 'CPDFZoomScaleExample',
  readerDisplaySettings: 'CPDFDisplaySettingsExample',
  readerViewOperations: 'CPDFViewOperationsExample',
  readerSnipMode: 'CPDFSnipModeExample',
  readerPreviewMode: 'CPDFPreviewModeExample',
  annotationAdd: 'CPDFAddAnnotationExample',
  annotationList: 'CPDFListAnnotationsExample',
  annotationAppearance: 'CPDFAnnotationAppearanceExample',
  annotationEdit: 'CPDFEditAnnotationExample',
  annotationDefaultStyle: 'CPDFEditDefaultStyleExample',
  annotationDelete: 'CPDFDeleteAnnotationExample',
  annotationXfdf: 'CPDFXfdfOperationsExample',
  annotationMode: 'CPDFAnnotationModeExample',
  securitySetPassword: 'CPDFSetPasswordExample',
  securityRemovePassword: 'CPDFRemovePasswordExample',
  securityAddWatermark: 'CPDFAddWatermarkExample',
  securityDocumentPermissions: 'CPDFDocumentPermissionsExample',
  securityDigitalSignature: 'CPDFDigitalSignatureExample',
  pageInsert: 'CPDFInsertPageExample',
  pageDelete: 'CPDFDeletePageExample',
  pageRotate: 'CPDFRotatePageExample',
  pageMove: 'CPDFMovePageExample',
  pageSplit: 'CPDFSplitDocumentExample',
  pageThumbnail: 'CPDFPageThumbnailExample',
  searchShowHide: 'CPDFShowHideSearchExample',
  searchTextApi: 'CPDFTextSearchApiExample',
  searchOutline: 'CPDFOutlineNavigationExample',
  searchBookmarks: 'CPDFBookmarkOperationsExample',
  searchPageNavigation: 'CPDFPageNavigationExample',
  contentEditorText: 'CPDFTextEditingExample',
  contentEditorImage: 'CPDFImageEditingExample',
  contentEditorMode: 'CPDFContentEditingModeExample',
  contentEditorHistory: 'CPDFEditorHistoryExample',
  formCreateFields: 'CPDFCreateFormFieldsExample',
  formFill: 'CPDFFillFormExample',
  formDefaultStyle: 'CPDFEditFormDefaultStyleExample',
  formDataImportExport: 'CPDFFormDataImportExportExample',
  formFieldOperations: 'CPDFFormFieldOperationsExample',
  formCustomCreation: 'CPDFCustomFormCreationExample',
  formCreationMode: 'CPDFApiFormCreationModeExample',
  formInterceptAction: 'CPDFFormInterceptActionExample',
  customToolbar: 'CPDFCustomToolbarExample',
  eventListener: 'CPDFEventListenerExample',
  customUiStyle: 'CPDFCustomUiStyleExample',
  customContextMenu: 'CPDFCustomContextMenuExample',
  customAnnotationCreate: 'CPDFCustomAnnotationCreateExample',
  interceptAnnotationAction: 'CPDFInterceptAnnotationActionExample',
} as const;

export type ExampleRouteName =
  (typeof EXAMPLE_ROUTES)[keyof typeof EXAMPLE_ROUTES];