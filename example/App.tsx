/**
 * Copyright © 2014-2026 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { Component } from 'react';
import { Image, Platform, TouchableOpacity } from 'react-native';
import { ComPDFKit } from '@compdfkit_pdf_sdk/react_native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuProvider } from 'react-native-popup-menu';

import HomeScreen from './src/screens/HomeScreen';
import CPDFReaderViewExampleScreen from './src/CPDFReaderViewExample';
import SettingScreen from './src/screens/SettingScreen';
import CPDFReaderViewControllerExampleScreen from './src/CPDFReaderViewControllerExample';
import CPDFAnnotationsExampleScreen from './src/CPDFAnnotationsExample';
import CPDFSecurityExampleScreen from './src/CPDFSecurityExample';
import CPDFPagesExampleScreen from './src/CPDFPagesExample';
import CPDFWidgetsExampleScreen from './src/CPDFWidgetsExample';
import CPDFSearchTextExampleScreen from './src/CPDFSearchTextExample';
import CPDFContentEditorExampleScreen from './src/CPDFContentEditorExample';
import CPDFFormCreationExampleScreen from './src/CPDFFormCreationExample';
import CPDFCustomToolbarExampleScreen from './src/CPDFCustomToolbarExample';
import CPDFEventListenerExampleScreen from './src/CPDFEventListenerExample';
import CPDFCustomUiStyleExampleScreen from './src/CPDFCustomUiStyleExample';
import CPDFCustomContextMenuExampleScreen from './src/CPDFCustomContextMenuExample';
import CPDFCustomAnnotationCreateExampleScreen from './src/CPDFCustomAnnotationCreateExample';
import { CPDFFileUtil } from './src/util/CPDFFileUtil';

const Stack = createNativeStackNavigator();

type Props = {
  navigation: any;
};

export default class App extends Component<Props> {


  constructor(props: Props) {
    super(props)
    this.initialize()
  }

  async initialize() {
    const fontDir = await CPDFFileUtil.copyAssetsFolderToStorage('extraFonts');
    console.log('ComPDFKitRN', "fontDir:", fontDir)
    await ComPDFKit.setImportFontDir(fontDir, true);

    var result = await ComPDFKit.initWithPath(Platform.OS == "android" ? "assets://license_key_rn.xml" : "license_key_rn.xml")
    console.log("ComPDFKitRN", "init_:", result)
  }

  render() {
    return (
      <MenuProvider>
        <NavigationContainer>
          <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={({ navigation }) => ({
            title: 'ComPDFKit PDF SDK for ReactNative',
            headerStyle: {
              backgroundColor: '#FAFCFF',
            },
            headerTitleStyle: { fontSize: 16 },
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Image source={require('./assets/ic_setting.png')} style={{ width: 24, height: 24 }} />
              </TouchableOpacity>
            ),
          })} />
          <Stack.Screen name='Settings' component={SettingScreen} options={{
            headerStyle: {
              backgroundColor: '#FAFCFF',
            },
          }}/>
          <Stack.Screen name='CPDFReaderViewExample' component={CPDFReaderViewExampleScreen} options={{
            headerShadowVisible: false,
            headerTitleStyle: { fontSize: 16 },
            headerStyle: {
              backgroundColor: '#FAFCFF',
            },
          }} />
          <Stack.Screen
            name='CPDFReaderViewControllerExample'
            component={CPDFReaderViewControllerExampleScreen}
            options={() => ({
                  headerShown: false,
              })}
          />
          <Stack.Screen
            name='CPDFAnnotationsExample'
            component={CPDFAnnotationsExampleScreen}
            options={() => ({
                  headerShown: false,
              })}
          />
          <Stack.Screen
            name='CPDFSecurityExample'
            component={CPDFSecurityExampleScreen}
            options={() => ({
                  headerShown: false,
              })}
          />
          <Stack.Screen
            name='CPDFPagesExample'
            component={CPDFPagesExampleScreen}
            options={() => ({
                  headerShown: false,
              })}
          />
          <Stack.Screen
            name='CPDFWidgetsExample'
            component={CPDFWidgetsExampleScreen}
            options={() => ({
                  headerShown: false,
              })}
          />
          <Stack.Screen
            name='CPDFSearchTextExample'
            component={CPDFSearchTextExampleScreen}
            options={() => ({
                  headerShown: false,
              })}
          />
          <Stack.Screen
            name='CPDFContentEditorExample'
            component={CPDFContentEditorExampleScreen}
            options={() => ({
                  headerShown: false,
              })}
          />
          <Stack.Screen
            name='CPDFFormCreationExample'
            component={CPDFFormCreationExampleScreen}
            options={() => ({
                  headerShown: false,
              })}
          />
          <Stack.Screen
            name='CPDFCustomToolbarExample'
            component={CPDFCustomToolbarExampleScreen}
            options={() => ({
                  headerShown: false,
              })}
          />
          <Stack.Screen
            name='CPDFEventListenerExample'
            component={CPDFEventListenerExampleScreen}
            options={() => ({
                  headerShown: false,
              })}
          />
          <Stack.Screen
            name='CPDFCustomUiStyleExample'
            component={CPDFCustomUiStyleExampleScreen}
            options={() => ({
                  headerShown: false,
              })}
          />
          <Stack.Screen
            name='CPDFCustomContextMenuExample'
            component={CPDFCustomContextMenuExampleScreen}
            options={() => ({
                  headerShown: false,
              })}
          />
          <Stack.Screen
            name='CPDFCustomAnnotationCreateExample'
            component={CPDFCustomAnnotationCreateExampleScreen}
            options={() => ({
                  headerShown: false,
              })}
          />
          </Stack.Navigator>
        </NavigationContainer>
      </MenuProvider>
    );
  }
}





