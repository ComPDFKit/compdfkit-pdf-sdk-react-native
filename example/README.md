# 1 Overview

ComPDFKit for React Native is a comprehensive SDK that allows you to quickly add PDF fuctions to any React Native application, such as viewer, annotations, editing PDFs, forms and signatures.  

More information can be found at [https://www.compdf.com/](https://www.compdf.com/)



## 1.1 ComPDFKit for React Native

ComPDFKit for React Native consists of two elements.

The two elements for ComPDFKit for React Native:

- **PDF Core API**

  The Core API can be used independently for document rendering, analysis, text extraction, text search, form filling, password security, annotation creation and manipulation, and much more.

- **PDF View**

  The PDF View is a utility class that provides the functionality for developers to interact with rendering PDF documents per their requirements. The View Control provides fast and high-quality rendering, zooming, scrolling, and page navigation features. The View Control is derived from platform-related viewer classes (e.g. `UIView` on iOS) and allows for extension to accommodate specific user needs.



## 1.2 Key Features

**Viewer** 
component offers:

- Standard page display modes, including Scrolling, Double Page, Crop Mode, and Cover Mode.
- Navigation with thumbnails, outlines, and bookmarks.
- Text search & selection.
- Zoom in and out & Fit-page.
- Switch between different themes, including Dark Mode, Sepia Mode, Reseda Mode, and Custom Color Mode.
- Text reflow.

**Annotations** 
component offers:

- Create, edit, and remove annotations, including Note, Link, Free Text, Line, Square, Circle, Highlight, Underline, Squiggly, Strikeout, Stamp, Ink, and Sound.
- Support for annotation appearances.
- Import and export annotations to/from XFDF.
- Support for annotation flattening.
- Predefine annotations.

**Forms** 
component offers:

- Create, edit and remove form fields, including Push Button, Check Box, Radio Button, Text Field, Combo Box, List Box, and Signature.
- Fill PDF Forms.
- Support for PDF form flattening.

**Document Editor** 
component offers:

- PDF manipulation, including Split pages, Extract pages, and Merge pages.
- Page edit, including Delete pages, Insert pages, Crop pages, Move pages, Rotate pages, Replace pages, and Exchange pages.
- Document information setting.
- Extract images.

**Content Editor** 
component offers:

- Programmatically add and remove text in PDFs and make it possible to edit PDFs like Word. Allow selecting text to copy, resize, change colors, text alignment, and the position of text boxes.
- Undo or redo any change.
- Find and Replace.

**Security** 

component offers:

- Encrypt and decrypt PDFs, including Permission setting and Password protected.

**Watermark** 

component offers:

- Add, remove, edit, update, and get the watermarks.
- Support text and image watermarks.

**Digital Signatures** 

component offers:

- Sign PDF documents with digital signatures.
- Create and verify digital certificates.
- Create and verify digital digital signatures.
- Create self-sign digital ID and edit signature appearance.
- Support PKCS12 certificates.
- Trust certificates.



## 1.3 License

ComPDFKit for React Native is a commercial SDK, which requires a license to grant developer permission to release their apps. Each license is only valid for one `bundle ID` or `applicationId` in development mode. Other flexible licensing options are also supported, please contact [our marketing team](mailto:support@compdf.com) to know more.  However, any documents, sample code, or source code distribution from the released package of ComPDFKit to any third party is prohibited.

To initialize ComPDFKit using a license key, call either of the following before using any other ComPDFKit APIs or features:

To set the license key for Android , use:

```xml
<!-- Add this license in the AndroidManifest.xml of the main module --/>
<meta-data
    android:name="compdfkit_key"
    android:value="{your ComPDFKit key}" />
```

To set the license key for iOS, use:

```objective-c
// Set your license key here. ComPDFKit is commercial software.
  // Each ComPDFKit license is bound to a specific app bundle id.
  // com.compdfkit.pdfviewer
    
 [CPDFKit verifyWithKey:@"YOUR_LICENSE_KEY_GOES_HERE"];
```



# 2 Get Started

It's easy to embed ComPDFKit into React Native applications with a few lines of code. Let's take a few minutes to get started.

The following sections describe the optimal systems and environments to support, as well as quick integration steps.



## 2.1 Requirements

**Android**

Please install the following required packages:

* A [development environment](https://reactnative.dev/docs/environment-setup) for running React Native projects using the React Native CLI (not the Expo CLI)

* The [latest stable version of Android Studio](https://developer.android.com/studio)

* The [Android NDK](https://developer.android.com/studio/projects/install-ndk)

* An [Android Virtual Device](https://developer.android.com/studio/run/managing-avds.html) or a hardware device

Operating Environment Requirements:

* Android `minSdkVersion` of `21` or higher.
* ComPDFKit SDK 1.9.0 or higher.



**iOS**

Please install the following required packages:

* A [development environment](https://reactnative.dev/docs/environment-setup) for running React Native projects using the React Native CLI (not the Expo CLI)

* The [latest stable version of Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12)

* The [latest stable version of CocoaPods](https://github.com/CocoaPods/CocoaPods/releases). Follow the [CocoaPods installation guide](https://guides.cocoapods.org/using/getting-started.html#installation) to install it.

Operating Environment Requirements:

* ComPDFKit SDK 1.9.0 or higher.
* React Native dependency to version 3.0.0 or higher.
* iOS 10.0 or higher.



## 2.2 Creating a New Project

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

### For Android

Open the `android/build.gradle` file located in the project root directory and add the `mavenCentral` repository:

```diff
repositories {
    google()
+   mavenCentral()
}
```

Open the app’s Gradle build file, `android/app/build.gradle`:

```bash
open android/app/build.gradle
```

Modify the minimum SDK version, All this is done inside the `android` section:

```diff
 android {
     defaultConfig {
-        minSdkVersion rootProject.ext.minSdkVersion
+        minSdkVersion 21
         ...
     }
 }
```

Add ComPDFKit SDK inside the dependencies section:

```diff
dependencies {
    ...
+    implementation 'com.compdf:compdfkit:1.12.0'
+    implementation 'com.compdf:compdfkit-ui:1.12.0'
+    implementation 'com.compdf:compdfkit-tools:1.12.0'
}
```

open  `android/app/src/main/AndroidManifest.xml` , add`ComPDFKit License` and `Storage Permission`：

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.compdfkit.flutter.example">
    
    <!-- Required to read and write documents from device storage -->
+    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
+    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
+    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />

    <application
+    android:requestLegacyExternalStorage="true"
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

Copy the `pdf` folder code from the sample project Android project to your project

<img src="./Image/1-5.png" alt="1-5" width="60%" height="60%" />

Open the `MainApplication` file and fill in the following code in the `getPackages()` method

```diff
@Override
protected List<ReactPackage> getPackages() {
  @SuppressWarnings("UnnecessaryLocalVariable")
  List<ReactPackage> packages = new PackageList(this).getPackages();
+  packages.add(new PDFReactPackage());
  return packages;
}
```

Copy the sample pdf file to the `assets` directory

<img src="./Image/1-6.png" alt="1-6" style="zoom:33%;" />



### For iOS

Open your project’s Podfile in a text editor:

```bash
open ios/Podfile
```

Update the platform to iOS 11 and add the ComPDFKit Podspec:

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

+  pod 'ComPDFKit_Tools', podspec:'https://www.compdf.com/download/ios/cocoapods/xcframeworks/compdfkit_tools/1.12.0.podspec'
+  pod 'ComPDFKit', podspec:'https://www.compdf.com/download/ios/cocoapods/xcframeworks/compdfkit/1.12.0.podspec'

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

Go to the `compdfkit_rn/ios` folder and run the `pod install` command:

```bash
pod install
```

Open your project’s Workspace in Xcode:

```bash
open ios/PDFView_RN.xcworkspace	
```

Make sure the deployment target is set to 10.0 or higher:

![](Image/1-1.png)

Import resource file，***"OpenPDFModule.swift"*** is the bridging file for connecting React Native to the iOS native module.

![1-2](Image/1-2.png)

Search for **bridging** in the **Build Settings** and locate the **Objective-C Bridging Header** option. Then, enter the file path of the header file ***"ComPDFKit_RN-Bridging-Header.h"***: 

![1-9](Image/1-9.png)

Add the PDF document you want to display to your application by dragging it into your project. On the dialog that’s displayed, select Finish to accept the default integration options. You can use "developer_guide_ios.pdf" as an example.

<img src="Image/1-7.png" style="zoom:50%;" />

To protect user privacy, before accessing the sensitive privacy data, you need to find the ***"Info"*** configuration in your iOS 10.0 or higher iOS project and configure the relevant privacy terms as shown in the following picture.

<img src="Image/1-8.png" style="zoom:50%;" />

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



## 2.3 Run Project

1. Create an `assets` directory in the project's root directory and copy the **[configuration.json](./assets/configuration.json)** file from the demo to this directory.

<img src="./Image/2-3-1.png" alt="2-3-1" style="zoom:33%;" />

2. Open your `App.tsx` file:

```bash
open App.tsx
```

3. Replace the entire contents of `App.tsx` with the following code snippet:

```js
/**
 * Copyright © 2014-2024 PDF Technologies, Inc. All Rights Reserved.
 *
 * THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
 * AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE ComPDFKit LICENSE AGREEMENT.
 * UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
 * This notice may not be removed from this file.
 */

import React, { Component } from 'react';
import configuration from './assets/configuration.json';
import DocumentPicker from 'react-native-document-picker'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  NativeModules
} from 'react-native';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.tsx
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
        <Button
          title={'Open sample document'}
          onPress={() => {
            this.jumpToNativeView();
          }}
        />
        <View style={{margin:5}}/>
        <Button 
          title={'pick document'}
          onPress={() => {
            try {
              const pickerResult = DocumentPicker.pick({
                type: [DocumentPicker.types.pdf]
              });
              pickerResult.then(res => {
                if (Platform.OS == 'android') {
                  // only android
                  NativeModules.OpenPDFModule.openPDFByUri(res[0].uri, '', JSON.stringify(configuration))
                } else {
                  NativeModules.OpenPDFModule.openPDFByConfiguration(res[0].uri, '', JSON.stringify(configuration))
                }
              })
            } catch (err) {
            }
          }}
        />
      </View>
    );
  }

  jumpToNativeView() {
    NativeModules.OpenPDFModule.openPDF(JSON.stringify(configuration))

    // android: filePath, ios:URL
    // NativeModules.OpenPDFModule.openPDFByConfiguration(filePath, password, JSON.stringify(configuration))

    // only android platform
    // NativeModules.OpenPDFModule.openPDFByUri(uriString, password, JSON.stringify(configuration))
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
  }
});
```

7. We have provided two quick ways to open PDFs:

- Open the default document directly

```tsx
NativeModules.OpenPDFModule.openPDF(JSON.stringify(configuration))
```

- Open the document in the specified path

```tsx
NativeModules.OpenPDFModule.openPDFByConfiguration(String filePath, String password, String configuration)
```

* Opening a document using Uri on the Android platform.

```tsx
NativeModules.OpenPDFModule.openPDFByUri(String uriString, String password, String configuration)
```

The app is now ready to launch! Go back to the terminal.

```bash
//Run on Android devices
npx react-native run-android

//Run on iOS devices
npx react-native run-ios
```



# 3 UI Customization

In version **1.12.0**, we have expanded the options defined in the **[configuration.json](./assets/configuration.json)**. When using the `NativeModules.OpenPDFModule.openPDFByConfiguration` method to open a PDF view, you can define the JSON content to meet your product requirements. We will continue to enrich the configuration options in the future to further enhance the flexibility of the product. Here are some examples of commonly used configuration options:

The following only shows the key parts of the example. Please pass in the complete json content when using it.

1. Set the initial display mode and the list of available modes. The following code shows enabling only the viewer mode and annotations mode:

```json
{
  "modeConfig": {
    "initialViewMode": "viewer",
    "availableViewModes": [
      "viewer",
      "annotations"
    ]
  },
  ... // other options
}
```

2. Set the list of enabled annotation types and default annotation attribute values. For example, enable only highlight annotations and set the color and transparency for highlight annotations:

```json
{
  "annotationsConfig": {
    "availableTypes": [
      "note"
    ],
    "availableTools": [
      "setting",
      "undo",
      "redo"
    ],
    "initAttribute": {
      "note": {
        "color": "#1460F3",
        "alpha": 255
      }
    }
  }
  ... // other options
}
```

3. Set the display mode and page flipping direction:

```json
{
  "readerViewConfig": {
    "displayMode": "doublePage",
    "verticalMode": false
  }
  ... // other options
}
```

The following is the complete [configuration](./assets/configuration.json) content with data description:

  ```json
  {
    "modeConfig": {
      "initialViewMode": "viewer",	// When initializing the display mode, nsure that the selected mode exists in the availableViewModes. Otherwise, it will default to the viewer mode. Refer to the availableViewModes field for valid values.
      "availableViewModes": [				// Only modes listed in the mode list will be displayed.
        "viewer",
        "annotations",
        "contentEditor",
        "forms",
        "signatures"
      ]
    },
    "toolbarConfig": {							// Top Toolbar Configuration
      "androidAvailableActions": [
        "thumbnail",
        "search",
        "bota",
        "menu"
      ],
      "iosLeftBarAvailableActions": [
        "back",
        "thumbnail"
      ],
      "iosRightBarAvailableActions": [
        "search",
        "bota",
        "menu"
      ],
      "availableMenus": [
        "viewSettings",
        "documentEditor",
        "documentInfo",
        "watermark",
        "security",
        "flattened",
        "save",
        "share",
        "openDocument"
      ]
    },
    "annotationsConfig": {			// Annotation Feature Configuration
      "availableTypes": [				// List of enabled annotation types for the bottom annotation functionality
        "note",
        "highlight",
        "underline",
        "squiggly",
        "strikeout",
        "ink",
        "pencil",								// only ios platform
        "circle",
        "square",
        "arrow",
        "line",
        "freetext",
        "signature",
        "stamp",
        "pictures",
        "link",
        "sound"
      ],
      "availableTools": [				// Annotation tools enabled for the bottom annotation functionality
        "setting",
        "undo",
        "redo"
      ],
      "initAttribute": {				// Default properties for annotations upon initialization, influencing attributes such as color, transparency, etc., when adding annotations.
        "note": {
          "color": "#1460F3",
          "alpha": 255					// Color transparency 0~255
        },
        "highlight": {
          "color": "#1460F3",
          "alpha": 77
        },
        "underline": {
          "color": "#1460F3",
          "alpha": 77
        },
        "squiggly": {
          "color": "#1460F3",
          "alpha": 77
        },
        "strikeout": {
          "color": "#1460F3",
          "alpha": 77
        },
        "ink": {
          "color": "#1460F3",
          "alpha": 100,
          "borderWidth": 10
        },
        "square": {
          "fillColor": "#1460F3",
          "borderColor": "#000000",
          "colorAlpha" : 128,
          "borderWidth": 2,
          "borderStyle": {
            "style": "solid",				// Border line styles: solid, dashed
            "dashGap": 0.0					// Dashed line interval length, applicable only when the style is set to 'dashed'.
          }
        },
        "circle": {
          "fillColor": "#1460F3",
          "borderColor": "#000000",
          "colorAlpha" : 128,
          "borderWidth": 2,
          "borderStyle": {
            "style": "solid",
            "dashGap": 0.0
          }
        },
        "line": {
          "borderColor": "#1460F3",
          "borderAlpha": 100,
          "borderWidth": 5,
          "borderStyle": {
            "style": "solid",
            "dashGap": 0.0
          }
        },
        "arrow": {
          "borderColor": "#1460F3",
          "borderAlpha": 100,
          "borderWidth": 5,
          "borderStyle": {
            "style": "solid",
            "dashGap": 0.0
          },
          "startLineType": "none",			// Starting arrow style options: none, openArrow, closedArrow, square, circle, diamond.
          "tailLineType": "openArrow" 	// tail arrow style options
        },
        "freeText": {
          "fontColor": "#000000",
          "fontColorAlpha": 255,
          "fontSize": 30,
          "isBold": false,
          "isItalic": false,
          "alignment": "left",				// left, center, right
          "typeface": "Helvetica"			// Courier, Helvetica, Times-Roman
        }
      }
    },
    "contentEditorConfig": {
      "availableTypes": [
        "editorText",
        "editorImage"
      ],
      "availableTools": [
        "setting",
        "undo",
        "redo"
      ],
      "initAttribute": {							// Default attributes for text type in content editing, influencing text properties when adding text.
        "text": {
          "fontColor": "#000000",
          "fontColorAlpha" : 100,
          "fontSize": 30,
          "isBold": false,
          "isItalic": false,
          "typeface": "Times-Roman",	// Courier, Helvetica, Times-Roman
          "alignment": "left"					// left, center, right
        }
      }
    },
    "formsConfig": {
      "availableTypes": [							// Types of forms displayed in the list of the bottom form toolbar.
        "textField",
        "checkBox",
        "radioButton",
        "listBox",
        "comboBox",
        "signaturesFields",
        "pushButton"
      ],
      "availableTools": [
        "undo",
        "redo"
      ],
      "initAttribute": {
        "textField": {
          "fillColor": "#DDE9FF",
          "borderColor": "#1460F3",
          "borderWidth": 2,
          "fontColor": "#000000",
          "fontSize": 20,
          "isBold": false,
          "isItalic": false,
          "alignment": "left",				// left, center, right
          "multiline": true,
          "typeface": "Helvetica"			// Courier, Helvetica, Times-Roman
        },
        "checkBox": {
          "fillColor": "#DDE9FF",
          "borderColor": "#1460F3",
          "borderWidth": 2,
          "checkedColor": "#43474D",
          "isChecked": false,
          "checkedStyle": "check"			// check, circle, cross, diamond, square, star
        },
        "radioButton": {
          "fillColor": "#DDE9FF",
          "borderColor": "#1460F3",
          "borderWidth": 2,
          "checkedColor": "#43474D",
          "isChecked": false,
          "checkedStyle": "circle"		// check, circle, cross, diamond, square, star
        },
        "listBox": {
          "fillColor": "#DDE9FF",
          "borderColor": "#1460F3",
          "borderWidth": 2,
          "fontColor": "#000000",
          "fontSize": 20,
          "typeface": "Helvetica",		// Courier, Helvetica, Times-Roman
          "isBold": false,
          "isItalic": false
        },
        "comboBox": {
          "fillColor": "#DDE9FF",
          "borderColor": "#1460F3",
          "borderWidth": 2,
          "fontColor": "#000000",
          "fontSize": 20,
          "typeface": "Helvetica",		// Courier, Helvetica, Times-Roman
          "isBold": false,
          "isItalic": false
        },
        "pushButton": {
          "fillColor": "#DDE9FF",
          "borderColor": "#1460F3",
          "borderWidth": 2,
          "fontColor": "#000000",
          "fontSize": 20,
          "title": "Button",
          "typeface": "Helvetica",		// Courier, Helvetica, Times-Roman
          "isBold": false,
          "isItalic": false
        },
        "signaturesFields": {
          "fillColor": "#DDE9FF",
          "borderColor": "#000000",
          "borderWidth": 2
        }
      }
    },
    "readerViewConfig": {
      "linkHighlight": true,
      "formFieldHighlight": true,
      "displayMode": "singlePage",		// singlePage, doublePage, coverPage
      "continueMode": true,
      "verticalMode": true,
      "cropMode": false,
      "themes" : "light",							// light, dark, sepia, reseda
      "enableSliderBar": true,
      "enablePageIndicator": true,
      "pageSpacing": 10,
      "pageScale": 1.0
    }
  }
  ```



# 4 Support



## 4.1 Reporting Problems

Thank you for your interest in ComPDFKit PDF SDK, the only easy-to-use but powerful development solution to integrate high quality PDF rendering capabilities to your applications. If you encounter any technical questions or bug issues when using ComPDFKit PDF SDK for React Native, please submit the problem report to the ComPDFKit team. More information as follows would help us to solve your problem:

- ComPDFKit PDF SDK product and version.
- Your operating system and IDE version.
- Detailed descriptions of the problem.
- Any other related information, such as an error screenshot.



## 4.2 Contact Information

**Home Link:**

[https://www.compdf.com](https://www.compdf.com)

**Support & General Contact:**

Email: support@compdf.com



Thanks,
The ComPDFKit Team
