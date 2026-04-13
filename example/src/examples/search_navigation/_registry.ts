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

export const searchNavigationCategory: CategoryInfo = {
  id: 'search_navigation',
  name: 'Search & Navigation',
  description: 'Search and navigation features',
  icon: require('../../../assets/ic_search.png'),
  badge: 'SN',
  accentColor: '#4F46E5',
  examples: [
    {
      id: 'show-hide-search',
      name: 'Show/Hide Search View',
      description: 'Show or hide text search view',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.searchShowHide,
      visual: {
        badge: 'SH',
        accentColor: '#1565C0',
        backgroundColor: '#E3F2FD',
      },
    },
    {
      id: 'text-search-api',
      name: 'Text Search API',
      description: 'Search text using API and display results in list',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.searchTextApi,
      visual: {
        badge: 'TS',
        accentColor: '#3949AB',
        backgroundColor: '#E8EAF6',
      },
    },
    {
      id: 'outline-navigation',
      name: 'Outline Navigation',
      description: 'Open document outline list',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.searchOutline,
      visual: {
        badge: 'ON',
        accentColor: '#388E3C',
        backgroundColor: '#E8F5E9',
      },
    },
    {
      id: 'bookmark-operations',
      name: 'Bookmark Operations',
      description: 'Bookmark add and delete',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.searchBookmarks,
      visual: {
        badge: 'BK',
        accentColor: '#C2185B',
        backgroundColor: '#FCE4EC',
      },
    },
    {
      id: 'page-navigation',
      name: 'Page Navigation',
      description: 'Page navigation',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.searchPageNavigation,
      visual: {
        badge: 'PN',
        accentColor: '#E65100',
        backgroundColor: '#FFF3E0',
      },
    },
  ],
};