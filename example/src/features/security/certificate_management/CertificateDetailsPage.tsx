/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import { Clipboard, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CPDFCertificateInfo } from '@compdfkit_pdf_sdk/react_native';
import { certificateColors as colors, certificateStyles as text } from './certificateTheme';
import type { CertificateStackParams } from './certificateTypes';
import { useCertificateSession } from './useCertificateSession';
import { CertificateButton, CertificatePanel } from './components/CertificateControls';
import { CertificateIcon } from './components/CertificateIcon';
import { CertificatePage } from './components/CertificatePage';
import { CurrentCertificateCard } from './components/CurrentCertificateCard';

const metadata: { key: keyof CPDFCertificateInfo; label: string; copyable?: boolean }[] = [
  { key: 'subject', label: 'Subject' },
  { key: 'issuer', label: 'Issuer' },
  { key: 'serialNumber', label: 'Serial Number', copyable: true },
  { key: 'version', label: 'Version' },
  { key: 'signatureAlgorithm', label: 'Signature Algorithm' },
  { key: 'validFrom', label: 'Valid From' },
  { key: 'validTo', label: 'Valid To' },
  { key: 'sha1Digest', label: 'SHA1 Digest' },
  { key: 'md5Digest', label: 'MD5 Digest' },
];

/** Renders public metadata only; the session password is never included in detail rows. */
export function CertificateDetailsPage({
  navigation,
}: NativeStackScreenProps<CertificateStackParams, 'CertificateDetails'>) {
  const { session, certificate, busy, trust, notify } = useCertificateSession();
  return (
    <CertificatePage title="Certificate details" onBack={() => navigation.goBack()} busy={busy}>
      <CurrentCertificateCard
        session={session}
        certificate={certificate}
        onChange={busy ? undefined : () => navigation.goBack()}
      />
      {certificate ? (
        <>
          <CertificatePanel>
            <View style={styles.header}>
              <Text style={text.actionTitle}>⌃ Certificate details</Text>
            </View>
            <View style={styles.rows}>
              {metadata.map(({ key, label, copyable }) => {
                const value = String(certificate[key] ?? '-');
                return (
                  <View style={styles.row} key={key}>
                    <Text style={styles.label}>{label}</Text>
                    <Text selectable style={styles.value}>
                      {value}
                    </Text>
                    {copyable ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Copy ${label}`}
                        style={styles.copy}
                        onPress={() => {
                          Clipboard.setString(value);
                          notify(`${label} copied.`);
                        }}
                      >
                        <CertificateIcon name="copy" color={colors.muted} />
                      </Pressable>
                    ) : null}
                  </View>
                );
              })}
              <View style={styles.row}>
                <Text style={styles.label}>Trusted status</Text>
                <Text style={styles.value}>
                  {certificate.isTrusted ? 'Verified' : 'Not trusted'}
                </Text>
              </View>
            </View>
          </CertificatePanel>
          {certificate.isTrusted ? (
            <View style={styles.trusted}>
              <CertificateIcon name="check" color={colors.green} />
              <Text style={styles.trustedText}>Trusted certificate</Text>
            </View>
          ) : (
            <CertificateButton
              label="Add to trusted certificates"
              icon="check"
              busy={busy}
              onPress={trust}
            />
          )}
        </>
      ) : (
        <Text style={text.description}>
          Unable to read certificate metadata. Return and unlock the certificate again.
        </Text>
      )}
    </CertificatePage>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 42,
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rows: { paddingHorizontal: 14, paddingVertical: 6 },
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 5, gap: 4 },
  label: { ...text.body, width: 104, flexShrink: 1 },
  value: { ...text.input, flex: 1, minWidth: 0 },
  copy: { minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' },
  trusted: {
    minHeight: 40,
    backgroundColor: colors.softGreen,
    borderRadius: 6,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustedText: { color: colors.green, fontSize: 13, fontWeight: '600' },
});
