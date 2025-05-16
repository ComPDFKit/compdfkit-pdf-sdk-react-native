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
import CPDFPagesExampleScreen from './src/CPDFPagesExample';
import CPDFWidgetsExampleScreen from './src/CPDFWidgetsExample';

const androidLicense = 'RmQtBKZp3ZBOLrTE9iT6rx5mX25R63bWZYNFYVtXmxLJ52gsquPRZR3SC+Y/9ebuuNHte5ewi6b+RJhsLH1CC8fZ1fa9WgcgzAyUk6tkTKVQ0IlNzpIl6avn6VZZ8z739mEtExZHF/jIOeF4wi6oUcnD57UHEHLlorviCr7ezeBJG3nJuR7CbOsDGTxFPz1mAQPXPno82TsYIQOVd0YZH+FL3PsyKYaOnSpzl2vErP1ykUhKSLGqX0UjF3/aamA3hxrsXLCnH6N2G1L5jwyr4Bw+ZigoHMQglgWkyr2pxMDvpAC5ODUdCU43GHzKUy2ZmqGm4k3cQ1dexFQVg1krMGu0lH1oY17eVN2TRW5amzrVRSqpTOyx2LGvW1Ilra90nzlp2dEBHH+rU3Jo93jy94eWecFWMwgKBD5sABvhJFteiZTpP6NufkmmJm5UhS1bbWwQ3416ecpKs8D9TAlLLO+rbIocuxdoPE2dxWFYLq6zF8kJV3z7dKYtAwQKdoQiS08ryGXVZybCx2GjZp97I7zNemiorRWKQUrxpNk0vCLwL1yz7NzjlB6YQ8UxvmTkX/GU7T7Ubg9LoyZuVo4tLHLplMSlHIcA4guqZL7JbQ6/jomhcJGFpGo+X7tbrCvMTnbvjZoxJRlcNN1+9x100WEfF4A2XbJZEjcpxV9tk1rTt+jS8dkX803ij16yHI1THSycP2aKkWjgDAsAUt98KL+h4U+jgXH+NDKksS1nHNj/D5gUzVZb9YIL3msCOLra5s0djhCW/JhHu8oi6evWdC/l9/zka20p2J+S0gYBJZVV5PqpP/oz1yrxd3HL4q+XfQLspe7UnwbzsomDK6UNMOB6wL5IX/83nH3cl+UQPxeYRErTdWFnoeZzM8/GIywzMMgjtLWq6R7TnuUISCr546/OVWed0jdIirfoinBa7gxOOBksvggxxsojoM7/ibLYeGd1bpQRolFEjmon/x/uepb+Qu0eSnK+vc/PksIFmR8e9r3XfNPfa0vGVFG5iuYc+IQqltAs8+zcFcFcwRT5oyPnefdyXsoErUnnJ8WMqohz514PVUGRuOb1aq9iOWg5xUk1cnFIp61BJlh7lypQEtbVCheDOJRIFsKY4SMlzMXEGNHXasYHCtgjkF6rkxDNel8IuIrT6GXxYBIAVYmRbMlxqetnGiE7rcK2kvckRgC5qXRifiQqN5qZswrqFN0pB0MN8h8RRa4B7vone+Bm3lvO2jicERnlS08z2v/+ICk=';

const iosLicense = 'LGH/ygRZOohz2FAUacyeob+f7ECSRgYWU/uBlAZbmKiXyX5sIFPyE0PDvSDF0LANhZYwoPaxLm5UUKenWhPSxZ/FZDEgse0MY0FzYXihnQqPzQ8ymyCrZ2lUrQdzWWQlndPkebb0vfzLjtbk4hgkeZ1pKDSf+EY0LuOTl7joQHG+5SeQcxxog/vE3T6mA7VDT89DgnkWFz6IjQ6Vs1HG03mKms99X/wDWuXZvecLkmXp8clCp7NiUdVpRTxxb8YgzlZl8+uEHisxwtIcxUqNDFsnfTQWBouCDumTWd3IpbGVj/OHG4maHvytVdT4HzwiE8Hk1vOQTXQXDjRLHWUhlWu0lH1oY17eVN2TRW5amzrVRSqpTOyx2LGvW1Ilra90nzlp2dEBHH+rU3Jo93jy94eWecFWMwgKBD5sABvhJFteiZTpP6NufkmmJm5UhS1bbWwQ3416ecpKs8D9TAlLLO+rbIocuxdoPE2dxWFYLq6zF8kJV3z7dKYtAwQKdoQiS08ryGXVZybCx2GjZp97I7zNemiorRWKQUrxpNk0vCLwL1yz7NzjlB6YQ8UxvmTkX/GU7T7Ubg9LoyZuVo4tLHLplMSlHIcA4guqZL7JbQ6/jomhcJGFpGo+X7tbrCvMTnbvjZoxJRlcNN1+9x100WEfF4A2XbJZEjcpxV9tk1rTt+jS8dkX803ij16yHI1THSycP2aKkWjgDAsAUt98KJfMhDVdBtIWgg2xXbvUdZcI64/olAhMlJtgtzX6jWQPFJR0JOwAOG6qfCy/DtzIW3nDTvhR8ars8BMmuBeTaRq+AcpgTkjA/IdfbVsUdwpcAtNxUHMeXgadhOwL0Tk7ccq2klvygZT5+YYzzFafTOl2zhyA5SZe4rlhbamLnoweqy5yOwfo76Jhm61XyVfjihpFJdStNJxmGSTuQ06bz3SVxawQXMykJth+G0a7m9jGd8uEfMCz378qP/3oPBmSGbZCgU0nIVuB+PF1h/ZUwtC6Cc74Lj0MTrXKRLQKweHh19YpV8MjznmetDMlWvfKnRRyRbIOX2e4Vc18UHFDK2cPEDY4UoSuet/Q3cpfiqTDlQNhh5Q2SNvVvr4NBBaH0LMU/d/dbTKfUUH3ENpV7DBRNaj3hqFWtS0sj3Poue5aKzhuZBUk/NeTBm05uTlhUEcn9u37606wkgErzP4SBLUIHPNm/6aOY5UJHb8eAXN0FBniqS8FUuZdFVI5LCWbjseSGtOeUZ2j4o9zeSZzXes=';

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
