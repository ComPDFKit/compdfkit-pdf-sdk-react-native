/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useState } from 'react';
import {
  CPDFReaderView,
  CPDFToolbarAction,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { AppStackParamList } from '../../../app/navigation/routes';
import { getDefaultViewerDocument } from '../shared/defaultDocument';

type ModalViewerRoute = RouteProp<AppStackParamList, 'CPDFModalViewerExample'>;
type ModalViewerNavigation = NativeStackNavigationProp<
  AppStackParamList,
  'CPDFModalViewerExample'
>;

export default function ModalViewerExampleScreen() {
  const navigation = useNavigation<ModalViewerNavigation>();
  const route = useRoute<ModalViewerRoute>();
  const [document] = useState(route.params?.document ?? getDefaultViewerDocument());

  return (
    <CPDFReaderView
      document={document}
      onIOSClickBackPressed={() => navigation.goBack()}
      configuration={ComPDFKit.getDefaultConfig({
        toolbarConfig: {
          toolbarLeftItems: [CPDFToolbarAction.BACK],
        },
      })}
    />
  );
}