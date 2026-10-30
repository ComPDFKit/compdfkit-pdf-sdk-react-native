import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { PdfStandardLogEntry } from '../shared/pdfStandardConversion';

type Props = { entries: PdfStandardLogEntry[] };

export function PdfStandardLogPanel({ entries }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversion activity</Text>
      {entries.length === 0 ? <Text style={styles.empty}>No conversion activity yet.</Text> : (
        <ScrollView contentContainerStyle={styles.content} style={styles.scroll}>
          {entries.map(entry => (
            <View key={entry.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.document} numberOfLines={1}>{entry.documentName}</Text>
                <Text style={[styles.status, entry.status === 'error' && styles.error]}>{entry.status === 'error' ? 'Failed' : entry.status === 'success' ? 'Completed' : 'Opened'}</Text>
              </View>
              <Text style={styles.detail}>Before: {entry.sourceType}  After: {entry.targetType}</Text>
              <Text style={styles.detail} numberOfLines={2}>{entry.detail}</Text>
              <Text style={styles.time}>{entry.createdAt}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#F5F7FA', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#D9E2EC', flex: 1, paddingHorizontal: 16, paddingTop: 10 },
  title: { color: '#243B53', fontSize: 13, fontWeight: '700', marginBottom: 6 },
  empty: { color: '#627D98', fontSize: 12, paddingBottom: 12 },
  scroll: { flex: 1 }, content: { gap: 7, paddingBottom: 10 },
  entry: { backgroundColor: '#FFFFFF', borderColor: '#D9E2EC', borderRadius: 6, borderWidth: StyleSheet.hairlineWidth, padding: 9 },
  entryHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, document: { color: '#102A43', flex: 1, fontSize: 13, fontWeight: '700', marginRight: 8 },
  status: { color: '#1460F3', fontSize: 11, fontWeight: '700' }, error: { color: '#C92A2A' }, detail: { color: '#486581', fontSize: 11, lineHeight: 16, marginTop: 2 }, time: { color: '#829AB1', fontSize: 10, marginTop: 3 },
});
