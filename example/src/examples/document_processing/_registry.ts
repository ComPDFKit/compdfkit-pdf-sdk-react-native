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

export const documentProcessingCategory: CategoryInfo = {
  id: 'document_processing',
  name: 'Document Processing',
  description: 'PDF standard conversion and document optimization',
  icon: require('../../../assets/ic_setting.png'),
  badge: 'DP',
  accentColor: '#0277BD',
  examples: [
    {
      id: 'document-optimize',
      name: 'Document Optimization',
      description: 'Compress a document into an optimized copy',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.documentProcessingOptimize,
      visual: { badge: 'OP', accentColor: '#00796B', backgroundColor: '#E0F2F1' },
    },
    {
      id: 'pdf-standard',
      name: 'PDF Standard',
      description: 'Detect and convert the PDF standard',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.documentProcessingPdfStandard,
      visual: {
        badge: 'PS',
        accentColor: '#0277BD',
        backgroundColor: '#E1F5FE',
      },
    },
  ],
};
