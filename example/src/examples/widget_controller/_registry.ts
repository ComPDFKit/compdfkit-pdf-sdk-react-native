/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type { CategoryInfo } from '../shared/categoryInfo';
import { EXAMPLE_ROUTES } from '../shared/exampleRoutes';
import { EXAMPLE_ROUTE_TYPES } from '../shared/exampleRouteType';

export const widgetControllerCategory: CategoryInfo = {
  id: 'widget_controller',
  name: 'Widget Controller',
  description: 'Save, zoom and view control',
  icon: require('../../../assets/ic_bota.png'),
  badge: 'WC',
  accentColor: '#2563EB',
  examples: [
    {
      id: 'save-document',
      name: 'Save Document',
      description: 'Save and save as',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.readerDocumentControl,
      visual: {
        badge: 'SV',
        accentColor: '#1565C0',
        backgroundColor: '#E3F2FD',
      },
    },
    {
      id: 'zoom-scale',
      name: 'Zoom Scale',
      description: 'Zoom control',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.readerZoomScale,
      visual: {
        badge: 'ZS',
        accentColor: '#388E3C',
        backgroundColor: '#E8F5E9',
      },
    },
    {
      id: 'display-settings',
      name: 'Display Settings',
      description: 'Show settings entry',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.readerDisplaySettings,
      visual: {
        badge: 'DS',
        accentColor: '#7B1FA2',
        backgroundColor: '#F3E5F5',
      },
    },
    {
      id: 'view-operations',
      name: 'View Operations',
      description: 'Show thumbnails, BOTA, search',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.readerViewOperations,
      visual: {
        badge: 'VO',
        accentColor: '#C2185B',
        backgroundColor: '#FCE4EC',
      },
    },
    {
      id: 'snip-mode',
      name: 'Snip Mode',
      description: 'Snip mode',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.readerSnipMode,
      visual: {
        badge: 'SM',
        accentColor: '#E65100',
        backgroundColor: '#FFF3E0',
      },
    },
    {
      id: 'preview-mode',
      name: 'Preview Mode',
      description: 'Switch preview modes',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.readerPreviewMode,
      visual: {
        badge: 'PM',
        accentColor: '#00838F',
        backgroundColor: '#E0F7FA',
      },
    },
  ],
};