## Newest Release

### 2.2.1 - 21 Jan. 2025
* Added the features support for ComPDFKit PDF SDK for iOS [iOS V2.2.1](https://www.compdf.com/pdf-sdk/changelog-ios#v2-2-1).
* Added the features support for ComPDFKit PDF SDK for Android [Android V2.2.1](https://www.compdf.com/pdf-sdk/changelog-android#v2-2-1).
* Added API for importing fonts.
* Added API for security settings.
* Added view-related APIs, including opening thumbnail lists, preview settings, watermark editing, and security settings.
* Fixed the issue with the `CPDFReaderView` UI component on Android, which caused the Activity theme to be abnormal.
* Fixed an issue where certain documents could crash when importing XFDF annotations.
* Fixed an issue on iOS where the author information for Ink annotations was not displayed.
* Fixed a crash in iOS 18 when editing content in the context menu.
* Fixed a crash on certain Android devices when initializing the SDK.
* Fixed a crash on Android related to screenshot functionality.
* Optimize the screenshot function of the Android platform to improve the quality of image capture
* Fixed an issue on Android with the LaBan Key input method.
* Fixed an issue on Android where the modified date was not updated when saving a modified document.
* Fixed a crash on Android related to the undo operation in content editing.
* Fixed an issue on Android where form background color was transparent when highlighting forms was not enabled.
* Fixed an issue on Android where annotation text would display incorrectly when editing text in highlighted comment areas.
* Fixed an issue on Android where cloud comment borders were displayed incorrectly in graphic annotations.
For detailed information about the new interfaces, please refer to `CPDFReaderView.tsx` and `CPDFDocument.tsx`.

## Previous Release

### 2.2.0 - 13 Dec. 2024
* Added features support for ComPDFKit PDF SDK for [Android V2.2.0](https://www.compdf.com/pdf-sdk/changelog-android#v2-2-0).
* Added features support for ComPDFKit PDF SDK for [iOS V2.2.0](https://www.compdf.com/pdf-sdk/changelog-ios#v2-2-0).
* Added import and export annotation interfaces.
* Added delete all annotations interface.
* Added get page number interface and page number listener callback.
* Added save document callback.
* Optimized document saving logic on iOS platform.

### 2.1.3-2 - 26 Sep 2024

* Added the features support for ComPDFKit PDF SDK for Android V2.1.3.
* Fixed crash issue when opening certain documents.
* Fixed crash issue when adding mark annotations to some documents.
* Fixed potential crash during SDK initialization.
* Fixed incomplete display of underline annotations.
* Fixed abnormal annotation display after rotating the page.
* Fixed crash when releasing watermarks.
* Fixed memory leak in the property window of the ComPDFKit_Tools module.

### 2.1.3-1 - 25 Sep 2024

* Added the features support for ComPDFKit PDF SDK for iOS V2.1.3.
* iOS annotation toolbar image button adaptation for iPad.
* RN iOS sandbox structure modification.

### 2.1.2 - 01 Sep 2024

* Added `CPDFReaderView` UI component.
* Optimize document opening speed.

### 2.1.1 - 12 Aug 2024

* Added the features support for ComPDFKit PDF SDK for iOS V2.1.1.
* Added the features support for ComPDFKit PDF SDK for Android V2.1.1.
* Optimized the logic for selecting text by long press.
* Fixed low text contrast issue in dark mode for some documents.
* Fixed crash issues with some documents.

### 2.1.0 - 29 July 2024

* Added the features support for ComPDFKit PDF SDK for iOS V2.1.0.
* Added the features support for ComPDFKit PDF SDK for Android V2.1.0.
* Added annotation reply functionality.
* Optimized text aggregation logic for content editing.
* Added font subsetting.
* Added screenshot feature.
* Android platform adaptation for **Laban Key Keyboard**.
* Fixed an issue with the Ink annotation color display on Android.


### 2.0.1 - 13 May 2024

* Provide dependency methods from GitHub and npm.
* Added the features support for ComPDFKit PDF SDK for iOS V2.0.1.
* Added the features support for ComPDFKit PDF SDK for Android V2.0.1.
* Fix the issue of continuous memory growth.

### 2.0.1-beta.2 - 13 May 2024

* Adjust some document description errors.

### 2.0.1-beta.1 - 10 May 2024

* Provide dependency methods from GitHub and npm.
* Added the features support for ComPDFKit PDF SDK for iOS V2.0.1.
* Added the features support for ComPDFKit PDF SDK for Android V2.0.1.
* Fix the issue of continuous memory growth.
