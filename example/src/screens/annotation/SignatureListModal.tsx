/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from "react";
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
  Platform,
  Alert,
  ActivityIndicator,
  ImageSourcePropType,
} from "react-native";
import RNFS from "react-native-fs";

interface SignatureListModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSignature: (imagePath: string) => void;
}

interface SignatureImage {
  id: string;
  name: string;
  assetPath: string; 
  preview: ImageSourcePropType; 
}

const getAssetPath = (fileName: string) =>
  Platform.OS === "android" ? `sign/${fileName}` : fileName;

const SIGNATURE_FILES = [
  {
    name: "signature_1.png",
    preview: require("../../../assets/sign/signature_1.png"),
  },
  {
    name: "signature_2.png",
    preview: require("../../../assets/sign/signature_2.png"),
  },
  {
    name: "signature_3.png",
    preview: require("../../../assets/sign/signature_3.png"),
  },
  {
    name: "signature_4.png",
    preview: require("../../../assets/sign/signature_4.png"),
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
  onClose,
  onSelectSignature,
}) => {
  const [loading, setLoading] = useState(false);

  const copyImageToDevice = async (
    imageSource: string,
    imageName: string
  ): Promise<string> => {
    try {
      // 1️⃣ Target directory
      const destDir = `${RNFS.DocumentDirectoryPath}/signatures`;

      // 2️⃣ Ensure the directory exists
      const dirExists = await RNFS.exists(destDir);
      if (!dirExists) {
        await RNFS.mkdir(destDir);
        console.log("Created signatures directory:", destDir);
      }

      // 3️⃣ Target file path
      const destPath = `${destDir}/${imageName}`;

      // 4️⃣ Return directly if the file already exists
      const fileExists = await RNFS.exists(destPath);
      if (fileExists) {
        console.log("Signature file already exists:", destPath);
        return destPath;
      }

      console.log("Copying from:", imageSource, "to:", destPath);

      // 5️⃣ Copy logic based on platform
      if (Platform.OS === "android") {
        /**
         * Android:
         * imageSource must be a relative path under the assets directory
         * Example: images/sign.png
         */
        await RNFS.copyFileAssets(imageSource, destPath);
      } else if (Platform.OS === "ios") {
        /**
         * iOS:
         * assets are located in the main bundle
         */
        const srcPath = `${RNFS.MainBundlePath}/${imageSource}`;
        await RNFS.copyFile(srcPath, destPath);
      } else {
        throw new Error(`Unsupported platform: ${Platform.OS}`);
      }

      console.log("Signature image copied to:", destPath);
      return destPath;
    } catch (error) {
      console.error("Error copying signature image:", error);
      throw error;
    }
  };

  const handleSelectSignature = async (item: SignatureImage) => {
    setLoading(true);
    try {
      const filePath = await copyImageToDevice(item.assetPath, item.name);
      onSelectSignature(filePath);
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to copy signature file, please try again");
      console.error("Failed to copy signature:", error);
    } finally {
      setLoading(false);
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

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Signature List</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              disabled={loading}
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
