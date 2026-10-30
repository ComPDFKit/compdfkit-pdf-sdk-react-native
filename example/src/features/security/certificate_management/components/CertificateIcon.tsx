/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { certificateColors as colors } from '../certificateTheme';

export type CertificateIconName =
  | 'certificate'
  | 'folder'
  | 'key'
  | 'chevron'
  | 'back'
  | 'eye'
  | 'copy'
  | 'info'
  | 'check'
  | 'add'
  | 'swap';

/** Small outline icons use native shapes and existing assets, avoiding a new native dependency. */
export function CertificateIcon({
  name,
  color = colors.primary,
}: {
  name: CertificateIconName;
  color?: string;
}) {
  const stroke = { borderColor: color };
  const fill = { backgroundColor: color };
  return (
    <View
      style={styles.root}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {name === 'certificate' ? (
        <Image
          source={require('../../../../../assets/ic_form_sign.png')}
          style={[styles.image, { tintColor: color }]}
        />
      ) : null}
      {name === 'folder' ? (
        <>
          <View style={[styles.folderTab, stroke]} />
          <View style={[styles.folder, stroke]} />
        </>
      ) : null}
      {name === 'key' ? (
        <>
          <View style={[styles.keyRing, stroke]} />
          <View style={[styles.keyStem, fill]} />
          <View style={[styles.keyTooth, fill]} />
        </>
      ) : null}
      {name === 'chevron' || name === 'back' ? (
        <View style={[styles.chevron, stroke, name === 'back' && styles.back]} />
      ) : null}
      {name === 'eye' ? (
        <>
          <View style={[styles.eye, stroke]} />
          <View style={[styles.pupil, fill]} />
        </>
      ) : null}
      {name === 'copy' ? (
        <>
          <View style={[styles.copyBack, stroke]} />
          <View style={[styles.copyFront, stroke]} />
        </>
      ) : null}
      {name === 'info' ? (
        <>
          <View style={[styles.circle, stroke]} />
          <View style={[styles.infoDot, fill]} />
          <View style={[styles.infoStem, fill]} />
        </>
      ) : null}
      {name === 'check' ? <View style={[styles.check, stroke]} /> : null}
      {name === 'add' ? (
        <>
          <View style={[styles.horizontal, fill]} />
          <View style={[styles.vertical, fill]} />
        </>
      ) : null}
      {name === 'swap' ? (
        <>
          <View style={[styles.swapTop, fill]} />
          <View style={[styles.swapBottom, fill]} />
          <View style={[styles.swapRight, stroke]} />
          <View style={[styles.swapLeft, stroke]} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  image: { width: 20, height: 20, resizeMode: 'contain' },
  folderTab: {
    position: 'absolute',
    left: 1,
    top: 3,
    width: 9,
    height: 5,
    borderWidth: 1.5,
    borderRadius: 2,
  },
  folder: {
    position: 'absolute',
    left: 1,
    top: 6,
    width: 18,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 2,
    backgroundColor: colors.surface,
  },
  keyRing: {
    position: 'absolute',
    left: 1,
    top: 3,
    width: 9,
    height: 9,
    borderWidth: 1.5,
    borderRadius: 5,
  },
  keyStem: {
    position: 'absolute',
    left: 8,
    top: 12,
    width: 12,
    height: 1.5,
    transform: [{ rotate: '45deg' }],
  },
  keyTooth: { position: 'absolute', left: 14, top: 12, width: 1.5, height: 5 },
  chevron: {
    width: 7,
    height: 7,
    borderRightWidth: 1.5,
    borderTopWidth: 1.5,
    transform: [{ rotate: '45deg' }],
  },
  back: { transform: [{ rotate: '225deg' }] },
  eye: { width: 18, height: 12, borderWidth: 1.5, borderRadius: 9 },
  pupil: { position: 'absolute', width: 5, height: 5, borderRadius: 3 },
  copyBack: {
    position: 'absolute',
    left: 3,
    top: 2,
    width: 10,
    height: 13,
    borderWidth: 1.5,
    borderRadius: 1,
  },
  copyFront: {
    position: 'absolute',
    left: 7,
    top: 6,
    width: 10,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 1,
    backgroundColor: colors.surface,
  },
  circle: { width: 18, height: 18, borderRadius: 10, borderWidth: 1.5 },
  infoDot: { position: 'absolute', top: 5, width: 2, height: 2, borderRadius: 1 },
  infoStem: { position: 'absolute', top: 9, width: 2, height: 6 },
  check: {
    width: 11,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '-45deg' }],
  },
  horizontal: { width: 16, height: 1.5 },
  vertical: { position: 'absolute', width: 1.5, height: 16 },
  swapTop: { position: 'absolute', top: 6, width: 15, height: 1.5 },
  swapBottom: { position: 'absolute', top: 13, width: 15, height: 1.5 },
  swapRight: {
    position: 'absolute',
    top: 4,
    right: 2,
    width: 5,
    height: 5,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    transform: [{ rotate: '45deg' }],
  },
  swapLeft: {
    position: 'absolute',
    top: 11,
    left: 2,
    width: 5,
    height: 5,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    transform: [{ rotate: '225deg' }],
  },
});
