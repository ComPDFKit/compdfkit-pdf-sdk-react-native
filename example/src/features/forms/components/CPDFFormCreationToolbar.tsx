/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CPDFAnnotationHistoryToolView } from '../../annotations/components/CPDFAnnotationHistoryToolView';
import { CPDFFormCreationModeList } from './CPDFFormCreationModeList';

export const CPDFFormCreationToolbar: React.FC = () => {
  return (
    <View style={styles.container}>
      <CPDFFormCreationModeList />
      <CPDFAnnotationHistoryToolView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 58,
  },
});