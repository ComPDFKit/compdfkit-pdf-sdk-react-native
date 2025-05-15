/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import PDFReaderContext, { CPDFReaderView, CPDFViewMode } from "@compdfkit_pdf_sdk/react_native";
import { useContext, useState } from "react";
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

interface CPDFPreviewModeListScreenProps {
    visible: boolean;
    onClose: () => void;
}

export const CPDFPreviewModeListScreen : React.FC<CPDFPreviewModeListScreenProps> = ({ visible, onClose }) => {
    
    const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;
    
    const list = [
        {
            title : 'Viewer',
            mode : CPDFViewMode.VIEWER,
        },
        {
            title : 'Annotations',
            mode : CPDFViewMode.ANNOTATIONS,
        },
        {
            title : 'Content Editor',
            mode : CPDFViewMode.CONTENT_EDITOR,
        },
        {
            title : 'Forms',
            mode : CPDFViewMode.FORMS,
        },
        {
            title : 'Signatures',
            mode : CPDFViewMode.SIGNATURES,
        },
        ];

    const [viewMode, setViewMode] = useState<CPDFViewMode>(CPDFViewMode.VIEWER);
    
    const _item = (title : string, isChecked : boolean, onPress : () =>void) => {
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={styles.item}>
                    <Text style={isChecked ? styles.itemTextSelect : styles.itemTextNormal}>{title}</Text>
                    {isChecked && (
                        <Image source={require('../../assets/right.png')} style={{width: 24, height: 24, marginStart: 8}}/>
                    )}
                </View>
            </TouchableOpacity>
        );
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
                            <Text style={styles.title}>Mode List</Text>
                            <FlatList
                                data={list}
                                renderItem={({ item }) =>
                                    _item(
                                        item.title,
                                        viewMode === item.mode,
                                        () => {
                                            setViewMode(item.mode);
                                            pdfReader?.setPreviewMode(item.mode);
                                            onClose();
                                        }
                                    )
                                }
                                keyExtractor={item => item.title}
                                />
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
        justifyContent: 'flex-start',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title : {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop : 16,
        marginStart : 16,
        marginBottom : 16,
        color: 'black',
    },
    item : {
        height : 48,
        marginStart : 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginEnd : 16,
    },
    itemTextNormal : {
        textAlignVertical: 'center',
        fontSize: 14,
        color: 'gray'
    },
    itemTextSelect : {
        textAlignVertical: 'center',
        color: 'black',
        fontSize: 14
    }
});