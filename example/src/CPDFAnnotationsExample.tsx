/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState, useRef } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { CPDFReaderView, ComPDFKit, CPDFToolbarAction, CPDFDocument } from '@compdfkit_pdf_sdk/react_native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import DocumentPicker from 'react-native-document-picker';

type RootStackParamList = {
    CPDFReaderViewExample: { document?: string };
};

type CPDFReaderViewExampleScreenRouteProp = RouteProp<
    RootStackParamList,
    'CPDFReaderViewExample'
>;

const CPDFAnnotationsExampleScreen = () => {

    const pdfReaderRef = useRef<CPDFReaderView>(null);

    const navigation = useNavigation();

    const route = useRoute<CPDFReaderViewExampleScreenRouteProp>();

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
        'Remove All Annotations',
        'Import Annotations 1',
        'Import Annotations 2',
        'Export Annotations',
        'Import Widgets',
        'Export Widgets',
        'openDocument'];

    const handleMenuItemPress = async (action: string) => {
        switch (action) {
            case 'Save':
                handleSave();
                break;
            case 'Remove All Annotations':
                const removeResult = await pdfReaderRef.current?._pdfDocument.removeAllAnnotations();
                console.log('ComPDFKitRN removeAllAnnotations:', removeResult);
                break;
            case 'Import Annotations 1':
                try {
                    // Select an xfdf file from the public directory and import it into the current document
                    const pickerResult = DocumentPicker.pick({
                        type: [DocumentPicker.types.allFiles],
                        copyTo: 'cachesDirectory'
                    });
                    pickerResult.then(async (res) => {
                        const file = res[0];
                    
                        console.log('fileUri:', file?.uri);
                        console.log('fileCopyUri:', file?.fileCopyUri);
                        console.log('fileType:', file?.type);
                        const path = file!!.fileCopyUri!!
                        if (!path?.endsWith('xml') && !path?.endsWith('xfdf')) {
                            console.log('ComPDFKitRN please select xfdf format file');
                            return;
                        }

                        const importResult = await pdfReaderRef.current?._pdfDocument.importAnnotations(path);
                        console.log('ComPDFKitRN importAnnotations:', importResult);
                    })
                } catch (err) {
                }
                break;
            case 'Import Annotations 2':
                    // Android
                    // import xfdf file from android assets directory
                    const testXfdf = Platform.OS === 'android'
                        ? 'file:///android_asset/test.xfdf'
                        : 'test.xfdf'
                    // import xfdf file from file path
                    // const testXfdf = '/data/user/0/com.compdfkit.reactnative.example/xxx/xxx.xfdf';

                    const importResult = await pdfReaderRef.current?._pdfDocument.importAnnotations(testXfdf);
                    console.log('ComPDFKitRN importAnnotations:', importResult);
                break;
            case 'Export Annotations':
                const exportXfdfFilePath = await pdfReaderRef.current?._pdfDocument.exportAnnotations();
                console.log('ComPDFKitRN exportAnnotations:', exportXfdfFilePath);
                break;
            case 'Import Widgets':
                const pickerResult = DocumentPicker.pick({
                    type: [DocumentPicker.types.allFiles],
                    copyTo: 'cachesDirectory'
                });
                pickerResult.then(async (res) => {
                    const file = res[0];
                
                    console.log('fileUri:', file?.uri);
                    console.log('fileCopyUri:', file?.fileCopyUri);
                    console.log('fileType:', file?.type);
                    const path = file!!.fileCopyUri!!
                    if (!path?.endsWith('xml') && !path?.endsWith('xfdf')) {
                        console.log('ComPDFKitRN please select xfdf format file');
                        return;
                    }
                    console.log('ComPDFKitRN importWidget, filePath:', path);
                    const importWidgetResult = await pdfReaderRef.current?._pdfDocument.importWidgets(path);
                    console.log('ComPDFKitRN importWidget:', importWidgetResult);
                })
                
                break;
            case 'Export Widgets':
                const exportWidgetsPath = await pdfReaderRef.current?._pdfDocument.exportWidgets();
                console.log('ComPDFKitRN exportWidgets:', exportWidgetsPath)
                break;
                           case 'openDocument':
                                const document = await ComPDFKit.pickFile();
                                if (document) {
                                    await pdfReaderRef.current?._pdfDocument.open(document);
                                }
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
                <Text style={styles.toolbarTitle}>Annotations Example</Text>

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
                </View>
            </SafeAreaView>
        </MenuProvider>
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

export default CPDFAnnotationsExampleScreen;



