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
import type { CertificateSession } from "../models/CertificateSession";
import { SignatureActionBar } from "./SignatureActionBar";
import { SignatureButton } from "./SignatureButton";
import { SignatureTextField } from "./SignatureTextField";
import { signatureStyles as s } from "./signatureStyles";

type Props = {
  path: string;
  onCancel: () => void;
  onLoad: (path: string, password: string) => Promise<CertificateSession>;
  onSelected: (value: CertificateSession) => void;
  onBusyChange?: (busy: boolean) => void;
};

/** Asks for a password only after a file exists; wrong passwords keep the dialog open. */
export function CertificatePasswordDialog({
  path,
  onCancel,
  onLoad,
  onSelected,
  onBusyChange,
}: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
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
    if (!password) {
      if (active.current) setError("Enter the certificate password.");
      return;
    }
    lock.current = true;
    setBusy(true);
    onBusyChange?.(true);
    setError(null);
    try {
      const certificate = await onLoad(path, password);
      if (active.current) onSelected(certificate);
    } catch {
      if (active.current)
        setError(
          "Incorrect certificate password, or the certificate could not be loaded."
        );
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
        <Text style={s.title}>Certificate password</Text>
        <ScrollView
          style={s.scroll}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.body}
        >
          <Text style={s.text}>{path.split("/").pop()}</Text>
          <SignatureTextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!busy}
            onSubmitEditing={() => submit()}
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
            label="Verify"
            onPress={() => submit()}
            disabled={busy}
          />
        </SignatureActionBar>
      </View>
    </View>
  );
}
