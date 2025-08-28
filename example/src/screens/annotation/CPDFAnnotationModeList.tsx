/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import PDFReaderContext, { CPDFAnnotationType, CPDFReaderView } from "@compdfkit_pdf_sdk/react_native";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";


const annotationModeList = [
    { 'type': CPDFAnnotationType.NOTE, 'icon': require('../../../assets/ic_comments.png') },
    { 'type': CPDFAnnotationType.HIGHLIGHT, 'icon': require('../../../assets/ic_highlight.png') },
    { 'type': CPDFAnnotationType.UNDERLINE, 'icon': require('../../../assets/ic_underline.png') },
    { 'type': CPDFAnnotationType.STRIKEOUT, 'icon': require('../../../assets/ic_strikeout.png') },
    { 'type': CPDFAnnotationType.SQUIGGLY, 'icon': require('../../../assets/ic_wavyline.png') },
    { 'type': CPDFAnnotationType.INK, 'icon': require('../../../assets/ic_freehand.png') },
    { 'type': CPDFAnnotationType.INK_ERASER, 'icon': require('../../../assets/ic_eraser.png') },
    { 'type': CPDFAnnotationType.PENCIL, 'icon': require('../../../assets/ic_pencil.png') },
    { 'type': CPDFAnnotationType.CIRCLE, 'icon': require('../../../assets/ic_oval.png') },
    { 'type': CPDFAnnotationType.SQUARE, 'icon': require('../../../assets/ic_rec.png') },
    { 'type': CPDFAnnotationType.ARROW, 'icon': require('../../../assets/ic_arrow.png') },
    { 'type': CPDFAnnotationType.LINE, 'icon': require('../../../assets/ic_line.png') },
    { 'type': CPDFAnnotationType.FREETEXT, 'icon': require('../../../assets/ic_text.png') },
    { 'type': CPDFAnnotationType.SIGNATURE, 'icon': require('../../../assets/ic_sign.png') },
    { 'type': CPDFAnnotationType.STAMP, 'icon': require('../../../assets/ic_stamp.png') },
    { 'type': CPDFAnnotationType.PICTURES, 'icon': require('../../../assets/ic_image.png') },
    { 'type': CPDFAnnotationType.LINK, 'icon': require('../../../assets/ic_link.png') },
    { 'type': CPDFAnnotationType.SOUND, 'icon': require('../../../assets/ic_music.png') },
];


export const CPDFAnnotationModeList: React.FC = () => {

    const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

    useEffect(() => {

    }, [pdfReader])

    const [selectedType, setSelectedType] = useState<CPDFAnnotationType>(CPDFAnnotationType.UNKNOWN);

    const handlePress = async (type: CPDFAnnotationType) => {

        if (pdfReader) {
            if (selectedType === type) {
                // If the same type is selected, toggle to UNKNOWN
                type = CPDFAnnotationType.UNKNOWN;
            }
            await pdfReader.setAnnotationMode(type);
            const mode = await pdfReader.getAnnotationMode();
            console.log(`Current annotation mode: ${mode}`);
            setSelectedType(prev => (prev === mode ? CPDFAnnotationType.UNKNOWN : mode));
        } else {
            console.log('pdfReader is not available');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList

                data={annotationModeList}
                horizontal={true}
                keyExtractor={(item) => item.type.toString()}
                renderItem={({ item }) => {
                    const isSelected = selectedType === item.type;
                    return (
                        <TouchableOpacity
                            onPress={() => handlePress(item.type)}
                            style={[
                                styles.iconWrapper,
                                isSelected && styles.iconWrapperSelected
                            ]}
                        >
                            <Image source={item.icon} style={styles.itemTailIcon} />
                        </TouchableOpacity>
                    );
                }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                numColumns={1}>
            </FlatList>
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
        flex: 1
    },
    itemTailIcon: {
        width: 26,
        height: 26,
        marginHorizontal: 8,
    },
    iconWrapper: {
        padding: 6,
        borderRadius: 20,
        marginHorizontal: 4,
    },
    iconWrapperSelected: {
        backgroundColor: '#145EF393', // macOS/iOS蓝色
    },
});