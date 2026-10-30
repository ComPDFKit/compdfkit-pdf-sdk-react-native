/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Text, View } from "react-native";
import type { CPDFSignatureAppearance } from "@compdfkit_pdf_sdk/react_native";
import { SignatureFileChoice } from "./SignatureFileChoice";
import { SignatureTextField } from "./SignatureTextField";
import { SignatureSwitch } from "./SignatureSwitch";
import { SignatureButton } from "./SignatureButton";
import { signatureStyles as s } from "./signatureStyles";

/** Edits only appearance values; the caller supplies the file selection boundary. */
export function SignatureAppearanceEditor({
  value,
  onChange,
  onPickImage,
  onChooseColor,
  onBusyChange,
}: {
  value: CPDFSignatureAppearance;
  onChange: Dispatch<SetStateAction<CPDFSignatureAppearance>>;
  onPickImage: () => Promise<string | null>;
  onChooseColor: (key: "textColor" | "contentColor") => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locked = useRef(false);
  const active = useRef(true);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const pick = async (key: "logoPath" | "imagePath") => {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    onBusyChange(true);
    setError(null);
    try {
      const path = await onPickImage();
      if (path && active.current)
        // File copying can finish after the user edits another appearance field.
        onChange((latest) => ({
          ...latest,
          [key]: path,
          ...(key === "imagePath" ? { drawOnlyContent: false } : {}),
        }));
    } catch {
      if (active.current) setError("The image could not be selected.");
    } finally {
      locked.current = false;
      if (active.current) {
        setBusy(false);
        onBusyChange(false);
      }
    }
  };
  return (
    <View style={s.panel}>
      <Text style={s.panelTitle}>Appearance</Text>
      <SignatureTextField
        label="Text override (optional)"
        value={value.text ?? ""}
        onChangeText={(text) => onChange({ ...value, text })}
      />
      <SignatureTextField
        label="Content override (optional)"
        multiline
        value={typeof value.content === "string" ? value.content : ""}
        onChangeText={(content) => onChange({ ...value, content })}
      />
      <View style={s.actionRow}>
        <SignatureButton
          outline
          style={s.flex}
          label="Text color"
          disabled={busy}
          leading={
            <View
              style={[
                s.colorSwatch,
                {
                  backgroundColor: `#${(value.textColor ?? "#FF000000").slice(
                    3
                  )}`,
                },
              ]}
            />
          }
          onPress={() => {
            if (!locked.current) onChooseColor("textColor");
          }}
        />
        <SignatureButton
          outline
          style={s.flex}
          label="Content color"
          disabled={busy}
          leading={
            <View
              style={[
                s.colorSwatch,
                {
                  backgroundColor: `#${(
                    value.contentColor ?? "#FF000000"
                  ).slice(3)}`,
                },
              ]}
            />
          }
          onPress={() => {
            if (!locked.current) onChooseColor("contentColor");
          }}
        />
      </View>
      <SignatureSwitch
        label="Draw logo"
        value={value.drawLogo ?? false}
        onChange={(drawLogo) => onChange({ ...value, drawLogo })}
      />
      <SignatureSwitch
        label="Draw only content"
        value={value.drawOnlyContent ?? false}
        onChange={(drawOnlyContent) => onChange({ ...value, drawOnlyContent })}
      />
      <SignatureSwitch
        label="Align content left"
        value={value.contentAlignLeft ?? false}
        onChange={(contentAlignLeft) =>
          onChange({ ...value, contentAlignLeft })
        }
      />
      {(["logoPath", "imagePath"] as const).map((key) => (
        <SignatureFileChoice
          key={key}
          label={key === "logoPath" ? "Logo file" : "Image file"}
          path={value[key]}
          disabled={busy}
          onChoose={() => pick(key)}
          onClear={() =>
            onChange({
              ...value,
              [key]: undefined,
              ...(key === "imagePath" ? { drawOnlyContent: true } : {}),
            })
          }
        />
      ))}
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}
