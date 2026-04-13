/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CPDFReaderView, CPDFSearchOptions } from '@compdfkit_pdf_sdk/react_native';

import { useAppTheme } from '../../../theme/appTheme';
import { CPDFSearchItem } from '../model/CPDFSearchItem';
import CPDFSearchTextListScreen from '../modal/CPDFSearchTextListScreen';
import { SearchNavigationExampleScaffold } from '../shared/SearchNavigationExampleScaffold';

export default function TextSearchApiExampleScreen() {
  const appTheme = useAppTheme();
  const styles = createStyles(appTheme);
  const [reader, setReader] = useState<CPDFReaderView | null>(null);
  const [searchText, setSearchText] = useState('Dev');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentSelectionIndex, setCurrentSelectionIndex] = useState(0);
  const [searchListModalVisible, setSearchListModalVisible] = useState(false);
  const [searchItemData, setSearchItemData] = useState<CPDFSearchItem[]>([]);

  const startSearch = async () => {
    setCurrentSelectionIndex(0);

    if (!searchText.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const document = reader?._pdfDocument;
    const textSearcher = document?.textSearcher;
    const results = await textSearcher?.searchText(
      searchText,
      CPDFSearchOptions.CaseInsensitive,
    );

    if (results && results.length > 0) {
      const firstResult = results[0];
      if (!firstResult) {
        setSearchResults([]);
        setHasSearched(false);
        return;
      }

      setSearchResults(results);
      setHasSearched(true);
      setCurrentSelectionIndex(0);
      textSearcher?.selection(firstResult);
      return;
    }

    setSearchResults([]);
    setHasSearched(false);
  };

  const handlePrevious = () => {
    if (searchResults.length === 0) {
      return;
    }

    const newIndex = currentSelectionIndex <= 0 ? searchResults.length - 1 : currentSelectionIndex - 1;
    const selectedRange = searchResults[newIndex];
    if (!selectedRange) {
      return;
    }

    setCurrentSelectionIndex(newIndex);
    reader?._pdfDocument?.textSearcher.selection(selectedRange);
  };

  const handleNext = () => {
    if (searchResults.length === 0) {
      return;
    }

    const newIndex = currentSelectionIndex + 1 >= searchResults.length ? 0 : currentSelectionIndex + 1;
    const selectedRange = searchResults[newIndex];
    if (!selectedRange) {
      return;
    }

    setCurrentSelectionIndex(newIndex);
    reader?._pdfDocument?.textSearcher.selection(selectedRange);
  };

  const clearSearch = () => {
    setHasSearched(false);
    setSearchResults([]);
    setSearchItemData([]);
    reader?._pdfDocument?.textSearcher.clearSearch();
  };

  const handleToSearchList = async () => {
    const document = reader?._pdfDocument;
    const textSearcher = document?.textSearcher;
    const data = await Promise.all(
      searchResults.map(async item => {
        const newRange = item.expanded(20, 20);
        const content = await textSearcher?.getText(newRange);
        return new CPDFSearchItem(item, newRange, searchText, content ?? '');
      }),
    );
    setSearchItemData(data);
    setSearchListModalVisible(true);
  };

  return (
    <SearchNavigationExampleScaffold
      title="Text Search API"
      subtitle="Search document text, cycle matches, and inspect hit snippets."
      onReaderReady={setReader}
      belowToolbarContent={
        <View style={styles.searchPanel}>
          <View style={styles.searchRow}>
            <View style={styles.searchInputWrap}>
              <Image
                source={require('../../../../assets/ic_search.png')}
                style={styles.searchLeadingIcon}
              />

              <TextInput
                style={styles.searchInput}
                inputMode="search"
                placeholder="Search text..."
                placeholderTextColor={appTheme.colors.textSecondary}
                value={searchText}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                onSubmitEditing={() => {
                  void startSearch();
                }}
                onChangeText={text => {
                  setSearchText(text);
                  if (!text.trim()) {
                    clearSearch();
                  }
                }}
              />

              {searchText.trim() ? (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.clearButton}
                  onPress={() => {
                    setSearchText('');
                    clearSearch();
                  }}>
                  <Image
                    source={require('../../../../assets/close.png')}
                    style={styles.clearButtonIcon}
                  />
                </TouchableOpacity>
              ) : null}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.searchButton}
              onPress={() => {
                void startSearch();
              }}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {hasSearched && searchResults.length > 0 ? (
            <>
              <View style={styles.resultSummaryRow}>
                <View style={styles.resultCountChip}>
                  <Text style={styles.resultSummaryText}>
                    {currentSelectionIndex + 1} / {searchResults.length} matches
                  </Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.secondaryActionButton}
                  onPress={handlePrevious}>
                  <Image
                    source={require('../../../../assets/ic_syasarrow_left.png')}
                    style={styles.secondaryActionIcon}
                  />
                  <Text style={styles.secondaryActionText}>Previous</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.secondaryActionButton}
                  onPress={handleNext}>
                  <Text style={styles.secondaryActionText}>Next</Text>
                  <Image
                    source={require('../../../../assets/ic_syasarrow_right.png')}
                    style={styles.secondaryActionIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.secondaryActionButton}
                  onPress={() => {
                    void handleToSearchList();
                  }}>
                  <Image
                    source={require('../../../../assets/ic_searchlist.png')}
                    style={styles.secondaryActionIcon}
                  />
                  <Text style={styles.secondaryActionText}>Results List</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </View>
      }>
      <CPDFSearchTextListScreen
        visible={searchListModalVisible}
        list={searchItemData}
        currentSelectionIndex={currentSelectionIndex}
        onClose={() => setSearchListModalVisible(false)}
        jump={(searchItem: CPDFSearchItem) => {
          setCurrentSelectionIndex(searchItemData.indexOf(searchItem));
          reader?._pdfDocument?.textSearcher.selection(searchItem.keywordTextRange);
          setSearchListModalVisible(false);
        }}
      />
    </SearchNavigationExampleScaffold>
  );
}

function createStyles(appTheme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    searchPanel: {
      paddingHorizontal: appTheme.spacing.md,
      paddingTop: appTheme.spacing.xs,
      paddingBottom: appTheme.spacing.sm,
      backgroundColor: '#FAFCFF',
      borderBottomWidth: 1,
      borderBottomColor: appTheme.colors.outlineVariant,
      gap: appTheme.spacing.xs,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: appTheme.spacing.xs,
    },
    searchInputWrap: {
      flex: 1,
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: appTheme.colors.outline,
      borderRadius: 14,
      backgroundColor: appTheme.colors.surface,
      paddingLeft: appTheme.spacing.sm,
      paddingRight: appTheme.spacing.xs,
      shadowColor: '#0F172A',
      shadowOpacity: 0.04,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },
    searchLeadingIcon: {
      width: 18,
      height: 18,
      tintColor: appTheme.colors.textSecondary,
      resizeMode: 'contain',
      marginRight: appTheme.spacing.xs,
    },
    searchInput: {
      flex: 1,
      height: '100%',
      fontSize: 15,
      color: appTheme.colors.textPrimary,
      paddingRight: appTheme.spacing.xs,
    },
    clearButton: {
      width: 28,
      height: 28,
      borderRadius: appTheme.radii.pill,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appTheme.colors.surfaceAlt,
    },
    clearButtonIcon: {
      width: 12,
      height: 12,
      tintColor: appTheme.colors.textSecondary,
      resizeMode: 'contain',
    },
    searchButton: {
      height: 44,
      minWidth: 86,
      paddingHorizontal: appTheme.spacing.md,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appTheme.colors.primary,
    },
    searchButtonText: {
      color: appTheme.colors.inverseText,
      fontSize: appTheme.typography.labelMedium,
      fontWeight: '700',
    },
    resultSummaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    resultCountChip: {
      alignSelf: 'flex-start',
      paddingHorizontal: appTheme.spacing.sm,
      paddingVertical: 6,
      borderRadius: appTheme.radii.pill,
      backgroundColor: appTheme.colors.surfaceAlt,
      borderWidth: 1,
      borderColor: appTheme.colors.outlineVariant,
    },
    resultSummaryText: {
      fontSize: 12,
      fontWeight: '700',
      color: appTheme.colors.textSecondary,
    },
    actionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: appTheme.spacing.xs,
    },
    secondaryActionButton: {
      minHeight: 32,
      paddingHorizontal: appTheme.spacing.sm,
      borderRadius: appTheme.radii.pill,
      borderWidth: 1,
      borderColor: '#BFDBFE',
      backgroundColor: '#EFF6FF',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    secondaryActionIcon: {
      width: 14,
      height: 14,
      tintColor: '#1D4ED8',
      resizeMode: 'contain',
    },
    secondaryActionText: {
      color: '#1D4ED8',
      fontSize: 12,
      fontWeight: '700',
    },
  });
}