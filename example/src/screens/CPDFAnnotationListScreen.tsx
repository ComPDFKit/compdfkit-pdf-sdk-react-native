/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import PDFReaderContext, { CPDFActionType, CPDFAnnotation, CPDFReaderView } from "@compdfkit_pdf_sdk/react_native";
import { useContext, useEffect } from "react";
import { Image, FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface CPDFAnnotationListScreenProps {
    visible: boolean;
    annotations: CPDFAnnotation[];
    onClose: () => void;
    onDelete: (annotation: CPDFAnnotation) => void;
}

export const CPDFAnnotationListScreen: React.FC<CPDFAnnotationListScreenProps> = ({ visible, annotations, onClose, onDelete }) => {

    const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

    useEffect(() => {

    }, [visible, pdfReader])

    const groupedAnnotations = annotations.reduce((acc, item) => {
        if (!acc[item.page]) {
            acc[item.page] = [];
        }
        acc[item.page]!.push(item);
        return acc;
    }, {} as Record<number, CPDFAnnotation[]>);

    const flattenedData: (CPDFAnnotation | { isTitle: true, page: number, total: number })[] = [];

    Object.entries(groupedAnnotations).forEach(([page, items]) => {
        flattenedData.push({ isTitle: true, page: Number(page), total: items.length });
        flattenedData.push(...items);
    });

    const _item = (annotation: CPDFAnnotation, onPress: () => void, onDelete: (annotation: CPDFAnnotation) => void) => {
        return (
            <TouchableOpacity onPress={async () => {
                console.log(JSON.stringify(annotation, null, 2));
                onPress();
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, paddingVertical: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.widgetItem}>Title: </Text>
                            <Text style={styles.widgetBody}>{annotation.title}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.widgetItem}>Type: </Text>
                            <Text style={styles.widgetBody}>{annotation.type.toUpperCase()}</Text>
                        </View>
                        {annotation.content != '' && (
                            <Text style={styles.widgetBody1}>{annotation.content}</Text>
                        )}
                    </View>
                    <View style={{ justifyContent: 'center', width: 50 }}>
                        <TouchableWithoutFeedback onPress={async () => {
                            onDelete(annotation);
                        }}>
                            <Image source={require('../../assets/close.png')} style={{ width: 24, height: 24 }} />
                        </TouchableWithoutFeedback>
                    </View>

                </View>

            </TouchableOpacity>
        );
    }


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <Text style={styles.title}>Annotations</Text>
                            <FlatList
                                data={flattenedData}
                                renderItem={({ item }) =>
                                    'isTitle' in item ?
                                        (
                                            <View style={styles.pageTitleContainer} >
                                                <Text style={styles.pageTitle}>Page {item.page + 1}</Text>
                                                <Text style={{
                                                    fontSize: 14,
                                                    color: 'black',
                                                    fontWeight: 'bold',
                                                    marginEnd: 8
                                                }}>{'isTitle' in item ? item.total : 0}</Text>
                                            </View>
                                        )
                                        :
                                        _item(
                                            item as CPDFAnnotation,
                                            async () => {
                                                await pdfReader?.setDisplayPageIndex(item.page);
                                                onClose();
                                            },
                                            async (annotation) => {
                                                onDelete(annotation);
                                            }
                                        )
                                }
                                keyExtractor={item => 'isTitle' in item ? `title-${item.page}` : (item as CPDFAnnotation).uuid}
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
        backgroundColor: 'rgba(3, 3, 3, 0.2)',
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
        maxHeight: '60%',
        backgroundColor: 'white',
        padding: 16,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 16,
        color: 'black',
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
        fontSize: 14,
        fontWeight: '500',
        color: 'black'
    },
    widgetBody: {
        fontSize: 14,
    },
    widgetBody1: {
        fontSize: 13,
    },
    pageTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 32,
        backgroundColor: '#DDE9FF',
        paddingLeft: 4,
        borderRadius: 4
    },
    pageTitle: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold',
    }
});