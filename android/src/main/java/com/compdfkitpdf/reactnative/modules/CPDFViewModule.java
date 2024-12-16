/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.modules;

import android.text.TextUtils;
import android.util.Log;
import androidx.annotation.NonNull;
import com.compdfkitpdf.reactnative.viewmanager.CPDFViewManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;


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

  @ReactMethod
  public void setMargins(int tag, ReadableArray margins) {
    UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
    if (uiManager != null) {
      uiManager.addUIBlock(nativeViewHierarchyManager -> {
          int left = margins.getInt(0);
          int top = margins.getInt(1);
          int right = margins.getInt(2);
          int bottom = margins.getInt(3);
          mPDFViewInstance.setMargins(tag, left, top, right, bottom);
      });
    }
  }

  @ReactMethod
  public void removeAllAnnotations(int tag, final Promise promise) {
    uiBlock(nativeViewHierarchyManager -> {
      boolean result = mPDFViewInstance.removeAllAnnotations(tag);
      promise.resolve(result);
    });
  }

  @ReactMethod
  public void importAnnotations(int tag, String xfdfFile, final Promise promise) {
    uiBlock(nativeViewHierarchyManager -> {
      try {
        boolean result = mPDFViewInstance.importAnnotations(tag, xfdfFile);
        promise.resolve(result);
      } catch (Exception e) {
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void exportAnnotations(int tag, final Promise promise) {
    uiBlock(nativeViewHierarchyManager -> {
      try {
        String result = mPDFViewInstance.exportAnnotations(tag);
        if (!TextUtils.isEmpty(result)){
          promise.resolve(result);
        }else {
          promise.reject(new Throwable("Export annotations failed."));
        }
      }catch (Exception e){
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void setDisplayPageIndex(int tag, int pageIndex){
    uiBlock(nativeViewHierarchyManager -> {
      mPDFViewInstance.setDisplayPageIndex(tag, pageIndex);
    });
  }

  @ReactMethod
  public void getCurrentPageIndex(int tag, Promise promise){
    uiBlock(nativeViewHierarchyManager -> {
      promise.resolve(mPDFViewInstance.getCurrentPageIndex(tag));
    });
  }

  @ReactMethod
  public void hasChange(int tag, Promise promise){
    uiBlock(nativeViewHierarchyManager -> {
      promise.resolve(mPDFViewInstance.hasChange(tag));
    });
  }

  private void uiBlock(UIBlock uiBlock){
    UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
    if (uiManager != null) {
      uiManager.addUIBlock(uiBlock);
    }
  }

}
