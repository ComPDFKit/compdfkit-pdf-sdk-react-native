/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';

import { removeDocumentPassword } from '../shared/securityActions';
import { SecurityExampleScaffold } from '../shared/SecurityExampleScaffold';

export default function RemovePasswordExampleScreen() {
  return (
    <SecurityExampleScaffold
      title="Remove Password"
      subtitle="Remove existing document password protection from the active file."
      actions={[
        {
          key: 'remove-password',
          label: 'Remove Password',
          onPress: removeDocumentPassword,
        },
      ]}
    />
  );
}