/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import PDFReaderContext, { CPDFEditType, CPDFReaderView, CPDFViewMode, ComPDFKit } from '@compdfkit_pdf_sdk/react_native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
    CPDFReaderViewExample: { document?: string };
};

type CPDFContentEditorExampleScreenRouteProp = RouteProp<
    RootStackParamList,
    'CPDFReaderViewExample'
>;

const CPDFContentEditorExampleScreen = () => {

    const pdfReaderRef = useRef<CPDFReaderView>(null);

    const navigation = useNavigation();

    const route = useRoute<CPDFContentEditorExampleScreenRouteProp>();

    const [samplePDF] = useState(
        route.params?.document || (Platform.OS === 'android'
            ? 'file:///android_asset/PDF_Document.pdf'
            : 'PDF_Document.pdf')
    );

    useEffect(() => {
        if (pdfReaderRef) {
            pdfReaderRef.current?._editManager.historyManager.setOnHistoryStateChangedListener((pageIndex, canUndo, canRedo) => {
                console.log('ComPDFKit-RN: onContentEditorHistoryChanged - pageIndex:', pageIndex, ' canUndo:', canUndo, ' canRedo:', canRedo);
            });
        }
    }, [pdfReaderRef])

    const menuOptions = [
        'None',
        'Text',
        'Image',
        'Path',
        'Undo',
        'Redo'
    ];

    const handleMenuItemPress = async (action: string) => {
        switch (action) {
            case 'None':
                await handleChangeEditType([CPDFEditType.NONE]);
                break;
            case 'Text':
                await handleChangeEditType([CPDFEditType.TEXT]);
                break;
            case 'Image':
                await handleChangeEditType([CPDFEditType.IMAGE]);
                break;
            case 'Path':
                await handleChangeEditType([CPDFEditType.PATH]);
                break;
            case 'Undo':
                if (pdfReaderRef.current) {
                    const editManager = pdfReaderRef.current._editManager;
                    const canUndo = await editManager.historyManager.canUndo();
                    if (canUndo) {
                        await editManager.historyManager.undo();
                    }
                }
                break;
            case 'Redo':
                if (pdfReaderRef.current) {
                    const editManager = pdfReaderRef.current._editManager;
                    const canRedo = await editManager.historyManager.canRedo();
                    if (canRedo) {
                        await editManager.historyManager.redo();
                    }
                }
                break;
            default:
                break;
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleChangeEditType = async (editType: CPDFEditType[]) => {
        if (pdfReaderRef.current) {
            const result = await pdfReaderRef.current._editManager.changeEditType(editType);
            console.log('Change Edit Type Result: ', result);
        }
    }

    const renderToolbar = () => {
        return (
            <View style={styles.toolbar}>
                <HeaderBackButton onPress={handleBack} />
                <Text style={styles.toolbarTitle}>ContentEditor Example</Text>
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
                            onIOSClickBackPressed={handleBack}
                            configuration={ComPDFKit.getDefaultConfig({
                                modeConfig: {
                                    initialViewMode: CPDFViewMode.CONTENT_EDITOR
                                }
                            })} />
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

export default CPDFContentEditorExampleScreen;



