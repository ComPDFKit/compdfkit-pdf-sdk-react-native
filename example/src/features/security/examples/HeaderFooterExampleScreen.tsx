/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  CPDFHeaderFooter,
  CPDFReaderView,
} from '@compdfkit_pdf_sdk/react_native';

import { SecurityExampleScaffold } from '../shared/SecurityExampleScaffold';

export default function HeaderFooterExampleScreen() {
  const [readValue, setReadValue] = useState<CPDFHeaderFooter | null>(null);
  const [isReadDialogVisible, setReadDialogVisible] = useState(false);

  return (
    <SecurityExampleScaffold
      title="Header & Footer"
      subtitle="Apply, inspect, update, and clear document header/footer content."
      actions={[
        {
          key: 'apply',
          label: 'Apply',
          onPress: async (reader) => reader._pdfDocument.updateHeaderFooter(await createValue(reader, false)),
        },
        {
          key: 'read',
          label: 'Read',
          onPress: async (reader) => {
            setReadValue(await reader._pdfDocument.getHeaderFooter());
            setReadDialogVisible(true);
          },
        },
        {
          key: 'update',
          label: 'Update',
          onPress: async (reader) => reader._pdfDocument.updateHeaderFooter(await createValue(reader, true)),
        },
        {
          key: 'clear',
          label: 'Clear',
          onPress: (reader) => reader._pdfDocument.clearHeaderFooter(),
        },
      ]}>
      <HeaderFooterDetailsModal
        value={readValue}
        visible={isReadDialogVisible}
        onClose={() => setReadDialogVisible(false)}
      />
    </SecurityExampleScaffold>
  );
}

async function createValue(reader: CPDFReaderView, updated: boolean): Promise<CPDFHeaderFooter> {
  const pageCount = await reader._pdfDocument.getPageCount();
  return {
    pages: Array.from({ length: pageCount }, (_, index) => index),
    margin: updated
      ? { left: 48, top: 36, right: 48, bottom: 36 }
      : { left: 36, top: 36, right: 36, bottom: 36 },
    slots: updated
      ? [
        { position: 'header_left', text: 'ComPDF 3.2.0', fontSize: 11 },
        { position: 'footer_center', text: 'Updated page <<1>>', fontSize: 11 },
      ]
      : [
        { position: 'header_left', text: 'ComPDF', fontSize: 10 },
        { position: 'header_right', text: 'Confidential', fontSize: 10, textColor: '#FFFF0000' },
        { position: 'footer_center', text: 'Page <<1>>', fontSize: 10 },
      ],
  };
}

type HeaderFooterDetailsModalProps = {
  value: CPDFHeaderFooter | null;
  visible: boolean;
  onClose: () => void;
};

function HeaderFooterDetailsModal({
  value,
  visible,
  onClose,
}: HeaderFooterDetailsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Header & Footer</Text>
              <Text style={styles.modalSubtitle}>Current document configuration</Text>
            </View>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </Pressable>
          </View>
          <ScrollView style={styles.modalScroll} contentContainerStyle={styles.modalContent}>
            {!value ? (
              <Text style={styles.emptyText}>No header/footer applied</Text>
            ) : (
              <>
                <InfoCard
                  label="Applied pages"
                  value={value.pages.length ? value.pages.map(page => page + 1).join(', ') : 'None'}
                />
                <InfoCard
                  label="Margins"
                  value={`Left ${value.margin.left.toFixed(1)}  Top ${value.margin.top.toFixed(1)}  Right ${value.margin.right.toFixed(1)}  Bottom ${value.margin.bottom.toFixed(1)}`}
                />
                <Text style={styles.sectionTitle}>Positions</Text>
                {value.slots.map((slot) => (
                  <View key={slot.position} style={styles.slotCard}>
                    <View style={[styles.colorDot, { backgroundColor: slot.textColor ?? '#FF000000' }]} />
                    <View style={styles.slotTextWrap}>
                      <Text style={styles.slotPosition}>{positionLabel(slot.position)}</Text>
                      <Text style={styles.slotText}>{slot.text || 'Empty'}</Text>
                      <Text style={styles.slotMeta}>{slot.fontName ?? 'Helvetica'} · {(slot.fontSize ?? 12).toFixed(1)} pt</Text>
                    </View>
                  </View>
                ))}
              </>
            )}
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
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function positionLabel(position: CPDFHeaderFooter['slots'][number]['position']) {
  const labels: Record<typeof position, string> = {
    header_left: 'Header · Left',
    header_center: 'Header · Center',
    header_right: 'Header · Right',
    footer_left: 'Footer · Left',
    footer_center: 'Footer · Center',
    footer_right: 'Footer · Right',
  };
  return labels[position];
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.42)',
  },
  modalCard: {
    maxHeight: '84%',
    backgroundColor: '#FAFCFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: { color: '#102A43', fontSize: 20, fontWeight: '700' },
  modalSubtitle: { color: '#627D98', fontSize: 13, marginTop: 4 },
  closeButton: { padding: 2, marginTop: -4 },
  closeButtonText: { color: '#627D98', fontSize: 30, lineHeight: 30 },
  modalScroll: { flexGrow: 0 },
  modalContent: { paddingBottom: 8 },
  emptyText: { color: '#627D98', fontSize: 15, paddingVertical: 32, textAlign: 'center' },
  infoCard: {
    backgroundColor: '#EAF2FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  infoLabel: { color: '#486581', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  infoValue: { color: '#102A43', fontSize: 14, lineHeight: 20 },
  sectionTitle: { color: '#102A43', fontSize: 16, fontWeight: '700', marginTop: 10, marginBottom: 8 },
  slotCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#D9E2EC',
  },
  colorDot: { width: 10, height: 10, borderRadius: 5, marginTop: 5, marginRight: 10 },
  slotTextWrap: { flex: 1 },
  slotPosition: { color: '#243B53', fontSize: 14, fontWeight: '700' },
  slotText: { color: '#102A43', fontSize: 15, marginTop: 3 },
  slotMeta: { color: '#627D98', fontSize: 12, marginTop: 3 },
  doneButton: { backgroundColor: '#335CFF', borderRadius: 12, alignItems: 'center', paddingVertical: 13, marginTop: 8 },
  doneButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
