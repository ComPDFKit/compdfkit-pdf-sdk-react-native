# ComPDFKit React-Native PDF Library

## Overview

[ComPDFKit PDF SDK](https://www.compdf.com/) is a robust PDF library, which offers comprehensive functions for quickly viewing, annotating, editing, and signing PDFs. It is feature-rich and battle-tested, making PDF files process and manipulation easier and faster.

[ComPDFKit for React Native](https://www.compdf.com/react-native) allows you to quickly add PDF functions to any Flutter application, elevating your Android and iOS apps to ensure seamless and efficient development.   



## Related

- [ComPDFKit PDF Library for iOS](https://github.com/ComPDFKit/PDF-SDK-iOS)
- [ComPDFKit PDF Library for Android](https://github.com/ComPDFKit/PDF-SDK-Android)
- ComPDFKit PDF SDK - [Flutter Library](https://pub.dev/packages/compdfkit_flutter)
- [How to Build a React Native PDF Viewer](https://www.compdf.com/blog/build-a-react-native-pdf-viewer)
- [React Native & ComPDFKit PDF SDK](https://www.compdf.com/blog/react-native-and-compdfkit-pdf-sdk)
- [ComPDFKit API](https://api.compdf.com/api/pricing) allows you to get 1000 files processing monthly now! Just [sign up](https://api.compdf.com/signup) for a free trial and enjoy comprehensive PDF functions.

## Key Features

- [**Viewer**](https://www.compdf.com/pdf-sdk/viewer) component offers Standard page display modes, Navigation, Text search & selection, Zoom in and out & Fit-page, Text reflow, and more.
- [**Annotations**](https://www.compdf.com/pdf-sdk/annotations) component offers Note, Link, Free Text, Line, Square, Circle, Highlight, Underline, Squiggly, Strikeout, Stamp, Ink, Sound, and more.
- [**Forms**](https://www.compdf.com/pdf-sdk/forms) component offers Push Button, Check Box, Radio Button, Text Field, Combo Box, List Box, Signature, and more.
- [**Document Editor**](https://www.compdf.com/pdf-sdk/document-editor) component offers Split, Extract, Merge, Delete, Insert, Crop, Move, Rotate, Replace, and Exchange pages, etc.
- [**Content Editor**](https://www.compdf.com/pdf-sdk/edit-pdf) component offers Copy, Resize, Change Colors, Text Alignment, etc.
- [**Security**](https://www.compdf.com/pdf-sdk/security) component offers Encrypt and Decrypt PDFs, Watermark, etc.

If you want to know all the features that ComPDFKit SDK can offer, please see our [Feature List](https://www.compdf.com/pdf-sdk/features-list).



## Get Started

It's easy to embed ComPDFKit into React Native applications with a few lines of code. The following sections describe the optimal systems and environments to support, as well as quick integration steps. Let's take a few minutes to get started.



### Requirements

**Android**

Please install the following required packages:

* A [development environment](https://reactnative.dev/docs/environment-setup) for running React Native projects using the React Native CLI (not the Expo CLI)

* [The latest stable version of Android Studio](https://developer.android.com/studio)

* The [Android NDK](https://developer.android.com/studio/projects/install-ndk)

* An [Android Virtual Device](https://developer.android.com/studio/run/managing-avds.html) or a hardware device

Operating Environment Requirements:

* Android `minSdkVersion` of `21` or higher.
* ComPDFKit SDK 1.9.0 or higher.

**iOS**

Please install the following required packages:

* A [development environment](https://reactnative.dev/docs/environment-setup) for running React Native projects using the React Native CLI (not the Expo CLI)

* [The latest stable version of Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12)

* [The latest stable version of CocoaPods](https://github.com/CocoaPods/CocoaPods/releases). Follow the [CocoaPods installation guide](https://guides.cocoapods.org/using/getting-started.html#installation) to install it.

Operating Environment Requirements:

* ComPDFKit SDK 1.9.0 or higher.
* React Native dependency to version 3.0.0 or higher.
* iOS 10.0 or higher.



### How to Run a Demo

[ComPDFKit PDF SDK for React-Native](https://www.compdf.com/guides/pdf-sdk/react-native/overview) provides a complete functional demonstration, you can view the sample project in the **Example** folder.

1. Enter the sample project directory in the `terminal` software

```
cd Downloads/compdfkit-sdk-pdf-react-native/example
```

2. Execute the `yarn install` command to obtain the software package

**Android**

Execute the following command to run on the Android device

```
yarn android
```

**iOS**

1. Open your project's Podfile in a text editor:

```bash
open ios/Podfile
```

2. Update the platform to iOS 11 and add the ComPDFKit Podspec:

```diff
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

- platform :ios, '10.0'
+ platform :ios, '11.0'
install! 'cocoapods', :deterministic_uuids => false

target 'PDFView_RN' do
  config = use_native_modules!

  # Flags change depending on the env values.
  flags = get_default_flags()

  use_react_native!(
    :path => config[:reactNativePath],
    # to enable hermes on iOS, change `false` to `true` and then install pods
    :hermes_enabled => flags[:hermes_enabled],
    :fabric_enabled => flags[:fabric_enabled],
    # An absolute path to your application root.
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  target 'PDFView_RNTests' do
    inherit! :complete
    # Pods for testing
  end

+  pod 'ComPDFKit_Tools', podspec:'https://www.compdf.com/download/ios/cocoapods/xcframeworks/compdfkit_tools/1.11.0.podspec'
+  pod 'ComPDFKit', podspec:'https://www.compdf.com/download/ios/cocoapods/xcframeworks/compdfkit/1.11.0.podspec'

  # Enables Flipper.
  #
  # Note that if you have use_frameworks! enabled, Flipper will not work and
  # you should disable the next line.
  use_flipper!()

  post_install do |installer|
    react_native_post_install(installer)
    __apply_Xcode_12_5_M1_post_install_workaround(installer)
  end
end
```

3. Go to the **example/ios** folder and run the `pod install` command:

```bash
pod install
```

4. Go to the **example** folder and the app is now ready to launch! Go back to the terminal.

```bash
//Run on iOS emulator
npx react-native run-ios
```



### Integrate into a new React-Native APP

Let's create a simple app that integrates ComPDFKit for React Native.

1. In the terminal app, change the current working directory to the location you wish to save your project. In this example, we’ll use the `~/Documents/` directory:

   ```bash
   cd ~/Documents
   ```

2. Create the React Native project by running the following command:

   ```bash
   react-native init compdfkit_rn
   ```

3. In the terminal app, change the location of the current working directory inside the newly created project:

   ```bash
   cd compdfkit_rn
   ```

4. Add the ComPDFKit library and import the presented PDF document.

#### Android

1. Open the **android/build.gradle** file located in the project root directory and add the `mavenCentral` repository:

```diff
repositories {
    google()
+   mavenCentral()
}
```

2. Open the app's Gradle build file, `android/app/build.gradle`:

```bash
open android/app/build.gradle
```

3. Modify the minimum SDK version, All this is done inside the `android` section:

```diff
 android {
     defaultConfig {
-        minSdkVersion rootProject.ext.minSdkVersion
+        minSdkVersion 21
         ...
     }
 }
```

4. Add ComPDFKit SDK inside the dependencies section:

```diff
dependencies {
    ...
+    implementation 'com.compdf:compdfkit:1.11.0'
+    implementation 'com.compdf:compdfkit-ui:1.11.0'
+    implementation 'com.compdf:compdfkit-tools:1.11.0'
}
```

5. Add Proguard Rules, In the **proguard-rules.pro** file, please add the obfuscation configuration information for `compdfkit` as follows:

```
-keep class com.compdfkit.ui.** {*;}
-keep class com.compdfkit.core.** {*;}
-keep class com.compdfkit.tools.** {*;}
```

6. open  **android/app/src/main/AndroidManifest.xml** , add `ComPDFKit License` and `Storage Permission`:

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.compdfkit.flutter.example">
    
    <!-- Required to read and write documents from device storage -->
+    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
+    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>

    <application
        ...>
        ...
        <!-- Please replace it with your ComPDFKit license -->
+        <meta-data
+            android:name="compdfkit_key"
+            android:value="{your license key}" />
				...
    </application>
</manifest>
```

7. Enable `viewBinding` in the android node setting of `app/build.gradle`

```groovy
android {
		...
    buildFeatures {
        viewBinding = true
    }
}
```

8. Copy the **pdf** folder and `res/layout` code from the sample project Android project to your project

<img src="./Image/1-5.png" alt="1-5" width="70%" height="70%" />

9. Open the **MainApplication** file and fill in the following code in the `getPackages()` method

```diff
@Override
protected List<ReactPackage> getPackages() {
  @SuppressWarnings("UnnecessaryLocalVariable")
  List<ReactPackage> packages = new PackageList(this).getPackages();
+  packages.add(new PDFReactPackage());
  return packages;
}
```

10. Add `PDFActivity` in `AndroidManifest.xml` file

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="com.projectname">
  <application
    ...>
    ...
+    <activity
+              android:name=".pdf.PDFActivity"
+              android:configChanges="keyboardHidden|orientation|screenSize"
+              android:windowSoftInputMode="adjustPan"
+              android:exported="true"/>

    </activity>
  </application>
</manifest>
```

11. Copy the sample pdf file to the `assets` directory

<img src="./Image/1-6.png" alt="1-6" width="40%" height="40%" />



12. Open your `App.tsx` file:

```bash
open App.tsx
```

13. Replace the entire contents of `App.tsx` with the following code snippet:

```js
/**
 * Sample React Native App
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
     		// open example pdf 
        NativeModules.OpenPDFModule.openPDF(JSON.stringify(configuration))
     		// open local pdf file
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
 
```

14. Go to the **example** folder and the app is now ready to launch! Go back to the terminal.

```bash
//Run on Android devices
npx react-native run-android
```



#### iOS

1. Import the header file ***"ComPDFKit/ComPDFKit.h"*** to `AppDelegate.m`.

2. Follow the code below and call the method `CPDFKit verifyWithKey:@"LICENSE_KEY"` in `- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions`. You need to replace the **LICENSE_KEY** with the license you obtained.

```objc
#import <ComPDFKit/ComPDFKit.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  // Set your license key here. ComPDFKit is commercial software.
  // Each ComPDFKit license is bound to a specific app bundle id.
  // com.compdfkit.pdfviewer
    
    [CPDFKit verifyWithKey:@"YOUR_LICENSE_KEY_GOES_HERE"];
    
    return YES;
}
```

3. Open your project's Podfile in a text editor:

```bash
open ios/Podfile
```

4. Update the platform to iOS 11 and add the ComPDFKit Podspec:

```diff
require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'

- platform :ios, '10.0'
+ platform :ios, '11.0'
install! 'cocoapods', :deterministic_uuids => false

target 'PDFView_RN' do
  config = use_native_modules!

  # Flags change depending on the env values.
  flags = get_default_flags()

  use_react_native!(
    :path => config[:reactNativePath],
    # to enable hermes on iOS, change `false` to `true` and then install pods
    :hermes_enabled => flags[:hermes_enabled],
    :fabric_enabled => flags[:fabric_enabled],
    # An absolute path to your application root.
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  target 'PDFView_RNTests' do
    inherit! :complete
    # Pods for testing
  end

+  pod 'ComPDFKit_Tools', podspec:'https://www.compdf.com/download/ios/cocoapods/xcframeworks/compdfkit_tools/1.11.0.podspec'
+  pod 'ComPDFKit', podspec:'https://www.compdf.com/download/ios/cocoapods/xcframeworks/compdfkit/1.11.0.podspec'

  # Enables Flipper.
  #
  # Note that if you have use_frameworks! enabled, Flipper will not work and
  # you should disable the next line.
  use_flipper!()

  post_install do |installer|
    react_native_post_install(installer)
    __apply_Xcode_12_5_M1_post_install_workaround(installer)
  end
end
```

5. Go to the **compdfkit_rn/ios** folder and run the `pod install` command:

```bash
pod install
```

6. Open your project's Workspace in Xcode:

```bash
open ios/PDFView_RN.xcworkspace	
```

7. Make sure the deployment target is set to 10.0 or higher:

<img src="Image/1-1.png" width="80%" height="80%"/>

8. Import resource file, `CPDFViewController` view controller that contains ready-to-use UI module implementations.

<img src="Image/1-2.png" alt="1-2" width="80%" height="80%"/>

9. Search for **bridging** in the **Build Settings** and locate the **Objective-C Bridging Header** option. Then, enter the file path of the header file ***"ComPDFKit_RN-Bridging-Header.h"***: 

<img src="Image/1-9.png" alt="1-9" width="80%" height="80%"/>

10. Add the PDF document you want to display to your application by dragging it into your project. On the dialog that's displayed, select Finish to accept the default integration options. You can use "developer_guide_ios.pdf" as an example.

<img src="Image/1-7.png" width="80%" height="80%" />

11. To protect user privacy, before accessing the sensitive privacy data, you need to find the ***"Info"*** configuration in your iOS 10.0 or higher iOS project and configure the relevant privacy terms as shown in the following picture.

<img src="Image/1-8.png" width="80%" height="80%" />

```objective-c
<key>NSCameraUsageDescription</key>
<string>Your consent is required before you could access the function.</string>

<key>NSMicrophoneUsageDescription</key>
<string>Your consent is required before you could access the function.</string>

<key>NSPhotoLibraryAddUsageDescription</key>
<string>Your consent is required before you could access the function.</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Your consent is required before you could access the function.</string>
```

12. Open your `App.tsx` file:

```bash
open App.tsx
```

13. Replace the entire contents of `App.tsx` with the following code snippet:

```js
/**
 * Sample React Native App
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
     		// open example pdf 
        NativeModules.OpenPDFModule.openPDF(JSON.stringify(configuration))
     		// open local pdf file
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
 
```

14. Go to the **example** folder and the app is now ready to launch! Go back to the terminal.

```bash
//Run on iOS devices
npx react-native run-ios
```



## Example APP

To see [ComPDFKit for React-Native](https://www.compdf.com/contact-sales) in action, check out our [React-Native example app](./example)

Showing a PDF document inside your React-Native app is as simple as this:

```tsx
// Open the default document directly
NativeModules.OpenPDFModule.openPDF(JSON.stringify(configuration))

// Open the document in the specified path
NativeModules.OpenPDFModule.openPDFByConfiguration(String filePath, String password, String configuration)
```



## Support

[ComPDFKit](https://www.compdf.com/) has a professional R&D team that produces comprehensive technical documentation and guides to help developers. Also, you can get an immediate response when reporting your problems to our support team.

- For detailed information, please visit our [Guides](https://www.compdf.com/guides/pdf-sdk/flutter/overview) page.
- Stay updated with the latest improvements through our [Changelog](https://www.compdf.com/pdf-sdk/changelog-flutter).
- For technical assistance, please reach out to our [Technical Support](https://www.compdf.com/support).
- To get more details and an accurate quote, please contact our [Sales Team](https://compdf.com/contact-us).



## License

ComPDFKit PDF SDK supports flexible licensing options, please contact [our sales team](mailto:support@compdf.com) to know more. Each license is only valid for one application ID in development mode. However, any documents, sample code, or source code distribution from the released package of ComPDFKit PDF SDK to any third party is prohibited.



## Note

We are glad to announce that you can register a ComPDFKit API account for a [free trial](https://api.compdf.com/api/pricing) to process 1000 documents per month for free.

Thanks, 

The ComPDFKit Team