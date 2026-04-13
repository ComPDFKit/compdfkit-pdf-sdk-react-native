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

export const securityCategory: CategoryInfo = {
  id: 'security',
  name: 'Security',
  description: 'Password, watermark, permissions and signatures',
  icon: require('../../../assets/ic_setting.png'),
  badge: 'SC',
  accentColor: '#DC2626',
  examples: [
    {
      id: 'set-password',
      name: 'Set Password',
      description: 'Set document password',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.securitySetPassword,
      visual: {
        badge: 'SP',
        accentColor: '#C62828',
        backgroundColor: '#FFEBEE',
      },
    },
    {
      id: 'remove-password',
      name: 'Remove Password',
      description: 'Remove document password',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.securityRemovePassword,
      visual: {
        badge: 'RP',
        accentColor: '#388E3C',
        backgroundColor: '#E8F5E9',
      },
    },
    {
      id: 'add-watermark',
      name: 'Add Watermark',
      description: 'Add text or image watermark',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.securityAddWatermark,
      visual: {
        badge: 'AW',
        accentColor: '#00796B',
        backgroundColor: '#E0F2F1',
      },
    },
    {
      id: 'document-permissions',
      name: 'Document Permissions',
      description: 'View permissions and encryption info',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.securityDocumentPermissions,
      visual: {
        badge: 'DP',
        accentColor: '#C2185B',
        backgroundColor: '#FCE4EC',
      },
    },
    {
      id: 'digital-signature',
      name: 'Digital Signature',
      description: 'View signature status',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.securityDigitalSignature,
      visual: {
        badge: 'DS',
        accentColor: '#0D47A1',
        backgroundColor: '#EFF7FF',
      },
    },
  ],
};