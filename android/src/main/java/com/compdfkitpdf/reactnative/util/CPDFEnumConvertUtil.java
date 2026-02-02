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


import com.compdfkit.core.annotation.CPDFAnnotation;
import com.compdfkit.core.annotation.CPDFAnnotation.CPDFBorderEffectType;
import com.compdfkit.core.annotation.CPDFFreetextAnnotation;
import com.compdfkit.core.annotation.CPDFLineAnnotation.LineType;
import com.compdfkit.core.annotation.CPDFStampAnnotation;
import com.compdfkit.core.annotation.CPDFStampAnnotation.StampType;
import com.compdfkit.core.annotation.CPDFStampAnnotation.TextStampColor;
import com.compdfkit.core.annotation.CPDFStampAnnotation.TextStampShape;
import com.compdfkit.core.annotation.CPDFTextAlignment;
import com.compdfkit.core.annotation.form.CPDFWidget.CheckStyle;
import com.compdfkit.core.annotation.form.CPDFWidget.WidgetType;
import com.compdfkit.core.document.action.CPDFAction;
import com.compdfkit.core.document.action.CPDFAction.ActionType;
import com.compdfkit.core.edit.CPDFEditTextArea.PDFEditAlignType;
import com.compdfkit.core.font.CPDFFont;
import com.compdfkit.core.watermark.CPDFWatermark;
import com.compdfkit.tools.common.views.pdfproperties.CAnnotationType;
import java.util.List;

public class CPDFEnumConvertUtil {


    public static String stampShapeToString(TextStampShape shape) {
        if (shape == null) {
            return "none";
        }
        switch (shape) {
            case TEXTSTAMP_LEFT_TRIANGLE:
                return "leftTriangle";
            case TEXTSTAMP_RIGHT_TRIANGLE:
                return "rightTriangle";
            case TEXTSTAMP_RECT:
                return "rect";
            default:
                return "none";
        }
    }

    public static TextStampShape stringToStampShape(String shapeStr) {
        if ("leftTriangle".equals(shapeStr)) {
            return TextStampShape.TEXTSTAMP_LEFT_TRIANGLE;
        }
        if ("rightTriangle".equals(shapeStr)) {
            return TextStampShape.TEXTSTAMP_RIGHT_TRIANGLE;
        }
        if ("rect".equals(shapeStr)) {
            return TextStampShape.TEXTSTAMP_RECT;
        }
        return TextStampShape.TEXTSTAMP_NONE;
    }

    public static String stampColorToString(TextStampColor color){
        switch (color){
            case TEXTSTAMP_RED:
                return "red";
            case TEXTSTAMP_GREEN:
                return "green";
            case TEXTSTAMP_BLUE:
                return "blue";
            default:
                return "white";
        }
    }

    public static TextStampColor stringToStampColor(String colorStr){
        if("red".equals(colorStr)){
            return TextStampColor.TEXTSTAMP_RED;
        }
        if("green".equals(colorStr)){
            return TextStampColor.TEXTSTAMP_GREEN;
        }
        if("blue".equals(colorStr)){
            return TextStampColor.TEXTSTAMP_BLUE;
        }
        return TextStampColor.TEXTSTAMP_WHITE;
    }


    public static CPDFStampAnnotation.StandardStamp stringToStandardStamp(String stampString) {
        switch (stampString) {
            case "NotApproved":
                return CPDFStampAnnotation.StandardStamp.NOTAPPROVED;
            case "Approved":
                return CPDFStampAnnotation.StandardStamp.APPROVED;
            case "Completed":
                return CPDFStampAnnotation.StandardStamp.COMPLETED;
            case "Final":
                return CPDFStampAnnotation.StandardStamp.FINAL;
            case "Draft":
                return CPDFStampAnnotation.StandardStamp.DRAFT;
            case "Confidential":
                return CPDFStampAnnotation.StandardStamp.CONFIDENTIAL;
            case "NotForPublicRelease":
                return CPDFStampAnnotation.StandardStamp.NOTFORPUBLICRELEASE;
            case "ForPublicRelease":
                return CPDFStampAnnotation.StandardStamp.FORPUBLICRELEASE;
            case "ForComment":
                return CPDFStampAnnotation.StandardStamp.FORCOMMENT;
            case "Void":
                return CPDFStampAnnotation.StandardStamp.VOID;
            case "PreliminaryResults":
                return CPDFStampAnnotation.StandardStamp.PRELIMINARYRESULTS;
            case "InformationOnly":
                return CPDFStampAnnotation.StandardStamp.INFORMATIONONLY;
            case "Accepted":
                return CPDFStampAnnotation.StandardStamp.ACCEPTED;
            case "Rejected":
                return CPDFStampAnnotation.StandardStamp.REJECTED;
            case "Witness":
                return CPDFStampAnnotation.StandardStamp.WITNESS;
            case "InitialHere":
                return CPDFStampAnnotation.StandardStamp.INITIALHERE;
            case "SignHere":
                return CPDFStampAnnotation.StandardStamp.SIGNHERE;
            case "Revised":
                return CPDFStampAnnotation.StandardStamp.REVISED;
            case "PrivateMark#1":
                return CPDFStampAnnotation.StandardStamp.PRIVATEACCEPTED;
            case "PrivateMark#2":
                return CPDFStampAnnotation.StandardStamp.PRIVATEREJECTED;
            case "PrivateMark#3":
                return CPDFStampAnnotation.StandardStamp.PRIVATERADIOMARK;
            default:
                return null;
        }
    }

    public static String standardStampToString(CPDFStampAnnotation.StandardStamp standardStamp) {
        switch (standardStamp) {
            case NOTAPPROVED:
                return "NotApproved";
            case APPROVED:
                return "Approved";
            case COMPLETED:
                return "Completed";
            case FINAL:
                return "Final";
            case DRAFT:
                return "Draft";
            case CONFIDENTIAL:
                return "Confidential";
            case NOTFORPUBLICRELEASE:
                return "NotForPublicRelease";
            case FORPUBLICRELEASE:
                return "ForPublicRelease";
            case FORCOMMENT:
                return "ForComment";
            case VOID:
                return "Void";
            case PRELIMINARYRESULTS:
                return "PreliminaryResults";
            case INFORMATIONONLY:
                return "InformationOnly";
            case ACCEPTED:
                return "Accepted";
            case REJECTED:
                return "Rejected";
            case WITNESS:
                return "Witness";
            case INITIALHERE:
                return "InitialHere";
            case SIGNHERE:
                return "SignHere";
            case REVISED:
                return "Revised";
            case PRIVATEACCEPTED:
                return "PrivateMark#1";
            case PRIVATEREJECTED:
                return "PrivateMark#2";
            case PRIVATERADIOMARK:
                return "PrivateMark#3";
            default:
                return "Unknown";
        }
    }

    public static String stampTypeToString(StampType stampType) {
        switch (stampType) {
            case STANDARD_STAMP:
                return "standard";
            case TEXT_STAMP:
                return "text";
            case IMAGE_STAMP:
                return "image";
            default:
                return "unknown";
        }
    }

    public static String bordEffectTypeToString(CPDFBorderEffectType bordEffectType){
        switch (bordEffectType){
            case CPDFBorderEffectTypeCloudy:
                return "cloudy";
            case CPDFBorderEffectTypeSolid:
            default:
                return "solid";
        }
    }

    public static CPDFBorderEffectType stringToBordEffectType(String bordEffectTypeStr){
        if("cloudy".equals(bordEffectTypeStr)){
            return CPDFBorderEffectType.CPDFBorderEffectTypeCloudy;
        }
        return CPDFBorderEffectType.CPDFBorderEffectTypeSolid;
    }

    public static String freeTextAlignmentToString(CPDFFreetextAnnotation.Alignment alignment){
        switch (alignment){
            case ALIGNMENT_RIGHT:
                return "right";
            case ALIGNMENT_CENTER:
                return "center";
            default:
                return "left";
        }
    }

    public static CPDFFreetextAnnotation.Alignment stringToFreeTextAlignment(String alignmentStr){
        if("right".equals(alignmentStr)){
            return CPDFFreetextAnnotation.Alignment.ALIGNMENT_RIGHT;
        }
        if("center".equals(alignmentStr)){
            return CPDFFreetextAnnotation.Alignment.ALIGNMENT_CENTER;
        }
        return CPDFFreetextAnnotation.Alignment.ALIGNMENT_LEFT;
    }

    public static String textAlignmentToString(CPDFTextAlignment textAlignment){
        switch (textAlignment){
            case ALIGNMENT_RIGHT:
                return "right";
            case ALIGNMENT_CENTER:
                return "center";
            default:
                return "left";
        }
    }

    public static CPDFTextAlignment stringToTextAlignment(String alignmentStr){
        if("right".equals(alignmentStr)){
            return CPDFTextAlignment.ALIGNMENT_RIGHT;
        }
        if("center".equals(alignmentStr)){
            return CPDFTextAlignment.ALIGNMENT_CENTER;
        }
        return CPDFTextAlignment.ALIGNMENT_LEFT;
    }

    public static String[] parseFamilyAndStyleFromPsName(String psName){
        String familyName = CPDFFont.getFamilyName(psName);
        String styleName = "";
        List<String> styleNames = CPDFFont.getStyleName(familyName);
        String tempStyleName = psName.replace(familyName+"-", "");
        if (styleNames != null) {
            for (String name : styleNames) {
                if (tempStyleName.equals(name)) {
                    styleName = name;
                    break;
                }
            }
        }
        return new String[]{familyName, styleName};
    }


    public static String lineTypeToString(LineType lineType) {
        switch (lineType) {
            case LINETYPE_ARROW:
                return "openArrow";
            case LINETYPE_CIRCLE:
                return "circle";
            case LINETYPE_DIAMOND:
                return "diamond";
            case LINETYPE_SQUARE:
                return "square";
            case LINETYPE_CLOSEDARROW:
                return "closedArrow";
            case LINETYPE_NONE:
                return "none";
            default:
                return "unknown";
        }
    }

    public static LineType stringToLineType(String lineTypeStr) {
        switch (lineTypeStr) {
            case "openArrow":
                return LineType.LINETYPE_ARROW;
            case "circle":
                return LineType.LINETYPE_CIRCLE;
            case "diamond":
                return LineType.LINETYPE_DIAMOND;
            case "square":
                return LineType.LINETYPE_SQUARE;
            case "closedArrow":
                return LineType.LINETYPE_CLOSEDARROW;
            default:
                return LineType.LINETYPE_NONE;
        }
    }

    public static CheckStyle stringToCheckStyle(String checkStyleStr){
        switch (checkStyleStr){
            case "circle":
                return CheckStyle.CK_Circle;
            case "check":
                return CheckStyle.CK_Check;
            case "cross":
                return CheckStyle.CK_Cross;
            case "diamond":
                return CheckStyle.CK_Diamond;
            case "square":
                return CheckStyle.CK_Square;
            case "star":
                return CheckStyle.CK_Star;
            default:
                return CheckStyle.CK_Check;
        }
    }

    public static String checkStyleToString(CheckStyle checkStyle){
        switch (checkStyle){
            case CK_Circle:
                return "circle";
            case CK_Check:
                return "check";
            case CK_Cross:
                return "cross";
            case CK_Diamond:
                return "diamond";
            case CK_Square:
                return "square";
            case CK_Star:
                return "star";
            default:
                return "check";
        }
    }

    public static String actionTypeToString(CPDFAction action) {
        ActionType actionType = action.getActionType();
        switch (actionType) {
            case PDFActionType_Unknown:
                return "unknown";
            case PDFActionType_GoTo:
                return "goTo";
            case PDFActionType_GoToR:
                return "goToR";
            case PDFActionType_GoToE:
                return "goToE";
            case PDFActionType_Launch:
                return "launch";
            case PDFActionType_Thread:
                return "thread";
            case PDFActionType_URI:
                return "uri";
            case PDFActionType_Sound:
                return "sound";
            case PDFActionType_Movie:
                return "movie";
            case PDFActionType_Hide:
                return "hide";
            case PDFActionType_Named:
                return "named";
            case PDFActionType_SubmitForm:
                return "submitForm";
            case PDFActionType_ResetForm:
                return "resetForm";
            case PDFActionType_ImportData:
                return "importData";
            case PDFActionType_JavaScript:
                return "javaScript";
            case PDFActionType_SetOCGState:
                return "setOCGState";
            case PDFActionType_Rendition:
                return "rendition";
            case PDFActionType_Trans:
                return "trans";
            case PDFActionType_GoTo3DView:
                return "goTo3DView";
            case PDFActionType_UOP:
                return "uop";
            case PDFActionType_Error:
                return "error";
            default:
                return "unknown";
        }
    }

    public static CPDFAnnotation.Type stringToCPDFAnnotType(String typeStr){
        try{
            if ("note".equals(typeStr)){
                typeStr = "text";
            }
            if ("arrow".equals(typeStr)){
                typeStr = "line";
            }
            if ("signature".equals(typeStr) || "pictures".equals(typeStr)){
                typeStr = "stamp";
            }
            return CPDFAnnotation.Type.valueOf(typeStr.toUpperCase());
        }catch (Exception e){
            return CPDFAnnotation.Type.UNKNOWN;
        }
    }

    public static WidgetType stringToWidgetType(String typeStr){
        switch (typeStr){
            case "textField":
                return WidgetType.Widget_TextField;
            case "checkBox":
                return WidgetType.Widget_CheckBox;
            case "radioButton":
                return WidgetType.Widget_RadioButton;
            case "comboBox":
                return WidgetType.Widget_ComboBox;
            case "listBox":
                return WidgetType.Widget_ListBox;
            case "signaturesFields":
                return WidgetType.Widget_SignatureFields;
            case "pushButton":
                return WidgetType.Widget_PushButton;
            default:
                return WidgetType.Widget_Unknown;
        }
    }

    public static CAnnotationType strongToAnnotationType(String key){
        CAnnotationType type = CAnnotationType.UNKNOWN;
        switch (key.toLowerCase()) {
            case "note":
                type = CAnnotationType.TEXT;
                break;
            case "highlight":
                type = CAnnotationType.HIGHLIGHT;
                break;
            case "underline":
                type = CAnnotationType.UNDERLINE;
                break;
            case "squiggly":
                type = CAnnotationType.SQUIGGLY;
                break;
            case "strikeout":
                type = CAnnotationType.STRIKEOUT;
                break;
            case "ink":
                type = CAnnotationType.INK;
                break;
            case "ink_eraser":
                type = CAnnotationType.INK_ERASER;
                break;
            case "square":
                type = CAnnotationType.SQUARE;
                break;
            case "circle":
                type = CAnnotationType.CIRCLE;
                break;
            case "line":
                type = CAnnotationType.LINE;
                break;
            case "arrow":
                type = CAnnotationType.ARROW;
                break;
            case "freetext":
                type = CAnnotationType.FREETEXT;
                break;
            case "signature":
                type = CAnnotationType.SIGNATURE;
                break;
            case "stamp":
                type = CAnnotationType.STAMP;
                break;
            case "pictures":
                type = CAnnotationType.PIC;
                break;
            case "link":
                type = CAnnotationType.LINK;
                break;
            case "sound":
                type = CAnnotationType.SOUND;
                break;
            default:
                break;
        }
        return type;
    }

    public static String editAlignTypeToString(PDFEditAlignType editAlignType){
        switch (editAlignType){
            case PDFEditAlignRight:
                return "right";
            case PDFEditAlignMiddle:
                return "center";
            default:
                return "left";
        }
    }

    public static PDFEditAlignType stringToEditAlignType(String alignStr){
        if("right".equals(alignStr)){
            return PDFEditAlignType.PDFEditAlignRight;
        }
        if("center".equals(alignStr)){
            return PDFEditAlignType.PDFEditAlignMiddle;
        }
        return PDFEditAlignType.PDFEditAlignLeft;
    }

    public static CPDFWatermark.Vertalign stringToVertAlign(String alignStr){
        if("top".equals(alignStr)){
            return CPDFWatermark.Vertalign.WATERMARK_VERTALIGN_TOP;
        }
        if("center".equals(alignStr)){
            return CPDFWatermark.Vertalign.WATERMARK_VERTALIGN_CENTER;
        }
        return CPDFWatermark.Vertalign.WATERMARK_VERTALIGN_BOTTOM;
    }

    public static CPDFWatermark.Horizalign stringToHorizAlign(String alignStr){
        if("left".equals(alignStr)){
            return CPDFWatermark.Horizalign.WATERMARK_HORIZALIGN_LEFT;
        }
        if("center".equals(alignStr)){
            return CPDFWatermark.Horizalign.WATERMARK_HORIZALIGN_CENTER;
        }
        return CPDFWatermark.Horizalign.WATERMARK_HORIZALIGN_RIGHT;
    }

    public static StampType stringToStampType(String stampTypeStr) {
        switch (stampTypeStr) {
            case "standard":
                return StampType.STANDARD_STAMP;
            case "text":
                return StampType.TEXT_STAMP;
            case "image":
                return StampType.IMAGE_STAMP;
            default:
                return StampType.UNKNOWN_STAMP;
        }
    }
}
