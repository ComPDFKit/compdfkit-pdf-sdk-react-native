/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { allCategories } from '../../../examples/registry';
import { getSupportedExamples } from '../../../examples/runtime';
import { useAppTheme, type AppTheme } from '../../../theme/appTheme';
import { CategoryListTile } from '../../../widgets/common/CategoryListTile';
import { HomeHeader } from '../../../widgets/common/HomeHeader';
import { APP_ROUTES, type AppStackParamList } from '../../navigation/routes';

type AppNavigation = NativeStackNavigationProp<AppStackParamList, 'Home'>;

export function HomeScreen() {
  const navigation = useNavigation<AppNavigation>();
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);

  const visibleCategories = allCategories.map(category => ({
    ...category,
    supportedCount: getSupportedExamples(category.examples).length,
  }));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <HomeHeader
        title="ComPDFKit"
        subtitle="ComPDFKit React Native Demo"
        onSettingsPress={() => navigation.navigate(APP_ROUTES.settings)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Examples</Text>
        </View>

        {visibleCategories.map((category, index) => (
          <CategoryListTile
            key={category.id}
            icon={category.icon}
            accentColor={category.accentColor}
            index={index}
            title={category.name}
            description={category.description}
            onPress={() =>
              navigation.navigate(APP_ROUTES.category, {
                categoryId: category.id,
              })
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(appTheme: AppTheme) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: appTheme.colors.background,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: appTheme.spacing.md,
      paddingTop: appTheme.spacing.sm,
      paddingBottom: appTheme.spacing.xxl,
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    scrollView: {
      flex: 1,
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    sectionHeader: {
      marginBottom: appTheme.spacing.sm,
    },
    sectionTitle: {
      color: appTheme.colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
    },
  });
}
