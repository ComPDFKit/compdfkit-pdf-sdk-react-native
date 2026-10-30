export type CPDFOptimizeResult = {
  ok: boolean;
  /** `true` when the run was stopped by `cancelOptimize()`; not an error. */
  cancelled: boolean;
  pagesProcessed: number;
  stepsUs: number;
  saveUs: number;
};

export const fromNativeOptimizeResult = (value: any): CPDFOptimizeResult => ({
  ok: value?.ok === true,
  cancelled: value?.cancelled === true,
  pagesProcessed: value?.pages_processed ?? 0,
  stepsUs: value?.steps_us ?? 0,
  saveUs: value?.save_us ?? 0,
});
