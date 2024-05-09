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

    //  var result = await ComPDFKit.initialize('NjYzODcyYTMxOWQzMA==', 'NjYzODcyYTgxM2YwNg==')
    //  console.log("ComPDFKitRN", "initialize:", result)

    // Offline authentication, Fill in your offline license
    var result;
    if (Platform.OS == 'android') {
      result = await ComPDFKit.init_('nGkHDIO2BGVr/RqhP6yQPqO0XXVHekXzzTOR0OwKQRPP0PTIwpOcxIFNXoIiFumTzRdn0VRkfudjN0qsz7HWMq0iY5jeuNTKpynGOVxwGpyvkLFybGYkoJcFlt1qUm9RGdDiXabom6SMV70WDNA1zqdsRlLeL3/5uaPvMzr73LWuoIedz5uaGN4uxs7u9CRgey9jjjf4HQHKToN52snZoX8CxH57GnhyuRvBCPQdVlmjznOKoVEczGNeHd3TS6E+HZBEmmRVL1J/CbN/EE/dnebgdoklTLMPQbUG8v0vx9fd8CJmVzCiz9NPn+i1FpF4aS4zv534glY8EI3HqU7832u0lH1oY17eVN2TRW5amzqSj1QR5Q0MX/v2nFNCjvJImeroTsMiyvSO5KjU5Zrs50W363LuCsh9JihVahrRo+lBoiot0sxqz+fq3Hbs7pICMxGH5xSv6UE1vNpAzdUnZMph9Oz69ustQh1UlotiDLuIhzmxesEyeFzUslbxjgad4wnAzUkp/0SfANyT5mw/EUMjfeSN/Pguksj7eil2awIwr/GjmH/UTOYr+yB+2NtZ6G+C/BLW1JUsdWqn542iYE9OGV+9dTHCyV+gyP2Nstp7FHUdlWeiIkfzaiP8Y+58lPpC7x05cs28uc/hwXiZGx2KvdF+199pSLVUIrj85m/7+SqS01Dz6t4RwV7CZ/nQ4KOAyptnYBkUNyyOx7Q7j3CUXnxUN5HL5Yhqq2FFaD/HTTVwcjun3kBQWAiUV1AWDLVVx4Eopc0qGGOZzwY7voumlHVxwTcoJykSsLEyoWES7nkOX0AXbzRjlD/njRNg')
    } else {
      result = await ComPDFKit.init_('NS9HR7WMeEmHyqTGnhQ35oLgfO2ktM5FXuVFkCl0s/fAZ/82K1625IcfzMI6cbRL4UqVs6GD4uGyEmssHUu+Z+C5iXJTZ4QeBxmTuTseojHPWuR4gwPBtF9P6XxsN+fojSyXX0CL5kMw9hXp/JoNGAF23/pGEAHSNANQqM0B3lrQxEp6hh1JCFC1wZpgvc00QSFN+5IcjKr2B77BJsVHOH7G7LcxYEhiLv4nVkw1cl2RYee39k6qKjPTu+WQOGpRFkITVTbXNQbkDF7cKH57wTxEvfDUqGF5ZdeMlAGlrXHwS+Ze7Zzsh970FMk51BTvlxKB5gh0zRJb7VwECD2Nw2u0lH1oY17eVN2TRW5amzqSj1QR5Q0MX/v2nFNCjvJImeroTsMiyvSO5KjU5Zrs50W363LuCsh9JihVahrRo+mDgAJSMI2qe6FgOWrSV9NdN1tUqy/YCPxz4PvAib1q0YsbM47koQNz+gWOcywgP1s0vBE/3RNraw+iWcFOaCVAycWSKPP3lIr6+zPIVeNM7/9V+hQcUgoFS+esQrrYEncuhU6kau30e4oZAeZuZW4uCPPnzCZEk9/R0sj1ymWzB5SzrGNfsaQi2wIbQLmf2MR0uIQPwcXfzClC/ew/ZZIftEaBTyRSW/L5h3X09SnC1Ll1zv4sOQxMtrlExwu34ZLOd+DRO7H3qx1BYUfGzzxDFQRFwQ0iZ7xWsXxWc0crZQxjNktT8q4J3K3dzlz2pMXaYCC/i1GyVGRKsr3yekqEvPTzvclvrpTrxPBvbA3x+eEaoo6yq7MhvZzDW1elg2+M68QoaLuDTuBaeMrpFmlS')
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
