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
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAppTheme } from '../../../theme/appTheme';

type OutlineEditorDialogProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  titleValue: string;
  pageValue: string;
  pageCount: number;
  titlePlaceholder: string;
  pagePlaceholder: string;
  cancelLabel: string;
  confirmLabel: string;
  isBusy: boolean;
  onChangeTitle: (value: string) => void;
  onChangePage: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export function OutlineEditorDialog({
  visible,
  title,
  subtitle,
  titleValue,
  pageValue,
  pageCount,
  titlePlaceholder,
  pagePlaceholder,
  cancelLabel,
  confirmLabel,
  isBusy,
  onChangeTitle,
  onChangePage,
  onCancel,
  onConfirm,
}: OutlineEditorDialogProps) {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.mask}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerAccent} />
            <View style={styles.headerCopy}>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder={titlePlaceholder}
              placeholderTextColor={appTheme.colors.textSecondary}
              value={titleValue}
              onChangeText={onChangeTitle}
              autoFocus
              selectTextOnFocus
              editable={!isBusy}
              returnKeyType="done"
            />
          </View>

          <View style={styles.fieldGroup}>
            <View style={styles.pageLabelRow}>
              <Text style={styles.fieldLabel}>Page Number</Text>
              {pageCount > 0 ? (
                <Text style={styles.pageCountHint}>{`1-${pageCount}`}</Text>
              ) : null}
            </View>
            <TextInput
              style={styles.input}
              placeholder={pagePlaceholder}
              placeholderTextColor={appTheme.colors.textSecondary}
              value={pageValue}
              onChangeText={onChangePage}
              keyboardType="number-pad"
              editable={!isBusy}
              returnKeyType="done"
              maxLength={7}
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.74}
              disabled={isBusy}
              style={styles.actionButton}
              onPress={onCancel}>
              <Text style={styles.actionLabel}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.74}
              disabled={isBusy}
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={onConfirm}>
              <Text style={[styles.actionLabel, styles.actionLabelPrimary]}>
                {confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function createStyles(appTheme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    mask: {
      flex: 1,
      padding: appTheme.spacing.lg,
      justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.38)',
    },
    card: {
      borderRadius: appTheme.radii.lg,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      backgroundColor: appTheme.colors.surface,
      padding: appTheme.spacing.lg,
      gap: appTheme.spacing.md,
      shadowColor: '#000000',
      shadowOpacity: 0.18,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: appTheme.spacing.md,
    },
    headerAccent: {
      width: 4,
      alignSelf: 'stretch',
      borderRadius: appTheme.radii.pill,
      backgroundColor: appTheme.colors.primary,
    },
    headerCopy: {
      flex: 1,
      gap: appTheme.spacing.xxs,
    },
    title: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.titleSmall,
      fontWeight: '700',
    },
    subtitle: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodyMedium,
    },
    fieldGroup: {
      gap: appTheme.spacing.xs,
    },
    fieldLabel: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '600',
    },
    pageLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: appTheme.spacing.sm,
    },
    pageCountHint: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.labelSmall,
      fontWeight: '500',
    },
    input: {
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      borderRadius: appTheme.radii.md,
      backgroundColor: appTheme.colors.surfaceAlt,
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.sm,
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.bodyMedium,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: appTheme.spacing.sm,
      marginTop: appTheme.spacing.xs,
    },
    actionButton: {
      minWidth: 92,
      borderRadius: appTheme.radii.sm,
      backgroundColor: appTheme.colors.surfaceAlt,
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionButtonPrimary: {
      backgroundColor: appTheme.colors.primary,
    },
    actionLabel: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '600',
    },
    actionLabelPrimary: {
      color: appTheme.colors.inverseText,
      fontWeight: '700',
    },
  });
}