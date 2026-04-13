/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import PDFReaderContext, { CPDFReaderView, CPDFWidget } from '@compdfkit_pdf_sdk/react_native';

type CPDFFormWidgetListScreenProps = {
  visible: boolean;
  widgets: CPDFWidget[];
  onClose: () => void;
};

export function CPDFFormWidgetListScreen({
  visible,
  widgets,
  onClose,
}: CPDFFormWidgetListScreenProps) {
  const pdfReader = React.useContext(PDFReaderContext) as CPDFReaderView | null;

  const groupedWidgets = widgets.reduce((accumulator, widget) => {
    if (!accumulator[widget.page]) {
      accumulator[widget.page] = [];
    }
    accumulator[widget.page]!.push(widget);
    return accumulator;
  }, {} as Record<number, CPDFWidget[]>);

  const flattenedData: Array<CPDFWidget | { isTitle: true; page: number; total: number }> = [];
  Object.entries(groupedWidgets).forEach(([page, items]) => {
    flattenedData.push({ isTitle: true, page: Number(page), total: items.length });
    flattenedData.push(...items);
  });

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Form Fields</Text>
              <FlatList
                data={flattenedData}
                keyExtractor={item => ('isTitle' in item ? `title-${item.page}` : item.uuid)}
                renderItem={({ item }) => {
                  if ('isTitle' in item) {
                    return (
                      <View style={styles.pageTitleContainer}>
                        <Text style={styles.pageTitle}>Page {item.page + 1}</Text>
                        <Text style={styles.pageCount}>{item.total}</Text>
                      </View>
                    );
                  }

                  return (
                    <TouchableOpacity
                      onPress={() => {
                        void pdfReader?.setDisplayPageIndex(item.page);
                        onClose();
                      }}>
                      <View style={styles.itemCard}>
                        <Text style={styles.itemTitle}>{item.title || 'Untitled'}</Text>
                        <Text style={styles.itemBody}>Type: {item.type.toUpperCase()}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(3, 3, 3, 0.2)',
  },
  modalContent: {
    width: '100%',
    maxHeight: '60%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 16,
    color: '#000000',
  },
  pageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32,
    backgroundColor: '#DDE9FF',
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4,
  },
  pageTitle: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '700',
  },
  pageCount: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '700',
  },
  itemCard: {
    paddingVertical: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  itemBody: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
  },
});