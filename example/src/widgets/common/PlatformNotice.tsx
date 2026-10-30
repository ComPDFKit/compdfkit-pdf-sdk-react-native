/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

type Props = {
  /** Shown only on iOS. */
  ios?: string;
  /** Shown only on Android. */
  android?: string;
};

/** A one-line note about a platform difference of the example being shown. */
export function PlatformNotice({ ios, android }: Props) {
  const message = Platform.OS === 'ios' ? ios : Platform.OS === 'android' ? android : undefined;
  if (!message) {
    return null;
  }
  return (
    <View style={styles.container} accessibilityRole="text">
      <Text style={styles.label}>{Platform.OS === 'ios' ? 'iOS' : 'Android'}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E1',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#FFE082',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: { color: '#8D6E00', fontSize: 11, fontWeight: '700', marginTop: 1 },
  message: { color: '#5D4600', flex: 1, fontSize: 12, lineHeight: 17 },
});
