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
import PDFReaderContext, { CPDFReaderView, ComPDFKit, CPDFAnnotation, CPDFViewMode, botaMenus } from '@compdfkit_pdf_sdk/react_native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { keepLocalCopy, pick, types } from '@react-native-documents/picker';
import { CPDFAnnotationListScreen } from './screens/CPDFAnnotationListScreen';
import { CPDFAnnotationToolbar } from './screens/annotation/CPDFAnnotationToolbar';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
    CPDFReaderViewExample: { document?: string };
};

type CPDFReaderViewExampleScreenRouteProp = RouteProp<
    RootStackParamList,
    'CPDFReaderViewExample'
>;

const CPDFAnnotationsExampleScreen = () => {

    const pdfReaderRef = useRef<CPDFReaderView>(null);

    const [pdfReader, setPdfReader] = useState<CPDFReaderView | null>(null);

    const navigation = useNavigation();

    const route = useRoute<CPDFReaderViewExampleScreenRouteProp>();

    const [annotationModalVisible, setAnnotationModalVisible] = useState(false);

    const [annotationData, setAnnotationData] = useState<CPDFAnnotation[]>([]);

    const [samplePDF] = useState(
        route.params?.document || (Platform.OS === 'android'
            ? 'file:///android_asset/annot_test.pdf'
            : 'annot_test.pdf')
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
        'openDocument',
        'Save',
        'Remove All Annotations',
        'Import Annotations 1',
        'Import Annotations 2',
        'Export Annotations',
        'Get Annotations',
        'Clear Rects',
        'SaveCurrentInk'
    ];

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
                            const importResult = await pdfReaderRef.current?._pdfDocument.importAnnotations(uri);
                            console.log('ComPDFKitRN importAnnotations:', importResult);
                        } else {
                            console.log('ComPDFKitRN Please select a valid xfdf or xml file');
                        }
                    }
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
            case 'openDocument':
                const document = await ComPDFKit.pickFile();
                if (document) {
                    await pdfReaderRef.current?._pdfDocument.open(document);
                }
                break;
            case 'Get Annotations':
                const pageCount = await pdfReaderRef!.current!._pdfDocument.getPageCount();
                let allAnnotations: CPDFAnnotation[] = [];
                for (let i = 0; i < pageCount; i++) {
                    const page = pdfReaderRef?.current?._pdfDocument.pageAtIndex(i);
                    const annotations = await page?.getAnnotations();
                    if (annotations) {
                        allAnnotations = allAnnotations.concat(annotations);
                    }
                }
                setAnnotationData(allAnnotations);
                setAnnotationModalVisible(true);
                break;
            case 'Clear Rects':
                await pdfReaderRef.current?.clearDisplayRect();
                break;  
            case 'SaveCurrentInk':
                const saveInkResult = await pdfReaderRef.current?.saveCurrentInk();
                console.log('ComPDFKitRN saveCurrentInk:', saveInkResult);
                break;      
            default:
                break;
        }
    };

    useEffect(() => {
        if (pdfReaderRef.current) {
            setPdfReader(pdfReaderRef.current);
        }
    }, []);

    useEffect(() => {
            const unsubscribe = navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
                // Save document changes
                handleSave();
                navigation.dispatch(e.data.action);
            });
            return unsubscribe;
        }, [navigation]);

    const handleBack = async () => {
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
        <PDFReaderContext.Provider value={pdfReader}>
            <MenuProvider>
                <SafeAreaView style={{ flex: 1 , backgroundColor: '#FAFCFF'}}>
                    <View style={{ flex: 1 }}>
                        {renderToolbar()}
                        <CPDFReaderView
                            ref={pdfReaderRef}
                            document={samplePDF}
                            onIOSClickBackPressed={() => {
                                console.log('onIOSClickBackPressed');
                                navigation.goBack();
                            }}
                            configuration={ComPDFKit.getDefaultConfig({
                                modeConfig: {
                                    initialViewMode: CPDFViewMode.ANNOTATIONS,
                                    uiVisibilityMode: 'automatic'
                                },
                                toolbarConfig: {
                                    annotationToolbarVisible: false
                                }
                            })} />
                        <CPDFAnnotationToolbar />
                        <CPDFAnnotationListScreen
                            visible={annotationModalVisible}
                            annotations={annotationData}
                            onClose={() => {
                                setAnnotationModalVisible(false)
                            }}
                            onDelete={async (annotation) => {
                                // const page = pdfReaderRef.current?._pdfDocument.pageAtIndex(annotation.page);
                                // page?.removeAnnotation(annotation);
                                await pdfReaderRef.current?._pdfDocument.removeAnnotation(annotation);
                                setAnnotationModalVisible(false);
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

export default CPDFAnnotationsExampleScreen;



