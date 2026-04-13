/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PDFReaderContext, { CPDFReaderView } from '@compdfkit_pdf_sdk/react_native';

import { CPDFOutline } from '../../../../../src/document/CPDFOutline';
import { useAppTheme } from '../../../theme/appTheme';
import {
  AppToast,
  CommonDialog,
} from '../../../widgets/common/ConfirmDialog';
import { LoadingErrorScaffold } from '../../../widgets/common/LoadingErrorScaffold';

import { OutlineEditorDialog } from './OutlineEditorDialog';
import { OutlineListItem } from './OutlineListItem';
import {
  buildOutlineLookup,
  flattenVisibleOutlines,
  getAvailableMovePositions,
  parsePageNumberInput,
  resolveMoveTarget,
} from './outlineTab.helpers';
import {
  LoadState,
  OutlineEditorState,
  OutlineFlatItem,
  OutlineMenuAction,
  OutlineMovePosition,
  OutlineMoveSession,
} from './outlineTab.types';

interface CPDFOutlineTabProps {
  onClose?: () => void;
}

const COPY = {
  loadingTitle: 'Loading outlines',
  loadingDescription: 'Preparing the outline list for this document.',
  loadErrorTitle: 'Unable to load outlines',
  loadErrorDescription: 'Check the document state and try again.',
  refreshError: 'Could not refresh outlines. Please try again.',
  actionError: 'The outline action did not complete. Please try again.',
  errorTitle: 'Outline Error',
  validationTitle: 'Please enter an outline title.',
  validationPage: 'Enter a valid page number within the document range.',
  addChildLabel: 'Add child',
  editLabel: 'Edit',
  deleteLabel: 'Delete',
  moveLabel: 'Move',
  moveHereLabel: 'Move here',
  moveBeforeLabel: 'Move before',
  moveAfterLabel: 'Move after',
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm',
  deleteDialogTitle: 'Delete Outline',
  deleteDialogMessage: 'Are you sure you want to delete this outline item?',
  untitledLabel: 'Untitled',
  pageLabel: 'Page',
  pageNumberPlaceholder: 'Enter page number',
  titlePlaceholder: 'Enter outline title',
  addRootTitle: 'Add Outline',
  addChildTitle: 'Add Child Outline',
  editTitle: 'Edit Outline',
  addRootSubtitle: 'Create a new top-level outline item.',
  addChildSubtitle: 'Create a nested outline item for the selected branch.',
  editSubtitle: 'Update the selected outline title and destination.',
  emptyLabel: 'No outlines yet',
  addRootAccessibilityLabel: 'Add outline',
  addRootAccessibilityHint: 'Open the dialog to create a new top-level outline item.',
  refreshAccessibilityLabel: 'Refresh outlines',
  refreshAccessibilityHint: 'Reload the outline list from the document.',
  moreAccessibilityLabel: 'Open outline actions',
  moreAccessibilityHint: 'Open actions for this outline item.',
  expandAccessibilityLabel: 'Toggle outline children',
  moveBannerPrefix: 'Move mode:',
  moveBannerAction: 'Open a target menu to place this item inside, before, or after.',
  busyPrefix: 'Working:',
  addBusy: 'Adding outline',
  editBusy: 'Updating outline',
  deleteBusy: 'Deleting outline',
  moveBusy: 'Moving outline',
  saveLabel: 'Save',
};

export const OutlineTab: React.FC<CPDFOutlineTabProps> = ({ onClose }) => {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);
  const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;
  const isMountedRef = useRef(true);

  const [outlineRoot, setOutlineRoot] = useState<CPDFOutline | null>(null);
  const [outlines, setOutlines] = useState<CPDFOutline[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [moveSession, setMoveSession] = useState<OutlineMoveSession | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [editorState, setEditorState] = useState<OutlineEditorState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CPDFOutline | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const applyOutlineRoot = useCallback((root: CPDFOutline | null, nextPageCount: number) => {
    if (!isMountedRef.current) {
      return;
    }

    setOutlineRoot(root);
    setOutlines(root?.childList ?? []);
    setPageCount(nextPageCount);
    setLoadState('ready');
  }, []);

  const showActionError = useCallback((message: string) => {
    Alert.alert(COPY.errorTitle, message);
  }, []);

  const refreshOutlines = useCallback(
    async ({ showLoader = false, showRefreshIndicator = false } = {}) => {
      if (!pdfReader) {
        if (!isMountedRef.current) {
          return false;
        }

        setOutlineRoot(null);
        setOutlines([]);
        setPageCount(0);
        setLoadState('ready');
        setIsRefreshing(false);
        return true;
      }

      if (showLoader && isMountedRef.current) {
        setLoadState('loading');
      }
      if (showRefreshIndicator && isMountedRef.current) {
        setIsRefreshing(true);
      }

      try {
        const [root, nextPageCount] = await Promise.all([
          pdfReader._pdfDocument.getOutlineRoot(),
          pdfReader._pdfDocument.getPageCount(),
        ]);

        applyOutlineRoot(root ?? null, nextPageCount);
        return true;
      } catch {
        if (isMountedRef.current) {
          if (showLoader) {
            setLoadState('error');
          } else {
            showActionError(COPY.refreshError);
          }
        }
        return false;
      } finally {
        if (showRefreshIndicator && isMountedRef.current) {
          setIsRefreshing(false);
        }
      }
    },
    [applyOutlineRoot, pdfReader, showActionError],
  );

  useEffect(() => {
    void refreshOutlines({ showLoader: true });
  }, [refreshOutlines]);

  const toggleExpand = useCallback((id: string) => {
    setExpanded(previous => ({ ...previous, [id]: !previous[id] }));
  }, []);

  const setExpandItem = useCallback((id: string, value: boolean) => {
    setExpanded(previous => ({ ...previous, [id]: value }));
  }, []);

  const visible = useMemo(
    () => flattenVisibleOutlines(outlines, expanded),
    [outlines, expanded],
  );
  const outlineLookup = useMemo(() => buildOutlineLookup(visible), [visible]);

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
        showActionError(COPY.actionError);
        return false;
      } finally {
        if (isMountedRef.current) {
          setBusyAction(null);
        }
      }
    },
    [busyAction, showActionError],
  );

  const handleJump = useCallback(
    async (pageIndex: number) => {
      if (!pdfReader) {
        return;
      }
      await pdfReader.setDisplayPageIndex(pageIndex);
      onClose?.();
    },
    [onClose, pdfReader],
  );

  const openAddRootEditor = useCallback(async () => {
    if (!pdfReader || busyAction) {
      return;
    }

    let currentPageIndex = 0;

    try {
      currentPageIndex = await pdfReader.getCurrentPageIndex();
    } catch {
      currentPageIndex = 0;
    }

    setEditorState({
      mode: 'add-root',
      title: '',
      pageNumber: String(currentPageIndex + 1),
      targetItem: null,
    });
  }, [busyAction, pdfReader]);

  const openAddChildEditor = useCallback(
    async (item: OutlineFlatItem) => {
      if (!pdfReader || busyAction) {
        return;
      }

      let suggestedPageIndex = item.node.destination?.pageIndex ?? 0;

      if (typeof item.node.destination?.pageIndex !== 'number') {
        try {
          suggestedPageIndex = await pdfReader.getCurrentPageIndex();
        } catch {
          suggestedPageIndex = 0;
        }
      }

      setEditorState({
        mode: 'add-child',
        title: '',
        pageNumber: String(suggestedPageIndex + 1),
        targetItem: item,
      });
    },
    [busyAction, pdfReader],
  );

  const openEditEditor = useCallback(
    (item: OutlineFlatItem) => {
      if (busyAction) {
        return;
      }

      setEditorState({
        mode: 'edit',
        title: item.node.title || '',
        pageNumber: String((item.node.destination?.pageIndex ?? 0) + 1),
        targetItem: item,
      });
    },
    [busyAction],
  );

  const closeEditor = useCallback(() => {
    if (!busyAction) {
      setEditorState(null);
    }
  }, [busyAction]);

  const submitEditor = useCallback(async () => {
    if (!pdfReader || !editorState) {
      return;
    }

    const title = editorState.title.trim();
    if (!title) {
      setToastMessage(COPY.validationTitle);
      return;
    }

    const pageIndex = parsePageNumberInput(editorState.pageNumber, pageCount);
    if (pageIndex === null) {
      setToastMessage(COPY.validationPage);
      return;
    }

    if (editorState.mode === 'edit' && !editorState.targetItem) {
      return;
    }

    await runBusyAction(
      editorState.mode === 'edit' ? COPY.editBusy : COPY.addBusy,
      async () => {
        if (editorState.mode === 'add-root') {
          let root = outlineRoot;

          if (!root) {
            root = await pdfReader._pdfDocument.newOutlineRoot();
          }

          if (!root) {
            throw new Error('Outline root is unavailable.');
          }

          await pdfReader._pdfDocument.addOutline(root.uuid, title, -1, pageIndex);
          await refreshOutlines();
        }

        if (editorState.mode === 'add-child' && editorState.targetItem) {
          await pdfReader._pdfDocument.addOutline(
            editorState.targetItem.id,
            title,
            -1,
            pageIndex,
          );
          const refreshed = await refreshOutlines();
          if (refreshed) {
            setExpandItem(editorState.targetItem.id, true);
          }
        }

        if (editorState.mode === 'edit' && editorState.targetItem) {
          await pdfReader._pdfDocument.updateOutline(
            editorState.targetItem.id,
            title,
            pageIndex,
          );
          await refreshOutlines();
        }

        if (isMountedRef.current) {
          setEditorState(null);
        }
      },
    );
  }, [editorState, outlineRoot, pageCount, pdfReader, refreshOutlines, runBusyAction, setExpandItem]);

  const openDeleteDialog = useCallback((node: CPDFOutline) => {
    setDeleteTarget(node);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!pdfReader || !deleteTarget) {
      return;
    }

    const targetToDelete = deleteTarget;
    setDeleteTarget(null);

    await runBusyAction(COPY.deleteBusy, async () => {
      await pdfReader._pdfDocument.removeOutline(targetToDelete.uuid);
      await refreshOutlines();
    });
  }, [deleteTarget, pdfReader, refreshOutlines, runBusyAction]);

  const startMove = useCallback((item: OutlineFlatItem) => {
    if (busyAction) {
      return;
    }

    setEditorState(null);
    setDeleteTarget(null);
    setMoveSession({ sourceId: item.id });
  }, [busyAction]);

  const cancelMove = useCallback(() => {
    setMoveSession(null);
  }, []);

  const executeMove = useCallback(
    async (targetId: string, position: OutlineMovePosition) => {
      if (!pdfReader || !moveSession) {
        return;
      }

      const target = resolveMoveTarget(
        outlineLookup,
        moveSession.sourceId,
        targetId,
        position,
      );

      if (!target) {
        return;
      }

      await runBusyAction(COPY.moveBusy, async () => {
        await pdfReader._pdfDocument.moveOutline(
          moveSession.sourceId,
          target.parentId,
          target.insertIndex,
        );
        const refreshed = await refreshOutlines();
        if (refreshed && isMountedRef.current) {
          setMoveSession(null);
          if (target.expandTargetId) {
            setExpandItem(target.expandTargetId, true);
          }
        }
      });
    },
    [moveSession, outlineLookup, pdfReader, refreshOutlines, runBusyAction, setExpandItem],
  );

  const renderItem = useCallback(
    ({ item }: { item: OutlineFlatItem }) => {
      const isMoveSource = moveSession?.sourceId === item.id;
      const availableMovePositions = moveSession
        ? getAvailableMovePositions(outlineLookup, moveSession.sourceId, item.id)
        : [];
      const isMoveTargetInvalid =
        !!moveSession && !isMoveSource && availableMovePositions.length === 0;

      let menuActions: OutlineMenuAction[] = [];

      if (moveSession) {
        if (!isMoveSource) {
          menuActions = availableMovePositions.map(position => ({
            key: `${item.id}-${position}`,
            label:
              position === 'inside'
                ? COPY.moveHereLabel
                : position === 'before'
                  ? COPY.moveBeforeLabel
                  : COPY.moveAfterLabel,
            onSelect: () => {
              void executeMove(item.id, position);
            },
          }));
        }
      } else {
        menuActions = [
          {
            key: `${item.id}-add-child`,
            label: COPY.addChildLabel,
            onSelect: () => {
              void openAddChildEditor(item);
            },
          },
          {
            key: `${item.id}-edit`,
            label: COPY.editLabel,
            onSelect: () => {
              openEditEditor(item);
            },
          },
          {
            key: `${item.id}-delete`,
            label: COPY.deleteLabel,
            tone: 'danger',
            onSelect: () => {
              openDeleteDialog(item.node);
            },
          },
          {
            key: `${item.id}-move`,
            label: COPY.moveLabel,
            onSelect: () => {
              startMove(item);
            },
          },
        ];
      }

      return (
        <OutlineListItem
          item={item}
          isExpanded={!!expanded[item.id]}
          isMoveMode={!!moveSession}
          isMoveSource={isMoveSource}
          isMoveTargetInvalid={isMoveTargetInvalid}
          untitledLabel={COPY.untitledLabel}
          pageLabel={COPY.pageLabel}
          moreAccessibilityLabel={COPY.moreAccessibilityLabel}
          moreAccessibilityHint={COPY.moreAccessibilityHint}
          expandAccessibilityLabel={COPY.expandAccessibilityLabel}
          menuActions={menuActions}
          onPress={() => {
            if (!moveSession) {
              void handleJump(item.node.destination?.pageIndex ?? 0);
            }
          }}
          onToggleExpand={() => toggleExpand(item.id)}
        />
      );
    },
    [
      executeMove,
      expanded,
      handleJump,
      moveSession,
      openAddChildEditor,
      openDeleteDialog,
      openEditEditor,
      outlineLookup,
      startMove,
      toggleExpand,
    ],
  );

  const editorDialogTitle =
    editorState?.mode === 'edit'
      ? COPY.editTitle
      : editorState?.mode === 'add-child'
        ? COPY.addChildTitle
        : COPY.addRootTitle;

  const editorDialogSubtitle =
    editorState?.mode === 'edit'
      ? COPY.editSubtitle
      : editorState?.mode === 'add-child'
        ? COPY.addChildSubtitle
        : COPY.addRootSubtitle;

  const moveSourceTitle = moveSession
    ? outlineLookup[moveSession.sourceId]?.node.title || COPY.untitledLabel
    : '';

  if (loadState === 'loading' && outlines.length === 0) {
    return (
      <LoadingErrorScaffold
        state="loading"
        title={COPY.loadingTitle}
        description={COPY.loadingDescription}
      />
    );
  }

  if (loadState === 'error' && outlines.length === 0) {
    return (
      <LoadingErrorScaffold
        state="error"
        title={COPY.loadErrorTitle}
        description={COPY.loadErrorDescription}
        onRetry={() => void refreshOutlines({ showLoader: true })}
      />
    );
  }

  return (
    <View style={styles.container}>
      {moveSession ? (
        <View style={styles.infoBanner}>
          <View style={styles.infoCopy}>
            <Text style={styles.infoTitle}>{`${COPY.moveBannerPrefix} ${moveSourceTitle}`}</Text>
            <Text style={styles.infoDescription}>{COPY.moveBannerAction}</Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={COPY.cancelLabel}
            activeOpacity={0.82}
            onPress={cancelMove}>
            <Text style={styles.infoAction}>{COPY.cancelLabel}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {busyAction ? (
        <View style={styles.busyBanner}>
          <Text style={styles.busyText}>{`${COPY.busyPrefix} ${busyAction}`}</Text>
        </View>
      ) : null}

      <FlatList
        data={visible}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        refreshing={isRefreshing}
        onRefresh={() => {
          if (!busyAction) {
            void refreshOutlines({ showRefreshIndicator: true });
          }
        }}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>{COPY.emptyLabel}</Text>}
      />

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={COPY.addRootAccessibilityLabel}
        accessibilityHint={COPY.addRootAccessibilityHint}
        activeOpacity={0.88}
        disabled={!!busyAction}
        style={[styles.fab, busyAction ? styles.fabDisabled : null]}
        onPress={() => void openAddRootEditor()}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={COPY.refreshAccessibilityLabel}
        accessibilityHint={COPY.refreshAccessibilityHint}
        activeOpacity={0.88}
        disabled={!!busyAction || isRefreshing}
        style={[styles.refreshFab, busyAction || isRefreshing ? styles.fabDisabled : null]}
        onPress={() => void refreshOutlines({ showRefreshIndicator: true })}>
        <Image
          source={require('../../../../assets/ic_refresh.png')}
          style={styles.refreshIcon}
        />
      </TouchableOpacity>

      <OutlineEditorDialog
        visible={!!editorState}
        title={editorDialogTitle}
        subtitle={editorDialogSubtitle}
        titleValue={editorState?.title ?? ''}
        pageValue={editorState?.pageNumber ?? ''}
        pageCount={pageCount}
        titlePlaceholder={COPY.titlePlaceholder}
        pagePlaceholder={COPY.pageNumberPlaceholder}
        cancelLabel={COPY.cancelLabel}
        confirmLabel={editorState?.mode === 'edit' ? COPY.saveLabel : COPY.confirmLabel}
        isBusy={!!busyAction}
        onChangeTitle={value => {
          setEditorState(previous =>
            previous ? { ...previous, title: value } : previous,
          );
        }}
        onChangePage={value => {
          const nextValue = value.replace(/[^0-9]/g, '');
          setEditorState(previous =>
            previous ? { ...previous, pageNumber: nextValue } : previous,
          );
        }}
        onCancel={closeEditor}
        onConfirm={() => {
          void submitEditor();
        }}
      />

      <CommonDialog
        visible={!!deleteTarget}
        title={COPY.deleteDialogTitle}
        message={COPY.deleteDialogMessage}
        cancelLabel={COPY.cancelLabel}
        confirmLabel={COPY.deleteLabel}
        onCancel={() => {
          if (!busyAction) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={confirmDelete}
      />

      <AppToast
        visible={!!toastMessage}
        message={toastMessage}
        onHide={() => setToastMessage('')}
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
      paddingVertical: appTheme.spacing.xs,
      paddingBottom: 112,
    },
    infoBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: appTheme.spacing.md,
      paddingHorizontal: appTheme.spacing.md,
      paddingVertical: appTheme.spacing.sm,
      backgroundColor: appTheme.colors.surfaceAlt,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: appTheme.colors.outlineVariant,
    },
    infoCopy: {
      flex: 1,
      gap: appTheme.spacing.xxs,
    },
    infoTitle: {
      color: appTheme.colors.textPrimary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '600',
    },
    infoDescription: {
      color: appTheme.colors.textSecondary,
      fontSize: appTheme.typography.bodySmall,
    },
    infoAction: {
      color: appTheme.colors.primary,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '700',
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
    emptyText: {
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
    refreshFab: {
      position: 'absolute',
      right: appTheme.spacing.md,
      bottom: 92,
      width: 52,
      height: 52,
      borderRadius: appTheme.radii.pill,
      backgroundColor: appTheme.colors.tertiary,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 3,
      shadowColor: '#000000',
      shadowOpacity: 0.18,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
    },
    refreshIcon: {
      width: 24,
      height: 24,
      tintColor: appTheme.colors.inverseText,
    },
  });
}

export default OutlineTab;