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
import { CPDFReaderView, ComPDFKit, CPDFDocumentEncryptAlgo } from '@compdfkit_pdf_sdk/react_native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { CPDFFileUtil } from './util/CPDFFileUtil';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
    CPDFReaderViewExample: { document?: string };
};

type CPDFSecurityExampleRouteProp = RouteProp<
    RootStackParamList,
    'CPDFReaderViewExample'
>;

const CPDFSecurityExampleScreen = () => {

    const pdfReaderRef = useRef<CPDFReaderView>(null);

    const navigation = useNavigation();

    const route = useRoute<CPDFSecurityExampleRouteProp>();

    const [samplePDF] = useState(
        route.params?.document || (Platform.OS === 'android'
            ? 'file:///android_asset/PDF_Document.pdf'
            : 'PDF_Document.pdf')
    );

    const menuOptions = [
        'Set Password',
        'Remove Password',
        'Flatten All Pages',
        'Check Owner Password',
        'Document Info',
        'Verify Digital Signature',
        'Hide Verify Status View',];

    const handleMenuItemPress = async (action: string) => {
        const document = pdfReaderRef.current?._pdfDocument;
        switch (action) {
            case 'Set Password':
                const result = await document?.setPassword('1234', '4321', false,false, CPDFDocumentEncryptAlgo.AES128);
                console.log('ComPDFKit-RN setPassword:', result);
                break;
            case 'Remove Password':
                const removeResult = await document?.removePassword();
                console.log('ComPDFKit-RN removePassword:', removeResult);
                break;
            case 'Check Owner Password':
                console.log('ComPDFKit-RN checkOwnerPassword:', await document?.checkOwnerPassword('4321'));
                break;
            case 'Flatten All Pages':

                const fileUtil = new CPDFFileUtil();
                const baseName = 'flattened';
                const extension = 'pdf';

                const uniqueFilePath = await fileUtil.getUniqueFilePath(baseName, extension);

                // only android platform
                // const savePath = await ComPDFKit.createUri('rn_flatten_test.pdf', 'compdfkit', 'application/pdf');

                const flattenResult = await document?.flattenAllPages(uniqueFilePath, true)
                .catch(error => {
                    console.log('ComPDFKit-RN flattenAllPages error:', error);
                });
                console.log('ComPDFKit-RN flattenAllPages:', flattenResult);
                console.log('ComPDFKit-RN uniqueFilePath:', uniqueFilePath);
                if(flattenResult){
                    pdfReaderRef?.current?._pdfDocument?.open(uniqueFilePath)
                }
                break;
            case 'Document Info':
                console.log('ComPDFKit-RN fileName:', await document?.getFileName());
                console.log('ComPDFKit-RN documentPath:', await document?.getDocumentPath());
                console.log('ComPDFKit-RN pageCount:', await document?.getPageCount());
                console.log('ComPDFKit-RN isEncrypted:', await document?.isEncrypted());
                console.log('ComPDFKit-RN isImageDoc:', await document?.isImageDoc());
                console.log('ComPDFKit-RN permissions:', await document?.getPermissions());
                console.log('ComPDFKit-RN getEncryptAlgo:', await document?.getEncryptAlgo());
                console.log('ComPDFKit-RN checkOwnerUnlocked:', await document?.checkOwnerUnlocked());
                break;
            case 'Verify Digital Signature':
                await pdfReaderRef.current?.verifyDigitalSignatureStatus();
                break;    
            case 'Hide Verify Status View':
                await pdfReaderRef.current?.hideDigitalSignStatusView();
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
                <Text style={styles.toolbarTitle}>Security Example</Text>
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
            <SafeAreaView style={{ flex: 1 , backgroundColor: '#FAFCFF' }}>
                <View style={{ flex: 1 }}>
                    {renderToolbar()}
                    <CPDFReaderView
                        ref={pdfReaderRef}
                        document={samplePDF}
                        configuration={ComPDFKit.getDefaultConfig({})}
                        onIOSClickBackPressed={handleBack} />
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

export default CPDFSecurityExampleScreen;



