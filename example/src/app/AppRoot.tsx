/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';

import { initializeComPDFKit } from './initialization/initializeComPDFKit';
import { applyPersistedReaderConfigDefaults } from './settings/exampleReaderConfig';
import { loadPersistedSettings } from './settings/settingsStorage';
import { AppNavigator } from './navigation/AppNavigator';
import {
  createNavigationTheme,
  useAppTheme,
} from '../theme/appTheme';
import { LoadingErrorScaffold } from '../widgets/common/LoadingErrorScaffold';

type BootstrapState =
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'error'; message: string };

export function AppRoot() {
  const appTheme = useAppTheme();
  const [bootstrapState, setBootstrapState] = useState<BootstrapState>({
    status: 'loading',
  });
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        await loadPersistedSettings();
        applyPersistedReaderConfigDefaults();
        await initializeComPDFKit();
        if (mounted) {
          setBootstrapState({ status: 'ready' });
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Initialization failed';
        if (mounted) {
          setBootstrapState({ status: 'error', message });
        }
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, [retryToken]);

  const navigationTheme = useMemo(
    () => createNavigationTheme(appTheme),
    [appTheme],
  );

  return (
    <MenuProvider>
      {bootstrapState.status === 'ready' ? (
        <NavigationContainer theme={navigationTheme}>
          <AppNavigator />
        </NavigationContainer>
      ) : (
        <LoadingErrorScaffold
          state={bootstrapState.status === 'error' ? 'error' : 'loading'}
          title={
            bootstrapState.status === 'error'
              ? 'Initialization failed'
              : 'Preparing ComPDFKit Example'
          }
          description={
            bootstrapState.status === 'error'
              ? bootstrapState.message
              : 'Initializing fonts and SDK license before routing the app shell.'
          }
          onRetry={() => {
            setBootstrapState({ status: 'loading' });
            setRetryToken(currentValue => currentValue + 1);
          }}
        />
      )}
    </MenuProvider>
  );
}