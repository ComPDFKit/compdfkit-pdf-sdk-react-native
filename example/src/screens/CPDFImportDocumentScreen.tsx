/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import PDFReaderContext, { CPDFReaderView } from "@compdfkit_pdf_sdk/react_native";
import { useContext, useEffect, useState } from "react";
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';

interface CPDFImportDocumentScreenProps {
    visible: boolean;
    onClose: () => void;
    onImport: (document: string, pageRange: number[], insertPosition: number) => void;
}

export const CPDFImportDocumentScreen: React.FC<CPDFImportDocumentScreenProps> = ({ visible, onClose, onImport }) => {

    const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

    const [document, setDocument] = useState<DocumentPickerResponse | undefined>();

    const [text, setText] = useState('');

    const [insertTo, setInsertTo] = useState('');

    const [importAllPages, setImportAllPages] = useState(true);

    const [insertOption, setInsertOption] = useState<'firstPage' | 'lastPage' | 'insertAfter'>('firstPage');


    const handleTextChange = (newText: string) => {
        const formattedText = newText
            .replace(/[^0-9,]/g, '')
            .replace(/,+/g, ',');

        setText(formattedText);
    };

    useEffect(() => {

    }, [visible, pdfReader])

    const radioItem = (select: boolean, title: string, onPress: () => void) => {
        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={styles.option}>
                    <Text style={select ? styles.titleMedium : styles.titleMediumUnSelect}>{title}</Text>
                    {select && (
                        <Image source={require('../../assets/right.png')} style={styles.icon} />
                    )}
                </View>
            </TouchableWithoutFeedback>);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalView}>
                            <View style={{
                                flexDirection: 'row', justifyContent: 'space-between',
                                alignItems: 'center', marginTop: 16
                            }}>
                                <Text style={styles.titleLarge}>Import Document</Text>
                                <TouchableWithoutFeedback
                                    disabled={document === undefined || document === null}
                                    onPress={async () => {
                                        
                                        var pages: number[] = [];
                                        if (!importAllPages) {
                                            if (text === '') {
                                                console.log('input page range is null')
                                                return;
                                            }
                                            // This refers to the subscript position of the page number. 
                                            // For example, the subscript of the first page is 0, so -1 is needed.
                                            pages = text
                                                .split(',')
                                                .map(e => Number(e.trim()) - 1)
                                                .filter(num => !isNaN(num));
                                        }
                                        var insertPosition = 0;
                                        switch (insertOption) {
                                            case "firstPage":
                                                insertPosition = 0;
                                                break;
                                            case "lastPage":
                                                // To insert into the last page you can also set 'insertPosition' to -1
                                                const pageCount = await pdfReader?._pdfDocument.getPageCount();
                                                insertPosition = pageCount!;
                                                break;
                                            case "insertAfter":
                                                if (insertTo === '') {
                                                    console.log('insertTo page is empty----->')
                                                    return;
                                                }
                                                insertPosition = (Number(insertTo));
                                                break;
                                        }
                                        console.log('InsertDocumentInfo:', {
                                            'document': document?.fileCopyUri,
                                            'pages': pages,
                                            'insertPosition': insertPosition
                                        })
                                        onImport(document?.fileCopyUri!, pages, insertPosition)

                                    }}>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        color: document != null ? 'black' : 'grey',
                                        marginStart: 8,
                                    }}>Done</Text>
                                </TouchableWithoutFeedback>

                            </View>

                            <ScrollView keyboardShouldPersistTaps="handled">
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 56, alignItems: 'center', marginTop: 8 }}>
                                    <Text style={styles.titleMedium}>File Name</Text>
                                    <TouchableOpacity onPress={() => {
                                        const pickerResult = DocumentPicker.pick({
                                            type: [DocumentPicker.types.pdf],
                                            copyTo: 'cachesDirectory'
                                        });
                                        pickerResult.then(async (res) => {
                                            const file = res[0];
                                            const path = file!!.fileCopyUri!!
                                            if (!path?.endsWith('pdf')) {
                                                console.log('ComPDFKitRN please select pdf format file');
                                                return;
                                            }
                                            setDocument(file);
                                        })
                                    }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={styles.subTextMedium}>{document != null ? document.name : 'Select File'}</Text>
                                            <Image source={require('../../assets/arrow_right.png')} style={styles.icon} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.header}>Page Range</Text>
                                {/* Page Range Selection */}
                                {radioItem(importAllPages, 'All Pages', () => {
                                    setImportAllPages(true);
                                })}
                                {radioItem(!importAllPages, 'Custom Range', () => {
                                    setImportAllPages(false);
                                })}
                                <View pointerEvents={importAllPages ? 'none' : 'auto'}>
                                    <TextInput
                                        style={[
                                            styles.inputField,
                                            importAllPages && styles.disabledInput
                                        ]}
                                        value={text}
                                        onChangeText={handleTextChange}
                                        placeholder="e.g. 1,2,3,4"
                                        multiline={false}
                                        numberOfLines={1}
                                        returnKeyType='done'
                                        blurOnSubmit={true}
                                        editable={!importAllPages}
                                        autoFocus={!importAllPages}
                                    />
                                </View>
                                <Text style={styles.header}>Insert To</Text>
                                {radioItem(insertOption === 'firstPage', 'First Page', () => {
                                    setInsertOption('firstPage');
                                })}
                                {radioItem(insertOption === 'lastPage', 'Last Page', () => {
                                    setInsertOption('lastPage')
                                })}
                                {radioItem(insertOption === 'insertAfter', 'Insert After Specified Page', () => {
                                    setInsertOption('insertAfter')
                                })}

                                <View pointerEvents={insertOption != 'insertAfter' ? 'none' : 'auto'}>
                                    <TextInput
                                        style={[
                                            styles.inputField,
                                            !(insertOption === 'insertAfter') && styles.disabledInput
                                        ]}
                                        value={insertTo}
                                        onChangeText={text => setInsertTo(text.replace(/[^0-9]/g, ''))}
                                        placeholder="Please enter a page"
                                        multiline={false}
                                        numberOfLines={1}
                                        keyboardType='numeric'
                                        returnKeyType='done'
                                        blurOnSubmit={true}
                                        editable={insertOption === 'insertAfter'}
                                        autoFocus={insertOption === 'insertAfter'}
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalView: {
        backgroundColor: 'white',
        height: '80%',
        justifyContent: 'flex-start',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16
    },
    titleLarge: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    titleMedium: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        marginStart: 8
    },
    titleMediumUnSelect: {
        fontSize: 14,
        color: 'grey',
        marginStart: 8
    },
    textMedium: {
        fontSize: 14,
        color: 'black'
    },
    subTextMedium: {
        fontSize: 12,
        color: 'grey'
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 16
    },
    header: {
        fontSize: 14,
        height: 32,
        lineHeight: 32,
        textAlignVertical: 'center',
        color: 'black',
        fontWeight: 'bold',
        backgroundColor: '#DDE9FF',
        paddingStart: 8,
        borderRadius: 4
    },
    inputField: {
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 2,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginBottom: 20,
        marginTop: 8,
        textAlignVertical: 'center',
    },
    disabledInput: {
        backgroundColor: '#f2f2f2',
        color: 'gray'
    },
    option: {
        height: 48,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
});