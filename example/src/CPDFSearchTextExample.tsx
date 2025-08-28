/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState, useRef } from 'react';
import { Image, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { CPDFReaderView, ComPDFKit, CPDFSearchOptions, CPDFTextRange } from '@compdfkit_pdf_sdk/react_native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CPDFSearchItem } from './model/CPDFSearchItem';
import CPDFSearchTextListScreen from './screens/CPDFSearchTextListScreen';

type RootStackParamList = {
    CPDFSearchTextExample: { document?: string };
    CPDFSearchTextListScreen: { list: CPDFSearchItem[] };
};

type CPDFSearchTextExampleRouteProp = RouteProp<
    RootStackParamList,
    'CPDFSearchTextExample'
>;

const CPDFSearchTextExampleScreen = () => {

    const pdfReaderRef = useRef<CPDFReaderView>(null);

    const navigation = useNavigation<any>();

    const route = useRoute<CPDFSearchTextExampleRouteProp>();

    const [samplePDF] = useState(
        route.params?.document || (Platform.OS === 'android'
            ? 'file:///android_asset/PDF_Document.pdf'
            : 'PDF_Document.pdf')
    );

    const [searchText, setSearchText] = useState('Dev');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentSelectionIndex, setCurrentSelectionIndex] = useState(0);

    const [searchListModalVisible, setSearchListModalVisible] = useState(false);

    const [searchItemData, setSearchItemData] = useState<CPDFSearchItem[]>([]);

    const handleBack = () => {
        navigation.goBack();
    };

    const startSearch = async () => {
        setCurrentSelectionIndex(0);
        if (searchText != null && searchText.trim() !== '') {
            const document = pdfReaderRef.current?._pdfDocument;
            const textSearcher = document!.textSearcher;

            console.log('ComPDFKitRN', 'Searching with options:');
            const results = await textSearcher!.searchText(searchText, CPDFSearchOptions.CaseInsensitive);
            console.log('ComPDFKitRN', 'Search results:', results);
            
            // select the first result if available
            if (results.length > 0) {
                setSearchResults(results || []);
                setHasSearched(true);
                setCurrentSelectionIndex(0);
                textSearcher.selection(results[0]!);

                const texts = await Promise.all(results.map(async (item) => {
                    const newRange = item.expanded(20, 20);
                    const text = await textSearcher.getText(newRange);
                    return text;
                }));
                console.log('ComPDFKitRN', 'Search results texts:', texts);
            } else {
                console.log('ComPDFKitRN', 'No results found for:', searchText);
            }

        } else {
            console.log('ComPDFKitRN', 'Search text is empty');
            setSearchResults([]);
            setHasSearched(false);
        }
    };

    const handlePrevious = () => {
        if (searchResults.length === 0) return;

        const newIndex = currentSelectionIndex <= 0
            ? searchResults.length - 1
            : currentSelectionIndex - 1;

        setCurrentSelectionIndex(newIndex);
        pdfReaderRef.current?._pdfDocument?.textSearcher.selection(searchResults[newIndex]);
    };

    const handleNext = () => {
        if (searchResults.length === 0) return;

        const newIndex = currentSelectionIndex + 1 >= searchResults.length
            ? 0
            : currentSelectionIndex + 1;

        setCurrentSelectionIndex(newIndex);
        pdfReaderRef.current?._pdfDocument?.textSearcher.selection(searchResults[newIndex]);
    };

    const clearSearch = () => {
        setHasSearched(false);
        setSearchResults([]);
        setSearchItemData([]);
        pdfReaderRef?.current?._pdfDocument?.textSearcher.clearSearch();
    };

    const handleToSearchList = async () => {
        const document = pdfReaderRef.current?._pdfDocument;
        const textSearcher = document!.textSearcher;
        const datas = await Promise.all(searchResults.map(async (item) => {
            const newRange = item.expanded(20, 20);
            const content = await textSearcher.getText(newRange);
            return new CPDFSearchItem(item, newRange, searchText, content);
        }));
        setSearchItemData(datas);
        setSearchListModalVisible(true);
    }

    const renderToolbar = () => {
        return (
            <View style={styles.toolbar}>
                <HeaderBackButton onPress={handleBack} />
                <TextInput
                    style={styles.searchInput}
                    inputMode='search'
                    placeholder="Search text..."
                    value={searchText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="search"
                    onSubmitEditing={startSearch}
                    onChangeText={(text) => {
                        setSearchText(text);
                        if (text.trim() === '') {
                            clearSearch();
                        }
                    }}
                />
                {(!hasSearched) && (
                    <TouchableOpacity
                        style={styles.toolbarButton}
                        onPress={async () => {
                            startSearch();
                        }}
                    >
                        <Image source={require('../assets/ic_search.png')} style={{ width: 24, height: 24 }} />
                    </TouchableOpacity>

                )}


                {(hasSearched && searchResults.length > 0) && (
                    <>
                        <TouchableOpacity
                            style={styles.toolbarButton}
                            onPress={() => {
                                handlePrevious();
                            }}
                        >
                            <Image source={require('../assets/ic_syasarrow_left.png')} style={{ width: 24, height: 24 }} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.toolbarButton}
                            onPress={() => {
                                handleNext();
                            }}
                        >
                            <Image source={require('../assets/ic_syasarrow_right.png')} style={{ width: 24, height: 24 }} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.toolbarButton}
                            onPress={() => {
                                handleToSearchList();
                            }}
                        >
                            <Image source={require('../assets/ic_searchlist.png')} style={{ width: 24, height: 24 }} />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFCFF' }}>
            <View style={{ flex: 1 }}>
                {renderToolbar()}
                <CPDFReaderView
                    ref={pdfReaderRef}
                    document={samplePDF}
                    configuration={ComPDFKit.getDefaultConfig({
                        toolbarConfig: {
                            mainToolbarVisible: false
                        }
                    })}
                    onIOSClickBackPressed={handleBack} />

                    <CPDFSearchTextListScreen
                        visible={searchListModalVisible}
                        list={searchItemData}
                        onClose={() => {
                            setSearchListModalVisible(false)
                        }}
                        jump={(searchItem: CPDFSearchItem) => {
                            setCurrentSelectionIndex(searchItemData.indexOf(searchItem));
                            pdfReaderRef.current?._pdfDocument?.textSearcher.selection(searchItem.keywordTextRange);
                            setSearchListModalVisible(false);
                        }}
                        />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    toolbar: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#FAFCFF',
        paddingHorizontal: 4,
    },
    toolbarButton: {
        padding: 8,
    },
    toolbarTitle: {
        flex: 1,
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        marginStart: 8
    },
    menuOption: {
        padding: 8,
        fontSize: 14,
        color: 'black',
    },
    searchInput: {
        flex: 1,
        height: 36,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: '#fff',
    },
});

export default CPDFSearchTextExampleScreen;
