/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAppTheme, type AppTheme } from '../../theme/appTheme';

// Alternating icon colors matching Flutter's CategoryListTile behavior
// Even indices: tertiaryContainer / tertiary (green tint)
// Odd indices: primaryContainer / primary (blue tint)
function getIconColors(index: number, mode: 'light' | 'dark') {
  if (mode === 'light') {
    return index % 2 === 0
      ? { bg: '#EAF9F5', fg: '#16A34A' }
      : { bg: '#EBF2FF', fg: '#1460F3' };
  }
  return index % 2 === 0
    ? { bg: '#0F2B22', fg: '#22C55E' }
    : { bg: '#1C2A4A', fg: '#3B82F6' };
}

type CategoryListTileProps = {
  icon: ImageSourcePropType;
  accentColor: string;
  index: number;
  title: string;
  description: string;
  onPress: () => void;
};

export function CategoryListTile({
  icon,
  index,
  title,
  description,
  onPress,
}: CategoryListTileProps) {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);
  const iconColors = getIconColors(index, appTheme.mode);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.tile}>
      <View style={[styles.iconWrap, { backgroundColor: iconColors.bg }]}>
        <Image source={icon} style={[styles.icon, { tintColor: iconColors.fg }]} />
      </View>
      <View style={styles.copyWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

function createStyles(appTheme: AppTheme) {
  return StyleSheet.create({
    tile: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 64,
      paddingHorizontal: appTheme.spacing.md,
      borderRadius: 14,
      backgroundColor: appTheme.colors.surface,
      marginBottom: appTheme.spacing.sm,
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    icon: {
      width: 20,
      height: 20,
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
      marginTop: 2,
      color: appTheme.colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
    },
    chevron: {
      color: appTheme.colors.outline,
      fontSize: 22,
      lineHeight: 22,
    },
  });
}
