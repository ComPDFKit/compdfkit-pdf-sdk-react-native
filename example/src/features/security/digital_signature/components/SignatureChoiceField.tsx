/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from "react";
import { Keyboard, Pressable, Text, View } from "react-native";
import { signatureStyles as s } from "./signatureStyles";

/** An accessible selection field; opening it dismisses the keyboard. */
export function SignatureChoiceField<T extends number | string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Text style={s.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ expanded: open }}
        style={[s.input, s.selection]}
        onPress={() => {
          Keyboard.dismiss();
          setOpen(!open);
        }}
      >
        <Text style={[s.text, s.flex]}>
          {options.find((item) => item.value === value)?.label ?? String(value)}
        </Text>
        <Text accessible={false} style={s.chevron}>
          ▾
        </Text>
      </Pressable>
      {open ? (
        <View style={s.panel}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ checked: option.value === value }}
              style={[s.buttonBase, s.outline]}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              <Text style={s.text}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
