/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
/**
 * OutlineTab - Expandable outline tree with add/edit/delete
 */
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";
import { CPDFOutline } from "../../../../src/document/CPDFOutline";
import PDFReaderContext, {
  CPDFReaderView,
} from "@compdfkit_pdf_sdk/react_native";

interface CPDFOutlineTabProps {
  onClose?: () => void;
}

export const OutlineTab: React.FC<CPDFOutlineTabProps> = ({ onClose }) => {
  const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

  const [outlineRoot, setOutlineRoot] = useState<CPDFOutline | null>(null);
  const [outlines, setOutlines] = useState<CPDFOutline[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [moveSource, setMoveSource] = useState<CPDFOutline | null>(null);

  // Load outlines on component mount or when pdfReader changes
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!pdfReader || cancelled) return;
      const root = await pdfReader._pdfDocument.getOutlineRoot();
      if (!cancelled) {
        setOutlineRoot(root ?? null);
        setOutlines(root?.childList ?? []);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [pdfReader]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setExpandItem = (id: string, value: boolean) => {
    setExpanded((prev) => ({ ...prev, [id]: value }));
  };

  // Build flat visible list with path-based IDs for proper expansion
  type VisibleItem = { node: CPDFOutline; depth: number; id: string };
  const buildVisible = (
    nodes: CPDFOutline[],
    depth = 0,
    parentPath = ""
  ): VisibleItem[] => {
    const result: VisibleItem[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (!node) continue;
      const id = parentPath ? `${parentPath}-${i}` : `${i}`;
      result.push({ node, depth, id });
      
      const hasChildren = (node.childList?.length ?? 0) > 0;
      if (hasChildren && expanded[id]) {
        result.push(...buildVisible(node.childList ?? [], depth + 1, id));
      }
    }
    return result;
  };

  const visible = useMemo(() => buildVisible(outlines), [outlines, expanded]);

  const refreshOutlines = async () => {
    if (!pdfReader) return;
    const root = await pdfReader._pdfDocument.getOutlineRoot();
    setOutlineRoot(root ?? null);
    setOutlines(root?.childList ?? []);
    console.log(JSON.stringify(root, null, 2));
  };

  const handleAddChild = async (parentNode: CPDFOutline, parentId: string) => {
    if (!pdfReader) return;
    const pageIndex = parentNode.destination?.pageIndex ?? 0;
    await pdfReader._pdfDocument.addOutline(
      parentNode.uuid,
      "New Outline",
      -1,
      pageIndex
    );
    await refreshOutlines();
    setExpandItem(parentId, true);
  };

  const handleEdit = async (node: CPDFOutline, itemId: string) => {
    if (!pdfReader) return;
    const newTitle = `${node.title} (edited)`;
    const pageIndex = node.destination?.pageIndex ?? 0;
    await pdfReader._pdfDocument.updateOutline(node.uuid, newTitle, pageIndex);
    await refreshOutlines();
    setExpandItem(itemId, true);
  };

  const handleDelete = async (node: CPDFOutline) => {
    if (!pdfReader) return;
    Alert.alert("Delete Outline", "Are you sure to delete this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await pdfReader._pdfDocument.removeOutline(node.uuid);
          await refreshOutlines();
        },
      },
    ]);
  };

  const handleMove = async (targetNode: CPDFOutline, targetId: string) => {
    if (!pdfReader || !moveSource) return;
    await pdfReader._pdfDocument.moveOutline(moveSource.uuid, targetNode.uuid, 0);
    await refreshOutlines();
    setMoveSource(null);
    setExpandItem(targetId, true);
  };

  const handleJump = async (pageIndex: number) => {
    if (!pdfReader) return;
    await pdfReader.setDisplayPageIndex(pageIndex);
    onClose?.();
  };

  const handleAddRoot = async () => {
    if (!pdfReader) return;
    let root = outlineRoot;
    if (!root) {
      root = await pdfReader._pdfDocument.newOutlineRoot();
      setOutlineRoot(root);
    }
    await pdfReader._pdfDocument.addOutline(root!.uuid, "New Outline", -1, 0);
    await refreshOutlines();
  };

  const renderItem = ({
    item,
  }: {
    item: { node: CPDFOutline; depth: number; id: string };
  }) => {
    const { node, depth, id } = item;
    const hasChildren = (node.childList?.length ?? 0) > 0;
    const isExpanded = !!expanded[id];
    const pageIndex = node.destination?.pageIndex;

    return (
      <View style={styles.rowContainer}>
        <View style={[styles.rowLeft, { paddingLeft: 12 + depth * 16 }]}>
          {hasChildren ? (
            <TouchableOpacity
              style={styles.expandBtn}
              onPress={() => toggleExpand(id)}
            >
              <Text style={styles.expandIcon}>{isExpanded ? "▾" : "▸"}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.expandBtnPlaceholder} />
          )}
          <TouchableOpacity onPress={() => handleJump(pageIndex ?? 0)}>
            <View style={styles.titleBlock}>
              <Text numberOfLines={1} style={styles.titleText}>
                {node.title || "Untitled"}
              </Text>
              {typeof pageIndex === "number" && (
                <Text style={styles.pageText}>Page {pageIndex + 1}</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.rowRight}>
          <Menu>
            <MenuTrigger>
              <Text style={styles.moreText}>⋯</Text>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => handleAddChild(node, id)}>
                <Text style={styles.menuText}>Add</Text>
              </MenuOption>
              <MenuOption onSelect={() => handleEdit(node, id)}>
                <Text style={styles.menuText}>Edit</Text>
              </MenuOption>
              <MenuOption onSelect={() => handleDelete(node)}>
                <Text style={styles.menuText}>Delete</Text>
              </MenuOption>

              {!moveSource && (
                <MenuOption onSelect={() => setMoveSource(node)}>
                  <Text style={styles.menuText}>Move</Text>
                </MenuOption>
              )}

              {moveSource && (
                <MenuOption onSelect={() => handleMove(node, id)}>
                  <Text style={styles.menuText}>Move to Here</Text>
                </MenuOption>
              )}
            </MenuOptions>
          </Menu>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No outlines</Text>}
      />

      {/* Add root outline button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddRoot}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      {/* Refresh button */}
      <TouchableOpacity style={styles.refreshFab} onPress={refreshOutlines}>
        <Image
          source={require("../../../assets/ic_refresh.png")}
          style={{ width: 24, height: 24, tintColor: "#FFFFFF" }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    minHeight: 44,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
  },
  rowLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  expandBtn: {
    width: 32,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  expandBtnPlaceholder: { width: 32, height: 44 },
  expandIcon: { fontSize: 16, color: "#111827" },
  titleBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  titleText: { fontSize: 14, color: "#111827", maxWidth: "100%" },
  pageText: { fontSize: 10, color: "#6B7280" },
  rowRight: { flexDirection: "row", alignItems: "center" },
  moreText: {
    fontSize: 20,
    color: "#374151",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  menuText: {
    fontSize: 14,
    color: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyText: { textAlign: "center", color: "#6B7280", marginTop: 24 },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabText: { color: "#FFFFFF", fontSize: 28, lineHeight: 28 },
  refreshFab: {
    position: "absolute",
    right: 16,
    bottom: 90,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default OutlineTab;
