/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { certificateColors as colors, certificateStyles as text } from './certificateTheme';
import type { CertificateStackParams } from './certificateTypes';
import { useCertificateSession } from './useCertificateSession';
import {
  CertificateAction,
  CertificateNotice,
  CertificatePanel,
  CertificateSection,
} from './components/CertificateControls';
import { CertificateIcon, type CertificateIconName } from './components/CertificateIcon';
import { CertificatePage } from './components/CertificatePage';
import { CurrentCertificateCard } from './components/CurrentCertificateCard';

/** Certificate operations are independent of a PDF document; the home deliberately has no reader. */
export function CertificateManagementHome({
  navigation,
}: NativeStackScreenProps<CertificateStackParams, 'CertificateHome'>) {
  const { session, certificate, busy, unlock, onExit, dismissMessage } = useCertificateSession();
  const openSource = (page: 'GenerateCertificate' | 'LoadCertificate') => {
    dismissMessage();
    navigation.navigate(page);
  };
  return (
    <CertificatePage title="Certificate Management" onBack={onExit} busy={busy}>
      <CertificateSection
        title="Certificate source"
        description="Generate a development certificate or load a PKCS#12 file."
      >
        <View style={styles.sources}>
          <Source
            title="Generate"
            subtitle="Development PKCS#12"
            icon="add"
            onPress={busy ? undefined : () => openSource('GenerateCertificate')}
          />
          <Source
            title="Choose existing"
            subtitle=".p12 or .pfx file"
            icon="folder"
            onPress={busy ? undefined : () => openSource('LoadCertificate')}
          />
        </View>
      </CertificateSection>
      <CertificateSection title="Current certificate">
        <CurrentCertificateCard session={session} certificate={certificate} />
      </CertificateSection>
      <CertificateSection title="Certificate actions">
        <CertificatePanel>
          <CertificateAction
            title="Unlock certificate"
            subtitle="Verify the certificate password before continuing."
            busy={busy}
            onPress={
              session && !busy
                ? () => {
                    unlock();
                  }
                : undefined
            }
          />
          <View style={styles.divider} />
          <CertificateAction
            title="View certificate details"
            subtitle="Review issuer, validity and fingerprints."
            onPress={
              certificate && !busy ? () => navigation.navigate('CertificateDetails') : undefined
            }
          />
          <View style={styles.divider} />
          <CertificateAction
            title="Add to trusted certificates"
            subtitle="Allow this certificate for signature verification."
            onPress={
              certificate && !certificate.isTrusted && !busy
                ? () => navigation.navigate('CertificateDetails')
                : undefined
            }
          />
        </CertificatePanel>
      </CertificateSection>
      <CertificateSection title="Platform storage">
        <CertificateNotice warning title="SDK-managed certificate storage">
          Certificates are stored in the application sandbox. Custom certificate directories are not
          supported.
        </CertificateNotice>
      </CertificateSection>
    </CertificatePage>
  );
}

function Source({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: CertificateIconName;
  onPress?: () => void;
}) {
  return (
    <CertificatePanel style={styles.source}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: !onPress }}
        disabled={!onPress}
        onPress={onPress}
        style={({ pressed }) => [styles.sourceContent, (!onPress || pressed) && styles.dimmed]}
      >
        <CertificateIcon name={icon} />
        <Text style={text.actionTitle}>{title}</Text>
        <Text style={text.body}>{subtitle}</Text>
      </Pressable>
    </CertificatePanel>
  );
}

const styles = StyleSheet.create({
  sources: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  source: { flex: 1, minWidth: 0 },
  sourceContent: { flex: 1, padding: 14, gap: 4, alignItems: 'flex-start' },
  divider: { height: 1, backgroundColor: colors.border },
  dimmed: { opacity: 0.45 },
});
