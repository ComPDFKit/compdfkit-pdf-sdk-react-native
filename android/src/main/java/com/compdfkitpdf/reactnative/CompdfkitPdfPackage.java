/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

package com.compdfkitpdf.reactnative;

import androidx.annotation.NonNull;
import com.compdfkitpdf.reactnative.modules.CPDFViewModule;
import com.compdfkitpdf.reactnative.viewmanager.CPDFViewManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.Arrays;
import java.util.List;

public class CompdfkitPdfPackage implements ReactPackage {

  private CPDFViewManager mPDFViewManager;

  @NonNull
  @Override
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
    if (null == mPDFViewManager){
      mPDFViewManager = new CPDFViewManager(reactContext);
    }
    return Arrays.<NativeModule>asList(
      new CompdfkitPdfModule(reactContext),
      new CPDFViewModule(reactContext, mPDFViewManager)
    );
  }

  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    if (null == mPDFViewManager){
      mPDFViewManager = new CPDFViewManager(reactContext);
    }
    return Arrays.<ViewManager>asList(mPDFViewManager);
  }
}
