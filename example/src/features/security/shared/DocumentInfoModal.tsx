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
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../../theme/appTheme';
import type { DocumentPermissionsSnapshot } from './securityActions';

type DocumentInfoModalProps = {
  visible: boolean;
  loading: boolean;
  snapshot: DocumentPermissionsSnapshot | null;
  errorMessage: string | null;
  onClose: () => void;
};

type InfoRowProps = {
  label: string;
  value: string;
  emphasized?: boolean;
};

type PermissionItem = {
  key: keyof DocumentPermissionsSnapshot['permissionsInfo'];
  label: string;
};

const permissionItems: PermissionItem[] = [
  { key: 'allowsPrinting', label: 'Printing' },
  { key: 'allowsHighQualityPrinting', label: 'High Quality Printing' },
  { key: 'allowsCopying', label: 'Copying' },
  { key: 'allowsDocumentChanges', label: 'Document Changes' },
  { key: 'allowsDocumentAssembly', label: 'Document Assembly' },
  { key: 'allowsCommenting', label: 'Commenting' },
  { key: 'allowsFormFieldEntry', label: 'Form Filling' },
];

function formatBoolean(value: boolean) {
  return value ? 'Allowed' : 'Not allowed';
}

function formatState(value: boolean) {
  return value ? 'Yes' : 'No';
}

function InfoRow({ label, value, emphasized = false }: InfoRowProps) {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme, 0);

  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, emphasized ? styles.infoValueStrong : null]}>
        {value}
      </Text>
    </View>
  );
}

export function DocumentInfoModal({
  visible,
  loading,
  snapshot,
  errorMessage,
  onClose,
}: DocumentInfoModalProps) {
  const appTheme = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(appTheme, insets.bottom);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.card}>
          <View style={styles.grabber} />
          <View style={styles.header}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.eyebrow}>Security Overview</Text>
              <Text style={styles.title}>Document Info</Text>
              <Text style={styles.subtitle}>
                Review file metadata, permission mode, encryption, and owner access.
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed ? styles.closeButtonPressed : null]}
            >
              <Image
                source={require('../../../../assets/close.png')}
                style={styles.closeIcon}
                resizeMode="contain"
              />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="small" color={appTheme.colors.primary} />
              <Text style={styles.loadingText}>Loading document information...</Text>
            </View>
          ) : null}

          {!loading && errorMessage ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorTitle}>Unable to read document info</Text>
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            </View>
          ) : null}

          {!loading && snapshot ? (
            <View style={styles.contentViewport}>
              <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator
                bounces={false}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Summary</Text>
                  <InfoRow label="File Name" value={snapshot.fileName} emphasized />
                  <InfoRow label="Document Path" value={snapshot.documentPath} />
                  <InfoRow label="Page Count" value={String(snapshot.pageCount)} />
                  <InfoRow label="Encrypted" value={formatState(snapshot.isEncrypted)} />
                  <InfoRow label="Image-only Document" value={formatState(snapshot.isImageDoc)} />
                  <InfoRow label="Permission Mode" value={snapshot.permissions} emphasized />
                  <InfoRow label="Owner Unlocked" value={formatState(snapshot.ownerUnlocked)} />
                  <InfoRow label="Encrypt Algorithm" value={snapshot.encryptAlgo} />
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Permission Details</Text>
                  {permissionItems.map((item) => (
                    <InfoRow
                      key={item.key}
                      label={item.label}
                      value={formatBoolean(snapshot.permissionsInfo[item.key])}
                      emphasized={snapshot.permissionsInfo[item.key]}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function createStyles(appTheme: ReturnType<typeof useAppTheme>, bottomInset: number) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(15, 23, 42, 0.48)',
    },
    card: {
      height: '88%',
      borderTopLeftRadius: appTheme.radii.xl,
      borderTopRightRadius: appTheme.radii.xl,
      backgroundColor: appTheme.colors.surface,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      borderBottomWidth: 0,
      paddingTop: appTheme.spacing.sm,
      paddingHorizontal: appTheme.spacing.lg,
      paddingBottom: Math.max(bottomInset, appTheme.spacing.md),
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 14,
    },
    grabber: {
      alignSelf: 'center',
      width: 44,
      height: 5,
      borderRadius: appTheme.radii.pill,
      backgroundColor: appTheme.colors.outline,
      marginBottom: appTheme.spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: appTheme.spacing.md,
      marginBottom: appTheme.spacing.md,
    },
    headerTextWrap: {
      flex: 1,
      gap: appTheme.spacing.xs,
    },
    eyebrow: {
      color: appTheme.colors.primary,
      fontSize: appTheme.typography.labelSmall,
      fontWeight: '700',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    title: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.titleMedium,
      fontWeight: '700',
    },
    subtitle: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodyMedium,
      lineHeight: 20,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: appTheme.colors.surfaceAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeButtonPressed: {
      opacity: 0.72,
    },
    closeIcon: {
      width: 16,
      height: 16,
      tintColor: appTheme.colors.textPrimary,
    },
    loadingState: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: appTheme.spacing.sm,
      paddingVertical: appTheme.spacing.xxl,
    },
    loadingText: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodyMedium,
    },
    errorCard: {
      borderRadius: appTheme.radii.lg,
      backgroundColor: appTheme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      padding: appTheme.spacing.md,
      gap: appTheme.spacing.xs,
    },
    errorTitle: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.titleSmall,
      fontWeight: '700',
    },
    errorMessage: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodyMedium,
      lineHeight: 20,
    },
    content: {
      flex: 1,
    },
    contentViewport: {
      flex: 1,
      minHeight: 0,
      marginTop: appTheme.spacing.sm,
    },
    contentContainer: {
      flexGrow: 1,
      gap: appTheme.spacing.md,
      paddingBottom: appTheme.spacing.md,
    },
    section: {
      borderRadius: appTheme.radii.lg,
      backgroundColor: appTheme.colors.surfaceAlt,
      padding: appTheme.spacing.md,
      gap: appTheme.spacing.sm,
    },
    sectionTitle: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.labelLarge,
      fontWeight: '700',
    },
    infoRow: {
      gap: appTheme.spacing.xxs,
      paddingBottom: appTheme.spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: appTheme.colors.outline,
    },
    infoLabel: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.labelSmall,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    infoValue: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.bodyMedium,
      lineHeight: 20,
    },
    infoValueStrong: {
      color: appTheme.colors.primary,
      fontWeight: '700',
    },
  });
}