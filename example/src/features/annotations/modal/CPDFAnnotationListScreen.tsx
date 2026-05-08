/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import PDFReaderContext, { CPDFAnnotation, CPDFReaderView } from "@compdfkit_pdf_sdk/react_native";
import { useContext, useMemo } from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Logger } from '../../../util/logger';

interface CPDFAnnotationListScreenProps {
    visible: boolean;
    annotations: CPDFAnnotation[];
    onClose: () => void;
    onDelete?: (annotation: CPDFAnnotation) => void;
}

type AnnotationListItem = CPDFAnnotation | { isTitle: true, page: number, total: number };
const META_LABEL_WIDTH = 44;

export const CPDFAnnotationListScreen: React.FC<CPDFAnnotationListScreenProps> = ({ visible, annotations, onClose }) => {

    const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

    const flattenedData = useMemo(() => {
        const groupedAnnotations = annotations.reduce((acc, item) => {
            if (!acc[item.page]) {
                acc[item.page] = [];
            }
            acc[item.page]!.push(item);
            return acc;
        }, {} as Record<number, CPDFAnnotation[]>);

        const items: AnnotationListItem[] = [];

        Object.entries(groupedAnnotations).forEach(([page, pageAnnotations]) => {
            items.push({ isTitle: true, page: Number(page), total: pageAnnotations.length });
            items.push(...pageAnnotations);
        });

        return items;
    }, [annotations]);

    const handleAnnotationPress = async (annotation: CPDFAnnotation) => {
        Logger.log(JSON.stringify(annotation, null, 2));
        await pdfReader?.setDisplayPageIndex(annotation.page, { rectList: [annotation.rect!] });
        onClose();
    };

    const renderAnnotationItem = (annotation: CPDFAnnotation) => {
        return (
            <View style={styles.annotationCard}>
                <TouchableOpacity
                    style={styles.annotationBody}
                    activeOpacity={0.75}
                    onPress={() => {
                        void handleAnnotationPress(annotation);
                    }}>
                    <View style={styles.annotationTextSection}>
                        <View style={styles.annotationSummarySection}>
                            <View style={styles.metaRow}>
                                <Text style={styles.widgetItem}>Title</Text>
                                <Text style={styles.widgetBody}>{annotation.title}</Text>
                            </View>
                            <View style={[styles.metaRow, styles.metaRowSecondary]}>
                                <Text style={styles.widgetItem}>Type</Text>
                                <View style={styles.typeBadge}>
                                    <Text style={styles.typeBadgeText}>{annotation.type.toUpperCase()}</Text>
                                </View>
                            </View>
                        </View>
                        {annotation.content !== '' && (
                            <View style={styles.contentSection}>
                                <Text style={styles.contentLabel}>Content</Text>
                                <Text style={styles.widgetBody1} numberOfLines={3}>{annotation.content}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };


    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.sheetHandle} />
                                <Text style={styles.title}>Annotations</Text>
                                <FlatList
                                    data={flattenedData}
                                    contentContainerStyle={styles.listContent}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={({ item }) =>
                                        'isTitle' in item ?
                                            (
                                                <View style={styles.pageTitleContainer} >
                                                    <Text style={styles.pageTitle}>Page {item.page + 1}</Text>
                                                    <View style={styles.pageCountBadge}>
                                                        <Text style={styles.pageCountText}>{item.total}</Text>
                                                    </View>
                                                </View>
                                            )
                                            :
                                            renderAnnotationItem(item as CPDFAnnotation)
                                    }
                                    ItemSeparatorComponent={() => <View style={styles.itemSpacer} />}
                                    keyExtractor={item => 'isTitle' in item ? `title-${item.page}` : (item as CPDFAnnotation).uuid}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </>
    );


}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(8, 15, 28, 0.34)',
    },
    container: {
        height: '60%',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalView: {
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 18,
        color: '#111827',
    },
    listContent: {
        paddingBottom: 12,
    },
    itemSpacer: {
        height: 10,
    },
    item: {
        height: 48,
        marginStart: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginEnd: 16,
    },
    itemTextNormal: {
        textAlignVertical: 'center',
        fontSize: 14,
        color: 'gray'
    },
    itemTextSelect: {
        textAlignVertical: 'center',
        color: 'black',
        fontSize: 14
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
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
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
    metaRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    metaRowSecondary: {
        alignItems: 'center',
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