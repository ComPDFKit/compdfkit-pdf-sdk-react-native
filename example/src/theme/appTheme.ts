/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { Appearance, useColorScheme } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';

export type AppTheme = {
  mode: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    surface: string;
    surfaceAlt: string;
    surfaceVariant: string;
    outline: string;
    outlineVariant: string;
    textPrimary: string;
    textSecondary: string;
    inverseText: string;
  };
  spacing: {
    xxs: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
  typography: {
    hero: number;
    titleLarge: number;
    titleMedium: number;
    titleSmall: number;
    bodyLarge: number;
    bodyMedium: number;
    bodySmall: number;
    labelLarge: number;
    labelMedium: number;
    labelSmall: number;
  };
};

export const lightAppTheme: AppTheme = {
  mode: 'light',
  colors: {
    primary: '#1460F3',
    secondary: '#7C3AED',
    tertiary: '#16A34A',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F5F7FA',
    surfaceVariant: '#F3F4F6',
    outline: '#D1D5DB',
    outlineVariant: '#E5E7EB',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B7280',
    inverseText: '#FFFFFF',
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  radii: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    pill: 999,
  },
  typography: {
    hero: 28,
    titleLarge: 24,
    titleMedium: 20,
    titleSmall: 16,
    bodyLarge: 16,
    bodyMedium: 14,
    bodySmall: 12,
    labelLarge: 16,
    labelMedium: 14,
    labelSmall: 11,
  },
};

export const darkAppTheme: AppTheme = {
  mode: 'dark',
  colors: {
    primary: '#3B82F6',
    secondary: '#A78BFA',
    tertiary: '#22C55E',
    background: '#0B111A',
    surface: '#111827',
    surfaceAlt: '#1A2230',
    surfaceVariant: '#2A3342',
    outline: '#334155',
    outlineVariant: '#2A3342',
    textPrimary: '#F3F4F6',
    textSecondary: '#A0A9B6',
    inverseText: '#FFFFFF',
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  radii: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    pill: 999,
  },
  typography: {
    hero: 28,
    titleLarge: 24,
    titleMedium: 20,
    titleSmall: 16,
    bodyLarge: 16,
    bodyMedium: 14,
    bodySmall: 12,
    labelLarge: 16,
    labelMedium: 14,
    labelSmall: 11,
  },
};

export function getAppTheme(colorScheme?: string | null) {
  return colorScheme === 'dark' ? darkAppTheme : lightAppTheme;
}

export function useAppTheme() {
  return getAppTheme(useColorScheme());
}

export function createNavigationTheme(appTheme: AppTheme): NavigationTheme {
  const baseTheme = appTheme.mode === 'dark' ? DarkTheme : DefaultTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: appTheme.colors.primary,
      background: appTheme.colors.background,
      card: appTheme.colors.surface,
      text: appTheme.colors.textPrimary,
      border: appTheme.colors.outlineVariant,
      notification: appTheme.colors.secondary,
    },
  };
}

export function getCurrentAppTheme() {
  return getAppTheme(Appearance.getColorScheme());
}

export function getStackHeaderOptions() {
  const appTheme = getCurrentAppTheme();

  return {
    headerStyle: {
      backgroundColor: appTheme.colors.surface,
    },
    headerTitleStyle: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.labelLarge,
      fontWeight: '600' as const,
    },
    headerTintColor: appTheme.colors.textPrimary,
    headerShadowVisible: false,
  };
}