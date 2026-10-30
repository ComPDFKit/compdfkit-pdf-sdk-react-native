import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { OptimizeLogEntry } from '../shared/optimizeSaveAsCopy';

export function OptimizeLogPanel({ entries }: { entries: OptimizeLogEntry[] }) {
  return <View style={styles.container}><Text style={styles.title}>Optimization activity</Text>{entries.length === 0 ? <Text style={styles.empty}>No optimization activity yet.</Text> : <View style={styles.content}>{entries.map(entry => <View key={entry.id} style={styles.entry}><View style={styles.header}><Text numberOfLines={1} style={styles.document}>{entry.documentName}</Text><Text style={[styles.status, entry.status === 'error' && styles.error]}>{entry.status === 'success' ? 'Completed' : entry.status === 'cancelled' ? 'Cancelled' : 'Failed'}</Text></View><Text style={styles.detail}>Before: {formatFileSize(entry.sourceSize)}  After: {formatFileSize(entry.outputSize)}</Text>{entry.status === 'success' && <Text style={styles.detail}>Reduced: {formatReduction(entry.sourceSize, entry.outputSize)}</Text>}<Text numberOfLines={2} style={styles.detail}>{entry.detail}</Text></View>)}</View>}</View>;
}

function formatFileSize(bytes: number) { return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`; }
function formatReduction(before: number, after: number) { return before > 0 ? `${Math.max(0, Math.round((1 - after / before) * 100))}%` : '-'; }

const styles = StyleSheet.create({ container: { backgroundColor: '#F5F7FA', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#D9E2EC', flex: 1, paddingHorizontal: 16, paddingTop: 10 }, title: { color: '#243B53', fontSize: 13, fontWeight: '700', marginBottom: 6 }, empty: { color: '#627D98', fontSize: 12 }, content: { gap: 7, paddingBottom: 10 }, entry: { backgroundColor: '#FFFFFF', borderColor: '#D9E2EC', borderRadius: 6, borderWidth: StyleSheet.hairlineWidth, padding: 9 }, header: { alignItems: 'center', flexDirection: 'row' }, document: { color: '#102A43', flex: 1, fontSize: 13, fontWeight: '700', marginRight: 8 }, status: { color: '#1460F3', fontSize: 11, fontWeight: '700' }, error: { color: '#C92A2A' }, detail: { color: '#486581', fontSize: 11, lineHeight: 16, marginTop: 2 } });
