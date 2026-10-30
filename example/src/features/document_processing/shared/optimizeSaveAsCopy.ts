import { createDefaultOptimizeOptions } from '@compdfkit_pdf_sdk/react_native';
import type { CPDFOptimizeOptions } from '@compdfkit_pdf_sdk/react_native';

export type OptimizeLogEntry = { id: string; status: 'success' | 'cancelled' | 'error'; documentName: string; sourceSize: number; outputSize: number; detail: string };
export type OptimizeState = { options: CPDFOptimizeOptions; fontSubset: boolean; isOptimizing: boolean; progressPage: number | null; outputPath: string | null; entries: OptimizeLogEntry[] };

export function initialOptimizeState(): OptimizeState { return { options: createDefaultOptimizeOptions(), fontSubset: false, isOptimizing: false, progressPage: null, outputPath: null, entries: [] }; }
export function getOptimizeOutputPath(directory: string): string { return `${directory}/optimized_document.pdf`; }
export function createOptimizeLogEntry(entry: Omit<OptimizeLogEntry, 'id'>): OptimizeLogEntry { return { ...entry, id: `${Date.now()}-${Math.random()}` }; }
