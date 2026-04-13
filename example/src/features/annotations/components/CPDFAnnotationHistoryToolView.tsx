

/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import PDFReaderContext, { CPDFAnnotation, CPDFReaderView, CPDFWidget } from "@compdfkit_pdf_sdk/react_native";
import { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Logger } from '../../../util/logger';



export const CPDFAnnotationHistoryToolView: React.FC = () => {

    const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

    const [canUndo, setCanUndo] = useState<boolean>(false);

    const [canRedo, setCanRedo] = useState<boolean>(false);

    const [selectAnnotation, setSelectAnnotation] = useState<CPDFAnnotation | null>(null);

    const [selectWidget, setSelectWidget] = useState<CPDFWidget | null>(null);

    useEffect(() => {
        if (pdfReader) {
            pdfReader._annotationsHistoryManager.setOnHistoryStateChangedListener((canUndo, canRedo) => {
                setCanUndo(canUndo);
                setCanRedo(canRedo);
            });

            pdfReader.addEventListener('annotationsSelected', (event : CPDFAnnotation) => {
                setSelectAnnotation(event);
            })

            pdfReader.addEventListener('annotationsDeselected', () => {
                setSelectAnnotation(null);
                setSelectWidget(null);
            })

            pdfReader.addEventListener('formFieldsSelected', (event : CPDFWidget) => {
                setSelectWidget(event);
            })
            
            pdfReader.addEventListener('formFieldsDeselected', () => {
                setSelectWidget(null);
                setSelectAnnotation(null);
            })
        }
    }, [pdfReader])

    const handleShowProperties = async () => {
        if(selectAnnotation != null){
            await pdfReader?.showAnnotationPropertiesView(selectAnnotation);
            return;
        }
        if(selectWidget != null){
            await pdfReader?.showWidgetPropertiesView(selectWidget);
            return;
        }
    };

    const handleUndo = async () => {

        if (pdfReader) {
            if(!canUndo){
                return;
            }
            const manager = pdfReader._annotationsHistoryManager
            Logger.log('ComPDFKit-RN: canUndo:' + await manager.canUndo())
            await manager.undo();
            
        } else {
            Logger.log('pdfReader is not available');
        }
    };

    const handleRedo = async () => {
        if (pdfReader) {
            if(!canRedo){
                return;
            }
            const manager = pdfReader._annotationsHistoryManager
            Logger.log('ComPDFKit-RN: canRedo:' + await manager.canRedo())
            await manager.redo();
            
        } else {
            Logger.log('pdfReader is not available');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleShowProperties}>
                <Image
                    style={selectAnnotation != null || selectWidget != null ? styles.iconSelect : styles.iconNormal}
                    source={require('../../../../assets/ic_setting.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUndo}>
                <Image
                    style={canUndo ? styles.iconSelect : styles.iconNormal}
                    source={require('../../../../assets/ic_undo.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRedo}>
                <Image
                    style={canRedo ? styles.iconSelect : styles.iconNormal}
                    source={require('../../../../assets/ic_redo.png')}
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
