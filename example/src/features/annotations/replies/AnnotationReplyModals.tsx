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
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { AnnotationReplyStyles } from './annotationReplyStyles';

export type ActionSheetAction = {
  label: string;
  tone?: 'danger';
  onPress: () => void;
};

type ActionSheetPlacement = 'center' | 'bottom' | 'popup';

type EditReplyModalProps = {
  content: string;
  title: string;
  visible: boolean;
  styles: AnnotationReplyStyles;
  onCancel: () => void;
  onChangeContent: (value: string) => void;
  onChangeTitle: (value: string) => void;
  onSave: () => void;
};

export function EditReplyModal({
  content,
  title,
  visible,
  styles,
  onCancel,
  onChangeContent,
  onChangeTitle,
  onSave,
}: EditReplyModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.dialogBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={styles.dialog}>
          <Text style={styles.dialogTitle}>Edit Reply</Text>
          <Text style={styles.dialogFieldLabel}>Title</Text>
          <TextInput value={title} onChangeText={onChangeTitle} style={styles.dialogInput} />
          <Text style={styles.dialogFieldLabel}>Content</Text>
          <TextInput
            value={content}
            onChangeText={onChangeContent}
            multiline
            style={[styles.dialogInput, styles.dialogTextArea]}
          />
          <View style={styles.dialogActions}>
            <Pressable style={styles.textButton} onPress={onCancel}>
              <Text style={styles.textButtonLabel}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={onSave}>
              <Text style={styles.primaryButtonLabel}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

type ActionSheetProps = {
  visible: boolean;
  title: string;
  actions: ActionSheetAction[];
  placement?: ActionSheetPlacement;
  styles: AnnotationReplyStyles;
  onClose: () => void;
};

export function ActionSheet({
  visible,
  title,
  actions,
  placement = 'center',
  styles,
  onClose,
}: ActionSheetProps) {
  const containerStyle =
    placement === 'bottom'
      ? styles.bottomSheetBackdrop
      : placement === 'popup'
        ? styles.popupBackdrop
        : styles.dialogBackdrop;
  const sheetStyle =
    placement === 'bottom'
      ? styles.bottomActionSheet
      : placement === 'popup'
        ? styles.popupActionSheet
        : styles.actionSheet;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={containerStyle}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={sheetStyle}>
          {placement === 'bottom' ? (
            <View style={styles.actionSheetHeader}>
              <Text style={styles.dialogTitle}>{title}</Text>
              <Pressable style={styles.headerButton} onPress={onClose}>
                <CloseIcon styles={styles} />
              </Pressable>
            </View>
          ) : placement === 'popup' ? null : (
            <Text style={styles.dialogTitle}>{title}</Text>
          )}
          {actions.map((action) => (
            <Pressable
              key={action.label}
              style={styles.actionRow}
              onPress={() => {
                onClose();
                action.onPress();
              }}
            >
              <Text style={action.tone === 'danger' ? styles.dangerText : styles.actionLabel}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  styles: AnnotationReplyStyles;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel,
  styles,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.dialogBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={styles.dialog}>
          <Text style={styles.dialogTitle}>{title}</Text>
          <Text style={styles.dialogMessage}>{message}</Text>
          <View style={styles.dialogActions}>
            <Pressable style={styles.textButton} onPress={onCancel}>
              <Text style={styles.textButtonLabel}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.primaryButton, styles.deleteButton]} onPress={onConfirm}>
              <Text style={styles.primaryButtonLabel}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
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
