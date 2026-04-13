/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAppTheme, type AppTheme } from '../../theme/appTheme';

type HomeHeaderProps = {
  title: string;
  subtitle: string;
  onSettingsPress: () => void;
};

export function HomeHeader({
  title,
  subtitle,
  onSettingsPress,
}: HomeHeaderProps) {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);

  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.logoWrap}>
          <Image
            source={require('../../../assets/ic_logo_1.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <TouchableOpacity
        accessibilityLabel="Open settings"
        onPress={onSettingsPress}
        style={styles.settingsButton}>
        <Image
          source={require('../../../assets/ic_setting.png')}
          style={styles.settingsIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

function createStyles(appTheme: AppTheme) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: appTheme.spacing.xl,
      paddingTop: appTheme.spacing.sm,
      paddingBottom: appTheme.spacing.md,
      backgroundColor: appTheme.colors.surface,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      paddingRight: appTheme.spacing.md,
    },
    logoWrap: {
      width: 48,
      height: 48,
      borderRadius: 12,
      overflow: 'hidden',
      marginRight: appTheme.spacing.md,
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    logo: {
      width: '100%',
      height: '100%',
    },
    headerCopy: {
      flex: 1,
    },
    title: {
      color: appTheme.colors.textPrimary,
      fontSize: 22,
      fontWeight: '600',
    },
    subtitle: {
      marginTop: 2,
      color: appTheme.colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    settingsButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: appTheme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsIcon: {
      width: 20,
      height: 20,
      tintColor: appTheme.colors.textPrimary,
    },
  });
}
