/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { annotationsCategory } from './annotations/_registry';
import { contentEditorCategory } from './content_editor/_registry';
import { formsCategory } from './forms/_registry';
import { pagesCategory } from './pages/_registry';
import { searchNavigationCategory } from './search_navigation/_registry';
import { securityCategory } from './security/_registry';
import type { CategoryInfo } from './shared/categoryInfo';
import type { CategoryId } from './shared/categoryIds';
import type { ExampleItem } from './shared/exampleItem';
import { EXAMPLE_ROUTES } from './shared/exampleRoutes';
import { EXAMPLE_ROUTE_TYPES } from './shared/exampleRouteType';
import { uiCustomizationCategory } from './ui_customization/_registry';
import { viewerCategory } from './viewer/_registry';
import { widgetControllerCategory } from './widget_controller/_registry';

export * from './shared/categoryInfo';
export * from './shared/categoryIds';
export * from './shared/exampleItem';
export * from './shared/exampleRoutes';
export * from './shared/exampleRouteType';

export const allCategories: CategoryInfo[] = [
  viewerCategory,
  annotationsCategory,
  formsCategory,
  pagesCategory,
  securityCategory,
  contentEditorCategory,
  widgetControllerCategory,
  searchNavigationCategory,
  uiCustomizationCategory,
];

export const featuredViewerEntry: ExampleItem = {
  id: 'featured-pdf-viewer',
  name: 'PDF Viewer',
  description:
    'Open the smallest viewer example with the default reader configuration.',
  routeType: EXAMPLE_ROUTE_TYPES.screen,
  routeName: EXAMPLE_ROUTES.viewerBasic,
  visual: {
    badge: 'PDF',
    icon: require('../../assets/ic_viewer.png'),
    accentColor: '#1460F3',
    backgroundColor: '#E8F0FF',
    iconTintColor: '#FFFFFF',
  },
};

export const featuredViewerExample = featuredViewerEntry;

export function getCategoryById(categoryId: CategoryId) {
  return allCategories.find(category => category.id === categoryId);
}

export function getCategoryTitle(categoryId: CategoryId) {
  return getCategoryById(categoryId)?.name ?? 'Category';
}