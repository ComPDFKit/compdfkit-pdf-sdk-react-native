/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import {
  CPDFCheckStyle,
  CPDFCheckboxWidget,
  CPDFComboboxWidget,
  CPDFGoToAction,
  CPDFListboxWidget,
  CPDFPushbuttonWidget,
  CPDFRadiobuttonWidget,
  CPDFSignatureWidget,
  CPDFTextWidget,
  CPDFUriAction,
  CPDFWidget,
  CPDFWidgetUtil,
} from '@compdfkit_pdf_sdk/react_native';

export const formWidgetExamples = {
  textFields: [
    new CPDFTextWidget({
      title: CPDFWidgetUtil.createFieldName('TextField'),
      page: 0,
      rect: { left: 40, top: 799, right: 320, bottom: 701 },
      createDate: new Date(1735696800000),
      text: 'This is Text Fields',
      isMultiline: true,
      fillColor: '#BEBEBE',
      borderColor: '#8BC34A',
      borderWidth: 5,
      fontColor: '#000000',
      fontSize: 14,
      familyName: 'Times',
      styleName: 'Bold',
      alignment: 'right',
    }),
  ],
  checkboxes: [
    new CPDFCheckboxWidget({
      title: CPDFWidgetUtil.createFieldName('Checkbox'),
      page: 0,
      rect: { left: 361, top: 778, right: 442, bottom: 704 },
      isChecked: true,
      checkStyle: CPDFCheckStyle.CIRCLE,
      checkColor: '#3CE930',
      fillColor: '#E0E0E0',
      borderColor: '#000000',
      borderWidth: 5,
    }),
  ],
  radioButtons: [
    new CPDFRadiobuttonWidget({
      title: CPDFWidgetUtil.createFieldName('Radiobutton'),
      page: 0,
      rect: { left: 479, top: 789, right: 549, bottom: 715 },
      isChecked: true,
      checkStyle: CPDFCheckStyle.CROSS,
      checkColor: '#FF0000',
      fillColor: '#00FF00',
      borderColor: '#000000',
      borderWidth: 5,
    }),
  ],
  listAndCombobox: [
    new CPDFListboxWidget({
      title: CPDFWidgetUtil.createFieldName('Listbox'),
      page: 0,
      rect: { left: 53, top: 294, right: 294, bottom: 191 },
      selectItemAtIndex: 0,
      options: [
        { text: 'options-1', value: 'options-1' },
        { text: 'options-2', value: 'options-2' },
      ],
      familyName: 'Times',
      styleName: 'Bold',
      fillColor: '#FFFF00',
      borderColor: '#FF0000',
      borderWidth: 3,
    }),
    new CPDFComboboxWidget({
      title: CPDFWidgetUtil.createFieldName('Combobox'),
      page: 0,
      rect: { left: 354, top: 288, right: 557, bottom: 170 },
      selectItemAtIndex: 1,
      options: [
        { text: 'options-1', value: 'options-1' },
        { text: 'options-2', value: 'options-2' },
      ],
      familyName: 'Times',
      styleName: 'Bold',
      fillColor: '#FFFF00',
      borderColor: '#FF0000',
      borderWidth: 3,
    }),
  ],
  signature: [
    new CPDFSignatureWidget({
      title: CPDFWidgetUtil.createFieldName('Signature'),
      page: 0,
      rect: { left: 64, top: 649, right: 319, bottom: 527 },
      fillColor: '#E0E0E0',
      borderColor: '#FF0000',
      borderWidth: 5,
    }),
  ],
  buttons: [
    new CPDFPushbuttonWidget({
      title: CPDFWidgetUtil.createFieldName('Pushbutton'),
      page: 0,
      rect: { left: 366, top: 632, right: 520, bottom: 541 },
      fillColor: '#E0E0E0',
      borderColor: '#FF0000',
      borderWidth: 5,
      fontSize: 14,
      buttonTitle: 'Jump Page 2',
      action: CPDFGoToAction.toPage(1),
    }),
    new CPDFPushbuttonWidget({
      title: CPDFWidgetUtil.createFieldName('Pushbutton'),
      page: 0,
      rect: { left: 365, top: 503, right: 501, bottom: 413 },
      fillColor: '#E0E0E0',
      borderColor: '#FF0000',
      borderWidth: 5,
      fontSize: 14,
      buttonTitle: 'Click Me',
      action: CPDFUriAction.createWeb('https://www.compdf.com'),
    }),
  ],
  get all(): CPDFWidget[] {
    return [
      ...this.textFields,
      ...this.checkboxes,
      ...this.radioButtons,
      ...this.listAndCombobox,
      ...this.signature,
      ...this.buttons,
    ];
  },
};