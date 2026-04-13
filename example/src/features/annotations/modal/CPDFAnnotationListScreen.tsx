/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import PDFReaderContext, { CPDFAnnotation, CPDFImageUtil, CPDFReaderView } from "@compdfkit_pdf_sdk/react_native";
import { useContext, useMemo, useState } from "react";
import { GestureResponderEvent, Image, FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, useWindowDimensions } from "react-native";
import { Logger } from '../../../util/logger';

interface CPDFAnnotationListScreenProps {
    visible: boolean;
    annotations: CPDFAnnotation[];
    onClose: () => void;
    onDelete?: (annotation: CPDFAnnotation) => void;
}

type AnnotationListItem = CPDFAnnotation | { isTitle: true, page: number, total: number };
type AnnotationMenuState = { annotation: CPDFAnnotation, x: number, y: number } | null;

const ACTION_MENU_WIDTH = 248;
const ACTION_MENU_ROW_HEIGHT = 68;
const ACTION_MENU_PADDING = 12;

export const CPDFAnnotationListScreen: React.FC<CPDFAnnotationListScreenProps> = ({ visible, annotations, onClose, onDelete }) => {

    const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState<string | null>(null);
    const [menuState, setMenuState] = useState<AnnotationMenuState>(null);

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

    const handlePreviewAppearance = async (annotation: CPDFAnnotation) => {
        if (!pdfReader) {
            setPreviewError('PDF reader is not ready yet.');
            setPreviewImageUri(null);
            setPreviewLoading(false);
            setPreviewVisible(true);
            return;
        }

        setPreviewVisible(true);
        setPreviewLoading(true);
        setPreviewError(null);
        setPreviewImageUri(null);

        try {
            const base64 = await pdfReader._pdfDocument.renderAnnotationAppearance(annotation, {
                scale: 4,
                compression: 'png',
                quality: 100,
            });

            if (!base64) {
                setPreviewError('renderAnnotationAppearance returned an empty image.');
                return;
            }

            setPreviewImageUri(CPDFImageUtil.base64ToUri(base64));
        } catch (error) {
            setPreviewError(error instanceof Error ? error.message : 'Failed to render annotation appearance.');
        } finally {
            setPreviewLoading(false);
        }
    };

    const closePreview = () => {
        setPreviewVisible(false);
        setPreviewLoading(false);
        setPreviewError(null);
        setPreviewImageUri(null);
    };

    const closeMenu = () => {
        setMenuState(null);
    };

    const openMenu = (annotation: CPDFAnnotation, event: GestureResponderEvent) => {
        setMenuState({
            annotation,
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
        });
    };

    const menuPosition = useMemo(() => {
        if (!menuState) {
            return { left: ACTION_MENU_PADDING, top: ACTION_MENU_PADDING };
        }

        const actionCount = onDelete ? 2 : 1;
        const menuHeight = actionCount * ACTION_MENU_ROW_HEIGHT + 16;
        const preferredLeft = menuState.x - ACTION_MENU_WIDTH + 40;
        const preferredTop = menuState.y - 20;

        return {
            left: Math.max(
                ACTION_MENU_PADDING,
                Math.min(preferredLeft, windowWidth - ACTION_MENU_WIDTH - ACTION_MENU_PADDING),
            ),
            top: Math.max(
                ACTION_MENU_PADDING,
                Math.min(preferredTop, windowHeight - menuHeight - ACTION_MENU_PADDING),
            ),
        };
    }, [menuState, onDelete, windowHeight, windowWidth]);

    const renderMenuTrigger = (annotation: CPDFAnnotation) => {
        return (
            <TouchableOpacity
                activeOpacity={0.75}
                onPress={(event) => openMenu(annotation, event)}
                style={styles.menuTrigger}>
                <Image
                    source={require('../../../../assets/more.png')}
                    style={styles.menuIcon}
                />
            </TouchableOpacity>
        );
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
                        <View style={styles.metaRow}>
                            <Text style={styles.widgetItem}>Title</Text>
                            <Text style={styles.widgetBody}>{annotation.title}</Text>
                        </View>
                        <View style={styles.metaRow}>
                            <Text style={styles.widgetItem}>Type</Text>
                            <View style={styles.typeBadge}>
                                <Text style={styles.typeBadgeText}>{annotation.type.toUpperCase()}</Text>
                            </View>
                        </View>
                        {annotation.content !== '' && (
                            <Text style={styles.widgetBody1} numberOfLines={2}>{annotation.content}</Text>
                        )}
                    </View>
                </TouchableOpacity>
                <View style={styles.annotationActions}>
                    {renderMenuTrigger(annotation)}
                </View>
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

            <Modal
                animationType="fade"
                transparent={true}
                visible={menuState !== null}
                onRequestClose={closeMenu}>
                <TouchableWithoutFeedback onPress={closeMenu}>
                    <View style={styles.actionMenuBackdrop}>
                        <TouchableWithoutFeedback>
                            <View style={[styles.actionMenuCard, menuPosition]}>
                                <TouchableOpacity
                                    style={styles.actionMenuRow}
                                    activeOpacity={0.75}
                                    onPress={() => {
                                        if (!menuState) {
                                            return;
                                        }
                                        closeMenu();
                                        void handlePreviewAppearance(menuState.annotation);
                                    }}>
                                    <View style={styles.actionMenuIconBubble}>
                                        <Image source={require('../../../../assets/view.png')} style={styles.actionMenuIcon} />
                                    </View>
                                    <View style={styles.actionMenuTextBlock}>
                                        <Text style={styles.menuOptionText}>Preview appearance</Text>
                                    </View>
                                </TouchableOpacity>

                                {onDelete ? (
                                    <TouchableOpacity
                                        style={[styles.actionMenuRow, styles.actionMenuRowBorder]}
                                        activeOpacity={0.75}
                                        onPress={() => {
                                            if (!menuState) {
                                                return;
                                            }
                                            const annotation = menuState.annotation;
                                            closeMenu();
                                            onDelete(annotation);
                                        }}>
                                        <View style={[styles.actionMenuIconBubble, styles.actionMenuIconBubbleDanger]}>
                                            <Image source={require('../../../../assets/close.png')} style={[styles.actionMenuIcon, styles.actionMenuIconDanger]} />
                                        </View>
                                        <View style={styles.actionMenuTextBlock}>
                                            <Text style={[styles.menuOptionText, styles.menuOptionDanger]}>Delete annotation</Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : null}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={previewVisible}
                onRequestClose={closePreview}>
                <TouchableWithoutFeedback onPress={closePreview}>
                    <View style={styles.previewBackdrop}>
                        <TouchableWithoutFeedback>
                            <View style={styles.previewCard}>
                                <View style={styles.previewHeader}>
                                    <Text style={styles.previewTitle}>Annotation Appearance</Text>
                                    <TouchableOpacity onPress={closePreview} style={styles.previewCloseButton}>
                                        <Text style={styles.previewCloseText}>Close</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.previewBody}>
                                    {previewLoading ? (
                                        <Text style={styles.previewHint}>Rendering preview...</Text>
                                    ) : null}
                                    {!previewLoading && previewError ? (
                                        <Text style={styles.previewError}>{previewError}</Text>
                                    ) : null}
                                    {!previewLoading && !previewError && previewImageUri ? (
                                        <Image source={{ uri: previewImageUri }} style={styles.previewImage} resizeMode="contain" />
                                    ) : null}
                                </View>
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
        minWidth: 42,
        fontSize: 12,
        fontWeight: '500',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    widgetBody: {
        fontSize: 14,
        flex: 1,
        color: '#111827',
        fontWeight: '600',
    },
    widgetBody1: {
        fontSize: 13,
        lineHeight: 19,
        color: '#4B5563',
        marginTop: 8,
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
        flexDirection: 'row',
        alignItems: 'stretch',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5ECF5',
        overflow: 'hidden',
    },
    annotationBody: {
        flex: 1,
        paddingVertical: 14,
        paddingLeft: 14,
        paddingRight: 10,
    },
    annotationTextSection: {
        flex: 1,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: 8,
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
    annotationActions: {
        width: 56,
        borderLeftWidth: 1,
        borderLeftColor: '#EEF2F7',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FBFCFE',
    },
    menuTrigger: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEF3FA',
    },
    menuIcon: {
        width: 18,
        height: 18,
        tintColor: '#1F2937',
        resizeMode: 'contain',
    },
    menuOptionsContainer: {
        borderRadius: 14,
        paddingVertical: 6,
        width: 180,
    },
    actionMenuBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(8, 15, 28, 0.08)',
    },
    actionMenuCard: {
        position: 'absolute',
        width: ACTION_MENU_WIDTH,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5ECF5',
        shadowColor: '#0B1220',
        shadowOpacity: 0.16,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 14,
        paddingVertical: 8,
    },
    actionMenuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: ACTION_MENU_ROW_HEIGHT,
        paddingVertical: 14,
        paddingHorizontal: 14,
        backgroundColor: '#FFFFFF',
    },
    actionMenuRowBorder: {
        borderTopWidth: 1,
        borderTopColor: '#E5ECF5',
    },
    actionMenuIconBubble: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EEF4FF',
        marginRight: 12,
    },
    actionMenuIconBubbleDanger: {
        backgroundColor: '#FDECEC',
    },
    actionMenuIcon: {
        width: 16,
        height: 16,
        tintColor: '#2458B5',
        resizeMode: 'contain',
    },
    actionMenuIconDanger: {
        color: '#C73535',
        tintColor: '#C73535',
    },
    actionMenuTextBlock: {
        flex: 1,
    },
    menuOptionText: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '600',
    },
    menuOptionDanger: {
        color: '#C73535',
    },
    previewBackdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(8, 15, 28, 0.48)',
        paddingHorizontal: 20,
    },
    previewCard: {
        width: '100%',
        maxWidth: 420,
        maxHeight: '78%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
    },
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E5ECF5',
    },
    previewTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },
    previewCloseButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: '#EEF3FA',
    },
    previewCloseText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
    },
    previewBody: {
        minHeight: 280,
        maxHeight: 520,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFD',
    },
    previewHint: {
        fontSize: 14,
        color: '#475569',
    },
    previewError: {
        fontSize: 14,
        lineHeight: 20,
        color: '#C73535',
        textAlign: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    }
});