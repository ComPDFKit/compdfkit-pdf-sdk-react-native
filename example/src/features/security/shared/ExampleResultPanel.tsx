/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export type ExampleResult = {
  status: 'success' | 'error' | 'info';
  title: string;
  lines?: string[];
};

/** Shows the outcome of the last example action above the reader. */
export function ExampleResultPanel({ result, placeholder }: { result: ExampleResult | null; placeholder: string }) {
  return (
    <View style={styles.container}>
      {result == null ? (
        <Text style={styles.placeholder}>{placeholder}</Text>
      ) : (
        <ScrollView style={styles.scroll} nestedScrollEnabled>
          <Text style={[styles.title, result.status === 'error' && styles.error, result.status === 'success' && styles.success]}>
            {result.title}
          </Text>
          {result.lines?.map((line, index) => (
            <Text key={index} style={styles.line} selectable>{line}</Text>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFFFFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#D9E2EC', paddingHorizontal: 12, paddingVertical: 8 },
  scroll: { maxHeight: 132 },
  placeholder: { color: '#627D98', fontSize: 12 },
  title: { color: '#243B53', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  success: { color: '#1B7F3B' },
  error: { color: '#C92A2A' },
  line: { color: '#486581', fontSize: 12, lineHeight: 17 },
});
