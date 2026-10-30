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
import { SignatureButton } from "./SignatureButton";
import { signatureStyles as s } from "./signatureStyles";

/** Keeps file actions on the trailing edge while long filenames shrink within the row. */
export function SignatureFileChoice({
  label,
  path,
  disabled,
  onChoose,
  onClear,
}: {
  label: string;
  path?: string;
  disabled: boolean;
  onChoose: () => void;
  onClear: () => void;
}) {
  return (
    <View style={s.fileChoice}>
      <Text
        numberOfLines={2}
        ellipsizeMode="middle"
        accessibilityLabel={`${label}: ${path ?? "not selected"}`}
        style={s.fileLabel}
      >
        {label}: {path?.split("/").pop() ?? "not selected"}
      </Text>
      <SignatureButton
        quiet
        label="Choose"
        accessibilityLabel={`Choose ${label.toLowerCase()}`}
        style={s.compactButton}
        disabled={disabled}
        onPress={onChoose}
      />
      {path ? (
        <SignatureButton
          quiet
          label="Clear"
          accessibilityLabel={`Clear ${label.toLowerCase()}`}
          style={s.compactButton}
          disabled={disabled}
          onPress={onClear}
        />
      ) : null}
    </View>
  );
}
