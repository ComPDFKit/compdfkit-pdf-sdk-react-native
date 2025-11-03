## Newest Release

### 2.5.1 - 03 Nov. 2025

New Features

1. Added the features support for ComPDFKit PDF SDK for iOS V2.5.1.
2. Added the features support for ComPDFKit PDF SDK for Android V2.5.1.
3. Adapted to Androidx Material version 1.13.0
4. Added API for page rotation
5. Android: Fixed crash issue when searching text containing special characters

## Previous Release

### 2.5.0 - 23 Oct. 2025

New Features

1. Added the features support for ComPDFKit PDF SDK for iOS V2.5.0.
2. Added the features support for ComPDFKit PDF SDK for Android V2.5.0.
3. Added Spanish language support.
4. Added API to render PDF pages as images
5. Added API for creating forms
6. Added watermark configuration options
7. Added configurable border color for search results
8. Added configurable highlight color for search results
9. Added rectangle drawing when jumping to a page
10. Added API to set content editing types
11. Added configuration for page editing menu options
12. Added UI mode configuration
13. Added bottom toolbar UI configuration
14. Added BOTA interface configuration
15. Added control for showing and hiding the search view
16. Added API to save ongoing Ink annotations
17. Added API to hide the context menu
18. Added theme mode configuration on iOS
19. Added signature method configuration on iOS
20. Added Pencil annotation toolbar configuration on iOS

Issues Addressed

1. Fixed crash on Android caused by empty arrays in shape annotation properties
2. Fixed issue where FreeText input was not properly centered on Android
3. Fixed inconsistency between FreeText font size and the configured value on Android
4. Fixed an issue where some documents crashed when opened on Android.
5. Fixed an issue where content edits were not saved correctly on Android.
6. Fixed issue where imported FreeText annotations might not display on iOS
7. Fixed issue where the watermark toolbar would not appear when the top toolbar was hidden on iOS

### 2.4.7 - 12 Sep. 2025

New Features

1. Added the features support for ComPDFKit PDF SDK for iOS V2.4.7.
2. Added the features support for ComPDFKit PDF SDK for Android V2.4.7.
3. Automatically hide the quick scroll bar when the document contains only one page.
4. Fixed an OOM crash issue caused by importing fonts on the Android platform.
5. Fixed a display issue with circle annotations when opacity was set to 0 on the Android platform.
6. Fixed a potential crash when modifying properties of circle and line annotations on the Android platform.
7. Fixed an issue where some documents failed to correctly trigger callbacks for the first or last page.

### 2.4.6 - 29 Aug. 2025

1. Updated iOS ComPDFKit PDF SDK to version 2.4.6.
2. Updated Android ComPDFKit PDF SDK to version 2.4.6.
3. Added compatibility for Android 15 and Android 16.
4. Optimized page layout and zoom logic for an improved reading experience.
5. Added pinch-to-zoom and page dragging while drawing annotations.
6. Added support for filling out forms in annotation mode on Android.
7. Introduced a new API for text search.
8. Optimized the bottom toolbar UI in signature mode on iOS.
9. Added JSON configuration to enable/disable error prompts and adjusted the display logic for scan document prompts on iOS.
10. Added JSON configuration to enable/disable Ink drawing drag and mode-switch buttons.
11. Unified setting of background color of blank area in theme.
12. Added API for setting component background color.
13. Removed the dependency on the prop-types library.
14. Fixed a crash caused by entering Emoji characters on Android.
15. Resolved crashes when verifying digital signatures in certain documents on Android.
16. Fixed an issue where adding digital signatures failed in some documents on Android.
17. Fixed an issue where pages always aligned to the left after setting horizontal margins on Android.
18. Fixed page jumping issues in vertical scrolling mode when horizontal margins were set on Android.
19. Fixed an issue where FreeText annotations did not fully display after being saved on Android.
20. Resolved a crash caused by `InitOutFont` during SDK initialization on Android.
21. Fixed an issue where `save()` did not save ongoing Ink and Pencil annotations on iOS.
22. Fixed an issue where the top text was not vertically centered on iOS.
23. Fixed flickering when opening a document multiple times on iOS.
24. Fixed lagging when scrolling in content editing mode on iOS.

### 2.4.4 - 27 Jun. 2025

1. Fixed the “Super expression must either be null or a function” error caused by incorrect class inheritance when using the Hermes engine.

### 2.4.3 - 26 Jun. 2025

1. Added the features support for ComPDFKit PDF SDK for iOS V2.4.3.
2. Added the features support for ComPDFKit PDF SDK for Android V2.4.3.
3. Fixed a crash issue when exporting annotation files in certain documents
4. Fixed an issue where selecting an annotation would unexpectedly switch the current drawing annotation type
5. Fixed an issue where deleted text content in some documents was not saved properly
6. Optimized the flickering issue when jumping to a specific page
7. Improved the page navigation logic during annotation undo and redo operations

### 2.4.1 - 19 Jun. 2025

1. Added the features support for ComPDFKit PDF SDK for iOS V2.4.1.
2. Added the features support for ComPDFKit PDF SDK for Android V2.4.1.
3. Added API to switch between different annotation types in annotation mode.
4. Added Undo and Redo APIs for annotation actions.
5. Added configuration option to hide the bottom annotation toolbar in annotation mode.
6. Added support for context menu configuration.
7. Added callback for tapping on the PDF page area.
8. Adapted Android platform to support 16KB page sizes.
9. Fixed an issue where some APIs became unresponsive, causing blocking behavior.
10. Fixed an issue where the read-only (`readOnly`) setting had no effect on Android.
11. Fixed a bug where the `page.removeAnnotation()` API could not delete annotations on Android.
12. Fixed an issue where `getReadBackgroundColor()` returned the wrong color on iOS.

### 2.4.1-beta.1 - 03 Jun. 2025

1. Fixed a build failure caused by incorrect package name `com.compdfkitpdf` generated during auto-linking.

### 2.4.0 - 15 May. 2025

1. Added the features support for ComPDFKit PDF SDK for iOS V2.4.0.
2. Added the features support for ComPDFKit PDF SDK for Android V2.4.0.
3. Added configuration options for signature methods in signature form fields on Android.
4. Added a document save reminder when exiting the interface on Android.
5. Added functionality to erase existing Ink annotations on Android.
6. Added APIs to delete annotations and form fields.
7. Added an API to insert blank pages.
8. Enhanced annotation property data.
9. Enhanced form field property data.
10. Fixed OOM crash issues on some devices during SDK initialization.
11. Fixed an issue where signature appearance was not correctly displayed after digital signing.
12. Fixed an issue where images failed to display after adding a watermark to certain documents.
13. Fixed an issue that prevented inserting PNG images when inserting pages.
14. Fixed incorrect handling of `ActionType_GoToR` and `ActionType_Launch` in hyperlink annotations.
15. Fixed an issue where long input in electronic signatures within `ComPDFKit_Tools` caused incomplete display after saving.
16. Fixed blurry display issue after zooming in on text annotations.
17. Fixed jump behavior of `CPDFReaderView.setScale() `scaling method.
18. Fixed a font inconsistency issue during content editing when adding text to already selected text with an existing device font.

### 2.3.0 - 21 Mar. 2025

1. Added the features support for ComPDFKit PDF SDK for iOS iOS V2.3.0.
2. Added the features support for ComPDFKit PDF SDK for Android Android V2.3.0.
3. Added import/export form data API, supporting XFDF format files.
4. Added the ability to create text input fields and insert images by clicking on a page area in content editing mode.
5. Added navigation system print API.
6. Added import PDF document API.
7. Added split PDF document API.
8. Added fill form content API.
9. Added `saveAs` API.
10. Added API to retrieve all annotations and form data on a page.
11. Added document flattening API.
12. Fixed a crash issue when editing or deleting text in certain documents.
13. Fixed the border display issue after completing a free text annotation.
14. Fixed an issue where the LaBan Key input method could not delete the last character while editing text.
15. Fixed text garbling issues in content editing mode.
16. Fixed an issue where form field content was not displayed in some documents.
17. Fixed the issue that the zoomed-in page area did not follow the zooming when jumping to draw a rectangular area.
18. Fixed the issue of Chinese garbled characters in the form name.
19. Fixed the issue where the prompt did not appear for scanned PDF documents on iOS.

### 2.3.0-beta.1 - 28 Feb. 2025

* Added import/export interface for form data in XFDF format files.
* Added the ability to create text input boxes and insert images by clicking on the page area in content editing mode.
* Added a system print API for navigation.
* Fixed issue where editing or deleting text in some documents caused crashes.
* Fixed issue with the border appearing after completing FreeText annotation.
* Fixed issue where the LaBan Key input method deletes the last character when editing text.
* Fixed the issue of text garbling in content editing mode.

### 2.2.2 - 19 Feb. 2025

* Added the features support for ComPDFKit PDF SDK for iOS iOS V2.2.2.
* Added the features support for ComPDFKit PDF SDK for Android Android V2.2.2.
* Added the ability to save a watermark to the current PDF when adding it.
* Fixed the inaccurate judgment issue in the `hasChange()` method.
* Fixed an issue where some document text fields in forms were not displaying content.
* Fixed an issue on the Android platform where Ink annotations became smaller after drawing.
* Fixed an issue on the Android platform where the pen size shrank when drawing Ink annotations after zooming in on a page.
* Fixed an input issue with the LaBan Key input method on the Android platform.
* Fixed a potential crash issue on the Android platform when enabling the rotate function.
* Fixed a crash issue on the Android platform when importing XFDF annotations.

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
