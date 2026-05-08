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

type WidgetListItem = CPDFWidget | { isTitle: true; page: number; total: number };
const META_LABEL_WIDTH = 44;
type WidgetOption = { text?: string; value?: string };
type WidgetAction = { actionType?: string; pageIndex?: number; uri?: string };
type WidgetDetails = {
  label: string;
  value: string;
} | null;

export function CPDFFormWidgetListScreen({
  visible,
  widgets,
  onClose,
}: CPDFFormWidgetListScreenProps) {
  const pdfReader = React.useContext(PDFReaderContext) as CPDFReaderView | null;

  const flattenedData = React.useMemo<WidgetListItem[]>(() => {
    const groupedWidgets = widgets.reduce((accumulator, widget) => {
      if (!accumulator[widget.page]) {
        accumulator[widget.page] = [];
      }
      accumulator[widget.page]!.push(widget);
      return accumulator;
    }, {} as Record<number, CPDFWidget[]>);

    return Object.entries(groupedWidgets)
      .sort(([leftPage], [rightPage]) => Number(leftPage) - Number(rightPage))
      .flatMap(([page, items]) => [
        { isTitle: true as const, page: Number(page), total: items.length },
        ...items,
      ]);
  }, [widgets]);

  const totalPages = React.useMemo(() => new Set(widgets.map(widget => widget.page)).size, [widgets]);

  const getSelectedOptionText = (widget: CPDFWidget & {
    options?: WidgetOption[];
    selectItemAtIndex?: number;
  }) => {
    const options = widget.options ?? [];
    const selectedIndex = widget.selectItemAtIndex ?? -1;
    const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;
    return selectedOption?.text || selectedOption?.value || 'No selection';
  };

  const getPushButtonActionText = (widget: CPDFWidget & { action?: WidgetAction | null }) => {
    const action = widget.action;

    if (!action) {
      return 'No action';
    }

    switch (action.actionType) {
      case 'goTo':
        return `Page ${(action.pageIndex ?? 0) + 1}`;
      case 'uri': {
        const uri = action.uri?.trim() ?? '';
        if (uri.startsWith('mailto:')) {
          return uri.slice('mailto:'.length) || 'Email link';
        }
        return uri || 'Web link';
      }
      default:
        return 'Custom action';
    }
  };

  const getWidgetDetails = (widget: CPDFWidget): WidgetDetails => {
    switch (widget.type) {
      case 'textField': {
        const textWidget = widget as CPDFWidget & { text?: string };
        return {
          label: 'Text',
          value: textWidget.text && textWidget.text.trim() !== '' ? textWidget.text : 'Empty',
        };
      }
      case 'checkBox':
      case 'radioButton': {
        const toggleWidget = widget as CPDFWidget & { isChecked?: boolean };
        return {
          label: 'Status',
          value: toggleWidget.isChecked ? 'Checked' : 'Unchecked',
        };
      }
      case 'comboBox':
      case 'listBox': {
        return {
          label: 'Selected',
          value: getSelectedOptionText(widget as CPDFWidget & {
            options?: WidgetOption[];
            selectItemAtIndex?: number;
          }),
        };
      }
      case 'signaturesFields':
        return null;
      case 'pushButton':
        return {
          label: 'Action',
          value: getPushButtonActionText(widget as CPDFWidget & { action?: WidgetAction | null }),
        };
      default:
        return null;
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.sheetHandle} />
              <Text style={styles.subtitle}>
                {widgets.length} field{widgets.length === 1 ? '' : 's'} across {totalPages} page
                {totalPages === 1 ? '' : 's'}
              </Text>
              <Text style={styles.title}>Form Fields</Text>
              <FlatList
                data={flattenedData}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => ('isTitle' in item ? `title-${item.page}` : item.uuid)}
                ItemSeparatorComponent={() => <View style={styles.itemSpacer} />}
                renderItem={({ item }) => {
                  if ('isTitle' in item) {
                    return (
                      <View style={styles.pageTitleContainer}>
                        <Text style={styles.pageTitle}>Page {item.page + 1}</Text>
                        <View style={styles.pageCountBadge}>
                          <Text style={styles.pageCountText}>{item.total}</Text>
                        </View>
                      </View>
                    );
                  }

                  const details = getWidgetDetails(item);

                  return (
                    <View style={styles.annotationCard}>
                      <TouchableOpacity
                        activeOpacity={0.75}
                        style={styles.annotationBody}
                        onPress={() => {
                          void pdfReader?.setDisplayPageIndex(item.page);
                          onClose();
                        }}>
                        <View style={styles.annotationTextSection}>
                          <View style={styles.annotationSummarySection}>
                            <View style={styles.metaRow}>
                              <Text style={styles.widgetItem}>Title</Text>
                              <Text numberOfLines={2} style={styles.widgetBody}>
                                {item.title || 'Untitled'}
                              </Text>
                            </View>
                            <View style={[styles.metaRow, styles.metaRowSecondary]}>
                              <Text style={styles.widgetItem}>Type</Text>
                              <View style={styles.typeBadge}>
                                <Text style={styles.typeBadgeText}>{item.type.toUpperCase()}</Text>
                              </View>
                            </View>
                          </View>
                          {details ? (
                            <View style={styles.contentSection}>
                              <Text style={styles.contentLabel}>{details.label}</Text>
                              <Text numberOfLines={3} style={styles.widgetBody1}>
                                {details.value}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </TouchableOpacity>
                    </View>
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
    backgroundColor: 'rgba(8, 15, 28, 0.34)',
  },
  modalContent: {
    width: '100%',
    maxHeight: '78%',
    backgroundColor: '#F8FAFD',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#0B1220',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
    elevation: 16,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#C7D3E4',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#111827',
  },
  listContent: {
    paddingBottom: 12,
  },
  itemSpacer: {
    height: 10,
  },
  pageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 38,
    backgroundColor: '#E4EEFF',
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  pageTitle: {
    fontSize: 14,
    color: '#163B74',
    fontWeight: 'bold',
  },
  pageCountBadge: {
    minWidth: 28,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  pageCountText: {
    fontSize: 13,
    color: '#163B74',
    fontWeight: '700',
  },
  annotationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5ECF5',
    overflow: 'hidden',
  },
  annotationBody: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 12,
  },
  annotationTextSection: {
    flex: 1,
  },
  annotationSummarySection: {
    gap: 10,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#EEF4FF',
  },
  typeBadgeText: {
    fontSize: 11,
    color: '#2458B5',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  metaRowSecondary: {
    alignItems: 'center',
  },
  widgetItem: {
    width: META_LABEL_WIDTH,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginRight: 8,
  },
  widgetBody: {
    fontSize: 14,
    flex: 1,
    flexShrink: 1,
    color: '#111827',
    fontWeight: '600',
  },
  widgetBody1: {
    fontSize: 13,
    lineHeight: 19,
    color: '#4B5563',
    flex: 1,
  },
  contentSection: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEF2F7',
  },
  contentLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    color: '#94A3B8',
    marginBottom: 6,
  },
});