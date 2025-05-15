# How to Use ComPDFKit PDF SDK for ReactNative with Expo

[Expo](https://docs.expo.dev/) is a React Native platform that significantly simplifies the development, building, and testing of [React Native](https://reactnative.dev/) applications.

However, a major drawback of Expo is that it is optimized for JavaScript only by default. Developers need additional steps to use any packages that rely on native code. Native code is not included in the initial project setup. To run the app on the appropriate platform, you must use the [Expo Go](https://expo.dev/client) app to provide the necessary platform foundation.

The ComPDFKit ReactNative SDK is implemented on top of the existing ComPDFKit Android and iOS SDKs. This means it cannot be used in projects running inside the Expo Go app.

This guide will walk you through enabling native module support in an Expo project by setting up a development build using Expo Application Services (EAS), allowing you to use the ComPDFKit ReactNative package.

## Prerequisites

To get started, please set up your environment. If you haven’t already installed the following tools, please do so:

- [Android Studio](https://developer.android.com/studio/install)
- [Xcode](https://developer.apple.com/xcode/)
- [Expo CLI](https://docs.expo.dev/get-started/create-a-project/)
- [EAS CLI](https://www.npmjs.com/package/eas-cli)

## Create an Expo Project

Start by creating a regular [Expo](https://docs.expo.dev/) project that can run in [Expo Go](https://expo.dev/client). If you’re new to Expo, it’s recommended to familiarize yourself with the official Expo documentation.

Use the following command to create a new project:

```shell
npx create-expo-app compdfkit_expo
```

> In this example, the project is named `compdfkit_expo`, but you can change it to any name you prefer.

Install the project dependencies using:

```shell
npm install
// or
yarn install
```

Run `npx expo start` to start the application and test if your setup is correct.

## Production Build

If you’re using a production build configuration and don’t have access to the iOS and Android folders locally, use the [Expo BuildProperties](https://docs.expo.dev/versions/latest/sdk/build-properties/) plugin to configure the required build properties for ComPDFKit ReactNative SDK.

Run the following command:

```
npx expo install expo-build-properties
```

Add the following plugin configuration to your `app.json` file:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "compileSdkVersion": 35,
            "minSdkVersion": 24
          },
          "ios": {
            "deploymentTarget": "15.1"
          }
        }
      ]
    ]
  }
}
```

ComPDFKit SDK licenses are bound to the project’s ApplicationID. Update the project’s ApplicationID in your `app.json` file:

```diff
{
  "expo": {
    "ios": {
      "supportsTablet": true,
+      "bundleIdentifier": "com.compdfkit.reactnative.example"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
+      "package": "com.compdfkit.reactnative.example"
    }
  }
```

> This guide uses the RN Demo ApplicationId as an example. You may replace it with your own product’s ApplicationId.

## Development Build

Development builds allow you to run React Native apps outside the Expo Go client. It generates platform-specific modules including all native code required for standalone operation.

EAS configurations are stored in an `eas.json` file. Run the following command in your project root directory:

```shell
eas build:configure
```

> If this is your first time using the command, you’ll be prompted to log into your account. If you don’t have an account, please [sign up for Expo](https://expo.dev/signup).

You’ll see a list of platforms. Choose the one that fits your application, then press Enter.

If you select `All`, an `eas.json` file will be created in your project with contents like:

```json
{
  "cli": {
    "version": ">= 5.4.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

Now that your Expo project is set up for development builds, you can run your app on Android or iOS emulators without the Expo Go client. Run your app locally to verify it works correctly:

```shell
npx expo run:android
npx expo run:ios
```

## Installation

You can integrate the SDK in two ways:

- **Via [ComPDFKit GitHub](https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native):**

  Run this in your **compdfkit_expo** folder:

  ```shell
  yarn add github:ComPDFKit/compdfkit-pdf-sdk-react-native
  ```

- **Via [ComPDFKit npm](https://www.npmjs.com/package/@compdfkit_pdf_sdk/react_native):**

  Run this in your **compdfkit_expo** folder:

  ```shell
  yarn add @compdfkit_pdf_sdk/react_native
  ```

For Android and iOS, some platform-specific settings are required.

### Android

Open `android/app/src/main/AndroidManifest.xml` and add the following permissions:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE"/>

<application
    android:requestLegacyExternalStorage="true"
    ...>
</application>
```

### iOS

Open the Podfile in a text editor:

```shell
open ios/Podfile
```

Add the following within the `target 'compdfkitexpo' do ... end` block:

```shell
pod "ComPDFKit", podspec:'https://www.compdf.com/download/ios/cocoapods/xcframeworks/compdfkit/2.4.0.podspec'
pod "ComPDFKit_Tools", podspec:'https://www.compdf.com/download/ios/cocoapods/xcframeworks/compdfkit_tools/2.4.0.podspec'
```

Then run `pod install` in the `ios` directory.

## Open a PDF

To open a PDF file:

1. Add the test PDF file to `android/app/src/main/assets` on Android. You may need to create this folder if it doesn’t exist.
2. On iOS, drag the downloaded PDF into your project to include it in the app bundle.

Replace the contents of `index.tsx` with the following:

```tsx
import { Platform, SafeAreaView } from 'react-native';
import { Component } from 'react';
import { ComPDFKit, CPDFReaderView } from '@compdfkit_pdf_sdk/react_native';

const androidLicense = 'android license';
const iosLicense = 'ios license';

type Props = {};

export default class HomeScreen extends Component<Props> {
  constructor(props: Props) {
    super(props)
    this.initialize()
  }

  async initialize() {
    const result = await ComPDFKit.init_(Platform.OS === 'android' ? androidLicense : iosLicense);
    console.log("ComPDFKitRN", "init_:", result)
  }

  samplePDF = Platform.OS === 'android'
    ? 'file:///android_asset/PDF_Document.pdf'
    : 'PDF_Document.pdf';

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <CPDFReaderView
          document={this.samplePDF}
          configuration={ComPDFKit.getDefaultConfig({})}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    );
  }
}
```

> Trial licenses for the ComPDFKit ReactNative SDK can be found in the [GitHub example project](https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native/blob/5b16c6af7561941b85256beaa05268145faa04a7/example/App.tsx#L26) or by [contacting our sales team](https://www.compdf.com/contact-sales).

Now you can run your app using `yarn run android` or `yarn run ios`, and the PDF will load from the path you provided.

Note: The ComPDFKit ReactNative SDK will not work when running `expo start` because it relies on the Expo Go app, which cannot access native modules.

This concludes the guide on integrating the `ComPDFKit ReactNative SDK` with `Expo`. For any questions, please [contact us](https://www.compdf.com/support).

## **Support**

[ComPDFKit](https://www.compdf.com/) has a professional R&D team that produces comprehensive technical documentation and guides to help developers. Also, you can get an immediate response when reporting your problems to our support team.

- For detailed information, please visit our [Guides](https://www.compdf.com/guides/pdf-sdk/react-native/overview) page.
- Stay updated with the latest improvements through our [Changelog](https://www.compdf.com/pdf-sdk/changelog-react-native).
- For technical assistance, please reach out to our [Technical Support](https://www.compdf.com/support).
- To get more details and an accurate quote, please contact our [Sales Team](https://compdf.com/contact-us).