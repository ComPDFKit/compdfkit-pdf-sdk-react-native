/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
/**
 * BookmarksTab - Placeholder implementation for Bookmarks list
 */
import PDFReaderContext, {
  CPDFBookmark,
  CPDFReaderView,
} from "@compdfkit_pdf_sdk/react_native";
import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
  ToastAndroid,
} from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

interface CPDFBookmarksTabProps {
    onClose?: () => void;
}

export const BookmarksTab: React.FC<CPDFBookmarksTabProps> = ({ onClose }) => {

  const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

  const [bookmarks, setBookmarks] = React.useState<Array<CPDFBookmark>>([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [titleInput, setTitleInput] = React.useState("");
  const [editingBookmark, setEditingBookmark] = React.useState<CPDFBookmark | null>(null);
  const [pendingPageIndex, setPendingPageIndex] = React.useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      await getBookmarks(cancelled);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [pdfReader]);

  const getBookmarks = async (cancelled: boolean) => {
    if (!pdfReader || cancelled) {
      if (!pdfReader) {
        setBookmarks([]);
      }
      return;
    }
    const bms = await pdfReader._pdfDocument.getBookmarks();
    if (!cancelled) {
      setBookmarks(bms || []);
    }
  };

  const formatDate = (value?: any) => {
    if (!value) return "";
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString();
  };

  const showToast = (msg: string) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  };

  const openAddModal = async () => {
    if (!pdfReader) return;
    const pageIndex = await pdfReader.getCurrentPageIndex();
    const exists = await pdfReader._pdfDocument.hasBookmark(pageIndex);
    if (exists) {
      showToast("A bookmark already exists on this page");
      return;
    }
    setEditingBookmark(null);
    setPendingPageIndex(pageIndex);
    setTitleInput(`Bookmark ${pageIndex + 1}`);
    setModalVisible(true);
  };

  const openEditModal = (bm: CPDFBookmark) => {
    setEditingBookmark(bm);
    setPendingPageIndex(bm.pageIndex);
    setTitleInput(bm.title || "");
    setModalVisible(true);
  };

  const handleDelete = async (bm: CPDFBookmark) => {
    if (!pdfReader) return;
    Alert.alert("Delete Bookmark", "Are you sure you want to delete this bookmark?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await pdfReader._pdfDocument.removeBookmark(bm.pageIndex);
          await getBookmarks(false);
        },
      },
    ]);
  };

  const handleConfirm = async () => {
    if (!pdfReader || pendingPageIndex === null) return;
    if (!titleInput.trim()) {
      showToast("Please enter bookmark title");
      return;
    }
    if (editingBookmark) {
      await pdfReader._pdfDocument.updateBookmark({ ...editingBookmark, title: titleInput.trim() });
    } else {
      await pdfReader._pdfDocument.addBookmark(titleInput.trim(), pendingPageIndex);
    }
    setModalVisible(false);
    setEditingBookmark(null);
    setPendingPageIndex(null);
    await getBookmarks(false);
  };

  const renderItem = ({ item }: { item: CPDFBookmark }) => (
    <View style={styles.row}>
      <TouchableOpacity 
        style={styles.rowContent}
        onPress={async() => {
          if (!pdfReader) return;
          await pdfReader.setDisplayPageIndex(item.pageIndex);
          onClose?.();
        }}
      >
        <View style={styles.rowTextWrap}>
          <View style={styles.titleLine}>
            <Text numberOfLines={1} style={styles.title}>{item.title || "Untitled"}</Text>
            <Text style={styles.page}>Page {item.pageIndex + 1}</Text>
          </View>
          {formatDate(item.date) ? (
            <Text style={styles.date}>{formatDate(item.date)}</Text>
          ) : null}
        </View>
      </TouchableOpacity>

      <Menu>
        <MenuTrigger>
          <View style={styles.moreBtn}>
            <Text style={styles.moreText}>⋯</Text>
          </View>
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => openEditModal(item)}>
            <Text style={styles.menuText}>Edit</Text>
          </MenuOption>
          <MenuOption onSelect={() => handleDelete(item)}>
            <Text style={styles.menuText}>Delete</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.uuid || `${item.pageIndex}`}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No bookmarks</Text>}
      />

      {/* Add bookmark button */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Modal for add / edit */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalMask}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingBookmark ? "Edit Bookmark" : "Add Bookmark"}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title"
              value={titleInput}
              onChangeText={setTitleInput}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={[styles.actionText, styles.actionPrimary]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFCFF" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#E5E7EB",
  },
  rowContent: {
    flex: 1,
    minWidth: 0, 
  },
  rowTextWrap: { 
    gap: 4,
  },
  titleLine: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 8,
    flexWrap: "wrap",
  },
  title: { 
    color: "#111827", 
    fontSize: 14, 
    flex: 1, 
    minWidth: 0, 
  },
  page: { 
    color: "#6B7280", 
    fontSize: 12,
    flexShrink: 0, 
  },
  date: { 
    color: "#9CA3AF", 
    fontSize: 10 
  },
  moreBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  moreText: { fontSize: 20, color: "#374151" },
  menuText: { paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: "#111827" },
  empty: { textAlign: "center", color: "#6B7280", marginTop: 24 },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: { color: "#FFFFFF", fontSize: 28, lineHeight: 28 },
  modalMask: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  modalTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  actionText: { fontSize: 14, color: "#6B7280" },
  actionPrimary: { color: "#2563EB", fontWeight: "600" },
});

export default BookmarksTab;
