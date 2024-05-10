/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { Component } from 'react';
import DocumentPicker from 'react-native-document-picker'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Platform } from 'react-native';
import { ComPDFKit } from '@compdfkit_pdf_sdk/react_native';

type Props = {};

export default class App extends Component<Props> {

  state = {
    versionCode: ''
  }

  constructor(props: Props) {
    super(props)
    this.initialize()
    this.getVersionCode()
  }

  async getVersionCode() {
    // Get the version code of ComPDFKit SDK
    var version = await ComPDFKit.getVersionCode()
    this.setState({
      versionCode: version
    })
  }

  async initialize() {
    // Online certification, Fill in your online license
    // Returns true if initialization is successful, otherwise returns false.

    //  var result = await ComPDFKit.initialize('your android compdfkit license', 'your ios compdfkit license')
    //  console.log("ComPDFKitRN", "initialize:", result)

    // Offline authentication, Fill in your offline license
    var result;
    if (Platform.OS == 'android') {
      result = await ComPDFKit.init_('your compdfkit license')
    } else {
      result = await ComPDFKit.init_('your compdfkit license')
    }
    console.log("ComPDFKitRN", "init_:", result)
  }

  /**
   * Open the sample document embedded in Android or iOS project.
   */
  openSample() {
    var samplePDF: string = Platform.OS == 'android' ? 'file:///android_asset/PDF_Document.pdf' : 'PDF_Document.pdf'
    // We provide default UI and PDF property related configurations here, you can modify configuration options according to your needs.
    var config = ComPDFKit.getDefaultConfig({})
    ComPDFKit.openDocument(samplePDF, '', config)
  }

  /**
   * Pick a PDF file from the local storage of Android or iOS device, this example uses the `react-native-document-picker` package,
   * If you want to use this example, please add this package to your project first.
   * {@link https://www.npmjs.com/package/react-native-document-picker}
   *
   */
  pickPDFFile() {
    try {
      const pickerResult = DocumentPicker.pick({
        type: [DocumentPicker.types.pdf]
      });
      pickerResult.then(res => {
        ComPDFKit.openDocument(res[0]?.uri as string, '', ComPDFKit.getDefaultConfig({}))
      })
    } catch (err) {
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.scaffold}>
          <View style={styles.appBar}>
            <Text style={styles.mediumTitle}>
              ComPDFKit PDF SDK for ReactNative
            </Text>
          </View>
          <View style={styles.container}>
            <TouchableOpacity onPress={() => {
              this.openSample()
            }}>
              <View style={styles.funItem}>
                <Text style={{ fontWeight: 'bold' }}>{'Open Sample'}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.dividingLine} />

            <TouchableOpacity onPress={() => {
              this.pickPDFFile()
            }}>
              <View style={styles.funItem}>
                <Text style={{ fontWeight: 'bold' }}>{'Pick Document'}</Text>
              </View>
              <View style={styles.dividingLine} />

            </TouchableOpacity>

            <View style={styles.buttom}>
              <Text style={styles.body2}>ComPDFKit for {Platform.OS == 'android' ? 'Android' : 'iOS'} {this.state.versionCode}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

    );
  }
}

const styles = StyleSheet.create({
  appBar: {
    height: 56,
    backgroundColor: '#FAFCFF',
    elevation: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16
  },
  mediumTitle: {
    fontSize: 16,
  },
  body2: {
    textAlign: 'center',
    fontSize: 12
  },
  scaffold: {
    flex: 1,
  },
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    flex: 1,
    // backgroundColor: '#F5FCFF',
  },
  funItem: {
    height: 56,
    justifyContent: 'center',
    textAlign: 'center'
  },
  dividingLine: {
    height: 0.5, backgroundColor: '#4D333333', width: '100%'
  },
  buttom: {
    flex: 1,
    justifyContent: 'flex-end',
  }
});
