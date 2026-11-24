/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { useLayoutEffect, useRef, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  CPDFCheckboxWidget,
  CPDFComboboxWidget,
  CPDFGoToAction,
  CPDFListboxWidget,
  CPDFPushbuttonWidget,
  CPDFRadiobuttonWidget,
  CPDFReaderView,
  CPDFSignatureWidget,
  CPDFTextWidget,
  CPDFUriAction,
  CPDFViewMode,
  CPDFWidget,
  CPDFWidgetType,
  ComPDFKit,
} from '@compdfkit_pdf_sdk/react_native';

import { SignatureListModal } from '../../ui_customization/shared/modal/SignatureListModal';
import { FormExampleScaffold } from '../shared/FormExampleScaffold';
import { useAppTheme } from '../../../theme/appTheme';
import { ActionBottomSheet } from '../../../widgets/common/ActionBottomSheet';

const formDocument = Platform.OS === 'android'
  ? 'file:///android_asset/form_interception_test.pdf'
  : 'form_interception_test.pdf';

type WidgetPrompt = {
  title: string;
  category: string;
  message?: string;
  input?: { text: string; save: (text: string) => void };
  options?: { label: string; run: () => void }[];
  selectedIndex?: number;
  action?: { label: string; run: () => void };
};

const widgetCategories: Partial<Record<CPDFWidgetType, string>> = {
  textField: 'Text field',
  checkBox: 'Checkbox',
  radioButton: 'Radio button',
  listBox: 'List box',
  comboBox: 'Combo box',
  pushButton: 'Push button',
};

function WidgetActionModal({ prompt, onClose, onApply }: {
  prompt: WidgetPrompt;
  onClose: () => void;
  onApply: (action: () => void) => void;
}) {
  const [text, setText] = useState(prompt.input?.text ?? '');
  const [selectedIndex, setSelectedIndex] = useState(prompt.selectedIndex ?? -1);
  const { colors } = useAppTheme();
  const input = prompt.input;
  const hasOptions = Boolean(prompt.options?.length);
  const option = prompt.options?.[selectedIndex];
  const action = input
    ? { label: 'Save changes', run: () => input.save(text) }
    : prompt.action ?? (hasOptions ? { label: 'Apply selection', run: () => option?.run() } : undefined);
  return (
    <ActionBottomSheet
      title={prompt.title}
      category={prompt.category}
      onClose={onClose}
      actionLabel={action?.label}
      onAction={action ? () => onApply(action.run) : undefined}
      actionDisabled={hasOptions && !option}
    >
      <ScrollView keyboardShouldPersistTaps="handled" style={styles.options} contentContainerStyle={styles.body}>
        {prompt.message ? <Text style={[styles.message, { color: colors.textSecondary }]}>{prompt.message}</Text> : null}
        {input && (
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>Field value</Text>
            <TextInput
              accessibilityLabel="Field value"
              value={text}
              onChangeText={setText}
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.outline, backgroundColor: colors.surfaceAlt }]}
            />
          </View>
        )}
        {prompt.options?.map(({ label }, index) => {
          const checked = selectedIndex === index;
          return (
            <Pressable
              key={index}
              accessibilityRole="radio"
              accessibilityState={{ checked }}
              onPress={() => setSelectedIndex(index)}
              style={({ pressed }) => [
                styles.choice,
                { borderColor: checked ? colors.primary : colors.outline,
                  backgroundColor: checked || pressed ? colors.surfaceAlt : colors.surface },
              ]}
            >
              <View style={[styles.radio, { borderColor: checked ? colors.primary : colors.textSecondary }]}>
                {checked && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
              </View>
              <Text style={[styles.choiceLabel, { color: colors.textPrimary }]}>{label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </ActionBottomSheet>
  );
}

type LastEvent = {
  type: string;
  title: string;
  result: string;
};

export default function InterceptWidgetActionExampleScreen() {
  const readerRef = useRef<CPDFReaderView | null>(null);
  const mountedRef = useRef(false);
  const pendingSignatureWidgetRef = useRef<{ widget: CPDFSignatureWidget; reader: CPDFReaderView } | null>(null);
  const pendingPromptRef = useRef<WidgetPrompt | null>(null);
  const [signaturePickerVisible, setSignaturePickerVisible] = useState(false);
  const [prompt, setPrompt] = useState<WidgetPrompt | null>(null);
  const [lastEvent, setLastEvent] = useState<LastEvent | null>(null);
  const { colors } = useAppTheme();

  useLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      readerRef.current = null;
      pendingPromptRef.current = null;
      pendingSignatureWidgetRef.current = null;
    };
  }, []);

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

  const updateLastEvent = (widget: CPDFWidget, result: string) => {
    setLastEvent({
      type: widget.type,
      title: widget.title || widget.uuid,
      result,
    });
  };

  const closePrompt = () => {
    pendingPromptRef.current = null;
    if (mountedRef.current) setPrompt(null);
  };

  const closeSignaturePicker = () => {
    pendingSignatureWidgetRef.current = null;
    if (mountedRef.current) setSignaturePickerVisible(false);
  };

  const handleInterceptWidgetAction = (widget: CPDFWidget) => {
      const reader = readerRef.current;
      if (!reader || pendingPromptRef.current || pendingSignatureWidgetRef.current) {
        return;
      }

      const title = widget.title || widget.type;
      const showPrompt = (next: Omit<WidgetPrompt, 'category'>) => {
        const sheet = { ...next, category: widgetCategories[widget.type] ?? 'Form field' };
        pendingPromptRef.current = sheet;
        setPrompt(sheet);
      };
      const commit = async (update: () => void, result: string) => {
        if (readerRef.current !== reader) return;
        try {
          update();
          await reader._pdfDocument.updateWidget(widget);
          if (readerRef.current === reader) updateLastEvent(widget, result);
        } catch {
          if (readerRef.current === reader) Alert.alert('Could not update field', title);
        }
      };

      switch (widget.type) {
        case CPDFWidgetType.TEXT_FIELD: {
          const textWidget = widget as CPDFTextWidget;
          showPrompt({
            title,
            input: {
              text: textWidget.text,
              save: (text) => commit(() => textWidget.update({ text }), 'Updated text field value'),
            },
          });
          break;
        }
        case CPDFWidgetType.CHECKBOX:
        case CPDFWidgetType.RADIO_BUTTON: {
          const toggle = widget as CPDFCheckboxWidget | CPDFRadiobuttonWidget;
          const isChecked = !toggle.isChecked;
          const label = isChecked ? 'Check' : 'Uncheck';
          showPrompt({
            title,
            message: `Currently ${toggle.isChecked ? 'checked' : 'unchecked'}.`,
            action: {
              label,
              run: () => commit(() => toggle.update({ isChecked }), isChecked ? 'Checked' : 'Unchecked'),
            },
          });
          break;
        }
        case CPDFWidgetType.LISTBOX:
        case CPDFWidgetType.COMBOBOX: {
          const choiceWidget = widget as CPDFListboxWidget | CPDFComboboxWidget;
          const options = choiceWidget.options ?? [];
          showPrompt({
            title,
            message: options.length === 0 ? 'No options available.' :
              `Current selection: ${options[choiceWidget.selectItemAtIndex]?.text ?? 'None'}`,
            selectedIndex: choiceWidget.selectItemAtIndex,
            options: options.map((option, index) => ({
              label: option.text,
              run: () => commit(
                () => choiceWidget.update({ selectItemAtIndex: index }),
                `Selected ${option.text}`,
              ),
            })),
          });
          break;
        }
        case CPDFWidgetType.PUSH_BUTTON: {
          const pushButton = widget as CPDFPushbuttonWidget;
          const action = pushButton.action;
          const buttonTitle = pushButton.buttonTitle || title;
          if (action instanceof CPDFGoToAction) {
            showPrompt({
              title: buttonTitle,
              message: `Jump to page ${action.pageIndex + 1}?`,
              action: {
                label: 'Go to page',
                run: async () => {
                  if (readerRef.current !== reader) return;
                  try {
                    await reader.setDisplayPageIndex(action.pageIndex);
                    if (readerRef.current === reader) updateLastEvent(widget, 'Jumped to target page');
                  } catch {
                    if (readerRef.current === reader) Alert.alert('Could not jump to target page');
                  }
                },
              },
            });
          } else {
            showPrompt({
              title: buttonTitle,
              message: action instanceof CPDFUriAction ? `URL: ${action.uri}` : 'No supported button action.',
            });
          }
          break;
        }
        case CPDFWidgetType.SIGNATURES_FIELDS: {
          pendingSignatureWidgetRef.current = { widget: widget as CPDFSignatureWidget, reader };
          setSignaturePickerVisible(true);
          break;
        }
        default:
          updateLastEvent(widget, 'Unsupported widget type');
          break;
      }
  };

  const handleSignatureSelected = async (imagePath: string) => {
    const pending = pendingSignatureWidgetRef.current;
    if (!pending || readerRef.current !== pending.reader) return;
    const { reader, widget } = pending;
    pendingSignatureWidgetRef.current = null;
    try {
      const added = await reader._pdfDocument.addSignatureImage(widget, imagePath);
      if (readerRef.current !== reader) return;
      const updated = added && await reader._pdfDocument.updateAp(widget);
      if (readerRef.current === reader) {
        updateLastEvent(widget, updated ? 'Signature image added' : 'Could not update signature appearance');
      }
    } catch {
      if (readerRef.current === reader) Alert.alert('Could not add signature');
    }
  };

  return (
    <FormExampleScaffold
      title="Intercept Widget Action"
      subtitle="Intercept form widget taps and handle the behavior in React Native."
      document={formDocument}
      configuration={configuration}
      onViewCreated={(reader) => {
        if (mountedRef.current) readerRef.current = reader;
      }}
      readerViewProps={{
        pageIndex: 1,
        onInterceptWidgetActionCallback: handleInterceptWidgetAction,
      }}
      bottomAccessory={
        <View style={[styles.eventPanel, { backgroundColor: colors.surface, borderTopColor: colors.outlineVariant }]}>
          <Text style={[styles.eventTitle, { color: colors.textPrimary }]}>Last form action result</Text>
          <Text accessibilityLiveRegion="polite" style={[styles.eventText, { color: colors.textSecondary }]}>
            {lastEvent
              ? `${lastEvent.type} · ${lastEvent.title}\n${lastEvent.result}`
              : 'Tap a form widget to handle it with custom UI.'}
          </Text>
        </View>
      }
    >
      {() => (
        <>
          {prompt && (
            <WidgetActionModal
              prompt={prompt}
              onClose={closePrompt}
              onApply={(action) => {
                if (pendingPromptRef.current !== prompt || !readerRef.current) return;
                closePrompt();
                action();
              }}
            />
          )}
          {signaturePickerVisible && (
            <SignatureListModal
              visible
              bottomSheet
              onClose={closeSignaturePicker}
              onSelectSignature={handleSignatureSelected}
            />
          )}
        </>
      )}
    </FormExampleScaffold>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  field: { gap: 8 },
  message: { fontSize: 15, lineHeight: 22 },
  fieldLabel: { fontSize: 14, fontWeight: '600' },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  options: {
    flexGrow: 0,
    flexShrink: 1,
  },
  choice: {
    minHeight: 48, borderWidth: 1, borderRadius: 12, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  choiceLabel: { flex: 1, fontSize: 16 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  eventPanel: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  eventText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
