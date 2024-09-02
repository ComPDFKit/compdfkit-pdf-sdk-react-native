/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { findNodeHandle, requireNativeComponent, NativeModules } from 'react-native';
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
const { CPDFViewManager } = NativeModules;

/**
 * ComPDFKit PDF UI Component.
 * 
 * @example
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
  ...ViewPropTypes,
}

// Generates the prop types for TypeScript users, from PropTypes.
type CPDFReaderViewProps = PropTypes.InferProps<typeof propTypes>;

export class CPDFReaderView extends PureComponent<CPDFReaderViewProps, any> {

  _viewerRef: any;

  static propTypes = propTypes;

  static defaultProps = {
    password: ''
  }

  _setNativeRef = (ref: any) => {
    this._viewerRef = ref;
  }

  /**
   * Save the document and return whether it is saved successfully.
   * @returns true or false
   */
  save = (): Promise<boolean> => {
    const tag = findNodeHandle(this._viewerRef);
    if (tag != null) {
      return CPDFViewManager.save(tag);
    }
    return Promise.resolve(false);
  }

  render() {
    return (
      <RCTCPDFReaderView
        ref={(ref) => {this._viewerRef = ref}}
        style={{ flex: 1 }}
        {...this.props}
      />
    )
  }
}

const RCTCPDFReaderView = requireNativeComponent<CPDFReaderViewProps>('RCTCPDFReaderView');
