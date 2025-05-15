/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState, useRef } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import PDFReaderContext, { CPDFReaderView, ComPDFKit, CPDFToolbarAction, CPDFPageSize } from '@compdfkit_pdf_sdk/react_native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CPDFImportDocumentScreen } from './screens/CPDFImportDocumentScreen';
import { CPDFFileUtil } from './util/CPDFFileUtil';

type RootStackParamList = {
    CPDFReaderViewExample: { document?: string };
};

type CPDFPagesExampleScreenRouteProp = RouteProp<
    RootStackParamList,
    'CPDFReaderViewExample'
>;

const CPDFPagesExampleScreen = () => {

    const pdfReaderRef = useRef<CPDFReaderView>(null);

    const navigation = useNavigation();

    const route = useRoute<CPDFPagesExampleScreenRouteProp>();

    const [importModalVisible, setImportModalVisible] = useState(false);

    const [samplePDF] = useState(
        route.params?.document || (Platform.OS === 'android'
            ? 'file:///android_asset/PDF_Document.pdf'
            : 'PDF_Document.pdf')
    );

    const handleSave = async () => {
        if (pdfReaderRef.current) {
            const success = await pdfReaderRef.current.save();
            if (success) {
                console.log('ComPDFKitRN save() : Document saved successfully');
            } else {
                console.log('ComPDFKitRN save() : Failed to save document');
            }
        }
    };

    const menuOptions = [
        'Save',
        'Import Document',
        'Split Document',
        'Insert Blank Page'];

    const handleMenuItemPress = async (action: string) => {
        switch (action) {
            case 'Save':
                handleSave();
                break;
            case 'Import Document':
                setImportModalVisible(true);
                break;
            case 'Split Document':
                // const uri = await ComPDFKit.createUri('split_document_test.pdf', '', 'application/pdf')

                const fileUtil = new CPDFFileUtil();
                const baseName = 'split_document_test';
                const extension = 'pdf';
                const uniqueFilePath = await fileUtil.getUniqueFilePath(baseName, extension);

                const pages = [0];
                const splitResult = await pdfReaderRef.current?._pdfDocument.splitDocumentPages(
                    uniqueFilePath, pages
                )
                console.log('ComPDFKitRN splitDocumentPages:', splitResult);
                if (splitResult) {
                    console.log('ComPDFKitRN splitDocumentPages: Split document saved at:', uniqueFilePath);
                    await pdfReaderRef?.current?._pdfDocument.open(uniqueFilePath);
                }
                break;
            case 'Insert Blank Page':
                const insertResult = await pdfReaderRef.current?._pdfDocument.insertBlankPage(1, CPDFPageSize.a4);
                console.log('ComPDFKitRN insertBlankPage:', insertResult);
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
                <Text style={styles.toolbarTitle}>Pages Example</Text>
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
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        {renderToolbar()}
                        <CPDFReaderView
                            ref={pdfReaderRef}
                            document={samplePDF}
                            configuration={ComPDFKit.getDefaultConfig({
                                toolbarConfig: {
                                    iosLeftBarAvailableActions: [
                                        CPDFToolbarAction.THUMBNAIL
                                    ]
                                }
                            })} />
                        <CPDFImportDocumentScreen
                            visible={importModalVisible}
                            onClose={() => {
                                setImportModalVisible(false);
                            }}
                            onImport={async (document, pageRange, insertPosition) => {
                                setImportModalVisible(false);
                                const importResult = await pdfReaderRef.current?._pdfDocument.importDocument(
                                    document, pageRange, insertPosition,
                                ).catch((error) => {
                                    console.log('ComPDFKitRN importDocument:', error.message);
                                });
                                console.log('ComPDFKitRN importDocument:', importResult);
                            }} />
                    </View>
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
});

export default CPDFPagesExampleScreen;



