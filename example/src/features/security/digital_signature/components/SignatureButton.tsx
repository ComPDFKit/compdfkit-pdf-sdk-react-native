/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { type ReactNode } from "react";
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { signatureStyles as s } from "./signatureStyles";

/** A labeled action with consistent disabled and accessibility behavior. */
export function SignatureButton({
  label,
  onPress,
  disabled = false,
  outline = false,
  quiet = false,
  leading,
  style,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  outline?: boolean;
  quiet?: boolean;
  leading?: ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.buttonBase,
        quiet ? s.quietButton : outline ? s.outline : s.button,
        style,
        disabled && s.disabled,
        pressed && !disabled && s.pressed,
      ]}
    >
      <View style={s.buttonContent}>
        {leading}
        <Text
          style={
            quiet
              ? s.quietButtonText
              : outline
              ? s.secondaryButtonText
              : s.buttonText
          }
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
