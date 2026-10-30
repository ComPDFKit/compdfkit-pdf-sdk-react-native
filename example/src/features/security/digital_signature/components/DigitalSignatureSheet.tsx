/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import {
  CPDFSignaturePermission,
  isTimestampServerUrl,
  type CPDFSignatureAppearance,
} from "@compdfkit_pdf_sdk/react_native";
import type { DigitalSignatureController } from "../DigitalSignatureController";
import type { CertificateSession } from "../models/CertificateSession";
import { signatureContent } from "../utils/signatureAppearance";
import { SignatureHeader } from "./SignatureHeader";
import { SignatureColorDialog } from "./SignatureColorDialog";
import { SignatureActionBar } from "./SignatureActionBar";
import { SignatureCertificateOption } from "./SignatureCertificateOption";
import { SignatureButton } from "./SignatureButton";
import { SignatureTextField } from "./SignatureTextField";
import { SignatureChoiceField } from "./SignatureChoiceField";
import { SignatureSwitch } from "./SignatureSwitch";
import { SelectedCertificateCard } from "./SelectedCertificateCard";
import { SignaturePreview } from "./SignaturePreview";
import { SignatureAppearanceEditor } from "./SignatureAppearanceEditor";
import { CertificatePasswordDialog } from "./CertificatePasswordDialog";
import { CreateCertificateDialog } from "./CreateCertificateDialog";
import { signatureStyles as s } from "./signatureStyles";

/** Collects a typed signing request; certificate subdialogs reuse a single modal host on iOS. */
export function DigitalSignatureSheet({
  fieldName,
  controller,
  busy,
  error,
}: {
  fieldName: string;
  controller: DigitalSignatureController;
  busy: boolean;
  error: string | null;
}) {
  const [certificate, setCertificate] = useState<CertificateSession | null>(
    null
  );
  const [name, setName] = useState("ComPDF React Native Example");
  const [reason, setReason] = useState("Approved document");
  const [location, setLocation] = useState("React Native Example");
  const [permissions, setPermissions] = useState<CPDFSignaturePermission>(
    CPDFSignaturePermission.FILL_AND_SIGN
  );
  const [appearance, setAppearance] = useState<CPDFSignatureAppearance>({
    text: "",
    content: "",
    textColor: "#FF000000",
    contentColor: "#FF000000",
    drawLogo: false,
    drawOnlyContent: false,
    contentAlignLeft: false,
  });
  const [embedTimestamp, setEmbedTimestamp] = useState(false);
  const [tsa, setTsa] = useState("http://timestamp.digicert.com");
  const [localError, setLocalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const imageLoading = useRef(false);
  const imageBusyChanged = (value: boolean) => {
    imageLoading.current = value;
    setLoading(value);
  };
  const [dialog, setDialog] = useState<
    | { type: "none" }
    | { type: "password"; path: string }
    | { type: "create" }
    | { type: "color"; key: "textColor" | "contentColor" }
  >({ type: "none" });
  useEffect(() => {
    controller.setSubdialogClose(
      dialog.type === "none" && !loading
        ? null
        : () => {
            if (!loading) setDialog({ type: "none" });
          }
    );
    return () => controller.setSubdialogClose(null);
  }, [controller, dialog.type, loading]);
  const selected = (value: CertificateSession) => {
    setCertificate(value);
    setDialog({ type: "none" });
    setLocalError(null);
  };
  const choose = async () => {
    if (loading) return;
    setLoading(true);
    setLocalError(null);
    try {
      const path = await controller.files.select("certificate");
      if (path) setDialog({ type: "password", path });
    } catch {
      setLocalError("The certificate could not be selected.");
    } finally {
      setLoading(false);
    }
  };
  const submit = () => {
    if (busy || loading || imageLoading.current) return;
    if (!certificate) {
      setLocalError("Select or create a certificate first.");
      return;
    }
    if (embedTimestamp && !isTimestampServerUrl(tsa.trim())) {
      setLocalError("Enter an http or https TSA URL.");
      return;
    }
    setLocalError(null);
    controller.sign({
      certificate,
      name: name.trim(),
      reason: reason.trim(),
      location: location.trim(),
      permissions,
      appearance: {
        ...appearance,
        text: appearance.text?.trim() || name.trim(),
        content:
          typeof appearance.content === "string" && appearance.content.trim()
            ? appearance.content.trim()
            : signatureContent(
                name,
                reason,
                location,
                certificate.info.subject
              ),
      },
      timestampServerUrl: embedTimestamp ? tsa.trim() : undefined,
    });
  };
  if (dialog.type === "color")
    return (
      <SignatureColorDialog
        value={appearance[dialog.key] ?? "#FF000000"}
        onCancel={() => setDialog({ type: "none" })}
        onSelected={(color) => {
          setAppearance({ ...appearance, [dialog.key]: color });
          setDialog({ type: "none" });
        }}
      />
    );
  if (dialog.type === "password")
    return (
      <CertificatePasswordDialog
        path={dialog.path}
        onCancel={() => setDialog({ type: "none" })}
        onLoad={(path, password) =>
          controller.certificates.load(path, password)
        }
        onBusyChange={setLoading}
        onSelected={selected}
      />
    );
  if (dialog.type === "create")
    return (
      <CreateCertificateDialog
        onCancel={() => setDialog({ type: "none" })}
        onCreate={(request) => controller.certificates.create(request)}
        onBusyChange={setLoading}
        onSelected={selected}
      />
    );
  return (
    <View style={s.card}>
      <SignatureHeader
        title={`Sign ${fieldName || "Signature field"}`}
        onClose={controller.closeDialog}
        disabled={busy || loading}
      />
      <ScrollView
        style={s.scroll}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={s.body}
      >
        <Text style={s.section}>Certificate</Text>
        <View style={s.actionRow}>
          <SignatureCertificateOption
            title="Choose existing"
            subtitle="PKCS#12 file"
            disabled={busy || loading}
            onPress={() => choose()}
          />
          <SignatureCertificateOption
            title="Create certificate"
            subtitle="Generate a new PKCS#12"
            create
            disabled={busy || loading}
            onPress={() => setDialog({ type: "create" })}
          />
        </View>
        {loading ? <ActivityIndicator /> : null}
        <SelectedCertificateCard certificate={certificate} />
        {localError || error ? (
          <Text style={s.error}>{localError || error}</Text>
        ) : null}
        <Text style={s.section}>Digital signature information</Text>
        <SignatureTextField label="Name" value={name} onChangeText={setName} />
        <SignatureTextField
          label="Reason"
          value={reason}
          onChangeText={setReason}
        />
        <SignatureTextField
          label="Location"
          value={location}
          onChangeText={setLocation}
        />
        <SignatureChoiceField
          label="Permission after signing"
          value={permissions}
          options={[
            { value: 1, label: "No changes" },
            { value: 2, label: "Fill and sign" },
            { value: 3, label: "Annotations, fill and sign" },
          ]}
          onChange={setPermissions}
        />
        <SignatureAppearanceEditor
          value={appearance}
          onChange={setAppearance}
          onPickImage={() => controller.files.select("image")}
          onBusyChange={imageBusyChanged}
          onChooseColor={(key) => setDialog({ type: "color", key })}
        />
        <Text style={s.section}>Timestamp</Text>
        <SignatureSwitch
          label="Embed RFC 3161 timestamp (network required)"
          value={embedTimestamp}
          onChange={setEmbedTimestamp}
        />
        {embedTimestamp ? (
          <SignatureTextField
            label="Timestamp server (TSA) URL"
            value={tsa}
            onChangeText={setTsa}
            autoCapitalize="none"
            keyboardType="url"
          />
        ) : null}
        <SignaturePreview name={name} reason={reason} location={location} />
      </ScrollView>
      <SignatureActionBar>
        <SignatureButton
          style={s.flex}
          label="Sign and open PDF"
          disabled={busy || loading}
          onPress={submit}
        />
      </SignatureActionBar>
    </View>
  );
}
