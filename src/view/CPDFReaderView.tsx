/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { PureComponent } from 'react';
import PropTypes, { Requireable, Validator } from 'prop-types';
import { findNodeHandle, requireNativeComponent, NativeModules } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
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

  let validator: Validator<T> = function (props: { [key: string]: any }, propName: string, componentName: string, location: string, propFullName: string): Error | null {
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

  static propTypes = propTypes;

  static defaultProps = {
    password: ''
  }

  _setNativeRef = (ref: any) => {
    this._viewerRef = ref;
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
  setMargins = (left: number, top: number, right: number, bottom: number) => {
    const tag = findNodeHandle(this._viewerRef);
    if (!tag) {
      console.error('Unable to find the native view reference');
      return;
    }
    CPDFViewManager.setMargins(tag, [left, top, right, bottom]);
  };

  /**
   * Delete all comments in the current document
   * @example
   * const removeResult = await pdfReaderRef.current?.removeAllAnnotations();
   *
   * @returns
   */
  removeAllAnnotations = () : Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (!tag) {
      console.error('Unable to find the native view reference');
      return Promise.resolve(false);
    }
    return CPDFViewManager.removeAllAnnotations(tag);
  }

  /**
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
    if (!tag) {
      console.error('Unable to find the native view reference');
      return Promise.resolve(false);
    }
    return CPDFViewManager.importAnnotations(tag, xfdfFile);
  }

  /**
   * Exports annotations from the current PDF document to an XFDF file.
   *
   * @example
   * const exportXfdfFilePath = await pdfReaderRef.current?.exportAnnotations();
   *
   * @returns The path of the XFDF file if export is successful; an empty string if the export fails.
   */
  exportAnnotations = () : Promise<string> =>{
    const tag = findNodeHandle(this._viewerRef);
    if (!tag) {
      console.error('Unable to find the native view reference');
      return Promise.reject("Unable to find the native view reference")
    }
    return CPDFViewManager.exportAnnotations(tag);
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
  setDisplayPageIndex = (pageIndex : number) => {
    const tag = findNodeHandle(this._viewerRef);
    if (!tag) {
      console.error('Unable to find the native view reference');
      return Promise.reject("Unable to find the native view reference")
    }
    return CPDFViewManager.setDisplayPageIndex(tag, pageIndex);
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
    if (!tag) {
      console.error('Unable to find the native view reference');
      return Promise.reject("Unable to find the native view reference")
    }
    return CPDFViewManager.getCurrentPageIndex(tag);
  }

/**
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
    const tag = findNodeHandle(this._viewerRef);
    if (!tag) {
      console.error('Unable to find the native view reference');
      return Promise.reject("Unable to find the native view reference")
    }
    return CPDFViewManager.hasChange(tag);
  }

  render() {
    return (
      <RCTCPDFReaderView
        ref={(ref) => {this._viewerRef = ref}}
        style={{ flex: 1 }}
        onChange={this.onChange}
        {...this.props}
      />
    )
  }
}

const RCTCPDFReaderView = requireNativeComponent<CPDFReaderViewProps>('RCTCPDFReaderView');
