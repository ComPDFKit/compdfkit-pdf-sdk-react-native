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

import { useAppTheme } from '../../theme/appTheme';

type AppToolbarProps = {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  rightAccessory?: React.ReactNode;
};

export function AppToolbar({
  title,
  subtitle,
  onBackPress,
  rightAccessory,
}: AppToolbarProps) {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);

  return (
    <View style={styles.container}>
      <View style={styles.leadingGroup}>
        {onBackPress ? (
          <TouchableOpacity onPress={onBackPress} style={styles.iconButton}>
            <Image
              source={require('../../../assets/ic_syasarrow_left.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        ) : null}

        <View style={styles.copyWrap}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {rightAccessory ? <View style={styles.trailingSlot}>{rightAccessory}</View> : null}
    </View>
  );
}

function createStyles(appTheme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: appTheme.spacing.md,
      minHeight: 64,
      backgroundColor: appTheme.colors.surface,
    },
    leadingGroup: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    copyWrap: {
      flex: 1,
      justifyContent: 'center',
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appTheme.colors.surfaceAlt,
      marginRight: appTheme.spacing.sm,
    },
    icon: {
      width: 18,
      height: 18,
      tintColor: appTheme.colors.primary,
    },
    title: {
      color: appTheme.colors.textPrimary,
      fontSize: 20,
      fontWeight: '600',
    },
    subtitle: {
      marginTop: 2,
      color: appTheme.colors.textSecondary,
      fontSize: 12,
    },
    trailingSlot: {
      marginLeft: appTheme.spacing.md,
    },
  });
}
