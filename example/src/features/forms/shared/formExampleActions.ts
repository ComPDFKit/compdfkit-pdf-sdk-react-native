/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import {
  CPDFCheckBoxAttr,
  CPDFCheckStyle,
  CPDFCheckboxWidget,
  CPDFComboBoxAttr,
  CPDFComboboxWidget,
  CPDFListBoxAttr,
  CPDFListboxWidget,
  CPDFPushButtonAttr,
  CPDFPushbuttonWidget,
  CPDFRadioButtonAttr,
  CPDFRadiobuttonWidget,
  CPDFReaderView,
  CPDFSignatureWidget,
  CPDFSignatureWidgetAttr,
  CPDFTextFieldAttr,
  CPDFTextWidget,
  CPDFUriAction,
  CPDFWidget,
} from '@compdfkit_pdf_sdk/react_native';
import { Logger } from '../../../util/logger';
import { keepLocalCopy, pick, types } from '@react-native-documents/picker';

import { formWidgetExamples } from './formWidgetExamples';

export async function addCommonFormFields(reader: CPDFReaderView) {
  await reader._pdfDocument.addWidgets(formWidgetExamples.all);
}

export async function addInteractiveFormFields(reader: CPDFReaderView) {
  await reader._pdfDocument.addWidgets(formWidgetExamples.listAndCombobox);
}

export async function fetchAllWidgets(reader: CPDFReaderView) {
  const pageCount = await reader._pdfDocument.getPageCount();
  let allWidgets: CPDFWidget[] = [];

  for (let index = 0; index < pageCount; index += 1) {
    const page = reader._pdfDocument.pageAtIndex(index);
    const widgets = await page?.getWidgets();
    if (widgets?.length) {
      allWidgets = allWidgets.concat(widgets);
    }
  }

  return allWidgets;
}

export async function fillSampleWidgets(reader: CPDFReaderView) {
  let widgets = await fetchAllWidgets(reader);
  if (widgets.length === 0) {
    await addCommonFormFields(reader);
    widgets = await fetchAllWidgets(reader);
  }

  for (const widget of widgets) {
    switch (widget.type) {
      case 'textField': {
        const textField = widget as CPDFTextWidget;
        textField.update({
          text: 'ComPDFKit-RN',
          title: 'ComPDFKit-RN TextField',
          fillColor: '#A2E195',
          borderColor: '#ED0E0E',
          fontColor: '#F55D1C',
          fontSize: 16,
          familyName: 'Times',
          styleName: 'Bold',
          borderWidth: 5,
        });
        await reader._pdfDocument.updateWidget(textField);
        break;
      }
      case 'checkBox': {
        const checkBox = widget as CPDFCheckboxWidget;
        checkBox.update({
          title: 'ComPDFKit-RN CheckBox',
          fillColor: '#FFFF00',
          borderColor: '#FF0000',
          isChecked: false,
          checkColor: '#3D84FF',
          checkStyle: CPDFCheckStyle.CIRCLE,
        });
        await reader._pdfDocument.updateWidget(checkBox);
        break;
      }
      case 'radioButton': {
        const radioButton = widget as CPDFRadiobuttonWidget;
        radioButton.update({
          title: 'ComPDFKit-RN RadioButton',
          fillColor: '#7DF658',
          borderColor: '#FF0000',
          isChecked: false,
          checkColor: '#3D84FF',
          checkStyle: CPDFCheckStyle.DIAMOND,
        });
        await reader._pdfDocument.updateWidget(radioButton);
        break;
      }
      case 'listBox': {
        const listBox = widget as CPDFListboxWidget;
        listBox.update({
          title: 'ComPDFKit-RN ListBox',
          fillColor: '#FFFF00',
          borderColor: '#FF0000',
          fontColor: '#000000',
          fontSize: 12,
          familyName: 'Times',
          styleName: 'Bold',
          selectItemAtIndex: 0,
          options: [
            { text: 'Option 1', value: 'value1' },
            { text: 'Option 2', value: 'value2' },
          ],
        });
        await reader._pdfDocument.updateWidget(listBox);
        break;
      }
      case 'comboBox': {
        const comboBox = widget as CPDFComboboxWidget;
        comboBox.update({
          title: 'ComPDFKit-RN ComboBox',
          fillColor: '#FFFF00',
          borderColor: '#FF0000',
          options: [
            { text: 'Option 1', value: 'value1' },
            { text: 'Option 2', value: 'value2' },
          ],
          selectItemAtIndex: 1,
          fontColor: '#000000',
          fontSize: 12,
          familyName: 'Times',
          styleName: 'Bold',
        });
        await reader._pdfDocument.updateWidget(comboBox);
        break;
      }
      case 'pushButton': {
        const pushButton = widget as CPDFPushbuttonWidget;
        pushButton.update({
          title: 'ComPDFKit-RN PushButton',
          fillColor: '#FFFF00',
          borderColor: '#FF0000',
          borderWidth: 10,
          buttonTitle: 'Click Me',
          fontColor: '#0000FF',
          fontSize: 16,
          familyName: 'Times',
          styleName: 'Bold',
          action: CPDFUriAction.createEmail('support@compdf.com'),
        });
        await reader._pdfDocument.updateWidget(pushButton);
        break;
      }
      case 'signaturesFields': {
        const signatureWidget = widget as CPDFSignatureWidget;
        signatureWidget.update({
          title: 'ComPDFKit-RN SignatureField',
          fillColor: '#FFFF00',
          borderColor: '#FF0000',
          borderWidth: 10,
        });
        await reader._pdfDocument.updateWidget(signatureWidget);
        break;
      }
      default:
        break;
    }
  }

  return widgets.length;
}

export async function logDefaultWidgetStyles(reader: CPDFReaderView) {
  const widgetAttrs = await reader.fetchDefaultWidgetStyle();
  Logger.log('fetchDefaultWidgetStyle: --------->');
  Logger.log(JSON.stringify(widgetAttrs, null, 2));
  return widgetAttrs;
}

export async function applySampleDefaultWidgetStyles(reader: CPDFReaderView) {
  const textFieldAttr: CPDFTextFieldAttr = {
    type: 'textField',
    fillColor: '#FFFF00',
    borderColor: '#FF0000',
    borderWidth: 2,
  };
  await reader.updateDefaultWidgetStyle(textFieldAttr);

  const checkBoxAttr: CPDFCheckBoxAttr = {
    type: 'checkBox',
    fillColor: '#A4F482',
    borderColor: '#F6534A',
    borderWidth: 2,
    checkedStyle: CPDFCheckStyle.DIAMOND,
  };
  await reader.updateDefaultWidgetStyle(checkBoxAttr);

  const radioButtonAttr: CPDFRadioButtonAttr = {
    type: 'radioButton',
    fillColor: '#E0DA8B',
    borderColor: '#FA3350',
    borderWidth: 5,
    checkedStyle: CPDFCheckStyle.DIAMOND,
  };
  await reader.updateDefaultWidgetStyle(radioButtonAttr);

  const listBoxAttr: CPDFListBoxAttr = {
    type: 'listBox',
    fillColor: '#FFDCD1',
    borderColor: '#89E597',
    borderWidth: 2,
  };
  await reader.updateDefaultWidgetStyle(listBoxAttr);

  const comboBoxAttr: CPDFComboBoxAttr = {
    type: 'comboBox',
    fillColor: '#CAE29D',
    borderColor: '#6E92DA',
    borderWidth: 2,
  };
  await reader.updateDefaultWidgetStyle(comboBoxAttr);

  const pushButtonAttr: CPDFPushButtonAttr = {
    type: 'pushButton',
    fillColor: '#CAE29D',
    borderColor: '#6E92DA',
    borderWidth: 2,
  };
  await reader.updateDefaultWidgetStyle(pushButtonAttr);

  const signatureFieldAttr: CPDFSignatureWidgetAttr = {
    type: 'signaturesFields',
    fillColor: '#CAE29D',
    borderColor: '#6E92DA',
    borderWidth: 2,
  };
  await reader.updateDefaultWidgetStyle(signatureFieldAttr);
}

export async function importWidgetsFromPickedFile(reader: CPDFReaderView) {
  const [pickedFile] = await pick({
    mode: 'open',
    type: [types.allFiles],
    allowMultiSelection: false,
  });

  const [copyResult] = await keepLocalCopy({
    files: [
      {
        uri: pickedFile!.uri,
        fileName: pickedFile!.name ?? 'widgets.xfdf',
      },
    ],
    destination: 'documentDirectory',
  });

  if (copyResult.status !== 'success') {
    return null;
  }

  const localUri = copyResult.localUri;
  if (!localUri.endsWith('.xfdf') && !localUri.endsWith('.xml')) {
    Logger.log('Please select a valid xfdf or xml file');
    return null;
  }

  const result = await reader._pdfDocument.importWidgets(localUri);
  Logger.log('importWidget:', result);
  return result;
}

export async function exportWidgets(reader: CPDFReaderView) {
  const exportPath = await reader._pdfDocument.exportWidgets();
  Logger.log('exportWidgets:', exportPath);
  return exportPath;
}