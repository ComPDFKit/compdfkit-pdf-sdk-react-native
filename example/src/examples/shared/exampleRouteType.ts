/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

export const EXAMPLE_ROUTE_TYPES = {
  screen: 'screen',
  modalCallback: 'modalCallback',
} as const;

export type ExampleRouteType =
  (typeof EXAMPLE_ROUTE_TYPES)[keyof typeof EXAMPLE_ROUTE_TYPES];