/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import { CPDFDisplayMode, CPDFThemes, HexColor } from "@compdfkit_pdf_sdk/react_native";

/**
 * @group Configuration
 */
export interface CPDFReaderViewConfig  {
    /**
     * Sets whether hyperlinks in the PDF document annotations are highlighted.
     */
    linkHighlight?: boolean;
    /**
     * Sets whether form fields in the PDF document are highlighted.
     */
    formFieldHighlight?: boolean;
    /**
     * Display mode of the PDF document, single page, double page, or book mode.
     * Default: {@link CPDFDisplayMode.SINGLE_PAGE}
     */
    displayMode?: CPDFDisplayMode;
    /**
     * Whether PDF page flipping is continuous scrolling.
     */
    continueMode?: boolean;
    /**
     * Whether scrolling is in vertical direction.
     * `true`: Vertical scrolling, `false`: Horizontal scrolling.
     * Default: true
     */
    verticalMode?: boolean;
    /**
     * Cropping mode.
     * Whether to crop blank areas of PDF pages.
     * Default: false
     */
    cropMode?: boolean;
    /**
     * Theme color.
     * Default: {@link CPDFThemes.LIGHT}
     */
    themes?: CPDFThemes;
    /**
     * Whether to display the sidebar quick scroll bar.
     */
    enableSliderBar?: boolean;
    /**
     * Whether to display the bottom page indicator.
     */
    enablePageIndicator?: boolean;
    /**
     * Spacing between each page of the PDF, default 10px.
     */
    pageSpacing?: number;

    /**
     * Sets the outer margins for the PDF reading view.
     * - `index 0`: margin left
     * - `index 1`: margin top
     * - `index 2`: margin right
     * - `index 3`: margin bottom
     *
     * **Default:** `[0,0,0,0]`
     */
    margins?: number[];
    /**
     * Page scale value, default 1.0.
     */
    pageScale?: number;
    /**
     * only android platform.
     */
    pageSameWidth?: boolean;
    
    /**
     * Sets whether to display annotations in the PDF document.
     */
    annotationsVisible?: boolean;

    /**
     * In content editing mode, when only text editing is selected, whether to enable creating a text input box by clicking the page area.
     * Default value: true
     */
    enableCreateEditTextInput?: boolean;

    /**
     * In content editing mode, when only image editing is selected, whether to enable creating an image picker dialog by clicking the page area.
     * Default value: true
     */
    enableCreateImagePickerDialog?: boolean;

    /**
     * Sets whether to enable double-tap zooming in the PDF document.
     * Default value: true
     */
    enableDoubleTapZoom?: boolean;

    /**
     * UI style customizations for various interactive elements in the reader view.
     * Use this to customize colors, icons and border styles for selections, screenshots,
     * form previews, cropping and other visual helpers.
     */
    uiStyle?: CPDFUIStyle;

    };


  /**
   * Top-level UI style configuration for reader view elements.
   */
  export interface CPDFUIStyle {
    /** Optional bookmark icon resource path or identifier. */
    bookmarkIcon?: string;
    /** Custom icons used in selection and annotation helpers. */
    icons?: CPDFUIIcons;
    /** Color used for text selection overlays (hex with alpha). */
    selectTextColor?: HexColor;
    /** Visual rectangle style used when displaying the visible page area. */
    displayPageRect?: CPDFUIBorderStyle;
    /** Screenshot selection visual style. */
    screenshot?: CPDFUIDashBorderStyle;
    /** Form preview rendering style. */
    formPreview?: CPDFUIFormPreview;
    /** Default border style applied to annotation widgets. */
    defaultBorderStyle?: CPDFUIBorderStyle;
    /** Border style used when a node or widget is focused. */
    focusBorderStyle?: CPDFUIFocusStyle;
    /** Crop image selection style. */
    cropImageStyle?: CPDFUIBorderStyle;
  }

  export interface CPDFUIIcons {
    selectTextLeftIcon?: string;
    selectTextRightIcon?: string;
    selectTextIcon?: string;
    rotationAnnotationIcon?: string;
  }

  export interface CPDFUIBorderStyle {
    fillColor?: HexColor;
    borderColor?: HexColor;
    borderWidth?: number;
    borderDashPattern?: number[];
  }

  export interface CPDFUIDashBorderStyle extends CPDFUIBorderStyle {
    outsideColor : HexColor;
  }

  export interface CPDFUIFormPreview {
    /** 'fill' or 'stroke' */
    style?: 'fill' | 'stroke';
    strokeWidth?: number;
    color?: HexColor;
  }

  export interface CPDFUIFocusStyle extends CPDFUIBorderStyle {
    nodeColor?: HexColor;
  }
