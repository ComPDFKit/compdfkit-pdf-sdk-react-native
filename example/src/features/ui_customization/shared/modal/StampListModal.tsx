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
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
  Alert,
  ActivityIndicator,
  ImageSourcePropType,
  Platform,
} from 'react-native';
import RNFS from 'react-native-fs';
import { CPDFStandardStamp } from '@compdfkit_pdf_sdk/react_native';
import { CPDFFileUtil } from '../../../../util/CPDFFileUtil';

interface StampListModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectStandard: (stamp: CPDFStandardStamp) => void;
  onSelectCustom: (imagePath: string) => void;
}

interface StampItem {
  id: string;
  value: CPDFStandardStamp;
  source: ImageSourcePropType;
}

interface CustomStampItem {
  id: string;
  name: string;
  assetPath: string; // For RNFS use
  preview: ImageSourcePropType; // For Image component
}

const standardStampItems: StampItem[] = [
  { id: 'not_approved', value: CPDFStandardStamp.NOTAPPROVED, source: require('../../../../../assets/stamp/stamp_not_approved.png') },
  { id: 'approved', value: CPDFStandardStamp.APPROVED, source: require('../../../../../assets/stamp/stamp_approved.png') },
  { id: 'completed', value: CPDFStandardStamp.COMPLETED, source: require('../../../../../assets/stamp/stamp_completed.png') },
  { id: 'final', value: CPDFStandardStamp.FINAL_, source: require('../../../../../assets/stamp/stamp_final.png') },
  { id: 'draft', value: CPDFStandardStamp.DRAFT, source: require('../../../../../assets/stamp/stamp_draft.png') },
  { id: 'confidential', value: CPDFStandardStamp.CONFIDENTIAL, source: require('../../../../../assets/stamp/stamp_confidential.png') },
  { id: 'not_for_public_release', value: CPDFStandardStamp.NOTFORPUBLICRELEASE, source: require('../../../../../assets/stamp/stamp_not_for_public_release.png') },
  { id: 'for_public_release', value: CPDFStandardStamp.FORPUBLICRELEASE, source: require('../../../../../assets/stamp/stamp_for_public_release.png') },
  { id: 'for_comment', value: CPDFStandardStamp.FORCOMMENT, source: require('../../../../../assets/stamp/stamp_for_comment.png') },
  { id: 'void', value: CPDFStandardStamp.VOID_, source: require('../../../../../assets/stamp/stamp_void.png') },
  { id: 'preliminary_results', value: CPDFStandardStamp.PRELIMINARYRESULTS, source: require('../../../../../assets/stamp/stamp_preliminary_results.png') },
  { id: 'information_only', value: CPDFStandardStamp.INFORMATIONONLY, source: require('../../../../../assets/stamp/stamp_information_only.png') },
  { id: 'accepted', value: CPDFStandardStamp.ACCEPTED, source: require('../../../../../assets/stamp/stamp_accepted.png') },
  { id: 'rejected', value: CPDFStandardStamp.REJECTED, source: require('../../../../../assets/stamp/stamp_rejected.png') },
  { id: 'witness', value: CPDFStandardStamp.WITNESS, source: require('../../../../../assets/stamp/stamp_witness.png') },
  { id: 'initial_here', value: CPDFStandardStamp.INITIALHERE, source: require('../../../../../assets/stamp/stamp_initial_here.png') },
  { id: 'sign_here', value: CPDFStandardStamp.SIGNHERE, source: require('../../../../../assets/stamp/stamp_sign_here.png') },
  { id: 'revised', value: CPDFStandardStamp.REVISED, source: require('../../../../../assets/stamp/stamp_revised.png') },
  { id: 'private_accepted', value: CPDFStandardStamp.PRIVATEACCEPTED, source: require('../../../../../assets/stamp/stamp_private_accepted.png') },
  { id: 'private_rejected', value: CPDFStandardStamp.PRIVATEREJECTED, source: require('../../../../../assets/stamp/stamp_private_rejected.png') },
  { id: 'private_radio_mark', value: CPDFStandardStamp.PRIVATERADIOMARK, source: require('../../../../../assets/stamp/stamp_private_radio_mark.png') },
];

const customStampItems: CustomStampItem[] = [
  {
    id: '1',
    name: 'signature_1.png',
    assetPath: Platform.OS === "android" ? "sign/signature_1.png" : "signature_1.png",
    preview: require('../../../../../assets/sign/signature_1.png'),
  },
  {
    id: '2',
    name: 'signature_2.png',
    assetPath: Platform.OS === "android" ? "sign/signature_2.png" : "signature_2.png",
    preview: require('../../../../../assets/sign/signature_2.png'),
  },
  {
    id: '3',
    name: 'signature_3.png',
    assetPath: Platform.OS === "android" ? "sign/signature_3.png" : "signature_3.png",
    preview: require('../../../../../assets/sign/signature_3.png'),
  },
  {
    id: '4',
    name: 'signature_4.png',
    assetPath: Platform.OS === "android" ? "sign/signature_4.png" : "signature_4.png",
    preview: require('../../../../../assets/sign/signature_4.png'),
  },
];

export const StampListModal: React.FC<StampListModalProps> = ({
  visible,
  onClose,
  onSelectStandard,
  onSelectCustom,
}) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'custom'>('standard');
  const [loading, setLoading] = useState(false);

  const handleSelectStandard = (item: StampItem) => {
    onSelectStandard(item.value);
    onClose();
  };

  const handleSelectCustom = async (item: CustomStampItem) => {
    setLoading(true);
    try {
      const filePath = await CPDFFileUtil.copyAssetToDevice(
        item.assetPath,
        item.name,
        `${RNFS.DocumentDirectoryPath}/stamps`
      );
      onSelectCustom(filePath);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to copy stamp file, please try again');
    } finally {
      setLoading(false);
    }
  };

  const renderStandardItem = ({ item }: { item: StampItem }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => handleSelectStandard(item)}
      disabled={loading}
    >
      <Image source={item.source} style={styles.itemImage} resizeMode="contain" />
    </TouchableOpacity>
  );

  const renderCustomItem = ({ item }: { item: CustomStampItem }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => handleSelectCustom(item)}
      disabled={loading}
    >
      <Image source={item.preview} style={styles.itemImage} resizeMode="contain" />
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modal} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Stamps</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} disabled={loading}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'standard' && styles.tabBtnActive]}
              onPress={() => setActiveTab('standard')}
            >
              <Text style={[styles.tabText, activeTab === 'standard' && styles.tabTextActive]}>Standard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'custom' && styles.tabBtnActive]}
              onPress={() => setActiveTab('custom')}
            >
              <Text style={[styles.tabText, activeTab === 'custom' && styles.tabTextActive]}>Custom</Text>
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Processing stamp...</Text>
            </View>
          )}

          {activeTab === 'standard' ? (
            <FlatList
              data={standardStampItems}
              renderItem={renderStandardItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.list}
            />
          ) : (
            <FlatList
              data={customStampItems}
              renderItem={renderCustomItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.list}
            />
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 520,
    maxHeight: '80%',
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
    borderBottomWidth: 0.5,
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
    backgroundColor: '#F6F7FB',
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#7A7A7A',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#1A1A1A',
  },
  list: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  itemCard: {
    flex: 1,
    margin: 6,
    padding: 14,
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140
  },
  itemImage: {
    width: '100%',
    height: 90,
  },
  itemLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  loadingWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    borderRadius: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
});
