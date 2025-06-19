/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */


import PDFReaderContext, { CPDFReaderView } from "@compdfkit_pdf_sdk/react_native";
import { useContext, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { CPDFAnnotationModeList } from "./CPDFAnnotationModeList";
import { CPDFAnnotationHistoryToolView } from "./CPDFAnnotationHistoryToolView";




export const CPDFAnnotationToolbar: React.FC = () => {

    const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

    useEffect(() => {
    }, [pdfReader])

    return (
        <View style={styles.container}>
            <CPDFAnnotationModeList />
            <CPDFAnnotationHistoryToolView/>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 58
    }
});
