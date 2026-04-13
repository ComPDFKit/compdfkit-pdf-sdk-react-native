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

export const uiCustomizationCategory: CategoryInfo = {
  id: 'ui_customization',
  name: 'UI Customization',
  description: 'Toolbar, menu and style customization',
  icon: require('../../../assets/more.png'),
  badge: 'UI',
  accentColor: '#9333EA',
  examples: [
    {
      id: 'custom-toolbar',
      name: 'Toolbar Customization',
      description: 'Customize toolbar buttons',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.customToolbar,
      visual: {
        badge: 'TB',
        accentColor: '#00796B',
        backgroundColor: '#E0F2F1',
      },
    },
    {
      id: 'custom-context-menu',
      name: 'Context Menu Customization',
      description: 'Customize context menu',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.customContextMenu,
      visual: {
        badge: 'CM',
        accentColor: '#7B1FA2',
        backgroundColor: '#F3E5F5',
      },
    },
    {
      id: 'custom-ui-style',
      name: 'UI Style Customization',
      description: 'Customize UI style configuration',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.customUiStyle,
      visual: {
        badge: 'US',
        accentColor: '#C2185B',
        backgroundColor: '#FCE4EC',
      },
    },
    {
      id: 'event-listeners',
      name: 'Event Listeners',
      description: 'Listen to UI events',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.eventListener,
      visual: {
        badge: 'EL',
        accentColor: '#E65100',
        backgroundColor: '#FFF3E0',
      },
    },
  ],
};