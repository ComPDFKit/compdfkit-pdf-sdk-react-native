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

export const pagesCategory: CategoryInfo = {
  id: 'pages',
  name: 'Pages',
  description: 'Insert, delete, rotate and split pages',
  icon: require('../../../assets/ic_searchlist.png'),
  badge: 'PG',
  accentColor: '#EA580C',
  examples: [
    {
      id: 'insert-page',
      name: 'Insert Page',
      description: 'Insert blank or image page',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.pageInsert,
      visual: {
        badge: 'IP',
        accentColor: '#388E3C',
        backgroundColor: '#E8F5E9',
      },
    },
    {
      id: 'delete-page',
      name: 'Delete Page',
      description: 'Delete specified page',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.pageDelete,
      visual: {
        badge: 'DP',
        accentColor: '#C62828',
        backgroundColor: '#FFEBEE',
      },
    },
    {
      id: 'rotate-page',
      name: 'Rotate Page',
      description: 'Rotate page angle',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.pageRotate,
      visual: {
        badge: 'RP',
        accentColor: '#E65100',
        backgroundColor: '#FFF3E0',
      },
    },
    {
      id: 'move-page',
      name: 'Move Page',
      description: 'Adjust page order',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.pageMove,
      visual: {
        badge: 'MP',
        accentColor: '#512DA8',
        backgroundColor: '#F3E5F5',
      },
    },
    {
      id: 'split-document',
      name: 'Split Document',
      description: 'Split document pages',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.pageSplit,
      visual: {
        badge: 'SD',
        accentColor: '#1565C0',
        backgroundColor: '#E3F2FD',
      },
    },
    {
      id: 'page-thumbnails',
      name: 'Page Thumbnails',
      description: 'Render PDF pages as thumbnail images',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.pageThumbnail,
      visual: {
        badge: 'PT',
        accentColor: '#7B1FA2',
        backgroundColor: '#F3E5F5',
      },
    },
  ],
};