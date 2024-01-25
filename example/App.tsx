/**
 * Copyright © 2014-2023 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { Component } from 'react';
import configuration from './assets/configuration.json';
import DocumentPicker from 'react-native-document-picker'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  NativeModules
} from 'react-native';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.tsx
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
        <Button
          title={'Open sample document'}
          onPress={() => {
            this.jumpToNativeView();
          }}
        />
        <View style={{margin:5}}/>
        <Button 
          title={'pick document'}
          onPress={() => {
            try {
              const pickerResult = DocumentPicker.pick({
                type: [DocumentPicker.types.pdf]
              });
              pickerResult.then(res => {
                if (Platform.OS == 'android') {
                  // only android
                  NativeModules.OpenPDFModule.openPDFByUri(res[0].uri, '', JSON.stringify(configuration))
                } else {
                  NativeModules.OpenPDFModule.openPDFByConfiguration(res[0].uri, '', JSON.stringify(configuration))
                }
              })
            } catch (err) {
            }
          }}
        />
      </View>
    );
  }

  jumpToNativeView() {
    NativeModules.OpenPDFModule.openPDF(JSON.stringify(configuration))

    // NativeModules.OpenPDFModule.openPDFByConfiguration(filePath, password, JSON.stringify(configuration))

    // only android platform
    // NativeModules.OpenPDFModule.openPDFByUri(uriString, password, JSON.stringify(configuration))
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }
});
