/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { AppToolbar } from '../../../../widgets/common/AppToolbar';
import { certificateColors as colors } from '../certificateTheme';
import { useCertificateSession } from '../useCertificateSession';

/** Shared scrollable shell keeps forms usable above the keyboard on both platforms. */
export function CertificatePage({
  title,
  onBack,
  children,
  busy = false,
}: React.PropsWithChildren<{
  title: string;
  onBack: () => void;
  busy?: boolean;
}>) {
  const { message, dismissMessage } = useCertificateSession();
  const focused = useIsFocused();
  useEffect(() => {
    if (!message || !focused) return undefined;
    const timer = setTimeout(dismissMessage, 4500);
    return () => clearTimeout(timer);
  }, [message, dismissMessage, focused]);

  return (
    <SafeAreaView style={styles.safe}>
      <AppToolbar title={title} onBackPress={busy ? undefined : onBack} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
      {message && focused ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss message"
          onPress={dismissMessage}
          style={styles.snackbar}
        >
          <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.message}>
            {message}
          </Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28, gap: 20 },
  snackbar: {
    backgroundColor: '#323232',
    paddingHorizontal: 16,
    paddingVertical: 14,
    margin: 12,
    borderRadius: 6,
  },
  message: { color: '#FFFFFF', fontSize: 13, lineHeight: 19 },
});
