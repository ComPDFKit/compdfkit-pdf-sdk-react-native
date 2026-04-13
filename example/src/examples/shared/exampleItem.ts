/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type { ImageSourcePropType } from 'react-native';

import type { ExampleRouteName } from './exampleRoutes';
import type { ExampleRouteType } from './exampleRouteType';

export type ExamplePlatform = 'ios' | 'android';

export type ExampleVisual = {
  badge?: string;
  icon?: ImageSourcePropType;
  accentColor?: string;
  backgroundColor?: string;
  iconTintColor?: string;
};

export type ExampleActionContext = {
  navigate: (routeName: ExampleRouteName, params?: Record<string, unknown>) => void;
  openDocument: (documentPath: string) => Promise<void>;
  pickDocument: () => Promise<string | null>;
};

export type ExampleItem = {
  id: string;
  name: string;
  description: string;
  routeType: ExampleRouteType;
  routeName?: ExampleRouteName;
  params?: Record<string, unknown>;
  modalCallback?: (
    context: ExampleActionContext,
  ) => Promise<void> | void;
  supportedPlatforms?: ExamplePlatform[];
  visual?: ExampleVisual;
};