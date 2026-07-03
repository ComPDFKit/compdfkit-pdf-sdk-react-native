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
  FlatList,
  Image,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  CPDFAnnotation,
  CPDFAnnotationMarkState,
  CPDFAnnotationReviewState,
  CPDFReplyAnnotation,
  type CPDFDocument,
} from '@compdfkit_pdf_sdk/react_native';

import { Logger } from '../../../util/logger';
import {
  ActionSheet,
  ConfirmModal,
  EditReplyModal,
} from './AnnotationReplyModals';
import type { AnnotationReplyStyles } from './annotationReplyStyles';
import {
  ANNOTATION_REPLY_AUTHOR,
  annotationDisplaySummary,
  annotationDisplayTitle,
  formatReplyMeta,
  type ReplyCounts,
  type StatePickerConfig,
} from './annotationReplyUtils';

type EmptyAnnotationRepliesSheetProps = {
  pageIndex: number;
  styles: AnnotationReplyStyles;
  onClose: () => void;
};

export function EmptyAnnotationRepliesSheet({
  pageIndex,
  styles,
  onClose,
}: EmptyAnnotationRepliesSheetProps) {
  return (
    <View style={styles.emptySheetContent}>
      <Text style={styles.emptyIcon}>i</Text>
      <Text style={styles.emptyTitle}>No annotations on page {pageIndex + 1}</Text>
      <Text style={styles.emptyDescription}>
        Move to a page with annotations, then tap Replies again.
      </Text>
      <Pressable style={styles.primaryButton} onPress={onClose}>
        <Text style={styles.primaryButtonLabel}>Close</Text>
      </Pressable>
    </View>
  );
}

type AnnotationReplyPickerSheetProps = {
  annotations: CPDFAnnotation[];
  loading: boolean;
  message: string;
  pageIndex: number;
  replyCounts: ReplyCounts;
  styles: AnnotationReplyStyles;
  onClose: () => void;
  onSelect: (annotation: CPDFAnnotation) => void;
};

export function AnnotationReplyPickerSheet({
  annotations,
  loading,
  message,
  pageIndex,
  replyCounts,
  styles,
  onClose,
  onSelect,
}: AnnotationReplyPickerSheetProps) {
  return (
    <>
      <SheetHeader
        title="Select Annotation"
        subtitle={`Page ${pageIndex + 1}`}
        styles={styles}
        onClose={onClose}
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {loading ? <Text style={styles.loading}>Loading...</Text> : null}
      <FlatList
        data={annotations}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable style={styles.annotationRow} onPress={() => onSelect(item)}>
            <View style={styles.rowMain}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {annotationDisplayTitle(item)}
              </Text>
              <Text style={styles.rowSubtitle} numberOfLines={1}>
                {annotationDisplaySummary(item)}
              </Text>
            </View>
            <Text style={styles.replyCount}>{replyCounts[item.uuid] ?? 0}</Text>
          </Pressable>
        )}
      />
    </>
  );
}

type AnnotationReplyThreadSheetProps = {
  annotation: CPDFAnnotation;
  documentApi?: CPDFDocument | null;
  styles: AnnotationReplyStyles;
  placeholderTextColor: string;
  onClose: () => void;
  onReplyCountChange?: (annotationUuid: string, count: number) => void;
};

export function AnnotationReplyThreadSheet({
  annotation,
  documentApi,
  styles,
  placeholderTextColor,
  onClose,
  onReplyCountChange,
}: AnnotationReplyThreadSheetProps) {
  const [threadAnnotation, setThreadAnnotation] = useState(annotation);
  const [replies, setReplies] = useState<CPDFReplyAnnotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [composer, setComposer] = useState('');
  const [editingReply, setEditingReply] = useState<CPDFReplyAnnotation | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [replyActionTarget, setReplyActionTarget] = useState<CPDFReplyAnnotation | null>(null);
  const [threadActionsVisible, setThreadActionsVisible] = useState(false);
  const [statePicker, setStatePicker] = useState<StatePickerConfig | null>(null);
  const [confirmClearVisible, setConfirmClearVisible] = useState(false);
  const [confirmDeleteReply, setConfirmDeleteReply] = useState<CPDFReplyAnnotation | null>(null);

  useEffect(() => {
    let mounted = true;
    setThreadAnnotation(annotation);
    setReplies([]);
    setLoading(true);
    setMessage('');

    const load = async () => {
      if (!documentApi) {
        if (mounted) {
          setMessage('Document is not ready.');
          setLoading(false);
        }
        return;
      }
      try {
        const nextReplies = await documentApi.getAnnotationReplies(annotation);
        if (!mounted) {
          return;
        }
        setReplies(nextReplies);
        setLoading(false);
        onReplyCountChange?.(annotation.uuid, nextReplies.length);
      } catch (error) {
        Logger.error('getAnnotationReplies failed:', error);
        if (mounted) {
          setMessage('Failed to load replies.');
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, [annotation, documentApi, onReplyCountChange]);

  const reloadReplies = async (target = threadAnnotation) => {
    if (!documentApi) {
      setMessage('Document is not ready.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const nextReplies = await documentApi.getAnnotationReplies(target);
      setReplies(nextReplies);
      onReplyCountChange?.(target.uuid, nextReplies.length);
    } catch (error) {
      Logger.error('getAnnotationReplies failed:', error);
      setMessage('Failed to load replies.');
    } finally {
      setLoading(false);
      setSending(false);
    }
  };

  const sendReply = async () => {
    const content = composer.trim();
    if (!documentApi || !content || sending) {
      return;
    }
    Keyboard.dismiss();
    setMessage('');
    setSending(true);
    const reply = await documentApi.addAnnotationReply(threadAnnotation, {
      content,
      title: ANNOTATION_REPLY_AUTHOR,
    });
    if (!reply) {
      setSending(false);
      setMessage('Failed to add reply.');
      return;
    }
    setComposer('');
    await reloadReplies(threadAnnotation);
  };

  const saveEdit = async () => {
    const content = editContent.trim();
    if (!documentApi || !editingReply || !content) {
      return;
    }
    Keyboard.dismiss();
    const result = await documentApi.updateAnnotationReply(editingReply, {
      content,
      title: editTitle.trim(),
    });
    setEditingReply(null);
    if (!result) {
      setMessage('Failed to update reply.');
      return;
    }
    await reloadReplies(threadAnnotation);
  };

  const deleteReply = async (reply: CPDFReplyAnnotation) => {
    if (!documentApi) {
      return;
    }
    Keyboard.dismiss();
    const result = await documentApi.removeAnnotationReply(reply);
    setConfirmDeleteReply(null);
    if (!result) {
      setMessage('Failed to delete reply.');
      return;
    }
    await reloadReplies(threadAnnotation);
  };

  const clearReplies = async () => {
    if (!documentApi) {
      return;
    }
    Keyboard.dismiss();
    const result = await documentApi.removeAllAnnotationReplies(threadAnnotation);
    setConfirmClearVisible(false);
    if (!result) {
      setMessage('Failed to clear replies.');
      return;
    }
    await reloadReplies(threadAnnotation);
  };

  const setAnnotationMarkState = () => {
    pickState('Mark', Object.values(CPDFAnnotationMarkState), async (value) => {
      if (!documentApi) {
        return;
      }
      const markState = value as CPDFAnnotationMarkState;
      const result = await documentApi.setAnnotationMarkState(threadAnnotation, markState);
      if (!result) {
        setMessage('Failed to set mark state.');
        return;
      }
      setThreadAnnotation(new CPDFAnnotation({
        ...threadAnnotation,
        markState,
      }));
      await reloadReplies(threadAnnotation);
    });
  };

  const setAnnotationReviewState = () => {
    pickState('Review', Object.values(CPDFAnnotationReviewState), async (value) => {
      if (!documentApi) {
        return;
      }
      const reviewState = value as CPDFAnnotationReviewState;
      const result = await documentApi.setAnnotationReviewState(threadAnnotation, reviewState);
      if (!result) {
        setMessage('Failed to set review state.');
        return;
      }
      setThreadAnnotation(new CPDFAnnotation({
        ...threadAnnotation,
        reviewState,
      }));
      await reloadReplies(threadAnnotation);
    });
  };

  const setReplyMarkState = (reply: CPDFReplyAnnotation) => {
    pickState('Reply Mark', Object.values(CPDFAnnotationMarkState), async (value) => {
      if (!documentApi) {
        return;
      }
      const result = await documentApi.setAnnotationMarkState(
        reply,
        value as CPDFAnnotationMarkState,
      );
      if (!result) {
        setMessage('Failed to set reply mark state.');
        return;
      }
      await reloadReplies(threadAnnotation);
    });
  };

  const setReplyReviewState = (reply: CPDFReplyAnnotation) => {
    pickState('Reply Review', Object.values(CPDFAnnotationReviewState), async (value) => {
      if (!documentApi) {
        return;
      }
      const result = await documentApi.setAnnotationReviewState(
        reply,
        value as CPDFAnnotationReviewState,
      );
      if (!result) {
        setMessage('Failed to set reply review state.');
        return;
      }
      await reloadReplies(threadAnnotation);
    });
  };

  const pickState = (
    title: string,
    values: string[],
    onSelect: (value: string) => void,
  ) => {
    Keyboard.dismiss();
    setStatePicker({
      title,
      values,
      onSelect: (value) => {
        setStatePicker(null);
        void onSelect(value);
      },
    });
  };

  return (
    <>
      <AnnotationReplyThreadContent
        annotation={threadAnnotation}
        composer={composer}
        loading={loading}
        message={message}
        replies={replies}
        sending={sending}
        styles={styles}
        placeholderTextColor={placeholderTextColor}
        title={annotationDisplayTitle(threadAnnotation)}
        onChangeComposer={setComposer}
        onClose={onClose}
        onReplyAction={(reply) => {
          Keyboard.dismiss();
          setReplyActionTarget(reply);
        }}
        onSend={() => {
          void sendReply();
        }}
        onOpenThreadActions={() => {
          Keyboard.dismiss();
          setThreadActionsVisible(true);
        }}
      />

      <EditReplyModal
        content={editContent}
        title={editTitle}
        visible={editingReply != null}
        styles={styles}
        onCancel={() => setEditingReply(null)}
        onChangeContent={setEditContent}
        onChangeTitle={setEditTitle}
        onSave={() => {
          void saveEdit();
        }}
      />

      <ActionSheet
        visible={threadActionsVisible}
        title="Replies"
        actions={[
          { label: 'Mark', onPress: setAnnotationMarkState },
          { label: 'Review', onPress: setAnnotationReviewState },
          { label: 'Clear Replies', onPress: () => setConfirmClearVisible(true) },
          {
            label: 'Print JSON',
            onPress: () => {
              Logger.log(JSON.stringify(threadAnnotation, null, 2));
              Logger.log(JSON.stringify(replies, null, 2));
            },
          },
        ]}
        placement="popup"
        styles={styles}
        onClose={() => setThreadActionsVisible(false)}
      />

      <ActionSheet
        visible={replyActionTarget != null}
        title="Reply"
        actions={[
          {
            label: 'Edit',
            onPress: () => {
              if (replyActionTarget) {
                setEditingReply(replyActionTarget);
                setEditTitle(replyActionTarget.title);
                setEditContent(replyActionTarget.content);
              }
            },
          },
          {
            label: 'Delete',
            tone: 'danger',
            onPress: () => {
              if (replyActionTarget) {
                setConfirmDeleteReply(replyActionTarget);
              }
            },
          },
          {
            label: 'Mark State',
            onPress: () => replyActionTarget && setReplyMarkState(replyActionTarget),
          },
          {
            label: 'Review State',
            onPress: () => replyActionTarget && setReplyReviewState(replyActionTarget),
          },
        ]}
        placement="bottom"
        styles={styles}
        onClose={() => setReplyActionTarget(null)}
      />

      <ActionSheet
        visible={statePicker != null}
        title={statePicker?.title ?? ''}
        actions={(statePicker?.values ?? []).map((value) => ({
          label: value,
          onPress: () => statePicker?.onSelect(value),
        }))}
        placement="bottom"
        styles={styles}
        onClose={() => setStatePicker(null)}
      />

      <ConfirmModal
        visible={confirmClearVisible}
        title="Clear Replies"
        message="Remove all plain replies from this annotation?"
        confirmLabel="Clear"
        styles={styles}
        onCancel={() => setConfirmClearVisible(false)}
        onConfirm={() => {
          void clearReplies();
        }}
      />

      <ConfirmModal
        visible={confirmDeleteReply != null}
        title="Delete Reply"
        message="Delete this reply?"
        confirmLabel="Delete"
        styles={styles}
        onCancel={() => setConfirmDeleteReply(null)}
        onConfirm={() => {
          if (confirmDeleteReply) {
            void deleteReply(confirmDeleteReply);
          }
        }}
      />
    </>
  );
}

type AnnotationReplyThreadContentProps = {
  annotation: CPDFAnnotation;
  composer: string;
  loading: boolean;
  message: string;
  replies: CPDFReplyAnnotation[];
  sending: boolean;
  styles: AnnotationReplyStyles;
  placeholderTextColor: string;
  title: string;
  onChangeComposer: (value: string) => void;
  onClose: () => void;
  onReplyAction: (reply: CPDFReplyAnnotation) => void;
  onSend: () => void;
  onOpenThreadActions: () => void;
};

function AnnotationReplyThreadContent({
  annotation,
  composer,
  loading,
  message,
  replies,
  sending,
  styles,
  placeholderTextColor,
  title,
  onChangeComposer,
  onClose,
  onReplyAction,
  onSend,
  onOpenThreadActions,
}: AnnotationReplyThreadContentProps) {
  const canSend = composer.trim().length > 0 && !sending;

  return (
    <>
      <View style={styles.threadHeader}>
        <View style={styles.rowMain}>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {annotationDisplaySummary(annotation)}
          </Text>
          <View style={styles.chipRow}>
            <AnnotationStateChip label="Mark" value={annotation.markState} styles={styles} />
            <AnnotationStateChip label="Review" value={annotation.reviewState} styles={styles} />
          </View>
        </View>
        <Pressable style={styles.headerButton} onPress={onOpenThreadActions}>
          <Text style={styles.moreButtonLabel}>...</Text>
        </Pressable>
        <Pressable style={styles.headerButton} onPress={onClose}>
          <CloseIcon styles={styles} />
        </Pressable>
      </View>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {loading ? <Text style={styles.loading}>Loading...</Text> : null}
      <FlatList
        data={replies}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={styles.replyList}
        ListEmptyComponent={!loading ? <Text style={styles.empty}>No replies yet</Text> : null}
        renderItem={({ item }) => (
          <ReplyBubble reply={item} styles={styles} onAction={onReplyAction} />
        )}
      />
      <View style={styles.composer}>
        <View style={styles.inputShell}>
          <TextInput
            value={composer}
            onChangeText={onChangeComposer}
            placeholder="Add a reply"
            placeholderTextColor={placeholderTextColor}
            multiline
            style={styles.input}
          />
        </View>
        <Pressable
          disabled={!canSend}
          style={[
            styles.sendButton,
            !canSend ? styles.sendButtonDisabled : null,
          ]}
          onPress={onSend}
        >
          <Text style={styles.sendButtonLabel}>{sending ? '...' : '>'}</Text>
        </Pressable>
      </View>
    </>
  );
}

type SheetHeaderProps = {
  title: string;
  subtitle?: string;
  styles: AnnotationReplyStyles;
  onClose: () => void;
};

function SheetHeader({
  title,
  subtitle,
  styles,
  onClose,
}: SheetHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.rowMain}>
        <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.headerSubtitle} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      <Pressable style={styles.headerButton} onPress={onClose}>
        <CloseIcon styles={styles} />
      </Pressable>
    </View>
  );
}

type AnnotationStateChipProps = {
  label: string;
  value: string;
  styles: AnnotationReplyStyles;
};

function AnnotationStateChip({
  label,
  value,
  styles,
}: AnnotationStateChipProps) {
  return (
    <View style={styles.stateChip}>
      <Text style={styles.stateChipValue}>{`${label}: ${value}`}</Text>
    </View>
  );
}

type ReplyBubbleProps = {
  reply: CPDFReplyAnnotation;
  styles: AnnotationReplyStyles;
  onAction: (reply: CPDFReplyAnnotation) => void;
};

function ReplyBubble({
  reply,
  styles,
  onAction,
}: ReplyBubbleProps) {
  return (
    <View style={styles.replyBubble}>
      <View style={styles.replyHeader}>
        <Text style={styles.replyAuthor} numberOfLines={1}>
          {reply.title || ANNOTATION_REPLY_AUTHOR}
        </Text>
        <Pressable style={styles.moreButton} onPress={() => onAction(reply)}>
          <Text style={styles.moreButtonLabel}>...</Text>
        </Pressable>
      </View>
      <Text style={styles.replyContent}>{reply.content}</Text>
      <Text style={styles.replyMeta}>{formatReplyMeta(reply)}</Text>
    </View>
  );
}

function CloseIcon({ styles }: { styles: AnnotationReplyStyles }) {
  return (
    <Image
      source={require('../../../../assets/close.png')}
      style={styles.closeIcon}
      resizeMode="contain"
    />
  );
}
