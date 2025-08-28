

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
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";



export const CPDFAnnotationHistoryToolView: React.FC = () => {

    const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

    const [canUndo, setCanUndo] = useState<boolean>(false);

    const [canRedo, setCanRedo] = useState<boolean>(false);

    useEffect(() => {
        if (pdfReader) {
            pdfReader._annotationsHistoryManager.setOnHistoryStateChangedListener((canUndo, canRedo) => {
                setCanUndo(canUndo);
                setCanRedo(canRedo);
            });
        }
    }, [pdfReader])

    const handleUndo = async () => {

        if (pdfReader) {
            if(!canUndo){
                return;
            }
            const manager = pdfReader._annotationsHistoryManager
            console.log('ComPDFKit-RN: canUndo:' + await manager.canUndo())
            await manager.undo();
            
        } else {
            console.log('pdfReader is not available');
        }
    };

    const handleRedo = async () => {
        if (pdfReader) {
            if(!canRedo){
                return;
            }
            const manager = pdfReader._annotationsHistoryManager
            console.log('ComPDFKit-RN: canRedo:' + await manager.canRedo())
            await manager.redo();
            
        } else {
            console.log('pdfReader is not available');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleUndo}>
                <Image
                    style={canUndo ? styles.iconSelect : styles.iconNormal}
                    source={require('../../../assets/ic_undo.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRedo}>
                <Image
                    style={canRedo ? styles.iconSelect : styles.iconNormal}
                    source={require('../../../assets/ic_redo.png')}
                />
            </TouchableOpacity>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFCFF',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignContent: 'center',
        alignItems: 'center',
        height: 58,
        paddingHorizontal: 12,
    },
    iconNormal: {
        width: 24,
        height: 24,
        marginHorizontal: 8,
        marginVertical: 4,
        tintColor: '#00000055',
    },
    iconSelect: {
        width: 24,
        height: 24,
        marginHorizontal: 8,
        marginVertical: 4,
        tintColor: '#141111FF',
    }
});
