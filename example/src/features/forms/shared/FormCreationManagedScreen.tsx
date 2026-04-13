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
  CPDFComboboxWidget,
  CPDFEvent,
  CPDFGoToAction,
  CPDFListboxWidget,
  CPDFPushbuttonWidget,
  CPDFReaderView,
  CPDFUriAction,
  CPDFViewMode,
  CPDFWidgetItem,
  CPDFWidgetType,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';

import { FormOptionsModal } from '../../ui_customization/shared/modal/FormOptionsModal';
import { PushButtonOptionsModal } from '../../ui_customization/shared/modal/PushButtonOptionsModal';
import { CPDFFormCreationToolbar } from '../components/CPDFFormCreationToolbar';
import { FormExampleScaffold } from './FormExampleScaffold';

type FormCreationManagedScreenProps = {
  title: string;
  subtitle: string;
  availableTypes?: CPDFWidgetType[];
  enableCustomCreationDialogs?: boolean;
  showCreationToolbar?: boolean;
  formToolbarVisible?: boolean;
};

export function FormCreationManagedScreen({
  title,
  subtitle,
  availableTypes,
  enableCustomCreationDialogs = false,
  formToolbarVisible = false,
  showCreationToolbar = true,
}: FormCreationManagedScreenProps) {
  const [activeReader, setActiveReader] = useState<CPDFReaderView | null>(null);
  const [formOptionsModalVisible, setFormOptionsModalVisible] = useState(false);
  const [formOptionsTitle, setFormOptionsTitle] = useState('');
  const [formOptions, setFormOptions] = useState<CPDFWidgetItem[]>([]);
  const [currentWidget, setCurrentWidget] = useState<
    CPDFListboxWidget | CPDFComboboxWidget | null
  >(null);
  const [pushButtonModalVisible, setPushButtonModalVisible] = useState(false);
  const [pushButtonPageCount, setPushButtonPageCount] = useState(0);
  const [currentPushButton, setCurrentPushButton] =
    useState<CPDFPushbuttonWidget | null>(null);

  const handleFormOptionsConfirm = async (options: CPDFWidgetItem[]) => {
    if (!currentWidget || !activeReader?._pdfDocument) {
      return;
    }

    currentWidget.update({ options });
    await activeReader._pdfDocument.updateWidget(currentWidget);
    setCurrentWidget(null);
  };

  const handlePushButtonConfirm = async (payload: { type: 'url'; url: string } | { type: 'page'; page: number }) => {
    if (!currentPushButton || !activeReader?._pdfDocument) {
      return;
    }

    if (payload.type === 'url') {
      currentPushButton.action = CPDFUriAction.createWeb(payload.url);
    } else {
      currentPushButton.action = CPDFGoToAction.toPage(payload.page);
    }

    await activeReader._pdfDocument.updateWidget(currentPushButton);
    setCurrentPushButton(null);
  };

  const bindCreationListeners = (reader: CPDFReaderView) => {
    setActiveReader(reader);

    if (!enableCustomCreationDialogs) {
      return;
    }

    reader.addEventListener(CPDFEvent.FORM_FIELDS_CREATED, widget => {
      switch (widget.type) {
        case CPDFWidgetType.COMBOBOX:
        case CPDFWidgetType.LISTBOX:
          if (widget instanceof CPDFListboxWidget) {
            setFormOptions([...widget.options]);
            setCurrentWidget(widget);
            setFormOptionsTitle('ListBox Options');
            setFormOptionsModalVisible(true);
          } else if (widget instanceof CPDFComboboxWidget) {
            setFormOptions([...widget.options]);
            setCurrentWidget(widget);
            setFormOptionsTitle('ComboBox Options');
            setFormOptionsModalVisible(true);
          }
          break;
        case CPDFWidgetType.PUSH_BUTTON:
          if (widget instanceof CPDFPushbuttonWidget) {
            setCurrentPushButton(widget);
            void reader._pdfDocument.getPageCount().then(count => {
              setPushButtonPageCount(count);
              setPushButtonModalVisible(true);
            });
          }
          break;
        default:
          break;
      }
    });
  };

  return (
    <FormExampleScaffold
      title={title}
      subtitle={subtitle}
      configuration={ComPDFKit.getDefaultConfig({
        modeConfig: {
          initialViewMode: CPDFViewMode.FORMS,
          uiVisibilityMode: 'automatic',
        },
        toolbarConfig: {
          formToolbarVisible: formToolbarVisible
        },
        formsConfig: {
          showCreateComboBoxOptionsDialog: !enableCustomCreationDialogs,
          showCreateListBoxOptionsDialog: !enableCustomCreationDialogs,
          showCreatePushButtonOptionsDialog: !enableCustomCreationDialogs,
          availableTypes: availableTypes,
        },
      })}
      onViewCreated={bindCreationListeners}
      bottomAccessory={
        showCreationToolbar ? <CPDFFormCreationToolbar /> : undefined
      }
      >
      {() => (
        <>
          <FormOptionsModal
            visible={formOptionsModalVisible}
            title={formOptionsTitle}
            options={formOptions}
            onClose={() => {
              setFormOptionsModalVisible(false);
              setCurrentWidget(null);
            }}
            onConfirm={options => {
              void handleFormOptionsConfirm(options);
              setFormOptionsModalVisible(false);
            }}
          />
          <PushButtonOptionsModal
            visible={pushButtonModalVisible}
            pageCount={pushButtonPageCount}
            onClose={() => {
              setPushButtonModalVisible(false);
              setCurrentPushButton(null);
            }}
            onConfirm={payload => {
              void handlePushButtonConfirm(payload);
              setPushButtonModalVisible(false);
            }}
          />
        </>
      )}
    </FormExampleScaffold>
  );
}