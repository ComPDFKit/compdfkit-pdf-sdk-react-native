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

// Screen implementations live under src/features/annotations/examples.
// Shared menu handlers are defined in src/features/annotations/shared/annotationExampleActionRegistry.ts.
export const annotationsCategory: CategoryInfo = {
  id: 'annotations',
  name: 'Annotations',
  description: 'Annotation creation, editing, import and export',
  icon: require('../../../assets/ic_comments.png'),
  badge: 'AN',
  accentColor: '#7C3AED',
  examples: [
    {
      id: 'add-annotation',
      name: 'Add Annotation',
      description: 'Add common annotation types',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.annotationAdd,
      visual: {
        badge: 'AA',
        accentColor: '#C62828',
        backgroundColor: '#FFEBEE',
      },
    },
    {
      id: 'list-annotations',
      name: 'List Annotations',
      description: 'List and navigate to annotations',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.annotationList,
      visual: {
        badge: 'LA',
        accentColor: '#2E7D32',
        backgroundColor: '#E8F5E9',
      },
    },
    {
      id: 'annotation-appearance',
      name: 'Annotation Appearance',
      description: 'Render annotation appearance to an image',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.annotationAppearance,
      visual: {
        badge: 'RA',
        accentColor: '#1565C0',
        backgroundColor: '#E3F2FD',
      },
    },
    {
      id: 'edit-annotation',
      name: 'Edit Annotation',
      description: 'Modify annotation properties',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.annotationEdit,
      visual: {
        badge: 'EA',
        accentColor: '#E65100',
        backgroundColor: '#FFF3E0',
      },
    },
    {
      id: 'edit-default-style',
      name: 'Edit Default Style',
      description: 'Get and modify default annotation styles',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.annotationDefaultStyle,
      visual: {
        badge: 'ES',
        accentColor: '#5E35B1',
        backgroundColor: '#EDE7F6',
      },
    },
    {
      id: 'delete-annotation',
      name: 'Delete Annotation',
      description: 'Delete annotations',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.annotationDelete,
      visual: {
        badge: 'DA',
        accentColor: '#880E4F',
        backgroundColor: '#FCE4EC',
      },
    },
    {
      id: 'xfdf-operations',
      name: 'XFDF Operations',
      description: 'Import and export XFDF',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.annotationXfdf,
      visual: {
        badge: 'XF',
        accentColor: '#00695C',
        backgroundColor: '#E0F2F1',
      },
    },
    {
      id: 'custom-annotation-create',
      name: 'Custom Annotation',
      description: 'Custom signatures, images, stamps',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.customAnnotationCreate,
      visual: {
        badge: 'CA',
        accentColor: '#5D4037',
        backgroundColor: '#EFEBE9',
      },
    },
    {
      id: 'api-annotation-mode',
      name: 'API Annotation Mode',
      description: 'Enter annotation mode via API and annotate documents',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.annotationMode,
      visual: {
        badge: 'AM',
        accentColor: '#1565C0',
        backgroundColor: '#E3F2FD',
      },
    },
    {
      id: 'annotation-action',
      name: 'Intercept Action',
      description: 'Intercept link and note annotation actions',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.interceptAnnotationAction,
      visual: {
        badge: 'AI',
        accentColor: '#7B1FA2',
        backgroundColor: '#F3E5F5',
      },
    },
  ],
};