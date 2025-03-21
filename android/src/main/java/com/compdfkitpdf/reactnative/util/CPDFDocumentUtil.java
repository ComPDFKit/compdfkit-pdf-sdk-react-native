package com.compdfkitpdf.reactnative.util;

import android.content.Context;
import android.net.Uri;
import com.compdfkit.tools.common.utils.CFileUtils;
import com.compdfkit.tools.common.utils.CUriUtil;
import java.io.File;

public class CPDFDocumentUtil {

  public static final String ASSETS_SCHEME = "file:///android_asset";

  public static final String CONTENT_SCHEME = "content://";
  public static final String FILE_SCHEME = "file://";

  public static String getAssetsDocument(Context context, String document) {
      String assetsPath = document.replace(ASSETS_SCHEME + "/","");
      String[] strs = document.split("/");
      String fileName = strs[strs.length -1];
      return CFileUtils.getAssetsTempFile(context, assetsPath, fileName);
  }

  public static String getImportFilePath(Context context, String pathOrUri) {
    if (pathOrUri.startsWith(ASSETS_SCHEME)) {
      String assetsPath = pathOrUri.replace(ASSETS_SCHEME + "/","");
      String[] strs = pathOrUri.split("/");
      String fileName = strs[strs.length -1];
      return CFileUtils.getAssetsTempFile(context, assetsPath, fileName);
    } else if (pathOrUri.startsWith(CONTENT_SCHEME)) {
      Uri uri = Uri.parse(pathOrUri);
      String fileName = CUriUtil.getUriFileName(context, uri);
      String dir = new File(context.getCacheDir(), CFileUtils.CACHE_FOLDER + File.separator + "xfdfFile").getAbsolutePath();
      // Get the saved file path
      return CFileUtils.copyFileToInternalDirectory(context, uri, dir, fileName);
    } else if (pathOrUri.startsWith(FILE_SCHEME)) {
      Uri uri = Uri.parse(pathOrUri);
      return uri.getPath();
    } else {
      return pathOrUri;
    }
  }

}
