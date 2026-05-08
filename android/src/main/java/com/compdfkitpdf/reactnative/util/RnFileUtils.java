/*
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 *
 */

package com.compdfkitpdf.reactnative.util;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import androidx.annotation.Nullable;
import java.io.File;


/**
 * Provides file-related helpers used by the Android React Native bridge layer.
 */
public class RnFileUtils {

    public static final String ASSETS_SCHEME = RnDocumentSourceResolver.ASSETS_SCHEME;

    public static final String CONTENT_SCHEME = RnDocumentSourceResolver.CONTENT_SCHEME;
    public static final String FILE_SCHEME = RnDocumentSourceResolver.FILE_SCHEME;

    /**
     * Parses document.
     */
    public static void parseDocument(Context context, String document, Intent intent) {
        RnDocumentSourceResolver.applyOpenDocumentToIntent(context, document, intent);
    }

    /**
     * Returns the local file path used for imported files.
     */
    public static String getImportFilePath(Context context, String xfdf) {
        return RnDocumentSourceResolver.getImportFilePath(context, xfdf);
    }

  /**
   * Parses file path.
   */
  public static String parseFilePath(Context context, String filePath) {
    return RnDocumentSourceResolver.resolveToFilePath(context, filePath);
  }

    /**
     * Returns base64 to temp file.
     */
    public static @Nullable String base64ToTempFile(Context context, String base64Data) {
        try {
            byte[] imageBytes = android.util.Base64.decode(base64Data, android.util.Base64.DEFAULT);

            File tempDir = new File(context.getCacheDir(), "pdf_images");
            if (!tempDir.exists()) {
                tempDir.mkdirs();
            }

            File tempFile = new File(tempDir, "image_" + System.currentTimeMillis() + ".png");

            java.io.FileOutputStream fos = new java.io.FileOutputStream(tempFile);
            fos.write(imageBytes);
            fos.close();

            return tempFile.getAbsolutePath();
        } catch (Exception e) {
            Log.e("FileUtils", "Error decoding base64 image", e);
            return null;
        }
    }

    /**
     * Returns asset to temp file.
     */
    public static @Nullable String assetToTempFile(Context context, String assetPath) {
        try {

            File tempDir = new File(context.getCacheDir(), "pdf_images");
            if (!tempDir.exists()) {
                tempDir.mkdirs();
            }

            String fileName = assetPath.substring(assetPath.lastIndexOf('/') + 1);
            File tempFile = new File(tempDir, fileName);

            com.compdfkit.tools.common.utils.CFileUtils.copyFileFromAssets(context, assetPath, tempDir.getAbsolutePath(), fileName,
                true);

            if (tempFile.exists()) {
                return tempFile.getAbsolutePath();
            } else {
                return null;
            }
        } catch (Exception e) {
            Log.e("RnEditAreaMapper", "Error copying asset file", e);
            return null;
        }
    }

    /**
     * Returns uri to file path.
     */
    public static @Nullable String uriToFilePath(Context context, String uriString) {
        try {
            Uri uri = Uri.parse(uriString);

            if ("file".equals(uri.getScheme())) {
                return uri.getPath();
            }

            java.io.InputStream is = context.getContentResolver().openInputStream(uri);
            if (is == null) {
                return null;
            }

            File tempDir = new File(context.getCacheDir(), "pdf_images");
            if (!tempDir.exists()) {
                tempDir.mkdirs();
            }

            File tempFile = new File(tempDir, "image_" + System.currentTimeMillis() + ".jpg");

            java.io.FileOutputStream fos = new java.io.FileOutputStream(tempFile);
            byte[] buffer = new byte[1024];
            int length;
            while ((length = is.read(buffer)) > 0) {
                fos.write(buffer, 0, length);
            }

            fos.close();
            is.close();

            return tempFile.getAbsolutePath();
        } catch (Exception e) {
            Log.e("RnEditAreaMapper", "Error processing Uri", e);
            return null;
        }
    }


}
