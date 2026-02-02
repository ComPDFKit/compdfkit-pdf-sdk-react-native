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
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
} from "react-native";
import OutlineTab from "./bota/OutlineTab";
import BookmarksTab from "./bota/BookmarksTab";
import ThumbnailsTab from "./bota/ThumbnailsTab";
import AnnotationsTab from "./bota/AnnotationsTab";
import { MenuProvider } from "react-native-popup-menu";

type TabKey = "bookmark" | "outline" | "thumbnail" | "annotations";

type CPDFBotaScreenProps = {
  visible: boolean;
  onClose: () => void;
};

export const CPDFBotaScreen = ({
  visible,
  onClose,
}: CPDFBotaScreenProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>("outline");

  const renderToolbar = () => (
    <View style={styles.toolbar}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Image
          source={require("../../assets/close.png")}
          style={{ width: 24, height: 24, tintColor: "#111827" }}
        />
      </TouchableOpacity>
      <Text style={styles.toolbarTitle}>
        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      </Text>
      <View style={{ width: 40 }} />
    </View>
  );

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      <TabButton
        title="Bookmarks"
        active={activeTab === "bookmark"}
        onPress={() => setActiveTab("bookmark")}
      />
      <TabButton
        title="Outline"
        active={activeTab === "outline"}
        onPress={() => setActiveTab("outline")}
      />
      <TabButton
        title="Thumbnails"
        active={activeTab === "thumbnail"}
        onPress={() => setActiveTab("thumbnail")}
      />
      <TabButton
        title="Annotations"
        active={activeTab === "annotations"}
        onPress={() => setActiveTab("annotations")}
      />
    </View>
  );

  const renderBody = () => {
    switch (activeTab) {
      case "outline":
        return <OutlineTab onClose={onClose} />;
      case "bookmark":
        return <BookmarksTab onClose={onClose} />;
      case "thumbnail":
        return <ThumbnailsTab />;
      case "annotations":
        return <AnnotationsTab />;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <MenuProvider skipInstanceCheck>
        <SafeAreaView style={styles.container}>
          {renderToolbar()}
          {renderTabBar()}
          <View style={styles.body}>{renderBody()}</View>
        </SafeAreaView>
      </MenuProvider>
    </Modal>
  );
};

const TabButton = ({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.tabButton, active && styles.tabButtonActive]}
    onPress={onPress}
  >
    <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFCFF" },
  toolbar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#FAFCFF",
    paddingHorizontal: 8,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#111827",
  },
  toolbarTitle: {
    flex: 1,
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  tabBar: {
    height: 44,
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E9EF",
    backgroundColor: "#FAFCFF",
  },
  tabButton: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabButtonActive: { borderBottomWidth: 2, borderBottomColor: "#3B82F6" },
  tabButtonText: { color: "#6B7280", fontSize: 14 },
  tabButtonTextActive: { color: "#3B82F6", fontWeight: "600" },
  body: { flex: 1 },
  placeholder: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeholderText: { color: "#9CA3AF" },
});

export default CPDFBotaScreen;
