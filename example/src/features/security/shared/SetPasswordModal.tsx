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
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAppTheme } from '../../../theme/appTheme';

type SetPasswordModalProps = {
  visible: boolean;
  saving: boolean;
  userPassword: string;
  ownerPassword: string;
  onChangeUserPassword: (value: string) => void;
  onChangeOwnerPassword: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export function SetPasswordModal({
  visible,
  saving,
  userPassword,
  ownerPassword,
  onChangeUserPassword,
  onChangeOwnerPassword,
  onClose,
  onConfirm,
}: SetPasswordModalProps) {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.dialogCard}>
          <Text style={styles.dialogTitle}>Set Document Password</Text>
          <Text style={styles.dialogMessage}>
            Enter the password required to open the document and the permissions password used
            for owner access.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>User Password</Text>
            <TextInput
              style={styles.input}
              value={userPassword}
              onChangeText={onChangeUserPassword}
              placeholder="Enter user password"
              placeholderTextColor={appTheme.colors.textSecondary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!saving}
              autoFocus
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Permissions Password</Text>
            <TextInput
              style={styles.input}
              value={ownerPassword}
              onChangeText={onChangeOwnerPassword}
              placeholder="Enter permissions password"
              placeholderTextColor={appTheme.colors.textSecondary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!saving}
            />
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              onPress={onClose}
              disabled={saving}
              style={({ pressed }) => [
                styles.actionButton,
                styles.cancelButton,
                pressed && !saving ? styles.pressedButton : null,
                saving ? styles.disabledButton : null,
              ]}>
              <Text style={styles.cancelButtonLabel}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={saving}
              style={({ pressed }) => [
                styles.actionButton,
                styles.confirmButton,
                pressed && !saving ? styles.pressedButton : null,
                saving ? styles.disabledButton : null,
              ]}>
              {saving ? (
                <ActivityIndicator size="small" color={appTheme.colors.inverseText} />
              ) : (
                <Text style={styles.confirmButtonLabel}>Confirm</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(appTheme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'center',
      padding: appTheme.spacing.xl,
      backgroundColor: 'rgba(15, 23, 42, 0.36)',
    },
    dialogCard: {
      borderRadius: appTheme.radii.lg,
      backgroundColor: appTheme.colors.surface,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      padding: appTheme.spacing.lg,
      gap: appTheme.spacing.md,
      shadowColor: '#000000',
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 12,
    },
    dialogTitle: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.titleSmall,
      fontWeight: '700',
    },
    dialogMessage: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodyMedium,
      lineHeight: 22,
    },
    fieldGroup: {
      gap: appTheme.spacing.xs,
    },
    fieldLabel: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '600',
    },
    input: {
      borderWidth: 1,
      borderColor: appTheme.colors.outline,
      borderRadius: appTheme.radii.md,
      backgroundColor: appTheme.colors.surfaceAlt,
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.bodyLarge,
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.sm,
    },
    actionsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: appTheme.spacing.sm,
      marginTop: appTheme.spacing.xs,
    },
    actionButton: {
      minWidth: 96,
      borderRadius: appTheme.radii.sm,
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    confirmButton: {
      backgroundColor: appTheme.colors.primary,
    },
    cancelButtonLabel: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '600',
    },
    confirmButtonLabel: {
      color: appTheme.colors.inverseText,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '600',
    },
    pressedButton: {
      opacity: 0.8,
    },
    disabledButton: {
      opacity: 0.64,
    },
  });
}