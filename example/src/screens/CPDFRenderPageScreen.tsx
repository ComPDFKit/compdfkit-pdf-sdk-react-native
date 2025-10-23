/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import PDFReaderContext, { CPDFImageUtil, CPDFReaderView } from "@compdfkit_pdf_sdk/react_native";
import { useContext, useEffect, useState } from "react";
import { Button, Image, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

interface CPDFRenderPageScreenProps {
    visible: boolean;
    onClose: () => void;
}

export const CPDFRenderPageScreen: React.FC<CPDFRenderPageScreenProps> = ({ visible, onClose }) => {

    const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

    const [renderPageIndex, setRenderPageIndex] = useState(0);
    const [lastRenderedIndex, setLastRenderedIndex] = useState<number | null>(null);


    const [pageCount, setPageCount] = useState(0);

    const [uri, setUri] = useState<string | null>(null);    

    useEffect(() => {
        const fetchPageCount = async () => {
            if (pdfReader) {
                const count = await pdfReader._pdfDocument.getPageCount();
                setPageCount(count);
            }
        };
        setRenderPageIndex(0);
        setLastRenderedIndex(null);
        setUri(null);
        fetchPageCount();        
    }, [visible, pdfReader])

    const renderNextPage = async () => {
        if (pdfReader) {
              const indexToRender = renderPageIndex;
            // Get the size of the page to render
            const size = await pdfReader._pdfDocument.getPageSize(indexToRender);
            // Render the page to a base64 image string
            const base64 = await pdfReader._pdfDocument.renderPage({
                pageIndex: renderPageIndex,
                width: size.width,
                height: size.height,
                pageCompression: 'png'
            });
            setUri(CPDFImageUtil.base64ToUri(base64));
            setLastRenderedIndex(indexToRender);

            setRenderPageIndex(prev => (prev + 1) % pageCount);
        }
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
                            <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 16 }}>Render Page to Image</Text>
                            <Text style={{ marginBottom: 16 }}>Page: {(lastRenderedIndex !== null ? lastRenderedIndex : renderPageIndex) + 1}</Text>
                            <Button title="Render Next Page" onPress={async () => {
                                await renderNextPage();
                            }} />
                            {uri && (
                                <View style={{ flex: 1, marginTop: 16, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={{ uri: uri }}
                                        style={{ width: '90%', height: '90%', resizeMode: 'contain', alignSelf: 'center' }}
                                    />
                                </View>
                            )}
                        
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
    }

});