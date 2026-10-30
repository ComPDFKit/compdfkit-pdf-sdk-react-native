import type { CPDFPdfStandardType } from '@compdfkit_pdf_sdk/react_native';

export type PdfStandardLogStatus = 'success' | 'error' | 'info';

export type PdfStandardLogEntry = {
  id: string;
  status: PdfStandardLogStatus;
  documentName: string;
  sourceType: CPDFPdfStandardType;
  targetType: CPDFPdfStandardType;
  detail: string;
  createdAt: string;
};

export type PdfStandardConversionState = {
  targetType: CPDFPdfStandardType;
  fontSubset: boolean;
  isConverting: boolean;
  outputPath: string | null;
  entries: PdfStandardLogEntry[];
};

export const initialPdfStandardConversionState: PdfStandardConversionState = {
  targetType: 'pdf_a_1b',
  fontSubset: true,
  isConverting: false,
  outputPath: null,
  entries: [],
};

export function createPdfStandardLogEntry(
  entry: Omit<PdfStandardLogEntry, 'id' | 'createdAt'>,
): PdfStandardLogEntry {
  return {
    ...entry,
    id: `${Date.now()}-${Math.random()}`,
    createdAt: new Date().toLocaleTimeString(),
  };
}

export function getPdfStandardOutputPath(
  temporaryDirectory: string,
  targetType: CPDFPdfStandardType,
): string {
  return `${temporaryDirectory}/pdf_standard_${targetType}.pdf`;
}
