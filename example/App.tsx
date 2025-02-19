/**
 * Copyright © 2014-2025 PDF Technologies, Inc. All Rights Reserved.
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
import RNFS from 'react-native-fs';

import HomeScreen from './src/screens/HomeScreen';
import CPDFReaderViewExampleScreen from './src/CPDFReaderViewExample';
import SettingScreen from './src/screens/SettingScreen';
import CPDFReaderViewControllerExampleScreen from './src/CPDFReaderViewControllerExample';
import CPDFAnnotationsExampleScreen from './src/CPDFAnnotationsExample';
import CPDFSecurityExampleScreen from './src/CPDFSecurityExample';

const androidLicense = 'rbbJE34FnGSu19mumutDtH/JnZhGG/F6seFnRkRsptiPhTZhNJOzf51sCT12LQ156NyvXbTeAyPG0OjCqApqvQc6DWibQP8onZSn/sUb6BBAlbx+t4+7MCivLFhFFIpVq591KeYsrLJrvaZKDqVBYVpy7BHvTSgyLs3+NgQaWFJRQsRmUsyu45BZDXA2wY+IZp+JwQM2/SF/WqulTugytbdep2zBlvPoBKQRGNlcTa2dRTbZaR5OMh6yqOCPcEVFA5GXzynDoz4MOLZsEs8i5ia5k6LuzDWLcdBvALMyQqWOahVsg7lnGGuV8pKWva9JO6l/ID5e3mMDDTS+kF3g6mu0lH1oY17eVN2TRW5amzrVRSqpTOyx2LGvW1Ilra90nzlp2dEBHH+rU3Jo93jy94eWecFWMwgKBD5sABvhJFteiZTpP6NufkmmJm5UhS1bbWwQ3416ecpKs8D9TAlLLO+rbIocuxdoPE2dxWFYLq6zF8kJV3z7dKYtAwQKdoQiS08ryGXVZybCx2GjZp97I7zNemiorRWKQUrxpNk0vCLwL1yz7NzjlB6YQ8UxvmTkX/GU7T7Ubg9LoyZuVo4tLHLplMSlHIcA4guqZL7JbQ6/jomhcJGFpGo+X7tbrCvMTnbvjZoxJRlcNN1+9x100WEfF4A2XbJZEjcpxV9tk1rTt+jS8dkX803ij16yHI1THSycP2aKkWjgDAsAUt98KL+h4U+jgXH+NDKksS1nHNj/D5gUzVZb9YIL3msCOLra4rzx64xPkJIcG6OXS1I7ASw3WWaEyJI4QKz6HXbZVHElJx5uuHIhpDNpBfXjax9kTT1Mzoph8Erom3hpRQDJSC2kvsKCucB2mdJLA7WTQ9Dq5pRmWXKTD/ai5zNtuN7pC8yRr9oKkPeGPYIjBPgWARDCEIZ7Rf9+/RTkZdbGHfll7zGmrsqVrVuYKYpSwbyNgiXJYToIyivs4+KgV2p+F7tt51Noj0WSS2ElzuLDGBt30KBnZPmMtd+2b8DUWw/52swmGAQwiAvmwIXS7p/3qNnMOP0anG+yUppiVnRlTB8fA11CjAWlPcYHpNU0Rne3ByvR3dptlknz9cdRS0IBFgtdeLznIunz3Fy/mdGGKU5mRPfGllKeWrZUHA7apS2GPE8xv7A9FrUFMFzWJLqFIHzaC1MQ3kkvme60gCvofx8BiQipXClbzvo7TI5qTVVozCXZF48sRJQbUOelPyjSCwBU35tqO2nPB0yHmCnEk+O4mPrM4DEwHsRi9KaXrnj9';

const iosLicense = '6Z+bqN9RVWKMekb+VATJoknfdaJFIJil/sGapkJiTBLy6krla9+e2/hcOm2FZgaFXNOr8B+z8D4xOpr3ya3tlv1LpLZ8fwZlNJ5S1rXvyJAzJ3vr8IqMsFc15llOSWVDW7KulaM6dChhiICg+oLXSQUG4AC3U/tVxuwgcYLDfuXwM2uYUmSNSPpkXQdLNxSC9S+/UdCnYOdkJqq3BfwMeh4D/isBIe0oy1XGXMclcl+cSAHrXGevk4RU8zMfrisCnw4NdpumXfE3HgOEtyShkJ2mtX1LgmHCxr3zzQ7gSIWRuRrQRwJOekhZSAG9t2SBIi7vth9si8h8vn4wlMmx3Gu0lH1oY17eVN2TRW5amzrVRSqpTOyx2LGvW1Ilra90nzlp2dEBHH+rU3Jo93jy94eWecFWMwgKBD5sABvhJFteiZTpP6NufkmmJm5UhS1bbWwQ3416ecpKs8D9TAlLLO+rbIocuxdoPE2dxWFYLq6zF8kJV3z7dKYtAwQKdoQiS08ryGXVZybCx2GjZp97I7zNemiorRWKQUrxpNk0vCLwL1yz7NzjlB6YQ8UxvmTkX/GU7T7Ubg9LoyZuVo4tLHLplMSlHIcA4guqZL7JbQ6/jomhcJGFpGo+X7tbrCvMTnbvjZoxJRlcNN1+9x100WEfF4A2XbJZEjcpxV9tk1rTt+jS8dkX803ij16yHI1THSycP2aKkWjgDAsAUt98KCUHLaZi4F73ifo4l7JQoj2iW5vEiAxKL+Hs+L5PEV11ApZ1vdeZH2OjP2tm5Ddn1vUmrLCNlLs0O2/IIy+lJgWBx0neeYkWPlBX+cpZqBFqttUw34GKCdD7Ed5hoEK8BEdlZO66GHu+Cfr8i48R7iCpdNebl1Y7vyblOeeaHHodyIfzI2P6fYnkslsauXi2UqzcCeiRYaOnUw5xt9GzcvAfka8jMwHf9mpSHCRl1zjON4QIyuPQwC15J0slX1znUiPWN791kjTcd3M6eXNLGpxOsn1ByOPf5QfMdgOIFS9L9sd5cWpEutbA4EXL3ij99ZnAuGjOq2PAG7zfpr8bwl9X1wS07eUU9V4eJlfv33bE5rh/6wxjUk1eS3DWU8y/0zXHoYH21F/G8NWar9g6J6J3E8GryCQaQbuznJWzNZcwPF4VW9PEI6i9ZQQjHSQQQhiDdcco7ZU83kyn+9FUk7Tpn6mczkbeB5HMVSYBz9gej5bELGvHg0jiXnjI6mVpIQ==';

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
    const fontDir = await copyAssetsFolderToStorage('extraFonts');
    console.log('ComPDFKitRN', "fontDir:", fontDir)
    await ComPDFKit.setImportFontDir(fontDir, true);
    // Online certification, Fill in your online license
    // Returns true if initialization is successful, otherwise returns false.

    //  var result = await ComPDFKit.initialize('Njc4NzI1OGQ3ZGQyZQ==', 'Njc4NzI1OGQ3ZGQyZQ==')
    //  console.log("ComPDFKitRN", "initialize:", result)

    // Offline authentication, Fill in your offline license
    var result = await ComPDFKit.init_(Platform.OS == "android" ? androidLicense : iosLicense)
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
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}




const copyAssetsFolderToStorage = async (folderName : string) => {
  try {
    // Define the target storage directory
    const targetDir = `${RNFS.DocumentDirectoryPath}/${folderName}`;

    // Ensure the target directory exists
    const dirExists = await RNFS.exists(targetDir);
    if (!dirExists) {
      await RNFS.mkdir(targetDir);
    }

    if (Platform.OS === 'android') {
      // Android: Read all files in the folder
      const files = await RNFS.readDirAssets(folderName); // Returns an array of file objects
      for (const file of files) {
        if (file.isFile()) {
          const fileContents = await RNFS.readFileAssets(`${folderName}/${file.name}`, 'base64'); // Read file from assets
          const targetFilePath = `${targetDir}/${file.name}`;
          await RNFS.writeFile(targetFilePath, fileContents, 'base64'); // Write to target
        }
      }
    } else if (Platform.OS === 'ios') {
      // iOS: Copy files directly
      const files = await RNFS.readDir(`${RNFS.MainBundlePath}/${folderName}`);

      for (const file of files) {
        if (file.isFile()) {
          const sourcePath = file.path;
          const targetFilePath = `${targetDir}/${file.name}`;
          if(await RNFS.exists(targetFilePath)){
            continue;
          }
          await RNFS.copyFile(sourcePath, targetFilePath);
        }
      }
    } else {
      throw new Error('Unsupported platform');
    }

    return targetDir; // Return the target directory path
  } catch (error) {
    console.error('Error copying folder:', error);
    throw new Error('Failed to copy folder to storage.');
  }
};
