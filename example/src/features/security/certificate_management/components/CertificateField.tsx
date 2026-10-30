/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { certificateColors as colors, certificateStyles as text } from '../certificateTheme';
import { CertificateIcon, type CertificateIconName } from './CertificateIcon';

type Props = TextInputProps & {
  label: string;
  error?: string | null;
  leadingIcon?: CertificateIconName;
  accessory?: { label: string; icon: CertificateIconName; onPress: () => void; disabled?: boolean };
};

/** Explicit labels remain visible after entry; inline errors are announced by screen readers. */
export const CertificateField = forwardRef<TextInput, Props>(function CertificateFieldInput(
  { label, error, leadingIcon, accessory, style, ...props },
  ref,
) {
  return (
    <View style={styles.field}>
      <Text style={text.label}>{label}</Text>
      <View style={[styles.inputWrap, !!error && styles.invalid]}>
        {leadingIcon ? <CertificateIcon name={leadingIcon} color={colors.muted} /> : null}
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={colors.muted}
          autoCorrect={false}
          autoCapitalize="none"
          {...props}
          style={[styles.input, style]}
        />
        {accessory ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessory.label}
            disabled={accessory.disabled}
            onPress={accessory.onPress}
            style={styles.accessory}
          >
            <CertificateIcon name={accessory.icon} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  field: { gap: 6 },
  inputWrap: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    paddingLeft: 12,
    backgroundColor: '#FBFCFE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 12,
    color: colors.text,
    paddingVertical: 10,
    paddingRight: 12,
  },
  accessory: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  invalid: { borderColor: colors.error },
  error: { color: colors.error, fontSize: 12, lineHeight: 17 },
});
