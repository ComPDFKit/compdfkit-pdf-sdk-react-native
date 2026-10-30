/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { CPDFCertificateInfo } from '@compdfkit_pdf_sdk/react_native';
import { certificateColors as colors, certificateStyles as text } from '../certificateTheme';
import type { CertificateSession } from '../certificateTypes';
import { CertificateButton, CertificatePanel } from './CertificateControls';
import { CertificateIcon } from './CertificateIcon';

/** Reused by the home and details pages so their loaded, verified and trusted tags stay consistent. */
export function CurrentCertificateCard({
  session,
  certificate,
  onChange,
}: {
  session: CertificateSession | null;
  certificate: CPDFCertificateInfo | null;
  onChange?: () => void;
}) {
  return (
    <CertificatePanel style={styles.card}>
      <View style={text.row}>
        <View style={styles.icon}>
          <CertificateIcon name={session ? 'certificate' : 'key'} />
        </View>
        <View style={text.flex}>
          <Text style={text.actionTitle}>{session?.name ?? 'No certificate selected'}</Text>
          {session ? (
            <Text numberOfLines={1} ellipsizeMode="middle" style={text.body}>
              {session.path}
            </Text>
          ) : (
            <Text style={text.body}>Generate a test certificate or choose an existing file.</Text>
          )}
        </View>
      </View>
      {session ? (
        <View style={styles.tags}>
          <Tag label="Loaded" />
          {certificate ? <Tag label="Verified" success /> : null}
          {certificate?.isTrusted ? <Tag label="Trusted" success /> : null}
          {session.generated ? <Tag label="Generated" muted /> : null}
        </View>
      ) : null}
      {onChange ? (
        <CertificateButton label="Change certificate" icon="swap" outlined onPress={onChange} />
      ) : null}
    </CertificatePanel>
  );
}

function Tag({
  label,
  success = false,
  muted = false,
}: {
  label: string;
  success?: boolean;
  muted?: boolean;
}) {
  return (
    <View style={[styles.tag, success && styles.success, muted && styles.muted]}>
      <Text style={[styles.tagText, success && styles.successText, muted && styles.mutedText]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, gap: 12 },
  icon: {
    width: 40,
    height: 40,
    backgroundColor: '#F0F3F7',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    minHeight: 24,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    backgroundColor: colors.softBlue,
  },
  tagText: { fontSize: 10, fontWeight: '700', color: colors.primary },
  success: { backgroundColor: colors.softGreen },
  successText: { color: colors.green },
  muted: { backgroundColor: '#F5F7FA' },
  mutedText: { color: colors.muted },
});
