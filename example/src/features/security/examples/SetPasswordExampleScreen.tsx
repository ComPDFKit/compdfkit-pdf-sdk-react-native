/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';

import { setDocumentPassword } from '../shared/securityActions';
import { SecurityExampleScaffold } from '../shared/SecurityExampleScaffold';

export default function SetPasswordExampleScreen() {
  return (
    <SecurityExampleScaffold
      title="Set Password"
      subtitle="Apply owner and user passwords with AES128 encryption."
      actions={[
        {
          key: 'set-password',
          label: 'Set Password',
          onPress: setDocumentPassword,
        },
      ]}
    />
  );
}