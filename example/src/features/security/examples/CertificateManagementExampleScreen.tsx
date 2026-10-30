/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../../app/navigation/routes';
import { CertificateManagementHome } from '../certificate_management/CertificateManagementHome';
import { GenerateCertificatePage } from '../certificate_management/GenerateCertificatePage';
import { LoadCertificatePage } from '../certificate_management/LoadCertificatePage';
import { CertificateDetailsPage } from '../certificate_management/CertificateDetailsPage';
import type { CertificateStackParams } from '../certificate_management/certificateTypes';
import { CertificateSessionProvider } from '../certificate_management/useCertificateSession';
import { certificateColors } from '../certificate_management/certificateTheme';

const Stack = createNativeStackNavigator<CertificateStackParams>();

/** A feature-local stack preserves native back navigation without serializing certificate credentials. */
export default function CertificateManagementExampleScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  return (
    <CertificateSessionProvider onExit={() => navigation.goBack()}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: certificateColors.background },
        }}
      >
        <Stack.Screen name="CertificateHome" component={CertificateManagementHome} />
        <Stack.Screen name="GenerateCertificate" component={GenerateCertificatePage} />
        <Stack.Screen name="LoadCertificate" component={LoadCertificatePage} />
        <Stack.Screen name="CertificateDetails" component={CertificateDetailsPage} />
      </Stack.Navigator>
    </CertificateSessionProvider>
  );
}
