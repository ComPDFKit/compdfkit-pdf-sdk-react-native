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
import type { CPDFCertificateSubject } from "@compdfkit_pdf_sdk/react_native";
import type { CertificateSession } from "../models/CertificateSession";
import type { CertificateRequest } from "../models/SignatureRequest";
import { SignatureTextField } from "./SignatureTextField";
import { SignatureActionBar } from "./SignatureActionBar";
import { SignatureButton } from "./SignatureButton";
import { signatureStyles as s } from "./signatureStyles";

const fields: { key: keyof CPDFCertificateSubject; label: string }[] = [
  { key: "commonName", label: "Common name" },
  { key: "country", label: "Country" },
  { key: "state", label: "State / province" },
  { key: "locality", label: "Locality / city" },
  { key: "organization", label: "Organization" },
  { key: "organizationalUnit", label: "Organizational unit" },
  { key: "email", label: "Email" },
];

/** Creates a PKCS#12 certificate with user-supplied identity and an in-memory password. */
export function CreateCertificateDialog({
  onCancel,
  onCreate,
  onSelected,
  onBusyChange,
}: {
  onCancel: () => void;
  onCreate: (request: CertificateRequest) => Promise<CertificateSession>;
  onSelected: (value: CertificateSession) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [subject, setSubject] = useState<CPDFCertificateSubject>({
    commonName: "",
  });
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const submit = async () => {
    if (lock.current) return;
    if (!subject.commonName.trim() || !password) {
      if (active.current)
        setError("Enter a common name and a certificate password.");
      return;
    }
    lock.current = true;
    setBusy(true);
    onBusyChange?.(true);
    setError(null);
    try {
      const trimmed = Object.fromEntries(
        Object.entries(subject).map(([key, value]) => [key, value.trim()])
      );
      const certificate = await onCreate({
        subject: { ...trimmed, commonName: subject.commonName.trim() },
        password,
      });
      if (active.current) onSelected(certificate);
    } catch {
      if (active.current) setError("The certificate could not be created.");
    } finally {
      lock.current = false;
      if (active.current) {
        setBusy(false);
        onBusyChange?.(false);
      }
    }
  };
  return (
    <View style={s.centerContainer}>
      <View style={s.dialog}>
        <Text style={s.title}>Create certificate</Text>
        <ScrollView
          style={s.scroll}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.body}
        >
          {fields.map((field) => (
            <SignatureTextField
              key={field.key}
              label={field.label}
              value={subject[field.key] ?? ""}
              onChangeText={(value) =>
                setSubject({ ...subject, [field.key]: value })
              }
              autoCapitalize={field.key === "email" ? "none" : "words"}
              editable={!busy}
            />
          ))}
          <SignatureTextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!busy}
          />
          {error ? <Text style={s.error}>{error}</Text> : null}
          {busy ? <ActivityIndicator /> : null}
        </ScrollView>
        <SignatureActionBar>
          <SignatureButton
            style={s.flex}
            outline
            label="Cancel"
            onPress={onCancel}
            disabled={busy}
          />
          <SignatureButton
            style={s.flex}
            label="Create"
            onPress={() => submit()}
            disabled={busy}
          />
        </SignatureActionBar>
      </View>
    </View>
  );
}
