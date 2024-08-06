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
      result = await ComPDFKit.init_('SsFUBGT6t2g9mu/FmY/tH2rNi83UByh2bEXYl8KViCupYHcuOtXureb7D2SXxrhIrmkfCQn32v/BYFJsmDX4aJKMVRWuo7L9Ek7d4eMslDYWDwbrXq4RA9jjwNhDQpzfKbfv7q845gicZDoORi2xRdyKq9AGP7jfszTSY6fuslbom/ycXHS5JRk6WctpYbD6WK+PeJDyJe/K15GvqbJsr/hRVHJnko6pVpkxBY9hA7DQH0HRm0zE9e+z/s+EtiTCALLTGsRve9jF8Ht2WTg7ddn+iDiiy0avaoZ6m8GTV5Rk0xHzz6vbjGodTtjqjM8cjDALt1E3F3BQTdgJaAKAgGu0lH1oY17eVN2TRW5amzrVRSqpTOyx2LGvW1Ilra90nzlp2dEBHH+rU3Jo93jy94eWecFWMwgKBD5sABvhJFteiZTpP6NufkmmJm5UhS1bbWwQ3416ecpKs8D9TAlLLO+rbIocuxdoPE2dxWFYLq6zF8kJV3z7dKYtAwQKdoQiS08ryGXVZybCx2GjZp97I7zNemiorRWKQUrxpNk0vCLwL1yz7NzjlB6YQ8UxvmTkX/GU7T7Ubg9LoyZuVo4tLHLplMSlHIcA4guqZL7JbQ6/jomhcJGFpGo+X7tbrCvMTnbvjZoxJRlcNN1+9x100WEfF4A2XbJZEjcpxV9tk1rTt+jS8dkX803ij16yHI1THSycP2aKkWjgDAsAUt98KCUHLaZi4F73ifo4l7JQoj1djOeLrrsCEaYBrVJtuJVPXjjpHv/B36v7bv6BhL0LQkMwgm8pSYa3fBvOAq3l2ib74w2j2b01ku5P245z+W4lq21AE/PTaYZR5F5nWaQfKMzT8HB92qLwarLi0hBbbFEbEUIZUBdN9TIroRmRrzLIx1IzmoMwQENYtUWaDmknkcj4x9yOy/fdSALl+QtcwUmCpi6m0j863I+F86pEzCkHYvQvPdaW+bx8LBHRdmY6CNIX7w5oxO2NAXEkxwnoE85BE++rTWnjdjWjzJ8AcSSxxEaSCXAF6mtqTjjiHAkyJgmbSXDejv0NeYpybCfDkzwO4zL1qOkq+ZtdME0RqR3eI3Sv2hnO4mbco6Kdff5VZlg6/9qDYi/dNTH8GVYVPAtNKhtEbZRIPR9E+4aRXdIL')
    } else {
      result = await ComPDFKit.init_('t2p6R8/clQc4jpf9A++mB6YfUQ0rrECgKes5bUnW8wGwIf+R1Ot6nRmN4qBoHUqkooBY/9qhRStv0BM95jxXkTj60TiVIXy9WsztqeU33thasOiTK0hdeXMvwYZ4+4BHyQHwkYNf6/3inJiUnRl3xfTNeD8/NENiro+iLdpbEOGBNd7rTzR4p7WNo3bbLVzcvCK0esWkMXZz2+JuzdtwXFXHghkbLejFFVRE3PyIob6iZBawLtt+TUAhnQkbU7Q/Z399YuIiw3ur230H4icn7ZmHHgIJzFTaIYCuluF/QNarTs0Z4eh8ClYm0u6rJz42XHk1PsI10KCfPVxSaVYGvGu0lH1oY17eVN2TRW5amzrVRSqpTOyx2LGvW1Ilra90nzlp2dEBHH+rU3Jo93jy94eWecFWMwgKBD5sABvhJFteiZTpP6NufkmmJm5UhS1bbWwQ3416ecpKs8D9TAlLLO+rbIocuxdoPE2dxWFYLq6zF8kJV3z7dKYtAwQKdoQiS08ryGXVZybCx2GjZp97I7zNemiorRWKQUrxpNk0vCLwL1yz7NzjlB6YQ8UxvmTkX/GU7T7Ubg9LoyZuVo4tLHLplMSlHIcA4guqZL7JbQ6/jomhcJGFpGo+X7tbrCvMTnbvjZoxJRlcNN1+9x100WEfF4A2XbJZEjcpxV9tk1rTt+jS8dkX803ij16yHI1THSycP2aKkWjgDAsAUt98KCUHLaZi4F73ifo4l7JQoj2iW5vEiAxKL+Hs+L5PEV11WKVc3vOYWIu1AAWEabsmhISUekul02fLSjxwtcXbhwDGmOFer4XQ2gyRUAo+ydpYX/ev3VY2ZrUyXsWGHyrDlSFzQ1nW5cOwbM0BhzyHAZevr3Ct4nrLtc0ELnw3glKoYvGz6OKkWoe6qCgesJOfvzh+A49/TL9Ap760hiQNzceOlL4vWLTvXQ9fSDWVZnRxl3wq0mV7E+lek14llLmD1mQypPqwJiH3RTfITGPxxXIdI8xu/5FEGy6+IZn5YrWaJ1yXfMqkdgp6OZpWDHiImeGHFc9l2ZsRcUpj8kY2r6/TAZboh+ksP4pzCLqDpfkZN5Dnbbn7cBliFty0fcuMFlFqVYuDakXTQBwNPN/SNG4a6ZZwc8lYmSRSxaSHWghm')
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
