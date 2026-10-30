export type CPDFCompressAlgorithm =
  | 'none'
  | 'flate'
  | 'run_length'
  | 'jpeg'
  | 'jbig2'
  | 'jpeg2000';

export const COMPRESS_ALGORITHMS: CPDFCompressAlgorithm[] = [
  'none', 'flate', 'run_length', 'jpeg', 'jbig2', 'jpeg2000',
];

export const fromNativeCompressAlgorithm = (
  value: unknown,
): CPDFCompressAlgorithm => COMPRESS_ALGORITHMS.includes(value as CPDFCompressAlgorithm)
  ? value as CPDFCompressAlgorithm
  : 'none';
