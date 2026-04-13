/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import type { CPDFReaderView } from '@compdfkit_pdf_sdk/react_native';

import type { AnnotationExampleAction } from './AnnotationExampleScaffold';
import {
  addPickedImageAnnotation,
  addSampleAnnotations,
  applySampleDefaultAnnotationStyles,
  clearDisplayRect,
  exportAnnotations,
  importAnnotationsFromAssets,
  importAnnotationsFromPickedFile,
  logDefaultAnnotationStyles,
  saveCurrentInk,
  updateExistingAnnotations,
} from './annotationExampleActions';

type AnnotationExampleActionDefinition = AnnotationExampleAction & {
  description: string;
  modifiesDocument: boolean;
};

type AnnotationExampleActionOverrides = Partial<
  Pick<AnnotationExampleAction, 'key' | 'label' | 'tone'>
>;

function defineAction(
  action: AnnotationExampleActionDefinition,
): AnnotationExampleActionDefinition {
  return action;
}

export function toAnnotationExampleAction(
  action: AnnotationExampleActionDefinition,
  overrides: AnnotationExampleActionOverrides = {},
): AnnotationExampleAction {
  return {
    key: overrides.key ?? action.key,
    label: overrides.label ?? action.label,
    tone: overrides.tone ?? action.tone,
    onPress: action.onPress,
  };
}

/**
 * Shared menu actions used by annotation example screens.
 *
 * Screen files should import from this registry first so the menu label,
 * intent, and handler mapping stay discoverable in one place.
 */
export const annotationExampleMenuActions = {
  addSampleAnnotations: defineAction({
    key: 'add-sample-annotations',
    label: 'Add Sample Annotations',
    description: 'Insert a ready-made set of sample annotations into the current document.',
    modifiesDocument: true,
    onPress: (reader: CPDFReaderView) => addSampleAnnotations(reader),
  }),
  pickImageAnnotation: defineAction({
    key: 'pick-image-annotation',
    label: 'Pick Image Annotation',
    description: 'Open the system file manager, choose an image, and insert it as an image annotation.',
    modifiesDocument: true,
    onPress: (reader: CPDFReaderView) => addPickedImageAnnotation(reader),
  }),
  updateExistingAnnotations: defineAction({
    key: 'update-existing-annotations',
    label: 'Update Page 1 Annotations',
    description: 'Update the annotations found on the first page in place.',
    modifiesDocument: true,
    onPress: (reader: CPDFReaderView) => updateExistingAnnotations(reader),
  }),
  importAssetXfdf: defineAction({
    key: 'import-asset-xfdf',
    label: 'Import Asset XFDF',
    tone: 'secondary',
    description: 'Import bundled XFDF data from the example assets.',
    modifiesDocument: true,
    onPress: (reader: CPDFReaderView) => importAnnotationsFromAssets(reader),
  }),
  pickXfdfFile: defineAction({
    key: 'pick-xfdf-file',
    label: 'Pick XFDF File',
    description: 'Pick an XFDF or XML file from the device and import it.',
    modifiesDocument: true,
    onPress: (reader: CPDFReaderView) => importAnnotationsFromPickedFile(reader),
  }),
  exportXfdf: defineAction({
    key: 'export-xfdf',
    label: 'Export XFDF',
    tone: 'secondary',
    description: 'Export the current annotations to XFDF and log the result path.',
    modifiesDocument: false,
    onPress: async (reader: CPDFReaderView) => {
      await exportAnnotations(reader);
    },
  }),
  logDefaultAnnotationStyles: defineAction({
    key: 'get-default-styles',
    label: 'Get Styles',
    tone: 'secondary',
    description: 'Read and log the current default annotation style payload.',
    modifiesDocument: false,
    onPress: (reader: CPDFReaderView) => logDefaultAnnotationStyles(reader),
  }),
  applySampleDefaultAnnotationStyles: defineAction({
    key: 'apply-sample-default-styles',
    label: 'Apply Sample Styles',
    description: 'Overwrite the default annotation style payload with the sample values.',
    modifiesDocument: true,
    onPress: (reader: CPDFReaderView) => applySampleDefaultAnnotationStyles(reader),
  }),
  saveCurrentInk: defineAction({
    key: 'save-current-ink',
    label: 'Save Current Ink',
    description: 'Commit the current in-progress ink stroke to the document.',
    modifiesDocument: true,
    onPress: (reader: CPDFReaderView) => saveCurrentInk(reader),
  }),
  clearDisplayRect: defineAction({
    key: 'clear-display-rect',
    label: 'Clear Display Rect',
    tone: 'secondary',
    description: 'Clear the temporary focus rectangle shown by the annotation UI.',
    modifiesDocument: false,
    onPress: (reader: CPDFReaderView) => clearDisplayRect(reader),
  }),
} as const;

export const annotationExampleScreenActions = {
  addExample: [
    toAnnotationExampleAction(annotationExampleMenuActions.addSampleAnnotations),
    toAnnotationExampleAction(annotationExampleMenuActions.pickImageAnnotation),
  ],
  editExample: [
    toAnnotationExampleAction(annotationExampleMenuActions.updateExistingAnnotations),
  ],
  xfdfOperationsExample: [
    toAnnotationExampleAction(annotationExampleMenuActions.importAssetXfdf),
    toAnnotationExampleAction(annotationExampleMenuActions.pickXfdfFile),
    toAnnotationExampleAction(annotationExampleMenuActions.exportXfdf),
  ],
  defaultStyleExample: [
    toAnnotationExampleAction(
      annotationExampleMenuActions.logDefaultAnnotationStyles,
    ),
    toAnnotationExampleAction(
      annotationExampleMenuActions.applySampleDefaultAnnotationStyles,
    ),
  ],
  annotationModeExample: [
    toAnnotationExampleAction(annotationExampleMenuActions.saveCurrentInk),
    toAnnotationExampleAction(annotationExampleMenuActions.clearDisplayRect),
  ],
} as const;