import { HexColor } from "../configuration/CPDFOptions";

export type CPDFWatermarkType = "text" | "image";
export type CPDFWatermarkVerticalAlignment = "top" | "center" | "bottom";
export type CPDFWatermarkHorizontalAlignment = "left" | "center" | "right";

export type CPDFWatermark = {
  index: number;
  type: CPDFWatermarkType;
  pages: number[];
  imagePath: string;
  isImageExported: boolean;
  textContent?: string;
  textColor?: HexColor;
  fontSize?: number;
  scale?: number;
  rotation?: number;
  opacity?: number;
  verticalAlignment?: CPDFWatermarkVerticalAlignment;
  horizontalAlignment?: CPDFWatermarkHorizontalAlignment;
  verticalOffset?: number;
  horizontalOffset?: number;
  isFront?: boolean;
  isTilePage?: boolean;
  horizontalSpacing?: number;
  verticalSpacing?: number;
};

export type NativeWatermarkPayload = {
  index?: unknown;
  type?: unknown;
  text_content?: unknown;
  image_path?: unknown;
  is_image_exported?: unknown;
  text_color?: unknown;
  font_size?: unknown;
  scale?: unknown;
  rotation?: unknown;
  opacity?: unknown;
  vertical_alignment?: unknown;
  horizontal_alignment?: unknown;
  vertical_offset?: unknown;
  horizontal_offset?: unknown;
  pages?: unknown;
  is_front?: unknown;
  is_tile_page?: unknown;
  horizontal_spacing?: unknown;
  vertical_spacing?: unknown;
};

export type CPDFWatermarkPatch = Partial<CPDFWatermark>;

function asNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asPositiveNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : fallback;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function parsePages(value: unknown): number[] {
  if (Array.isArray(value)) {
    return value.filter((page): page is number => Number.isInteger(page));
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    return [];
  }
  const pages: number[] = [];
  for (const part of value.split(",")) {
    const trimmed = part.trim();
    if (trimmed.includes("-")) {
      const [startRaw, endRaw] = trimmed.split("-");
      const start = Number(startRaw);
      const end = Number(endRaw);
      if (Number.isInteger(start) && Number.isInteger(end) && end >= start) {
        for (let page = start; page <= end; page += 1) {
          pages.push(page);
        }
      }
      continue;
    }
    const page = Number(trimmed);
    if (Number.isInteger(page)) {
      pages.push(page);
    }
  }
  return pages;
}

function serializePages(pages: number[]): string {
  return pages.join(",");
}

function normalizeWatermark(watermark: CPDFWatermark): CPDFWatermark {
  return {
    index: watermark.index ?? -1,
    type: watermark.type,
    pages: watermark.pages ?? [],
    imagePath: watermark.imagePath ?? "",
    isImageExported: watermark.isImageExported ?? false,
    textContent: watermark.textContent ?? "",
    textColor: watermark.textColor ?? "#000000",
    fontSize: asPositiveNumber(watermark.fontSize, 24),
    scale: watermark.scale ?? 1,
    rotation: watermark.rotation ?? 45,
    opacity: watermark.opacity ?? 1,
    verticalAlignment: watermark.verticalAlignment ?? "center",
    horizontalAlignment: watermark.horizontalAlignment ?? "center",
    verticalOffset: watermark.verticalOffset ?? 0,
    horizontalOffset: watermark.horizontalOffset ?? 0,
    isFront: watermark.isFront ?? true,
    isTilePage: watermark.isTilePage ?? false,
    horizontalSpacing: watermark.horizontalSpacing ?? 0,
    verticalSpacing: watermark.verticalSpacing ?? 0,
  };
}

export function createTextWatermark(
  params: Omit<Partial<CPDFWatermark>, "type" | "imagePath" | "isImageExported"> & {
    textContent: string;
    pages: number[];
  }
): CPDFWatermark {
  return normalizeWatermark({
    ...params,
    index: params.index ?? -1,
    type: "text",
    imagePath: "",
    isImageExported: false,
  });
}

export function createImageWatermark(
  params: Omit<Partial<CPDFWatermark>, "type" | "textContent" | "textColor" | "fontSize"> & {
    imagePath: string;
    pages: number[];
  }
): CPDFWatermark {
  return normalizeWatermark({
    ...params,
    index: params.index ?? -1,
    type: "image",
    textContent: "",
    textColor: "#000000",
    fontSize: 24,
    isImageExported: params.isImageExported ?? false,
  });
}

export function copyWatermark(
  watermark: CPDFWatermark,
  patch: CPDFWatermarkPatch
): CPDFWatermark {
  return normalizeWatermark({
    ...watermark,
    ...patch,
  });
}

export function fromNativeWatermark(payload: NativeWatermarkPayload): CPDFWatermark {
  return normalizeWatermark({
    index: asNumber(payload.index, -1),
    type: asString(payload.type, "text") === "image" ? "image" : "text",
    textContent: asString(payload.text_content, ""),
    imagePath: asString(payload.image_path, ""),
    isImageExported: asBoolean(payload.is_image_exported, false),
    textColor: asString(payload.text_color, "#000000") as HexColor,
    fontSize: asPositiveNumber(payload.font_size, 24),
    scale: asNumber(payload.scale, 1),
    rotation: asNumber(payload.rotation, 45),
    opacity: asNumber(payload.opacity, 1),
    verticalAlignment: asString(payload.vertical_alignment, "center") as CPDFWatermarkVerticalAlignment,
    horizontalAlignment: asString(payload.horizontal_alignment, "center") as CPDFWatermarkHorizontalAlignment,
    verticalOffset: asNumber(payload.vertical_offset, 0),
    horizontalOffset: asNumber(payload.horizontal_offset, 0),
    pages: parsePages(payload.pages),
    isFront: asBoolean(payload.is_front, true),
    isTilePage: asBoolean(payload.is_tile_page, false),
    horizontalSpacing: asNumber(payload.horizontal_spacing, 0),
    verticalSpacing: asNumber(payload.vertical_spacing, 0),
  });
}

export function toNativeWatermark(
  watermark: CPDFWatermark,
  options: { allowEmptyImagePath?: boolean } = {}
): NativeWatermarkPayload {
  const normalized = normalizeWatermark(watermark);
  if (normalized.pages.length === 0) {
    throw new Error("Watermark pages cannot be empty.");
  }
  if (normalized.type === "text" && !normalized.textContent) {
    throw new Error("Text watermark textContent cannot be empty.");
  }
  if (normalized.type === "image" && !normalized.imagePath && !options.allowEmptyImagePath) {
    throw new Error("Image watermark imagePath cannot be empty.");
  }

  return {
    index: normalized.index,
    type: normalized.type,
    text_content: normalized.textContent,
    image_path: normalized.imagePath,
    is_image_exported: normalized.isImageExported,
    text_color: normalized.textColor,
    font_size: normalized.fontSize,
    scale: normalized.scale,
    rotation: normalized.rotation,
    opacity: normalized.opacity,
    vertical_alignment: normalized.verticalAlignment,
    horizontal_alignment: normalized.horizontalAlignment,
    vertical_offset: normalized.verticalOffset,
    horizontal_offset: normalized.horizontalOffset,
    pages: serializePages(normalized.pages),
    is_front: normalized.isFront,
    is_tile_page: normalized.isTilePage,
    horizontal_spacing: normalized.horizontalSpacing,
    vertical_spacing: normalized.verticalSpacing,
  };
}
