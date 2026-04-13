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
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAppTheme, type AppTheme } from '../../theme/appTheme';

type LoadingErrorScaffoldProps = {
  state: 'loading' | 'error';
  title: string;
  description: string;
  onRetry?: () => void;
};

export function LoadingErrorScaffold({
  state,
  title,
  description,
  onRetry,
}: LoadingErrorScaffoldProps) {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);

  return (
    <View style={styles.container}>
      {state === 'loading' ? (
        <ActivityIndicator size="large" color={appTheme.colors.primary} />
      ) : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {state === 'error' && onRetry ? (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function createStyles(appTheme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appTheme.colors.background,
      paddingHorizontal: appTheme.spacing.xxl,
    },
    title: {
      marginTop: appTheme.spacing.lg,
      fontSize: appTheme.typography.titleMedium,
      fontWeight: '700',
      color: appTheme.colors.textPrimary,
    },
    description: {
      marginTop: appTheme.spacing.xs,
      fontSize: appTheme.typography.bodyMedium,
      lineHeight: 20,
      color: appTheme.colors.textSecondary,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: appTheme.spacing.lg,
      borderRadius: appTheme.radii.md,
      backgroundColor: appTheme.colors.primary,
      paddingHorizontal: appTheme.spacing.lg,
      paddingVertical: appTheme.spacing.sm,
    },
    retryButtonText: {
      color: appTheme.colors.inverseText,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '600',
    },
  });
}