/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useCallback, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import {
  CPDFCheckboxWidget,
  CPDFComboboxWidget,
  CPDFListboxWidget,
  CPDFPushbuttonWidget,
  CPDFRadiobuttonWidget,
  CPDFReaderView,
  CPDFSignatureWidget,
  CPDFTextWidget,
  CPDFViewMode,
  CPDFWidget,
  CPDFWidgetType,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';

import { SignatureListModal } from '../../ui_customization/shared/modal/SignatureListModal';
import { addCommonFormFields } from '../shared/formExampleActions';
import { FormExampleScaffold } from '../shared/FormExampleScaffold';

type LastEvent = {
  type: string;
  title: string;
  result: string;
};

export default function InterceptWidgetActionExampleScreen() {
  const readerRef = useRef<CPDFReaderView | null>(null);
  const pendingSignatureWidgetRef = useRef<CPDFSignatureWidget | null>(null);
  const [signaturePickerVisible, setSignaturePickerVisible] = useState(false);
  const [lastEvent, setLastEvent] = useState<LastEvent | null>(null);

  const configuration = ComPDFKit.getDefaultConfig({
    modeConfig: {
      initialViewMode: CPDFViewMode.VIEWER,
    },
    formsConfig: {
      interceptFormWidgetActions: [
        CPDFWidgetType.TEXT_FIELD,
        CPDFWidgetType.CHECKBOX,
        CPDFWidgetType.RADIO_BUTTON,
        CPDFWidgetType.LISTBOX,
        CPDFWidgetType.COMBOBOX,
        CPDFWidgetType.PUSH_BUTTON,
        CPDFWidgetType.SIGNATURES_FIELDS,
      ],
    },
  });

  const updateLastEvent = useCallback((widget: CPDFWidget, result: string) => {
    setLastEvent({
      type: widget.type,
      title: widget.title || widget.uuid,
      result,
    });
  }, []);

  const handleInterceptWidgetAction = useCallback(
    async (widget: CPDFWidget) => {
      const reader = readerRef.current;
      if (!reader) {
        return;
      }

      switch (widget.type) {
        case CPDFWidgetType.TEXT_FIELD: {
          const textWidget = widget as CPDFTextWidget;
          textWidget.update({ text: 'Handled by React Native' });
          await reader._pdfDocument.updateWidget(textWidget);
          updateLastEvent(widget, 'Updated text field value');
          break;
        }
        case CPDFWidgetType.CHECKBOX: {
          const checkBox = widget as CPDFCheckboxWidget;
          checkBox.update({ isChecked: !checkBox.isChecked });
          await reader._pdfDocument.updateWidget(checkBox);
          updateLastEvent(widget, checkBox.isChecked ? 'Checked' : 'Unchecked');
          break;
        }
        case CPDFWidgetType.RADIO_BUTTON: {
          const radioButton = widget as CPDFRadiobuttonWidget;
          radioButton.update({ isChecked: !radioButton.isChecked });
          await reader._pdfDocument.updateWidget(radioButton);
          updateLastEvent(widget, 'Selected current radio button');
          break;
        }
        case CPDFWidgetType.LISTBOX:
        case CPDFWidgetType.COMBOBOX: {
          const choiceWidget = widget as CPDFListboxWidget | CPDFComboboxWidget;
          const options = choiceWidget.options ?? [];
          if (options.length === 0) {
            updateLastEvent(widget, 'No options available');
            return;
          }
          const nextIndex = (choiceWidget.selectItemAtIndex + 1) % options.length;
          choiceWidget.update({ selectItemAtIndex: nextIndex });
          await reader._pdfDocument.updateWidget(choiceWidget);
          updateLastEvent(widget, `Selected ${options[nextIndex]?.text ?? nextIndex}`);
          break;
        }
        case CPDFWidgetType.PUSH_BUTTON: {
          const pushButton = widget as CPDFPushbuttonWidget;
          Alert.alert('Push Button Intercepted', pushButton.buttonTitle || widget.title);
          updateLastEvent(widget, 'Displayed custom push button action');
          break;
        }
        case CPDFWidgetType.SIGNATURES_FIELDS: {
          pendingSignatureWidgetRef.current = widget as CPDFSignatureWidget;
          setSignaturePickerVisible(true);
          updateLastEvent(widget, 'Waiting for signature image');
          break;
        }
        default:
          updateLastEvent(widget, 'Unsupported widget type');
          break;
      }
    },
    [updateLastEvent],
  );

  const handleSignatureSelected = useCallback(
    async (imagePath: string) => {
      const reader = readerRef.current;
      const signatureWidget = pendingSignatureWidgetRef.current;
      if (!reader || !signatureWidget) {
        return;
      }

      const result = await reader._pdfDocument.addSignatureImage(signatureWidget, imagePath);
      if (result) {
        await reader._pdfDocument.updateAp(signatureWidget);
      }
      updateLastEvent(
        signatureWidget,
        result ? 'Signature image added' : 'Failed to add signature image',
      );
      pendingSignatureWidgetRef.current = null;
    },
    [updateLastEvent],
  );

  return (
    <FormExampleScaffold
      title="Intercept Widget Action"
      subtitle="Intercept form widget taps and handle the behavior in React Native."
      configuration={configuration}
      onViewCreated={async (reader) => {
        readerRef.current = reader;
        await addCommonFormFields(reader);
      }}
      readerViewProps={{
        onInterceptWidgetActionCallback: handleInterceptWidgetAction,
      }}
      bottomAccessory={
        <View style={styles.eventPanel}>
          <Text style={styles.eventTitle}>Last intercepted widget</Text>
          <Text style={styles.eventText}>
            {lastEvent
              ? `${lastEvent.type} · ${lastEvent.title}\n${lastEvent.result}`
              : 'Tap a form widget to handle it with custom UI.'}
          </Text>
        </View>
      }
    >
      {() => (
        <SignatureListModal
          visible={signaturePickerVisible}
          onClose={() => setSignaturePickerVisible(false)}
          onSelectSignature={handleSignatureSelected}
        />
      )}
    </FormExampleScaffold>
  );
}

const styles = StyleSheet.create({
  eventPanel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#D8DEE8',
    backgroundColor: '#FFFFFF',
  },
  eventTitle: {
    color: '#1F2937',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  eventText: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 18,
  },
});
