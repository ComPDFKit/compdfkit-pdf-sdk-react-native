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
  hideSearchTextView,
  showSearchTextView,
} from '../shared/searchNavigationActions';
import { SearchNavigationExampleScaffold } from '../shared/SearchNavigationExampleScaffold';

export default function ShowHideSearchExampleScreen() {
  return (
    <SearchNavigationExampleScaffold
      title="Show/Hide Search View"
      subtitle="Toggle the built-in SDK search panel without leaving the reader."
      actions={[
        {
          key: 'show-search-view',
          label: 'Show Search View',
          onPress: showSearchTextView,
        },
        {
          key: 'hide-search-view',
          label: 'Hide Search View',
          onPress: hideSearchTextView,
        },
      ]}
    />
  );
}