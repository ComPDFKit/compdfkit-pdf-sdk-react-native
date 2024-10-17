/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { Component } from 'react';
import { Image, TouchableOpacity,Platform } from 'react-native';
import { ComPDFKit } from '@compdfkit_pdf_sdk/react_native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import CPDFReaderViewExampleScreen from './src/CPDFReaderViewExample';
import SettingScreen from './src/screens/SettingScreen';

const Stack = createNativeStackNavigator();

const androidLicense = 'm1bIAk/3mPQu+j6vJAMeauodNbxWBKE5DsdcvD+/dixxtZP2sLsLi4V9Cqj7mLP1hPTTYkfKrKTjpMqf06+f1ySt18aLuYh9IbHZpbhldGb4Vi8NG8rB/N/B6Dl4kqL80a7wlswqzKj/5OuTcbnVgOgC892udbsjcuh1/RVdujWYZn+eEgOyiWCyyOB1I7h0KkvqU+Uhjs1hI4UUOl5Zf43EZKcj7WkbI91UCGL4FpBs5QX1Gxt+9agdNGWTedmShLYyLw/50nOkO7VdvFScVoArkE7w02WT1dtzbrAePMNEzKFco58L5kCTkJKXdlLft12zv5kUhw2TZkrDuIiJWmu0lH1oY17eVN2TRW5amzrVRSqpTOyx2LGvW1Ilra90nzlp2dEBHH+rU3Jo93jy94eWecFWMwgKBD5sABvhJFteiZTpP6NufkmmJm5UhS1bbWwQ3416ecpKs8D9TAlLLO+rbIocuxdoPE2dxWFYLq6zF8kJV3z7dKYtAwQKdoQiS08ryGXVZybCx2GjZp97I7zNemiorRWKQUrxpNk0vCLwL1yz7NzjlB6YQ8UxvmTkX/GU7T7Ubg9LoyZuVo4tLHLplMSlHIcA4guqZL7JbQ6/jomhcJGFpGo+X7tbrCvMTnbvjZoxJRlcNN1+9x100WEfF4A2XbJZEjcpxV9tk1rTt+jS8dkX803ij16yHI1THSycP2aKkWjgDAsAUt98KCUHLaZi4F73ifo4l7JQoj0MxqN2wuiDb2PRCz4539YtkdVIZEXZTwWHfrGGmBtk3dx1799HZhql3JBz0M8qWu0orf8D8MSMhoXp8+4gqXbcjQenhtwoj/Djoo004nn6imYxyhOvWz1Gr+RnmewvsMekW5tRLYGyh4Wzm8iz7FfbeUBBSnACmDjQJakv7XZbEC+8aL7krtxm/FHFSIEQ16OXVquY+uWr1r5qGwfIX5PeVDJnm/N/Wr1SQL0aw1U39cth85eJcdDrrSE+Qsa+ZM5dJ3Wz5uqSZb/edA4VQTm9v11EslX6/qIaDIY9MV63ZN5xLwpFEG1t+aAFBUxaz4xBYu66dXNz1mZ12KGm03c/VbZB9RRCWzag8ple8Qp54b33fhHNpH59zJUfLY80vUJhiyZlMVDKJ5nvFgOcnq+c+5t6xDPfO1JnRjw3rWXr5Q==';

const iosLicense = 'k8cRjNZmpwl8nRNmhDkGHZkScqL/8K0p3GkgsPccyRg68tYV8XQUQHqadfwPIcApm+E0+bvXcixswLpTBVXRiiV1iG7Gd3EqtnUxPiwr1osBfryaV/d7bzjfHsCKReEZ80efAnQIBjiSJkdB56EAUkotSP9Mj4283F8T6gVumAVqIvlykMKh8kotRF19DgSTRt3s9E4/ezDf8yg/BKj0/DS6gQSDvBZyCSACKoY083ejiTJ6YhumZgb7gESwCNOGbfRqv4VVX8ln/gseGdbm6xDbvgpj6w3Tm29juBz3FJn7iORQaDf+PA4afkt2W1U3yaCTI28UnHVg/CmDF+FP92u0lH1oY17eVN2TRW5amzrVRSqpTOyx2LGvW1Ilra90nzlp2dEBHH+rU3Jo93jy94eWecFWMwgKBD5sABvhJFteiZTpP6NufkmmJm5UhS1bbWwQ3416ecpKs8D9TAlLLO+rbIocuxdoPE2dxWFYLq6zF8kJV3z7dKYtAwQKdoQiS08ryGXVZybCx2GjZp97I7zNemiorRWKQUrxpNk0vCLwL1yz7NzjlB6YQ8UxvmTkX/GU7T7Ubg9LoyZuVo4tLHLplMSlHIcA4guqZL7JbQ6/jomhcJGFpGo+X7tbrCvMTnbvjZoxJRlcNN1+9x100WEfF4A2XbJZEjcpxV9tk1rTt+jS8dkX803ij16yHI1THSycP2aKkWjgDAsAUt98KCUHLaZi4F73ifo4l7JQoj2iW5vEiAxKL+Hs+L5PEV11WKVc3vOYWIu1AAWEabsmhM84JYFRJ5OEafgXqld/e33OF6y/AKkLAexGrdMfOgtVOqFZe7OZV30hvPm4E6Lj5CFzQ1nW5cOwbM0BhzyHAZcaBBJHgnC9UDxaNtMU0CAju0bJYR1DwGOYvM+JXZoZUTh+A49/TL9Ap760hiQNzceOlL4vWLTvXQ9fSDWVZnRxl3wq0mV7E+lek14llLmD1mQypPqwJiH3RTfITGPxxXIdI8xu/5FEGy6+IZn5YrWaJ1yXfMqkdgp6OZpWDHiImeGHFc9l2ZsRcUpj8kY2r6/TAZboh+ksP4pzCLqDpfkZAPJEs0FRGAnnH/mn+1/VqzzgJrdFUZwZzDkDVvwdMntbR//egB4v2zc1/BtVZjx4TFwbN27pSDkcOPuAk1nSCQ==';

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

    var result = await ComPDFKit.init_(Platform.OS === 'android' ? androidLicense : iosLicense)
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
