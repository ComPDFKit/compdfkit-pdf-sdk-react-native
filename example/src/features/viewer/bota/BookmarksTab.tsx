/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useCallback, useContext, useEffect, useRef } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import PDFReaderContext, {
  CPDFBookmark,
  CPDFReaderView,
} from '@compdfkit_pdf_sdk/react_native';

import { useAppTheme } from '../../../theme/appTheme';
import { LoadingErrorScaffold } from '../../../widgets/common/LoadingErrorScaffold';
import { ConfirmDialog } from '../../../widgets/common/ConfirmDialog';

interface CPDFBookmarksTabProps {
  onClose?: () => void;
}

type LoadState = 'loading' | 'ready' | 'error';

const COPY = {
  loadingTitle: 'Loading bookmarks',
  loadingDescription: 'Preparing saved bookmarks for this document.',
  loadErrorTitle: 'Unable to load bookmarks',
  loadErrorDescription: 'Check the document state and try again.',
  errorTitle: 'Bookmark Error',
  actionError: 'The bookmark action did not complete. Please try again.',
  duplicateToast: 'A bookmark already exists on this page',
  emptyLabel: 'No bookmarks yet',
  untitledLabel: 'Untitled',
  pageLabel: 'Page',
  addLabel: 'Add bookmark',
  editLabel: 'Edit',
  deleteLabel: 'Delete',
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm',
  titlePlaceholder: 'Enter bookmark title',
  validationToast: 'Please enter bookmark title',
  addTitle: 'Add Bookmark',
  editTitle: 'Edit Bookmark',
  deleteDialogTitle: 'Delete Bookmark',
  deleteDialogMessage: 'Are you sure you want to delete this bookmark?',
  addAccessibilityLabel: 'Add bookmark',
  addAccessibilityHint: 'Create a bookmark for the current page.',
  actionsAccessibilityLabel: 'Open bookmark actions',
  actionsAccessibilityHint: 'Open edit and delete actions for this bookmark.',
  savingBusy: 'Saving bookmark',
  deletingBusy: 'Deleting bookmark',
};

export const BookmarksTab: React.FC<CPDFBookmarksTabProps> = ({ onClose }) => {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);
  const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;
  const isMountedRef = useRef(true);

  const [bookmarks, setBookmarks] = React.useState<Array<CPDFBookmark>>([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [titleInput, setTitleInput] = React.useState('');
  const [editingBookmark, setEditingBookmark] =
    React.useState<CPDFBookmark | null>(null);
  const [pendingPageIndex, setPendingPageIndex] = React.useState<number | null>(
    null,
  );
  const [loadState, setLoadState] = React.useState<LoadState>('loading');
  const [busyAction, setBusyAction] = React.useState<string | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = React.useState(false);
  const [deletingBookmark, setDeletingBookmark] =
    React.useState<CPDFBookmark | null>(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refreshBookmarks = useCallback(
    async ({ showLoader = false } = {}) => {
      if (!pdfReader) {
        if (isMountedRef.current) {
          setBookmarks([]);
          setLoadState('ready');
        }
        return true;
      }

      if (showLoader && isMountedRef.current) {
        setLoadState('loading');
      }

      try {
        const bookmarkItems = await pdfReader._pdfDocument.getBookmarks();
        if (isMountedRef.current) {
          setBookmarks(bookmarkItems || []);
          setLoadState('ready');
        }
        return true;
      } catch {
        if (isMountedRef.current) {
          if (showLoader) {
            setLoadState('error');
          } else {
            Alert.alert(COPY.errorTitle, COPY.actionError);
          }
        }
        return false;
      }
    },
    [pdfReader],
  );

  useEffect(() => {
    void refreshBookmarks({ showLoader: true });
  }, [refreshBookmarks]);

  const runBusyAction = useCallback(
    async (label: string, action: () => Promise<void>) => {
      if (busyAction) {
        return false;
      }

      setBusyAction(label);
      try {
        await action();
        return true;
      } catch {
        Alert.alert(COPY.errorTitle, COPY.actionError);
        return false;
      } finally {
        if (isMountedRef.current) {
          setBusyAction(null);
        }
      }
    },
    [busyAction],
  );

  const formatDate = (value?: any) => {
    if (!value) {
      return '';
    }
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleString();
  };

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  const openAddModal = async () => {
    if (!pdfReader) {
      return;
    }
    const pageIndex = await pdfReader.getCurrentPageIndex();
    const exists = await pdfReader._pdfDocument.hasBookmark(pageIndex);
    if (exists) {
      showToast(COPY.duplicateToast);
      return;
    }
    setEditingBookmark(null);
    setPendingPageIndex(pageIndex);
    setTitleInput(`Bookmark ${pageIndex + 1}`);
    setModalVisible(true);
  };

  const openEditModal = (bookmark: CPDFBookmark) => {
    setEditingBookmark(bookmark);
    setPendingPageIndex(bookmark.pageIndex);
    setTitleInput(bookmark.title || '');
    setModalVisible(true);
  };

  const handleDelete = async (bookmark: CPDFBookmark) => {
    if (!pdfReader) {
      return;
    }
    setDeletingBookmark(bookmark);
    setDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (!pdfReader || !deletingBookmark) {
      return;
    }
    setDeleteDialogVisible(false);
    await runBusyAction(COPY.deletingBusy, async () => {
      await pdfReader._pdfDocument.removeBookmark(deletingBookmark.pageIndex);
      setDeletingBookmark(null);
      await refreshBookmarks();
    });
  };

  const handleConfirm = async () => {
    if (!pdfReader || pendingPageIndex === null) {
      return;
    }
    if (!titleInput.trim()) {
      showToast(COPY.validationToast);
      return;
    }

    const pageIndex = pendingPageIndex;
    const currentReader = pdfReader;

    await runBusyAction(COPY.savingBusy, async () => {
      if (editingBookmark) {
        await currentReader._pdfDocument.updateBookmark({
          ...editingBookmark,
          title: titleInput.trim(),
        });
      } else {
        await currentReader._pdfDocument.addBookmark(titleInput.trim(), pageIndex);
      }

      if (isMountedRef.current) {
        setModalVisible(false);
        setEditingBookmark(null);
        setPendingPageIndex(null);
      }

      await refreshBookmarks();
    });
  };

  if (loadState === 'loading' && bookmarks.length === 0) {
    return (
      <LoadingErrorScaffold
        state="loading"
        title={COPY.loadingTitle}
        description={COPY.loadingDescription}
      />
    );
  }

  if (loadState === 'error' && bookmarks.length === 0) {
    return (
      <LoadingErrorScaffold
        state="error"
        title={COPY.loadErrorTitle}
        description={COPY.loadErrorDescription}
        onRetry={() => void refreshBookmarks({ showLoader: true })}
      />
    );
  }

  const renderItem = ({ item }: { item: CPDFBookmark }) => (
    <View style={styles.row}>
      <View style={styles.rowAccent} />
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={item.title || COPY.untitledLabel}
        accessibilityHint={`Jump to ${COPY.pageLabel.toLowerCase()} ${item.pageIndex + 1}.`}
        activeOpacity={0.6}
        style={styles.rowContent}
        onPress={async () => {
          if (!pdfReader) {
            return;
          }
          await pdfReader.setDisplayPageIndex(item.pageIndex);
          onClose?.();
        }}>
        <View style={styles.rowTextWrap}>
          <View style={styles.titleLine}>
            <Text numberOfLines={1} style={styles.title}>
              {item.title || COPY.untitledLabel}
            </Text>
            <Text style={styles.page}>{`${COPY.pageLabel} ${item.pageIndex + 1}`}</Text>
          </View>
          {formatDate(item.date) ? (
            <Text numberOfLines={1} style={styles.date}>{formatDate(item.date)}</Text>
          ) : null}
        </View>
      </TouchableOpacity>

      <Menu>
        <MenuTrigger>
          <View
            accessible
            accessibilityRole="button"
            accessibilityLabel={COPY.actionsAccessibilityLabel}
            accessibilityHint={COPY.actionsAccessibilityHint}
            style={styles.moreBtn}>
            <Text style={styles.moreText}>···</Text>
          </View>
        </MenuTrigger>
        <MenuOptions customStyles={{ optionsContainer: styles.menuContainer }}>
          <MenuOption onSelect={() => openEditModal(item)}>
            <Text style={styles.menuText}>{COPY.editLabel}</Text>
          </MenuOption>
          <MenuOption onSelect={() => void handleDelete(item)}>
            <Text style={[styles.menuText, styles.menuTextDanger]}>{COPY.deleteLabel}</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );

  return (
    <View style={styles.container}>
      {busyAction ? (
        <View style={styles.busyBanner}>
          <Text style={styles.busyText}>{busyAction}</Text>
        </View>
      ) : null}

      <FlatList
        data={bookmarks}
        keyExtractor={item => item.uuid}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={<Text style={styles.empty}>{COPY.emptyLabel}</Text>}
      />

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={COPY.addAccessibilityLabel}
        accessibilityHint={COPY.addAccessibilityHint}
        activeOpacity={0.88}
        disabled={!!busyAction}
        style={[styles.fab, busyAction ? styles.fabDisabled : null]}
        onPress={() => void openAddModal()}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalMask}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderAccent} />
              <Text style={styles.modalTitle}>
                {editingBookmark ? COPY.editTitle : COPY.addTitle}
              </Text>
            </View>
            <Text style={styles.modalSubtitle}>
              {editingBookmark
                ? `${COPY.pageLabel} ${(editingBookmark.pageIndex ?? 0) + 1}`
                : pendingPageIndex !== null
                  ? `${COPY.pageLabel} ${pendingPageIndex + 1}`
                  : ''}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={COPY.titlePlaceholder}
              placeholderTextColor={appTheme.colors.textSecondary}
              value={titleInput}
              onChangeText={setTitleInput}
              autoFocus
              selectTextOnFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={!!busyAction}
                style={styles.actionBtn}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.actionText}>{COPY.cancelLabel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={!!busyAction}
                style={[styles.actionBtn, styles.actionBtnPrimary]}
                onPress={() => void handleConfirm()}>
                <Text style={[styles.actionText, styles.actionTextPrimary]}>
                  {COPY.confirmLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmDialog
        visible={deleteDialogVisible}
        title={COPY.deleteDialogTitle}
        message={COPY.deleteDialogMessage}
        cancelLabel={COPY.cancelLabel}
        confirmLabel={COPY.deleteLabel}
        onCancel={() => {
          setDeleteDialogVisible(false);
          setDeletingBookmark(null);
        }}
        onConfirm={confirmDelete}
      />
    </View>
  );
};

function createStyles(appTheme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appTheme.colors.surface,
    },
    contentContainer: {
      paddingBottom: 96,
    },
    busyBanner: {
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.xs,
      backgroundColor: appTheme.colors.surfaceVariant,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: appTheme.colors.outlineVariant,
    },
    busyText: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
      fontWeight: '500',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 52,
      paddingRight: appTheme.spacing.xs,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: appTheme.colors.outlineVariant,
      backgroundColor: appTheme.colors.surface,
    },
    rowAccent: {
      width: 3,
      alignSelf: 'stretch',
      marginVertical: appTheme.spacing.xs,
      borderRadius: 2,
      backgroundColor: appTheme.colors.primary,
    },
    rowContent: {
      flex: 1,
      minWidth: 0,
      paddingVertical: appTheme.spacing.sm,
      paddingLeft: appTheme.spacing.sm,
      paddingRight: appTheme.spacing.sm,
    },
    rowTextWrap: {
      gap: 2,
    },
    titleLine: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: appTheme.spacing.xs,
    },
    title: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.bodyMedium,
      fontWeight: '500',
      flexShrink: 1,
      minWidth: 0,
    },
    page: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.labelSmall,
      flexShrink: 0,
    },
    date: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
      marginTop: 1,
    },
    moreBtn: {
      minWidth: 36,
      minHeight: 36,
      borderRadius: appTheme.radii.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    moreText: {
      fontSize: 16,
      fontWeight: '700',
      color: appTheme.colors.textSecondary,
      letterSpacing: 1,
    },
    menuContainer: {
      borderRadius: appTheme.radii.sm,
      overflow: 'hidden' as const,
      shadowColor: '#000000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
    menuText: {
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.sm,
      fontSize: appTheme.typography.labelMedium,
      color: appTheme.colors.textPrimary,
      fontWeight: '600',
    },
    menuTextDanger: {
      color: '#D92D20',
    },
    empty: {
      textAlign: 'center',
      color: appTheme.colors.textSecondary,
      marginTop: appTheme.spacing.xxl,
      fontSize: appTheme.typography.bodyMedium,
    },
    fab: {
      position: 'absolute',
      right: appTheme.spacing.md,
      bottom: appTheme.spacing.xl,
      width: 52,
      height: 52,
      borderRadius: appTheme.radii.pill,
      backgroundColor: appTheme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 3,
      shadowColor: '#000000',
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
    fabDisabled: {
      opacity: 0.55,
    },
    fabText: {
      color: appTheme.colors.inverseText,
      fontSize: 28,
      lineHeight: 28,
    },
    modalMask: {
      flex: 1,
      backgroundColor: 'rgba(11,17,26,0.45)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: appTheme.spacing.xl,
    },
    modalCard: {
      width: '100%',
      backgroundColor: appTheme.colors.surface,
      borderRadius: appTheme.radii.xl,
      paddingTop: appTheme.spacing.lg,
      paddingHorizontal: appTheme.spacing.lg,
      paddingBottom: appTheme.spacing.md,
      gap: appTheme.spacing.sm,
      shadowColor: '#000000',
      shadowOpacity: 0.15,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: appTheme.spacing.xs,
    },
    modalHeaderAccent: {
      width: 4,
      height: 18,
      borderRadius: 2,
      backgroundColor: appTheme.colors.primary,
    },
    modalTitle: {
      fontSize: appTheme.typography.titleSmall,
      fontWeight: '700',
      color: appTheme.colors.textPrimary,
    },
    modalSubtitle: {
      fontSize: appTheme.typography.bodySmall,
      color: appTheme.colors.textSecondary,
      marginBottom: appTheme.spacing.xxs,
    },
    input: {
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
      borderRadius: appTheme.radii.md,
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.sm,
      fontSize: appTheme.typography.bodyMedium,
      color: appTheme.colors.textPrimary,
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: appTheme.spacing.sm,
      marginTop: appTheme.spacing.xs,
    },
    actionBtn: {
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.xs,
      borderRadius: appTheme.radii.pill,
      backgroundColor: appTheme.colors.surfaceVariant,
    },
    actionBtnPrimary: {
      backgroundColor: appTheme.colors.primary,
    },
    actionText: {
      fontSize: appTheme.typography.labelMedium,
      color: appTheme.colors.textPrimary,
      fontWeight: '600',
    },
    actionTextPrimary: {
      color: appTheme.colors.inverseText,
    },
  });
}

export default BookmarksTab;