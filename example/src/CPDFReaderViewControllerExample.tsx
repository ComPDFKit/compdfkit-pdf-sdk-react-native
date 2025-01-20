/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Image, Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import PDFReaderContext, { CPDFReaderView, ComPDFKit, CPDFToolbarAction } from '@compdfkit_pdf_sdk/react_native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CPDFDisplaySettingsScreen } from './screens/CPDFDisplaySettingsScreen';
import { CPDFPreviewModeListScreen } from './screens/CPDFPreviewModeListScreen';

type RootStackParamList = {
    CPDFReaderViewExample: { document?: string };
};

type CPDFReaderViewExampleScreenRouteProp = RouteProp<
    RootStackParamList,
    'CPDFReaderViewExample'
>;

const CPDFReaderViewControllerExampleScreen = () => {


    const [displaySettingModalVisible, setDisplaySettingModalVisible] = useState(false);

    const [previewModeModalVisible, setPreviewModeModalVisible] = useState(false);

    const pdfReaderRef = useRef<CPDFReaderView | null>(null);

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
        'openDocument',
        'save',
        'hasChange',
        'DisplaySettings',
        'PreviewModeScreen',
        'showThumbnailView',
        'showBotaView',
        'showAddWatermarkView',
        'showSecurityView',
        'showDisplaySettingView',
        'enterSnipMode',
        'exitSnipMode',
        'setDisplayPageIndex',
        'getCurrentPageIndex',
        'setMargins',
        'removeSignFileList',
        'setScale',
        'setPageSpacing',
        'setPageSameWidth',
        'isPageInScreen',
        'setFixedScroll'];

    const handleMenuItemPress = async (action: string) => {
        switch (action) {
            case 'openDocument':
                const document = await ComPDFKit.pickFile();
                if (document) {
                    await pdfReaderRef.current?._pdfDocument.open(document);
                }
                break;
            case 'save':
                handleSave();
                break;
            case 'hasChange':
                const hasChange = await pdfReaderRef.current?._pdfDocument.hasChange();
                console.log('ComPDFKitRN hasChange:', hasChange);
                break;
            case 'DisplaySettings':
                setDisplaySettingModalVisible(true);
                break;
            case 'PreviewModeScreen':
                setPreviewModeModalVisible(true);
                break;
            case 'showThumbnailView':
                await pdfReaderRef.current?.showThumbnailView(false);
                break;
            case 'showBotaView':
                await pdfReaderRef.current?.showBotaView();
                break;
            case 'showAddWatermarkView':
                await pdfReaderRef.current?.showAddWatermarkView();
                break;
            case 'showSecurityView':
                await pdfReaderRef.current?.showSecurityView();
                break;
            case 'showDisplaySettingView':
                await pdfReaderRef.current?.showDisplaySettingView();
                break;
            case 'enterSnipMode':
                await pdfReaderRef.current?.enterSnipMode();
                break;
            case 'exitSnipMode':
                await pdfReaderRef.current?.exitSnipMode();
                break;
            case 'setDisplayPageIndex':
                await pdfReaderRef.current?.setDisplayPageIndex(1);
                break;
            case 'getCurrentPageIndex':
                const pageIndex = await pdfReaderRef.current?.getCurrentPageIndex();
                console.log('ComPDFKitRN currentPageIndex:', pageIndex);
                break;
            case 'setMargins':
                await pdfReaderRef.current?.setMargins(10, 20, 10, 20)
                break;
            case 'removeSignFileList':
                await ComPDFKit.removeSignFileList();
                break;
            case 'setScale':
                await pdfReaderRef.current?.setScale(2.3);
                var scale = await pdfReaderRef.current?.getScale();
                console.log('ComPDFKitRN getScale:', scale);
                break;
            case 'setPageSpacing':
                await pdfReaderRef.current?.setPageSpacing(50);
                break;
            case 'setPageSameWidth':
                await pdfReaderRef.current?.setPageSameWidth(true);
                break;
            case 'isPageInScreen':
                const inScreen = await pdfReaderRef.current?.isPageInScreen(1);
                console.log('ComPDFKit-RN inScreen:', inScreen);
                break;
            case 'setFixedScroll':
                await pdfReaderRef.current?.setFixedScroll(false);
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

                    <MenuOptions customStyles={{ optionsWrapper: styles.menuOptionsWrapper }}>
                        <ScrollView>
                            {menuOptions.map((option, index) => (
                                <MenuOption key={index} onSelect={() => handleMenuItemPress(option)}>
                                    <Text style={styles.menuOption}>{option}</Text>
                                </MenuOption>
                            ))}
                        </ScrollView>
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
        <PDFReaderContext.Provider value={pdfReaderRef.current}>
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
                        <CPDFDisplaySettingsScreen
                            visible={displaySettingModalVisible}
                            onClose={() => setDisplaySettingModalVisible(false)}
                        />
                        <CPDFPreviewModeListScreen
                            visible={previewModeModalVisible}
                            onClose={() => setPreviewModeModalVisible(false)}
                        />
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
    menuOptionsWrapper: {
        maxHeight: 500,
    },
});

export default CPDFReaderViewControllerExampleScreen;



