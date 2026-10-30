/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ComPDFKit,
  CPDFEvent,
  CPDFReaderView,
  CPDFViewMode,
} from '@compdfkit_pdf_sdk/react_native';

import { AppToolbar } from '../../../widgets/common/AppToolbar';

type Policy = { continuousCreation: boolean; autoSelectCreatedAnnotation: boolean };

const POLICIES: Policy[] = [
  { continuousCreation: true, autoSelectCreatedAnnotation: true },
  { continuousCreation: true, autoSelectCreatedAnnotation: false },
  { continuousCreation: false, autoSelectCreatedAnnotation: true },
  { continuousCreation: false, autoSelectCreatedAnnotation: false },
];

const DOCUMENT = Platform.OS === 'android'
  ? 'file:///android_asset/PDF_Document.pdf'
  : 'PDF_Document.pdf';

function policyLabel(policy: Policy) {
  return `${policy.continuousCreation ? 'Continuous' : 'Single'} / ${policy.autoSelectCreatedAnnotation ? 'Auto-select' : 'No selection'}`;
}

/**
 * Demonstrates the four interactive creation policies. The policy is part of the reader
 * configuration, so changing it recreates the reader.
 */
export default function CreationPolicyExampleScreen() {
  const navigation = useNavigation();
  const readerRef = useRef<CPDFReaderView | null>(null);
  const [policy, setPolicy] = useState<Policy>(POLICIES[0]!);
  const [lastEvent, setLastEvent] = useState('Create an annotation or form field to inspect events.');

  const bindEvents = () => {
    const reader = readerRef.current;
    if (!reader) return;
    reader.addEventListener(CPDFEvent.ANNOTATIONS_CREATED, annotation => setLastEvent(`Annotation created: ${annotation.type}`));
    reader.addEventListener(CPDFEvent.ANNOTATIONS_SELECTED, annotation => setLastEvent(`Annotation selected: ${annotation.type}`));
    reader.addEventListener(CPDFEvent.ANNOTATIONS_DESELECTED, () => setLastEvent('Annotation deselected'));
    reader.addEventListener(CPDFEvent.FORM_FIELDS_CREATED, widget => setLastEvent(`Form field created: ${widget.type}`));
    reader.addEventListener(CPDFEvent.FORM_FIELDS_SELECTED, widget => setLastEvent(`Form field selected: ${widget.type}`));
    reader.addEventListener(CPDFEvent.FORM_FIELDS_DESELECTED, () => setLastEvent('Form field deselected'));
  };

  const selectPolicy = (next: Policy) => {
    setPolicy(next);
    setLastEvent('Policy updated. Create an annotation or form field to test it.');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <AppToolbar title="Creation Policy" subtitle={policyLabel(policy)} onBackPress={() => navigation.goBack()} />
      <View style={styles.panel}>
        <View style={styles.options}>
          {POLICIES.map(item => {
            const selected = item.continuousCreation === policy.continuousCreation
              && item.autoSelectCreatedAnnotation === policy.autoSelectCreatedAnnotation;
            return (
              <Pressable
                key={policyLabel(item)}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => selectPolicy(item)}
                style={[styles.option, selected && styles.optionSelected]}>
                <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{policyLabel(item)}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text numberOfLines={1} style={styles.event}>{lastEvent}</Text>
      </View>
      <CPDFReaderView
        key={policyLabel(policy)}
        ref={readerRef}
        document={DOCUMENT}
        configuration={ComPDFKit.getDefaultConfig({
          modeConfig: { initialViewMode: CPDFViewMode.ANNOTATIONS },
          creationConfig: policy,
        })}
        onViewCreated={bindEvents}
        onIOSClickBackPressed={() => navigation.goBack()}
        style={styles.reader}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: '#F5F7FA', flex: 1 },
  panel: { backgroundColor: '#FFFFFF', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#D9E2EC', paddingHorizontal: 12, paddingVertical: 8 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  option: { borderColor: '#BCCCDC', borderRadius: 6, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  optionSelected: { backgroundColor: '#1460F3', borderColor: '#1460F3' },
  optionText: { color: '#243B53', fontSize: 12, fontWeight: '600' },
  optionTextSelected: { color: '#FFFFFF' },
  event: { color: '#486581', fontSize: 12, marginTop: 8 },
  reader: { flex: 1 },
});
