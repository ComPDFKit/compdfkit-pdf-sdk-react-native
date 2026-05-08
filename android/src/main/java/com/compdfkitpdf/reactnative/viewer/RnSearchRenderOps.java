/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.viewer;

import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.RectF;
import android.graphics.drawable.Drawable;
import android.text.TextUtils;
import android.util.Base64;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.bumptech.glide.request.target.CustomTarget;
import com.bumptech.glide.request.transition.Transition;
import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.tools.common.utils.glide.CPDFWrapper;
import com.compdfkit.tools.common.utils.glide.wrapper.impl.CPDFDocumentPageWrapper;
import com.compdfkit.tools.common.utils.threadpools.CThreadPoolUtils;
import com.compdfkit.ui.textsearch.ITextSearcher;
import com.compdfkitpdf.reactnative.codec.RnPageCodec;
import com.compdfkitpdf.reactnative.util.RnSearchResultMapper;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;

/**
 * Handles search render ops for the native PDF viewer layer.
 */
final class RnSearchRenderOps {

  private static final String RENDER_ANNOTATION_APPEARANCE_FAIL =
    "RENDER_ANNOTATION_APPEARANCE_FAIL";

  private final ReactApplicationContext reactContext;

  /**
   * Creates a new RnSearchRenderOps instance.
   */
  RnSearchRenderOps(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
  }

  /**
   * Searches text.
   */
  WritableArray searchText(RnPdfViewContext context, String keywords, int searchOptions) {
    ITextSearcher textSearcher = context.readerView.getTextSearcher();
    return RnSearchResultMapper.search(context.document, textSearcher, keywords, searchOptions);
  }

  /**
   * Clears search result.
   */
  void clearSearchResult(RnPdfViewContext context) {
    RnSearchResultMapper.clearSearch(reactContext, context.viewCtrl, context.document);
  }

  /**
   * Handles selection text.
   */
  void selectionText(RnPdfViewContext context, int pageIndex, int textRangeIndex) {
    RnSearchResultMapper.selection(reactContext, context.viewCtrl, context.document, pageIndex,
      textRangeIndex);
  }

  /**
   * Returns the search text.
   */
  String getSearchText(RnPdfViewContext context, int pageIndex, int location, int length) {
    return RnSearchResultMapper.getText(context.document, pageIndex, location, length);
  }

  /**
   * Returns the page size.
   */
  WritableMap getPageSize(RnPdfViewContext context, int pageIndex) {
    try {
      RectF rectF = context.document.getPageSize(pageIndex);
      WritableMap map = Arguments.createMap();
      map.putDouble("width", rectF.width());
      map.putDouble("height", rectF.height());
      return map;
    } catch (Exception e) {
      return null;
    }
  }

  /**
   * Renders page.
   */
  void renderPage(RnPdfViewContext context, int pageIndex, int width, int height,
    String backgroundColor, boolean drawAnnot, boolean drawForm, String pageCompression,
    Promise promise) {
    CPDFDocument document = context.document;
    CPDFDocumentPageWrapper pageWrapper = new CPDFDocumentPageWrapper(document, pageIndex);
    pageWrapper.setBackgroundColor(Color.parseColor(backgroundColor));
    pageWrapper.setDrawAnnotation(drawAnnot);
    pageWrapper.setDrawForms(drawForm);
    CPDFWrapper wrapper = new CPDFWrapper(pageWrapper);
//    wrapper.setSize(width, height);
    Glide.with(document.getContext())
      .asBitmap()
      .load(wrapper)
      .override(width, height)
      .diskCacheStrategy(DiskCacheStrategy.NONE)
      .into(new CustomTarget<Bitmap>() {
        /**
         * Handles on resource ready.
         */
        @Override
        public void onResourceReady(@NonNull Bitmap resource,
          @Nullable Transition<? super Bitmap> transition) {
          switch (pageCompression) {
            case "jpeg":
              ByteArrayOutputStream jpegStream = new ByteArrayOutputStream();
              resource.compress(Bitmap.CompressFormat.JPEG, 85, jpegStream);
              byte[] byteArray = jpegStream.toByteArray();
              promise.resolve(Base64.encodeToString(byteArray, Base64.NO_WRAP));
              break;
            case "png":
              ByteArrayOutputStream pngStream = new ByteArrayOutputStream();
              resource.compress(Bitmap.CompressFormat.PNG, 100, pngStream);
              byte[] pngByteArray = pngStream.toByteArray();
              promise.resolve(Base64.encodeToString(pngByteArray, Base64.NO_WRAP));
              break;
            default:
              promise.resolve(null);
              break;
          }
          Glide.get(document.getContext()).clearMemory();
        }

        /**
         * Handles on load cleared.
         */
        @Override
        public void onLoadCleared(@Nullable Drawable placeholder) {
        }
      });
  }

  /**
   * Renders annotation appearance.
   */
  void renderAnnotationAppearance(@Nullable RnPdfViewContext context, int pageIndex, String uuid,
    ReadableMap optionsMap, Promise promise) {
    if (context == null) {
      promise.reject(RENDER_ANNOTATION_APPEARANCE_FAIL,
        "Unable to find the native view reference");
      return;
    }

    CPDFDocument document = context.document;
    RnPageCodec pageUtil = context.pageUtil;
    HashMap<String, Object> options = optionsMap != null ? optionsMap.toHashMap() : new HashMap<>();

    CThreadPoolUtils.getInstance().executeIO(() -> {
      Bitmap bitmap = null;
      try {
        if (document == null || pageIndex < 0 || pageIndex >= document.getPageCount()) {
          CThreadPoolUtils.getInstance().executeMain(() ->
            promise.reject(RENDER_ANNOTATION_APPEARANCE_FAIL, "Invalid page index: " + pageIndex));
          return;
        }
        if (TextUtils.isEmpty(uuid)) {
          CThreadPoolUtils.getInstance().executeMain(() ->
            promise.reject(RENDER_ANNOTATION_APPEARANCE_FAIL, "Annotation uuid is empty"));
          return;
        }

        CPDFAnnotation annotation = pageUtil.getAnnotation(pageIndex, uuid);
        if (annotation == null || !annotation.isValid()) {
          CThreadPoolUtils.getInstance().executeMain(() ->
            promise.reject(RENDER_ANNOTATION_APPEARANCE_FAIL, "Annotation was not found"));
          return;
        }

        RectF rect = annotation.getRect();
        if (rect == null) {
          CThreadPoolUtils.getInstance().executeMain(() ->
            promise.reject(RENDER_ANNOTATION_APPEARANCE_FAIL, "Annotation rect is empty"));
          return;
        }

        int[] renderSize = resolveAnnotationAppearanceRenderSize(rect, options);
        bitmap = Bitmap.createBitmap(renderSize[0], renderSize[1], Bitmap.Config.ARGB_8888);
        if (!annotation.getAppearanceByPixel(bitmap, CPDFAnnotation.AppearanceType.Normal)) {
          CThreadPoolUtils.getInstance().executeMain(() -> promise.reject(
            RENDER_ANNOTATION_APPEARANCE_FAIL, "Failed to render annotation appearance"));
          return;
        }

        String base64 = Base64.encodeToString(compressBitmap(bitmap, options), Base64.NO_WRAP);
        CThreadPoolUtils.getInstance().executeMain(() -> promise.resolve(base64));
      } catch (Exception e) {
        String message = e.getMessage() == null
          ? "Failed to render annotation appearance"
          : e.getMessage();
        CThreadPoolUtils.getInstance().executeMain(() ->
          promise.reject(RENDER_ANNOTATION_APPEARANCE_FAIL, message));
      } finally {
        if (bitmap != null && !bitmap.isRecycled()) {
          bitmap.recycle();
        }
      }
    });
  }

  /**
   * Returns compress bitmap.
   */
  private byte[] compressBitmap(Bitmap bitmap, HashMap<String, Object> options) {
    String compression = getStringOption(options, "compression", "png");
    int quality = getIntOption(options, "quality", 100);
    Bitmap.CompressFormat format = "jpeg".equals(compression)
      ? Bitmap.CompressFormat.JPEG
      : Bitmap.CompressFormat.PNG;
    int compressedQuality = format == Bitmap.CompressFormat.JPEG ? quality : 100;
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    bitmap.compress(format, compressedQuality, outputStream);
    return outputStream.toByteArray();
  }

  /**
   * Resolves annotation appearance render size.
   */
  private int[] resolveAnnotationAppearanceRenderSize(RectF rect, HashMap<String, Object> options) {
    int baseWidth = Math.max(1, Math.round(Math.abs(rect.width())));
    int baseHeight = Math.max(1, Math.round(Math.abs(rect.height())));
    int targetWidth = getIntOption(options, "target_width", 0);
    int targetHeight = getIntOption(options, "target_height", 0);
    double scale = getDoubleOption(options, "scale", 3.0);

    if (targetWidth > 0 && targetHeight > 0) {
      return new int[]{targetWidth, targetHeight};
    }
    if (targetWidth > 0) {
      int resolvedHeight = Math.max(1, Math.round(targetWidth * (baseHeight / (float) baseWidth)));
      return new int[]{targetWidth, resolvedHeight};
    }
    if (targetHeight > 0) {
      int resolvedWidth = Math.max(1, Math.round(targetHeight * (baseWidth / (float) baseHeight)));
      return new int[]{resolvedWidth, targetHeight};
    }

    int scaledWidth = Math.max(1, (int) Math.round(baseWidth * scale));
    int scaledHeight = Math.max(1, (int) Math.round(baseHeight * scale));
    return new int[]{scaledWidth, scaledHeight};
  }

  /**
   * Returns the int option.
   */
  private int getIntOption(HashMap<String, Object> options, String key, int defaultValue) {
    if (options == null) {
      return defaultValue;
    }
    Object value = options.get(key);
    if (value instanceof Number) {
      return ((Number) value).intValue();
    }
    return defaultValue;
  }

  /**
   * Returns the double option.
   */
  private double getDoubleOption(HashMap<String, Object> options, String key, double defaultValue) {
    if (options == null) {
      return defaultValue;
    }
    Object value = options.get(key);
    if (value instanceof Number) {
      return ((Number) value).doubleValue();
    }
    return defaultValue;
  }

  /**
   * Returns the string option.
   */
  private String getStringOption(HashMap<String, Object> options, String key,
    String defaultValue) {
    if (options == null) {
      return defaultValue;
    }
    Object value = options.get(key);
    if (value instanceof String && !TextUtils.isEmpty((String) value)) {
      return (String) value;
    }
    return defaultValue;
  }
}
