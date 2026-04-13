/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type { CategoryId } from '../../examples/shared/categoryIds';
import { EXAMPLE_ROUTES, type ExampleRouteName } from '../../examples/shared/exampleRoutes';

export const APP_ROUTES = {
  home: 'Home',
  category: 'Category',
  settings: 'Settings',
} as const;

export { EXAMPLE_ROUTES };

export type AppCategoryId = CategoryId;

/** Common params shared by all example screens. */
export type ExampleScreenParams = { document?: string } | undefined;

/**
 * Generates a mapped type where every example route name maps to `ExampleScreenParams`.
 * Adding a new route in `EXAMPLE_ROUTES` automatically extends the param list —
 * no manual entry needed here.
 */
type ExampleParamList = {
  [K in ExampleRouteName]: ExampleScreenParams;
};

export type AppStackParamList = {
  Home: undefined;
  Category: { categoryId: AppCategoryId };
  Settings: undefined;
} & ExampleParamList;