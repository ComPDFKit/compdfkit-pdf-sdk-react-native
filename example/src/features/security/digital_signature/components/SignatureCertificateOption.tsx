/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from "react";
import { Image, Pressable, Text } from "react-native";
import { signatureStyles as s } from "./signatureStyles";

/** Keeps each certificate action and its caption in one equal-height, fully tappable card. */
export function SignatureCertificateOption({
  title,
  subtitle,
  create = false,
  disabled,
  onPress,
}: {
  title: string;
  subtitle: string;
  create?: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.certificateOption,
        disabled && s.disabled,
        pressed && !disabled && s.pressed,
      ]}
    >
      <Image
        accessible={false}
        source={
          create
            ? require("../../../../../assets/ic_form_sign.png")
            : require("../../../../../assets/ic_viewer.png")
        }
        style={s.certificateIcon}
      />
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={s.certificateOptionTitle}
      >
        {title}
      </Text>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={s.certificateOptionSubtitle}
      >
        {subtitle}
      </Text>
    </Pressable>
  );
}
