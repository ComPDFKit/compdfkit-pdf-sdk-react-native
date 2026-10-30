/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { createContext, useCallback, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { ComPDFKit, type CPDFCertificateInfo } from '@compdfkit_pdf_sdk/react_native';

import { certificateError, certificateOpenFailure } from './certificateFiles';
import type { CertificateSession } from './certificateTypes';
import { useCertificateOperation } from './useCertificateOperation';

function useSessionState(onExit: () => void) {
  const [session, setSession] = useState<CertificateSession | null>(null);
  const [certificate, setCertificate] = useState<CPDFCertificateInfo | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const operation = useCertificateOperation();
  const notify = useCallback((text: string) => setMessage(text), []);
  const dismissMessage = useCallback(() => setMessage(null), []);

  const select = (next: CertificateSession) => {
    setSession(next);
    setCertificate(null);
    notify(
      next.generated
        ? 'Certificate created. Unlock it to load metadata.'
        : 'Certificate selected. Unlock it to load metadata.',
    );
  };

  const unlock = () =>
    operation.run(
      async () => {
        if (!session) return;
        // Clear earlier metadata before rechecking so a failed unlock cannot retain verified actions.
        setCertificate(null);
        const valid = await ComPDFKit.checkPkcs12CertificatePassword(
          session.path,
          session.password,
        );
        if (!operation.isMounted()) return;
        if (!valid) {
          notify(certificateOpenFailure);
          return;
        }
        const info = await ComPDFKit.loadPkcs12Certificate(session.path, session.password);
        if (!operation.isMounted()) return;
        setCertificate(info);
        notify(
          info
            ? 'Certificate unlocked and metadata loaded.'
            : 'Unable to read certificate metadata.',
        );
      },
      (error) => notify(certificateError(error, session?.password)),
    );

  const trust = () => {
    if (!session || !certificate || certificate.isTrusted || operation.busy) return;
    Alert.alert(
      'Trust this certificate?',
      'This changes certificate verification behavior for this application.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add to trusted certificates',
          onPress: () => {
            operation.run(
              async () => {
                const added = await ComPDFKit.addTrustedCertificate(session.path, session.password);
                if (!operation.isMounted()) return;
                if (!added) {
                  notify('Failed to add certificate to the trust store.');
                  return;
                }
                const info = await ComPDFKit.loadPkcs12Certificate(session.path, session.password);
                if (!operation.isMounted()) return;
                // One metadata object drives both pages; no navigation result or password serialization is needed.
                setCertificate(info);
                notify(
                  info
                    ? 'Certificate added to the application trust store.'
                    : 'Certificate was trusted, but metadata could not be refreshed.',
                );
              },
              (error) => notify(certificateError(error, session.password)),
            );
          },
        },
      ],
    );
  };

  return {
    session,
    certificate,
    message,
    notify,
    dismissMessage,
    select,
    unlock,
    trust,
    busy: operation.busy,
    onExit,
  };
}

type SessionState = ReturnType<typeof useSessionState>;
const CertificateContext = createContext<SessionState | null>(null);

/** Owns the short-lived credentials for this example and releases them when its stack unmounts. */
export function CertificateSessionProvider({
  children,
  onExit,
}: React.PropsWithChildren<{ onExit: () => void }>) {
  const state = useSessionState(onExit);
  return <CertificateContext.Provider value={state}>{children}</CertificateContext.Provider>;
}

export function useCertificateSession(): SessionState {
  const context = useContext(CertificateContext);
  if (!context) throw new Error('Certificate pages require a CertificateSessionProvider.');
  return context;
}
