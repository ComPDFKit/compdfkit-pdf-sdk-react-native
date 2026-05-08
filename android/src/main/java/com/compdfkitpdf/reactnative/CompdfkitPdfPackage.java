/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

package com.compdfkitpdf.reactnative;

import androidx.annotation.NonNull;
import com.compdfkitpdf.reactnative.modules.RnPdfModule;
import com.compdfkitpdf.reactnative.modules.RnPdfViewModule;
import com.compdfkitpdf.reactnative.viewer.RnPdfViewManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.Arrays;
import java.util.List;

/**
 * Registers the native modules and view managers exposed by the ComPDFKit React Native package.
 */
public class CompdfkitPdfPackage implements ReactPackage {

  private RnPdfViewManager mPDFViewManager;

  /**
   * Creates the native modules exposed by this package.
   */
  @NonNull
  @Override
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
    if (null == mPDFViewManager){
      mPDFViewManager = new RnPdfViewManager(reactContext);
    }
    return Arrays.<NativeModule>asList(
      new RnPdfModule(reactContext),
      new RnPdfViewModule(reactContext, mPDFViewManager)
    );
  }

  /**
   * Creates the view managers exposed by this package.
   */
  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    if (null == mPDFViewManager){
      mPDFViewManager = new RnPdfViewManager(reactContext);
    }
    return Arrays.<ViewManager>asList(mPDFViewManager);
  }
}
