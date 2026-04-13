/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useRef, useState } from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CPDFAnnotation,
  CPDFAnnotationType,
  CPDFEditArea,
  CPDFEvent,
  CPDFReaderView,
  CPDFWidget,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';
import { Logger } from '../../../util/logger';
import { HeaderBackButton } from '@react-navigation/elements';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { AppStackParamList } from '../../../app/navigation/routes';

type EventListenerRoute = RouteProp<
  AppStackParamList,
  'CPDFEventListenerExample'
>;

const menuOptions = [
  'Show Default Annotation Style',
  'Remove Edit Area',
] as const;

export default function EventListenerExampleScreen() {
  const pdfReaderRef = useRef<CPDFReaderView>(null);
  const [selectAnnotation, setSelectAnnotation] =
    useState<CPDFAnnotation | null>(null);
  const [selectWidget, setSelectWidget] = useState<CPDFWidget | null>(null);
  const [selectEditArea, setSelectEditArea] = useState<CPDFEditArea | null>(
    null,
  );
  const navigation = useNavigation();
  const route = useRoute<EventListenerRoute>();
  const [samplePDF] = useState(
    route.params?.document ||
      (Platform.OS === 'android'
        ? 'file:///android_asset/PDF_Document.pdf'
        : 'PDF_Document.pdf'),
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleMenuItemPress = async (action: (typeof menuOptions)[number]) => {
    switch (action) {
      case 'Show Default Annotation Style':
        await pdfReaderRef.current?.showDefaultAnnotationPropertiesView(
          CPDFAnnotationType.NOTE,
        );
        break;
      case 'Remove Edit Area':
        if (selectEditArea) {
          await pdfReaderRef.current?._pdfDocument.removeEditArea(selectEditArea);
          setSelectEditArea(null);
        }
        break;
      default:
        break;
    }
  };

  const bindEventListeners = () => {
    pdfReaderRef.current?.addEventListener(
      CPDFEvent.ANNOTATIONS_CREATED,
      annotation => {
        Logger.log('Create Annotation:');
        Logger.log(JSON.stringify(annotation, null, 2));
      },
    );

    pdfReaderRef.current?.addEventListener(
      CPDFEvent.ANNOTATIONS_SELECTED,
      annotation => {
        Logger.log('Select Annotation:');
        Logger.log(JSON.stringify(annotation, null, 2));
        setSelectAnnotation(annotation);
      },
    );

    pdfReaderRef.current?.addEventListener(
      CPDFEvent.ANNOTATIONS_DESELECTED,
      annotation => {
        Logger.log('Deselect Annotation:');
        Logger.log(JSON.stringify(annotation, null, 2));
        setSelectAnnotation(null);
      },
    );

    pdfReaderRef.current?.addEventListener(CPDFEvent.FORM_FIELDS_CREATED, widget => {
      Logger.log('Create Form Field:');
      Logger.log(JSON.stringify(widget, null, 2));
    });

    pdfReaderRef.current?.addEventListener(
      CPDFEvent.FORM_FIELDS_SELECTED,
      widget => {
        Logger.log('Select Form Field:');
        Logger.log(JSON.stringify(widget, null, 2));
        setSelectWidget(widget);
      },
    );

    pdfReaderRef.current?.addEventListener(
      CPDFEvent.FORM_FIELDS_DESELECTED,
      widget => {
        Logger.log('Deselect Form Field:');
        Logger.log(JSON.stringify(widget, null, 2));
        setSelectWidget(null);
      },
    );

    pdfReaderRef.current?.addEventListener(
      CPDFEvent.EDITOR_SELECTION_SELECTED,
      editArea => {
        Logger.log('Select Edit Area:');
        Logger.log(JSON.stringify(editArea, null, 2));
        setSelectEditArea(editArea);
      },
    );

    pdfReaderRef.current?.addEventListener(
      CPDFEvent.EDITOR_SELECTION_DESELECTED,
      () => {
        Logger.log('Deselect Edit Area:');
        setSelectEditArea(null);
      },
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <HeaderBackButton onPress={handleBack} />
          <Text style={styles.toolbarTitle}>Event Listener Example</Text>

          <View style={styles.toolbarActions}>
            {selectAnnotation != null ||
            selectWidget != null ||
            selectEditArea != null ? (
              <TouchableOpacity
                onPress={async () => {
                  if (selectAnnotation) {
                    await pdfReaderRef.current?.showAnnotationPropertiesView(
                      selectAnnotation,
                    );
                  } else if (selectWidget) {
                    await pdfReaderRef.current?.showWidgetPropertiesView(
                      selectWidget,
                    );
                  } else if (selectEditArea) {
                    await pdfReaderRef.current?.showEditAreaPropertiesView(
                      selectEditArea,
                    );
                  }
                }}>
                <Image
                  source={require('../../../../assets/ic_setting.png')}
                  style={styles.settingsIcon}
                />
              </TouchableOpacity>
            ) : null}

            <Menu>
              <MenuTrigger>
                <Image
                  source={require('../../../../assets/more.png')}
                  style={styles.moreIcon}
                />
              </MenuTrigger>

              <MenuOptions>
                {menuOptions.map(option => (
                  <MenuOption
                    key={option}
                    onSelect={() => {
                      void handleMenuItemPress(option);
                    }}>
                    <Text style={styles.menuOption}>{option}</Text>
                  </MenuOption>
                ))}
              </MenuOptions>
            </Menu>
          </View>
        </View>

        <CPDFReaderView
          ref={pdfReaderRef}
          document={samplePDF}
          configuration={ComPDFKit.getDefaultConfig({
            modeConfig: {
              initialViewMode: 'annotations',
            },
          })}
          onIOSClickBackPressed={handleBack}
          onViewCreated={bindEventListeners}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFCFF',
  },
  container: {
    flex: 1,
  },
  toolbar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FAFCFF',
    paddingHorizontal: 4,
  },
  toolbarActions: {
    flexDirection: 'row',
  },
  toolbarTitle: {
    flex: 1,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginStart: 8,
  },
  settingsIcon: {
    width: 24,
    height: 24,
    tintColor: 'black',
    marginRight: 8,
  },
  moreIcon: {
    width: 24,
    height: 24,
    marginEnd: 8,
  },
  menuOption: {
    padding: 8,
    fontSize: 14,
    color: 'black',
  },
});