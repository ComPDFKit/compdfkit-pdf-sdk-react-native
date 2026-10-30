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
import { SignatureActionBar } from "./SignatureActionBar";
import { SignatureButton } from "./SignatureButton";
import { signatureStyles as s } from "./signatureStyles";

const colors = [
  { value: "#FF000000", label: "Black" },
  { value: "#FFFFFFFF", label: "White" },
  { value: "#FF1460F3", label: "Blue" },
  { value: "#FF16803C", label: "Green" },
  { value: "#FFD92D20", label: "Red" },
  { value: "#FF6B7280", label: "Gray" },
];

/** The same six-color palette as Flutter, presented within the existing modal host. */
export function SignatureColorDialog({
  value,
  onSelected,
  onCancel,
}: {
  value: string;
  onSelected: (color: string) => void;
  onCancel: () => void;
}) {
  return (
    <View style={s.centerContainer}>
      <View style={s.dialog}>
        <Text style={s.title}>Choose color</Text>
        <View style={s.palette}>
          {colors.map((color) => (
            <View key={color.value} style={s.paletteItem}>
              <Pressable
                accessibilityRole="radio"
                accessibilityLabel={color.label}
                accessibilityState={{ checked: color.value === value }}
                onPress={() => onSelected(color.value)}
                style={[
                  s.colorChoice,
                  color.value === value && s.selectedColor,
                  { backgroundColor: `#${color.value.slice(3)}` },
                ]}
              />
              <Text style={s.label}>{color.label}</Text>
            </View>
          ))}
        </View>
        <SignatureActionBar>
          <SignatureButton
            style={s.flex}
            outline
            label="Cancel"
            onPress={onCancel}
          />
        </SignatureActionBar>
      </View>
    </View>
  );
}
