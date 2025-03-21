/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved. THIS SOURCE CODE AND ANY
 * ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW AND MAY NOT BE RESOLD OR
 * REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT. UNAUTHORIZED REPRODUCTION OR
 * DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice may not be removed from this
 * file.
 */

package com.compdfkitpdf.reactnative.modules;

import android.text.TextUtils;
import android.util.Log;
import androidx.annotation.NonNull;
import com.compdfkit.tools.common.utils.threadpools.CThreadPoolUtils;
import com.compdfkitpdf.reactnative.viewmanager.CPDFViewManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;


public class CPDFViewModule extends ReactContextBaseJavaModule {

  private static final String TAG = "ComPDFKitRN";

  public static final String REACT_CLASS = "CPDFViewManager";

  private CPDFViewManager mPDFViewInstance;

  public CPDFViewModule(ReactApplicationContext reactApplicationContext,
    CPDFViewManager viewManager) {
    super(reactApplicationContext);
    mPDFViewInstance = viewManager;
  }

  @NonNull
  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @ReactMethod
  public void save(final int tag, final Promise promise) {
    Log.d(TAG, "save(tag:" + tag + ")---->");
    getReactApplicationContext().runOnUiQueueThread(() -> {
      try {
        mPDFViewInstance.save(tag, (s, uri) -> {
          Log.d(TAG, "save()- save success");
          promise.resolve(true);
        }, e -> {
          Log.d(TAG, "save()- save fail");
          promise.resolve(false);
        });
      } catch (Exception e) {
        promise.resolve(false);
      }
    });
  }

  @Deprecated
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
        if (!TextUtils.isEmpty(result)) {
          promise.resolve(result);
        } else {
          promise.reject(new Throwable("Export annotations failed."));
        }
      } catch (Exception e) {
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void setDisplayPageIndex(int tag, int pageIndex) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.setDisplayPageIndex(tag, pageIndex));
  }

  @ReactMethod
  public void getCurrentPageIndex(int tag, Promise promise) {
    uiBlock(
      nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.getCurrentPageIndex(tag)));
  }

  @ReactMethod
  public void hasChange(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.hasChange(tag)));
  }

  @ReactMethod
  public void setScale(int tag, float scale) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.setScale(tag, scale));
  }

  @ReactMethod
  public void getScale(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.getScale(tag)));
  }

  @ReactMethod
  public void setCanScale(int tag, boolean canScale) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.setCanScale(tag, canScale));
  }

  @ReactMethod
  public void setReadBackgroundColor(int tag, ReadableMap array) {
    uiBlock(nativeViewHierarchyManager -> {
      String color = array.getString("color");
      mPDFViewInstance.setReadBackgroundColor(tag, color);
    });
  }

  @ReactMethod
  public void getReadBackgroundColor(int tag, Promise promise) {
    uiBlock(
      nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.getReadBackgroundColor(tag)));
  }

  @ReactMethod
  public void setFormFieldHighlight(int tag, boolean isFormFieldHighlight) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.setFormFieldHighlight(tag,
      isFormFieldHighlight));
  }

  @ReactMethod
  public void isFormFieldHighlight(int tag, Promise promise) {
    uiBlock(
      nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.isFormFieldHighlight(tag)));
  }

  @ReactMethod
  public void setLinkHighlight(int tag, boolean isLinkHighlight) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.setLinkHighlight(tag, isLinkHighlight));
  }

  @ReactMethod
  public void isLinkHighlight(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.isLinkHighlight(tag)));
  }

  @ReactMethod
  public void setVerticalMode(int tag, boolean isVerticalMode) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.setVerticalMode(tag, isVerticalMode));
  }

  @ReactMethod
  public void isVerticalMode(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.isVerticalMode(tag)));
  }

  @ReactMethod
  public void setPageSpacing(int tag, int pageSpacing) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.setPageSpacing(tag, pageSpacing));
  }

  @ReactMethod
  public void setContinueMode(int tag, boolean isContinueMode) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.setContinueMode(tag, isContinueMode));
  }

  @ReactMethod
  public void isContinueMode(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.isContinueMode(tag)));
  }

  @ReactMethod
  public void setDoublePageMode(int tag, boolean isDoublePageMode) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.setDoublePageMode(tag, isDoublePageMode));
  }

  @ReactMethod
  public void isDoublePageMode(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.isDoublePageMode(tag)));
  }

  @ReactMethod
  public void setCoverPageMode(int tag, boolean coverPageMode) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.setCoverPageMode(tag, coverPageMode));
  }

  @ReactMethod
  public void isCoverPageMode(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.isCoverPageMode(tag)));
  }

  @ReactMethod
  public void setCropMode(int tag, boolean isCropMode) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.setCropMode(tag, isCropMode));
  }

  @ReactMethod
  public void isCropMode(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.isCropMode(tag)));
  }

  @ReactMethod
  public void setPageSameWidth(int tag, boolean isSame) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.setPageSameWidth(tag, isSame));
  }

  @ReactMethod
  public void isPageInScreen(int tag, int pageIndex, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.isPageInScreen(tag, pageIndex)));
  }

  @ReactMethod
  public void setFixedScroll(int tag, boolean isFixedScroll) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.setFixedScroll(tag, isFixedScroll));
  }

  @ReactMethod
  public void setPreviewMode(int tag, String previewMode) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.setPreviewMode(tag, previewMode));
  }

  @ReactMethod
  public void getPreviewMode(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.getPreviewMode(tag).alias));
  }

  @ReactMethod
  public void showThumbnailView(int tag, boolean editMode) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.showThumbnailView(tag, editMode));
  }

  @ReactMethod
  public void showBotaView(int tag) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.showBotaView(tag));
  }

  @ReactMethod
  public void showAddWatermarkView(int tag, boolean saveAsNewFile) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.showAddWatermarkView(tag, saveAsNewFile));
  }

  @ReactMethod
  public void showSecurityView(int tag) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.showSecurityView(tag));
  }

  @ReactMethod
  public void showDisplaySettingView(int tag) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.showDisplaySettingView(tag));
  }

  @ReactMethod
  public void enterSnipMode(int tag) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.enterSnipMode(tag));
  }

  @ReactMethod
  public void exitSnipMode(int tag) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.exitSnipMode(tag));
  }

  @ReactMethod
  public void open(int tag, String filePath, String password, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.open(tag, filePath, password, promise));
  }

  @ReactMethod
  public void getFileName(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.getFileName(tag)));
  }

  @ReactMethod
  public void isEncrypted(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.isEncrypted(tag)));
  }

  @ReactMethod
  public void isImageDoc(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.isImageDoc(tag)));
  }

  @ReactMethod
  public void getPermissions(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.getPermissions(tag).id));
  }

  @ReactMethod
  public void checkOwnerUnlocked(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.checkOwnerUnlocked(tag)));
  }

  @ReactMethod
  public void checkOwnerPassword(int tag, String password, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.checkOwnerPassword(tag, password)));
  }

  @ReactMethod
  public void getPageCount(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.getPageCount(tag)));
  }

  @ReactMethod
  public void saveAs(int tag, String savePath, boolean removeSecurity, boolean fontSubset, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> {
      mPDFViewInstance.saveAs(tag, savePath, removeSecurity, fontSubset, promise);
    });
  }

  @ReactMethod
  public void printDocument(int tag) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.print(tag));
  }

  @ReactMethod
  public void removePassword(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.removePassword(tag, promise));
  }

  @ReactMethod
  public void setPassword(int tag, ReadableMap array, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> {
      String userPassword = array.getString("user_password");
      String ownerPassword = array.getString("owner_password");
      boolean allowsPrinting = array.getBoolean("allows_printing");
      boolean allowsCopying = array.getBoolean("allows_copying");
      String encryptAlgo = array.getString("encrypt_algo");
      mPDFViewInstance.setPassword(tag, userPassword, ownerPassword, allowsPrinting, allowsCopying,
        encryptAlgo, promise);
    });
  }

  @ReactMethod
  public void getEncryptAlgo(int tag, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.getEncryptAlgo(tag)));
  }

  @ReactMethod
  public void importWidgets(int tag, String xfdfFile, final Promise promise) {
    uiBlock(nativeViewHierarchyManager -> {
      try {
        boolean result = mPDFViewInstance.importWidgets(tag, xfdfFile);
        promise.resolve(result);
      } catch (Exception e) {
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void exportWidgets(int tag, final Promise promise) {
    uiBlock(nativeViewHierarchyManager -> {
      try {
        String result = mPDFViewInstance.exportWidgets(tag);
        if (!TextUtils.isEmpty(result)) {
          promise.resolve(result);
        } else {
          promise.reject(new Throwable("Export widgets failed."));
        }
      } catch (Exception e) {
        promise.reject(e);
      }
    });
  }

  @ReactMethod
  public void flattenAllPages(int tag, String savePath, boolean fontSubset, Promise promise) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.flattenAllPages(tag, savePath, fontSubset, promise));
  }

  @ReactMethod
  public void reloadPages(int tag) {
    uiBlock(nativeViewHierarchyManager -> mPDFViewInstance.reloadPages(tag));
  }

  @ReactMethod
  public void getDocumentPath(int tag, Promise promise){
    uiBlock(nativeViewHierarchyManager -> promise.resolve(mPDFViewInstance.getDocumentPath(tag)));
  }

  @ReactMethod
  public void importDocument(int tag, String filePath, ReadableMap array, Promise promise){
    uiBlock(nativeViewHierarchyManager -> {
      String password = array.getString("password");
      int insertPosition = array.getInt("insert_position");
      ReadableArray pagesArray = array.getArray("pages");
      int[] pages = new int[pagesArray.size()];
      for (int i = 0; i < pagesArray.size(); i++) {
        pages[i] = pagesArray.getInt(i);
      }
      mPDFViewInstance.importDocument(tag, filePath, password, pages, insertPosition, promise);
    });
  }

  @ReactMethod
  public void splitDocumentPages(int tag, String savePath, ReadableArray pagesArray, Promise promise){
    uiBlock(nativeViewHierarchyManager -> {
      int size = 0;
      if (pagesArray != null){
        size = pagesArray.size();
      }
      int[] pages = new int[size];
      if (size >0){
        for (int i = 0; i < size; i++) {
          pages[i] = pagesArray.getInt(i);
        }
      }
      mPDFViewInstance.splitDocumentPage(tag, savePath, pages, promise);
    });
  }

  @ReactMethod
  public void getAnnotations(int tag, int pageIndex, Promise promise){
    uiBlock(nativeViewHierarchyManager -> {
      CThreadPoolUtils.getInstance().executeIO(()->{
        promise.resolve(mPDFViewInstance.getAnnotations(tag, pageIndex));
      });
    });
  }

  @ReactMethod
  public void getForms(int tag, int pageIndex, Promise promise){
    uiBlock(nativeViewHierarchyManager -> {
      CThreadPoolUtils.getInstance().executeIO(()->{
        promise.resolve(mPDFViewInstance.getForms(tag, pageIndex));
      });
    });
  }

  @ReactMethod
  public void setTextWidgetText(int tag, int pageIndex, String uuid, String text){
    uiBlock(nativeViewHierarchyManager -> {
      mPDFViewInstance.setTextWidgetText(tag, pageIndex, uuid, text);
    });
  }

  @ReactMethod
  public void updateAp(int tag, int pageIndex, String uuid){
    uiBlock(nativeViewHierarchyManager -> {
      mPDFViewInstance.updateAp(tag, pageIndex, uuid);
    });
  }

  @ReactMethod
  public void setWidgetIsChecked(int tag, int pageIndex, String uuid, boolean isChecked){
    uiBlock(nativeViewHierarchyManager -> {
      mPDFViewInstance.setWidgetIsChecked(tag, pageIndex, uuid, isChecked);
    });
  }

  @ReactMethod
  public void addWidgetImageSignature(int tag, int pageIndex, String uuid, String imagePath, Promise promise){
    uiBlock(nativeViewHierarchyManager -> {
      promise.resolve(mPDFViewInstance.addWidgetImageSignature(tag, pageIndex, uuid, imagePath));
    });
  }

  private void uiBlock(UIBlock uiBlock) {
    UIManagerModule uiManager = getReactApplicationContext().getNativeModule(UIManagerModule.class);
    if (uiManager != null) {
      uiManager.addUIBlock(uiBlock);
    }
  }

}
