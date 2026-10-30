import React from 'react';
import { Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import type { CPDFOptimizeFlag, CPDFOptimizeOptions } from '@compdfkit_pdf_sdk/react_native';

type Props = {
  options: CPDFOptimizeOptions;
  fontSubset: boolean;
  isOptimizing: boolean;
  progressPage: number | null;
  canOpenOutput: boolean;
  onOptionsChange: (options: CPDFOptimizeOptions) => void;
  onFontSubsetChange: (value: boolean) => void;
  onOptimize: () => void;
  onCancel: () => void;
  onOpenOutput: () => void;
};

const flags: Array<[CPDFOptimizeFlag, string]> = [
  ['compress_images', 'Compress images'], ['remove_bookmarks', 'Remove bookmarks'],
  ['remove_javascript_actions', 'Remove JavaScript'], ['remove_embedded_fonts', 'Remove embedded fonts'],
  ['optimize_page_content', 'Optimize page content'], ['fast_web_view', 'Fast web view'],
];

export function OptimizeControls(props: Props) {
  const { options, fontSubset, isOptimizing } = props;
  const setQuality = (offset: number) => {
    const quality = Math.max(1, Math.min(100, options.imageQuality + offset));
    props.onOptionsChange({
      ...options,
      imageQuality: quality,
      colorImageOptions: { ...options.colorImageOptions, quality },
      grayscaleImageOptions: { ...options.grayscaleImageOptions, quality },
      monochromeImageOptions: { ...options.monochromeImageOptions, quality },
    });
  };
  const toggle = (flag: CPDFOptimizeFlag, enabled: boolean) => {
    const next = new Set(options.flags);
    enabled ? next.add(flag) : next.delete(flag);
    props.onOptionsChange({ ...options, flags: [...next] });
  };

  return <View style={styles.container}>
    <View style={styles.qualityRow}>
      <Text style={styles.label}>Image quality</Text>
      <View style={styles.stepper}>
        <Pressable accessibilityRole="button" accessibilityLabel="Decrease image quality" disabled={isOptimizing} onPress={() => setQuality(-5)} style={[styles.stepButton, isOptimizing && styles.dimmed]}>
          <Text style={styles.stepText}>−</Text>
        </Pressable>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{Math.round(options.imageQuality)}</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Increase image quality" disabled={isOptimizing} onPress={() => setQuality(5)} style={[styles.stepButton, isOptimizing && styles.dimmed]}>
          <Text style={styles.stepText}>+</Text>
        </Pressable>
      </View>
    </View>
    <Text style={styles.hint}>Applies to all image groups when Compress images is enabled. Lower quality reduces image detail and file size; 100 skips image recompression.</Text>
    {flags.map(([flag, label]) => <View key={flag} style={styles.switchRow}><Text style={styles.label}>{label}</Text><Switch style={styles.switch} value={options.flags.includes(flag)} disabled={isOptimizing} onValueChange={value => toggle(flag, value)} trackColor={{ false: '#BCCCDC', true: '#1460F3' }} thumbColor="#FFFFFF" /></View>)}
    {Platform.OS === 'android' ? <View style={styles.switchRow}><Text style={styles.label}>Save font subset</Text><Switch style={styles.switch} accessibilityLabel="Save font subset" accessibilityState={{ disabled: isOptimizing }} value={fontSubset} disabled={isOptimizing} onValueChange={props.onFontSubsetChange} trackColor={{ false: '#BCCCDC', true: '#1460F3' }} thumbColor="#FFFFFF" /></View> : null}
    <View style={styles.actions}><Pressable accessibilityRole="button" disabled={isOptimizing} onPress={props.onOptimize} style={({ pressed }) => [styles.button, styles.primary, (isOptimizing || pressed) && styles.dimmed]}><Text style={styles.primaryText}>{isOptimizing ? (props.progressPage ? `Optimizing page ${props.progressPage}...` : 'Optimizing...') : 'Optimize'}</Text></Pressable>{isOptimizing ? <Pressable accessibilityRole="button" onPress={props.onCancel} style={({ pressed }) => [styles.button, styles.secondary, pressed && styles.dimmed]}><Text style={styles.secondaryText}>Cancel</Text></Pressable> : null}<Pressable accessibilityRole="button" disabled={!props.canOpenOutput || isOptimizing} onPress={props.onOpenOutput} style={({ pressed }) => [styles.button, styles.secondary, (!props.canOpenOutput || isOptimizing || pressed) && styles.dimmed]}><Text style={styles.secondaryText}>Open output</Text></Pressable></View>
  </View>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFFFFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#D9E2EC', paddingHorizontal: 16, paddingVertical: 12 },
  hint: { color: '#52606D', fontSize: 12, lineHeight: 17, marginBottom: 8 },
  switch: { alignSelf: 'center' },
  qualityRow: { alignItems: 'center', flexDirection: 'row', minHeight: 44 }, switchRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', minHeight: 44 }, label: { color: '#243B53', flex: 1, fontSize: 13, fontWeight: '600', includeFontPadding: false, lineHeight: 20 },
  stepper: { alignItems: 'center', flexDirection: 'row' }, stepButton: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#BCCCDC', borderRadius: 4, borderWidth: 1, height: 44, justifyContent: 'center', width: 44 }, stepText: { color: '#1460F3', fontSize: 20, fontWeight: '700', includeFontPadding: false, lineHeight: 24, textAlign: 'center' }, valueContainer: { alignItems: 'center', justifyContent: 'center', minHeight: 44, minWidth: 40 }, value: { color: '#102A43', fontSize: 13, fontWeight: '700', includeFontPadding: false, lineHeight: 20, textAlign: 'center' },
  actions: { alignItems: 'stretch', flexDirection: 'row', gap: 8, marginTop: 10 }, button: { alignItems: 'center', borderRadius: 6, flex: 1, justifyContent: 'center', minHeight: 44, paddingHorizontal: 8, paddingVertical: 10 }, primary: { backgroundColor: '#1460F3' }, secondary: { backgroundColor: '#FFFFFF', borderColor: '#1460F3', borderWidth: 1 }, primaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', includeFontPadding: false, lineHeight: 20, textAlign: 'center' }, secondaryText: { color: '#1460F3', fontSize: 14, fontWeight: '700', includeFontPadding: false, lineHeight: 20, textAlign: 'center' }, dimmed: { opacity: 0.45 },
});
