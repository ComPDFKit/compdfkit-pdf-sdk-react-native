/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAppTheme, type AppTheme } from '../../theme/appTheme';

type FeatureItemProps = {
  badge: string;
  accentColor?: string;
  title: string;
  description: string;
  onPress: () => void;
};

export function FeatureItem({
  badge,
  accentColor,
  title,
  description,
  onPress,
}: FeatureItemProps) {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme, accentColor);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.card}>
      <View style={styles.badgeWrap}>
        <Text style={styles.badge}>{badge}</Text>
      </View>
      <View style={styles.copyWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function createStyles(appTheme: AppTheme, accentColor?: string) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: appTheme.spacing.md,
      minHeight: 72,
      borderRadius: 12,
      backgroundColor: appTheme.colors.surface,
      marginBottom: appTheme.spacing.sm,
    },
    badgeWrap: {
      width: 36,
      height: 36,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: accentColor ? `${accentColor}18` : appTheme.colors.surfaceAlt,
      marginRight: appTheme.spacing.sm,
    },
    badge: {
      color: accentColor ?? appTheme.colors.primary,
      fontSize: 12,
      fontWeight: '700',
    },
    copyWrap: {
      flex: 1,
      paddingRight: appTheme.spacing.sm,
    },
    title: {
      color: appTheme.colors.textPrimary,
      fontSize: 15,
      fontWeight: '500',
    },
    description: {
      marginTop: 4,
      color: appTheme.colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
    },
    chevron: {
      color: '#9CA3AF',
      fontSize: 22,
      lineHeight: 22,
    },
  });
}
