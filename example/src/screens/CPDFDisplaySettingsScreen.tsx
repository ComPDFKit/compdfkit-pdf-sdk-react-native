/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import PDFReaderContext, { CPDFDisplayMode, CPDFThemes } from "@compdfkit_pdf_sdk/react_native";
import { useContext, useEffect, useState } from "react";
import { Image, Modal, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { CPDFReaderView } from "../../../lib/typescript/src";



interface CPDFDisplaySettingsScreenProps {
    visible: boolean;
    onClose: () => void;
}

export const CPDFDisplaySettingsScreen: React.FC<CPDFDisplaySettingsScreenProps> = ({ visible, onClose }) => {

    
    const [isVertical, setIsVertical] = useState(false);

    const [displayMode, setDisplayMode] = useState(CPDFDisplayMode.SINGLE_PAGE);

    const [isFormFieldHighlight, setIsFormFieldHighlight] = useState(false);

    const [isLinkHighlight, setIsLinkHighlight] = useState(false);

    const [isContinuousScrolling, setIsContinuousScrolling] = useState(false);

    const [isCrop, setIsCrop] = useState(false);

    const [themes, setThemes] = useState(CPDFThemes.LIGHT);

    const [isCanScale, setCanScale] = useState(true);

    const pdfReader = useContext(PDFReaderContext) as CPDFReaderView | null;

    useEffect(() => {
        const checkSettings = async () => {
            if(pdfReader){
                const isVertical = await pdfReader.isVerticalMode();
                console.log('isVertical', isVertical);
                setIsVertical(isVertical);
                const isDoublePageMode = await pdfReader.isDoublePageMode();
                const isCoverPageMode = await pdfReader.isCoverPageMode();
                
                if(!isDoublePageMode){
                    setDisplayMode(CPDFDisplayMode.SINGLE_PAGE);
                } else {
                    setDisplayMode(isCoverPageMode ? CPDFDisplayMode.COVER_PAGE : CPDFDisplayMode.DOUBLE_PAGE);
                }
                const formFieldHighlight = await pdfReader?.isFormFieldHighlight();
                console.log('formFieldHighlight', formFieldHighlight);
                setIsFormFieldHighlight(formFieldHighlight);
                const isLinkHighlight = await pdfReader?.isLinkHighlight();
                console.log('isLinkHighlight', isLinkHighlight);
                setIsLinkHighlight(isLinkHighlight);
                setIsContinuousScrolling(await pdfReader?.isContinueMode());
                setIsCrop(await pdfReader?.isCropMode());
                
                setThemes(await pdfReader?.getReadBackgroundColor());
            }
        }
        
        if(visible){
            checkSettings();
        }
    }, [visible, pdfReader])

    const renderScrollItem = () =>{
        return (
            <View>
                <View style={styles.subTitleView}>
                    <Text style={styles.subTitle}>Scroll</Text>
                </View>
                
                {_item('Vertical Scrolling', isVertical, () => {
                    pdfReader?.setVerticalMode(true);
                    setIsVertical(true);
                })}
                {_item('Horizontal Scrolling', !isVertical, () => {
                    pdfReader?.setVerticalMode(false);
                    setIsVertical(false);
                })}
            </View>
        );
    }

    const renderDisplayMode = () => {
        return (
            <View>
                <View style={styles.subTitleView}>
                    <Text style={styles.subTitle}>Display Mode</Text>
                </View>
                
                {_item('Single Page', displayMode == CPDFDisplayMode.SINGLE_PAGE, () => {
                    pdfReader?.setDoublePageMode(false)
                    setDisplayMode(CPDFDisplayMode.SINGLE_PAGE)
                })}
                {_item('Two Page', displayMode == CPDFDisplayMode.DOUBLE_PAGE, () => {
                    pdfReader?.setDoublePageMode(true)
                    setDisplayMode(CPDFDisplayMode.DOUBLE_PAGE)
                })}
                {_item('Cover Mode', displayMode == CPDFDisplayMode.COVER_PAGE, () => {
                    pdfReader?.setCoverPageMode(true);
                    setDisplayMode(CPDFDisplayMode.COVER_PAGE)

                })}
            </View>
        );
    }

    const renderOtherSettings = () => {
        return (
            <View>
                <View style={styles.subTitleView} ></View>
                {_switchItem('Highlight Links', isLinkHighlight, (value) => {
                    pdfReader?.setLinkHighlight(value);
                    setIsLinkHighlight(value);
                })}
                {_switchItem('Highlight Form Fields', isFormFieldHighlight, (value) => {
                    pdfReader?.setFormFieldHighlight(value);
                    setIsFormFieldHighlight(value);
                })}
                {_switchItem('Continuous Scrolling', isContinuousScrolling, (value) => {
                    pdfReader?.setContinueMode(value);
                    setIsContinuousScrolling(value);
                })}
                {_switchItem('Crop', isCrop, (value) => {
                    pdfReader?.setCropMode(value);
                    setIsCrop(value);
                })}
                
                {Platform.OS === 'android' && _switchItem('Can Scale', isCanScale, (value) => {
                    pdfReader?.setCanScale(value);
                    setCanScale(value);
                })}
            </View>
        );
    }

    const renderThemes = () => {
        return (
            <View>
                <View style={styles.subTitleView}>
                    <Text style={styles.subTitle}>Themes</Text>
                </View>
                
                {_item('Light', themes == CPDFThemes.LIGHT, () => {
                    pdfReader?.setReadBackgroundColor(CPDFThemes.LIGHT);
                    setThemes(CPDFThemes.LIGHT);
                })}
                {_item('Dark',  themes == CPDFThemes.DARK, () => {
                    pdfReader?.setReadBackgroundColor(CPDFThemes.DARK);
                    setThemes(CPDFThemes.DARK);
                })}
                {_item('Sepia',  themes == CPDFThemes.SEPIA, () => {
                    pdfReader?.setReadBackgroundColor(CPDFThemes.SEPIA);
                    setThemes(CPDFThemes.SEPIA);
                })}
                {_item('Reseda',  themes == CPDFThemes.RESEDA, () => {
                    pdfReader?.setReadBackgroundColor(CPDFThemes.RESEDA);
                    setThemes(CPDFThemes.RESEDA);
                })}  
            </View>
        );
    }

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

    const _switchItem = (title : string, isChecked : boolean, onValueChange : (value : boolean) => void) => {
        return (
            <TouchableOpacity>
                <View style={styles.item}>
                    <Text style={styles.itemTextNormal}>{title}</Text>
                    <Switch 
                        thumbColor={isChecked ? '#1460F3' : 'white'}
                        trackColor={{false: '#E0E0E0', true: '#1460F34D'}}
                        value={isChecked} onValueChange={onValueChange}/>
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
                        <Text style={styles.title}>Settings</Text>
                            <ScrollView>
                                {renderScrollItem()}
                                {renderDisplayMode()}
                                {renderOtherSettings()}
                                {renderThemes()}
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
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    modalView: {
        backgroundColor: 'white',
        height: '80%',
        justifyContent: 'flex-start',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    title : {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop : 16,
        marginStart : 16,
        marginBottom : 16,
        color: 'black',
    },
    subTitleView : {
        justifyContent:'center',
        height: 32,
        marginHorizontal: 16,
        lineHeight:32,
        fontWeight : 'bold',
        backgroundColor: '#DDE9FF',
        paddingStart:8,
        borderRadius: 4
    },
    subTitle : {
        fontSize : 14,
        textAlignVertical: 'center',
        alignContent:'center',
        color : 'black',
        fontWeight : 'bold',
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
        fontSize: 12,
        color: 'gray'
    },
    itemTextSelect : {
        textAlignVertical: 'center',
        color: 'black',
        fontSize: 12
    }
});