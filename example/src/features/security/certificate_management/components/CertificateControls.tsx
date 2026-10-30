/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { certificateColors as colors, certificateStyles as text } from '../certificateTheme';
import { CertificateIcon, type CertificateIconName } from './CertificateIcon';

export function CertificatePanel({
  children,
  style,
}: React.PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.panel, style]}>{children}</View>;
}

export function CertificateSection({
  title,
  description,
  children,
}: React.PropsWithChildren<{ title: string; description?: string }>) {
  return (
    <View style={styles.section}>
      <View style={styles.heading}>
        <Text accessibilityRole="header" style={text.section}>
          {title}
        </Text>
        {description ? <Text style={text.description}>{description}</Text> : null}
      </View>
      {children}
    </View>
  );
}

export function CertificateButton({
  label,
  onPress,
  icon,
  busy = false,
  outlined = false,
}: {
  label: string;
  onPress?: () => void;
  icon?: CertificateIconName;
  busy?: boolean;
  outlined?: boolean;
}) {
  const disabled = busy || !onPress;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, busy }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        outlined && styles.outlined,
        (disabled || pressed) && styles.dimmed,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={outlined ? colors.primary : colors.surface} />
      ) : icon ? (
        <CertificateIcon name={icon} color={outlined ? colors.primary : colors.surface} />
      ) : null}
      <Text style={[styles.buttonLabel, outlined && styles.outlinedLabel]}>{label}</Text>
    </Pressable>
  );
}

export function CertificateNotice({
  title,
  children,
  warning = false,
}: React.PropsWithChildren<{ title?: string; warning?: boolean }>) {
  return (
    <View style={[styles.notice, warning && styles.warning]}>
      <CertificateIcon name="info" color={warning ? '#C46A00' : colors.primary} />
      <View style={text.flex}>
        {title ? <Text style={text.actionTitle}>{title}</Text> : null}
        <Text style={text.body}>{children}</Text>
      </View>
    </View>
  );
}

export function CertificateAction({
  title,
  subtitle,
  onPress,
  busy = false,
}: {
  title: string;
  subtitle: string;
  onPress?: () => void;
  busy?: boolean;
}) {
  const disabled = !onPress || busy;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled, busy }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.action, (disabled || pressed) && styles.dimmed]}
    >
      <View style={text.flex}>
        <Text style={text.actionTitle}>{title}</Text>
        <Text style={text.body}>{subtitle}</Text>
      </View>
      {busy ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <CertificateIcon name="chevron" color={colors.muted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  section: { gap: 12 },
  heading: { gap: 4 },
  button: {
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonLabel: {
    color: colors.surface,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    textAlign: 'center',
    flexShrink: 1,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#F8FAFC',
    alignSelf: 'flex-start',
  },
  outlinedLabel: { color: colors.primary, fontSize: 11 },
  dimmed: { opacity: 0.45 },
  notice: {
    borderRadius: 8,
    backgroundColor: colors.information,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  warning: { backgroundColor: colors.warning },
  action: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
