/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState, useRef } from 'react';
import { Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PDFReaderContext, { CPDFReaderView, ComPDFKit, CPDFWidgetType, CPDFTextWidget, CPDFWidget } from '@compdfkit_pdf_sdk/react_native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { keepLocalCopy, pick, types } from '@react-native-documents/picker';
import { CPDFWidgetListScreen } from './screens/CPDFWidgetListScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
type RootStackParamList = {
    CPDFWidgetExample: { document?: string };
};

type CPDFWidgetsExampleScreenRouteProp = RouteProp<
    RootStackParamList,
    'CPDFWidgetExample'
>;

const CPDFWidgetsExampleScreen = () => {

    const pdfReaderRef = useRef<CPDFReaderView>(null);

    const navigation = useNavigation();

    const route = useRoute<CPDFWidgetsExampleScreenRouteProp>();

    const [widgetsModalVisible, setWidgetsModalVisible] = useState(false);

    const [textEditModalVisible, setTextEditModalVisible] = useState(false);

    const [widgetData, setWidgetData] = useState<CPDFWidget[]>([]);

    const [text, setText] = useState('');

    const [currentEditingWidgetIndex, setCurrentEditingWidgetIndex] = useState<number | null>(null);

    const [samplePDF] = useState(
        route.params?.document || (Platform.OS === 'android'
            ? 'file:///android_asset/annot_test.pdf'
            : 'annot_test.pdf')
    );

    const menuOptions = [
        'OpenDocument',
        'Import Widgets',
        'Export Widgets',
        'Get Widgets',
    ];

    const handleMenuItemPress = async (action: string) => {
        switch (action) {
            case 'OpenDocument':
                const document = await ComPDFKit.pickFile();
                if (document) {
                    await pdfReaderRef.current?._pdfDocument.open(document);
                }
                break;
            case 'Import Widgets':

                const [xfdfFile] = await pick({
                    mode: 'open',
                    type: [types.allFiles],
                    allowMultiSelection: false,
                })
                const [copyResult] = await keepLocalCopy({
                    files: [
                        {
                            uri: xfdfFile!.uri,
                            fileName: xfdfFile!.name ?? 'fallback-name',
                        },
                    ],
                    destination: 'documentDirectory',
                })
                if (copyResult.status === 'success') {
                    console.log(copyResult.localUri);
                    const uri = copyResult.localUri;
                    if ((uri.endsWith('.xfdf') || uri.endsWith('.xml'))) {
                        const importWidgetResult = await pdfReaderRef.current?._pdfDocument.importWidgets(uri);
                        console.log('ComPDFKitRN importWidget:', importWidgetResult);
                    } else {
                        console.log('ComPDFKitRN Please select a valid xfdf or xml file');
                    }
                }

                break;
            case 'Export Widgets':
                const exportWidgetsPath = await pdfReaderRef.current?._pdfDocument.exportWidgets();
                console.log('ComPDFKitRN exportWidgets:', exportWidgetsPath)
                break;
            case 'Get Widgets':
                const pageCount1 = await pdfReaderRef!.current!._pdfDocument.getPageCount();
                let allWidgets: CPDFWidget[] = [];
                for (let i = 0; i < pageCount1; i++) {
                    const page = pdfReaderRef?.current?._pdfDocument.pageAtIndex(i);
                    const widgets = await page?.getWidgets();
                    if (widgets) {
                        allWidgets = allWidgets.concat(widgets);
                    }
                }
                setWidgetData(allWidgets);
                setWidgetsModalVisible(true);
                break;
            default:
                break;
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const renderToolbar = () => {
        return (
            <View style={styles.toolbar}>
                <HeaderBackButton onPress={handleBack} />
                <Text style={styles.toolbarTitle}>Widgets Example</Text>
                <Menu>
                    <MenuTrigger>
                        <Image source={require('../assets/more.png')} style={{ width: 24, height: 24, marginEnd: 8 }} />
                    </MenuTrigger>

                    <MenuOptions>
                        {menuOptions.map((option, index) => (
                            <MenuOption key={index} onSelect={() => handleMenuItemPress(option)}>
                                <Text style={styles.menuOption}>{option}</Text>
                            </MenuOption>
                        ))}
                    </MenuOptions>
                </Menu>
            </View>
        );
    };

    return (
        <PDFReaderContext.Provider value={pdfReaderRef.current}>
            <MenuProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFCFF' }}>
                    <View style={{ flex: 1 }}>
                        {renderToolbar()}
                        <CPDFReaderView
                            ref={pdfReaderRef}
                            document={samplePDF}
                            configuration={ComPDFKit.getDefaultConfig({})}
                            onIOSClickBackPressed={handleBack} />
                    </View>
                    <CPDFWidgetListScreen
                        visible={widgetsModalVisible}
                        widgets={widgetData}
                        onClose={() => setWidgetsModalVisible(false)}
                        onEditText={(index: number) => {
                            console.log('CPDFWidgetListScreen onEditText:', index);
                            setCurrentEditingWidgetIndex(index);
                            setTextEditModalVisible(true);
                        }}
                        onDelete={async (widget) => {
                            const removeResult = await pdfReaderRef.current?._pdfDocument.removeWidget(widget)
                            console.log('ComPDFKitRN removeWidget:', removeResult);
                        }}
                    />
                    <Modal visible={textEditModalVisible} transparent={true} animationType="fade">
                        <View style={styles.editTextModalContainer}>
                            <View style={styles.editTextModalContent}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.modalTitle}>Edit Text</Text>
                                </View>

                                <TextInput
                                    style={styles.inputField}
                                    value={text}
                                    onChangeText={(newText) => setText(newText)}
                                    placeholder="Enter text here"
                                    multiline={true}
                                    numberOfLines={4}
                                    returnKeyType='done'
                                    blurOnSubmit={true}

                                />

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={() => {
                                        setTextEditModalVisible(false);
                                    }} style={styles.button}>
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={async () => {
                                        if (currentEditingWidgetIndex !== null && currentEditingWidgetIndex !== undefined) {
                                            const updatedWidgetData = [...widgetData];
                                            const widget = updatedWidgetData[currentEditingWidgetIndex];

                                            console.log(JSON.stringify(widget, null, 2));
                                            if (widget === undefined) {
                                                return;
                                            }
                                            if (widget.type === CPDFWidgetType.TEXT_FIELD) {
                                                const textWidget = widget as CPDFTextWidget;

                                                try {
                                                    console.log('ComPDFKitRN setText:', text);
                                                    // -------------------->
                                                    // change textFields text
                                                    await textWidget.setText(text);
                                                    await textWidget.updateAp();
                                                    // <---------------------
                                                    if (updatedWidgetData[currentEditingWidgetIndex]) {
                                                        (updatedWidgetData[currentEditingWidgetIndex] as CPDFTextWidget).text = text;
                                                    }
                                                    setWidgetData(updatedWidgetData);
                                                    setText('');
                                                } catch (error) {
                                                    console.error("Failed to update text widget:", error);
                                                }
                                            }
                                            setTextEditModalVisible(false);
                                        }
                                    }} style={styles.button}>
                                        <Text style={styles.buttonText}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                </SafeAreaView>
            </MenuProvider>
        </PDFReaderContext.Provider>
    );
};



const styles = StyleSheet.create({
    toolbar: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#FAFCFF',
        paddingHorizontal: 4,
    },
    toolbarButton: {
        padding: 8,
    },
    toolbarTitle: {
        flex: 1,
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        marginStart: 8
    },
    menuOption: {
        padding: 8,
        fontSize: 14,
        color: 'black',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(3, 3, 3, 0.2)',
    },
    modalContent: {
        width: '100%',
        maxHeight: '60%',
        backgroundColor: 'white',
        padding: 16,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        color: 'black'
    },
    widgetItem: {
        fontSize: 14,
        paddingVertical: 5,
        fontWeight: '500',
        color: 'black'
    },
    widgetBody: {
        fontSize: 14,
        paddingVertical: 5,

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

export default CPDFWidgetsExampleScreen;



