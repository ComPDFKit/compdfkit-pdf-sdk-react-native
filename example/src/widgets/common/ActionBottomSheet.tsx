import React, { type ReactNode } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '../../theme/appTheme';

type Props = {
  visible?: boolean;
  title: string;
  category: string;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  children: ReactNode;
};

export function ActionBottomSheet({
  visible = true, title, category, onClose, actionLabel, onAction, actionDisabled, children,
}: Props) {
  const { colors, mode } = useAppTheme();
  const actionTextColor = mode === 'dark' ? colors.background : colors.inverseText;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessible={false}
          importantForAccessibility="no"
        />
        <SafeAreaView
          edges={['left', 'right', 'bottom']}
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
          style={[styles.sheet, { backgroundColor: colors.surface }]}
        >
          <View style={[styles.handle, { backgroundColor: colors.outline }]} />
          <View style={styles.header}>
            <Text style={[styles.category, { color: colors.textSecondary }]}>{category}</Text>
            <Text accessibilityRole="header" style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
          </View>
          {children}
          <View style={[styles.footer, { borderColor: colors.outlineVariant }]}>
            {onAction && (
              <Pressable
                accessibilityRole="button"
                onPress={onClose}
                style={({ pressed }) => [styles.button, { borderColor: colors.outline }, pressed && styles.dimmed]}
              >
                <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Cancel</Text>
              </Pressable>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: Boolean(actionDisabled) }}
              disabled={actionDisabled}
              onPress={onAction ?? onClose}
              style={({ pressed }) => [
                styles.button, styles.primary, { backgroundColor: colors.primary },
                (pressed || actionDisabled) && styles.dimmed,
              ]}
            >
              <Text style={[styles.buttonText, { color: actionTextColor }]}>{actionLabel ?? 'Done'}</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#09132699' },
  sheet: {
    width: '100%', maxWidth: 540, maxHeight: '90%', alignSelf: 'center',
    borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: 'hidden',
  },
  handle: { width: 32, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 4 },
  category: { fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  title: { fontSize: 22, fontWeight: '700' },
  footer: { flexDirection: 'row', gap: 8, borderTopWidth: StyleSheet.hairlineWidth, padding: 16 },
  button: {
    flex: 1, minHeight: 48, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1,
  },
  primary: { flex: 1.5, borderWidth: 0 },
  buttonText: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  dimmed: { opacity: 0.55 },
});
