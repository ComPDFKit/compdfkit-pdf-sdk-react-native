/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useLayoutEffect, useRef, useState } from "react";
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
} from "react-native";
import RNFS from "react-native-fs";
import { Logger } from '../../../../util/logger';
import { CPDFFileUtil } from '../../../../util/CPDFFileUtil';
import { useAppTheme } from '../../../../theme/appTheme';
import { ActionBottomSheet } from '../../../../widgets/common/ActionBottomSheet';

interface SignatureListModalProps {
  visible: boolean;
  bottomSheet?: boolean;
  onClose: () => void;
  onSelectSignature: (imagePath: string) => void;
}

interface SignatureImage {
  id: string;
  name: string;
  assetPath: string; 
  preview: ImageSourcePropType; 
}

const getAssetPath = (fileName: string) => `sign/${fileName}`;

const SIGNATURE_FILES = [
  {
    name: "signature_1.png",
    preview: require("../../../../../assets/sign/signature_1.png"),
  },
  {
    name: "signature_2.png",
    preview: require("../../../../../assets/sign/signature_2.png"),
  },
  {
    name: "signature_3.png",
    preview: require("../../../../../assets/sign/signature_3.png"),
  },
  {
    name: "signature_4.png",
    preview: require("../../../../../assets/sign/signature_4.png"),
  },
] as const;

const signatureImages: SignatureImage[] = SIGNATURE_FILES.map((item, index) => ({
  id: String(index + 1),
  name: item.name,
  assetPath: getAssetPath(item.name),
  preview: item.preview,
}));

export const SignatureListModal: React.FC<SignatureListModalProps> = ({
  visible,
  bottomSheet = false,
  onClose,
  onSelectSignature,
}) => {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SignatureImage | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const { colors } = useAppTheme();
  const pendingCopy = useRef<object | null>(null);
  const visibleRef = useRef(false);

  useLayoutEffect(() => {
    visibleRef.current = visible;
    if (visible) {
      setLoading(false);
      setSelected(null);
      setCopyFailed(false);
    }
    return () => {
      visibleRef.current = false;
      pendingCopy.current = null;
    };
  }, [visible]);

  const dismiss = () => {
    pendingCopy.current = null;
    onClose();
  };

  const copyImageToDevice = async (
    imageSource: string,
    imageName: string
  ): Promise<string> => {
    try {
      const destDir = `${RNFS.DocumentDirectoryPath}/signatures`;
      return await CPDFFileUtil.copyAssetToDevice(imageSource, imageName, destDir);
    } catch (error) {
      Logger.error("Error copying signature image:", error);
      throw error;
    }
  };

  const handleSelectSignature = async (item: SignatureImage) => {
    if (!visibleRef.current || pendingCopy.current) return;
    const request = {};
    pendingCopy.current = request;
    setLoading(true);
    setCopyFailed(false);
    try {
      const filePath = await copyImageToDevice(item.assetPath, item.name);
      if (pendingCopy.current !== request) return;
      pendingCopy.current = null;
      setLoading(false);
      onSelectSignature(filePath);
      onClose();
    } catch (error) {
      if (pendingCopy.current !== request) return;
      pendingCopy.current = null;
      setLoading(false);
      if (bottomSheet) {
        setCopyFailed(true);
      } else {
        Alert.alert("Error", "Failed to copy signature file, please try again");
      }
      Logger.error("Failed to copy signature:", error);
    }
  };

  const renderItem = ({ item }: { item: SignatureImage }) => (
    <TouchableOpacity
      style={styles.signatureItem}
      onPress={() => handleSelectSignature(item)}
      disabled={loading}
    >
      <Image
        source={item.preview}
        style={styles.signatureImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  if (bottomSheet) {
    return (
      <ActionBottomSheet
        visible={visible}
        title="Add a signature"
        category="Signature field"
        onClose={dismiss}
        actionLabel={loading ? 'Preparing…' : 'Add signature'}
        actionDisabled={!selected || loading}
        onAction={() => {
          if (selected) handleSelectSignature(selected);
        }}
      >
        <FlatList
          style={styles.sheetList}
          contentContainerStyle={styles.sheetListContent}
          data={signatureImages}
          keyExtractor={(item) => item.id}
          numColumns={2}
          ListHeaderComponent={
            <Text style={[styles.sheetMessage, { color: colors.textSecondary }]}>
              Pick a sample image, then confirm to add it to the PDF.
            </Text>
          }
          ListFooterComponent={copyFailed ? (
            <Text accessibilityRole="alert" style={[styles.sheetMessage, { color: colors.textPrimary }]}>
              Could not prepare the signature image. Try again.
            </Text>
          ) : null}
          renderItem={({ item }) => {
            const checked = selected?.id === item.id;
            return (
              <TouchableOpacity
                accessibilityRole="radio"
                accessibilityLabel={`Signature ${item.id}`}
                accessibilityState={{ checked, disabled: loading }}
                disabled={loading}
                onPress={() => setSelected(item)}
                style={[styles.sheetSignature, {
                  borderColor: checked ? colors.primary : colors.outline,
                  backgroundColor: checked ? colors.surfaceVariant : colors.surfaceAlt,
                }]}
              >
                <Image source={item.preview} style={styles.sheetSignatureImage} resizeMode="contain" />
                <Text style={{ color: colors.textPrimary }}>
                  {checked ? `✓ Signature ${item.id}` : `Signature ${item.id}`}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </ActionBottomSheet>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={dismiss}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={dismiss}
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Signature List</Text>
            <TouchableOpacity
              onPress={dismiss}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Processing signature...</Text>
            </View>
          )}

          <FlatList
            data={signatureImages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheetList: { flexGrow: 0, flexShrink: 1 },
  sheetListContent: { paddingHorizontal: 16, paddingBottom: 12 },
  sheetMessage: { marginHorizontal: 4, marginBottom: 8, fontSize: 15, lineHeight: 22 },
  sheetSignature: {
    flex: 1, minHeight: 96, margin: 4, padding: 8, alignItems: 'center',
    justifyContent: 'center', borderRadius: 12, borderWidth: 1, gap: 4,
  },
  sheetSignatureImage: { height: 56, width: '100%', backgroundColor: '#FFFFFF', borderRadius: 6 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    width: "85%",
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
  },
  listContainer: {
    paddingBottom: 4,
  },
  signatureItem: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: "#F5F5F5DD",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#E0E0E0",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  signatureImage: {
    width: "100%",
    height: 100,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
});
