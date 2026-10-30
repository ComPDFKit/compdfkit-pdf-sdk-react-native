/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { signatureStyles as s } from "./signatureStyles";

/** Persistent labels make certificate and signature fields readable after typing. */
export function SignatureTextField({
  label,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#667085"
        autoCorrect={false}
        secureTextEntry={false}
        {...props}
        style={[s.input, props.style]}
      />
    </View>
  );
}
