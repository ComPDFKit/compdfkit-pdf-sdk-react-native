/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ComPDFKit, type CPDFCertificateSubject } from '@compdfkit_pdf_sdk/react_native';
import { certificateError, certificateOutputName, certificateOutputPath } from './certificateFiles';
import { certificateColors as colors, certificateStyles as text } from './certificateTheme';
import type { CertificateStackParams } from './certificateTypes';
import { useCertificateOperation } from './useCertificateOperation';
import { useCertificateSession } from './useCertificateSession';
import {
  CertificateButton,
  CertificateNotice,
  CertificatePanel,
  CertificateSection,
} from './components/CertificateControls';
import { CertificateField } from './components/CertificateField';
import { CertificatePage } from './components/CertificatePage';

type Identity = Record<keyof CPDFCertificateSubject, string>;
const advancedFields = [
  ['country', 'Country'],
  ['state', 'State / Province'],
  ['locality', 'Locality'],
  ['organizationalUnit', 'Organizational unit'],
  ['email', 'Email'],
] as const;

/** Uses the device locale for an optional country default without adding a localization dependency. */
function defaultCountry(): string {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  return locale.split(/[-_]/).find((part) => /^[A-Z]{2}$/.test(part)) ?? '';
}

export function GenerateCertificatePage({
  navigation,
}: NativeStackScreenProps<CertificateStackParams, 'GenerateCertificate'>) {
  const [identity, setIdentity] = useState<Identity>(() => ({
    commonName: 'ComPDF RN QA',
    organization: 'PDF Technologies',
    country: defaultCountry(),
    state: '',
    locality: '',
    organizationalUnit: '',
    email: '',
  }));
  const [password, setPassword] = useState('');
  const [advanced, setAdvanced] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const identityRefs = useRef<Partial<Record<keyof Identity, TextInput | null>>>({});
  const { select, notify } = useCertificateSession();
  const operation = useCertificateOperation();

  const generate = () => {
    if (!identity.commonName.trim() || !password) {
      notify('Common name and password are required.');
      return;
    }
    operation.run(
      async () => {
        // Omit blank optional subject fields, just as the Flutter request builder does.
        const subject: CPDFCertificateSubject = { commonName: identity.commonName.trim() };
        for (const key of Object.keys(identity) as (keyof Identity)[]) {
          if (identity[key].trim()) subject[key] = identity[key].trim();
        }
        const path = certificateOutputPath();
        const created = await ComPDFKit.generatePkcs12Certificate({
          subject,
          password,
          outputPath: path,
        });
        if (!operation.isMounted()) return;
        if (!created) {
          notify('Certificate creation failed.');
          return;
        }
        select({ path, name: certificateOutputName, password, generated: true });
        setPassword('');
        navigation.goBack();
      },
      (error) => notify(certificateError(error, password)),
    );
  };

  const fieldOrder: (keyof Identity)[] = [
    'commonName',
    'organization',
    ...(advanced ? advancedFields.map(([key]) => key) : []),
  ];
  const field = (key: keyof Identity, label: string) => (
    <CertificateField
      key={key}
      ref={(input) => {
        identityRefs.current[key] = input;
      }}
      label={label}
      value={identity[key]}
      editable={!operation.busy}
      onChangeText={(value) => setIdentity((current) => ({ ...current, [key]: value }))}
      keyboardType={key === 'email' ? 'email-address' : 'default'}
      returnKeyType="next"
      onSubmitEditing={() => {
        const next = fieldOrder[fieldOrder.indexOf(key) + 1];
        if (next) identityRefs.current[next]?.focus();
        else passwordRef.current?.focus();
      }}
    />
  );

  return (
    <CertificatePage
      title="Generate certificate"
      onBack={() => navigation.goBack()}
      busy={operation.busy}
    >
      <CertificateSection
        title="Certificate identity"
        description="Use a development certificate for integration and signature testing. Do not use this flow for production credentials."
      >
        <CertificatePanel style={styles.form}>
          <Text style={text.group}>Identity details</Text>
          {field('commonName', 'Common name')}
          {field('organization', 'Organization')}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: advanced, disabled: operation.busy }}
            disabled={operation.busy}
            onPress={() => setAdvanced((value) => !value)}
            style={styles.advanced}
          >
            <Text style={text.label}>Advanced identity fields</Text>
            <Text style={text.description}>{advanced ? '⌃' : '⌄'}</Text>
          </Pressable>
          {advanced ? advancedFields.map(([key, label]) => field(key, label)) : null}
          <Text style={text.group}>Security and export</Text>
          <CertificateField
            ref={passwordRef}
            label="PKCS#12 password"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!operation.busy}
            onSubmitEditing={generate}
          />
          <View style={styles.output}>
            <Text style={text.label}>Output path</Text>
            <View style={styles.path}>
              <Text numberOfLines={1} style={text.body}>
                Temporary directory / {certificateOutputName}
              </Text>
            </View>
          </View>
        </CertificatePanel>
      </CertificateSection>
      <CertificateButton
        label="Generate certificate"
        icon="add"
        busy={operation.busy}
        onPress={generate}
      />
      <CertificateNotice>
        The password is used only for this certificate workflow and is not stored.
      </CertificateNotice>
    </CertificatePage>
  );
}

const styles = StyleSheet.create({
  form: { padding: 16, gap: 14 },
  advanced: {
    minHeight: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#F5F7FA',
    borderRadius: 6,
  },
  output: { gap: 6 },
  path: {
    minHeight: 44,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    backgroundColor: '#FBFCFE',
  },
});
