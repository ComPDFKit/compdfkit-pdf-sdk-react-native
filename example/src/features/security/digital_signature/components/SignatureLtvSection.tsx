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
import { booleanLabel, timestampLabel } from "../utils/signatureAppearance";
import { SignatureInfoRow } from "./SignatureInfoRow";
import { SignatureSwitch } from "./SignatureSwitch";
import { SignatureButton } from "./SignatureButton";
import { signatureStyles as s } from "./signatureStyles";

/** Shows document-level evidence independently of signature validity and trust. */
export function SignatureLtvSection({
  details,
  append,
  onAppend,
  onAdd,
  busy,
}: {
  details: SignatureDetails;
  append: boolean;
  onAppend: (value: boolean) => void;
  onAdd: () => void;
  busy: boolean;
}) {
  const ready = details.readiness;
  return (
    <View style={s.panel}>
      <Text style={s.panelTitle}>Timestamp and LTV</Text>
      <SignatureInfoRow
        label="Signing time source"
        value={timestampLabel(details.verification?.timestampSource)}
      />
      <SignatureInfoRow
        label="Embedded timestamp valid"
        value={booleanLabel(details.verification?.embeddedTimestampValid)}
      />
      <SignatureInfoRow
        label="LTV enabled (document)"
        value={booleanLabel(details.verification?.ltvEnabled)}
      />
      <SignatureInfoRow
        label="DSS material"
        value={
          ready
            ? `Certificates: ${ready.certificatesCount}; OCSP: ${ready.ocspResponsesCount}; CRLs: ${ready.crlsCount}; VRI: ${ready.vriEntriesCount}`
            : undefined
        }
      />
      {ready?.missingMaterials.length ? (
        <SignatureInfoRow
          label="Missing LTV material"
          value={ready.missingMaterials.join("\n")}
        />
      ) : null}
      {ready ? (
        <SignatureInfoRow
          label="LTV readiness"
          value={`${
            ready.success ? booleanLabel(ready.ltvReady) : "Unavailable"
          } (${ready.profileHint})`}
        />
      ) : null}
      {ready?.errors.map((issue, index) => (
        <Text key={`error-${index}`} style={s.error}>
          {issue.code}: {issue.message}
        </Text>
      ))}
      {ready?.warnings.map((issue, index) => (
        <Text key={`warning-${index}`} style={s.text}>
          {issue.code}: {issue.message}
        </Text>
      ))}
      {details.readinessError ? (
        <Text style={s.error}>{details.readinessError}</Text>
      ) : null}
      <SignatureSwitch
        label="Also append a document timestamp (LTA)"
        value={append}
        onChange={onAppend}
        disabled={busy}
      />
      <SignatureButton
        label="Add LTV with a trusted root (PEM)"
        onPress={onAdd}
        disabled={busy}
      />
    </View>
  );
}
