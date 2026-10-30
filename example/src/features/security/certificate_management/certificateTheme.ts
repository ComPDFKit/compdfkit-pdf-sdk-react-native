/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { StyleSheet } from 'react-native';

/** Feature-local tokens mirror the Flutter certificate pages, including their light surfaces. */
export const certificateColors = {
  background: '#F6F8FB',
  surface: '#FFFFFF',
  primary: '#1460F3',
  text: '#1A1A1A',
  muted: '#6B7280',
  border: '#E8ECF1',
  inputBorder: '#D7DEE8',
  softBlue: '#EAF2FF',
  softGreen: '#E9F8EF',
  green: '#16A34A',
  warning: '#FFF7E8',
  information: '#EEF5FF',
  error: '#B42318',
};

export const certificateStyles = StyleSheet.create({
  section: { color: certificateColors.text, fontSize: 16, lineHeight: 20, fontWeight: '600' },
  description: { color: certificateColors.muted, fontSize: 12, lineHeight: 16 },
  body: { color: certificateColors.muted, fontSize: 11, lineHeight: 16 },
  actionTitle: { color: certificateColors.text, fontSize: 14, lineHeight: 18, fontWeight: '600' },
  label: { color: certificateColors.text, fontSize: 11, fontWeight: '600' },
  input: { color: certificateColors.text, fontSize: 12, lineHeight: 17 },
  group: { color: '#465062', fontSize: 12, fontWeight: '600' },
  gap: { gap: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  flex: { flex: 1, minWidth: 0 },
});
