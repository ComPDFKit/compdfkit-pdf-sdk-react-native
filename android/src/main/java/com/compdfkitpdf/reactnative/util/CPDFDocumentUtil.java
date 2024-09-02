package com.compdfkitpdf.reactnative.util;

import android.content.Context;
import com.compdfkit.tools.common.utils.CFileUtils;

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
}
