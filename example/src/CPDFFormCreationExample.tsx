/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import PDFReaderContext, { CPDFReaderView, ComPDFKit, CPDFViewMode } from '@compdfkit_pdf_sdk/react_native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CPDFFormCreationToolbar } from './screens/form/CPDFFormCreationToolbar';

type RootStackParamList = {
    CPDFFormCreationExample: { document?: string };
};

type CPDFFormCreationExampleScreenRouteProp = RouteProp<
    RootStackParamList,
    'CPDFFormCreationExample'
>;

const CPDFFormCreationExampleScreen = () => {

    const pdfReaderRef = useRef<CPDFReaderView>(null);

    const [pdfReader, setPdfReader] = useState<CPDFReaderView | null>(null);

    const navigation = useNavigation();

    const route = useRoute<CPDFFormCreationExampleScreenRouteProp>();

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
                <Text style={styles.toolbarTitle}>Form Creation Example</Text>
            </View>
        );
    };

    return (
        <PDFReaderContext.Provider value={pdfReader}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFCFF' }}>
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
                                initialViewMode: CPDFViewMode.FORMS,
                                uiVisibilityMode: 'automatic'
                            },
                            toolbarConfig: {
                                formToolbarVisible: false
                            },
                        })} />
                    <CPDFFormCreationToolbar />
                </View>
            </SafeAreaView>
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

export default CPDFFormCreationExampleScreen;



