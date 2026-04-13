/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CPDFReaderView } from '@compdfkit_pdf_sdk/react_native';

import { Logger } from '../../../util/logger';
import { useAppTheme } from '../../../theme/appTheme';
import { redoLastEdit, undoLastEdit } from '../shared/contentEditorActions';

type EditorHistoryBottomToolbarProps = {
  reader: CPDFReaderView;
};

export function EditorHistoryBottomToolbar({ reader }: EditorHistoryBottomToolbarProps) {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const historyManager = reader._editManager.historyManager;

    historyManager.setOnHistoryStateChangedListener((pageIndex, nextCanUndo, nextCanRedo) => {
      Logger.log(
        'onContentEditorHistoryChanged:',
        pageIndex,
        nextCanUndo,
        nextCanRedo,
      );
      setCanUndo(nextCanUndo);
      setCanRedo(nextCanRedo);
    });

    void Promise.all([historyManager.canUndo(), historyManager.canRedo()]).then(
      ([initialCanUndo, initialCanRedo]) => {
        setCanUndo(initialCanUndo);
        setCanRedo(initialCanRedo);
      },
    );

    return () => {
      historyManager.setOnHistoryStateChangedListener(() => undefined);
    };
  }, [reader]);

  return (
    <View style={styles.toolbar}>
      <TouchableOpacity
        disabled={!canUndo}
        onPress={() => {
          void undoLastEdit(reader);
        }}
        style={[styles.actionButton, !canUndo && styles.actionButtonDisabled]}
      >
        <Image
          source={require('../../../../assets/ic_undo.png')}
          style={[styles.actionIcon, !canUndo && styles.actionIconDisabled]}
        />
        <Text style={[styles.actionLabel, !canUndo && styles.actionLabelDisabled]}>
          Undo
        </Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity
        disabled={!canRedo}
        onPress={() => {
          void redoLastEdit(reader);
        }}
        style={[styles.actionButton, !canRedo && styles.actionButtonDisabled]}
      >
        <Image
          source={require('../../../../assets/ic_redo.png')}
          style={[styles.actionIcon, !canRedo && styles.actionIconDisabled]}
        />
        <Text style={[styles.actionLabel, !canRedo && styles.actionLabelDisabled]}>
          Redo
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function createStyles(appTheme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    toolbar: {
      width: '100%',
      minHeight: 64,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: appTheme.colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: appTheme.colors.outlineVariant,
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.xs,
    },
    actionButton: {
      flex: 1,
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: appTheme.radii.md,
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    actionButtonDisabled: {
      backgroundColor: appTheme.colors.surfaceVariant,
    },
    actionIcon: {
      width: 20,
      height: 20,
      marginRight: appTheme.spacing.xs,
      resizeMode: 'contain',
      tintColor: appTheme.colors.textPrimary,
    },
    actionIconDisabled: {
      tintColor: appTheme.colors.textSecondary,
      opacity: 0.55,
    },
    actionLabel: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '600',
    },
    actionLabelDisabled: {
      color: appTheme.colors.textSecondary,
    },
    divider: {
      width: appTheme.spacing.sm,
    },
  });
}