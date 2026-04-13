/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useContext, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import PDFReaderContext, {
  CPDFReaderView,
  CPDFViewMode,
} from '@compdfkit_pdf_sdk/react_native';

interface CPDFPreviewModeListScreenProps {
  visible: boolean;
  onClose: () => void;
}

export const CPDFPreviewModeListScreen: React.FC<
  CPDFPreviewModeListScreenProps
> = ({ visible, onClose }) => {
  const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

  const list = [
    {
      title: 'Viewer',
      mode: CPDFViewMode.VIEWER,
    },
    {
      title: 'Annotations',
      mode: CPDFViewMode.ANNOTATIONS,
    },
    {
      title: 'Content Editor',
      mode: CPDFViewMode.CONTENT_EDITOR,
    },
    {
      title: 'Forms',
      mode: CPDFViewMode.FORMS,
    },
    {
      title: 'Signatures',
      mode: CPDFViewMode.SIGNATURES,
    },
  ];

  const [viewMode, setViewMode] = useState<CPDFViewMode>(CPDFViewMode.VIEWER);

  const renderItem = (
    title: string,
    isChecked: boolean,
    onPress: () => void,
  ) => {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <View style={[styles.item, isChecked && styles.itemSelected]}>
          <View style={styles.itemContent}>
            <View style={[styles.radioDot, isChecked && styles.radioDotSelected]} />
            <Text
              style={isChecked ? styles.itemTextSelect : styles.itemTextNormal}>
            {title}
            </Text>
          </View>
          {isChecked ? (
            <View style={styles.rightIconContainer}>
              <Image
                source={require('../../../../../assets/right.png')}
                style={styles.rightIcon}
              />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.container}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <View style={styles.handle} />
              <View style={styles.header}>
                <Text style={styles.title}>Preview Mode</Text>
                <Text style={styles.subtitle}>
                  Choose the toolset you want to work with in the document.
                </Text>
              </View>
              <FlatList
                data={list}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) =>
                  renderItem(item.title, viewMode === item.mode, () => {
                    setViewMode(item.mode);
                    void pdfReader?.setPreviewMode(item.mode);
                    onClose();
                  })
                }
                keyExtractor={item => item.title}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 24,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#D7DCE5',
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  listContent: {
    paddingBottom: 8,
  },
  item: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginEnd: 12,
    backgroundColor: '#CBD5E1',
  },
  radioDotSelected: {
    backgroundColor: '#2563EB',
  },
  itemTextNormal: {
    textAlignVertical: 'center',
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  itemTextSelect: {
    textAlignVertical: 'center',
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  rightIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAFE',
  },
  rightIcon: {
    width: 18,
    height: 18,
  },
  separator: {
    height: 12,
  },
});

export default CPDFPreviewModeListScreen;