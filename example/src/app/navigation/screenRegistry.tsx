/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import AddAnnotationExampleScreen from '../../features/annotations/examples/AddAnnotationExampleScreen';
import AnnotationAppearanceExampleScreen from '../../features/annotations/examples/AnnotationAppearanceExampleScreen';
import AnnotationModeExampleScreen from '../../features/annotations/examples/AnnotationModeExampleScreen';
import DeleteAnnotationExampleScreen from '../../features/annotations/examples/DeleteAnnotationExampleScreen';
import EditAnnotationExampleScreen from '../../features/annotations/examples/EditAnnotationExampleScreen';
import EditDefaultStyleExampleScreen from '../../features/annotations/examples/EditDefaultStyleExampleScreen';
import ListAnnotationsExampleScreen from '../../features/annotations/examples/ListAnnotationsExampleScreen';
import XfdfOperationsExampleScreen from '../../features/annotations/examples/XfdfOperationsExampleScreen';
import InterceptAnnotationActionExampleScreen from '../../features/annotations/intercept/InterceptAnnotationActionExampleScreen';
import ContentEditingModeExampleScreen from '../../features/content_editor/examples/ContentEditingModeExampleScreen';
import EditorHistoryExampleScreen from '../../features/content_editor/examples/EditorHistoryExampleScreen';
import ImageEditingExampleScreen from '../../features/content_editor/examples/ImageEditingExampleScreen';
import TextEditingExampleScreen from '../../features/content_editor/examples/TextEditingExampleScreen';
import ApiFormCreationModeExampleScreen from '../../features/forms/examples/ApiFormCreationModeExampleScreen';
import CreateFormFieldsExampleScreen from '../../features/forms/examples/CreateFormFieldsExampleScreen';
import CustomFormCreationExampleScreen from '../../features/forms/examples/CustomFormCreationExampleScreen';
import EditFormDefaultStyleExampleScreen from '../../features/forms/examples/EditFormDefaultStyleExampleScreen';
import FillFormExampleScreen from '../../features/forms/examples/FillFormExampleScreen';
import FormDataImportExportExampleScreen from '../../features/forms/examples/FormDataImportExportExampleScreen';
import FormFieldOperationsExampleScreen from '../../features/forms/examples/FormFieldOperationsExampleScreen';
import FormInterceptActionExampleScreen from '../../features/forms/examples/FormInterceptActionExampleScreen';
import { EXAMPLE_ROUTES } from '../../examples/shared/exampleRoutes';
import DeletePageExampleScreen from '../../features/pages/examples/DeletePageExampleScreen';
import InsertPageExampleScreen from '../../features/pages/examples/InsertPageExampleScreen';
import MovePageExampleScreen from '../../features/pages/examples/MovePageExampleScreen';
import PageThumbnailExampleScreen from '../../features/pages/examples/PageThumbnailExampleScreen';
import RotatePageExampleScreen from '../../features/pages/examples/RotatePageExampleScreen';
import SplitDocumentExampleScreen from '../../features/pages/examples/SplitDocumentExampleScreen';
import BookmarkOperationsExampleScreen from '../../features/search_navigation/examples/BookmarkOperationsExampleScreen';
import OutlineNavigationExampleScreen from '../../features/search_navigation/examples/OutlineNavigationExampleScreen';
import PageNavigationExampleScreen from '../../features/search_navigation/examples/PageNavigationExampleScreen';
import ShowHideSearchExampleScreen from '../../features/search_navigation/examples/ShowHideSearchExampleScreen';
import TextSearchApiExampleScreen from '../../features/search_navigation/examples/TextSearchApiExampleScreen';
import AddWatermarkExampleScreen from '../../features/security/examples/AddWatermarkExampleScreen';
import DigitalSignatureExampleScreen from '../../features/security/examples/DigitalSignatureExampleScreen';
import DocumentPermissionsExampleScreen from '../../features/security/examples/DocumentPermissionsExampleScreen';
import RemovePasswordExampleScreen from '../../features/security/examples/RemovePasswordExampleScreen';
import SetPasswordExampleScreen from '../../features/security/examples/SetPasswordExampleScreen';
import CustomAnnotationCreateExampleScreen from '../../features/ui_customization/annotation_create/CustomAnnotationCreateExampleScreen';
import CustomContextMenuExampleScreen from '../../features/ui_customization/context_menu/CustomContextMenuExampleScreen';
import CustomToolbarExampleScreen from '../../features/ui_customization/toolbar/CustomToolbarExampleScreen';
import CustomUiStyleExampleScreen from '../../features/ui_customization/ui_style/CustomUiStyleExampleScreen';
import BasicViewerExampleScreen from '../../features/viewer/examples/BasicViewerExampleScreen';
import DarkThemeViewerExampleScreen from '../../features/viewer/examples/DarkThemeViewerExampleScreen';
import ModalViewerExampleScreen from '../../features/viewer/examples/ModalViewerExampleScreen';
import OpenExternalFileExampleScreen from '../../features/viewer/examples/OpenExternalFileExampleScreen';
import DisplaySettingsExampleScreen from '../../features/viewer/controller/examples/DisplaySettingsExampleScreen';
import DocumentControlExampleScreen from '../../features/viewer/controller/examples/DocumentControlExampleScreen';
import PreviewModeExampleScreen from '../../features/viewer/controller/examples/PreviewModeExampleScreen';
import SnipModeExampleScreen from '../../features/viewer/controller/examples/SnipModeExampleScreen';
import ViewOperationsExampleScreen from '../../features/viewer/controller/examples/ViewOperationsExampleScreen';
import ZoomScaleExampleScreen from '../../features/viewer/controller/examples/ZoomScaleExampleScreen';
import EventListenerExampleScreen from '../../features/viewer/events/EventListenerExampleScreen';
import { CategoryScreen } from '../screens/category/CategoryScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { APP_ROUTES, type AppStackParamList } from './routes';

type ScreenOptions =
  | NativeStackNavigationOptions
  | ((props: any) => NativeStackNavigationOptions);

type ScreenDefinition = {
  name: keyof AppStackParamList;
  component: React.ComponentType<any>;
  options?: ScreenOptions;
};

export const shellScreens: ScreenDefinition[] = [
  {
    name: APP_ROUTES.home,
    component: HomeScreen,
    options: { headerShown: false },
  },
  {
    name: APP_ROUTES.category,
    component: CategoryScreen,
    options: { headerShown: false },
  },
  {
    name: APP_ROUTES.settings,
    component: SettingsScreen,
    options: { headerShown: false },
  },
];

export const exampleScreens: ScreenDefinition[] = [
  {
    name: EXAMPLE_ROUTES.viewerBasic,
    component: BasicViewerExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.viewerOpenExternalFile,
    component: OpenExternalFileExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.viewerModal,
    component: ModalViewerExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.viewerDarkTheme,
    component: DarkThemeViewerExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.readerDocumentControl,
    component: DocumentControlExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.readerZoomScale,
    component: ZoomScaleExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.readerDisplaySettings,
    component: DisplaySettingsExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.readerViewOperations,
    component: ViewOperationsExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.readerSnipMode,
    component: SnipModeExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.readerPreviewMode,
    component: PreviewModeExampleScreen,
    options: { headerShown: false },
  },
  // Annotations menu metadata is declared in src/examples/annotations/_registry.ts.
  {
    name: EXAMPLE_ROUTES.annotationAdd,
    component: AddAnnotationExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.annotationList,
    component: ListAnnotationsExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.annotationAppearance,
    component: AnnotationAppearanceExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.annotationEdit,
    component: EditAnnotationExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.annotationDefaultStyle,
    component: EditDefaultStyleExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.annotationDelete,
    component: DeleteAnnotationExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.annotationXfdf,
    component: XfdfOperationsExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.annotationMode,
    component: AnnotationModeExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.securitySetPassword,
    component: SetPasswordExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.securityRemovePassword,
    component: RemovePasswordExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.securityAddWatermark,
    component: AddWatermarkExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.securityDocumentPermissions,
    component: DocumentPermissionsExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.securityDigitalSignature,
    component: DigitalSignatureExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.pageInsert,
    component: InsertPageExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.pageDelete,
    component: DeletePageExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.pageRotate,
    component: RotatePageExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.pageMove,
    component: MovePageExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.pageSplit,
    component: SplitDocumentExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.pageThumbnail,
    component: PageThumbnailExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.searchShowHide,
    component: ShowHideSearchExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.searchTextApi,
    component: TextSearchApiExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.searchOutline,
    component: OutlineNavigationExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.searchBookmarks,
    component: BookmarkOperationsExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.searchPageNavigation,
    component: PageNavigationExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.contentEditorText,
    component: TextEditingExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.contentEditorImage,
    component: ImageEditingExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.contentEditorMode,
    component: ContentEditingModeExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.contentEditorHistory,
    component: EditorHistoryExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.formCreateFields,
    component: CreateFormFieldsExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.formFill,
    component: FillFormExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.formDefaultStyle,
    component: EditFormDefaultStyleExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.formDataImportExport,
    component: FormDataImportExportExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.formFieldOperations,
    component: FormFieldOperationsExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.formCustomCreation,
    component: CustomFormCreationExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.formCreationMode,
    component: ApiFormCreationModeExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.formInterceptAction,
    component: FormInterceptActionExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.customToolbar,
    component: CustomToolbarExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.eventListener,
    component: EventListenerExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.customUiStyle,
    component: CustomUiStyleExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.customContextMenu,
    component: CustomContextMenuExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.customAnnotationCreate,
    component: CustomAnnotationCreateExampleScreen,
    options: { headerShown: false },
  },
  {
    name: EXAMPLE_ROUTES.interceptAnnotationAction,
    component: InterceptAnnotationActionExampleScreen,
    options: { headerShown: false },
  },
];