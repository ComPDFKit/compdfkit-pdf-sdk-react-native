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

export const contentEditorCategory: CategoryInfo = {
  id: 'content_editor',
  name: 'Content Editor',
  description: 'Text and image content editing',
  icon: require('../../../assets/ic_text.png'),
  badge: 'CE',
  accentColor: '#0891B2',
  examples: [
    {
      id: 'text-editing',
      name: 'Text Editing',
      description: 'Edit and insert text',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.contentEditorText,
      visual: {
        badge: 'TE',
        accentColor: '#E65100',
        backgroundColor: '#FFF3E0',
      },
    },
    {
      id: 'image-editing',
      name: 'Image Editing',
      description: 'Edit and insert images',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.contentEditorImage,
      visual: {
        badge: 'IE',
        accentColor: '#00796B',
        backgroundColor: '#E0F2F1',
      },
    },
    {
      id: 'content-editing-mode',
      name: 'Content Editing Mode',
      description: 'Switch editing mode',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.contentEditorMode,
      visual: {
        badge: 'CM',
        accentColor: '#1565C0',
        backgroundColor: '#E3F2FD',
      },
    },
    {
      id: 'editor-history',
      name: 'Editor History',
      description: 'Undo/Redo and history listener',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.contentEditorHistory,
      visual: {
        badge: 'EH',
        accentColor: '#C2185B',
        backgroundColor: '#FCE4EC',
      },
    },
  ],
};