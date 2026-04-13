/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFOutline } from '../../../../../src/document/CPDFOutline';

import {
  OutlineFlatItem,
  OutlineMovePosition,
} from './outlineTab.types';

type ExpandedState = Record<string, boolean>;

export type OutlineLookup = Record<string, OutlineFlatItem>;

export type OutlineMoveTarget = {
  parentId: string;
  insertIndex: number;
  expandTargetId?: string;
};

export function flattenVisibleOutlines(
  nodes: CPDFOutline[],
  expanded: ExpandedState,
  depth = 0,
  parentId = '',
  ancestorIds: string[] = [],
): OutlineFlatItem[] {
  const result: OutlineFlatItem[] = [];

  nodes.forEach((node, index) => {
    if (!node) {
      return;
    }

    const item: OutlineFlatItem = {
      id: node.uuid,
      node,
      depth,
      parentId,
      indexInParent: index,
      ancestorIds,
      hasChildren: (node.childList?.length ?? 0) > 0,
      childCount: node.childList?.length ?? 0,
    };

    result.push(item);

    if (item.hasChildren && expanded[item.id]) {
      result.push(
        ...flattenVisibleOutlines(
          node.childList ?? [],
          expanded,
          depth + 1,
          node.uuid,
          [...ancestorIds, node.uuid],
        ),
      );
    }
  });

  return result;
}

export function buildOutlineLookup(items: OutlineFlatItem[]): OutlineLookup {
  return items.reduce<OutlineLookup>((lookup, item) => {
    lookup[item.id] = item;
    return lookup;
  }, {});
}

export function isValidMoveTarget(
  lookup: OutlineLookup,
  sourceId: string,
  targetId: string,
): boolean {
  const sourceItem = lookup[sourceId];
  const targetItem = lookup[targetId];

  if (!sourceItem || !targetItem) {
    return false;
  }

  if (sourceItem.id === targetItem.id) {
    return false;
  }

  return !targetItem.ancestorIds.includes(sourceId);
}

export function getAvailableMovePositions(
  lookup: OutlineLookup,
  sourceId: string,
  targetId: string,
): OutlineMovePosition[] {
  const sourceItem = lookup[sourceId];
  const targetItem = lookup[targetId];

  if (!sourceItem || !targetItem || !isValidMoveTarget(lookup, sourceId, targetId)) {
    return [];
  }

  const positions: OutlineMovePosition[] = [];

  const isAppendToCurrentParentNoOp =
    targetItem.id === sourceItem.parentId &&
    sourceItem.indexInParent === targetItem.childCount - 1;

  if (!isAppendToCurrentParentNoOp) {
    positions.push('inside');
  }

  const isBeforeNoOp =
    sourceItem.parentId === targetItem.parentId &&
    targetItem.indexInParent === sourceItem.indexInParent + 1;

  if (!isBeforeNoOp) {
    positions.push('before');
  }

  const isAfterNoOp =
    sourceItem.parentId === targetItem.parentId &&
    targetItem.indexInParent === sourceItem.indexInParent - 1;

  if (!isAfterNoOp) {
    positions.push('after');
  }

  return positions;
}

export function resolveMoveTarget(
  lookup: OutlineLookup,
  sourceId: string,
  targetId: string,
  position: OutlineMovePosition,
): OutlineMoveTarget | null {
  const sourceItem = lookup[sourceId];
  const targetItem = lookup[targetId];

  if (!sourceItem || !targetItem || !isValidMoveTarget(lookup, sourceId, targetId)) {
    return null;
  }

  if (position === 'inside') {
    return {
      parentId: targetItem.id,
      insertIndex: -1,
      expandTargetId: targetItem.id,
    };
  }

  let insertIndex =
    position === 'before' ? targetItem.indexInParent : targetItem.indexInParent + 1;

  // Moving inside the same parent removes the source first, so later sibling indexes shift left.
  if (
    sourceItem.parentId === targetItem.parentId &&
    sourceItem.indexInParent < targetItem.indexInParent
  ) {
    insertIndex -= 1;
  }

  return {
    parentId: targetItem.parentId,
    insertIndex: Math.max(insertIndex, 0),
  };
}

export function parsePageNumberInput(
  value: string,
  pageCount: number,
): number | null {
  const parsedValue = Number.parseInt(value.trim(), 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return null;
  }

  if (pageCount > 0 && parsedValue > pageCount) {
    return null;
  }

  return parsedValue - 1;
}