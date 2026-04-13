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

type FeaturedCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  iconSource: ImageSourcePropType;
  onPress: () => void;
};

export function FeaturedCard({
  eyebrow,
  title,
  description,
  iconSource,
  onPress,
}: FeaturedCardProps) {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      <View style={styles.iconWrap}>
        <Image source={iconSource} style={styles.icon} />
      </View>
      <View style={styles.copyWrap}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

function createStyles(appTheme: AppTheme) {
  return StyleSheet.create({
    card: {
      borderRadius: appTheme.radii.xl,
      padding: appTheme.spacing.lg,
      backgroundColor: appTheme.colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconWrap: {
      width: 56,
      height: 56,
      borderRadius: appTheme.radii.lg,
      backgroundColor: 'rgba(255,255,255,0.16)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: appTheme.spacing.sm,
    },
    icon: {
      width: 28,
      height: 28,
      tintColor: appTheme.colors.inverseText,
    },
    copyWrap: {
      flex: 1,
    },
    eyebrow: {
      color: 'rgba(255,255,255,0.72)',
      fontSize: appTheme.typography.labelSmall,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    title: {
      marginTop: appTheme.spacing.xxs,
      color: appTheme.colors.inverseText,
      fontSize: appTheme.typography.titleMedium,
      fontWeight: '700',
    },
    description: {
      marginTop: appTheme.spacing.xxs,
      color: appTheme.colors.inverseText,
      opacity: 0.88,
      fontSize: appTheme.typography.bodyMedium,
      lineHeight: 20,
    },
  });
}