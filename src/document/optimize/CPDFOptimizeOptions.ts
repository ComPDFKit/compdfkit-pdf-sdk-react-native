import { fromNativeCompressAlgorithm, type CPDFCompressAlgorithm } from './CPDFCompressAlgorithm';
import { CPDFOptimizeFlag, DEFAULT_OPTIMIZE_FLAGS, optimizeFlagsFromMask, optimizeFlagsToMask } from './CPDFOptimizeFlag';

export type CPDFOptimizeImageOptions = {
  upperPpi: number;
  targetPpi: number;
  /** Image quality (1–100); overrides `imageQuality` for this group. 100 skips recompression. */
  quality: number;
  blockSize: number;
  compressAlgorithm: CPDFCompressAlgorithm;
};

export type CPDFColorSpaceConvertOptions = {
  iccDataBase64?: string;
  rgbToCmyk: boolean;
};

export type CPDFOptimizeOptions = {
  flags: readonly CPDFOptimizeFlag[];
  /** Global image quality (1–100). Each image group's `quality` takes precedence. */
  imageQuality: number;
  colorImageOptions: CPDFOptimizeImageOptions;
  grayscaleImageOptions: CPDFOptimizeImageOptions;
  monochromeImageOptions: CPDFOptimizeImageOptions;
  colorSpaceConvert: CPDFColorSpaceConvertOptions;
};

function createImageOptions(monochrome = false): CPDFOptimizeImageOptions {
  return {
    upperPpi: monochrome ? 450 : 225,
    targetPpi: monochrome ? 300 : 150,
    quality: 40,
    blockSize: 256,
    compressAlgorithm: monochrome ? 'jbig2' : 'jpeg2000',
  };
}

/** Returns a new copy of the Android SDK's documented default optimization settings. */
export function createDefaultOptimizeOptions(): CPDFOptimizeOptions {
  return {
    flags: [...DEFAULT_OPTIMIZE_FLAGS],
    imageQuality: 40,
    colorImageOptions: createImageOptions(),
    grayscaleImageOptions: createImageOptions(),
    monochromeImageOptions: createImageOptions(true),
    colorSpaceConvert: { rgbToCmyk: true },
  };
}

export function toNativeOptimizeOptions(options: CPDFOptimizeOptions) {
  const imageOptions = (value: CPDFOptimizeImageOptions) => ({
    upper_ppi: value.upperPpi,
    target_ppi: value.targetPpi,
    quality: value.quality,
    block_size: value.blockSize,
    compress_algorithm: value.compressAlgorithm,
  });

  return {
    flags: optimizeFlagsToMask([...options.flags]),
    image_quality: options.imageQuality,
    color_image_options: imageOptions(options.colorImageOptions),
    grayscale_image_options: imageOptions(options.grayscaleImageOptions),
    monochrome_image_options: imageOptions(options.monochromeImageOptions),
    color_space_convert: {
      icc_data_base64: options.colorSpaceConvert.iccDataBase64 ?? null,
      rgb_to_cmyk: options.colorSpaceConvert.rgbToCmyk,
    },
  };
}

/** Decodes the native default configuration returned by `CPDFDocument.getOptimizeOptions()`. */
export function fromNativeOptimizeOptions(value: any): CPDFOptimizeOptions {
  const defaults = createDefaultOptimizeOptions();
  const imageOptions = (raw: any, fallback: CPDFOptimizeImageOptions): CPDFOptimizeImageOptions => ({
    upperPpi: raw?.upper_ppi ?? fallback.upperPpi,
    targetPpi: raw?.target_ppi ?? fallback.targetPpi,
    quality: raw?.quality ?? fallback.quality,
    blockSize: raw?.block_size ?? fallback.blockSize,
    compressAlgorithm: raw?.compress_algorithm == null
      ? fallback.compressAlgorithm
      : fromNativeCompressAlgorithm(raw.compress_algorithm),
  });
  const colorSpace = value?.color_space_convert;
  return {
    flags: typeof value?.flags === 'number' ? optimizeFlagsFromMask(value.flags) : defaults.flags,
    imageQuality: value?.image_quality ?? defaults.imageQuality,
    colorImageOptions: imageOptions(value?.color_image_options, defaults.colorImageOptions),
    grayscaleImageOptions: imageOptions(value?.grayscale_image_options, defaults.grayscaleImageOptions),
    monochromeImageOptions: imageOptions(value?.monochrome_image_options, defaults.monochromeImageOptions),
    colorSpaceConvert: {
      iccDataBase64: colorSpace?.icc_data_base64 ?? undefined,
      rgbToCmyk: colorSpace?.rgb_to_cmyk ?? defaults.colorSpaceConvert.rgbToCmyk,
    },
  };
}
