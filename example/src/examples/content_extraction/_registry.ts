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

export const contentExtractionCategory: CategoryInfo = {
  id: 'content_extraction',
  name: 'Content Extraction',
  description: 'Extract text, images and page content',
  icon: require('../../../assets/ic_text.png'),
  badge: 'EX',
  accentColor: '#0F766E',
  examples: [
    {
      id: 'page-text-extraction',
      name: 'Page Text Extraction',
      description: 'Extract page text and inspect text lines',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.contentExtractionPageText,
      visual: {
        badge: 'TX',
        accentColor: '#0F766E',
        backgroundColor: '#E0F2F1',
      },
    },
    {
      id: 'image-extraction',
      name: 'Image Extraction',
      description: 'Extract document images to an output directory',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.contentExtractionImages,
      visual: {
        badge: 'IM',
        accentColor: '#0F766E',
        backgroundColor: '#E0F2F1',
      },
    },
  ],
};
