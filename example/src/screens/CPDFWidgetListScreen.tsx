/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import PDFReaderContext, { CPDFRadiobuttonWidget, CPDFReaderView, CPDFSignatureWidget, CPDFTextWidget, CPDFWidget, CPDFWidgetType } from "@compdfkit_pdf_sdk/react_native";
import { useContext, useEffect, useState } from "react";
import { Image, FlatList, Modal, Platform, StyleSheet, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { launchImageLibrary } from 'react-native-image-picker';

interface CPDFWidgetListScreenProps {
    visible: boolean;
    widgets: CPDFWidget[];
    onClose: () => void;
    onEditText: (itemIndex: number) => void;
    onDelete: (widget: CPDFWidget) => void;
}

export const CPDFWidgetListScreen: React.FC<CPDFWidgetListScreenProps> = ({ visible, widgets, onClose, onEditText, onDelete }) => {

    const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

    const [widgetData, setWidgetData] = useState<CPDFWidget[]>([]);

    useEffect(() => {

    }, [visible, pdfReader])

    const groupedWidgets = widgets.reduce((acc, item) => {
        if (!acc[item.page]) {
            acc[item.page] = [];
        }
        acc[item.page]!.push(item);
        return acc;
    }, {} as Record<number, CPDFWidget[]>);

    const flattenedData: (CPDFWidget | { isTitle: true, page: number, total: number })[] = [];

    Object.entries(groupedWidgets).forEach(([page, items]) => {
        flattenedData.push({ isTitle: true, page: Number(page), total: items.length });
        flattenedData.push(...items);
    });

    const widgetItem = (widget: CPDFWidget, index: number, onPress: () => void, onEditText: (itemIndex: number) => void, onDelete: (widget: CPDFWidget) => void) => {
        return (
            <TouchableOpacity onPress={async () => {
                console.log(JSON.stringify(widget, null, 2));
                onPress();
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>


                    <View style={{ flex: 1, paddingVertical: 12 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.widgetItem}>Title: </Text>
                            <Text style={styles.widgetBody}>{widget.title}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.widgetItem}>Type: </Text>
                            <Text style={styles.widgetBody}>{widget.type.toUpperCase()}</Text>
                        </View>
                        {widget.type === CPDFWidgetType.TEXT_FIELD && (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.widgetBody}>{(widget as CPDFTextWidget).text}</Text>
                                <TouchableOpacity style={{ paddingHorizontal: 16 }} onPress={async () => {
                                    if (Platform.OS === 'ios') {
                                        onClose();
                                    }
                                    onEditText(index - 1)
                                }}>
                                    <Text style={styles.closeButtonText}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {(widget.type === CPDFWidgetType.RADIO_BUTTON || widget.type == CPDFWidgetType.CHECKBOX) && (
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.widgetItem}>Status:</Text>
                                <Switch
                                    style={{ transform: [{ scale: 0.8 }] }}
                                    thumbColor={(widget as CPDFRadiobuttonWidget).isChecked ? '#1460F3' : 'white'}
                                    trackColor={{ false: '#E0E0E0', true: '#1460F34D' }}
                                    value={(widget as CPDFRadiobuttonWidget).isChecked} onValueChange={async () => {
                                        const updatedWidgetData = [...widgetData];

                                        if ((widget as CPDFRadiobuttonWidget).type === CPDFWidgetType.RADIO_BUTTON || (widget as CPDFRadiobuttonWidget).type === CPDFWidgetType.CHECKBOX) {
                                            const updatedWidget = widget as CPDFRadiobuttonWidget;
                                            const newChecked = !updatedWidget.isChecked;

                                            // ---------------------->
                                            // change RadioButtonWidget or CPDFCheckboxWidget checked status;
                                            await updatedWidget.setChecked(newChecked);
                                            // update appearance
                                            await updatedWidget.updateAp();
                                            // <----------------------

                                            updatedWidgetData[index] = { ...widget, isChecked: newChecked };
                                            setWidgetData(updatedWidgetData);
                                        }
                                    }} />
                            </View>
                        )}
                        {widget.type === CPDFWidgetType.SIGNATURES_FIELDS && (
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                <TouchableOpacity style={{ paddingVertical: 4 }} onPress={async () => {
                                    const signatureWidget = widget as CPDFSignatureWidget;
                                    launchImageLibrary({
                                        mediaType: 'photo'
                                    }, async res => {
                                        if (res.didCancel) {
                                            return false;
                                        }
                                        const path = res.assets?.[0]?.uri;
                                        const signResult = await signatureWidget?.addImageSignature(path!);
                                        await signatureWidget?.updateAp();
                                        if (signResult) {
                                            onClose();
                                        }
                                        return true;
                                    })
                                }}>
                                    <Text style={styles.closeButtonText}>Signature</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <View style={{ justifyContent: 'center', width: 50 }}>
                        <TouchableWithoutFeedback onPress={async () => {
                            onDelete(widget);
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
                            <Text style={styles.title}>Widgets</Text>
                            <FlatList
                                data={flattenedData}
                                renderItem={({ item, index }) =>
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
                                        widgetItem(
                                            item as CPDFWidget,
                                            index,
                                            async () => {
                                                await pdfReader?.setDisplayPageIndex(item.page);
                                                onClose();
                                            },
                                            onEditText,
                                            async (widget) => {
                                                onDelete(widget);
                                                onClose();
                                            }
                                        )
                                }
                                keyExtractor={item => 'isTitle' in item ? `title-${item.page}` : (item as CPDFWidget).uuid}
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
    },
    closeButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginEnd: 8,
    },
    closeButtonText: {
        color: '#007BFF',
        fontSize: 14,
    },
    editTextModalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(3, 3, 3, 0.2)',
    },
    editTextModalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 10
    },
    inputField: {
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#1460F3',
        fontSize: 16,
    },
});