/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { PureComponent } from 'react';
import PropTypes, { Requireable, Validator } from 'prop-types';
import { findNodeHandle, requireNativeComponent, NativeModules,Platform } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
import { CPDFThemes, CPDFViewMode } from '../configuration/CPDFOptions';
import { CPDFDocument } from '..';
const { CPDFViewManager } = NativeModules;

/**
 * ComPDFKit PDF UI Component.
 *
 * @example
 * const pdfReaderRef = useRef<CPDFReaderView>(null);
 *
 *  <CPDFReaderView
 *      ref={pdfReaderRef}
 *      document={samplePDF}
 *      password={'1234'}
 *      configuration={ComPDFKit.getDefaultConfig({})}
 *  />
 */

const propTypes = {
  configuration: PropTypes.string.isRequired,
  document: PropTypes.string.isRequired,
  password: PropTypes.string,
  onPageChanged : func<(pageIndex: number) => void>(),
  saveDocument : func<() => void>(),
  ...ViewPropTypes,
}

// Generates the prop types for TypeScript users, from PropTypes.
type CPDFReaderViewProps = PropTypes.InferProps<typeof propTypes>;

function func<T>(): Requireable<T> {

  let validator: Validator<T> = function (props: { [key: string]: any }, propName: string, componentName: string): Error | null {
    if (typeof props[propName] !== "function" && typeof props[propName] !== "undefined") {
      return new Error(`Invalid prop \`${propName}\` of type \`${typeof props[propName]}\` supplied to \`${componentName}\`, expected a function.`);
    }
    return null;
  }

  const t: Requireable<T> = validator as Requireable<T>;
  t.isRequired = validator as Validator<NonNullable<T>>;
  return t;
}


export class CPDFReaderView extends PureComponent<CPDFReaderViewProps, any> {

  _viewerRef: any;
  _pdfDocument : CPDFDocument;

  static propTypes = propTypes;

  static defaultProps = {
    password: ''
  }

  constructor(props : CPDFReaderViewProps) {
    super(props);
    this._pdfDocument = new CPDFDocument(this._viewerRef);
  }

  _setNativeRef = (ref: any) => {
    this._viewerRef = ref;
    this._pdfDocument = new CPDFDocument(this._viewerRef);
  }

  onChange = (event : any) => {
    console.log('ComPDFKit onChange:', event.nativeEvent)
    if (event.nativeEvent.onPageChanged){
      if(this.props.onPageChanged){
        this.props.onPageChanged(event.nativeEvent.onPageChanged);
      }
    } else if(event.nativeEvent.saveDocument){
      console.log('ComPDFKit onChange: saveDocument----')
      if(this.props.saveDocument){
        this.props.saveDocument();
      }
    }
  }

  /**
   * Save the document and return whether it is saved successfully.
   * @example
   * const saveResult = await pdfReaderRef.current.save();
   *
   * @returns true or false
   */
  save = (): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.save(tag);
    }
    return Promise.resolve(false);
  }

  /**
   * Set the reading area spacing.
   * @example
   * await pdfReaderRef.current?.setMargins(10,10,10,10);
   *
   * @param left
   * @param top
   * @param right
   * @param bottom
   * @returns
   */
  setMargins = (left: number, top: number, right: number, bottom: number) : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.setMargins(tag, [left, top, right, bottom]);
    }
    return Promise.resolve();
  };

  /**
   *
   * @deprecated This method is deprecated and will be removed in future versions.
   * Use `_pdfDocument.removeAllAnnotations()` instead.
   *
   * Delete all comments in the current document
   * @example
   * const removeResult = await pdfReaderRef.current?.removeAllAnnotations();
   *
   * @returns
   */
  removeAllAnnotations = () : Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.removeAllAnnotations(tag);
    }
    return Promise.resolve(false);
  }

  /**
   *
   * @deprecated This method is deprecated and will be removed in future versions.
   * Use `_pdfDocument.importAnnotations()` instead.
   *
   * Imports annotations from the specified XFDF file into the current PDF document.
   * @example
   * // Android - assets file
   * const testXfdf = 'file:///android_asset/test.xfdf';
   * const importResult = await pdfReaderRef.current?.importAnnotations(testXfdf);
   *
   * // Android - file path
   * const testXfdf = '/data/user/0/com.compdfkit.reactnative.example/xxx/xxx.xfdf';
   * const importResult = await pdfReaderRef.current?.importAnnotations(testXfdf);
   *
   * // Android - Uri
   * const xfdfUri = 'content://xxxx'
   * const importResult = await pdfReaderRef.current?.importAnnotations(xfdfUri);
   *
   * // iOS
   *
   *
   *
   * @param xfdfFile Path of the XFDF file to be imported.
   * @returns true if the import is successful; otherwise, false.
   */
  importAnnotations = (xfdfFile : string) : Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.importAnnotations(tag, xfdfFile);
    }
    return Promise.resolve(false);
  }

  /**
   *
   * @deprecated This method is deprecated and will be removed in future versions.
   * Use `_pdfDocument.exportAnnotations()` instead.
   *
   * Exports annotations from the current PDF document to an XFDF file.
   *
   * @example
   * const exportXfdfFilePath = await pdfReaderRef.current?.exportAnnotations();
   *
   * @returns The path of the XFDF file if export is successful; an empty string if the export fails.
   */
  exportAnnotations = () : Promise<string> =>{
    return this._pdfDocument.exportAnnotations();
  }

  /**
   * Jump to the index page.
   *
   * @example
   * await pdfReaderRef.current?.setDisplayPageIndex(1);
   *
   * @param pageIndex The index of the page to jump.
   * @returns
   */
  setDisplayPageIndex = (pageIndex : number) : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.setDisplayPageIndex(tag, pageIndex);
    }
    return Promise.resolve();
  }

  /**
   * get current page index
   *
   * @example
   * const pageIndex = await pdfReaderRef.current?.getCurrentPageIndex();
   *
   * @returns
   */
  getCurrentPageIndex = () : Promise<number> =>{
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.getCurrentPageIndex(tag);
    }
    return Promise.resolve(0);
  }

  /**
   * @deprecated This method is deprecated and will be removed in future versions.
   * Use `_pdfDocument.hasChange()` instead.
   *
   * Checks whether the document has been modified
   *
   * @example
   * const hasChange = await pdfReaderRef.current?.hasChange();
   *
   * @returns {Promise<boolean>} Returns a Promise indicating if the document has been modified.
   *          `true`: The document has been modified,
   *          `false`: The document has not been modified.
   *          If the native view reference cannot be found, a rejected Promise will be returned.
   */
  hasChange = () : Promise<boolean> => {
    return this._pdfDocument.hasChange();
  }

  /**
   * Set the page scale
   * Value Range: 1.0~5.0
   *
   * @example
   * await pdfReaderRef.current?.setScale(2.0);
   *
   * @param scale
   * @returns Returns a Promise.
   */
  setScale = (scale : number) : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.setScale(tag, scale);
    }
    return Promise.resolve();
  }

  /**
   * Get the current page scale
   *
   * @example
   * const scale = await pdfReaderRef.current?.getScale();
   *
   * @returns Returns the zoom ratio of the current page.
   */
  getScale = () : Promise<number> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.getScale(tag);
    }
    return Promise.resolve(1);
  }

  /**
   * Whether allow to scale.
   * Default : true
   *
   * @example
   * await pdfReaderRef.current?.setCanScale(false);
   *
   * @param canScale
   * @returns
   */
  setCanScale = (canScale : boolean) : Promise<void> =>{
    if(Platform.OS != 'android'){
      return Promise.reject('setCanScale() method only support Android platform.')
    }
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.setCanScale(tag, canScale);
    }
    return Promise.resolve();
  }

  /**
   * Sets background color of reader.
   * The color of each document space will be set to 75% of [color] transparency
   * @example
   * await pdfReaderRef.current?.setReadBackgroundColor(CPDFThemes.LIGHT);
   *
   * @param theme
   * @returns
   */
  setReadBackgroundColor = (theme : CPDFThemes) : Promise<void> =>{
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      let color: string;
      switch (theme) {
        case CPDFThemes.LIGHT:
          color = '#FFFFFF';
          break;
        case CPDFThemes.DARK:
          color = '#000000';
          break;
        case CPDFThemes.SEPIA:
          color = '#FFEFBE';
          break;
        case CPDFThemes.RESEDA:
          color = '#CDE6D0';
          break;
        default:
          color = '#FFFFFF';
      }
      return CPDFViewManager.setReadBackgroundColor(tag, {
          'displayMode' : theme,
          'color' : color
      });
    }
    return Promise.resolve();
  }

  /**
   * Get background color of reader.
   *
   * @example
   * CPDFThemes theme = await pdfReaderRef.current?.getReadBackgroundColor();
   * @returns
   */
  getReadBackgroundColor = async () : Promise<CPDFThemes> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      var themesColor : string = await CPDFViewManager.getReadBackgroundColor(tag);
      console.log('ComPDFKit themesColor:', themesColor);
      let theme: CPDFThemes;
      switch (themesColor) {
        case '#FFFFFFFF':
          theme = CPDFThemes.LIGHT;
          break;
        case '#FF000000':
          theme = CPDFThemes.DARK;
          break;
        case '#FFFFEFBE':
          theme = CPDFThemes.SEPIA;
          break;
        case '#FFCDE6D0':
          theme = CPDFThemes.RESEDA;
          break;
        default:
          theme = CPDFThemes.LIGHT;
      }
      return Promise.resolve(theme);
    }
    return Promise.resolve(CPDFThemes.LIGHT);
  }

  /**
   * Sets whether to display highlight Form Field.
   * @example
   * await pdfReaderRef.current?.setFormFieldHighlight(true);
   * @param isFormFieldHighlight true to display highlight Form Field.
   * @returns
   */
  setFormFieldHighlight = (isFormFieldHighlight : boolean) : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.setFormFieldHighlight(tag, isFormFieldHighlight);
    }
    return Promise.resolve();
  }

  /**
   * Whether to display highlight Form Field.
   * @example
   * const isFormFieldHighlight = await pdfReaderRef.current?.isFormFieldHighlight();
   * @returns
   */
  isFormFieldHighlight = () : Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.isFormFieldHighlight(tag);
    }
    return Promise.resolve(false);
  }

  /**
   * Sets whether to display highlight Link.
   * @example
   * await pdfReaderRef.current?.setLinkHighlight(true);
   * @param isLinkHighlight Whether to highlight Link.
   * @returns
   */
  setLinkHighlight = (isLinkHighlight : boolean) : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.setLinkHighlight(tag, isLinkHighlight);
    }
    return Promise.resolve();
  }

  /**
   * Whether to display highlight Link.
   * @example
   * const isLinkHighlight = await pdfReaderRef.current?.isLinkHighlight();
   * @returns
   */
  isLinkHighlight = () : Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.isLinkHighlight(tag);
    }
    return Promise.resolve(false);
  }

  /**
   * Sets whether it is vertical scroll mode.
   * @example
   * await pdfReaderRef.current?.setVerticalMode(true);
   * @param isVerticalMode Whether it is vertical scroll mode.
   * @returns
   */
  setVerticalMode = (isVerticalMode : boolean) : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.setVerticalMode(tag, isVerticalMode);
    }
    return Promise.resolve();
  }

  /**
   * Whether it is vertical scroll mode.
   * @example
   * await pdfReaderRef.current?.isVerticalMode();
   * @returns
   */
  isVerticalMode = () : Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.isVerticalMode(tag);
    }
    return Promise.resolve(false);
  }

  /**
   * Sets the spacing between pages. This method is supported only on the [Android] platform.
   * - For the [iOS] platform, use the [setMargins] method instead.
   * The spacing between pages is equal to the value of [CPDFEdgeInsets.top].
   * @example
   * await pdfReaderRef.current?.setPageSpacing(10);
   * @param pageSpacing The space between pages, in pixels.
   * @returns
   */
  setPageSpacing = (pageSpacing : number) : Promise<void> => {
    if(Platform.OS === 'ios'){
      return Promise.reject('This method is not supported on iOS, only supported on Android');
    }
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.setPageSpacing(tag, pageSpacing);
    }
    return Promise.resolve();
  }

  /**
   * Sets whether it is continuous scroll mode.
   * @example
   * await pdfReaderRef.current?.setContinueMode(true);
   * @param isContinueMode Whether it is continuous scroll mode.
   * @returns
   */
  setContinueMode = (isContinueMode : boolean) : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.setContinueMode(tag, isContinueMode);
    }
    return Promise.resolve();
  }

  /**
   * Whether it is continuous scroll mode.
   * @example
   * await pdfReaderRef.current?.isContinueMode();
   * @returns
   */
  isContinueMode = () : Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.isContinueMode(tag);
    }
    return Promise.resolve(true);
  }

  /**
   * Sets whether it is double page mode.
   * @example
   * await pdfReaderRef.current?.setDoublePageMode(true);
   * @param isDoublePageMode Whether it is double page mode.
   * @returns
   */
  setDoublePageMode = (isDoublePageMode : boolean) : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.setDoublePageMode(tag, isDoublePageMode);
    }
    return Promise.resolve();
  }

  /**
   * Whether it is double page mode.
   * @example
   * await pdfReaderRef.current?.isDoublePageMode();
   * @returns Returns `true` if double page display is enabled, otherwise returns `false`
   */
  isDoublePageMode = () : Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.isDoublePageMode(tag);
    }
    return Promise.resolve(false);
  }

  /**
   * Sets whether it is cover page mode.
   * @example
   * await pdfReaderRef.current?.setCoverPageMode(true);
   * @param isCoverPageMode Whether to display the document in cover form
   * @returns
   */
  setCoverPageMode = (isCoverPageMode : boolean) : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.setCoverPageMode(tag, isCoverPageMode);
    }
    return Promise.resolve();
  }

  /**
   * Whether it is cover page mode.
   * @example
   * await pdfReaderRef.current?.isCoverPageMode();
   * @returns Returns `true` if the document cover is displayed, otherwise returns `false`
   */
  isCoverPageMode = () : Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.isCoverPageMode(tag);
    }
    return Promise.resolve(false);
  }
  /**
   * Sets whether it is crop mode.
   * @example
   * await pdfReaderRef.current?.setCropMode(true);
   * @param isCropMode Whether it is crop mode.
   * @returns
   */
  setCropMode = (isCropMode : boolean) : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.setCropMode(tag, isCropMode);
    }
    return Promise.resolve();
  }
  /**
   * Whether it is crop mode.
   * @example
   * await pdfReaderRef.current?.isCropMode();
   * @returns Returns `true` if the current mode is clipping mode, otherwise returns `false`
   */
  isCropMode = () : Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.isCropMode(tag);
    }
    return Promise.resolve(false);
  }

  /**
   * In the single page mode, set whether all pages keep the same width
   * and the original page keeps the same width as readerView.
   *
   * @example
   * await pdfReaderRef.current?.setPageSameWidth(true);
   *
   * @param isPageSameWidth true: All pages keep the same width, the original state keeps the same width as readerView; false: Show in the actual width of page
   * @returns
   */
  setPageSameWidth = (isPageSameWidth : boolean) : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.setPageSameWidth(tag, isPageSameWidth);
    }
    return Promise.resolve();
  }

  /**
   * Gets whether the specified [pageIndex] is displayed on the screen
   * @example
   * const isPageInScreen = await pdfReaderRef.current?.isPageInScreen(1);
   * @param pageIndex
   * @returns
   */
  isPageInScreen = (pageIndex : number) : Promise<boolean> => {
    if(Platform.OS === 'ios'){
      return Promise.reject('This method is not supported on iOS, only supported on Android');
    }
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.isPageInScreen(tag, pageIndex);
    }
    return Promise.resolve(false);
  }

  /**
   * Sets whether to fix the position of the non-swipe direction when zooming in for reading.
   * @example
   * await pdfReaderRef.current?.setFixedScroll(true);
   * @param isFixedScroll Whether to fix scrolling
   * @returns
   */
  setFixedScroll = (isFixedScroll : boolean) : Promise<void> => {
    if(Platform.OS != 'android'){
      return Promise.reject('setFixedScroll() method only support Android platform')
    }
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.setFixedScroll(tag, isFixedScroll);
    }
    return Promise.resolve();
  }

  /**
   * Switch the mode displayed by the current CPDFReaderWidget.
   * Please see [CPDFViewMode] for available modes.
   *
   * @example
   * await pdfReaderRef.current?.setPreviewMode(CPDFViewMode.VIEWER);
   * @param viewMode The view mode to display
   * @returns
   */
  setPreviewMode = (viewMode : CPDFViewMode) : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.setPreviewMode(tag, viewMode);
    }
    return Promise.resolve();
  }

  /**
   * Get the currently displayed mode
   * @example
   * const mode = await pdfReaderRef.current?.getPreviewMode();
   * @returns
   */
  getPreviewMode = () : Promise<CPDFViewMode> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      var modeStr = CPDFViewManager.getPreviewMode(tag);
      for (const key in CPDFViewMode) {
        if (CPDFViewMode[key as keyof typeof CPDFViewMode] === modeStr) {
          return Promise.resolve(CPDFViewMode[key as keyof typeof CPDFViewMode]);
        }
      }
    }
    return Promise.resolve(CPDFViewMode.VIEWER);
  }

  /**
   * Displays the thumbnail view. When [editMode] is `true`,
   * the page enters edit mode, allowing operations such as insert, delete, extract, etc.
   *
   * @example
   * await pdfReaderRef.current?.showThumbnailView(true);
   *
   * @param editMode Whether to enable edit mode
   * @returns
   */
  showThumbnailView = (editMode : boolean) : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.showThumbnailView(tag, editMode);
    }
    return Promise.resolve();
  }

  /**
   * Displays the BOTA view, which includes the document outline, bookmarks, and annotation list.
   *
   * @example
   * await pdfReaderRef.current?.showBotaView();
   *
   * @returns
   */
  showBotaView = () : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.showBotaView(tag);
    }
    return Promise.resolve();
  }

  /**
   * Displays the "Add Watermark" view, where users can add watermarks to the document.
   *
   * @example
   * await pdfReaderRef.current?.showAddWatermarkView();
   *
   * @returns
   */
  showAddWatermarkView = () : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.showAddWatermarkView(tag);
    }
    return Promise.resolve();
  }

  /**
   * Displays the document security settings view, allowing users to configure document security options.
   *
   * @example
   * await pdfReaderRef.current?.showSecurityView();
   *
   * @returns
   */
  showSecurityView = () : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.showSecurityView(tag);
    }
    return Promise.resolve();
  }

  /**
   * Displays the display settings view, where users can configure options such as scroll direction, scroll mode, and themes.
   *
   * @example
   * await pdfReaderRef.current?.showDisplaySettingView();
   *
   * @returns
   */
  showDisplaySettingView = () : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.showDisplaySettingView(tag);
    }
    return Promise.resolve();
  }

  /**
   * Enters snip mode, allowing users to capture screenshots.
   *
   * @example
   * await pdfReaderRef.current?.enterSnipMode();
   *
   * @returns
   */
  enterSnipMode = () : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.enterSnipMode(tag);
    }
    return Promise.resolve();
  }

  /**
   * Exits snip mode, stopping the screenshot capture.
   *
   * @example
   * await pdfReaderRef.current?.exitSnipMode();
   *
   * @returns
   */
  exitSnipMode = () : Promise<void> => {
    const tag = findNodeHandle(this._viewerRef);
    if(tag != null){
      return CPDFViewManager.exitSnipMode(tag);
    }
    return Promise.resolve();
  }

  render() {
    return (
      <RCTCPDFReaderView
        ref={(ref) => {this._setNativeRef(ref)}}
        style={{ flex: 1 }}
        onChange={this.onChange}
        {...this.props}
      />
    )
  }
}

const RCTCPDFReaderView = requireNativeComponent<CPDFReaderViewProps>('RCTCPDFReaderView');

