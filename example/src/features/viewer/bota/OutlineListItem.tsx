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
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';

import { useAppTheme } from '../../../theme/appTheme';

import {
  OutlineFlatItem,
  OutlineMenuAction,
} from './outlineTab.types';

type OutlineListItemProps = {
  item: OutlineFlatItem;
  isExpanded: boolean;
  isMoveMode: boolean;
  isMoveSource: boolean;
  isMoveTargetInvalid: boolean;
  untitledLabel: string;
  pageLabel: string;
  moreAccessibilityLabel: string;
  moreAccessibilityHint: string;
  expandAccessibilityLabel: string;
  menuActions: OutlineMenuAction[];
  onPress: () => void;
  onToggleExpand: () => void;
};

export function OutlineListItem({
  item,
  isExpanded,
  isMoveMode,
  isMoveSource,
  isMoveTargetInvalid,
  untitledLabel,
  pageLabel,
  moreAccessibilityLabel,
  moreAccessibilityHint,
  expandAccessibilityLabel,
  menuActions,
  onPress,
  onToggleExpand,
}: OutlineListItemProps) {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);
  const pageIndex = item.node.destination?.pageIndex;

  const metaParts = [`Level ${item.depth + 1}`];
  metaParts.push(
    item.childCount > 0
      ? `${item.childCount} ${item.childCount === 1 ? 'child' : 'children'}`
      : 'Leaf item',
  );

  if (isMoveSource) {
    metaParts.unshift('Selected to move');
  } else if (isMoveMode && !isMoveTargetInvalid && menuActions.length > 0) {
    metaParts.unshift('Open menu to place here');
  }

  const showMenu = menuActions.length > 0;
  const indentation = 12 + item.depth * 18;

  return (
    <View style={styles.shell}>
      <View
        style={[
          styles.row,
          isMoveSource ? styles.rowActive : null,
          isMoveMode && !isMoveSource && !isMoveTargetInvalid ? styles.rowTarget : null,
          isMoveTargetInvalid ? styles.rowMuted : null,
        ]}>
        <View style={[styles.treeIndent, { width: indentation }]}>
          {item.depth > 0 ? <View style={styles.indentTrack} /> : null}
          {isMoveSource ? <View style={styles.indentMarkerActive} /> : null}
        </View>

        {item.hasChildren ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={expandAccessibilityLabel}
            accessibilityHint={
              isExpanded ? 'Collapse outline children.' : 'Expand outline children.'
            }
            activeOpacity={0.82}
            style={styles.expandButton}
            onPress={onToggleExpand}>
            <View style={[styles.expandChip, isExpanded ? styles.expandChipOpen : null]}>
              <Text style={styles.expandIcon}>{isExpanded ? '▾' : '▸'}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.expandPlaceholder}>
            <View style={styles.leafDot} />
          </View>
        )}

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={item.node.title || untitledLabel}
          accessibilityHint={
            isMoveMode
              ? 'Choose a destination action from the menu.'
              : typeof pageIndex === 'number'
                ? `Jump to page ${pageIndex + 1}.`
                : 'Open this outline destination.'
          }
          activeOpacity={0.84}
          disabled={isMoveMode}
          style={styles.contentButton}
          onPress={onPress}>
          <View style={styles.titleLine}>
            <Text numberOfLines={1} style={styles.title}>
              {item.node.title || untitledLabel}
            </Text>
          </View>
          <Text numberOfLines={1} style={styles.metaText}>
            {metaParts.join(' • ')}
          </Text>
        </TouchableOpacity>

        {typeof pageIndex === 'number' ? (
          <View style={styles.pageSlot}>
            <View style={styles.pageChip}>
              <Text style={styles.pageChipText}>{`${pageLabel} ${pageIndex + 1}`}</Text>
            </View>
          </View>
        ) : null}

        {showMenu ? (
          <Menu>
            <MenuTrigger>
              <View
                accessible
                accessibilityRole="button"
                accessibilityLabel={moreAccessibilityLabel}
                accessibilityHint={moreAccessibilityHint}
                style={styles.moreButton}>
                <Text style={styles.moreText}>···</Text>
              </View>
            </MenuTrigger>
            <MenuOptions customStyles={{ optionsContainer: styles.menuContainer }}>
              {menuActions.map(action => (
                <React.Fragment key={action.key}>
                  <MenuOption onSelect={action.onSelect}>
                    <Text
                      style={[
                        styles.menuText,
                        action.tone === 'danger' ? styles.menuTextDanger : null,
                      ]}>
                      {action.label}
                    </Text>
                  </MenuOption>
                </React.Fragment>
              ))}
            </MenuOptions>
          </Menu>
        ) : (
          <View style={styles.morePlaceholder} />
        )}
      </View>
    </View>
  );
}

function createStyles(appTheme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    shell: {
      paddingRight: appTheme.spacing.md,
    },
    row: {
      minHeight: 56,
      backgroundColor: appTheme.colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: appTheme.colors.outlineVariant,
    },
    rowActive: {
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    rowTarget: {
      backgroundColor:
        appTheme.mode === 'dark' ? 'rgba(167, 139, 250, 0.12)' : 'rgba(124, 58, 237, 0.08)',
    },
    rowMuted: {
      opacity: 0.56,
    },
    treeIndent: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    indentTrack: {
      width: 1,
      alignSelf: 'stretch',
      backgroundColor: appTheme.colors.outlineVariant,
      opacity: 0.75,
    },
    indentMarkerActive: {
      position: 'absolute',
      left: '50%',
      marginLeft: -1,
      top: 10,
      bottom: 10,
      width: 2,
      borderRadius: appTheme.radii.pill,
      backgroundColor: appTheme.colors.primary,
    },
    expandButton: {
      width: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    expandPlaceholder: {
      width: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    expandChip: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    expandChipOpen: {
      backgroundColor: appTheme.colors.surfaceVariant,
    },
    expandIcon: {
      color: appTheme.colors.textPrimary,
      fontSize: 13,
      fontWeight: '700',
    },
    leafDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: appTheme.colors.outline,
    },
    contentButton: {
      flex: 1,
      minWidth: 0,
      paddingVertical: appTheme.spacing.sm,
      paddingRight: appTheme.spacing.xs,
      justifyContent: 'center',
      gap: 2,
    },
    titleLine: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      flex: 1,
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.bodyMedium,
      fontWeight: itemWeight(appTheme),
    },
    pageSlot: {
      minWidth: 84,
      paddingHorizontal: appTheme.spacing.xs,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'stretch',
    },
    pageChip: {
      borderRadius: appTheme.radii.pill,
      backgroundColor: appTheme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      paddingHorizontal: appTheme.spacing.xs,
      paddingVertical: 3,
    },
    pageChipText: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.labelSmall,
      fontWeight: '600',
    },
    metaText: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.labelSmall,
      lineHeight: 16,
    },
    moreButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: appTheme.radii.pill,
    },
    moreText: {
      color: appTheme.colors.textSecondary,
      fontSize: 18,
      lineHeight: 20,
    },
    morePlaceholder: {
      width: 36,
    },
    menuContainer: {
      borderRadius: appTheme.radii.md,
      backgroundColor: appTheme.colors.surface,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      paddingVertical: appTheme.spacing.xs,
      shadowColor: '#000000',
      shadowOpacity: 0.14,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    menuText: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '600',
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.sm,
    },
    menuTextDanger: {
      color: '#D92D20',
    },
  });
}

function itemWeight(appTheme: ReturnType<typeof useAppTheme>) {
  return appTheme.mode === 'dark' ? '600' : '500';
}