/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

/**
 * ThumbnailsTab - Placeholder implementation for page thumbnails
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ThumbnailsTab = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thumbnails will be implemented later.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { color: '#6B7280' },
});

export default ThumbnailsTab;
