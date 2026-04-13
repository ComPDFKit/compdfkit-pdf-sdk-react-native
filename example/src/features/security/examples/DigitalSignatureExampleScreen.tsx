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
  hideDigitalSignatureStatus,
  verifyDigitalSignature,
} from '../shared/securityActions';
import { SecurityExampleScaffold } from '../shared/SecurityExampleScaffold';

export default function DigitalSignatureExampleScreen() {
  return (
    <SecurityExampleScaffold
      title="Digital Signature"
      subtitle="Verify signatures in the current document and hide the status panel when needed."
      actions={[
        {
          key: 'verify-digital-signature',
          label: 'Verify Signature',
          onPress: verifyDigitalSignature,
        },
        {
          key: 'hide-digital-signature-status',
          label: 'Hide Status View',
          onPress: hideDigitalSignatureStatus,
        },
      ]}
    />
  );
}