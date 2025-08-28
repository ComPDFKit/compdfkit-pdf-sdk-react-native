/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { Platform } from 'react-native';
import { ComPDFKit } from '@compdfkit_pdf_sdk/react_native';

const modalViewExamples = [
    {
        key: 'item1',
        title: 'Basic Example',
        description: `Open sample pdf document`,
        action: (component: any) => {
            var samplePDF: string = Platform.OS == 'android' ? 'file:///android_asset/PDF_Document.pdf' : 'PDF_Document.pdf'
            // We provide default UI and PDF property related configurations here, you can modify configuration options according to your needs.
            var config = ComPDFKit.getDefaultConfig({})
            ComPDFKit.openDocument(samplePDF, '', config)
        }
    },
    {
        key: 'item2',
        title: 'Select External Files Example',
        description: `Select pdf document form system file manager`,
        action: async (component: any)  => {
            // Pick a PDF file from the local storage of Android or iOS device,
            // this example uses the `react-native-document-picker` package,
            // If you want to use this example, please add this package to your project first.
            try {
                const pdfPath = await ComPDFKit.pickFile();
                if(pdfPath != null){
                    ComPDFKit.openDocument(pdfPath, '', ComPDFKit.getDefaultConfig({}))
                }
            } catch (err) {
            }
        }
    }
];


const uiConpomentExamples = [
    {
        key: 'item3',
        title: 'CPDFReaderView Example',
        description: 'Display pdf view in react native component',
        action: (component: any)  => {
            component.props.navigation.navigate('CPDFReaderViewExample');
        }
    },
    {
        key: 'item4',
        title: 'CPDFReaderView Example 2',
        description: 'Select a file from the system storage and display the PDF view in the React Native component',
        action: async (component: any)  => {
            try {
                const pdfPath = await ComPDFKit.pickFile();

                if(pdfPath != null){
                    component.props.navigation.navigate('CPDFReaderViewExample',{
                        document: pdfPath
                    });
                }
            } catch (err) {
            }
        }
    },
    {
        key: 'item5',
        title: 'CPDFReaderView Controller Example',
        description: 'Examples of functions that can be used with the PDF component',
        action: (component: any)  => {
            component.props.navigation.navigate('CPDFReaderViewControllerExample');
        }
    },
    {
        key: 'item6',
        title: 'Annotations Example',
        description: 'Demonstrate annotation functionality in CPDFReaderView, including adding, editing, and deleting.',
        action: (component: any)  => {
            component.props.navigation.navigate('CPDFAnnotationsExample');
        }
    },
    {
        key: 'item7',
        title: 'Widgets Example',
        description: 'Demonstrate form functionality in CPDFReaderView, including retrieving, modifying, importing, and exporting data.',
        action: (component: any)  => {
            component.props.navigation.navigate('CPDFWidgetsExample');
        }
    },
    {
        key: 'item8',
        title: 'Security Example',
        description: 'This example shows how to set passwords, watermarks, etc.',
        action: (component: any)  => {
            component.props.navigation.navigate('CPDFSecurityExample');
        }
    },
    {
        key: 'item9',
        title: 'Pages Example',
        description: 'This example demonstrates PDF page related operations, such as inserting and splitting PDF documents.',
        action: (component: any)  => {
            component.props.navigation.navigate('CPDFPagesExample');
        }
    },
    {
        key: 'item10',
        title: 'SearchText Example',
        description: 'This example demonstrates text searching functionality in the PDF document.',
        action: (component: any)  => {
            component.props.navigation.navigate('CPDFSearchTextExample');
        }
    },
];

export const examples = [
    { key: 'header1', type: 'header', title: 'CPDFReaderView Examples' },
    ...uiConpomentExamples.map(item => ({ ...item, type: 'uiComponent' })),

    { key: 'header2', type: 'header', title: 'Modal View Examples' },
    ...modalViewExamples.map(item => ({ ...item, type: 'modalView' }))
];
