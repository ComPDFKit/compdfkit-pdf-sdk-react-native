/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useEffect, useRef } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { useAppTheme } from '../../../theme/appTheme';
import { CPDFSearchItem } from '../model/CPDFSearchItem';

interface CPDFSearchTextListScreenProps {
  visible: boolean;
  list: CPDFSearchItem[];
  currentSelectionIndex?: number;
  onClose: () => void;
  jump: (searchItem: CPDFSearchItem) => void;
}

const CPDFSearchTextListScreen: React.FC<CPDFSearchTextListScreenProps> = ({
  visible,
  list,
  currentSelectionIndex = -1,
  onClose,
  jump,
}) => {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);
  const { height: screenHeight } = useWindowDimensions();
  const listRef = useRef<FlatList<CPDFSearchItem> | null>(null);
  const estimatedVisibleItems = Math.min(Math.max(list.length, 1), 5);
  const adaptiveHeight = list.length === 0
    ? 320
    : Math.min(screenHeight * 0.72, 154 + estimatedVisibleItems * 106);

  useEffect(() => {
    if (!visible || currentSelectionIndex < 0 || currentSelectionIndex >= list.length) {
      return;
    }

    const scrollToCurrentItem = () => {
      listRef.current?.scrollToIndex({
        animated: false,
        index: currentSelectionIndex,
        viewPosition: 0.5,
      });
    };

    const frameId = requestAnimationFrame(scrollToCurrentItem);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [currentSelectionIndex, list.length, visible]);

  const highlightKeyword = (item: CPDFSearchItem, isSelected: boolean) => {
    const content = item.content;
    const keyword = item.keywords;
    const keywordStartInPage = item.keywordTextRange.location;
    const contentStartInPage = item.contentTextRange.location;
    const relativeKeywordStart = keywordStartInPage - contentStartInPage;

    if (
      relativeKeywordStart < 0 ||
      relativeKeywordStart + keyword.length > content.length
    ) {
      return (
        <Text style={[styles.contentText, isSelected ? styles.contentTextSelected : null]}>
          {content}
        </Text>
      );
    }

    return (
      <Text style={[styles.contentText, isSelected ? styles.contentTextSelected : null]}>
        <Text>{content.substring(0, relativeKeywordStart)}</Text>
        <Text style={styles.highlightText}>
          {content.substring(
            relativeKeywordStart,
            relativeKeywordStart + keyword.length
          )}
        </Text>
        <Text>{content.substring(relativeKeywordStart + keyword.length)}</Text>
      </Text>
    );
  };

  const renderItem = ({ item, index }: { item: CPDFSearchItem; index: number }) => {
    const isSelected = index === currentSelectionIndex;

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => {
          jump(item);
        }}>
        <View style={[styles.itemContainer, isSelected ? styles.itemContainerSelected : null]}>
          <View style={styles.itemHeader}>
            <View style={[styles.pageBadge, isSelected ? styles.pageBadgeSelected : null]}>
              <Text style={[styles.pageText, isSelected ? styles.pageTextSelected : null]}>
                Page {item.keywordTextRange.pageIndex + 1}
              </Text>
            </View>

            {isSelected ? (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Current</Text>
              </View>
            ) : null}
          </View>
          {highlightKeyword(item, isSelected)}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.container, { height: adaptiveHeight, maxHeight: screenHeight * 0.72 }]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.title}>Search Results</Text>
              <Text style={styles.subtitle}>
                {list.length > 0
                  ? `${list.length} matches found in the document`
                  : 'No matches available yet'}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              style={styles.closeButton}>
              <Image
                source={require('../../../../assets/close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>

          <FlatList
            ref={listRef}
            data={list}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.keywordTextRange.pageIndex}-${item.keywordTextRange.location}-${index}`}
            onScrollToIndexFailed={(info) => {
              listRef.current?.scrollToOffset({
                animated: false,
                offset: info.averageItemLength * info.index,
              });

              requestAnimationFrame(() => {
                listRef.current?.scrollToIndex({
                  animated: false,
                  index: info.index,
                  viewPosition: 0.5,
                });
              });
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={list.length === 0 ? styles.emptyListContent : styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Image
                  source={require('../../../../assets/ic_searchlist.png')}
                  style={styles.emptyStateIcon}
                />
                <Text style={styles.emptyStateTitle}>No Search Results</Text>
                <Text style={styles.emptyStateDescription}>
                  Try another keyword or run a new search from the field above.
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </Modal>
  );
};

function createStyles(appTheme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(15, 23, 42, 0.28)',
    },
    container: {
      width: '100%',
      backgroundColor: appTheme.colors.surface,
      paddingHorizontal: appTheme.spacing.md,
      paddingTop: appTheme.spacing.xs,
      paddingBottom: appTheme.spacing.md,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      shadowColor: '#0F172A',
      shadowOpacity: 0.14,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: -10 },
      elevation: 24,
    },
    handle: {
      alignSelf: 'center',
      width: 44,
      height: 5,
      borderRadius: appTheme.radii.pill,
      backgroundColor: appTheme.colors.outline,
      marginBottom: appTheme.spacing.sm,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: appTheme.spacing.md,
      gap: appTheme.spacing.sm,
    },
    headerCopy: {
      flex: 1,
    },
    title: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.titleMedium,
      fontWeight: '700',
    },
    subtitle: {
      marginTop: 4,
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodyMedium,
      lineHeight: 20,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    closeIcon: {
      width: 14,
      height: 14,
      tintColor: appTheme.colors.textSecondary,
      resizeMode: 'contain',
    },
    listContent: {
      paddingBottom: appTheme.spacing.md,
    },
    emptyListContent: {
      flexGrow: 1,
    },
    itemContainer: {
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.md,
      borderRadius: appTheme.radii.lg,
      backgroundColor: appTheme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
    },
    itemContainerSelected: {
      backgroundColor: '#EFF6FF',
      borderColor: '#93C5FD',
      shadowColor: '#2563EB',
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    itemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: appTheme.spacing.xs,
    },
    pageBadge: {
      paddingHorizontal: appTheme.spacing.sm,
      paddingVertical: 4,
      borderRadius: appTheme.radii.pill,
      backgroundColor: '#EFF6FF',
      borderWidth: 1,
      borderColor: '#BFDBFE',
    },
    pageBadgeSelected: {
      backgroundColor: '#DBEAFE',
      borderColor: '#60A5FA',
    },
    pageText: {
      color: '#1D4ED8',
      fontSize: appTheme.typography.labelSmall,
      fontWeight: '700',
    },
    pageTextSelected: {
      color: '#1E40AF',
    },
    currentBadge: {
      paddingHorizontal: appTheme.spacing.sm,
      paddingVertical: 4,
      borderRadius: appTheme.radii.pill,
      backgroundColor: appTheme.colors.primary,
    },
    currentBadgeText: {
      color: appTheme.colors.inverseText,
      fontSize: appTheme.typography.labelSmall,
      fontWeight: '700',
    },
    contentText: {
      fontSize: appTheme.typography.bodyMedium,
      lineHeight: 22,
      color: appTheme.colors.textPrimary,
    },
    contentTextSelected: {
      color: '#0F172A',
    },
    highlightText: {
      color: '#DC2626',
      fontWeight: '700',
      backgroundColor: '#FEE2E2',
    },
    separator: {
      height: appTheme.spacing.sm,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: appTheme.spacing.xl,
      paddingBottom: appTheme.spacing.xl,
    },
    emptyStateIcon: {
      width: 36,
      height: 36,
      tintColor: appTheme.colors.textSecondary,
      resizeMode: 'contain',
      marginBottom: appTheme.spacing.sm,
      opacity: 0.8,
    },
    emptyStateTitle: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.titleSmall,
      fontWeight: '700',
    },
    emptyStateDescription: {
      marginTop: appTheme.spacing.xs,
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodyMedium,
      lineHeight: 20,
      textAlign: 'center',
    },
  });
}

export default CPDFSearchTextListScreen;