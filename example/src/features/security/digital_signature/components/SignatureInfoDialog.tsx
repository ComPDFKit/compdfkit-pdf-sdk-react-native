/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import type { SignatureDetails } from "../models/SignatureDetails";
import { booleanLabel } from "../utils/signatureAppearance";
import { SignatureInfoRow } from "./SignatureInfoRow";
import { SignatureVerificationSection } from "./SignatureVerificationSection";
import { SignatureLtvSection } from "./SignatureLtvSection";
import { SignatureHeader } from "./SignatureHeader";
import { SignatureActionBar } from "./SignatureActionBar";
import { SignatureButton } from "./SignatureButton";
import { signatureStyles as s } from "./signatureStyles";

/** Presents one field's refreshed metadata and exposes explicit trust and prolongation actions. */
export function SignatureInfoDialog({
  details,
  onClose,
  onTrust,
  onAddLtv,
  busy,
  error,
}: {
  details: SignatureDetails;
  onClose: () => void;
  onTrust?: () => void;
  onAddLtv: (append: boolean) => void;
  busy: boolean;
  error: string | null;
}) {
  const [append, setAppend] = useState(false);
  const info = details.signature;
  const certificate = info.signers[0]?.certificates[0];
  const result = details.verification;
  const status = !result
    ? "Verification unavailable"
    : result.signatureValid && result.documentUnmodified
    ? "Valid signature"
    : "Review required";

  return (
    <View style={[s.card, s.infoCard]}>
      <SignatureHeader
        title="Signature information"
        onClose={onClose}
        disabled={busy}
      />
      <ScrollView style={s.scroll} contentContainerStyle={s.body}>
        <View style={s.preview}>
          <Text style={s.text}>{status}</Text>
        </View>
        <SignatureInfoRow label="Field" value={info.fieldName} />
        <SignatureInfoRow label="Signer" value={info.name} />
        <SignatureInfoRow label="Signed date" value={info.date} />
        <SignatureInfoRow label="Reason" value={info.reason} />
        <SignatureInfoRow label="Location" value={info.location} />
        <SignatureInfoRow
          label="Permission"
          value={
            info.permissions === undefined
              ? undefined
              : ["No changes", "Fill and sign", "Annotations, fill and sign"][
                  info.permissions - 1
                ]
          }
        />
        <SignatureInfoRow label="Filter" value={info.filter} />
        <SignatureInfoRow label="SubFilter" value={info.subFilter} />
        <Text style={s.section}>Certificate</Text>
        <SignatureInfoRow label="Subject" value={certificate?.subject} />
        <SignatureInfoRow label="Issuer" value={certificate?.issuer} />
        <SignatureInfoRow label="Valid to" value={certificate?.validTo} />
        <SignatureInfoRow
          label="Trusted"
          value={booleanLabel(certificate?.isTrusted)}
        />
        <SignatureVerificationSection details={details} />
        <SignatureLtvSection
          details={details}
          append={append}
          onAppend={setAppend}
          onAdd={() => onAddLtv(append)}
          busy={busy}
        />
        {error ? <Text style={s.error}>{error}</Text> : null}
      </ScrollView>
      <SignatureActionBar>
        <SignatureButton
          style={s.flex}
          outline
          label="Close"
          disabled={busy}
          onPress={onClose}
        />
        {onTrust && certificate?.isTrusted !== true ? (
          <SignatureButton
            style={s.flex}
            label="Trust certificate"
            disabled={busy}
            onPress={onTrust}
          />
        ) : null}
      </SignatureActionBar>
    </View>
  );
}
