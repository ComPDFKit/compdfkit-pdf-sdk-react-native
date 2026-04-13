# How to Use ComPDFKit PDF SDK for ReactNative with Expo

This guide explains how to integrate `@compdfkit_pdf_sdk/react_native` into an Expo project.

ComPDFKit depends on native iOS and Android code, so it is not supported in Expo Go. Use a development build, `expo run`, or EAS Build instead.

The Expo config plugin included in the package updates the iOS Podfile during `expo prebuild`. Manual changes to `ios/Podfile` are not required.

## Before you start

Ensure that your environment is ready for native Expo builds:

- [Android Studio](https://developer.android.com/studio/install)
- [Xcode](https://developer.apple.com/xcode/)
- [Expo CLI](https://docs.expo.dev/get-started/create-a-project/)
- [EAS CLI](https://www.npmjs.com/package/eas-cli)

## Create an Expo project

Run the following commands:

```shell
npx create-expo-app compdfkit_expo
cd compdfkit_expo
```

Then install the Expo project dependencies:

```shell
npm install
# or
yarn install
```

## Install ComPDFKit

Run:

```shell
yarn add @compdfkit_pdf_sdk/react_native
```

## Add the plugins to your Expo config

Update `app.json` as follows:

```json
{
  "expo": {
    "plugins": ["@compdfkit_pdf_sdk/react_native"]
  }
}
```

Also make sure your project uses the correct iOS `bundleIdentifier` and Android `package` values. ComPDFKit licenses are bound to those identifiers.

If your Expo project also needs custom native build settings, such as `compileSdkVersion`, `minSdkVersion`, or `deploymentTarget`, you can additionally install and configure `expo-build-properties`. It is not required for the ComPDFKit plugin itself.

## Generate the native projects

Run:

```shell
CI=1 npx expo prebuild --clean
```

This command generates the `ios` and `android` folders and applies the ComPDFKit plugin.

## Verify that the iOS plugin ran

After prebuild completes, open `ios/Podfile`.

You should see a generated block similar to the following under `use_expo_modules!`:

```ruby
# @generated begin compdfkit-react-native-ios-pods
pod 'ComPDFKit', :podspec => 'https://file.compdf.com/cocoapods/ios/compdfkit_pdf_sdk/2.6.4/ComPDFKit.podspec'
pod 'ComPDFKit_Tools', :podspec => 'https://file.compdf.com/cocoapods/ios/compdfkit_pdf_sdk/2.6.4/ComPDFKit_Tools.podspec'
# @generated end compdfkit-react-native-ios-pods
```

If this block is present, the plugin is working correctly and no manual Podfile changes are required.

## Set up EAS for cloud builds

Run:

```shell
eas build:configure
```

If Expo prompts you to sign in, complete that step first.

If you choose `All`, Expo creates an `eas.json` file similar to the following:

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

## Add the Android permissions

In this phase, the Expo plugin only handles iOS Podfile integration. Android permissions still need to be added manually after prebuild.

Open `android/app/src/main/AndroidManifest.xml` and add the following:

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

## Add a sample PDF for testing

For this example, copy a PDF named `PDF_Document.pdf` into the following locations after prebuild:

1. `android/app/src/main/assets/PDF_Document.pdf`
2. Your iOS app target in Xcode, so that the file is bundled with the app

This example uses native bundled file paths. If you run `expo prebuild --clean` again later, verify whether the sample file needs to be copied again.

## Replace your app code

Replace the contents of `index.tsx` with the following example:

```tsx
import { Platform, SafeAreaView } from 'react-native';
import { Component } from 'react';
import { ComPDFKit, CPDFReaderView } from '@compdfkit_pdf_sdk/react_native';

const androidLicense = 'android license';
const iosLicense = 'ios license';

type Props = {};

export default class HomeScreen extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.initialize();
  }

  async initialize() {
    const result = await ComPDFKit.init_(
      Platform.OS === 'android' ? androidLicense : iosLicense
    );
    console.log('ComPDFKitRN', 'init_:', result);
  }

  samplePDF =
    Platform.OS === 'android'
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

Before running the app, replace `androidLicense` and `iosLicense` with your actual ComPDFKit license values.

> Trial licenses for the ComPDFKit React Native SDK are available in the [GitHub example project](https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native/blob/5b16c6af7561941b85256beaa05268145faa04a7/example/App.tsx#L26) or by [contacting the ComPDFKit sales team](https://www.compdf.com/contact-sales).

## Run the app

Run:

```shell
npx expo run:android
```

Or:

```shell
npx expo run:ios
```

## Build with EAS

Run:

```shell
eas build --platform ios
```

Or:

```shell
eas build --platform android
```

Use these commands when you want Expo to build the native application in the cloud with the same plugin configuration defined in `app.json`.

## Troubleshoot common issues

### Expo Go cannot open the SDK

This behavior is expected. ComPDFKit requires native modules, so use a development build, `expo run`, or EAS Build.

### The generated Podfile does not include ComPDFKit

Ensure that `@compdfkit_pdf_sdk/react_native` is listed in `expo.plugins`, then run:

```shell
CI=1 npx expo prebuild --clean
```

### The sample PDF is missing after prebuild

If you run `expo prebuild --clean`, Expo regenerates the native projects. Copy the sample PDF into the generated native project again.

## Support

- Check out the [React Native guides](https://www.compdf.com/guides/pdf-sdk/react-native/overview).
- Stay up to date with the [React Native changelog](https://www.compdf.com/pdf-sdk/changelog-react-native).
- Contact [technical support](https://www.compdf.com/support) if you run into issues.
- Contact [sales](https://compdf.com/contact-us) for licensing questions.
