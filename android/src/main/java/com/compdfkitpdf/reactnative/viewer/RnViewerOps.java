/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 * <p>
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES. This notice
 * may not be removed from this file.
 */

package com.compdfkitpdf.reactnative.viewer;

import android.graphics.Color;
import android.graphics.RectF;
import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.tools.common.pdf.config.CPDFWatermarkConfig;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl;
import com.compdfkit.tools.common.views.pdfview.CPreviewMode;
import com.compdfkit.ui.reader.CPDFReaderView;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReactApplicationContext;
import java.util.ArrayList;
import java.util.List;

/**
 * Handles viewer ops for the native PDF viewer layer.
 */
final class RnViewerOps {

  private final ReactApplicationContext reactContext;

  /**
   * Creates a new RnViewerOps instance.
   */
  RnViewerOps(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
  }

  private boolean isAvailable(RnPdfViewContext context) {
    return context != null && context.readerView != null && context.document != null && context.viewCtrl != null;
  }

  /**
   * Sets the display page index.
   */
  void setDisplayPageIndex(RnPdfViewContext context, int pageIndex, ReadableArray array) {
    if (!isAvailable(context)) {
      return;
    }
    List<RectF> androidRectList = new ArrayList<>();
    if (array != null && array.size() > 0) {
      for (int i = 0; i < array.size(); i++) {
        ReadableMap item = array.getMap(i);
        if (item == null) {
          continue;
        }
        float rectLeft = ((Number) item.getDouble("left")).floatValue();
        float rectTop = ((Number) item.getDouble("top")).floatValue();
        float rectRight = ((Number) item.getDouble("right")).floatValue();
        float rectBottom = ((Number) item.getDouble("bottom")).floatValue();
        RectF pageRectF = new RectF(rectLeft, rectTop, rectRight, rectBottom);
        androidRectList.add(convertScreenRectF(context.readerView, pageIndex, pageRectF));
      }
      RectF[] rectArray = androidRectList.toArray(new RectF[0]);
      context.readerView.setDisplayPageIndex(pageIndex, rectArray);
      return;
    }
    context.readerView.setDisplayPageIndex(pageIndex);
  }

  /**
   * Returns the current page index.
   */
  int getCurrentPageIndex(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return 0;
    }
    return context.readerView.getPageNum();
  }

  /**
   * Returns whether the current state has change.
   */
  boolean hasChange(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return false;
    }
    return context.document.hasChanges();
  }

  /**
   * Sets the scale.
   */
  void setScale(RnPdfViewContext context, float scale) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.setScale(scale);
  }

  /**
   * Returns the scale.
   */
  float getScale(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return 1.0f;
    }
    return context.readerView.getScale();
  }

  /**
   * Sets the can scale.
   */
  void setCanScale(RnPdfViewContext context, boolean canScale) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.setCanScale(canScale);
  }

  /**
   * Sets the widget background color.
   */
  void setWidgetBackgroundColor(RnPdfViewContext context, String color) {
    if (!isAvailable(context)) {
      return;
    }
    context.viewCtrl.setBackgroundColor(Color.parseColor(color));
  }

  /**
   * Sets the read background color.
   */
  void setReadBackgroundColor(RnPdfViewContext context, String color, String displayMode) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.setReadBackgroundColor(Color.parseColor(color));
    CPDFViewCtrl viewCtrl = context.viewCtrl;
    switch (displayMode) {
      case "light":
        viewCtrl.setBackgroundColor(ContextCompat.getColor(reactContext,
          com.compdfkit.tools.R.color.tools_pdf_view_ctrl_background_color));
        break;
      case "dark":
        viewCtrl.setBackgroundColor(ContextCompat.getColor(reactContext,
          com.compdfkit.tools.R.color.tools_pdf_view_ctrl_background_color_dark));
        break;
      case "sepia":
        viewCtrl.setBackgroundColor(ContextCompat.getColor(reactContext,
          com.compdfkit.tools.R.color.tools_pdf_view_ctrl_background_color_sepia));
        break;
      case "reseda":
        viewCtrl.setBackgroundColor(ContextCompat.getColor(reactContext,
          com.compdfkit.tools.R.color.tools_pdf_view_ctrl_background_color_reseda));
        break;
      default:
        break;
    }
  }

  /**
   * Returns the read background color.
   */
  String getReadBackgroundColor(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return "#000000";
    }
    return "#" + Integer.toHexString(context.readerView.getReadBackgroundColor()).toUpperCase();
  }

  /**
   * Sets the form field highlight.
   */
  void setFormFieldHighlight(RnPdfViewContext context, boolean isFormFieldHighlight) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.setFormFieldHighlight(isFormFieldHighlight);
  }

  /**
   * Returns whether form field highlight.
   */
  boolean isFormFieldHighlight(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return false;
    }
    return context.readerView.isFormFieldHighlight();
  }

  /**
   * Sets the link highlight.
   */
  void setLinkHighlight(RnPdfViewContext context, boolean isLinkHighlight) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.setLinkHighlight(isLinkHighlight);
  }

  /**
   * Returns whether link highlight.
   */
  boolean isLinkHighlight(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return false;
    }
    return context.readerView.isLinkHighlight();
  }

  /**
   * Sets the vertical mode.
   */
  void setVerticalMode(RnPdfViewContext context, boolean isVerticalMode) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.setVerticalMode(isVerticalMode);
    context.viewCtrl.updateScaleForLayout();
  }

  /**
   * Returns whether vertical mode.
   */
  boolean isVerticalMode(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return false;
    }
    return context.readerView.isVerticalMode();
  }

  /**
   * Sets the page spacing.
   */
  void setPageSpacing(RnPdfViewContext context, int spacing) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.setPageSpacing(spacing);
    context.readerView.reloadPages();
  }

  /**
   * Sets the continue mode.
   */
  void setContinueMode(RnPdfViewContext context, boolean isContinueMode) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.setContinueMode(isContinueMode);
    context.viewCtrl.updateScaleForLayout();
  }

  /**
   * Returns whether continue mode.
   */
  boolean isContinueMode(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return false;
    }
    return context.readerView.isContinueMode();
  }

  /**
   * Sets the double page mode.
   */
  void setDoublePageMode(RnPdfViewContext context, boolean isDoublePageMode) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.setDoublePageMode(isDoublePageMode);
    context.readerView.setCoverPageMode(false);
    context.viewCtrl.updateScaleForLayout();
  }

  /**
   * Returns whether double page mode.
   */
  boolean isDoublePageMode(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return false;
    }
    return context.readerView.isDoublePageMode();
  }

  /**
   * Sets the cover page mode.
   */
  void setCoverPageMode(RnPdfViewContext context, boolean isCoverPageMode) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.setDoublePageMode(isCoverPageMode);
    context.readerView.setCoverPageMode(isCoverPageMode);
    context.viewCtrl.updateScaleForLayout();
  }

  /**
   * Returns whether cover page mode.
   */
  boolean isCoverPageMode(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return false;
    }
    return context.readerView.isCoverPageMode();
  }

  /**
   * Sets the crop mode.
   */
  void setCropMode(RnPdfViewContext context, boolean isCropMode) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.setCropMode(isCropMode);
  }

  /**
   * Returns whether crop mode.
   */
  boolean isCropMode(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return false;
    }
    return context.readerView.isCropMode();
  }

  /**
   * Sets the page same width.
   */
  void setPageSameWidth(RnPdfViewContext context, boolean isPageSameWidth) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.setPageSameWidth(isPageSameWidth);
    context.readerView.reloadPages();
  }

  /**
   * Returns whether page in screen.
   */
  boolean isPageInScreen(RnPdfViewContext context, int pageIndex) {
    if (!isAvailable(context)) {
      return false;
    }
    return context.readerView.isPageInScreen(pageIndex);
  }

  /**
   * Sets the fixed scroll.
   */
  void setFixedScroll(RnPdfViewContext context, boolean isFixedScroll) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.setFixedScroll(isFixedScroll);
  }

  /**
   * Sets the preview mode.
   */
  void setPreviewMode(RnPdfViewContext context, String previewMode) {
    if (!isAvailable(context)) {
      return;
    }
    context.view.documentFragment.setPreviewMode(CPreviewMode.fromAlias(previewMode));
  }

  /**
   * Returns the preview mode.
   */
  CPreviewMode getPreviewMode(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return CPreviewMode.Viewer;
    }
    return context.view.documentFragment.pdfToolBar.getMode();
  }

  /**
   * Handles show thumbnail view.
   */
  void showThumbnailView(RnPdfViewContext context, boolean editMode) {
    if (!isAvailable(context)) {
      return;
    }
    context.view.documentFragment.showPageEdit(false, editMode);
  }

  /**
   * Handles show bota view.
   */
  void showBotaView(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return;
    }
    context.view.documentFragment.showBOTA();
  }

  /**
   * Handles show add watermark view.
   */
  void showAddWatermarkView(RnPdfViewContext context, @Nullable CPDFWatermarkConfig config) {
    if (!isAvailable(context)) {
      return;
    }
    CPDFWatermarkConfig defaultConfig =
      context.viewCtrl.getCPDFConfiguration().globalConfig.watermark;
    if (config == null) {
      config = defaultConfig;
    }
    context.view.documentFragment.showAddWatermarkDialog(config);
  }

  /**
   * Handles show security view.
   */
  void showSecurityView(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return;
    }
    context.view.documentFragment.showSecurityDialog();
  }

  /**
   * Handles show display setting view.
   */
  void showDisplaySettingView(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return;
    }
    context.view.documentFragment.showDisplaySettings(context.viewCtrl);
  }

  /**
   * Handles show document info view.
   */
  void showDocumentInfoView(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return;
    }
    context.view.documentFragment.showDocumentInfo(context.view.documentFragment.pdfView);
  }

  /**
   * Handles enter snip mode.
   */
  void enterSnipMode(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return;
    }
    context.view.documentFragment.enterSnipMode();
  }

  /**
   * Handles exit snip mode.
   */
  void exitSnipMode(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return;
    }
    context.view.documentFragment.exitSnipMode();
  }

  /**
   * Clears display rect.
   */
  void clearDisplayRect(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.setDisplayPageRectangles(null);
    context.readerView.setShowDisplayPageRect(false);
  }

  /**
   * Dismisses context menu.
   */
  void dismissContextMenu(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return;
    }
    CPDFReaderView readerView = context.readerView;
    if (readerView.getContextMenuShowListener() != null) {
      readerView.getContextMenuShowListener().dismissContextMenu();
    }
  }

  /**
   * Handles show search text view.
   */
  void showSearchTextView(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return;
    }
    context.view.documentFragment.showTextSearchView();
  }

  /**
   * Handles hide search text view.
   */
  void hideSearchTextView(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return;
    }
    context.view.documentFragment.hideTextSearchView();
  }

  /**
   * Saves current ink.
   */
  void saveCurrentInk(RnPdfViewContext context) {
    if (!isAvailable(context)) {
      return;
    }
    context.readerView.getInkDrawHelper().onSave();
  }

  /**
   * Converts screen rect f.
   */
  private RectF convertScreenRectF(CPDFReaderView readerView, int pageIndex, RectF pageRectF) {
    if (readerView == null || readerView.getPDFDocument() == null) {
      return pageRectF;
    }
    CPDFPage page = readerView.getPDFDocument().pageAtIndex(pageIndex);
    RectF screenPageRect = readerView.getPageSize(pageIndex);
    return page.convertRectFromPage(readerView.isCropMode(), screenPageRect.width(),
      screenPageRect.height(), pageRectF);
  }
}
