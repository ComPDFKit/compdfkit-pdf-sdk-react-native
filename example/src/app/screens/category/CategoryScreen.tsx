/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  type AppTheme,
  useAppTheme,
} from '../../../theme/appTheme';
import { AppToolbar } from '../../../widgets/common/AppToolbar';
import {
  executeExampleItem,
  getSupportedExamples,
} from '../../../examples/runtime';
import { getCategoryById } from '../../../examples/registry';
import type { AppStackParamList } from '../../navigation/routes';
import { FeatureItem } from '../../../widgets/common/FeatureItem';

type CategoryRoute = RouteProp<AppStackParamList, 'Category'>;
type AppNavigation = NativeStackNavigationProp<AppStackParamList>;

export function CategoryScreen() {
  const navigation = useNavigation<AppNavigation>();
  const route = useRoute<CategoryRoute>();
  const category = getCategoryById(route.params.categoryId);
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);

  const visibleExamples = category
    ? getSupportedExamples(category.examples)
    : [];

  if (!category) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppToolbar title="Category" onBackPress={() => navigation.goBack()} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Category not found</Text>
          <Text style={styles.emptyDescription}>
            The selected category is not registered in the current example registry.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <AppToolbar
        title={category.name}
        subtitle={category.description}
        onBackPress={() => navigation.goBack()}
      />
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={visibleExamples}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Examples</Text>
        }
        ListEmptyComponent={
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>No RN example is wired yet</Text>
            <Text style={styles.placeholderDescription}>
              This category already exists in the shared registry, but there is no
              React Native screen mapped for the current platform yet.
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <FeatureItem
            badge={item.visual?.badge ?? String(index + 1).padStart(2, '0')}
            accentColor={item.visual?.accentColor}
            title={item.name}
            description={item.description}
            onPress={() => void executeExampleItem(item, navigation)}
          />
        )}
      />
    </SafeAreaView>
  );
}

function createStyles(appTheme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appTheme.colors.background,
    },
    list: {
      flex: 1,
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    listContent: {
      paddingHorizontal: appTheme.spacing.md,
      paddingTop: appTheme.spacing.sm,
      paddingBottom: appTheme.spacing.xxl,
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    sectionTitle: {
      color: appTheme.colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      marginBottom: appTheme.spacing.sm,
    },
    placeholderCard: {
      borderRadius: 12,
      backgroundColor: appTheme.colors.surface,
      padding: appTheme.spacing.lg,
    },
    placeholderTitle: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.titleSmall,
      fontWeight: '700',
    },
    placeholderDescription: {
      marginTop: appTheme.spacing.xs,
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodyMedium,
      lineHeight: 20,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: appTheme.spacing.xl,
      backgroundColor: appTheme.colors.background,
    },
    emptyTitle: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.titleSmall,
      fontWeight: '700',
    },
    emptyDescription: {
      marginTop: appTheme.spacing.xs,
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodyMedium,
      lineHeight: 20,
      textAlign: 'center',
    },
  });
}
