/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { ComPDFKit } from '@compdfkit_pdf_sdk/react_native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import CPDFReaderViewExampleScreen from './src/CPDFReaderViewExample';
import SettingScreen from './src/screens/SettingScreen';

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
    // Online certification, Fill in your online license
    // Returns true if initialization is successful, otherwise returns false.

    //  var result = await ComPDFKit.initialize('NjYzODcyYTMxOWQzMA==', 'NjYzODcyYTgxM2YwNg==')
    //  console.log("ComPDFKitRN", "initialize:", result)

    // Offline authentication, Fill in your offline license
    var result = await ComPDFKit.init_('jkqgDbjmu/wZnFWVRjEjvZ97oJE65uEurW3WqNaVyhFj1HXmeFsxUATQn4p0HYABrjJkvsZ8lbP1w/h/XpNuEHBYscDEUOdJO4wvY9/rKRb6Cizo1016AAzPEkY5m9l+nF4sfx1xf6VTCjhBEwHjo8uu+804VbZSIskn58mcHg0RcsydGYfQyYGf2ec7ZgSRa6Af+rd7De833kbPx2XI8G1YtXCltFfuQSXgYhE48o8BrAIwRLUMxXtMiVvzOBsR7YpYWNmZopopr5Gl9bLsvOK/VNDzHxGaDUg3CspTydlcJqangWZwi/i/SAdyHAVEZDmx8yshp4ts7fM2ore1m2u0lH1oY17eVN2TRW5amzqSj1QR5Q0MX/v2nFNCjvJImeroTsMiyvSO5KjU5Zrs50NckPDhF4Jmjsjb0LXK/bRpxkkuyEYFaz4564aaZEovVo8qwJUkIDPadcRz3j1bMwrqiQMhyGL/CLyGlIiYGkjTdTyNMMHpYPUwPldrVMX4inb9KYdgJggKiH4aXNda34I5yuEfzFxlh8twdPhV7TyiUlFC5mg1ZXVW4rENlJxGheVfNI+5KOfueczv6umprFKusrOsv3g1BSw+mmRndsOcha/6QKMJHwnrDE1N2OTENH0a2YGMI+IdylVlk9Belz0e7qXSW2p6XVnGIzVa12xNGYjQV4tC0mUG8KeUljNpyqd6jdpA0bccj7S1aoN5ky53LuaWx/EZdW9UM3uuB/gJwbizOgM1HWwN4k+xh/zqL3M8AoJo5yXAPiYfIQoS3E1LqRj/dyR3uQhMlfCCGsA=')
    console.log("ComPDFKitRN", "init_:", result)
    
  }

  render() {
    return (
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
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
