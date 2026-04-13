/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useEffect } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAppTheme } from '../../theme/appTheme';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [
                styles.actionButton,
                styles.cancelButton,
                pressed ? styles.cancelButtonPressed : null,
              ]}
            >
              <Text style={styles.cancelLabel}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                void onConfirm();
              }}
              style={({ pressed }) => [
                styles.actionButton,
                styles.confirmButton,
                pressed ? styles.confirmButtonPressed : null,
              ]}
            >
              <Text style={styles.confirmLabel}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export const CommonDialog = ConfirmDialog;

type AppToastProps = {
  visible: boolean;
  message: string;
  duration?: number;
  onHide?: () => void;
};

export function AppToast({
  visible,
  message,
  duration = 2200,
  onHide,
}: AppToastProps) {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);

  useEffect(() => {
    if (!visible || !onHide) {
      return;
    }

    const timer = setTimeout(() => {
      onHide();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onHide, visible]);

  if (!visible || !message) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.toastContainer}>
      <View style={styles.toastCard}>
        <Text style={styles.toastMessage}>{message}</Text>
      </View>
    </View>
  );
}

function createStyles(appTheme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      padding: appTheme.spacing.xl,
      justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.36)',
    },
    card: {
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
    title: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.titleSmall,
      fontWeight: '700',
    },
    message: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodyMedium,
      lineHeight: 22,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: appTheme.spacing.sm,
    },
    actionButton: {
      minWidth: 88,
      borderRadius: appTheme.radii.sm,
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    cancelButtonPressed: {
      opacity: 0.72,
    },
    confirmButton: {
      backgroundColor: appTheme.colors.primary,
    },
    confirmButtonPressed: {
      opacity: 0.86,
    },
    cancelLabel: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '600',
    },
    confirmLabel: {
      color: appTheme.colors.inverseText,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '700',
    },
    toastContainer: {
      position: 'absolute',
      left: appTheme.spacing.lg,
      right: appTheme.spacing.lg,
      bottom: appTheme.spacing.xxl,
      alignItems: 'center',
    },
    toastCard: {
      maxWidth: '100%',
      borderRadius: appTheme.radii.pill,
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      paddingHorizontal: appTheme.spacing.lg,
      paddingVertical: appTheme.spacing.sm,
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
    toastMessage: {
      color: appTheme.colors.inverseText,
      fontSize: appTheme.typography.bodyMedium,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
}