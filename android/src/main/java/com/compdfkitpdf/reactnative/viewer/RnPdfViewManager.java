/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.viewer;

import android.app.Activity;
import android.util.Log;
import android.util.SparseArray;
import android.view.View;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;
import com.compdfkit.core.document.CPDFDocument.PDFDocumentPermissions;
import com.compdfkit.tools.common.pdf.CPDFConfigurationUtils;
import com.compdfkit.tools.common.pdf.config.CPDFConfiguration;
import com.compdfkit.tools.common.pdf.config.CPDFWatermarkConfig;
import com.compdfkit.tools.common.views.pdfview.CPreviewMode;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl.COnSaveCallback;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl.COnSaveError;
import com.compdfkit.ui.reader.CPDFReaderView;
import com.compdfkitpdf.reactnative.view.RnPdfView;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Creates and manages native PDF view instances for the React Native UI layer.
 */
public class RnPdfViewManager extends ViewGroupManager<RnPdfView> {

  private static final String TAG = "ComPDFKitRN";

  private ReactApplicationContext reactContext;

  private SparseArray<RnPdfView> mDocumentViews = new SparseArray<>();

  private final RnDocumentOps documentOps;
  private final RnOutlineBookmarkOps outlineBookmarkOps;
  private final RnViewerOps viewerOps;
  private final RnSearchRenderOps searchRenderOps;
  private final RnAnnotationOps annotationOps;

  /**
   * Creates a new RnPdfViewManager instance.
   */
  public RnPdfViewManager(ReactApplicationContext context) {
    this.reactContext = context;
    this.documentOps = new RnDocumentOps(context);
    this.outlineBookmarkOps = new RnOutlineBookmarkOps();
    this.viewerOps = new RnViewerOps(context);
    this.searchRenderOps = new RnSearchRenderOps(context);
    this.annotationOps = new RnAnnotationOps(context);
  }

  /**
   * Returns the React Native name used to register this view manager.
   */
  @NonNull
  @Override
  public String getName() {
    return "RCTCPDFReaderView";
  }

  private View.OnAttachStateChangeListener mOnAttachStateChangeListener = new View.OnAttachStateChangeListener() {
    /**
     * Handles on view attached to window.
     */
    @Override
    public void onViewAttachedToWindow(View v) {
      RnPdfView documentView = (RnPdfView) v;
      mDocumentViews.put(v.getId(), documentView);
      try {
        CPDFReaderView readerView = documentView.getCPDFReaderView();
        if (readerView != null && readerView.getPDFDocument() != null) {
          readerView.reloadPages2();
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
    }

    /**
     * Handles on view detached from window.
     */
    @Override
    public void onViewDetachedFromWindow(View v) {
      RnPdfView documentView = (RnPdfView) v;
      try {
        CPDFReaderView readerView = documentView.getCPDFReaderView();
        if (readerView != null && readerView.getContextMenuShowListener() != null) {
          readerView.getContextMenuShowListener()
            .dismissContextMenu();
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
      mDocumentViews.remove(v.getId());
    }
  };

  /**
   * Creates a native PDF view for the supplied React context.
   */
  @NonNull
  @Override
  protected RnPdfView createViewInstance(@NonNull ThemedReactContext themedReactContext) {
    Activity currentActivity = themedReactContext.getCurrentActivity();
    if (currentActivity instanceof FragmentActivity) {
      FragmentActivity fragmentActivity = (FragmentActivity) currentActivity;
      RnPdfView pdfView = new RnPdfView(fragmentActivity);
      pdfView.setup(themedReactContext, fragmentActivity.getSupportFragmentManager());
      pdfView.addOnAttachStateChangeListener(mOnAttachStateChangeListener);
      return pdfView;
    } else {
      throw new IllegalStateException("RnPdfView can only be used in FragmentActivity subclasses");
    }
  }

  /**
   * Returns whether child layout is handled manually by the view manager.
   */
  @Override
  public boolean needsCustomLayoutForChildren() {
    return true;
  }

  /**
   * Sets the document.
   */
  @ReactProp(name = "document")
  public void setDocument(RnPdfView pdfView, String document) {
    Log.d(TAG, "RnPdfViewManager-setDocument()");
    Log.d(TAG, "document:" + document);
    pdfView.setDocument(document);
  }

  /**
   * Sets the password.
   */
  @ReactProp(name = "password")
  public void setPassword(RnPdfView pdfView, String password) {
    pdfView.setPassword(password);
  }

  /**
   * Sets the configuration.
   */
  @ReactProp(name = "configuration")
  public void setConfiguration(RnPdfView pdfView, String configurationJson) {
    CPDFConfiguration configuration = CPDFConfigurationUtils.fromJson(configurationJson);
    pdfView.setConfiguration(configuration);
  }

  /**
   * Sets the page index.
   */
  @ReactProp(name = "pageIndex")
  public void setPageIndex(RnPdfView pdfView, int pageIndex) {
    pdfView.setPageIndex(pageIndex);
  }

  /**
   * Finds context.
   */
  @Nullable
  private RnPdfViewContext findContext(int tag) {
    RnPdfView view = mDocumentViews.get(tag);
    if (view == null) {
      return null;
    }
    try {
      CPDFReaderView readerView = view.getCPDFReaderView();
      if (readerView == null || readerView.getPDFDocument() == null) {
        return null;
      }
      RnPdfViewContext context = new RnPdfViewContext(view);
      return context.document == null ? null : context;
    } catch (Exception e) {
      return null;
    }
  }

  /**
   * Returns the required context.
   */
  private RnPdfViewContext requireContext(int tag) {
    RnPdfViewContext context = findContext(tag);
    if (context == null) {
      throw new IllegalStateException("Unable to find DocumentView for tag: " + tag);
    }
    return context;
  }


  /**
   * Saves the current document state.
   */
  public void save(int tag, COnSaveCallback saveCallback, COnSaveError error) {
    documentOps.save(findContext(tag), saveCallback, error);
  }

  /**
   * Sets the margins.
   */
  public void setMargins(int tag, int left, int top, int right, int bottom) {
    RnPdfViewContext context = findContext(tag);
    if (context != null) {
      context.readerView.setReaderViewTopMargin(top);
      context.readerView.setReaderViewBottomMargin(bottom);
      context.readerView.setReaderViewHorizontalMargin(left, right);
      context.readerView.reloadPages();
    }
  }

  /**
   * Removes all annotations.
   */
  public boolean removeAllAnnotations(int tag) {
    try {
      RnPdfViewContext context = findContext(tag);
      if (context != null) {
        boolean result = context.document.removeAllAnnotations();
        if (result) {
          context.readerView.invalidateAllChildren();
        }
        return result;
      }
      return false;
    } catch (Exception e) {
      return false;
    }
  }

  /**
   * Imports annotations.
   */
  public boolean importAnnotations(int tag, String xfdfFilePath) throws Exception {
    return documentOps.importAnnotations(requireContext(tag), xfdfFilePath);
  }

  /**
   * Exports annotations.
   */
  public String exportAnnotations(int tag) throws Exception {
    return documentOps.exportAnnotations(requireContext(tag));
  }

  /**
   * Sets the display page index.
   */
  public void setDisplayPageIndex(int tag, int pageIndex, ReadableArray array) {
    viewerOps.setDisplayPageIndex(requireContext(tag), pageIndex, array);
  }

  /**
   * Returns the current page index.
   */
  public int getCurrentPageIndex(int tag) {
    return viewerOps.getCurrentPageIndex(requireContext(tag));
  }

  /**
   * Returns whether the current state has change.
   */
  public boolean hasChange(int tag) {
    return viewerOps.hasChange(requireContext(tag));
  }

  /**
   * Sets the scale.
   */
  public void setScale(int tag, float scale) {
    viewerOps.setScale(requireContext(tag), scale);
  }

  /**
   * Returns the scale.
   */
  public float getScale(int tag) {
    return viewerOps.getScale(requireContext(tag));
  }

  /**
   * Sets the can scale.
   */
  public void setCanScale(int tag, boolean canScale) {
    viewerOps.setCanScale(requireContext(tag), canScale);
  }

  /**
   * Sets the widget background color.
   */
  public void setWidgetBackgroundColor(int tag, String color) {
    viewerOps.setWidgetBackgroundColor(requireContext(tag), color);
  }

  /**
   * Sets the read background color.
   */
  public void setReadBackgroundColor(int tag, String color, String displayMode) {
    viewerOps.setReadBackgroundColor(requireContext(tag), color, displayMode);
  }

  /**
   * Returns the read background color.
   */
  public String getReadBackgroundColor(int tag) {
    return viewerOps.getReadBackgroundColor(requireContext(tag));
  }

  /**
   * Sets the form field highlight.
   */
  public void setFormFieldHighlight(int tag, boolean isFormFieldHighlight) {
    viewerOps.setFormFieldHighlight(requireContext(tag), isFormFieldHighlight);
  }

  /**
   * Returns whether form field highlight.
   */
  public boolean isFormFieldHighlight(int tag) {
    return viewerOps.isFormFieldHighlight(requireContext(tag));
  }

  /**
   * Sets the link highlight.
   */
  public void setLinkHighlight(int tag, boolean isLinkHighlight) {
    viewerOps.setLinkHighlight(requireContext(tag), isLinkHighlight);
  }

  /**
   * Returns whether link highlight.
   */
  public boolean isLinkHighlight(int tag) {
    return viewerOps.isLinkHighlight(requireContext(tag));
  }

  /**
   * Sets the vertical mode.
   */
  public void setVerticalMode(int tag, boolean isVerticalMode) {
    viewerOps.setVerticalMode(requireContext(tag), isVerticalMode);
  }

  /**
   * Returns whether vertical mode.
   */
  public boolean isVerticalMode(int tag) {
    return viewerOps.isVerticalMode(requireContext(tag));
  }

  /**
   * Sets the page spacing.
   */
  public void setPageSpacing(int tag, int spacing) {
    viewerOps.setPageSpacing(requireContext(tag), spacing);
  }

  /**
   * Sets the continue mode.
   */
  public void setContinueMode(int tag, boolean isContinueMode) {
    viewerOps.setContinueMode(requireContext(tag), isContinueMode);
  }

  /**
   * Returns whether continue mode.
   */
  public boolean isContinueMode(int tag) {
    return viewerOps.isContinueMode(requireContext(tag));
  }

  /**
   * Sets the double page mode.
   */
  public void setDoublePageMode(int tag, boolean isDoublePageMode) {
    viewerOps.setDoublePageMode(requireContext(tag), isDoublePageMode);
  }

  /**
   * Returns whether double page mode.
   */
  public boolean isDoublePageMode(int tag) {
    return viewerOps.isDoublePageMode(requireContext(tag));
  }

  /**
   * Sets the cover page mode.
   */
  public void setCoverPageMode(int tag, boolean isCoverPageMode) {
    viewerOps.setCoverPageMode(requireContext(tag), isCoverPageMode);
  }

  /**
   * Returns whether cover page mode.
   */
  public boolean isCoverPageMode(int tag) {
    return viewerOps.isCoverPageMode(requireContext(tag));
  }

  /**
   * Sets the crop mode.
   */
  public void setCropMode(int tag, boolean isCropMode) {
    viewerOps.setCropMode(requireContext(tag), isCropMode);
  }

  /**
   * Returns whether crop mode.
   */
  public boolean isCropMode(int tag) {
    return viewerOps.isCropMode(requireContext(tag));
  }

  /**
   * Sets the page same width.
   */
  public void setPageSameWidth(int tag, boolean isPageSameWidth) {
    viewerOps.setPageSameWidth(requireContext(tag), isPageSameWidth);
  }

  /**
   * Returns whether page in screen.
   */
  public boolean isPageInScreen(int tag, int pageIndex) {
    return viewerOps.isPageInScreen(requireContext(tag), pageIndex);
  }

  /**
   * Sets the fixed scroll.
   */
  public void setFixedScroll(int tag, boolean isFixedScroll) {
    viewerOps.setFixedScroll(requireContext(tag), isFixedScroll);
  }

  /**
   * Sets the preview mode.
   */
  public void setPreviewMode(int tag, String previewMode) {
    viewerOps.setPreviewMode(requireContext(tag), previewMode);
  }

  /**
   * Returns the preview mode.
   */
  public CPreviewMode getPreviewMode(int tag) {
    return viewerOps.getPreviewMode(requireContext(tag));
  }

  /**
   * Handles show thumbnail view.
   */
  public void showThumbnailView(int tag, boolean editMode) {
    viewerOps.showThumbnailView(requireContext(tag), editMode);
  }

  /**
   * Handles show bota view.
   */
  public void showBotaView(int tag) {
    viewerOps.showBotaView(requireContext(tag));
  }

  /**
   * Handles show add watermark view.
   */
  public void showAddWatermarkView(int tag, @Nullable CPDFWatermarkConfig config) {
    viewerOps.showAddWatermarkView(requireContext(tag), config);
  }

  /**
   * Handles show security view.
   */
  public void showSecurityView(int tag) {
    viewerOps.showSecurityView(requireContext(tag));
  }

  /**
   * Handles show display setting view.
   */
  public void showDisplaySettingView(int tag) {
    viewerOps.showDisplaySettingView(requireContext(tag));
  }

  /**
   * Handles show document info view.
   */
  public void showDocumentInfoView(int tag) {
    viewerOps.showDocumentInfoView(requireContext(tag));
  }

  /**
   * Handles enter snip mode.
   */
  public void enterSnipMode(int tag) {
    viewerOps.enterSnipMode(requireContext(tag));
  }

  /**
   * Handles exit snip mode.
   */
  public void exitSnipMode(int tag) {
    viewerOps.exitSnipMode(requireContext(tag));
  }

  /**
   * Opens the requested document or resource.
   */
  public void open(int tag, String filePath, String password, int pageIndex, Promise promise) {
    documentOps.open(requireContext(tag), filePath, password, pageIndex, promise);
  }

  /**
   * Returns the file name.
   */
  public String getFileName(int tag) {
    return documentOps.getFileName(requireContext(tag));
  }

  /**
   * Returns whether encrypted.
   */
  public boolean isEncrypted(int tag) {
    return documentOps.isEncrypted(requireContext(tag));
  }

  /**
   * Returns whether image doc.
   */
  public boolean isImageDoc(int tag) {
    return documentOps.isImageDoc(requireContext(tag));
  }

  /**
   * Returns the permissions.
   */
  public PDFDocumentPermissions getPermissions(int tag) {
    return documentOps.getPermissions(requireContext(tag));
  }

  /**
   * Returns check owner unlocked.
   */
  public boolean checkOwnerUnlocked(int tag) {
    return documentOps.checkOwnerUnlocked(requireContext(tag));
  }

  /**
   * Returns check owner password.
   */
  public boolean checkOwnerPassword(int tag, String password) {
    return documentOps.checkOwnerPassword(requireContext(tag), password);
  }

  /**
   * Returns the page count.
   */
  public int getPageCount(int tag) {
    return documentOps.getPageCount(findContext(tag));
  }

  /**
   * Creates a watermark.
   */
  public void createWatermark(int tag, ReadableMap info, Promise promise) {
    documentOps.createWatermark(requireContext(tag), info, promise);
  }

  /**
   * Returns the watermark count.
   */
  public int getWatermarkCount(int tag) {
    return documentOps.getWatermarkCount(requireContext(tag));
  }

  /**
   * Returns a watermark.
   */
  public WritableMap getWatermark(int tag, int index, boolean exportImage) {
    return documentOps.getWatermark(requireContext(tag), index, exportImage);
  }

  /**
   * Returns all watermarks.
   */
  public WritableArray getWatermarks(int tag, boolean exportImages) {
    return documentOps.getWatermarks(requireContext(tag), exportImages);
  }

  /**
   * Updates a watermark.
   */
  public void updateWatermark(int tag, int index, ReadableMap info, Promise promise) {
    documentOps.updateWatermark(requireContext(tag), index, info, promise);
  }

  /**
   * Removes a watermark.
   */
  public boolean removeWatermark(int tag, int index) {
    return documentOps.removeWatermark(requireContext(tag), index);
  }

  /**
   * Removes all watermarks.
   */
  public boolean removeAllWatermarks(int tag) {
    return documentOps.removeAllWatermarks(requireContext(tag));
  }

  /**
   * Saves as.
   */
  public void saveAs(int tag, String savePath, boolean removeSecurity, boolean fontSubSet,
    Promise result) {
    documentOps.saveAs(requireContext(tag), savePath, removeSecurity, fontSubSet, result);
  }

  /**
   * Handles print.
   */
  public void print(int tag) {
    documentOps.print(requireContext(tag));
  }

  /**
   * Removes password.
   */
  public void removePassword(int tag, Promise promise) {
    documentOps.removePassword(requireContext(tag), promise);
  }

  /**
   * Sets the password.
   */
  public void setPassword(int tag,
    String userPassword,
    String ownerPassword,
    boolean allowsPrinting,
    boolean allowsCopying,
    String encryptAlgo,
    Promise promise) {
    documentOps.setPassword(requireContext(tag), userPassword, ownerPassword, allowsPrinting,
      allowsCopying, encryptAlgo, promise);
  }

  /**
   * Returns the encrypt algo.
   */
  public String getEncryptAlgo(int tag) {
    return documentOps.getEncryptAlgo(requireContext(tag));
  }

  /**
   * Imports widgets.
   */
  public boolean importWidgets(int tag, String xfdfFilePath) throws Exception {
    return documentOps.importWidgets(requireContext(tag), xfdfFilePath);
  }

  /**
   * Exports widgets.
   */
  public String exportWidgets(int tag) throws Exception {
    return documentOps.exportWidgets(requireContext(tag));
  }

  /**
   * Handles flatten all pages.
   */
  public void flattenAllPages(int tag, String savePath, boolean fontSubset, Promise promise) {
    documentOps.flattenAllPages(requireContext(tag), savePath, fontSubset, promise);
  }

  /**
   * Handles reload pages.
   */
  public void reloadPages(int tag) {
    documentOps.reloadPages(requireContext(tag));
  }

  /**
   * Handles reload pages2.
   */
  public void reloadPages2(int tag) {
    documentOps.reloadPages2(requireContext(tag));
  }

  /**
   * Imports document.
   */
  public void importDocument(int tag, String filePath, String password, int[] pages,
    int insertPosition, Promise promise) {
    documentOps.importDocument(requireContext(tag), filePath, password, pages, insertPosition,
      promise);
  }


  /**
   * Handles split document page.
   */
  public void splitDocumentPage(int tag, String savePath, int[] pages, Promise promise) {
    documentOps.splitDocumentPage(requireContext(tag), savePath, pages, promise);
  }

  /**
   * Handles image extraction.
   */
  public void extractImages(int tag, String directoryPath, int[] pages, Promise promise) {
    documentOps.extractImages(requireContext(tag), directoryPath, pages, promise);
  }

  /**
   * Returns the document path.
   */
  public String getDocumentPath(int tag) {
    return documentOps.getDocumentPath(requireContext(tag));
  }

  /**
   * Returns the annotations.
   */
  public WritableArray getAnnotations(int tag, int pageIndex) {
    return annotationOps.getAnnotations(requireContext(tag), pageIndex);
  }

  /**
   * Returns the forms.
   */
  public WritableArray getForms(int tag, int pageIndex) {
    return annotationOps.getForms(requireContext(tag), pageIndex);
  }

  /**
   * Sets the text widget text.
   */
  public void setTextWidgetText(int tag, int pageIndex, String uuid, String text) {
    annotationOps.setTextWidgetText(requireContext(tag), pageIndex, uuid, text);
  }

  /**
   * Updates ap.
   */
  public void updateAp(int tag, int pageIndex, String uuid) {
    annotationOps.updateAp(requireContext(tag), pageIndex, uuid);
  }

  /**
   * Sets the widget is checked.
   */
  public void setWidgetIsChecked(int tag, int pageIndex, String uuid, boolean checked) {
    annotationOps.setWidgetIsChecked(requireContext(tag), pageIndex, uuid, checked);
  }

  /**
   * Adds widget image signature.
   */
  public boolean addWidgetImageSignature(int tag, int pageIndex, String uuid, String imagePath) {
    return annotationOps.addWidgetImageSignature(requireContext(tag), pageIndex, uuid, imagePath);
  }

  /**
   * Removes annotation.
   */
  public boolean removeAnnotation(int tag, int pageIndex, String uuid) {
    return annotationOps.removeAnnotation(requireContext(tag), pageIndex, uuid);
  }

  /**
   * Adds a plain annotation reply.
   */
  public WritableMap addAnnotationReply(int tag, int pageIndex, String uuid, String content,
    String title) {
    return annotationOps.addAnnotationReply(requireContext(tag), pageIndex, uuid, content, title);
  }

  /**
   * Gets plain annotation replies.
   */
  public WritableArray getAnnotationReplies(int tag, int pageIndex, String uuid) {
    return annotationOps.getAnnotationReplies(requireContext(tag), pageIndex, uuid);
  }

  /**
   * Updates a plain annotation reply.
   */
  public boolean updateAnnotationReply(int tag, int pageIndex, String uuid,
    @Nullable String nativeId, @Nullable String replyKey, @Nullable String parentUuid,
    String content, String title) {
    return annotationOps.updateAnnotationReply(requireContext(tag), pageIndex, uuid, nativeId,
      replyKey, parentUuid, content, title);
  }

  /**
   * Removes a plain annotation reply.
   */
  public boolean removeAnnotationReply(int tag, int pageIndex, String uuid,
    @Nullable String nativeId, @Nullable String replyKey, @Nullable String parentUuid) {
    return annotationOps.removeAnnotationReply(requireContext(tag), pageIndex, uuid, nativeId,
      replyKey, parentUuid);
  }

  /**
   * Removes all plain annotation replies.
   */
  public boolean removeAllAnnotationReplies(int tag, int pageIndex, String uuid) {
    return annotationOps.removeAllAnnotationReplies(requireContext(tag), pageIndex, uuid);
  }

  /**
   * Sets the annotation mark state.
   */
  public boolean setAnnotationMarkState(int tag, int pageIndex, String uuid,
    @Nullable String nativeId, @Nullable String replyKey, @Nullable String parentUuid,
    String state) {
    return annotationOps.setAnnotationMarkState(requireContext(tag), pageIndex, uuid, nativeId,
      replyKey, parentUuid, state);
  }

  /**
   * Gets the annotation mark state.
   */
  public String getAnnotationMarkState(int tag, int pageIndex, String uuid,
    @Nullable String nativeId, @Nullable String replyKey, @Nullable String parentUuid) {
    return annotationOps.getAnnotationMarkState(requireContext(tag), pageIndex, uuid, nativeId,
      replyKey, parentUuid);
  }

  /**
   * Sets the annotation review state.
   */
  public boolean setAnnotationReviewState(int tag, int pageIndex, String uuid,
    @Nullable String nativeId, @Nullable String replyKey, @Nullable String parentUuid,
    String state) {
    return annotationOps.setAnnotationReviewState(requireContext(tag), pageIndex, uuid, nativeId,
      replyKey, parentUuid, state);
  }

  /**
   * Gets the annotation review state.
   */
  public String getAnnotationReviewState(int tag, int pageIndex, String uuid,
    @Nullable String nativeId, @Nullable String replyKey, @Nullable String parentUuid) {
    return annotationOps.getAnnotationReviewState(requireContext(tag), pageIndex, uuid, nativeId,
      replyKey, parentUuid);
  }

  /**
   * Removes widget.
   */
  public boolean removeWidget(int tag, int pageIndex, String uuid) {
    return removeAnnotation(tag, pageIndex, uuid);
  }

  /**
   * Returns insert blank page.
   */
  public boolean insertBlankPage(int tag, int pageIndex, int width, int height) {
    return documentOps.insertBlankPage(requireContext(tag), pageIndex, width, height);
  }

  /**
   * Returns insert image page.
   */
  public boolean insertImagePage(int tag, int pageIndex, String imagePath, float width,
    float height) throws Exception {
    return documentOps.insertImagePage(requireContext(tag), pageIndex, imagePath, width, height);
  }

  /**
   * Removes pages.
   */
  public boolean removePages(int tag, int[] pages) {
    return documentOps.removePages(requireContext(tag), pages);
  }

  /**
   * Copies a page.
   */
  public boolean copyPage(int tag, int pageIndex, int insertIndex) {
    return documentOps.copyPage(requireContext(tag), pageIndex, insertIndex);
  }

  /**
   * Returns move page.
   */
  public boolean movePage(int tag, int fromIndex, int toIndex) {
    return documentOps.movePage(requireContext(tag), fromIndex, toIndex);
  }

  /**
   * Sets the annotation mode.
   */
  public void setAnnotationMode(int tag, String mode) {
    annotationOps.setAnnotationMode(requireContext(tag), mode);
  }

  /**
   * Returns the annotation mode.
   */
  public String getAnnotationMode(int tag) {
    return annotationOps.getAnnotationMode(requireContext(tag));
  }

  /**
   * Returns annotation can undo.
   */
  public boolean annotationCanUndo(int tag) {
    return annotationOps.annotationCanUndo(requireContext(tag));
  }

  /**
   * Returns annotation can redo.
   */
  public boolean annotationCanRedo(int tag) {
    return annotationOps.annotationCanRedo(requireContext(tag));
  }

  /**
   * Handles annotation undo.
   */
  public void annotationUndo(int tag) {
    annotationOps.annotationUndo(requireContext(tag));
  }

  /**
   * Handles annotation redo.
   */
  public void annotationRedo(int tag) {
    annotationOps.annotationRedo(requireContext(tag));
  }

  /**
   * Searches text.
   */
  public WritableArray searchText(int tag, String keywords, int searchOptions) {
    return searchRenderOps.searchText(requireContext(tag), keywords, searchOptions);
  }

  /**
   * Clears search result.
   */
  public void clearSearchResult(int tag) {
    searchRenderOps.clearSearchResult(requireContext(tag));
  }

  /**
   * Handles selection text.
   */
  public void selectionText(int tag, int pageIndex, int textRangeIndex) {
    searchRenderOps.selectionText(requireContext(tag), pageIndex, textRangeIndex);
  }

  /**
   * Returns the search text.
   */
  public String getSearchText(int tag, int pageIndex, int location, int length) {
    return searchRenderOps.getSearchText(requireContext(tag), pageIndex, location, length);
  }

  /**
   * Returns all text on a page.
   */
  public String getPageText(int tag, int pageIndex) {
    return searchRenderOps.getPageText(requireContext(tag), pageIndex);
  }

  /**
   * Returns text inside a page rectangle.
   */
  public String getPageTextInRect(int tag, int pageIndex, ReadableMap rect) {
    return searchRenderOps.getPageTextInRect(requireContext(tag), pageIndex, rect);
  }

  /**
   * Returns page text lines.
   */
  public WritableArray getPageTextLines(int tag, int pageIndex) {
    return searchRenderOps.getPageTextLines(requireContext(tag), pageIndex);
  }

  /**
   * Returns the page size.
   */
  public WritableMap getPageSize(int tag, int pageIndex) {
    return searchRenderOps.getPageSize(requireContext(tag), pageIndex);
  }

  /**
   * Renders page.
   */
  public void renderPage(int tag, int pageIndex, int width, int height, String backgroundColor,
    boolean drawAnnot, boolean drawForm, String pageCompression, Promise promise) {
    searchRenderOps.renderPage(requireContext(tag), pageIndex, width, height, backgroundColor,
      drawAnnot, drawForm, pageCompression, promise);
  }

  /**
   * Renders annotation appearance.
   */
  public void renderAnnotationAppearance(int tag, int pageIndex, String uuid,
    ReadableMap optionsMap, Promise promise) {
    searchRenderOps.renderAnnotationAppearance(findContext(tag), pageIndex, uuid, optionsMap,
      promise);
  }

  /**
   * Handles change edit type.
   */
  public void changeEditType(int tag, int type, Promise promise) {
    annotationOps.changeEditType(requireContext(tag), type, promise);
  }

  /**
   * Returns editor can undo.
   */
  public boolean editorCanUndo(int tag) {
    return annotationOps.editorCanUndo(requireContext(tag));
  }

  /**
   * Returns editor can redo.
   */
  public boolean editorCanRedo(int tag) {
    return annotationOps.editorCanRedo(requireContext(tag));
  }

  /**
   * Returns editor undo.
   */
  public boolean editorUndo(int tag) {
    return annotationOps.editorUndo(requireContext(tag));
  }

  /**
   * Returns editor redo.
   */
  public boolean editorRedo(int tag) {
    return annotationOps.editorRedo(requireContext(tag));
  }


  /**
   * Sets the form creation mode.
   */
  public void setFormCreationMode(int tag, String formType) {
    annotationOps.setFormCreationMode(requireContext(tag), formType);
  }

  /**
   * Returns the form creation mode.
   */
  public String getFormCreationMode(int tag) {
    return annotationOps.getFormCreationMode(requireContext(tag));
  }

  /**
   * Handles verify digital signature status.
   */
  public void verifyDigitalSignatureStatus(int tag) {
    annotationOps.verifyDigitalSignatureStatus(requireContext(tag));
  }

  /**
   * Handles hide digital signature view.
   */
  public void hideDigitalSignatureView(int tag) {
    annotationOps.hideDigitalSignatureView(requireContext(tag));
  }

  /**
   * Clears display rect.
   */
  public void clearDisplayRect(int tag) {
    viewerOps.clearDisplayRect(requireContext(tag));
  }

  /**
   * Dismisses context menu.
   */
  public void dismissContextMenu(int tag) {
    viewerOps.dismissContextMenu(requireContext(tag));
  }

  /**
   * Handles show search text view.
   */
  public void showSearchTextView(int tag) {
    viewerOps.showSearchTextView(requireContext(tag));
  }

  /**
   * Handles hide search text view.
   */
  public void hideSearchTextView(int tag) {
    viewerOps.hideSearchTextView(requireContext(tag));
  }

  /**
   * Saves current ink.
   */
  public void saveCurrentInk(int tag) {
    viewerOps.saveCurrentInk(requireContext(tag));
  }

  /**
   * Sets the page rotation.
   */
  public void setPageRotation(int tag, int pageIndex, int rotation, Promise promise) {
    documentOps.setPageRotation(requireContext(tag), pageIndex, rotation, promise);
  }

  /**
   * Returns the page rotation.
   */
  public int getPageRotation(int tag, int pageIndex) {
    return documentOps.getPageRotation(requireContext(tag), pageIndex);
  }

  /**
   * Sets the annotations visible.
   */
  public void setAnnotationsVisible(int tag, boolean visible) {
    annotationOps.setAnnotationsVisible(requireContext(tag), visible);
  }

  /**
   * Returns are annotations visible.
   */
  public boolean areAnnotationsVisible(int tag) {
    return annotationOps.areAnnotationsVisible(requireContext(tag));
  }

  /**
   * Returns the info.
   */
  public WritableMap getInfo(int tag) {
    return documentOps.getInfo(requireContext(tag));
  }

  /**
   * Returns the major version.
   */
  public int getMajorVersion(int tag) {
    return documentOps.getMajorVersion(requireContext(tag));
  }

  /**
   * Returns the minor version.
   */
  public int getMinorVersion(int tag) {
    return documentOps.getMinorVersion(requireContext(tag));
  }

  /**
   * Returns the permission info.
   */
  public WritableMap getPermissionInfo(int tag) {
    return documentOps.getPermissionInfo(requireContext(tag));
  }

  /**
   * Returns the outline root.
   */
  public WritableMap getOutlineRoot(int tag) {
    return outlineBookmarkOps.getOutlineRoot(requireContext(tag));
  }

  /**
   * Returns new outline root.
   */
  public WritableMap newOutlineRoot(int tag) {
    return outlineBookmarkOps.newOutlineRoot(requireContext(tag));
  }


  /**
   * Adds outline.
   */
  public boolean addOutline(int tag, String parentUuid, String title, int insertIndex,
    int pageIndex) {
    return outlineBookmarkOps.addOutline(requireContext(tag), parentUuid, title, insertIndex,
      pageIndex);
  }

  /**
   * Removes outline.
   */
  public boolean removeOutline(int tag, String uuid) {
    return outlineBookmarkOps.removeOutline(requireContext(tag), uuid);
  }

  /**
   * Updates outline.
   */
  public boolean updateOutline(int tag, String uuid, String newTitle, int newPageIndex) {
    return outlineBookmarkOps.updateOutline(requireContext(tag), uuid, newTitle, newPageIndex);
  }

  /**
   * Returns move outline.
   */
  public boolean moveOutline(int tag, String uuid, String newParentUuid, int newIndex) {
    return outlineBookmarkOps.moveOutline(requireContext(tag), uuid, newParentUuid, newIndex);
  }

  /**
   * Returns the bookmarks.
   */
  public WritableArray getBookmarks(int tag) {
    return outlineBookmarkOps.getBookmarks(requireContext(tag));
  }

  /**
   * Adds bookmark.
   */
  public boolean addBookmark(int tag, String title, int pageIndex) {
    RnPdfViewContext context = findContext(tag);
    return context != null && outlineBookmarkOps.addBookmark(context, title, pageIndex);
  }

  /**
   * Removes bookmark.
   */
  public boolean removeBookmark(int tag, int pageIndex) {
    RnPdfViewContext context = findContext(tag);
    return context != null && outlineBookmarkOps.removeBookmark(context, pageIndex);
  }

  /**
   * Returns whether the current state has bookmark.
   */
  public boolean hasBookmark(int tag, int pageIndex) {
    return outlineBookmarkOps.hasBookmark(findContext(tag), pageIndex);
  }

  /**
   * Updates bookmark.
   */
  public boolean updateBookmark(int tag, String uuid, String newTitle) {
    RnPdfViewContext context = findContext(tag);
    return context != null && outlineBookmarkOps.updateBookmark(context, uuid, newTitle);
  }

  /**
   * Handles show default annotation properties view.
   */
  public void showDefaultAnnotationPropertiesView(int tag, String annotType) {
    annotationOps.showDefaultAnnotationPropertiesView(requireContext(tag), annotType);
  }

  /**
   * Handles show annotation properties view.
   */
  public void showAnnotationPropertiesView(int tag, ReadableMap annotMap) {
    annotationOps.showAnnotationPropertiesView(requireContext(tag), annotMap);
  }

  /**
   * Handles show edit area properties view.
   */
  public void showEditAreaPropertiesView(int tag, ReadableMap editAreaMap) {
    annotationOps.showEditAreaPropertiesView(requireContext(tag), editAreaMap);
  }

  /**
   * Prepares next signature.
   */
  public void prepareNextSignature(int tag, String imagePath) {
    annotationOps.prepareNextSignature(findContext(tag), imagePath);
  }

  /**
   * Prepares next image.
   */
  public void prepareNextImage(int tag, String imagePath) {
    annotationOps.prepareNextImage(findContext(tag), imagePath);
  }

  /**
   * Prepares next stamp.
   */
  public void prepareNextStamp(int tag, ReadableMap stampMap) {
    annotationOps.prepareNextStamp(findContext(tag), stampMap);
  }

  /**
   * Returns fetch default annotation style.
   */
  public WritableMap fetchDefaultAnnotationStyle(int tag) {
    return annotationOps.fetchDefaultAnnotationStyle(findContext(tag));
  }

  /**
   * Updates default annotation style.
   */
  public void updateDefaultAnnotationStyle(int tag, ReadableMap styleMap) {
    annotationOps.updateDefaultAnnotationStyle(findContext(tag), styleMap);
  }

  /**
   * Returns fetch default widget style.
   */
  public ReadableMap fetchDefaultWidgetStyle(int tag) {
    return annotationOps.fetchDefaultWidgetStyle(findContext(tag));
  }

  /**
   * Updates default widget style.
   */
  public void updateDefaultWidgetStyle(int tag, ReadableMap styleMap) {
    annotationOps.updateDefaultWidgetStyle(findContext(tag), styleMap);
  }

  /**
   * Removes edit area.
   */
  public void removeEditArea(int tag, int pageIndex, String uuid, String type) {
    annotationOps.removeEditArea(findContext(tag), pageIndex, uuid, type);
  }

  /**
   * Creates new text area.
   */
  public boolean createNewTextArea(int tag, ReadableMap textAreaMap) {
    return annotationOps.createNewTextArea(findContext(tag), textAreaMap);
  }

  /**
   * Creates new image area.
   */
  public void createNewImageArea(int tag, ReadableMap imageAreaMap, Promise promise) {
    annotationOps.createNewImageArea(findContext(tag), imageAreaMap, promise);
  }

  /**
   * Updates annotation.
   */
  public void updateAnnotation(int tag, ReadableMap annotMap, Promise promise) {
    annotationOps.updateAnnotation(requireContext(tag), annotMap, promise);
  }

  /**
   * Updates widget.
   */
  public void updateWidget(int tag, ReadableMap widgetMap, Promise promise) {
    annotationOps.updateWidget(requireContext(tag), widgetMap, promise);
  }

  /**
   * Adds annotations.
   */
  public void addAnnotations(int tag, ReadableArray annotationsArray) {
    annotationOps.addAnnotations(requireContext(tag), annotationsArray);
  }

  /**
   * Adds widgets.
   */
  public void addWidgets(int tag, ReadableArray widgetsArray) {
    annotationOps.addWidgets(requireContext(tag), widgetsArray);
  }


}
