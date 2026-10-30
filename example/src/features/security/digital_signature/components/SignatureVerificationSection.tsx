/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from "react";
import { Text, View } from "react-native";
import type { SignatureDetails } from "../models/SignatureDetails";
import { booleanLabel } from "../utils/signatureAppearance";
import { SignatureInfoRow } from "./SignatureInfoRow";
import { signatureStyles as s } from "./signatureStyles";

/** Verification failures and unavailable reports are distinct states. */
export function SignatureVerificationSection({
  details,
}: {
  details: SignatureDetails;
}) {
  const result = details.verification;
  return (
    <View style={s.panel}>
      <Text style={s.panelTitle}>Verification</Text>
      <SignatureInfoRow
        label="Signature valid"
        value={booleanLabel(result?.signatureValid)}
      />
      <SignatureInfoRow
        label="Document unmodified"
        value={booleanLabel(result?.documentUnmodified)}
      />
      <SignatureInfoRow
        label="Certificate trusted"
        value={booleanLabel(result?.certificateTrusted)}
      />
      <SignatureInfoRow
        label="Certificate not expired"
        value={booleanLabel(
          result === undefined ? undefined : !result.certificateExpired
        )}
      />
      <SignatureInfoRow
        label="Signer verified"
        value={booleanLabel(details.signature.signers[0]?.signatureVerified)}
      />
      {details.verificationError ? (
        <Text style={s.error}>{details.verificationError}</Text>
      ) : null}
    </View>
  );
}
