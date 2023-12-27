/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

 import React, { Component } from 'react';
 import {
   Platform,
   StyleSheet,
   Text,
   View,
   Button,
   NativeModules
 } from 'react-native';

 var nativeModule = NativeModules.OpenNativeModule;
 // var analyticsModule = NativeModules.UMAnalyticsModule;

 const instructions = Platform.select({
   ios: 'Press Cmd+R to reload,\n' +
     'Cmd+D or shake for dev menu',
   android: 'Double tap R on your keyboard to reload,\n' +
     'Shake or press menu button for dev menu',
 });



 // set disable functionality:
 const configuration = {
                         "modeConfig": {
                           // setting the default display mode when opening
                           // viewer、annotations、contentEditor、forms、digitalSignatures
                           "initialViewMode": "viewer"
                         },
                         // top toolbar configuration:
                         "toolbarConfig": {
                           "androidAvailableActions": [
                             "thumbnail",
                             "search",
                             "bota",
                             "menu"
                           ],
                           // ios top toolbar left buttons
                           "iosLeftBarAvailableActions":[
                             "back",
                             "thumbnail"
                           ],
                           // ios top toolbar right buttons
                           "iosRightBarAvailableActions":[
                             "search",
                             "bota",
                             "menu"
                           ],
                           "availableMenus": [
                             "viewSettings",
                             "documentEditor",
                             "security",
                             "watermark",
                             "documentInfo",
                             "save",
                             "share",
                             "openDocument"
                           ]
                         },
                         // readerView configuration
                         "readerViewConfig": {
                           "linkHighlight": true,
                           "formFieldHighlight": true
                         }
                       };
 
 type Props = {};
 export default class App extends Component<Props> {
   render() {
     return (
       <View style={styles.container}>
         <Text style={styles.welcome}>
           Welcome to React Native!
         </Text>
         <Text style={styles.instructions}>
           To get started, edit App.js
         </Text>
         <Text style={styles.instructions}>
           {instructions}
         </Text>
         <Button
           title={'Jump to the native page'}
           onPress={() => {
             this.jumpToNativeView();
           }}
         />
       </View>
     );
   }
   
   jumpToNativeView() {
        NativeModules.OpenPDFModule.openPDF(JSON.stringify(configuration))
        // NativeModules.OpenPDFModule.openPDFByConfiguration(filePath, password, JSON.stringify(configuration))
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
   },
 });
 