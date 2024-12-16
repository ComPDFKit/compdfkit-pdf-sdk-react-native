/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { Component } from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { ComPDFKit } from '@compdfkit_pdf_sdk/react_native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import CPDFReaderViewExampleScreen from './src/CPDFReaderViewExample';
import SettingScreen from './src/screens/SettingScreen';
import CPDFReaderViewControllerExampleScreen from './src/CPDFReaderViewControllerExample';

var androidLicense = "c4r34cNxld6pdUSsM2EgGQ9purMEZN7JuumHbNx9w+OJ6lYqF7WRYAFV0jvA5CEEX7J1+wGrF68mo8YP3qL5b6lmS60TMw2/wJ+TPtmeKkJMRMaiQ2nF2pwSevBj2HIHbnTLfr2btYHL/TRKFbfG0SUp/tZVjUwOC91rcrlaLkThWpc13/3SOi/34uHyjQszJ6PmDeg8X+qxfNheOBX/JZofPOjKpWpAAXXKT9kgtbZKKc6VAmMPAdRth7FnJjPieXkHkvW3fX2kNcgX6cb8IBnu/7Q3C4776P6IVIQKlDItMGNJIV7IPMADRnsLMqdC9FZcF3mV0laocg8qlFuKdmu0lH1oY17eVN2TRW5amzrVRSqpTOyx2LGvW1Ilra90nzlp2dEBHH+rU3Jo93jy94eWecFWMwgKBD5sABvhJFteiZTpP6NufkmmJm5UhS1bbWwQ3416ecpKs8D9TAlLLO+rbIocuxdoPE2dxWFYLq6zF8kJV3z7dKYtAwQKdoQiS08ryGXVZybCx2GjZp97I7zNemiorRWKQUrxpNk0vCLwL1yz7NzjlB6YQ8UxvmTkX/GU7T7Ubg9LoyZuVo4tLHLplMSlHIcA4guqZL7JbQ6/jomhcJGFpGo+X7tbrCvMTnbvjZoxJRlcNN1+9x100WEfF4A2XbJZEjcpxV9tk1rTt+jS8dkX803ij16yHI1THSycP2aKkWjgDAsAUt98KL+h4U+jgXH+NDKksS1nHNjVoJYvPaW7TLcBzT0GegIgNKELjvoahi+wfYUt79velJ1uEBhEcnvnIjlShtHdqKbE/lMbb2sG0lJnFUhViYIpkjXvy5b9ucuZfz1pm7f173QY75AXVUGgMkMI0XuV2tjDFnThFHtTgDnaOzHyyOwRiOuiM74ieBmwFqkOo4SQtUrUWPDK459l8FoqAa8XlJoWZXcbU1OotvnT9I1MMGTsC2l+b6sDxoJ4wc1wj9IhAmx7tmXnQyD/0q8NOKUk9E1AtfrYSdkTjCzdEI1HZ08LcyYnRNJNARTHNh8okrNDwA4seKyLl/XIfxmIx7IaLGx0VavXDAus9AAd+knf5we5iXWY7SJO2ZrxRJgotLWE/jY7Pg8FofBwr9sBt/VEJDcb1pbHKvag2rGKlyAigV4KkFoi+kJdO9xKXMBDKAZnsA==";

var iosLicense = "pK3jYP2WpjMMxnh3h6rfCYYfGmC+UBVo0gUMVTUPFJAOnn7n2KlSDYYFoROfARAO5cco1M72URpb87XQVVvV+sI/mzReM6Sbl78n89xVI/wacDVcn9lVGZH6rKg5q/f+17rHUH1JQCEilQFUxvoer4kuymdeME6Ux+CsXiD9U3GqMAwDAuvCazhwWWYdZSeQEo/KzTL1/ZbF6AdfEFP9K7Gk2q7RcuwX0WaH22At997+WnwH2EpwfXQGtUSVYO7LGMn7kCs+m+CU6hMmG0S9YRz9oTm7jAk99+y3RaJXkIETmZj5OWTIPVGjNuDKhNASTddpPc68mSFrBmizUniO1Wu0lH1oY17eVN2TRW5amzrVRSqpTOyx2LGvW1Ilra90nzlp2dEBHH+rU3Jo93jy94eWecFWMwgKBD5sABvhJFteiZTpP6NufkmmJm5UhS1bbWwQ3416ecpKs8D9TAlLLO+rbIocuxdoPE2dxWFYLq6zF8kJV3z7dKYtAwQKdoQiS08ryGXVZybCx2GjZp97I7zNemiorRWKQUrxpNk0vCLwL1yz7NzjlB6YQ8UxvmTkX/GU7T7Ubg9LoyZuVo4tLHLplMSlHIcA4guqZL7JbQ6/jomhcJGFpGo+X7tbrCvMTnbvjZoxJRlcNN1+9x100WEfF4A2XbJZEjcpxV9tk1rTt+jS8dkX803ij16yHI1THSycP2aKkWjgDAsAUt98KJfMhDVdBtIWgg2xXbvUdZdPA+MDYbxOt/kTCqmTNMCBL4i4/N1Dqxvl8Me6vei5LeecqlBZbInEmA+87xsmNJ+d5MxP+EIac9+yqaQ0YIYE4wnAzUkp/0SfANyT5mw/EcTvSxlFmdNPXMpAygK4Q1n/S3QjnpAZJCMhg6hUDQi1TPHJO1WCWdGg50xVd4e9cvnNaN633IvvL9TFBGBu4xx7FHUdlWeiIkfzaiP8Y+58lPpC7x05cs28uc/hwXiZGx2KvdF+199pSLVUIrj85m/7+SqS01Dz6t4RwV7CZ/nQ4KOAyptnYBkUNyyOx7Q7j3CUXnxUN5HL5Yhqq2FFaD/HTTVwcjun3kBQWAiUV1AWYY/lHA5ERHysKmgUkhba8MlQCnsGD2o4KGBScfS0N2kQ3Eg6AtwSRVmQZHRUOuFrRzDh6w9DqXG/2btsFdOOfQ==";

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
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}