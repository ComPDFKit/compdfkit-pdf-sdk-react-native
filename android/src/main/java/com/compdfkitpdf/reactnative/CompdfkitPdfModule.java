/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

package com.compdfkitpdf.reactnative;

import static com.compdfkitpdf.reactnative.util.CPDFDocumentUtil.ASSETS_SCHEME;
import static com.compdfkitpdf.reactnative.util.CPDFDocumentUtil.CONTENT_SCHEME;
import static com.compdfkitpdf.reactnative.util.CPDFDocumentUtil.FILE_SCHEME;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.text.TextUtils;
import android.util.Log;

import androidx.annotation.NonNull;

import com.compdfkit.core.document.CPDFSdk;
import com.compdfkit.tools.common.pdf.CPDFConfigurationUtils;
import com.compdfkit.tools.common.pdf.CPDFDocumentActivity;
import com.compdfkit.tools.common.pdf.config.CPDFConfiguration;
import com.compdfkit.tools.common.utils.CFileUtils;
import com.compdfkit.tools.common.utils.CLog;
import com.compdfkit.tools.common.utils.CUriUtil;
import com.compdfkit.tools.common.utils.viewutils.CViewUtils;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.io.File;

/**
 * RN and Android native ComPDFKit SDK interaction class
 *
 */
public class CompdfkitPdfModule extends ReactContextBaseJavaModule {

  private static final String TAG = "ComPDFKitRN";

  public static final String NAME = "ComPDFKit";

  public static final int PICK_PDF_FILE_REQUEST_CODE = 90;

  private Promise promise;

  private ReactContext mReactContext;

  public CompdfkitPdfModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.mReactContext = reactContext;
    this.mReactContext.addActivityEventListener(activityEventListener);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  /**
   * Get the version number of the ComPDFKit SDK.<br/>
   * For example: "2.0.0".<br/>
   * <p></p>
   * Usage example:<br/><br/>
   * <pre>
   * ComPDFKit.getVersionCode().then((versionCode : string) => {
   *   console.log('ComPDFKit SDK Version:', versionCode)
   * })
   * </pre>
   *
   */
  @ReactMethod
  public void getVersionCode(final Promise promise) {
    promise.resolve(CPDFSdk.getSDKVersion());
  }

  /**
   * Get the build tag of the ComPDFKit PDF SDK.<br/>
   * For example: "build_beta_2.0.0_42db96987_202404081007"<br/>
   * <p></p>
   *
   * Usage example:<br/>
   * <pre>
   * ComPDFKit.getSDKBuildTag().then((buildTag : string) => {
   *   console.log('ComPDFKit Build Tag:', buildTag)
   * })
   * </pre>
   *
   */
  @ReactMethod
  public void getSDKBuildTag(final Promise promise) {
    promise.resolve(CPDFSdk.getSDKBuildTag());
  }

  /**
   * Initialize the ComPDFKit PDF SDK using offline authentication.<br/>
   * <p></p>
   * Usage example:<br/>
   * <pre>
   * ComPDFKit.init_('license')
   * </pre>
   *
   * @param license The offline license.
   */
  @ReactMethod
  public void init_(String license, Promise promise) {
    CPDFSdk.init(mReactContext, license, true, (code, msg) -> {
      Log.d(TAG, "init_: code:" + code + ", msg:" + msg);
      promise.resolve(code == CPDFSdk.VERIFY_SUCCESS);
    });
  }


  /**
   * Initialize the ComPDFKit PDF SDK using online authentication. <br/>
   * Requires internet connection. Please ensure that the network permission has been added in [AndroidManifest.xml] file. <br/>
   * {@link android.Manifest.permission#INTERNET} <br/>
   * <p></p>
   * Usage example:
   * <pre>
   *   ComPDFKit.initialize(androidLicense, iosLicense)
   * </pre>
   *
   * @param androidOnlineLicense The online license for the ComPDFKit SDK on Android platform.
   * @param iosOnlineLicense     The online license for the ComPDFKit SDK on iOS platform.
   */
  @ReactMethod
  public void initialize(String androidOnlineLicense, String iosOnlineLicense, Promise promise) {
    CPDFSdk.init(mReactContext, androidOnlineLicense, false, (code, msg) -> {
      Log.d(TAG, "initialize: code:" + code + ", msg:" + msg);
      promise.resolve(code == CPDFSdk.VERIFY_SUCCESS);
    });
  }


  /**
   * Display a PDF.<br/>
   *
   * Usage example:<br/>
   * <pre>
   *   ComPDFKit.openDocument(document, password, configurationJson)
   * </pre>
   *
   * (Android) For local storage file path: <br/>
   * <pre>
   *   document = "file:///storage/emulated/0/Download/sample.pdf";<br/>
   * </pre>
   *
   * (Android) For content Uri: <br/>
   * <pre>
   *   document = "content://...";
   * </pre>
   *
   * (Android) For assets path: <br/>
   * <pre>
   *   document = "file:///android_asset/..."
   * </pre>
   *
   * @param document          The document URI or file path.
   * @param password          The document password.
   * @param configurationJson Configuration data in JSON format.
   */
  @ReactMethod
  public void openDocument(String document, String password, String configurationJson) {
    Intent intent = new Intent(mReactContext, CPDFDocumentActivity.class);
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    parseDocument(document, intent);
    intent.putExtra(CPDFDocumentActivity.EXTRA_FILE_PASSWORD, password);
    CPDFConfiguration configuration = CPDFConfigurationUtils.fromJson(configurationJson);
    intent.putExtra(CPDFDocumentActivity.EXTRA_CONFIGURATION, configuration);
    mReactContext.startActivity(intent);
  }


  private void parseDocument(String document, Intent intent) {
    if (document.startsWith(ASSETS_SCHEME)) {
      String assetsPath = document.replace(ASSETS_SCHEME + "/","");
      String[] strs = document.split("/");
      String fileName = strs[strs.length -1];
      String samplePDFPath = CFileUtils.getAssetsTempFile(mReactContext, assetsPath, fileName);
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

  /**
   * Delete the saved signature file from the annotation signature list.
   * @param promise
   */
  @ReactMethod
  public void removeSignFileList(Promise promise){
    File dirFile = new File(mReactContext.getFilesDir(), CFileUtils.SIGNATURE_FOLDER);
    boolean deleteResult = CFileUtils.deleteDirectory(dirFile.getAbsolutePath());
    promise.resolve(deleteResult);
  }

  @ReactMethod
  public void pickFile(Promise promise){
    this.promise = promise;
    Activity activity = getCurrentActivity();
    if (activity != null) {
      activity.startActivityForResult(CFileUtils.getContentIntent(), PICK_PDF_FILE_REQUEST_CODE);
    }else {
      this.promise.reject(new Throwable("activity is null"));
    }
  }

  @ReactMethod
  public void createUri(String fileName , String childDirectoryName, String mimeType, Promise promise){
    String dir = Environment.DIRECTORY_DOWNLOADS ;
    if (!TextUtils.isEmpty(childDirectoryName)){
      dir += File.separator + childDirectoryName;
    }
    Uri uri = CUriUtil.createFileUri(mReactContext,
      dir,
      fileName, mimeType);
    if (uri != null){
      promise.resolve(uri.toString());
    }else {
      promise.reject("CREATE_URI_FAIL", "create uri fail");
    }
  }

  @ReactMethod
  public void setImportFontDir(String dir, boolean addSysFont,Promise promise){
    CPDFSdk.setImportFontDir(dir, addSysFont);
    promise.resolve(true);
  }

  @Override
  public void invalidate() {
    getReactApplicationContext().removeActivityEventListener(activityEventListener);
    super.invalidate();
  }

  private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
      boolean isForeignResult = requestCode != PICK_PDF_FILE_REQUEST_CODE;
      if (isForeignResult) {
        return;
      }
      final Promise storedPromise = promise;
      if (storedPromise == null) {
        Log.e(NAME, "promise was null in onActivityResult");
        return;
      }
      if (resultCode == Activity.RESULT_CANCELED) {
        storedPromise.reject("PICK_FILE_CANCEL","User canceled directory picker" );
        return;
      }
      if (requestCode == PICK_PDF_FILE_REQUEST_CODE) {
        Uri uri = data.getData();
        if (uri != null) {
          storedPromise.resolve(uri.toString());
        }else {
          storedPromise.reject("PICK_FILE_URI_IS_NULL", "uri is null");
        }
      }
    }
  };
}
