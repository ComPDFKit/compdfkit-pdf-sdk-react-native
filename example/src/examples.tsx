/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { Platform } from 'react-native';
import { ComPDFKit } from '@compdfkit_pdf_sdk/react_native';
import DocumentPicker from 'react-native-document-picker'

const examples = [
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
        action: (component: any)  => {
            // Pick a PDF file from the local storage of Android or iOS device,
            // this example uses the `react-native-document-picker` package,
            // If you want to use this example, please add this package to your project first.
            try {
                const pickerResult = DocumentPicker.pick({
                    type: [DocumentPicker.types.pdf]
                });
                pickerResult.then(res => {
                    ComPDFKit.openDocument(res[0]?.uri as string, '', ComPDFKit.getDefaultConfig({}))
                })
            } catch (err) {
            }
        }
    },
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
        action: (component: any)  => {
            try {
                const pickerResult = DocumentPicker.pick({
                    type: [DocumentPicker.types.pdf]
                });
                pickerResult.then(res => {
                    component.props.navigation.navigate('CPDFReaderViewExample',{
                        document: res[0]?.uri as string
                    });
                })
            } catch (err) {
            }
        }
    }
];
export default examples;