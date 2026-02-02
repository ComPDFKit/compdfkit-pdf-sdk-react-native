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
import com.compdfkit.tools.common.pdf.CPDFDocumentActivity;
import com.compdfkit.tools.common.utils.CUriUtil;
import java.io.File;


public class CFileUtils {

    public static final String ASSETS_SCHEME = "file:///android_asset";

    public static final String CONTENT_SCHEME = "content://";
    public static final String FILE_SCHEME = "file://";

    public static void parseDocument(Context context, String document, Intent intent) {
        if (document.startsWith(ASSETS_SCHEME)) {
            String assetsPath = document.replace(ASSETS_SCHEME + "/", "");
            String[] strs = document.split("/");
            String fileName = strs[strs.length - 1];
            String samplePDFPath = com.compdfkit.tools.common.utils.CFileUtils.getAssetsTempFile(context, assetsPath, fileName);
            intent.putExtra(CPDFDocumentActivity.EXTRA_FILE_PATH, samplePDFPath);
        } else if (document.startsWith(CONTENT_SCHEME)) {
            Uri uri = Uri.parse(document);
            intent.setData(uri);
        } else if (document.startsWith(FILE_SCHEME)) {
            Uri uri = Uri.parse(document);
            intent.setData(uri);
        } else {
            intent.putExtra(CPDFDocumentActivity.EXTRA_FILE_PATH, document);
        }
    }

    public static String getImportFilePath(Context context, String xfdf) {
        if (xfdf.startsWith(ASSETS_SCHEME)) {
            String assetsPath = xfdf.replace(ASSETS_SCHEME + "/", "");
            String[] strs = xfdf.split("/");
            String fileName = strs[strs.length - 1];
            return com.compdfkit.tools.common.utils.CFileUtils.getAssetsTempFile(context, assetsPath, fileName);
        } else if (xfdf.startsWith(CONTENT_SCHEME)) {
            Uri uri = Uri.parse(xfdf);
            String fileName = CUriUtil.getUriFileName(context, uri);
            String dir = new File(context.getCacheDir(),
                com.compdfkit.tools.common.utils.CFileUtils.CACHE_FOLDER + File.separator + "xfdfFile").getAbsolutePath();
            // Get the saved file path
            return com.compdfkit.tools.common.utils.CFileUtils.copyFileToInternalDirectory(context, uri, dir, fileName);
        } else if (xfdf.startsWith(FILE_SCHEME)) {
            return xfdf;
        } else {
            return xfdf;
        }
    }

  public static String parseFilePath(Context context, String filePath) {
    if (filePath.startsWith(ASSETS_SCHEME)) {
      String assetsPath = filePath.replace(ASSETS_SCHEME + "/", "");
      String[] strs = filePath.split("/");
      String fileName = strs[strs.length - 1];
      return com.compdfkit.tools.common.utils.CFileUtils.getAssetsTempFile(context, assetsPath, fileName);
    } else if (filePath.startsWith(CONTENT_SCHEME)) {
      Uri uri = Uri.parse(filePath);
      String fileName = CUriUtil.getUriFileName(context, uri);
      String dir = new File(context.getCacheDir(),
        com.compdfkit.tools.common.utils.CFileUtils.CACHE_FOLDER + File.separator + "tempFile").getAbsolutePath();
      // Get the saved file path
      return com.compdfkit.tools.common.utils.CFileUtils.copyFileToInternalDirectory(context, uri, dir, fileName);
    } else if (filePath.startsWith(FILE_SCHEME)) {
      Uri uri = Uri.parse(filePath);
      return uri.getPath();
    } else {
      return filePath;
    }
  }

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
            Log.e("CPDFEditAreaUtil", "Error copying asset file", e);
            return null;
        }
    }

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
            Log.e("CPDFEditAreaUtil", "Error processing Uri", e);
            return null;
        }
    }


}
