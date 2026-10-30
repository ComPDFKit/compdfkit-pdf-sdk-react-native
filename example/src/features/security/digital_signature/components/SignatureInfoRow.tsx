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
import { signatureStyles as s } from "./signatureStyles";

/** Keeps long distinguished names and diagnostics selectable and wrapped. */
export function SignatureInfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <Text selectable style={s.text}>
        {value === undefined || value === "" ? "Unavailable" : String(value)}
      </Text>
    </View>
  );
}
