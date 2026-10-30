/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ComPDFKit } from '@compdfkit_pdf_sdk/react_native';
import {
  certificateError,
  certificateOpenFailure,
  chooseCertificateFile,
} from './certificateFiles';
import type { CertificateStackParams } from './certificateTypes';
import { useCertificateOperation } from './useCertificateOperation';
import { useCertificateSession } from './useCertificateSession';
import {
  CertificateButton,
  CertificatePanel,
  CertificateSection,
} from './components/CertificateControls';
import { CertificateField } from './components/CertificateField';
import { CertificatePage } from './components/CertificatePage';

export function LoadCertificatePage({
  navigation,
}: NativeStackScreenProps<CertificateStackParams, 'LoadCertificate'>) {
  const [file, setFile] = useState<{ path: string; name: string } | null>(null);
  const [password, setPassword] = useState('');
  const [hidden, setHidden] = useState(true);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const passwordRef = useRef<TextInput>(null);
  const { select, notify } = useCertificateSession();
  const operation = useCertificateOperation();

  const browse = () => {
    operation.run(
      async () => {
        const selected = await chooseCertificateFile();
        if (!operation.isMounted() || !selected) return;
        setFile(selected);
        setPasswordError(null);
        passwordRef.current?.focus();
      },
      (error) => notify(certificateError(error, password)),
    );
  };

  const load = () => {
    if (!file || !password) {
      notify('Select a certificate and enter its password.');
      return;
    }
    setPasswordError(null);
    operation.run(
      async () => {
        const valid = await ComPDFKit.checkPkcs12CertificatePassword(file.path, password);
        if (!operation.isMounted()) return;
        if (!valid) {
          // The native SDK also returns false for certificate encryption it cannot decode.
          setPasswordError(certificateOpenFailure);
          passwordRef.current?.focus();
          return;
        }
        // Selecting validates the credentials; the home unlock action separately loads metadata.
        select({ ...file, password, generated: false });
        setPassword('');
        navigation.goBack();
      },
      (error) => {
        setPasswordError(certificateError(error, password));
        passwordRef.current?.focus();
      },
    );
  };

  return (
    <CertificatePage
      title="Choose certificate"
      onBack={() => navigation.goBack()}
      busy={operation.busy}
    >
      <CertificateSection
        title="Load certificate"
        description="Choose a .p12 or .pfx file, then unlock it from the main workflow."
      >
        <CertificatePanel style={styles.form}>
          <CertificateField
            label="Certificate file"
            value={file?.path ?? ''}
            placeholder="No file selected"
            editable={false}
            leadingIcon="certificate"
            accessory={{
              label: 'Browse files',
              icon: 'folder',
              onPress: browse,
              disabled: operation.busy,
            }}
          />
          <CertificateField
            ref={passwordRef}
            label="PKCS#12 password"
            value={password}
            error={passwordError}
            editable={!operation.busy}
            onChangeText={(value) => {
              setPassword(value);
              setPasswordError(null);
            }}
            secureTextEntry={hidden}
            leadingIcon="key"
            onSubmitEditing={load}
            accessory={{
              label: hidden ? 'Show password' : 'Hide password',
              icon: 'eye',
              onPress: () => setHidden((value) => !value),
              disabled: operation.busy,
            }}
          />
        </CertificatePanel>
      </CertificateSection>
      <CertificateButton
        label="Use certificate"
        icon="folder"
        busy={operation.busy}
        onPress={load}
      />
    </CertificatePage>
  );
}

const styles = StyleSheet.create({ form: { padding: 16, gap: 14 } });
