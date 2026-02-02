/*
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 *
 */
package com.compdfkitpdf.reactnative.util;


import android.graphics.Color;
import android.util.Log;
import com.compdfkit.core.annotation.CPDFBorderStyle;
import com.compdfkit.core.annotation.CPDFBorderStyle.Style;
import com.compdfkit.core.annotation.CPDFLineAnnotation.LineType;
import com.compdfkit.core.annotation.CPDFTextAttribute;
import com.compdfkit.tools.common.pdf.config.annot.AnnotShapeAttr.AnnotLineType;
import com.compdfkit.tools.common.views.pdfproperties.pdfstyle.CAnnotStyle;
import com.compdfkit.tools.common.views.pdfproperties.pdfstyle.CAnnotStyle.Alignment;
import com.compdfkit.tools.common.views.pdfproperties.pdfstyle.CStyleType;
import com.compdfkit.tools.common.views.pdfproperties.pdfstyle.manager.CStyleManager;
import com.compdfkit.tools.common.views.pdfproperties.pdfstyle.manager.provider.CGlobalStyleProvider;
import com.compdfkit.tools.common.views.pdfproperties.pdfstyle.manager.provider.CSelectedAnnotStyleProvider;
import com.compdfkit.tools.common.views.pdfview.CPDFViewCtrl;
import com.compdfkit.ui.attribute.CPDFAnnotAttribute;
import com.compdfkit.ui.attribute.CPDFCircleAttr;
import com.compdfkit.ui.attribute.CPDFFreetextAttr;
import com.compdfkit.ui.attribute.CPDFHighlightAttr;
import com.compdfkit.ui.attribute.CPDFInkAttr;
import com.compdfkit.ui.attribute.CPDFLineAttr;
import com.compdfkit.ui.attribute.CPDFReaderAttribute;
import com.compdfkit.ui.attribute.CPDFSquareAttr;
import com.compdfkit.ui.attribute.CPDFSquigglyAttr;
import com.compdfkit.ui.attribute.CPDFStrikeoutAttr;
import com.compdfkit.ui.attribute.CPDFTextAttr;
import com.compdfkit.ui.attribute.CPDFUnderlineAttr;
import com.compdfkit.ui.attribute.form.CPDFCheckboxAttr;
import com.compdfkit.ui.attribute.form.CPDFComboboxAttr;
import com.compdfkit.ui.attribute.form.CPDFListboxAttr;
import com.compdfkit.ui.attribute.form.CPDFPushButtonAttr;
import com.compdfkit.ui.attribute.form.CPDFRadiobuttonAttr;
import com.compdfkit.ui.attribute.form.CPDFSignatureWidgetAttr;
import com.compdfkit.ui.attribute.form.CPDFTextfieldAttr;
import com.compdfkit.ui.reader.CPDFReaderView;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

public class CPDFAttrUtils {

  public static HashMap<String, Object> getDefaultAnnotAttr(CPDFViewCtrl pdfView) {
    HashMap<String, Object> annotAttr = new HashMap<>();
    CPDFReaderView readerView = pdfView.getCPdfReaderView();
    CPDFReaderAttribute readerAttribute = readerView.getReaderAttribute();
    CPDFAnnotAttribute annotAttribute = readerAttribute.getAnnotAttribute();
    annotAttr.put("note", getNoteAttr(annotAttribute.getTextAttr()));
    annotAttr.put("highlight", getHighlightAttr(annotAttribute.getHighlightAttr()));
    annotAttr.put("strikeout", getStrikeoutAttr(annotAttribute.getStrikeoutAttr()));
    annotAttr.put("underline", getUnderlineAttr(annotAttribute.getUnderlineAttr()));
    annotAttr.put("squiggly", getSquigglyAttr(annotAttribute.getSquigglyAttr()));
    annotAttr.put("ink", getInkAttr(annotAttribute.getInkAttr()));
    annotAttr.put("square", getSquareAttr(annotAttribute.getSquareAttr()));
    annotAttr.put("circle", getCircleAttr(annotAttribute.getCircleAttr()));
    annotAttr.put("line", getLineAttr(annotAttribute.getLineAttr()));
    annotAttr.put("arrow", getArrowAttr(pdfView));
    annotAttr.put("freetext", getFreetextAttr(annotAttribute.getFreetextAttr()));
    return annotAttr;
  }

  private static Map<String, Object> getNoteAttr(CPDFTextAttr textAttr){
    Map<String, Object> noteAttr = new HashMap<>();
    noteAttr.put("color", CAppUtils.toHexColor(textAttr.getColor()));
    noteAttr.put("alpha", (double) textAttr.getAlpha());
    return noteAttr;
  }

  private static Map<String, Object> getHighlightAttr(CPDFHighlightAttr highlightAttr) {
    Map<String, Object> markupAttr = new HashMap<>();
    // Add other markup attributes as needed
    markupAttr.put("color", CAppUtils.toHexColor(highlightAttr.getColor()));
    markupAttr.put("alpha", (double) highlightAttr.getAlpha());
    return markupAttr;
  }

  private static Map<String, Object> getStrikeoutAttr(CPDFStrikeoutAttr strikeoutAttr) {
    Map<String, Object> strikeoutAttrMap = new HashMap<>();
    // Add other strikeout attributes as needed
    strikeoutAttrMap.put("color", CAppUtils.toHexColor(strikeoutAttr.getColor()));
    strikeoutAttrMap.put("alpha", (double) strikeoutAttr.getAlpha());
    return strikeoutAttrMap;
  }

  private static Map<String, Object> getUnderlineAttr(CPDFUnderlineAttr underlineAttr) {
    Map<String, Object> underlineMap = new HashMap<>();
    // Add other text attributes as needed
    underlineMap.put("color",CAppUtils.toHexColor(underlineAttr.getColor()));
    underlineMap.put("alpha", (double) underlineAttr.getAlpha());
    return underlineMap;
  }

  private static Map<String, Object> getSquigglyAttr(CPDFSquigglyAttr squigglyAttr) {
    Map<String, Object> squigglyMap = new HashMap<>();
    // Add other squiggly attributes as needed
    squigglyMap.put("color", CAppUtils.toHexColor(squigglyAttr.getColor()));
    squigglyMap.put("alpha", (double) squigglyAttr.getAlpha());
    return squigglyMap;
  }

  private static Map<String, Object> getInkAttr(CPDFInkAttr inkAttr) {
    Map<String, Object> inkMap = new HashMap<>();
    // Add other ink attributes as needed
    inkMap.put("color", CAppUtils.toHexColor(inkAttr.getColor()));
    inkMap.put("alpha", (double) inkAttr.getAlpha());
    inkMap.put("borderWidth", inkAttr.getBorderWidth());
    return inkMap;
  }

  private static Map<String, Object> getSquareAttr(CPDFSquareAttr squareAttr){
    Map<String, Object> squareMap = new HashMap<>();
    squareMap.put("fillColor", CAppUtils.toHexColor( squareAttr.getFillColor()));
    squareMap.put("borderColor", CAppUtils.toHexColor(squareAttr.getBorderColor()));
    squareMap.put("colorAlpha", (double) squareAttr.getFillAlpha());
    squareMap.put("borderWidth",  squareAttr.getBorderWidth());
    squareMap.put("borderStyle", getBorderStyleAttr(squareAttr.getBorderStyle()));
    return squareMap;
  }

  private static Map<String, Object> getCircleAttr(CPDFCircleAttr circleAttr) {
    Map<String, Object> circleAttrMap = new HashMap<>();
    circleAttrMap.put("fillColor", CAppUtils.toHexColor(circleAttr.getFillColor()));
    circleAttrMap.put("borderColor", CAppUtils.toHexColor(circleAttr.getBorderColor()));
    circleAttrMap.put("colorAlpha",  (double) circleAttr.getFillAlpha());
    circleAttrMap.put("borderWidth",  circleAttr.getBorderWidth());
    circleAttrMap.put("borderStyle", getBorderStyleAttr(circleAttr.getBorderStyle()));
    return circleAttrMap;
  }

  private static Map<String, Object> getLineAttr(CPDFLineAttr lineAttr) {
    Map<String, Object> lineAttrMap = new HashMap<>();
    lineAttrMap.put("fillColor", CAppUtils.toHexColor(lineAttr.getFillColor()));
    lineAttrMap.put("borderColor", CAppUtils.toHexColor(lineAttr.getBorderColor()));
    lineAttrMap.put("borderAlpha",  (double) lineAttr.getBorderAlpha());
    lineAttrMap.put("borderWidth",  lineAttr.getBorderWidth());
    lineAttrMap.put("borderStyle", getBorderStyleAttr(lineAttr.getBorderStyle()));
    return lineAttrMap;
  }

  private static Map<String, Object> getArrowAttr(CPDFViewCtrl pdfView){
    Map<String, Object> arrowAttrMap = new HashMap<>();
    CGlobalStyleProvider globalStyleProvider = new CGlobalStyleProvider(pdfView, false);
    CAnnotStyle annotStyle = globalStyleProvider.getStyle(CStyleType.ANNOT_ARROW);
    if (annotStyle != null) {
      arrowAttrMap.put("fillColor", CAppUtils.toHexColor(annotStyle.getFillColor()));
      arrowAttrMap.put("borderColor", CAppUtils.toHexColor(annotStyle.getLineColor()));
      arrowAttrMap.put("borderAlpha",  (double) annotStyle.getLineColorOpacity());
      arrowAttrMap.put("borderWidth",  annotStyle.getBorderWidth());
      arrowAttrMap.put("borderStyle", getBorderStyleAttr(annotStyle.getBorderStyle()));
      arrowAttrMap.put("startLineType", CPDFEnumConvertUtil.lineTypeToString(annotStyle.getStartLineType()));
      arrowAttrMap.put("tailLineType", CPDFEnumConvertUtil.lineTypeToString(annotStyle.getTailLineType()));
    }
    return arrowAttrMap;
  }

  private static Map<String, Object> getFreetextAttr(CPDFFreetextAttr freetextAttr){
    Map<String, Object> freetextMap = new HashMap<>();
    CPDFTextAttribute textAttribute = freetextAttr.getTextAttribute();
    freetextMap.put("fontColor", CAppUtils.toHexColor(textAttribute.getColor()));
    freetextMap.put("fontSize",  textAttribute.getFontSize());
    freetextMap.put("fontColorAlpha",  (double) freetextAttr.getAlpha());
    String psName = textAttribute.getFontName();
    String[] names = CPDFEnumConvertUtil.parseFamilyAndStyleFromPsName(psName);

    freetextMap.put("familyName", names[0]);
    freetextMap.put("styleName", names[1]);

    freetextMap.put("alignment", CPDFEnumConvertUtil.freeTextAlignmentToString(freetextAttr.getAlignment()));
    return freetextMap;
  }

  private static Map<String, Object> getBorderStyleAttr(CPDFBorderStyle borderStyle){
    Map<String, Object> borderStyleMap = new HashMap<>();
    borderStyleMap.put("width", borderStyle.getBorderWidth());
    if (Objects.requireNonNull(borderStyle.getStyle()) == Style.Border_Dashed) {
      borderStyleMap.put("style", "dashed");
    } else {
      borderStyleMap.put("style", "solid");
    }
    if (borderStyle.getDashArr() != null && borderStyle.getDashArr().length > 1) {
      borderStyleMap.put("dashGap", borderStyle.getDashArr()[1]);
    }
    return borderStyleMap;
  }

  public static void setDefaultAnnotAttr(CPDFViewCtrl pdfView, String type, Map<String, Object> attrMap){
    switch (type){
      case "note":
        setNoteAttr(pdfView, attrMap);
        break;
      case "highlight":
        setMarkupAttr(pdfView, CStyleType.ANNOT_HIGHLIGHT, attrMap);
        break;
      case "underline":
        setMarkupAttr(pdfView, CStyleType.ANNOT_UNDERLINE, attrMap);
        break;
      case "strikeout":
        setMarkupAttr(pdfView, CStyleType.ANNOT_STRIKEOUT, attrMap);
        break;
      case "squiggly":
        setMarkupAttr(pdfView, CStyleType.ANNOT_SQUIGGLY, attrMap);
        break;
      case "ink":
        setInkAttr(pdfView, attrMap);
        break;
      case "circle":
        setShapeAttr(pdfView, CStyleType.ANNOT_CIRCLE, attrMap);
        break;
      case "square":
        setShapeAttr(pdfView, CStyleType.ANNOT_SQUARE, attrMap);
        break;
      case "line":
        setShapeAttr(pdfView, CStyleType.ANNOT_LINE, attrMap);
        break;
      case "arrow":
        setArrowAttr(pdfView, attrMap);
        break;
      case "freetext":
        setFreetextAttr(pdfView, attrMap);
        break;
      case "textField":
        setTextFieldAttr(pdfView, attrMap);
        break;
      case "checkBox":
        setCheckBoxAttr(pdfView, attrMap);
        break;
      case "radioButton":
        setRadioButtonAttr(pdfView, attrMap);
        break;
      case "comboBox":
        setComboBoxAttr(pdfView, attrMap);
        break;
      case "listBox":
        setListBoxAttr(pdfView, attrMap);
        break;
      case "signaturesFields":
        setFormSignAttr(pdfView, attrMap);
        break;
      case "pushButton":
        setPushButtonAttr(pdfView, attrMap);
        break;
      default:
        break;
    }
  }

  private static void setNoteAttr(CPDFViewCtrl pdfView,  Map<String, Object> noteAttrMap){
    CStyleManager manager = new CStyleManager(new CGlobalStyleProvider(pdfView.getCPdfReaderView(), true));
    CAnnotStyle noteStyle = manager.getStyle(CStyleType.ANNOT_TEXT);
    if (noteAttrMap.get("color") != null){
      noteStyle.setColor(Color.parseColor((String) noteAttrMap.get("color")));
    }
    if (noteAttrMap.get("alpha") != null){
      double alpha = (double) noteAttrMap.get("alpha");
      noteStyle.setOpacity((int) alpha);
    }
    manager.updateStyle(noteStyle);
  }

  private static void setMarkupAttr(CPDFViewCtrl pdfView, CStyleType type,  Map<String, Object> attrMap){
    CStyleManager manager = new CStyleManager(new CGlobalStyleProvider(pdfView.getCPdfReaderView(), true));
    CAnnotStyle style = manager.getStyle(type);
    if (attrMap.get("color") != null){
      style.setColor(Color.parseColor((String) attrMap.get("color")));
    }
    if (attrMap.get("alpha") != null){
      double alpha = (double) attrMap.get("alpha");
      style.setOpacity((int) alpha);
    }
    manager.updateStyle(style);
  }

  private static void setInkAttr(CPDFViewCtrl pdfView, Map<String, Object> attrMap){
    CStyleManager manager = new CStyleManager(new CGlobalStyleProvider(pdfView.getCPdfReaderView(), true));
    CAnnotStyle style = manager.getStyle(CStyleType.ANNOT_INK);
    if (attrMap.get("color") != null){
      style.setColor(Color.parseColor((String) attrMap.get("color")));
    }
    if (attrMap.get("alpha") != null){
      double alpha = (double) attrMap.get("alpha");
      style.setOpacity((int) alpha);
    }

    if (attrMap.get("borderWidth") != null){
      double borderWidth = (double) attrMap.get("borderWidth");
      style.setBorderWidth((float) borderWidth);
    }
    manager.updateStyle(style);
  }

  private static void setShapeAttr(CPDFViewCtrl pdfView,  CStyleType styleType, Map<String, Object> attrMap) {
    CStyleManager manager = new CStyleManager(new CGlobalStyleProvider(pdfView.getCPdfReaderView(), true));
    CAnnotStyle style = manager.getStyle(styleType);
    if( attrMap.get("fillColor") != null){
      style.setFillColor(Color.parseColor((String) attrMap.get("fillColor")));
    }
    if( attrMap.get("borderColor") != null){
      style.setBorderColor(Color.parseColor((String) attrMap.get("borderColor")));
    }
    if( attrMap.get("colorAlpha") != null){
      double colorAlpha = (double) attrMap.get("colorAlpha");
      style.setFillColorOpacity((int) colorAlpha);
      style.setLineColorOpacity((int) colorAlpha);
    }
    if(attrMap.get("borderAlpha") != null){
      // line shape
      double colorAlpha = (double) attrMap.get("borderAlpha");
      style.setFillColorOpacity((int) colorAlpha);
      style.setLineColorOpacity((int) colorAlpha);
    }
    if( attrMap.get("borderWidth") != null){
      double borderWidth = (double) attrMap.get("borderWidth");
      style.setBorderWidth((float) borderWidth);
    }
    if( attrMap.get("borderStyle") != null){
      Map<String, Object> borderStyle = (Map<String, Object>) attrMap.get("borderStyle");
      if (borderStyle.get("style") != null && borderStyle.get("dashGap") != null) {
        String styleStr = (String) borderStyle.get("style");
        double dashGap = (double) borderStyle.get("dashGap");
        Style borderStyleEnum = styleStr.equals("solid") ? Style.Border_Solid : Style.Border_Dashed;
        style.setBorderStyle(new CPDFBorderStyle(borderStyleEnum, style.getBorderWidth(), new float[]{8.0F, (float) dashGap}));
      }
    }
    if (attrMap.get("startLineType") != null) {
      String startLineTypeStr = (String) attrMap.get("startLineType");
      style.setStartLineType(CPDFEnumConvertUtil.stringToLineType(startLineTypeStr));
    }
    if (attrMap.get("tailLineType") != null) {
      String tailLineTypeStr = (String) attrMap.get("tailLineType");
      style.setTailLineType(CPDFEnumConvertUtil.stringToLineType(tailLineTypeStr));
    }
    manager.updateStyle(style);
  }

  private static void setArrowAttr(CPDFViewCtrl pdfView, Map<String, Object> attrMap) {
    CStyleManager manager = new CStyleManager(new CGlobalStyleProvider(pdfView.getCPdfReaderView(), true));
    CAnnotStyle arrowAttr = manager.getStyle(CStyleType.ANNOT_ARROW);

    if (attrMap.get("borderColor") != null) {
      arrowAttr.setBorderColor(Color.parseColor((String) attrMap.get("borderColor")));
      arrowAttr.setFillColor(Color.parseColor((String) attrMap.get("borderColor")));
    }
    if (attrMap.get("borderAlpha") != null) {
      double borderAlpha = (double) attrMap.get("borderAlpha");
      arrowAttr.setFillColorOpacity((int) borderAlpha);
      arrowAttr.setLineColorOpacity((int) borderAlpha);
    }
    if (attrMap.get("borderWidth") != null) {
      double borderWidth = (double) attrMap.get("borderWidth");
      arrowAttr.setBorderWidth((float) borderWidth);
    }
    if (attrMap.get("borderStyle") != null) {
      Map<String, Object> borderStyle = (Map<String, Object>) attrMap.get("borderStyle");
      if (borderStyle.get("style") != null && borderStyle.get("dashGap") != null) {
        String styleStr = (String) borderStyle.get("style");
        double dashGap = (double) borderStyle.get("dashGap");
        Style style = styleStr.equals("solid") ? Style.Border_Solid : Style.Border_Dashed;
        arrowAttr.setBorderStyle(new CPDFBorderStyle(style, arrowAttr.getBorderWidth(), new float[]{8.0F, (float) dashGap}));
      }
    }
    if (attrMap.get("startLineType") != null) {
      String startLineTypeStr = (String) attrMap.get("startLineType");
      arrowAttr.setStartLineType(CPDFEnumConvertUtil.stringToLineType(startLineTypeStr));
    }
    if (attrMap.get("tailLineType") != null) {
      String tailLineTypeStr = (String) attrMap.get("tailLineType");
      arrowAttr.setTailLineType(CPDFEnumConvertUtil.stringToLineType(tailLineTypeStr));
    }
    manager.updateStyle(arrowAttr);
  }

  private static void setFreetextAttr(CPDFViewCtrl pdfView, Map<String, Object> freetextAttrMap) {
    CStyleManager manager = new CStyleManager(new CGlobalStyleProvider(pdfView.getCPdfReaderView(), true));
    CAnnotStyle freetextAttr = manager.getStyle(CStyleType.ANNOT_FREETEXT);

    if (freetextAttrMap.get("fontColor") != null) {
      freetextAttr.setFontColor(Color.parseColor((String) freetextAttrMap.get("fontColor")));
    }
    if (freetextAttrMap.get("fontSize") != null) {
      double fontSize = (double) freetextAttrMap.get("fontSize");
      freetextAttr.setFontSize((int) fontSize);
    }
    if (freetextAttrMap.get("fontColorAlpha") != null) {
      double fontColorAlpha = (double) freetextAttrMap.get("fontColorAlpha");
      freetextAttr.setTextColorOpacity((int) fontColorAlpha);
    }

    if (freetextAttrMap.get("familyName") != null && freetextAttrMap.get("styleName") != null){
      String familyName = (String) freetextAttrMap.get("familyName");
      String styleName = (String) freetextAttrMap.get("styleName");
      String psName = CPDFTextAttribute.FontNameHelper.obtainFontName(familyName, styleName);
      freetextAttr.setExternFontName(psName);
    }

    if (freetextAttrMap.get("alignment") != null){
      String alignment = (String) freetextAttrMap.get("alignment");
      freetextAttr.setAlignment(Alignment.valueOf(alignment.toUpperCase()));
    }

    manager.updateStyle(freetextAttr);
  }

  private static void setTextFieldAttr(CPDFViewCtrl pdfView, Map<String, Object> attrMap){
    CStyleManager manager = new CStyleManager(new CGlobalStyleProvider(pdfView.getCPdfReaderView(), true));
    CAnnotStyle style = manager.getStyle(CStyleType.FORM_TEXT_FIELD);
    if (attrMap.get("fillColor") != null) {
      style.setFillColor(Color.parseColor((String) attrMap.get("fillColor")));
    }
    if (attrMap.get("borderColor") != null) {
      style.setBorderColor(Color.parseColor((String) attrMap.get("borderColor")));
    }
    if (attrMap.get("borderWidth") != null) {
      style.setBorderWidth(((Double) attrMap.get("borderWidth")).floatValue());
    }
    if (attrMap.get("fontColor") != null) {
      style.setFontColor(Color.parseColor((String) attrMap.get("fontColor")));
    }
    if (attrMap.get("fontSize") != null) {
      style.setFontSize(((Double) attrMap.get("fontSize")).intValue());
    }
    if (attrMap.get("familyName") != null && attrMap.get("styleName") != null) {
      String familyName = (String) attrMap.get("familyName");
      String styleName = (String) attrMap.get("styleName");
      String psName = CPDFTextAttribute.FontNameHelper.obtainFontName(familyName, styleName);
      style.setExternFontName(psName);
    }
    if (attrMap.get("multiline") != null) {
      style.setFormMultiLine((Boolean) attrMap.get("multiline"));
    }
    if (attrMap.get("alignment") != null) {
      String alignment = (String) attrMap.get("alignment");
      style.setAlignment(Alignment.valueOf(alignment.toUpperCase()));
    }
    manager.updateStyle(style);
  }

  private static void setCheckBoxAttr(CPDFViewCtrl pdfView, Map<String, Object> attrMap) {
    CStyleManager manager = new CStyleManager(new CGlobalStyleProvider(pdfView.getCPdfReaderView(), true));
    CAnnotStyle style = manager.getStyle(CStyleType.FORM_CHECK_BOX);
    if (attrMap.get("fillColor") != null) {
      style.setFillColor(Color.parseColor((String) attrMap.get("fillColor")));
    }
    if (attrMap.get("borderColor") != null) {
      style.setBorderColor(Color.parseColor((String) attrMap.get("borderColor")));
    }
    if (attrMap.get("borderWidth") != null) {
      style.setBorderWidth(((Double) attrMap.get("borderWidth")).floatValue());
    }
    if (attrMap.get("checkedColor") != null) {
      style.setColor(Color.parseColor((String) attrMap.get("checkedColor")));
    }
    if (attrMap.get("isChecked") != null) {
      style.setChecked((Boolean) attrMap.get("isChecked"));
    }
    if (attrMap.get("checkedStyle") != null) {
      String checkedStyle = (String) attrMap.get("checkedStyle");
      style.setCheckStyle(CPDFEnumConvertUtil.stringToCheckStyle(checkedStyle));
    }
    manager.updateStyle(style);
  }

  private static void setRadioButtonAttr(CPDFViewCtrl pdfView, Map<String, Object> attrMap) {
    CStyleManager manager = new CStyleManager(new CGlobalStyleProvider(pdfView.getCPdfReaderView(), true));
    CAnnotStyle style = manager.getStyle(CStyleType.FORM_RADIO_BUTTON);
    if (attrMap.get("fillColor") != null) {
      style.setFillColor(Color.parseColor((String) attrMap.get("fillColor")));
    }
    if (attrMap.get("borderColor") != null) {
      style.setBorderColor(Color.parseColor((String) attrMap.get("borderColor")));
    }
    if (attrMap.get("borderWidth") != null) {
      style.setBorderWidth(((Double) attrMap.get("borderWidth")).floatValue());
    }
    if (attrMap.get("checkedColor") != null) {
      style.setColor(Color.parseColor((String) attrMap.get("checkedColor")));
    }
    if (attrMap.get("isChecked") != null) {
      style.setChecked((Boolean) attrMap.get("isChecked"));
    }
    if (attrMap.get("checkedStyle") != null) {
      String checkedStyle = (String) attrMap.get("checkedStyle");
      style.setCheckStyle(CPDFEnumConvertUtil.stringToCheckStyle(checkedStyle));
    }
    manager.updateStyle(style);
  }

  private static void setListBoxAttr(CPDFViewCtrl pdfView, Map<String, Object> attrMap) {
    CStyleManager manager = new CStyleManager(new CGlobalStyleProvider(pdfView.getCPdfReaderView(), true));
    CAnnotStyle style = manager.getStyle(CStyleType.FORM_LIST_BOX);
    if (attrMap.get("fillColor") != null) {
      style.setFillColor(Color.parseColor((String) attrMap.get("fillColor")));
    }
    if (attrMap.get("borderColor") != null) {
      style.setBorderColor(Color.parseColor((String) attrMap.get("borderColor")));
    }
    if (attrMap.get("borderWidth") != null) {
      style.setBorderWidth(((Double) attrMap.get("borderWidth")).floatValue());
    }
    if (attrMap.get("fontColor") != null) {
      style.setFontColor(Color.parseColor((String) attrMap.get("fontColor")));
    }
    if (attrMap.get("fontSize") != null) {
      style.setFontSize(((Double) attrMap.get("fontSize")).intValue());
    }
    if (attrMap.get("familyName") != null && attrMap.get("styleName") != null) {
      String familyName = (String) attrMap.get("familyName");
      String styleName = (String) attrMap.get("styleName");
      String psName = CPDFTextAttribute.FontNameHelper.obtainFontName(familyName, styleName);
      style.setExternFontName(psName);
    }
    manager.updateStyle(style);
  }

  private static void setComboBoxAttr(CPDFViewCtrl pdfView, Map<String, Object> attrMap) {
    CStyleManager manager = new CStyleManager(new CGlobalStyleProvider(pdfView.getCPdfReaderView(), true));
    CAnnotStyle style = manager.getStyle(CStyleType.FORM_COMBO_BOX);
    if (attrMap.get("fillColor") != null) {
      style.setFillColor(Color.parseColor((String) attrMap.get("fillColor")));
    }
    if (attrMap.get("borderColor") != null) {
      style.setBorderColor(Color.parseColor((String) attrMap.get("borderColor")));
    }
    if (attrMap.get("borderWidth") != null) {
      style.setBorderWidth(((Double) attrMap.get("borderWidth")).floatValue());
    }
    if (attrMap.get("fontColor") != null) {
      style.setFontColor(Color.parseColor((String) attrMap.get("fontColor")));
    }
    if (attrMap.get("fontSize") != null) {
      style.setFontSize(((Double) attrMap.get("fontSize")).intValue());
    }
    if (attrMap.get("familyName") != null && attrMap.get("styleName") != null) {
      String familyName = (String) attrMap.get("familyName");
      String styleName = (String) attrMap.get("styleName");
      String psName = CPDFTextAttribute.FontNameHelper.obtainFontName(familyName, styleName);
      style.setExternFontName(psName);
    }
    manager.updateStyle(style);

  }

  private static void setFormSignAttr(CPDFViewCtrl pdfView, Map<String, Object> attrMap) {
    CStyleManager manager = new CStyleManager(new CGlobalStyleProvider(pdfView.getCPdfReaderView(), true));
    CAnnotStyle style = manager.getStyle(CStyleType.FORM_SIGNATURE_FIELDS);
    if (attrMap.get("fillColor") != null) {
      style.setFillColor(Color.parseColor((String) attrMap.get("fillColor")));
    }
    if (attrMap.get("borderColor") != null) {
      style.setBorderColor(Color.parseColor((String) attrMap.get("borderColor")));
    }
    if (attrMap.get("borderWidth") != null) {
      style.setBorderWidth(((Double) attrMap.get("borderWidth")).floatValue());
    }
    manager.updateStyle(style);

  }

  private static void setPushButtonAttr(CPDFViewCtrl pdfView, Map<String, Object> attrMap){
    CStyleManager manager = new CStyleManager(new CGlobalStyleProvider(pdfView.getCPdfReaderView(), true));
    CAnnotStyle style = manager.getStyle(CStyleType.FORM_PUSH_BUTTON);
    if (attrMap.get("fillColor") != null) {
      style.setFillColor(Color.parseColor((String) attrMap.get("fillColor")));
    }
    if (attrMap.get("borderColor") != null) {
      style.setBorderColor(Color.parseColor((String) attrMap.get("borderColor")));
    }
    if (attrMap.get("borderWidth") != null) {
      style.setBorderWidth(((Double) attrMap.get("borderWidth")).floatValue());
    }
    if (attrMap.get("fontColor") != null) {
      style.setFontColor(Color.parseColor((String) attrMap.get("fontColor")));
    }
    if (attrMap.get("fontSize") != null) {
      style.setFontSize(((Double) attrMap.get("fontSize")).intValue());
    }
    if (attrMap.get("familyName") != null && attrMap.get("styleName") != null) {
      String familyName = (String) attrMap.get("familyName");
      String styleName = (String) attrMap.get("styleName");
      String psName = CPDFTextAttribute.FontNameHelper.obtainFontName(familyName, styleName);
      style.setExternFontName(psName);
    }
    if (attrMap.get("title") != null){
      style.setFormDefaultValue((String) attrMap.get("title"));
    }
    manager.updateStyle(style);
  }



  public static HashMap<String, Object> getDefaultWidgetAttr(CPDFViewCtrl pdfView) {
    HashMap<String, Object> widgetAttr = new HashMap<>();
    CPDFReaderView readerView = pdfView.getCPdfReaderView();
    CPDFReaderAttribute readerAttribute = readerView.getReaderAttribute();
    CPDFAnnotAttribute annotAttribute = readerAttribute.getAnnotAttribute();
    widgetAttr.put("textField", getTextFieldAttr(annotAttribute.getTextfieldAttr()));
    widgetAttr.put("checkBox", getCheckBoxAttr(annotAttribute.getCheckboxAttr()));
    widgetAttr.put("radioButton", getRadioButtonAttr(annotAttribute.getRadiobuttonAttr()));
    widgetAttr.put("listBox", getListBoxAttr(annotAttribute.getListboxAttr()));
    widgetAttr.put("comboBox", getComboBoxAttr(annotAttribute.getComboboxAttr()));
    widgetAttr.put("pushButton", getPushButtonAttr(annotAttribute.getPushButtonAttr()));
    widgetAttr.put("signaturesFields", getSignatureWidgetAttr(annotAttribute.getSignatureWidgetAttr()));
    return widgetAttr;
  }

  private static Map<String, Object> getTextFieldAttr(CPDFTextfieldAttr textFieldAttr){
    Map<String, Object> map = new HashMap<>();
    map.put("fillColor", CAppUtils.toHexColor(textFieldAttr.getFillColor()));
    map.put("borderColor", CAppUtils.toHexColor(textFieldAttr.getBorderColor()));
    map.put("borderWidth", textFieldAttr.getBorderWidth());
    map.put("fontColor", CAppUtils.toHexColor(textFieldAttr.getFontColor()));
    map.put("fontSize", textFieldAttr.getFontSize());
    map.put("alignment", CPDFEnumConvertUtil.textAlignmentToString(textFieldAttr.getTextAlignment()));
    map.put("multiline", textFieldAttr.isMultiline());
    String[] font = CPDFEnumConvertUtil.parseFamilyAndStyleFromPsName(textFieldAttr.getFontName());
    map.put("familyName", font[0]);
    map.put("styleName", font[1]);
    return map;
  }

  private static Map<String, Object> getCheckBoxAttr(CPDFCheckboxAttr checkboxAttr) {
    Map<String, Object> map = new HashMap<>();
    map.put("fillColor", CAppUtils.toHexColor(checkboxAttr.getFillColor()));
    map.put("borderColor", CAppUtils.toHexColor(checkboxAttr.getBorderColor()));
    map.put("borderWidth", checkboxAttr.getBorderWidth());
    map.put("checkedColor", CAppUtils.toHexColor(checkboxAttr.getColor()));
    map.put("isChecked", checkboxAttr.isChecked());
    map.put("checkedStyle", checkboxAttr.getCheckStyle().name().replaceAll("CK_", "").toLowerCase());
    return map;
  }

  private static Map<String, Object> getRadioButtonAttr(CPDFRadiobuttonAttr radiobuttonAttr) {
    Map<String, Object> map = new HashMap<>();
    map.put("fillColor", CAppUtils.toHexColor(radiobuttonAttr.getFillColor()));
    map.put("borderColor", CAppUtils.toHexColor(radiobuttonAttr.getBorderColor()));
    map.put("borderWidth", radiobuttonAttr.getBorderWidth());
    map.put("checkedColor", CAppUtils.toHexColor(radiobuttonAttr.getColor()));
    map.put("isChecked", radiobuttonAttr.isChecked());
    map.put("checkedStyle", radiobuttonAttr.getCheckStyle().name().replaceAll("CK_", "").toLowerCase());
    return map;
  }

  private static Map<String, Object> getListBoxAttr(CPDFListboxAttr listBoxAttr){
    Map<String, Object> map = new HashMap<>();
    map.put("fillColor", CAppUtils.toHexColor(listBoxAttr.getFillColor()));
    map.put("borderColor", CAppUtils.toHexColor(listBoxAttr.getBorderColor()));
    map.put("borderWidth", listBoxAttr.getBorderWidth());
    map.put("fontColor", CAppUtils.toHexColor(listBoxAttr.getFontColor()));
    map.put("fontSize", listBoxAttr.getFontSize());
    String[] font = CPDFEnumConvertUtil.parseFamilyAndStyleFromPsName(listBoxAttr.getFontName());
    map.put("familyName", font[0]);
    map.put("styleName", font[1]);
    return map;
  }

  private static Map<String, Object> getComboBoxAttr(CPDFComboboxAttr comboBoxAttr){
    Map<String, Object> map = new HashMap<>();
    map.put("fillColor", CAppUtils.toHexColor(comboBoxAttr.getFillColor()));
    map.put("borderColor", CAppUtils.toHexColor(comboBoxAttr.getBorderColor()));
    map.put("borderWidth", comboBoxAttr.getBorderWidth());
    map.put("fontColor", CAppUtils.toHexColor(comboBoxAttr.getFontColor()));
    map.put("fontSize", comboBoxAttr.getFontSize());
    String[] font = CPDFEnumConvertUtil.parseFamilyAndStyleFromPsName(comboBoxAttr.getFontName());
    map.put("familyName", font[0]);
    map.put("styleName", font[1]);
    return map;
  }

  private static Map<String, Object> getPushButtonAttr(CPDFPushButtonAttr pushButtonAttr){
    Map<String, Object> map = new HashMap<>();
    map.put("title", pushButtonAttr.getButtonTitle());
    map.put("fillColor", CAppUtils.toHexColor(pushButtonAttr.getFillColor()));
    map.put("borderColor", CAppUtils.toHexColor(pushButtonAttr.getBorderColor()));
    map.put("borderWidth", pushButtonAttr.getBorderWidth());
    map.put("fontColor", CAppUtils.toHexColor(pushButtonAttr.getFontColor()));
    map.put("fontSize", pushButtonAttr.getFontSize());
    String[] font = CPDFEnumConvertUtil.parseFamilyAndStyleFromPsName(pushButtonAttr.getFontName());
    map.put("familyName", font[0]);
    map.put("styleName", font[1]);
    return map;
  }

  private static Map<String, Object> getSignatureWidgetAttr(CPDFSignatureWidgetAttr signatureWidgetAttr){
    Map<String, Object> map = new HashMap<>();
    map.put("fillColor", CAppUtils.toHexColor(signatureWidgetAttr.getFillColor()));
    map.put("borderColor", CAppUtils.toHexColor(signatureWidgetAttr.getBorderColor()));
    map.put("borderWidth", signatureWidgetAttr.getBorderWidth());
    return map;
  }






}
