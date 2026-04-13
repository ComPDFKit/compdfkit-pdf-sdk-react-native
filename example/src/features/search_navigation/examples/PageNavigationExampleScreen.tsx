/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';

import {
  jumpToFirstPage,
  jumpToLastPage,
  jumpToNextPage,
  jumpToPreviousPage,
} from '../shared/searchNavigationActions';
import { SearchNavigationExampleScaffold } from '../shared/SearchNavigationExampleScaffold';

export default function PageNavigationExampleScreen() {
  return (
    <SearchNavigationExampleScaffold
      title="Page Navigation"
      subtitle="Jump across the document with direct first, previous, next, and last page actions."
      actions={[
        {
          key: 'jump-first-page',
          label: 'First Page',
          onPress: jumpToFirstPage,
        },
        {
          key: 'jump-previous-page',
          label: 'Previous Page',
          onPress: jumpToPreviousPage,
        },
        {
          key: 'jump-next-page',
          label: 'Next Page',
          onPress: jumpToNextPage,
        },
        {
          key: 'jump-last-page',
          label: 'Last Page',
          onPress: jumpToLastPage,
        },
      ]}
    />
  );
}