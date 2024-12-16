/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import { CPDFReaderView, ComPDFKit, CPDFToolbarAction } from '@compdfkit_pdf_sdk/react_native';
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

const CPDFReaderViewControllerExampleScreen = () => {

    const pdfReaderRef = useRef<CPDFReaderView>(null);

    const navigation = useNavigation();

    const route = useRoute<CPDFReaderViewExampleScreenRouteProp>();

    const [samplePDF] = useState(
        route.params?.document || (Platform.OS === 'android'
            ? 'file:///android_asset/PDF_Document.pdf'
            : 'PDF_Document.pdf')
    );

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            // Save document changes
            handleSave();
            navigation.dispatch(e.data.action);
        });

        return unsubscribe;
    }, [navigation]);

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

    const handleBack = () => {
        navigation.goBack();
    };

    const menuOptions = [
        'save',
        'hasChange',
        'setDisplayPageIndex',
        'getCurrentPageIndex',
        'removeAllAnnotations',
        'importAnnotations',
        'exportAnnotations',
        'setMargins',
        'removeSignFileList']

    const handleMenuItemPress = async (action: string) => {
        switch (action) {
            case 'save':
                handleSave();
                break;
            case 'hasChange':
                const hasChange = await pdfReaderRef.current?.hasChange();
                console.log('ComPDFKitRN hasChange:', hasChange);
                break;
            case 'setDisplayPageIndex':
                await pdfReaderRef.current?.setDisplayPageIndex(1);
                break;
            case 'getCurrentPageIndex':
                const pageIndex = await pdfReaderRef.current?.getCurrentPageIndex();
                console.log('ComPDFKitRN currentPageIndex:', pageIndex);
                break;
            case 'removeAllAnnotations':
                const removeResult = await pdfReaderRef.current?.removeAllAnnotations();
                console.log('ComPDFKitRN removeAllAnnotations:', removeResult);
                break;
            case 'importAnnotations':
                try {

                    // Android
                    // import xfdf file from android assets directory
                    // const testXfdf = Platform.OS === 'android'
                    //     ? 'file:///android_asset/test.xfdf'
                    //     : 'test.xfdf'
                    // import xfdf file from file path
                    // const testXfdf = '/data/user/0/com.compdfkit.reactnative.example/xxx/xxx.xfdf';

                    // const importResult = await pdfReaderRef.current?.importAnnotations(testXfdf);
                    // console.log('ComPDFKitRN importAnnotations:', importResult);


                    // Select an xfdf file from the public directory and import it into the current document
                    const pickerResult = DocumentPicker.pick({
                        type: [DocumentPicker.types.allFiles],
                        copyTo: 'cachesDirectory'
                    });
                    pickerResult.then(async (res) => {
                        const file = res[0];
                        const fileName = file?.name;
                        if (!fileName?.endsWith('xfdf')) {
                            console.log('ComPDFKitRN please select xfdf format file');
                            return;
                        }

                        console.log('fileUri:', file?.uri);
                        console.log('fileCopyUri:', file?.fileCopyUri);
                        console.log('fileType:', file?.type);
                        const path = file!!.fileCopyUri!!

                        const importResult = await pdfReaderRef.current?.importAnnotations(path);
                        console.log('ComPDFKitRN importAnnotations:', importResult);
                    })
                } catch (err) {
                }
                break;
            case 'exportAnnotations':
                const exportXfdfFilePath = await pdfReaderRef.current?.exportAnnotations();
                console.log('ComPDFKitRN exportAnnotations:', exportXfdfFilePath);
                break;
            case 'setMargins':
                await pdfReaderRef.current?.setMargins(10, 20, 10, 20)
                break;
            case 'removeSignFileList':
                await ComPDFKit.removeSignFileList();
                break;
            default:
                break;
        }
    };

    const renderToolbar = () => {
        return (
            <View style={styles.toolbar}>
                <HeaderBackButton onPress={handleBack} />
                <Text style={styles.toolbarTitle}>Controller Example</Text>

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

    const onPageChanged = (pageIndex: number) => {
        console.log('ComPDFKitRN --- onPageChanged:', pageIndex);
    }

    const saveDocument = () => {
        console.log('ComPDFKitRN saveDocument');
    }


    return (
        <MenuProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {renderToolbar()}
                    <CPDFReaderView
                        ref={pdfReaderRef}
                        document={samplePDF}
                        onPageChanged={onPageChanged}
                        saveDocument={saveDocument}
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
        padding: 10,
        fontSize: 16,
        color: 'black',
    },
});

export default CPDFReaderViewControllerExampleScreen;



