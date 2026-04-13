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

export const formsCategory: CategoryInfo = {
  id: 'forms',
  name: 'Forms',
  description: 'Form creation, filling and data import/export',
  icon: require('../../../assets/ic_textfield.png'),
  badge: 'FM',
  accentColor: '#16A34A',
  examples: [
    {
      id: 'create-form-fields',
      name: 'Create Form Fields',
      description: 'Create common form fields',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.formCreateFields,
      visual: {
        badge: 'CF',
        accentColor: '#7B1FA2',
        backgroundColor: '#F3E5F5',
      },
    },
    {
      id: 'fill-form',
      name: 'Fill Form',
      description: 'Programmatically fill form fields',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.formFill,
      visual: {
        badge: 'FF',
        accentColor: '#1565C0',
        backgroundColor: '#E3F2FD',
      },
    },
    {
      id: 'edit-form-default-style',
      name: 'Edit Form Default Style',
      description: 'Get and modify default form styles',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.formDefaultStyle,
      visual: {
        badge: 'ES',
        accentColor: '#5E35B1',
        backgroundColor: '#EDE7F6',
      },
    },
    {
      id: 'form-data-import-export',
      name: 'Form Data Import/Export',
      description: 'Import and export form data',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.formDataImportExport,
      visual: {
        badge: 'FD',
        accentColor: '#00796B',
        backgroundColor: '#E0F2F1',
      },
    },
    {
      id: 'form-field-operations',
      name: 'Form Field Operations',
      description: 'Get and view form fields',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.formFieldOperations,
      visual: {
        badge: 'FO',
        accentColor: '#E65100',
        backgroundColor: '#FFF3E0',
      },
    },
    {
      id: 'custom-form-creation',
      name: 'Custom Form Creation',
      description: 'Custom handling for ListBox, ComboBox and PushButton creation',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.formCustomCreation,
      visual: {
        badge: 'FC',
        accentColor: '#C2185B',
        backgroundColor: '#FCE4EC',
      },
    },
    {
      id: 'api-form-creation-mode',
      name: 'API Form Creation Mode',
      description: 'Enter form creation mode via API and create fields',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.formCreationMode,
      visual: {
        badge: 'AF',
        accentColor: '#1565C0',
        backgroundColor: '#E3F2FD',
      },
    },
    {
      id: 'form-intercept-action',
      name: 'Field Action Observation',
      description: 'Observe ListBox and ComboBox selection actions',
      routeType: EXAMPLE_ROUTE_TYPES.screen,
      routeName: EXAMPLE_ROUTES.formInterceptAction,
      supportedPlatforms: ['android'],
      visual: {
        badge: 'IA',
        accentColor: '#7B1FA2',
        backgroundColor: '#F3E5F5',
      },
    },
  ],
};