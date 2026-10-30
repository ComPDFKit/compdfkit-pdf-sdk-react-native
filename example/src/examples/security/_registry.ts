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
  description: 'Password, watermark, headers, permissions and signatures',
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
      id: 'watermark-operations',
      name: 'Watermark Operations',
      description: 'Create, inspect, update, and remove watermarks',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.securityWatermarkOperations,
      visual: {
        badge: 'WM',
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
      id: 'header-footer',
      name: 'Header & Footer',
      description: 'Add, inspect, update, and clear document headers and footers',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.securityHeaderFooter,
      visual: {
        badge: 'HF',
        accentColor: '#E65100',
        backgroundColor: '#FFF3E0',
      },
    },
    {
      id: 'bates-numbering',
      name: 'Bates Numbering',
      description: 'Apply, inspect, update, or clear Bates numbering',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.securityBates,
      visual: {
        badge: 'BN',
        accentColor: '#3949AB',
        backgroundColor: '#E8EAF6',
      },
    },
    {
      id: 'document-background',
      name: 'Document Background',
      description: 'Set, inspect, update, and clear color or image backgrounds',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.securityBackground,
      visual: {
        badge: 'BG',
        accentColor: '#00838F',
        backgroundColor: '#E0F7FA',
      },
    },
    {
      id: 'digital-signature',
      name: 'Digital Signature',
      description: 'Tap a signature field to sign, inspect, timestamp and add LTV evidence',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.securitySignatures,
      visual: {
        badge: 'DS',
        accentColor: '#0D47A1',
        backgroundColor: '#EFF7FF',
      },
    },
    {
      id: 'certificate-management',
      name: 'Certificate Management',
      description: 'Create, inspect, and trust a PKCS#12 certificate',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.securityCertificates,
      visual: {
        badge: 'CM',
        accentColor: '#2E7D32',
        backgroundColor: '#E8F5E9',
      },
    },
  ],
};
