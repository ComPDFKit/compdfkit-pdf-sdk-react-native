/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { CPDFReaderView, ComPDFKit, CPDFToolbarAction } from '@compdfkit_pdf_sdk/react_native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

type RootStackParamList = {
    CPDFReaderViewExample: { document?: string }; 
};

type CPDFReaderViewExampleScreenRouteProp = RouteProp<
    RootStackParamList,
    'CPDFReaderViewExample'
>;

const CPDFReaderViewExampleScreen = () => {

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

    return (
        <CPDFReaderView
            ref={pdfReaderRef}
            document={samplePDF}
            configuration={ComPDFKit.getDefaultConfig({
                toolbarConfig: {
                    mainToolbarVisible: true,
                    iosLeftBarAvailableActions:[
                        CPDFToolbarAction.THUMBNAIL
                      ]
                }
            })}
        />
    );
};

export default CPDFReaderViewExampleScreen;
