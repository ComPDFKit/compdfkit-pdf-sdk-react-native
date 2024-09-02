/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.modules;

import android.util.Log;
import androidx.annotation.NonNull;
import com.compdfkitpdf.reactnative.viewmanager.CPDFViewManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


public class CPDFViewModule extends ReactContextBaseJavaModule {
  private static final String TAG = "ComPDFKitRN";

  public static final String REACT_CLASS = "CPDFViewManager";

  private CPDFViewManager mPDFViewInstance;

  public CPDFViewModule(ReactApplicationContext reactApplicationContext, CPDFViewManager viewManager){
    super(reactApplicationContext);
    mPDFViewInstance = viewManager;
  }

  @NonNull
  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @ReactMethod
  public void save(final int tag, final Promise promise){
    Log.d(TAG, "save(tag:" + tag + ")---->");
    getReactApplicationContext().runOnUiQueueThread(()->{
      try{
        mPDFViewInstance.save(tag, (s, uri) -> {
          Log.d(TAG, "save()- save success");
          promise.resolve(true);
        }, e -> {
          Log.d(TAG, "save()- save fail");
          promise.resolve(false);
        });
      }catch (Exception e){
        promise.resolve(false);
      }
    });
  }
}
