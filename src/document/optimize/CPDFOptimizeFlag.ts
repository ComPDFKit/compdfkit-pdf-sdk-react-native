export const OPTIMIZE_FLAG_BITS = {
  remove_unused_objects: 1 << 0,
  remove_empty_objects: 1 << 1,
  remove_special_attributes: 1 << 2,
  remove_embedded_fonts: 1 << 3,
  remove_invalid_links: 1 << 4,
  remove_invalid_bookmarks: 1 << 5,
  compress_images: 1 << 6,
  remove_bookmarks: 1 << 7,
  remove_annotations: 1 << 8,
  remove_forms: 1 << 9,
  remove_multimedia: 1 << 10,
  remove_document_info: 1 << 11,
  remove_metadata: 1 << 12,
  remove_object_data: 1 << 13,
  remove_file_attachments: 1 << 14,
  remove_external_cross_refs: 1 << 15,
  remove_other_app_data: 1 << 16,
  remove_hidden_layers: 1 << 17,
  merge_visible_layers: 1 << 18,
  use_flate_for_uncompressed_streams: 1 << 19,
  replace_lzw_with_flate: 1 << 20,
  remove_unused_named_targets: 1 << 21,
  optimize_page_content: 1 << 22,
  fast_web_view: 1 << 23,
  remove_form_submit_import_reset_actions: 1 << 24,
  remove_javascript_actions: 1 << 25,
  remove_page_thumbnails: 1 << 26,
  remove_replaced_images_alt_text: 1 << 27,
  remove_page_labels: 1 << 28,
  remove_print_settings: 1 << 29,
  remove_search_index: 1 << 30,
} as const;
export type CPDFOptimizeFlag = keyof typeof OPTIMIZE_FLAG_BITS;
export const DEFAULT_OPTIMIZE_FLAGS: CPDFOptimizeFlag[] = [
  'remove_unused_objects', 'remove_empty_objects', 'remove_special_attributes',
  'remove_invalid_links', 'remove_invalid_bookmarks', 'compress_images',
  'remove_bookmarks', 'remove_hidden_layers', 'use_flate_for_uncompressed_streams',
  'replace_lzw_with_flate', 'remove_unused_named_targets', 'optimize_page_content',
  'remove_javascript_actions', 'remove_replaced_images_alt_text',
];

export const optimizeFlagsToMask = (flags: CPDFOptimizeFlag[]) =>
  flags.reduce((mask, flag) => mask | OPTIMIZE_FLAG_BITS[flag], 0);

export const optimizeFlagsFromMask = (mask: number): CPDFOptimizeFlag[] =>
  (Object.keys(OPTIMIZE_FLAG_BITS) as CPDFOptimizeFlag[]).filter(
    flag => (mask & OPTIMIZE_FLAG_BITS[flag]) !== 0,
  );
