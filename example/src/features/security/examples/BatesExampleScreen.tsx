/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 */

import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CPDFBates } from '@compdfkit_pdf_sdk/react_native';

import { SecurityExampleScaffold } from '../shared/SecurityExampleScaffold';
import { describeError } from '../../../util/exampleError';

export default function BatesExampleScreen() {
  const [bates, setBates] = useState<CPDFBates | null>(null);
  const [isReadDialogVisible, setReadDialogVisible] = useState(false);

  return (
    <SecurityExampleScaffold
      title="Bates Numbering"
      subtitle="Apply, inspect, update, or clear Bates numbering."
      actions={[
        {
          key: 'apply-bates',
          label: 'Apply Bates',
          onPress: async (reader) => {
            try {
              await reader._pdfDocument.updateBates(await createBates(reader._pdfDocument, 'CASE-'));
            } catch (error) {
              showError(error);
            }
          },
        },
        {
          key: 'read-bates',
          label: 'Read Bates',
          onPress: async (reader) => {
            try {
              setBates(await reader._pdfDocument.getBates());
              setReadDialogVisible(true);
            } catch (error) {
              showError(error);
            }
          },
        },
        {
          key: 'update-bates',
          label: 'Update Bates',
          onPress: async (reader) => {
            try {
              await reader._pdfDocument.updateBates(await createBates(reader._pdfDocument, 'UPDATED-'));
            } catch (error) {
              showError(error);
            }
          },
        },
        {
          key: 'clear-bates',
          label: 'Clear Bates',
          onPress: async (reader) => {
            try {
              await reader._pdfDocument.clearBates();
            } catch (error) {
              showError(error);
            }
          },
        },
      ]}
    >
      <BatesDetailsDialog
        value={bates}
        visible={isReadDialogVisible}
        onClose={() => setReadDialogVisible(false)}
      />
    </SecurityExampleScaffold>
  );
}

async function createBates(document: { getPageCount: () => Promise<number> }, prefix: string): Promise<CPDFBates> {
  const pageCount = await document.getPageCount();
  return {
    pages: Array.from({ length: pageCount }, (_, index) => index),
    margin: { left: 36, top: 24, right: 36, bottom: 24 },
    pageOffset: 1,
    rule: 'v2',
    slots: [{ position: 'footer_right', text: `${prefix}<<#5#1#>>`, fontSize: 20, textColor: '#FF00BCD4' }],
  };
}

function showError(error: unknown) {
  Alert.alert('Bates Numbering', describeError(error));
}

type BatesDetailsDialogProps = {
  value: CPDFBates | null;
  visible: boolean;
  onClose: () => void;
};

function BatesDetailsDialog({ value, visible, onClose }: BatesDetailsDialogProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Bates Numbering</Text>
              <Text style={styles.subtitle}>Current document configuration</Text>
            </View>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            {!value ? <Text style={styles.emptyText}>No Bates numbering applied</Text> : <>
              <InfoCard label="Pages" value={value.pages.map(page => page + 1).join(', ') || 'None'} />
              <InfoCard label="Offset" value={String(value.pageOffset ?? 0)} />
              <InfoCard label="Rule" value={value.rule ?? 'v2'} />
              <Text style={styles.sectionTitle}>Slots</Text>
              {value.slots.map(slot => <View key={slot.position} style={styles.slotCard}>
                <Text style={styles.slotPosition}>{slot.position.replace('_', ' ')}</Text>
                <Text style={styles.slotText}>{slot.text || 'Empty'}</Text>
                <Text style={styles.slotMeta}>{(slot.fontSize ?? 12).toFixed(1)} pt</Text>
              </View>)}
            </>}
          </ScrollView>
          <Pressable accessibilityRole="button" onPress={onClose} style={styles.doneButton}>
            <Text style={styles.doneButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return <View style={styles.infoCard}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15, 23, 42, 0.42)' },
  card: { maxHeight: '84%', backgroundColor: '#FAFCFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 },
  title: { color: '#102A43', fontSize: 20, fontWeight: '700' },
  subtitle: { color: '#627D98', fontSize: 13, marginTop: 4 },
  closeButton: { padding: 2, marginTop: -4 },
  closeButtonText: { color: '#627D98', fontSize: 30, lineHeight: 30 },
  content: { paddingBottom: 8 },
  emptyText: { color: '#627D98', fontSize: 15, paddingVertical: 32, textAlign: 'center' },
  infoCard: { backgroundColor: '#EAF2FF', borderRadius: 12, padding: 12, marginBottom: 8 },
  infoLabel: { color: '#486581', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  infoValue: { color: '#102A43', fontSize: 14, lineHeight: 20 },
  sectionTitle: { color: '#102A43', fontSize: 16, fontWeight: '700', marginTop: 10, marginBottom: 8 },
  slotCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: '#D9E2EC' },
  slotPosition: { color: '#243B53', fontSize: 14, fontWeight: '700', textTransform: 'capitalize' },
  slotText: { color: '#102A43', fontSize: 15, marginTop: 3 },
  slotMeta: { color: '#627D98', fontSize: 12, marginTop: 3 },
  doneButton: { backgroundColor: '#335CFF', borderRadius: 12, alignItems: 'center', paddingVertical: 13, marginTop: 8 },
  doneButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
