/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */
import PDFReaderContext, { CPDFReaderView, CPDFWidgetType } from "@compdfkit_pdf_sdk/react_native";
import { useContext, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";


const formModeList = [
    { 'type': CPDFWidgetType.TEXT_FIELD, 'icon': require('../../../assets/ic_textfield.png') },
    { 'type': CPDFWidgetType.CHECKBOX, 'icon': require('../../../assets/ic_checkbox.png') },
    { 'type': CPDFWidgetType.RADIO_BUTTON, 'icon': require('../../../assets/ic_radiobutton.png') },
    { 'type': CPDFWidgetType.LISTBOX, 'icon': require('../../../assets/ic_listbox.png') },
    { 'type': CPDFWidgetType.COMBOBOX, 'icon': require('../../../assets/ic_combo_box.png') },
    { 'type': CPDFWidgetType.SIGNATURES_FIELDS, 'icon': require('../../../assets/ic_form_sign.png') },
    { 'type': CPDFWidgetType.PUSH_BUTTON, 'icon': require('../../../assets/ic_push_button.png') },
];


export const CPDFFormCreationModeList: React.FC = () => {

    const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

    useEffect(() => {

    }, [pdfReader])

    const [selectedType, setSelectedType] = useState<CPDFWidgetType>(CPDFWidgetType.UNKNOWN);

    const handlePress = async (type: CPDFWidgetType) => {

        if (pdfReader) {
            if (selectedType === type) {
                // If the same type is selected, toggle to UNKNOWN
                type = CPDFWidgetType.UNKNOWN;
            }
            await pdfReader.setFormCreationMode(type);
            const mode = await pdfReader.getFormCreationMode();
            console.log(`Current form creation mode: ${mode}`);
            setSelectedType(prev => (prev === mode ? CPDFWidgetType.UNKNOWN : mode));
        } else {
            console.log('pdfReader is not available');
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={formModeList}
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
        backgroundColor: '#145EF393', 
    },
});