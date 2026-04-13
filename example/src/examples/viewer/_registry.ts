/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { Platform } from 'react-native';

import type { CategoryInfo } from '../shared/categoryInfo';
import { EXAMPLE_ROUTES } from '../shared/exampleRoutes';
import { EXAMPLE_ROUTE_TYPES } from '../shared/exampleRouteType';

const sampleDocumentPath =
  Platform.OS === 'android'
    ? 'file:///android_asset/PDF_Document.pdf'
    : 'PDF_Document.pdf';

export const viewerCategory: CategoryInfo = {
  id: 'viewer',
  name: 'Viewer',
  description: 'Basic PDF viewing features',
  icon: require('../../../assets/ic_viewer.png'),
  badge: 'VW',
  accentColor: '#1460F3',
  examples: [
    {
      id: 'viewer-basic',
      name: 'Basic Viewer',
      description: 'Basic PDF open and view',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.viewerBasic,
      params: {
        document: sampleDocumentPath,
      },
      visual: {
        badge: 'BV',
        accentColor: '#C2185B',
        backgroundColor: '#FCE4EC',
      },
    },
    {
      id: 'viewer-picker',
      name: 'Open External File',
      description: 'Select external PDF file to open',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.viewerOpenExternalFile,
      params: {
        document: sampleDocumentPath,
      },
      supportedPlatforms: ['ios', 'android'],
      visual: {
        badge: 'PF',
        accentColor: '#1976D2',
        backgroundColor: '#E3F2FD',
      },
    },
    {
      id: 'reader-view',
      name: 'Modal Viewer',
      description: 'Display PDF in Modal mode',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.viewerModal,
      params: {
        document: sampleDocumentPath,
      },
      visual: {
        badge: 'RV',
        accentColor: '#7B1FA2',
        backgroundColor: '#F3E5F5',
      },
    },
    {
      id: 'reader-view-picker',
      name: 'Dark Theme Viewer',
      description: 'Apply the dark reading theme to the viewer',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.viewerDarkTheme,
      params: {
        document: sampleDocumentPath,
      },
      supportedPlatforms: ['ios', 'android'],
      visual: {
        badge: 'RF',
        accentColor: '#424242',
        backgroundColor: '#F5F5F5',
      },
    },
  ],
};