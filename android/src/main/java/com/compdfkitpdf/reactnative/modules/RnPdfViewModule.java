/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved. THIS SOURCE CODE AND ANY
 * ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW AND MAY NOT BE RESOLD OR
 * REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT. UNAUTHORIZED REPRODUCTION OR
 * DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice may not be removed from this
 * file.
 */

package com.compdfkitpdf.reactnative.modules;

import android.text.TextUtils;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.compdfkit.tools.common.pdf.config.CPDFWatermarkConfig;
import com.compdfkitpdf.reactnative.util.RnFileUtils;
import com.compdfkitpdf.reactnative.viewer.RnPdfViewManager;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import java.util.HashMap;


/**
 * Exposes viewer instance operations to React Native through a NativeModule bridge.
 */
public class RnPdfViewModule extends ReactContextBaseJavaModule {

  private static final String TAG = "ComPDFKitRN";

  public static final String REACT_CLASS = "CPDFViewManager";

  private RnPdfViewManager mPDFViewInstance;

  /**
   * Creates a new RnPdfViewModule instance.
   */
  public RnPdfViewModule(ReactApplicationContext reactApplicationContext,
    RnPdfViewManager viewManager) {
    super(reactApplicationContext);
    mPDFViewInstance = viewManager;
  }

  /**
   * Returns the React Native name used to register this module.
   */
  @NonNull
  @Override
  public String getName() {
    return REACT_CLASS;
  }

  /**
   * Defines a UI-thread action callback used by the bridge helpers.
   */
  @FunctionalInterface
  private interface UiRunnable {
    /**
     * Runs the UI action.
     */
    void run() throws Exception;
  }

  /**
   * Defines a UI-thread value supplier used by the bridge helpers.
   */
  @FunctionalInterface
  private interface UiValueSupplier<T> {
    /**
     * Returns the supplied value.
     */
    T get() throws Exception;
  }

  /**
   * Runs the supplied action on the React Native UI thread.
   */
  private void runOnUiThread(Promise promise, UiRunnable action) {
    runOnUiThread(promise, null, action);
  }

  /**
   * Runs the supplied action on the React Native UI thread.
   */
  private void runOnUiThread(Promise promise, String errorCode, UiRunnable action) {
    getReactApplicationContext().runOnUiQueueThread(() -> {
      try {
        action.run();
      } catch (Exception e) {
        rejectPromise(promise, errorCode, e);
      }
    });
  }

  /**
   * Resolves the promise without returning a value.
   */
  private void resolveVoid(Promise promise, UiRunnable action) {
    resolveVoid(promise, null, action);
  }

  /**
   * Resolves the promise without returning a value.
   */
  private void resolveVoid(Promise promise, String errorCode, UiRunnable action) {
    runOnUiThread(promise, errorCode, () -> {
      action.run();
      promise.resolve(null);
    });
  }

  /**
   * Resolves the promise with the supplied value.
   */
  private <T> void resolveValue(Promise promise, UiValueSupplier<T> supplier) {
    resolveValue(promise, null, supplier);
  }

  /**
   * Resolves the promise with the supplied value.
   */
  private <T> void resolveValue(Promise promise, String errorCode, UiValueSupplier<T> supplier) {
    runOnUiThread(promise, errorCode, () -> promise.resolve(supplier.get()));
  }

  /**
   * Resolves the promise when the supplied value is not empty.
   */
  private void resolveRequiredValue(Promise promise, UiValueSupplier<?> supplier,
    String emptyMessage) {
    resolveRequiredValue(promise, null, supplier, emptyMessage);
  }

  /**
   * Resolves the promise when the supplied value is not empty.
   */
  private void resolveRequiredValue(Promise promise, String errorCode, UiValueSupplier<?> supplier,
    String emptyMessage) {
    runOnUiThread(promise, errorCode, () -> {
      Object result = supplier.get();
      if (result == null || (result instanceof String && TextUtils.isEmpty((String) result))) {
        rejectPromise(promise, errorCode, emptyMessage);
        return;
      }
      promise.resolve(result);
    });
  }

  /**
   * Rejects the promise with the provided error information.
   */
  private void rejectPromise(Promise promise, String errorCode, Exception e) {
    if (TextUtils.isEmpty(errorCode)) {
      promise.reject(e);
    } else {
      promise.reject(errorCode, e);
    }
  }

  /**
   * Rejects the promise with the provided error information.
   */
  private void rejectPromise(Promise promise, String errorCode, String message) {
    if (TextUtils.isEmpty(errorCode)) {
      promise.reject(new Throwable(message));
    } else {
      promise.reject(errorCode, message);
    }
  }

  /**
   * Converts the input value to int array.
   */
  private int[] toIntArray(ReadableArray array) {
    int size = array == null ? 0 : array.size();
    int[] values = new int[size];
    for (int i = 0; i < size; i++) {
      values[i] = array.getInt(i);
    }
    return values;
  }

  @Nullable
  private String identityString(@Nullable ReadableMap identity, String key) {
    if (identity == null || !identity.hasKey(key) || identity.isNull(key)) {
      return null;
    }
    return identity.getString(key);
  }

  /**
   * Saves the current document state.
   */
  @ReactMethod
  public void save(final int tag, final Promise promise) {
    Log.d(TAG, "save(tag:" + tag + ")---->");
    runOnUiThread(promise, "SAVE_FAIL", () -> {
      mPDFViewInstance.save(tag, (s, uri) -> {
        Log.d(TAG, "save()- save success");
        promise.resolve(true);
      }, e -> {
        Log.d(TAG, "save()- save fail");
        promise.reject("SAVE_FAIL", e);
      });
    });
  }

  /**
   * Sets the margins.
   */
  @ReactMethod
  public void setMargins(int tag, ReadableArray margins, Promise promise) {
    resolveVoid(promise, () -> {
      int[] values = toIntArray(margins);
      int left = values[0];
      int top = values[1];
      int right = values[2];
      int bottom = values[3];
      mPDFViewInstance.setMargins(tag, left, top, right, bottom);
    });
  }

  /**
   * Removes all annotations.
   */
  @ReactMethod
  public void removeAllAnnotations(int tag, final Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.removeAllAnnotations(tag));
  }

  /**
   * Imports annotations.
   */
  @ReactMethod
  public void importAnnotations(int tag, String xfdfFile, final Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.importAnnotations(tag, xfdfFile));
  }

  /**
   * Exports annotations.
   */
  @ReactMethod
  public void exportAnnotations(int tag, final Promise promise) {
    resolveRequiredValue(promise, () -> mPDFViewInstance.exportAnnotations(tag),
      "Export annotations failed.");
  }

  /**
   * Sets the display page index.
   */
  @ReactMethod
  public void setDisplayPageIndex(int tag, int pageIndex, ReadableArray array, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setDisplayPageIndex(tag, pageIndex, array));
  }

  /**
   * Returns the current page index.
   */
  @ReactMethod
  public void getCurrentPageIndex(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getCurrentPageIndex(tag));
  }

  /**
   * Returns whether the current state has change.
   */
  @ReactMethod
  public void hasChange(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.hasChange(tag));
  }

  /**
   * Sets the scale.
   */
  @ReactMethod
  public void setScale(int tag, float scale, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setScale(tag, scale));
  }

  /**
   * Returns the scale.
   */
  @ReactMethod
  public void getScale(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getScale(tag));
  }

  /**
   * Sets the can scale.
   */
  @ReactMethod
  public void setCanScale(int tag, boolean canScale, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setCanScale(tag, canScale));
  }

  /**
   * Sets the background color.
   */
  @ReactMethod
  public void setBackgroundColor(int tag, String color, Promise promise) {
    resolveVoid(promise, "SET_BACKGROUND_COLOR_FAIL",
      () -> mPDFViewInstance.setWidgetBackgroundColor(tag, color));
  }

  /**
   * Sets the read background color.
   */
  @ReactMethod
  public void setReadBackgroundColor(int tag, ReadableMap array, Promise promise) {
    resolveVoid(promise, () -> {
      String color = array.getString("color");
      String displayMode = array.getString("displayMode");
      mPDFViewInstance.setReadBackgroundColor(tag, color, displayMode);
    });
  }

  /**
   * Returns the read background color.
   */
  @ReactMethod
  public void getReadBackgroundColor(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getReadBackgroundColor(tag));
  }

  /**
   * Sets the form field highlight.
   */
  @ReactMethod
  public void setFormFieldHighlight(int tag, boolean isFormFieldHighlight, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setFormFieldHighlight(tag, isFormFieldHighlight));
  }

  /**
   * Returns whether form field highlight.
   */
  @ReactMethod
  public void isFormFieldHighlight(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.isFormFieldHighlight(tag));
  }

  /**
   * Sets the link highlight.
   */
  @ReactMethod
  public void setLinkHighlight(int tag, boolean isLinkHighlight, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setLinkHighlight(tag, isLinkHighlight));
  }

  /**
   * Returns whether link highlight.
   */
  @ReactMethod
  public void isLinkHighlight(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.isLinkHighlight(tag));
  }

  /**
   * Sets the vertical mode.
   */
  @ReactMethod
  public void setVerticalMode(int tag, boolean isVerticalMode, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setVerticalMode(tag, isVerticalMode));
  }

  /**
   * Returns whether vertical mode.
   */
  @ReactMethod
  public void isVerticalMode(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.isVerticalMode(tag));
  }

  /**
   * Sets the page spacing.
   */
  @ReactMethod
  public void setPageSpacing(int tag, int pageSpacing, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setPageSpacing(tag, pageSpacing));
  }

  /**
   * Sets the continue mode.
   */
  @ReactMethod
  public void setContinueMode(int tag, boolean isContinueMode, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setContinueMode(tag, isContinueMode));
  }

  /**
   * Returns whether continue mode.
   */
  @ReactMethod
  public void isContinueMode(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.isContinueMode(tag));
  }

  /**
   * Sets the double page mode.
   */
  @ReactMethod
  public void setDoublePageMode(int tag, boolean isDoublePageMode, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setDoublePageMode(tag, isDoublePageMode));
  }

  /**
   * Returns whether double page mode.
   */
  @ReactMethod
  public void isDoublePageMode(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.isDoublePageMode(tag));
  }

  /**
   * Sets the cover page mode.
   */
  @ReactMethod
  public void setCoverPageMode(int tag, boolean coverPageMode, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setCoverPageMode(tag, coverPageMode));
  }

  /**
   * Returns whether cover page mode.
   */
  @ReactMethod
  public void isCoverPageMode(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.isCoverPageMode(tag));
  }

  /**
   * Sets the crop mode.
   */
  @ReactMethod
  public void setCropMode(int tag, boolean isCropMode, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setCropMode(tag, isCropMode));
  }

  /**
   * Returns whether crop mode.
   */
  @ReactMethod
  public void isCropMode(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.isCropMode(tag));
  }

  /**
   * Sets the page same width.
   */
  @ReactMethod
  public void setPageSameWidth(int tag, boolean isSame, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setPageSameWidth(tag, isSame));
  }

  /**
   * Returns whether page in screen.
   */
  @ReactMethod
  public void isPageInScreen(int tag, int pageIndex, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.isPageInScreen(tag, pageIndex));
  }

  /**
   * Sets the fixed scroll.
   */
  @ReactMethod
  public void setFixedScroll(int tag, boolean isFixedScroll, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setFixedScroll(tag, isFixedScroll));
  }

  /**
   * Sets the preview mode.
   */
  @ReactMethod
  public void setPreviewMode(int tag, String previewMode, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setPreviewMode(tag, previewMode));
  }

  /**
   * Returns the preview mode.
   */
  @ReactMethod
  public void getPreviewMode(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getPreviewMode(tag).alias);
  }

  /**
   * Handles show thumbnail view.
   */
  @ReactMethod
  public void showThumbnailView(int tag, boolean editMode, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.showThumbnailView(tag, editMode));
  }

  /**
   * Handles show bota view.
   */
  @ReactMethod
  public void showBotaView(int tag, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.showBotaView(tag));
  }

  /**
   * Handles show add watermark view.
   */
  @ReactMethod
  public void showAddWatermarkView(int tag, ReadableMap map, Promise promise) {
    resolveVoid(promise, () -> {
      HashMap<String, Object> hashMap = map.toHashMap();
      mPDFViewInstance.showAddWatermarkView(tag, CPDFWatermarkConfig.fromMap(hashMap));
    });
  }

  /**
   * Handles show security view.
   */
  @ReactMethod
  public void showSecurityView(int tag, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.showSecurityView(tag));
  }

  /**
   * Handles show display setting view.
   */
  @ReactMethod
  public void showDisplaySettingView(int tag, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.showDisplaySettingView(tag));
  }

  /**
   * Handles show document info view.
   */
  @ReactMethod
  public void showDocumentInfoView(int tag, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.showDocumentInfoView(tag));
  }

  /**
   * Handles enter snip mode.
   */
  @ReactMethod
  public void enterSnipMode(int tag, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.enterSnipMode(tag));
  }

  /**
   * Handles exit snip mode.
   */
  @ReactMethod
  public void exitSnipMode(int tag, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.exitSnipMode(tag));
  }

  /**
   * Opens the requested document or resource.
   */
  @ReactMethod
  public void open(int tag, String filePath, String password,int pageIndex, Promise promise) {
    runOnUiThread(promise, () -> mPDFViewInstance.open(tag, filePath, password, pageIndex, promise));
  }

  /**
   * Returns the file name.
   */
  @ReactMethod
  public void getFileName(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getFileName(tag));
  }

  /**
   * Returns whether encrypted.
   */
  @ReactMethod
  public void isEncrypted(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.isEncrypted(tag));
  }

  /**
   * Returns whether image doc.
   */
  @ReactMethod
  public void isImageDoc(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.isImageDoc(tag));
  }

  /**
   * Returns the permissions.
   */
  @ReactMethod
  public void getPermissions(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getPermissions(tag).id);
  }

  /**
   * Handles check owner unlocked.
   */
  @ReactMethod
  public void checkOwnerUnlocked(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.checkOwnerUnlocked(tag));
  }

  /**
   * Handles check owner password.
   */
  @ReactMethod
  public void checkOwnerPassword(int tag, String password, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.checkOwnerPassword(tag, password));
  }

  /**
   * Returns the page count.
   */
  @ReactMethod
  public void getPageCount(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getPageCount(tag));
  }

  /**
   * Creates a document watermark.
   */
  @ReactMethod
  public void createWatermark(int tag, ReadableMap info, Promise promise) {
    runOnUiThread(promise, "WATERMARK_FAIL",
      () -> mPDFViewInstance.createWatermark(tag, info, promise));
  }

  /**
   * Returns the watermark count.
   */
  @ReactMethod
  public void getWatermarkCount(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getWatermarkCount(tag));
  }

  /**
   * Returns a watermark by index.
   */
  @ReactMethod
  public void getWatermark(int tag, int index, ReadableMap options, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getWatermark(
      tag,
      index,
      options != null && options.hasKey("export_image") && options.getBoolean("export_image")));
  }

  /**
   * Returns all watermarks.
   */
  @ReactMethod
  public void getWatermarks(int tag, ReadableMap options, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getWatermarks(
      tag,
      options != null && options.hasKey("export_images") && options.getBoolean("export_images")));
  }

  /**
   * Updates a watermark.
   */
  @ReactMethod
  public void updateWatermark(int tag, int index, ReadableMap info, Promise promise) {
    runOnUiThread(promise, "WATERMARK_FAIL",
      () -> mPDFViewInstance.updateWatermark(tag, index, info, promise));
  }

  /**
   * Removes a watermark.
   */
  @ReactMethod
  public void removeWatermark(int tag, int index, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.removeWatermark(tag, index));
  }

  /**
   * Removes all watermarks.
   */
  @ReactMethod
  public void removeAllWatermarks(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.removeAllWatermarks(tag));
  }

  /**
   * Saves as.
   */
  @ReactMethod
  public void saveAs(int tag, String savePath, boolean removeSecurity, boolean fontSubset, Promise promise) {
    runOnUiThread(promise,
      () -> mPDFViewInstance.saveAs(tag, savePath, removeSecurity, fontSubset, promise));
  }

  /**
   * Handles print document.
   */
  @ReactMethod
  public void printDocument(int tag, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.print(tag));
  }

  /**
   * Removes password.
   */
  @ReactMethod
  public void removePassword(int tag, Promise promise) {
    runOnUiThread(promise, () -> mPDFViewInstance.removePassword(tag, promise));
  }

  /**
   * Sets the password.
   */
  @ReactMethod
  public void setPassword(int tag, ReadableMap array, Promise promise) {
    runOnUiThread(promise, () -> {
      String userPassword = array.getString("user_password");
      String ownerPassword = array.getString("owner_password");
      boolean allowsPrinting = array.getBoolean("allows_printing");
      boolean allowsCopying = array.getBoolean("allows_copying");
      String encryptAlgo = array.getString("encrypt_algo");
      mPDFViewInstance.setPassword(tag, userPassword, ownerPassword, allowsPrinting, allowsCopying,
        encryptAlgo, promise);
    });
  }

  /**
   * Returns the encrypt algo.
   */
  @ReactMethod
  public void getEncryptAlgo(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getEncryptAlgo(tag));
  }

  /**
   * Imports widgets.
   */
  @ReactMethod
  public void importWidgets(int tag, String xfdfFile, final Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.importWidgets(tag, xfdfFile));
  }

  /**
   * Exports widgets.
   */
  @ReactMethod
  public void exportWidgets(int tag, final Promise promise) {
    resolveRequiredValue(promise, () -> mPDFViewInstance.exportWidgets(tag),
      "Export widgets failed.");
  }

  /**
   * Handles flatten all pages.
   */
  @ReactMethod
  public void flattenAllPages(int tag, String savePath, boolean fontSubset, Promise promise) {
    runOnUiThread(promise, () -> mPDFViewInstance.flattenAllPages(tag, savePath, fontSubset, promise));
  }

  /**
   * Handles reload pages.
   */
  @ReactMethod
  public void reloadPages(int tag, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.reloadPages(tag));
  }

  /**
   * Handles reload pages2.
   */
  @ReactMethod
  public void reloadPages2(int tag, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.reloadPages2(tag));
  }

  /**
   * Returns the document path.
   */
  @ReactMethod
  public void getDocumentPath(int tag, Promise promise){
    resolveValue(promise, () -> mPDFViewInstance.getDocumentPath(tag));
  }

  /**
   * Imports document.
   */
  @ReactMethod
  public void importDocument(int tag, String filePath, ReadableMap array, Promise promise){
    runOnUiThread(promise, () -> {
      String password = array.getString("password");
      int insertPosition = array.getInt("insert_position");
      int[] pages = toIntArray(array.getArray("pages"));
      mPDFViewInstance.importDocument(tag, filePath, password, pages, insertPosition, promise);
    });
  }

  /**
   * Handles split document pages.
   */
  @ReactMethod
  public void splitDocumentPages(int tag, String savePath, ReadableArray pagesArray, Promise promise){
    runOnUiThread(promise, () -> {
      int[] pages = toIntArray(pagesArray);
      mPDFViewInstance.splitDocumentPage(tag, savePath, pages, promise);
    });
  }

  /**
   * Handles image extraction.
   */
  @ReactMethod
  public void extractImages(int tag, String directoryPath, ReadableArray pagesArray, Promise promise) {
    runOnUiThread(promise, () -> {
      int[] pages = toIntArray(pagesArray);
      mPDFViewInstance.extractImages(tag, directoryPath, pages, promise);
    });
  }

  /**
   * Returns the annotations.
   */
  @ReactMethod
  public void getAnnotations(int tag, int pageIndex, Promise promise){
    resolveValue(promise, () -> mPDFViewInstance.getAnnotations(tag, pageIndex));
  }

  /**
   * Returns the forms.
   */
  @ReactMethod
  public void getForms(int tag, int pageIndex, Promise promise){
    resolveValue(promise, () -> mPDFViewInstance.getForms(tag, pageIndex));
  }

  /**
   * Sets the text widget text.
   */
  @ReactMethod
  public void setTextWidgetText(int tag, int pageIndex, String uuid, String text, Promise promise){
    resolveVoid(promise, () -> mPDFViewInstance.setTextWidgetText(tag, pageIndex, uuid, text));
  }

  /**
   * Updates ap.
   */
  @ReactMethod
  public void updateAp(int tag, int pageIndex, String uuid, Promise promise){
    resolveVoid(promise, () -> mPDFViewInstance.updateAp(tag, pageIndex, uuid));
  }

  /**
   * Sets the widget is checked.
   */
  @ReactMethod
  public void setWidgetIsChecked(int tag, int pageIndex, String uuid, boolean isChecked, Promise promise){
    resolveVoid(promise,
      () -> mPDFViewInstance.setWidgetIsChecked(tag, pageIndex, uuid, isChecked));
  }

  /**
   * Adds widget image signature.
   */
  @ReactMethod
  public void addWidgetImageSignature(int tag, int pageIndex, String uuid, String imagePath, Promise promise){
    resolveValue(promise, "ADD_WIDGET_IMAGE_SIGNATURE_FAIL",
      () -> mPDFViewInstance.addWidgetImageSignature(tag, pageIndex, uuid, imagePath));
  }

  /**
   * Removes annotation.
   */
  @ReactMethod
  public void removeAnnotation(int tag, int pageIndex, String uuid, Promise promise) {
    resolveValue(promise, "REMOVE_ANNOTATION_FAIL",
      () -> mPDFViewInstance.removeAnnotation(tag, pageIndex, uuid));
  }

  /**
   * Adds a plain annotation reply.
   */
  @ReactMethod
  public void addAnnotationReply(int tag, int pageIndex, String uuid, String content,
    String title, Promise promise) {
    resolveValue(promise, "ANNOTATION_REPLY_FAIL",
      () -> mPDFViewInstance.addAnnotationReply(tag, pageIndex, uuid, content, title));
  }

  /**
   * Gets plain annotation replies.
   */
  @ReactMethod
  public void getAnnotationReplies(int tag, int pageIndex, String uuid, Promise promise) {
    resolveValue(promise, "ANNOTATION_REPLY_FAIL",
      () -> mPDFViewInstance.getAnnotationReplies(tag, pageIndex, uuid));
  }

  /**
   * Updates a plain annotation reply.
   */
  @ReactMethod
  public void updateAnnotationReply(int tag, int pageIndex, String uuid, String content,
    String title, @Nullable ReadableMap identity, Promise promise) {
    resolveValue(promise, "ANNOTATION_REPLY_FAIL",
      () -> mPDFViewInstance.updateAnnotationReply(tag, pageIndex, uuid,
        identityString(identity, "native_id"), identityString(identity, "reply_key"),
        identityString(identity, "parent_uuid"), content, title));
  }

  /**
   * Removes a plain annotation reply.
   */
  @ReactMethod
  public void removeAnnotationReply(int tag, int pageIndex, String uuid,
    @Nullable ReadableMap identity,
    Promise promise) {
    resolveValue(promise, "ANNOTATION_REPLY_FAIL",
      () -> mPDFViewInstance.removeAnnotationReply(tag, pageIndex, uuid,
        identityString(identity, "native_id"), identityString(identity, "reply_key"),
        identityString(identity, "parent_uuid")));
  }

  /**
   * Removes all plain annotation replies.
   */
  @ReactMethod
  public void removeAllAnnotationReplies(int tag, int pageIndex, String uuid, Promise promise) {
    resolveValue(promise, "ANNOTATION_REPLY_FAIL",
      () -> mPDFViewInstance.removeAllAnnotationReplies(tag, pageIndex, uuid));
  }

  /**
   * Sets the annotation mark state.
   */
  @ReactMethod
  public void setAnnotationMarkState(int tag, int pageIndex, String uuid, String state,
    @Nullable ReadableMap identity, Promise promise) {
    resolveValue(promise, "ANNOTATION_REPLY_FAIL",
      () -> mPDFViewInstance.setAnnotationMarkState(tag, pageIndex, uuid,
        identityString(identity, "native_id"), identityString(identity, "reply_key"),
        identityString(identity, "parent_uuid"), state));
  }

  /**
   * Gets the annotation mark state.
   */
  @ReactMethod
  public void getAnnotationMarkState(int tag, int pageIndex, String uuid,
    @Nullable ReadableMap identity,
    Promise promise) {
    resolveValue(promise, "ANNOTATION_REPLY_FAIL",
      () -> mPDFViewInstance.getAnnotationMarkState(tag, pageIndex, uuid,
        identityString(identity, "native_id"), identityString(identity, "reply_key"),
        identityString(identity, "parent_uuid")));
  }

  /**
   * Sets the annotation review state.
   */
  @ReactMethod
  public void setAnnotationReviewState(int tag, int pageIndex, String uuid, String state,
    @Nullable ReadableMap identity, Promise promise) {
    resolveValue(promise, "ANNOTATION_REPLY_FAIL",
      () -> mPDFViewInstance.setAnnotationReviewState(tag, pageIndex, uuid,
        identityString(identity, "native_id"), identityString(identity, "reply_key"),
        identityString(identity, "parent_uuid"), state));
  }

  /**
   * Gets the annotation review state.
   */
  @ReactMethod
  public void getAnnotationReviewState(int tag, int pageIndex, String uuid,
    @Nullable ReadableMap identity,
    Promise promise) {
    resolveValue(promise, "ANNOTATION_REPLY_FAIL",
      () -> mPDFViewInstance.getAnnotationReviewState(tag, pageIndex, uuid,
        identityString(identity, "native_id"), identityString(identity, "reply_key"),
        identityString(identity, "parent_uuid")));
  }

  /**
   * Removes widget.
   */
  @ReactMethod
  public void removeWidget(int tag, int pageIndex, String uuid, Promise promise){
    resolveValue(promise, "REMOVE_WIDGET_FAIL",
      () -> mPDFViewInstance.removeWidget(tag, pageIndex, uuid));
  }

  /**
   * Handles insert blank page.
   */
  @ReactMethod
  public void insertBlankPage(int tag, int pageIndex, int width, int height, Promise promise){
    resolveValue(promise, "INSERT_BLANK_PAGE_FAIL",
      () -> mPDFViewInstance.insertBlankPage(tag, pageIndex, width, height));
  }

  /**
   * Sets the annotation mode.
   */
  @ReactMethod
  public void setAnnotationMode(int tag, String mode, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.setAnnotationMode(tag, mode));
  }

  /**
   * Returns the annotation mode.
   */
  @ReactMethod
  public void getAnnotationMode(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getAnnotationMode(tag));
  }

  /**
   * Handles annotation can undo.
   */
  @ReactMethod
  public void annotationCanUndo(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.annotationCanUndo(tag));
  }

  /**
   * Handles annotation can redo.
   */
  @ReactMethod
  public void annotationCanRedo(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.annotationCanRedo(tag));
  }

  /**
   * Handles annotation undo.
   */
  @ReactMethod
  public void annotationUndo(int tag, Promise promise) {
    resolveVoid(promise, "ANNOTATION_UNDO_FAIL", () -> mPDFViewInstance.annotationUndo(tag));
  }

  /**
   * Handles annotation redo.
   */
  @ReactMethod
  public void annotationRedo(int tag, Promise promise) {
    resolveVoid(promise, "ANNOTATION_REDO_FAIL", () -> mPDFViewInstance.annotationRedo(tag));
  }

  /**
   * Searches text.
   */
  @ReactMethod
  public void searchText(int tag, String keywords, int searchOptions, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.searchText(tag, keywords, searchOptions));
  }

  /**
   * Clears search.
   */
  @ReactMethod
  public void clearSearch(int tag, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.clearSearchResult(tag));
  }

  /**
   * Handles selection.
   */
  @ReactMethod
  public void selection(int tag, ReadableMap map, Promise promise) {
    resolveVoid(promise, () -> {
      int pageIndex = map.getInt("pageIndex");
      int textRangeIndex = map.getInt("textRangeIndex");
      mPDFViewInstance.selectionText(tag, pageIndex, textRangeIndex);
    });
  }

  /**
   * Returns the search text.
   */
  @ReactMethod
  public void getSearchText(int tag, int pageIndex, int location, int length, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getSearchText(tag, pageIndex, location, length));
  }

  /**
   * Returns all text on a page.
   */
  @ReactMethod
  public void getPageText(int tag, int pageIndex, Promise promise) {
    resolveValue(promise, "GET_PAGE_TEXT_FAIL",
      () -> mPDFViewInstance.getPageText(tag, pageIndex));
  }

  /**
   * Returns text inside a page rectangle.
   */
  @ReactMethod
  public void getPageTextInRect(int tag, int pageIndex, ReadableMap rect, Promise promise) {
    resolveValue(promise, "GET_PAGE_TEXT_IN_RECT_FAIL",
      () -> mPDFViewInstance.getPageTextInRect(tag, pageIndex, rect));
  }

  /**
   * Returns page text lines.
   */
  @ReactMethod
  public void getPageTextLines(int tag, int pageIndex, Promise promise) {
    resolveValue(promise, "GET_PAGE_TEXT_LINES_FAIL",
      () -> mPDFViewInstance.getPageTextLines(tag, pageIndex));
  }

  /**
   * Returns the page size.
   */
  @ReactMethod
  public void getPageSize(int tag, int pageIndex, Promise promise){
    resolveRequiredValue(promise, "GET_PAGE_SIZE_FAIL",
      () -> mPDFViewInstance.getPageSize(tag, pageIndex), "Get page size failed.");
  }

  /**
   * Renders page.
   */
  @ReactMethod
  public void renderPage(int tag, int pageIndex, int width, int height, String backgroundColor, boolean drawAnnot, boolean drawForm,String pageCompression,  Promise promise){
    runOnUiThread(promise,
      () -> mPDFViewInstance.renderPage(tag, pageIndex, width, height, backgroundColor, drawAnnot,
        drawForm, pageCompression, promise));
  }

  /**
   * Renders annotation appearance.
   */
  @ReactMethod
  public void renderAnnotationAppearance(int tag, int pageIndex, String uuid, ReadableMap options, Promise promise) {
    runOnUiThread(promise,
      () -> mPDFViewInstance.renderAnnotationAppearance(tag, pageIndex, uuid, options, promise));
  }

  /**
   * Handles change edit type.
   */
  @ReactMethod
  public void changeEditType(int tag, ReadableArray editTypes, Promise promise) {
    runOnUiThread(promise, () -> {
      int editType = 0;
      for (int i = 0; i < editTypes.size(); i++) {
        int type  = editTypes.getInt(i);
        editType = type | editType;
      }
      mPDFViewInstance.changeEditType(tag, editType, promise);
    });
  }

  /**
   * Handles editor can undo.
   */
  @ReactMethod
  public void editorCanUndo(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.editorCanUndo(tag));
  }

  /**
   * Handles editor can redo.
   */
  @ReactMethod
  public void editorCanRedo(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.editorCanRedo(tag));
  }

  /**
   * Handles editor undo.
   */
  @ReactMethod
  public void editorUndo(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.editorUndo(tag));
  }

  /**
   * Handles editor redo.
   */
  @ReactMethod
  public void editorRedo(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.editorRedo(tag));
  }

  /**
   * Sets the form creation mode.
   */
  @ReactMethod
  public void setFormCreationMode(int tag, String formType, Promise promise){
    resolveVoid(promise, () -> mPDFViewInstance.setFormCreationMode(tag, formType));
  }

  /**
   * Returns the form creation mode.
   */
  @ReactMethod
  public void getFormCreationMode(int tag, Promise promise){
    resolveValue(promise, () -> mPDFViewInstance.getFormCreationMode(tag));
  }

  /**
   * Handles verify digital signature status.
   */
  @ReactMethod
  public void verifyDigitalSignatureStatus(int tag, Promise promise){
    resolveVoid(promise, () -> mPDFViewInstance.verifyDigitalSignatureStatus(tag));
  }

  /**
   * Handles hide digital sign status view.
   */
  @ReactMethod
  public void hideDigitalSignStatusView(int tag, Promise promise){
    resolveVoid(promise, () -> mPDFViewInstance.hideDigitalSignatureView(tag));
  }

  /**
   * Clears display rect.
   */
  @ReactMethod
  public void clearDisplayRect(int tag, Promise promise){
    resolveVoid(promise, () -> mPDFViewInstance.clearDisplayRect(tag));
  }

  /**
   * Dismisses context menu.
   */
  @ReactMethod
  public void dismissContextMenu(int tag, Promise promise){
    resolveVoid(promise, () -> mPDFViewInstance.dismissContextMenu(tag));
  }

  /**
   * Handles show search text view.
   */
  @ReactMethod
  public void showSearchTextView(int tag, Promise promise){
    resolveVoid(promise, () -> mPDFViewInstance.showSearchTextView(tag));
  }

  /**
   * Handles hide search text view.
   */
  @ReactMethod
  public void hideSearchTextView(int tag, Promise promise){
    resolveVoid(promise, () -> mPDFViewInstance.hideSearchTextView(tag));
  }

  /**
   * Saves current ink.
   */
  @ReactMethod
  public void saveCurrentInk(int tag, Promise promise){
    resolveVoid(promise, () -> mPDFViewInstance.saveCurrentInk(tag));
  }

  /**
   * Sets the page rotation.
   */
  @ReactMethod
  public void setPageRotation(int tag, int pageIndex, int rotation, Promise promise){
    runOnUiThread(promise, () -> mPDFViewInstance.setPageRotation(tag, pageIndex, rotation, promise));
  }

  /**
   * Returns the page rotation.
   */
  @ReactMethod
  public void getPageRotation(int tag, int pageIndex, Promise promise){
    resolveValue(promise, () -> mPDFViewInstance.getPageRotation(tag, pageIndex));
  }

  /**
   * Sets the annotations visible.
   */
  @ReactMethod
  public void setAnnotationsVisible(int tag, boolean visible, Promise promise){
    resolveVoid(promise, () -> mPDFViewInstance.setAnnotationsVisible(tag, visible));
  }

  /**
   * Handles are annotations visible.
   */
  @ReactMethod
  public void areAnnotationsVisible(int tag, Promise promise){
    resolveValue(promise, () -> mPDFViewInstance.areAnnotationsVisible(tag));
  }

  /**
   * Handles insert image page.
   */
  @ReactMethod
  public void insertImagePage(int tag, int pageIndex, String imagePath, float width, float height, Promise promise){
    runOnUiThread(promise, "INSERT_PAGE_FAIL", () -> {
      int pageCount = mPDFViewInstance.getPageCount(tag);
      if (pageIndex < 0 || pageIndex > pageCount){
        rejectPromise(promise, "INSERT_PAGE_FAIL", "Insert page index out of range.");
        return;
      }
      boolean result = mPDFViewInstance.insertImagePage(tag, pageIndex, imagePath, width, height);
      if (result) {
        promise.resolve(true);
      } else {
        rejectPromise(promise, "INSERT_PAGE_FAIL", "Insert image page failed.");
      }
    });
  }

  /**
   * Removes pages.
   */
  @ReactMethod
  public void removePages(int tag, ReadableArray pageIndices, Promise promise){
    resolveValue(promise, "REMOVE_PAGES_FAIL",
      () -> mPDFViewInstance.removePages(tag, toIntArray(pageIndices)));
  }

  /**
   * Handles copy page.
   */
  @ReactMethod
  public void copyPage(int tag, int pageIndex, int insertIndex, Promise promise) {
    resolveValue(promise, "COPY_PAGE_FAIL",
      () -> mPDFViewInstance.copyPage(tag, pageIndex, insertIndex));
  }

  /**
   * Handles move page.
   */
  @ReactMethod
  public void movePage(int tag, int fromIndex, int toIndex, Promise promise) {
    resolveValue(promise, "MOVE_PAGE_FAIL",
      () -> mPDFViewInstance.movePage(tag, fromIndex, toIndex));
  }

  /**
   * Returns the info.
   */
  @ReactMethod
  public void getInfo(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getInfo(tag));
  }

  /**
   * Returns the major version.
   */
  @ReactMethod
  public void getMajorVersion(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getMajorVersion(tag));
  }

  /**
   * Returns the minor version.
   */
  @ReactMethod
  public void getMinorVersion(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getMinorVersion(tag));
  }

  /**
   * Returns the permissions info.
   */
  @ReactMethod
  public void getPermissionsInfo(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getPermissionInfo(tag));
  }

  /**
   * Returns the outline root.
   */
  @ReactMethod
  public void getOutlineRoot(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getOutlineRoot(tag));
  }

  /**
   * Handles new outline root.
   */
  @ReactMethod
  public void newOutlineRoot(int tag, Promise promise) {
    resolveRequiredValue(promise, "NEW_OUTLINE_ROOT_FAIL",
      () -> mPDFViewInstance.newOutlineRoot(tag), "Create outline root failed.");
  }

  /**
   * Adds outline.
   */
  @ReactMethod
  public void addOutline(int tag, String parentUuid, String title, int insertIndex, int pageIndex, Promise promise) {
    resolveValue(promise,
      () -> mPDFViewInstance.addOutline(tag, parentUuid, title, insertIndex, pageIndex));
  }

  /**
   * Removes outline.
   */
  @ReactMethod
  public void removeOutline(int tag, String uuid, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.removeOutline(tag, uuid));
  }

  /**
   * Updates outline.
   */
  @ReactMethod
  public void updateOutline(int tag, String outlineId, String title, int pageIndex, Promise promise) {
    resolveValue(promise,
      () -> mPDFViewInstance.updateOutline(tag, outlineId, title, pageIndex));
  }

  /**
   * Handles move outline.
   */
  @ReactMethod
  public void moveOutline(int tag, String outlineId, String newParentId, int newIndex, Promise promise) {
    resolveValue(promise,
      () -> mPDFViewInstance.moveOutline(tag, outlineId, newParentId, newIndex));
  }

  /**
   * Returns the bookmarks.
   */
  @ReactMethod
  public void getBookmarks(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.getBookmarks(tag));
  }

  /**
   * Removes bookmark.
   */
  @ReactMethod
  public void removeBookmark(int tag, int pageIndex, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.removeBookmark(tag, pageIndex));
  }

  /**
   * Returns whether the current state has bookmark.
   */
  @ReactMethod
  public void hasBookmark(int tag, int pageIndex, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.hasBookmark(tag, pageIndex));
  }

  /**
   * Adds bookmark.
   */
  @ReactMethod
  public void addBookmark(int tag, String title, int pageIndex, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.addBookmark(tag, title, pageIndex));
  }

  /**
   * Updates bookmark.
   */
  @ReactMethod
  public void updateBookmark(int tag, String uuid, String title, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.updateBookmark(tag, uuid, title));
  }

  /**
   * Handles show default annotation properties view.
   */
  @ReactMethod
  public void showDefaultAnnotationPropertiesView(int tag, String annotType, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.showDefaultAnnotationPropertiesView(tag, annotType));
  }


  /**
   * Handles show annotation properties view.
   */
  @ReactMethod
  public void showAnnotationPropertiesView(int tag, ReadableMap annotMap, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.showAnnotationPropertiesView(tag, annotMap));
  }

  /**
   * Handles show widget properties view.
   */
  @ReactMethod
  public void showWidgetPropertiesView(int tag, ReadableMap widgetMap, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.showAnnotationPropertiesView(tag, widgetMap));
  }

  /**
   * Handles show edit area properties view.
   */
  @ReactMethod
  public void showEditAreaPropertiesView(int tag, ReadableMap areaMap, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.showEditAreaPropertiesView(tag, areaMap));
  }

  /**
   * Prepares next signature.
   */
  @ReactMethod
  public void prepareNextSignature(int tag, String signatureImagePath, Promise promise) {
    resolveVoid(promise, () -> {
      String path = RnFileUtils.parseFilePath(getReactApplicationContext(), signatureImagePath);
      mPDFViewInstance.prepareNextSignature(tag, path);
    });
  }

  /**
   * Prepares next image.
   */
  @ReactMethod
  public void prepareNextImage(int tag, String imagePath, Promise promise) {
    resolveVoid(promise, () -> {
      String path = RnFileUtils.parseFilePath(getReactApplicationContext(), imagePath);
      mPDFViewInstance.prepareNextSignature(tag, path);
    });
  }

  /**
   * Prepares next stamp.
   */
  @ReactMethod
  public void prepareNextStamp(int tag, ReadableMap stampMap, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.prepareNextStamp(tag, stampMap));
  }

  /**
   * Handles fetch default annotation style.
   */
  @ReactMethod
  public void fetchDefaultAnnotationStyle(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.fetchDefaultAnnotationStyle(tag));
  }

  /**
   * Updates default annotation style.
   */
  @ReactMethod
  public void updateDefaultAnnotationStyle(int tag, ReadableMap styleMap, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.updateDefaultAnnotationStyle(tag, styleMap));
  }

  /**
   * Handles fetch default widget style.
   */
  @ReactMethod
  public void fetchDefaultWidgetStyle(int tag, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.fetchDefaultWidgetStyle(tag));
  }

  /**
   * Updates default widget style.
   */
  @ReactMethod
  public void updateDefaultWidgetStyle(int tag, ReadableMap styleMap, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.updateDefaultWidgetStyle(tag, styleMap));
  }

  /**
   * Updates annotation.
   */
  @ReactMethod
  public void updateAnnotation(int tag, ReadableMap annotMap, Promise promise) {
    runOnUiThread(promise, () -> mPDFViewInstance.updateAnnotation(tag, annotMap, promise));
  }

  /**
   * Updates widget.
   */
  @ReactMethod
  public void updateWidget(int tag, ReadableMap widgetMap, Promise promise) {
    runOnUiThread(promise, () -> mPDFViewInstance.updateWidget(tag, widgetMap, promise));
  }

  /**
   * Removes edit area.
   */
  @ReactMethod
  public void removeEditArea(int tag, int page, String uuid,String type,  Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.removeEditArea(tag, page, uuid, type));
  }

  /**
   * Creates new text area.
   */
  @ReactMethod
  public void createNewTextArea(int tag, ReadableMap areaMap, Promise promise) {
    resolveValue(promise, () -> mPDFViewInstance.createNewTextArea(tag, areaMap));
  }

  /**
   * Creates new image area.
   */
  @ReactMethod
  public void createNewImageArea(int tag, ReadableMap areaMap, Promise promise) {
    runOnUiThread(promise, () -> mPDFViewInstance.createNewImageArea(tag, areaMap, promise));
  }

  /**
   * Adds annotations.
   */
  @ReactMethod
  public void addAnnotations(int tag, ReadableArray annotsArray, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.addAnnotations(tag, annotsArray));
  }

  /**
   * Adds widgets.
   */
  @ReactMethod
  public void addWidgets(int tag, ReadableArray widgetsArray, Promise promise) {
    resolveVoid(promise, () -> mPDFViewInstance.addWidgets(tag, widgetsArray));
  }

}
