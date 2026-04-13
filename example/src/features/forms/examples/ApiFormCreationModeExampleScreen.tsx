/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';

import { FormCreationManagedScreen } from '../shared/FormCreationManagedScreen';

export default function ApiFormCreationModeExampleScreen() {
  return (
    <FormCreationManagedScreen
      title="API Form Creation Mode"
      subtitle="Enter form creation mode via API and create fields from the bottom toolbar."
      formToolbarVisible={false}
      showCreationToolbar={true}
    />
  );
}