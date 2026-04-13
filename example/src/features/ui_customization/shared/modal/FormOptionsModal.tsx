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
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';
import { CPDFWidgetItem } from '@compdfkit_pdf_sdk/react_native';

interface FormOptionsModalProps {
  visible: boolean;
  title: string;
  options: CPDFWidgetItem[];
  onClose: () => void;
  onConfirm: (options: CPDFWidgetItem[]) => void;
}

export const FormOptionsModal: React.FC<FormOptionsModalProps> = ({
  visible,
  title,
  options: initialOptions,
  onClose,
  onConfirm,
}) => {
  const [editingOptions, setEditingOptions] = useState<CPDFWidgetItem[]>([]);
  
  // 'list' | 'edit' | 'add'
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'add'>('list');
  const [currentEditIndex, setCurrentEditIndex] = useState<number>(-1);
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    if (visible) {
      setEditingOptions(initialOptions ?? []);
      setCurrentEditIndex(-1);
      setTextInput('');
      setViewMode('list');
    }
  }, [initialOptions, visible]);

  // Handle edit option
  const handleEditOption = (index: number) => {
    setCurrentEditIndex(index);
    setTextInput(editingOptions[index]?.text ?? '');
    setViewMode('edit');
  };

  // Handle delete option
  const handleDeleteOption = (index: number) => {
    Alert.alert(
      'Delete Option',
      'Are you sure you want to delete this option?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setEditingOptions(prev => prev.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  // Add option
  const handleAddOption = () => {
    setTextInput('');
    setViewMode('add');
  };

  // Confirm edit
  const confirmEdit = () => {
    if (!textInput.trim()) {
      Alert.alert('Error', 'Text cannot be empty');
      return;
    }

    setEditingOptions(prev => {
      const next = [...prev];
      next[currentEditIndex] = {
        text: textInput.trim(),
        value: textInput.trim(),
      };
      return next;
    });

    setViewMode('list');
    setTextInput('');
  };

  // Confirm add
  const confirmAdd = () => {
    if (!textInput.trim()) {
      Alert.alert('Error', 'Text cannot be empty');
      return;
    }

    setEditingOptions(prev => [
      ...prev,
      {
        text: textInput.trim(),
        value: textInput.trim(),
      },
    ]);

    setViewMode('list');
    setTextInput('');
  };

  // Cancel edit/add
  const handleCancelInput = () => {
    setViewMode('list');
    setTextInput('');
  };

  // Confirm and close
  const handleConfirm = () => {
    onConfirm(editingOptions);
    onClose();
  };

  // Render option item
  const renderItem = ({ item, index }: { item: CPDFWidgetItem; index: number }) => (
    <View style={styles.optionItem}>
      <View style={styles.optionTextContainer}>
        <Text style={styles.optionText} numberOfLines={1}>
          {item.text}
        </Text>
        {item.text !== item.value && (
          <Text style={styles.optionValue} numberOfLines={1}>
            ({item.value})
          </Text>
        )}
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleEditOption(index)}
        >
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDeleteOption(index)}
        >
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backBtn}>
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              {viewMode === 'edit' ? 'Edit Option' : viewMode === 'add' ? 'Add Option' : title}
            </Text>
            <View style={styles.placeholder} />
          </View>

          {viewMode === 'list' ? (
            <>
              <FlatList
                data={editingOptions}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No options yet</Text>
                  </View>
                }
              />

              <View style={styles.footer}>
                <TouchableOpacity style={styles.addBtn} onPress={handleAddOption}>
                  <Text style={styles.addBtnText}>+ Add Option</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                  <Text style={styles.confirmBtnText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Option Text</Text>
              <TextInput
                style={styles.input}
                value={textInput}
                onChangeText={setTextInput}
                placeholder="Enter option text"
                autoFocus
              />
              <View style={styles.inputButtons}>
                <TouchableOpacity
                  style={[styles.inputBtn, styles.cancelInputBtn]}
                  onPress={handleCancelInput}
                >
                  <Text >Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.inputBtn, styles.saveInputBtn]}
                  onPress={viewMode === 'edit' ? confirmEdit : confirmAdd}
                >
                  <Text >{viewMode === 'edit' ? 'Save' : 'Add'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'white',
  },
  centeredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
    height: 32,
  },
  listContainer: {
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  optionValue: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 4,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    backgroundColor: '#FAFAFA',
    marginBottom: 20,
  },
  inputButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  inputBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelInputBtn: {
    backgroundColor: '#F6F7FB',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  saveInputBtn: {
    backgroundColor: '#007AFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  editBtnText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '600',
  },
  deleteBtnText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  addBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#F6F7FB',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
  },
});
