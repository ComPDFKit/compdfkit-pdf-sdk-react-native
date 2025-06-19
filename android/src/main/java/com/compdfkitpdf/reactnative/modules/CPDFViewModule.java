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

  @ReactMethod
  public void setMargins(int tag, ReadableArray margins, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      int left = margins.getInt(0);
      int top = margins.getInt(1);
      int right = margins.getInt(2);
      int bottom = margins.getInt(3);
      mPDFViewInstance.setMargins(tag, left, top, right, bottom);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void removeAllAnnotations(int tag, final Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      boolean result = mPDFViewInstance.removeAllAnnotations(tag);
      promise.resolve(result);
    });
  }

  @ReactMethod
  public void importAnnotations(int tag, String xfdfFile, final Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
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
    getReactApplicationContext().runOnUiQueueThread(() -> {
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
  public void setDisplayPageIndex(int tag, int pageIndex,Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.setDisplayPageIndex(tag, pageIndex);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void getCurrentPageIndex(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() ->
        promise.resolve(mPDFViewInstance.getCurrentPageIndex(tag)));
  }

  @ReactMethod
  public void hasChange(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() ->
      promise.resolve(mPDFViewInstance.hasChange(tag)));
  }

  @ReactMethod
  public void setScale(int tag, float scale, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() ->{
      mPDFViewInstance.setScale(tag, scale);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void getScale(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() ->
      promise.resolve(mPDFViewInstance.getScale(tag)));
  }

  @ReactMethod
  public void setCanScale(int tag, boolean canScale, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() ->{
      mPDFViewInstance.setCanScale(tag, canScale);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void setReadBackgroundColor(int tag, ReadableMap array, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() ->{
      String color = array.getString("color");
      mPDFViewInstance.setReadBackgroundColor(tag, color);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void getReadBackgroundColor(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() ->
        promise.resolve(mPDFViewInstance.getReadBackgroundColor(tag)));
  }

  @ReactMethod
  public void setFormFieldHighlight(int tag, boolean isFormFieldHighlight, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() ->{
      mPDFViewInstance.setFormFieldHighlight(tag,
        isFormFieldHighlight);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void isFormFieldHighlight(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() ->
        promise.resolve(mPDFViewInstance.isFormFieldHighlight(tag)));
  }

  @ReactMethod
  public void setLinkHighlight(int tag, boolean isLinkHighlight, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.setLinkHighlight(tag, isLinkHighlight);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void isLinkHighlight(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.isLinkHighlight(tag)));
  }

  @ReactMethod
  public void setVerticalMode(int tag, boolean isVerticalMode, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.setVerticalMode(tag, isVerticalMode);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void isVerticalMode(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.isVerticalMode(tag)));
  }

  @ReactMethod
  public void setPageSpacing(int tag, int pageSpacing, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.setPageSpacing(tag, pageSpacing);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void setContinueMode(int tag, boolean isContinueMode, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.setContinueMode(tag, isContinueMode);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void isContinueMode(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.isContinueMode(tag)));
  }

  @ReactMethod
  public void setDoublePageMode(int tag, boolean isDoublePageMode, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.setDoublePageMode(tag, isDoublePageMode);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void isDoublePageMode(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.isDoublePageMode(tag)));
  }

  @ReactMethod
  public void setCoverPageMode(int tag, boolean coverPageMode, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.setCoverPageMode(tag, coverPageMode);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void isCoverPageMode(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.isCoverPageMode(tag)));
  }

  @ReactMethod
  public void setCropMode(int tag, boolean isCropMode, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.setCropMode(tag, isCropMode);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void isCropMode(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.isCropMode(tag)));
  }

  @ReactMethod
  public void setPageSameWidth(int tag, boolean isSame, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.setPageSameWidth(tag, isSame);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void isPageInScreen(int tag, int pageIndex, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.isPageInScreen(tag, pageIndex)));
  }

  @ReactMethod
  public void setFixedScroll(int tag, boolean isFixedScroll, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.setFixedScroll(tag, isFixedScroll);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void setPreviewMode(int tag, String previewMode, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.setPreviewMode(tag, previewMode);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void getPreviewMode(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.getPreviewMode(tag).alias));
  }

  @ReactMethod
  public void showThumbnailView(int tag, boolean editMode, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.showThumbnailView(tag, editMode);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void showBotaView(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.showBotaView(tag);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void showAddWatermarkView(int tag, boolean saveAsNewFile, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.showAddWatermarkView(tag, saveAsNewFile);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void showSecurityView(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.showSecurityView(tag);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void showDisplaySettingView(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.showDisplaySettingView(tag);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void enterSnipMode(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.enterSnipMode(tag);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void exitSnipMode(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.exitSnipMode(tag);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void open(int tag, String filePath, String password, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> mPDFViewInstance.open(tag, filePath, password, promise));
  }

  @ReactMethod
  public void getFileName(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.getFileName(tag)));
  }

  @ReactMethod
  public void isEncrypted(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.isEncrypted(tag)));
  }

  @ReactMethod
  public void isImageDoc(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.isImageDoc(tag)));
  }

  @ReactMethod
  public void getPermissions(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.getPermissions(tag).id));
  }

  @ReactMethod
  public void checkOwnerUnlocked(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.checkOwnerUnlocked(tag)));
  }

  @ReactMethod
  public void checkOwnerPassword(int tag, String password, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.checkOwnerPassword(tag, password)));
  }

  @ReactMethod
  public void getPageCount(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.getPageCount(tag)));
  }

  @ReactMethod
  public void saveAs(int tag, String savePath, boolean removeSecurity, boolean fontSubset, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.saveAs(tag, savePath, removeSecurity, fontSubset, promise);
    });
  }

  @ReactMethod
  public void printDocument(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.print(tag);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void removePassword(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> mPDFViewInstance.removePassword(tag, promise));
  }

  @ReactMethod
  public void setPassword(int tag, ReadableMap array, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
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
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.getEncryptAlgo(tag)));
  }

  @ReactMethod
  public void importWidgets(int tag, String xfdfFile, final Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
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
    getReactApplicationContext().runOnUiQueueThread(() -> {
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
    getReactApplicationContext().runOnUiQueueThread(() -> mPDFViewInstance.flattenAllPages(tag, savePath, fontSubset, promise));
  }

  @ReactMethod
  public void reloadPages(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.reloadPages(tag);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void getDocumentPath(int tag, Promise promise){
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.getDocumentPath(tag)));
  }

  @ReactMethod
  public void importDocument(int tag, String filePath, ReadableMap array, Promise promise){
    getReactApplicationContext().runOnUiQueueThread(() -> {
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
    getReactApplicationContext().runOnUiQueueThread(() -> {
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
    getReactApplicationContext().runOnUiQueueThread(() -> {
      try {
        promise.resolve(mPDFViewInstance.getAnnotations(tag, pageIndex));
      } catch (Exception ex) {
        promise.reject(ex);
      }
    });
  }

  @ReactMethod
  public void getForms(int tag, int pageIndex, Promise promise){
    getReactApplicationContext().runOnUiQueueThread(() -> {
      try {
        promise.resolve(mPDFViewInstance.getForms(tag, pageIndex));
      } catch (Exception ex) {
        promise.reject(ex);
      }
    });
  }

  @ReactMethod
  public void setTextWidgetText(int tag, int pageIndex, String uuid, String text, Promise promise){
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.setTextWidgetText(tag, pageIndex, uuid, text);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void updateAp(int tag, int pageIndex, String uuid, Promise promise){
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.updateAp(tag, pageIndex, uuid);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void setWidgetIsChecked(int tag, int pageIndex, String uuid, boolean isChecked, Promise promise){
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.setWidgetIsChecked(tag, pageIndex, uuid, isChecked);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void addWidgetImageSignature(int tag, int pageIndex, String uuid, String imagePath, Promise promise){
    getReactApplicationContext().runOnUiQueueThread(() -> {
      promise.resolve(mPDFViewInstance.addWidgetImageSignature(tag, pageIndex, uuid, imagePath));
    });
  }

  @ReactMethod
  public void removeAnnotation(int tag, int pageIndex, String uuid, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      promise.resolve(mPDFViewInstance.removeAnnotation(tag, pageIndex, uuid));
    });
  }

  @ReactMethod
  public void removeWidget(int tag, int pageIndex, String uuid, Promise promise){
    getReactApplicationContext().runOnUiQueueThread(() -> {
      promise.resolve(mPDFViewInstance.removeWidget(tag, pageIndex, uuid));
    });
  }

  @ReactMethod
  public void insertBlankPage(int tag, int pageIndex, int width, int height, Promise promise){
    getReactApplicationContext().runOnUiQueueThread(() -> {
      promise.resolve(mPDFViewInstance.insertBlankPage(tag, pageIndex, width, height));
    });
  }

  @ReactMethod
  public void setAnnotationMode(int tag, String mode, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.setAnnotationMode(tag, mode);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void getAnnotationMode(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.getAnnotationMode(tag)));
  }

  @ReactMethod
  public void annotationCanUndo(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.annotationCanUndo(tag)));
  }

  @ReactMethod
  public void annotationCanRedo(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> promise.resolve(mPDFViewInstance.annotationCanRedo(tag)));
  }

  @ReactMethod
  public void annotationUndo(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.annotationUndo(tag);
      promise.resolve(null);
    });
  }

  @ReactMethod
  public void annotationRedo(int tag, Promise promise) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      mPDFViewInstance.annotationRedo(tag);
      promise.resolve(null);
    });
  }

}
