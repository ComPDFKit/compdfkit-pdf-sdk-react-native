import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import type { CPDFPdfStandardType } from '@compdfkit_pdf_sdk/react_native';

type Props = {
  targetType: CPDFPdfStandardType;
  fontSubset: boolean;
  isConverting: boolean;
  canOpenOutput: boolean;
  onTargetPress: () => void;
  onFontSubsetChange: (value: boolean) => void;
  onConvert: () => void;
  onOpenOutput: () => void;
};

export function PdfStandardControls({
  targetType,
  fontSubset,
  isConverting,
  canOpenOutput,
  onTargetPress,
  onFontSubsetChange,
  onConvert,
  onOpenOutput,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Target Standard</Text>
      <Pressable
        accessibilityRole="button"
        disabled={isConverting}
        onPress={onTargetPress}
        style={({ pressed }) => [styles.select, pressed && !isConverting && styles.pressed]}
      >
        <Text style={styles.selectValue}>{targetType}</Text>
        <Text style={styles.chevron}>v</Text>
      </Pressable>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Save font subset</Text>
        <Switch
          value={fontSubset}
          disabled={isConverting}
          onValueChange={onFontSubsetChange}
          trackColor={{ false: '#BCCCDC', true: '#1460F3' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#BCCCDC"
        />
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          disabled={isConverting}
          onPress={onConvert}
          style={({ pressed }) => [styles.button, styles.convertButton, isConverting && styles.disabled, pressed && !isConverting && styles.pressed]}
        >
          <Text style={styles.convertText}>{isConverting ? 'Converting...' : 'Convert'}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={!canOpenOutput || isConverting}
          onPress={onOpenOutput}
          style={({ pressed }) => [styles.button, styles.outputButton, (!canOpenOutput || isConverting) && styles.disabled, pressed && canOpenOutput && !isConverting && styles.pressed]}
        >
          <Text style={styles.outputText}>Open output</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFFFFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#D9E2EC', paddingHorizontal: 16, paddingVertical: 12 },
  label: { color: '#243B53', fontSize: 13, fontWeight: '600' },
  select: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#BCCCDC', borderRadius: 6, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 12, paddingVertical: 10 },
  selectValue: { color: '#102A43', fontSize: 14 },
  chevron: { color: '#486581', fontSize: 14 },
  switchRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  button: { alignItems: 'center', borderRadius: 6, flex: 1, paddingVertical: 10 },
  convertButton: { backgroundColor: '#1460F3' },
  outputButton: { backgroundColor: '#FFFFFF', borderColor: '#1460F3', borderWidth: 1 },
  convertText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  outputText: { color: '#1460F3', fontSize: 14, fontWeight: '700' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.8 },
});
