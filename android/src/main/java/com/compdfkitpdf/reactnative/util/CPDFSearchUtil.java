/*
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 *
 */

package com.compdfkitpdf.reactnative.util;

import android.content.Context;
import android.util.Log;
import androidx.annotation.Nullable;
import com.compdfkit.core.document.CPDFDocument;
import com.compdfkit.core.page.CPDFPage;
import com.compdfkit.core.page.CPDFTextPage;
import com.compdfkit.core.page.CPDFTextRange;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl;
import com.compdfkit.ui.textsearch.CPDFTextSearcher;
import com.compdfkit.ui.textsearch.ITextSearcher;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import java.util.List;


public class CPDFSearchUtil {


  /**
   * Searches for keywords in the given PDF document using the specified text searcher.
   *
   * @param document       The PDF document to search within.
   * @param iTextSearcher  The text searcher to use for searching.
   * @param keywords       The keywords to search for.
   * @param searchOptions  Options for the search, such as case sensitivity and whole word matching.
   * @see com.compdfkit.core.page.CPDFTextSearcher.PDFSearchOptions#PDFSearchCaseInsensitive
   * @see com.compdfkit.core.page.CPDFTextSearcher.PDFSearchOptions#PDFSearchCaseSensitive
   * @see com.compdfkit.core.page.CPDFTextSearcher.PDFSearchOptions#PDFSearchMatchWholeWord
   * @see com.compdfkit.core.page.CPDFTextSearcher.PDFSearchOptions#PDFSearchConsecutive
   */
  public static WritableArray search(CPDFDocument document, ITextSearcher iTextSearcher, String keywords, int searchOptions) {
    Log.i("ComPDFKit", "Android --- Searching for keywords: " + keywords);
    WritableArray searchResults = Arguments.createArray();
    iTextSearcher.setSearchConfig(keywords, searchOptions);
    for (int pageIndex = 0; pageIndex < document.getPageCount(); pageIndex++) {
      CPDFPage page = document.pageAtIndex(pageIndex);
      List<CPDFTextRange> textRanges = iTextSearcher.searchKeyword(pageIndex);
      for (int i = 0; i < textRanges.size(); i++) {
        CPDFTextRange textRange = textRanges.get(i);
        WritableMap result = Arguments.createMap();
        result.putInt("pageIndex", page.getPageNum());
        result.putInt("location", textRange.location);
        result.putInt("length", textRange.length);
        result.putInt("textRangeIndex", i);
        searchResults.pushMap(result);
      }
    }
    Log.i("ComPDFKit", "Android --- Search completed with " + searchResults.size() + " results.");
    return searchResults;
  }

  public static void selection(Context context,  @Nullable CPDFViewCtrl pdfView, CPDFDocument document, int pageIndex, int textRangeIndex){
    ITextSearcher iTextSearcher = getTextSearcher(context, pdfView, document);
    iTextSearcher.searchBegin(pageIndex, textRangeIndex);
    if (pdfView != null) {
      pdfView.getCPdfReaderView().invalidateAllChildren();
    }
  }

  public static void clearSearch(Context context, @Nullable CPDFViewCtrl pdfView,  CPDFDocument document){
    ITextSearcher iTextSearcher = getTextSearcher(context, pdfView, document);
    iTextSearcher.cancelSearch();
    if (pdfView != null) {
      pdfView.getCPdfReaderView().invalidateAllChildren();
    }
  }

  public static String getText(CPDFDocument document, int pageIndex, int location, int length) {
    CPDFPage page = document.pageAtIndex(pageIndex);
    CPDFTextPage textPage = page.getTextPage();
    CPDFTextRange range = new CPDFTextRange(location, length);
    return textPage.getText(range);
  }

  private static ITextSearcher getTextSearcher(Context context, @Nullable CPDFViewCtrl pdfView, CPDFDocument document) {
    if (pdfView != null) {
      return pdfView.getCPdfReaderView().getTextSearcher();
    } else {
      return new CPDFTextSearcher(context, document);
    }
  }

}
