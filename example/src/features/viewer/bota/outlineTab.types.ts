/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFOutline } from '../../../../../src/document/CPDFOutline';

export type LoadState = 'loading' | 'ready' | 'error';

export type OutlineEditorMode = 'add-root' | 'add-child' | 'edit';

export type OutlineMovePosition = 'inside' | 'before' | 'after';

export type OutlineFlatItem = {
  id: string;
  node: CPDFOutline;
  depth: number;
  parentId: string;
  indexInParent: number;
  ancestorIds: string[];
  hasChildren: boolean;
  childCount: number;
};

export type OutlineMoveSession = {
  sourceId: string;
};

export type OutlineMenuAction = {
  key: string;
  label: string;
  tone?: 'default' | 'danger';
  onSelect: () => void;
};

export type OutlineEditorState = {
  mode: OutlineEditorMode;
  title: string;
  pageNumber: string;
  targetItem: OutlineFlatItem | null;
};