/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from "react";
import { Pressable, Text, View } from "react-native";
import { signatureStyles as s } from "./signatureStyles";

/** Shared sheet heading with a compact close control and a full accessible touch target. */
export function SignatureHeader({
  title,
  onClose,
  disabled = false,
}: {
  title: string;
  onClose: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={s.header}>
      <Text numberOfLines={1} style={[s.title, s.headerTitle]}>
        {title}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        disabled={disabled}
        onPress={onClose}
        style={s.closeButton}
      >
        <Text style={s.closeText}>×</Text>
      </Pressable>
    </View>
  );
}
