/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

interface PushButtonOptionsModalProps {
  visible: boolean;
  pageCount: number;
  onClose: () => void;
  onConfirm: (result: { type: 'url'; url: string } | { type: 'page'; page: number }) => void;
}

export const PushButtonOptionsModal: React.FC<PushButtonOptionsModalProps> = ({
  visible,
  pageCount,
  onClose,
  onConfirm,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'page'>('url');
  const [urlInput, setUrlInput] = useState('');
  const [pageInput, setPageInput] = useState('');

  useEffect(() => {
    if (visible) {
      setActiveTab('url');
      setUrlInput('');
      setPageInput('');
    }
  }, [visible, pageCount]);

  const handleConfirmUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      Alert.alert('Error', 'URL cannot be empty');
      return;
    }
    if (!/^https?:\/\//i.test(trimmed)) {
      Alert.alert('Error', 'Please enter a valid URL (http/https)');
      return;
    }
    onConfirm({ type: 'url', url: trimmed });
    onClose();
  };

  const handleConfirmPage = () => {
    const page = Number.parseInt(pageInput, 10);
    if (Number.isNaN(page)) {
      Alert.alert('Error', 'Please enter a number');
      return;
    }
    if (page < 0 || page > pageCount) {
      Alert.alert('Error', `Page index must be between 0 and ${pageCount}`);
      return;
    }
    onConfirm({ type: 'page', page });
    onClose();
  };

  const renderUrlTab = () => (
    <View style={styles.body}>
      <Text style={styles.inputLabel}>URL</Text>
      <TextInput
        style={styles.input}
        value={urlInput}
        onChangeText={setUrlInput}
        placeholder="https://example.com"
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={activeTab === 'url'}
      />
      <TouchableOpacity style={styles.primaryBtn} onPress={handleConfirmUrl}>
        <Text style={styles.primaryBtnText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPageTab = () => (
    <View style={styles.body}>
      <Text style={styles.inputLabel}>Page Index (0 - {pageCount})</Text>
      <TextInput
        style={styles.input}
        value={pageInput}
        onChangeText={setPageInput}
        placeholder={`Enter page index (0 - ${pageCount})`}
        keyboardType="number-pad"
        autoFocus={activeTab === 'page'}
      />
      <TouchableOpacity style={styles.primaryBtn} onPress={handleConfirmPage}>
        <Text style={styles.primaryBtnText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Push Button Options</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'url' && styles.tabBtnActive]}
              onPress={() => setActiveTab('url')}
            >
              <Text style={[styles.tabText, activeTab === 'url' && styles.tabTextActive]}>URL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'page' && styles.tabBtnActive]}
              onPress={() => setActiveTab('page')}
            >
              <Text style={[styles.tabText, activeTab === 'page' && styles.tabTextActive]}>Page</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'url' ? renderUrlTab() : renderPageTab()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '88%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
  },
  tabBtnActive: {
    backgroundColor: '#E7F0FF',
  },
  tabText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#0A7AFF',
  },
  body: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
  },
  primaryBtn: {
    marginTop: 4,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
});
