package com.compdfkitpdf.reactnative.util;

import android.content.Intent;
import android.content.Context;
import android.net.Uri;
import android.text.TextUtils;
import com.compdfkit.tools.common.pdf.CPDFDocumentActivity;
import com.compdfkit.tools.common.utils.CFileUtils;
import com.compdfkit.tools.common.utils.CUriUtil;
import java.io.File;

/**
 * Provides document source resolution helpers for the Android React Native bridge layer.
 */
public class RnDocumentSourceResolver {

  public static final String ASSETS_SCHEME = "file:///android_asset";

  public static final String CONTENT_SCHEME = "content://";
  public static final String FILE_SCHEME = "file://";

  /**
   * Resolves an asset source into a readable local document path.
   */
  public static String getAssetsDocument(Context context, String document) {
    return resolveAssetSource(context, document);
  }

  /**
   * Returns whether the source points to an Android asset.
   */
  public static boolean isAssetsSource(String source) {
    return !TextUtils.isEmpty(source) && source.startsWith(ASSETS_SCHEME);
  }

  /**
   * Returns whether the source points to a content URI.
   */
  public static boolean isContentSource(String source) {
    return !TextUtils.isEmpty(source) && source.startsWith(CONTENT_SCHEME);
  }

  /**
   * Returns whether the source points to a file URI.
   */
  public static boolean isFileSource(String source) {
    return !TextUtils.isEmpty(source) && source.startsWith(FILE_SCHEME);
  }

  /**
   * Returns whether the source should be handled as a URI.
   */
  public static boolean isUriSource(String source) {
    return isContentSource(source) || isFileSource(source);
  }

  /**
   * Parses the source string into a URI.
   */
  public static Uri parseUri(String source) {
    return Uri.parse(source);
  }

  /**
   * Resolves the input source used to open a document.
   */
  public static String resolveOpenDocumentSource(Context context, String source) {
    if (isAssetsSource(source)) {
      return resolveAssetSource(context, source);
    }
    return source;
  }

  /**
   * Applies the resolved document source to the launch intent.
   */
  public static void applyOpenDocumentToIntent(Context context, String source, Intent intent) {
    String resolvedSource = resolveOpenDocumentSource(context, source);
    if (isUriSource(resolvedSource)) {
      intent.setData(parseUri(resolvedSource));
    } else {
      intent.putExtra(CPDFDocumentActivity.EXTRA_FILE_PATH, resolvedSource);
    }
  }

  /**
   * Resolves the source to a local file path.
   */
  public static String resolveToFilePath(Context context, String source) {
    return resolveToFilePath(context, source, "tempFile");
  }

  /**
   * Resolves the source to a local file path.
   */
  public static String resolveToFilePath(Context context, String source, String cacheSubDirectory) {
    if (isAssetsSource(source)) {
      return resolveAssetSource(context, source);
    }
    if (isContentSource(source)) {
      Uri uri = parseUri(source);
      String fileName = CUriUtil.getUriFileName(context, uri);
      String dir = new File(context.getCacheDir(),
        CFileUtils.CACHE_FOLDER + File.separator + cacheSubDirectory).getAbsolutePath();
      return CFileUtils.copyFileToInternalDirectory(context, uri, dir, fileName);
    }
    if (isFileSource(source)) {
      return parseUri(source).getPath();
    }
    return source;
  }

  /**
   * Returns the local file path used for imported files.
   */
  public static String getImportFilePath(Context context, String pathOrUri) {
    return resolveToFilePath(context, pathOrUri, "xfdfFile");
  }

  /**
   * Resolves asset source.
   */
  private static String resolveAssetSource(Context context, String source) {
    String assetsPath = source.replace(ASSETS_SCHEME + "/", "");
    return CFileUtils.getAssetsTempFile(context, assetsPath, getSourceFileName(source));
  }

  /**
   * Returns the source file name.
   */
  private static String getSourceFileName(String source) {
    String[] parts = source.split("/");
    return parts[parts.length - 1];
  }

}
