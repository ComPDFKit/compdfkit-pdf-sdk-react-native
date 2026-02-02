## 2.6.0
* Added the features support for ComPDFKit PDF SDK for iOS V2.6.0.
* Added the features support for ComPDFKit PDF SDK for Android V2.6.0.
* Added a dynamic font loading API.
* Added double-tap zoom support for pages.
* Added APIs for outlines and bookmarks.
* Added APIs for creating annotations and forms.
* Added APIs for creating text and images in content editing mode.
* Added APIs for modifying annotation and form properties.
* Added callback APIs for annotation, form, and content editing interactions.
* Added support for custom top toolbar menus.
* Added support for custom context menus.
* Added support for creating custom content for signature and stamp annotations.
* Added APIs to retrieve document information and permission details.
* Added an API to retrieve available font lists.
* Added APIs to customize selected annotation and form borders and selected text styles.
* Added APIs for inserting, deleting, and moving pages.
* Added an API to specify the initial page when opening a document.
* Fixed an input abnormality issue on Android when using certain input methods in content editing mode.
* Fixed a zoom jitter issue on Android in documents with a large number of pages.


## 2.5.3
* Added the features support for ComPDFKit PDF SDK for iOS V2.5.3.
* Added the features support for ComPDFKit PDF SDK for Android V2.5.3.
* Added support for displaying 3D annotations.
* Fixed a null pointer exception when calling CPDFPage.getEditPage() on Android.
* Fixed inconsistent color retrieval between FreeText annotations and content editing text on Android.
* Fixed a memory leak issue in CPDFPageView on Android.
* Fixed an italic text display issue in content editing mode on Android.
* Fixed an issue where the font size became smaller after changing the text color in content editing mode on Android.
* Fixed an appearance refresh issue when initializing Push Button widgets on iOS.
* Fixed an issue where ink annotations were not saved when exiting directly on iOS.
* Fixed an issue where cross-page search highlights were not displayed on iOS.
* Fixed an issue where setting the mainToolbarVisible property caused the bottom toolbar to be hidden on iOS.

## 2.5.2-1
* Fixed the issue where adding a signature could not be saved.


## 2.5.1
* Added the features support for ComPDFKit PDF SDK for iOS V2.5.1.
* Added the features support for ComPDFKit PDF SDK for Android V2.5.1.
* Adapted to Androidx Material version 1.13.0
* Added API for page rotation
* Android: Fixed crash issue when searching text containing special characters


## 2.5.0
* Added the features support for ComPDFKit PDF SDK for iOS V2.5.0.
* Added the features support for ComPDFKit PDF SDK for Android V2.5.0.
* Added Spanish language support.
* Added API to render PDF pages as images
* Added API for creating forms
* Added watermark configuration options
* Added configurable border color for search results
* Added configurable highlight color for search results
* Added rectangle drawing when jumping to a page
* Added API to set content editing types
* Added configuration for page editing menu options
* Added UI mode configuration
* Added bottom toolbar UI configuration
* Added BOTA interface configuration
* Added control for showing and hiding the search view
* Added API to save ongoing Ink annotations
* Added API to hide the context menu
* Added theme mode configuration on iOS
* Added signature method configuration on iOS
* Added Pencil annotation toolbar configuration on iOS
* Fixed crash on Android caused by empty arrays in shape annotation properties
* Fixed issue where FreeText input was not properly centered on Android
* Fixed inconsistency between FreeText font size and the configured value on Android
* Fixed an issue where some documents crashed when opened on Android.
* Fixed an issue where content edits were not saved correctly on Android.
* Fixed issue where imported FreeText annotations might not display on iOS
* Fixed issue where the watermark toolbar would not appear when the top toolbar was hidden on iOS

## 2.4.7
* Added the features support for ComPDFKit PDF SDK for iOS V2.4.7.
* Added the features support for ComPDFKit PDF SDK for Android V2.4.7.
* Automatically hide the quick scroll bar when the document contains only one page.
* Fixed an OOM crash issue caused by importing fonts on the Android platform.
* Fixed a display issue with circle annotations when opacity was set to 0 on the Android platform.
* Fixed a potential crash when modifying properties of circle and line annotations on the Android platform.
* Fixed an issue where some documents failed to correctly trigger callbacks for the first or last page.

## 2.4.6
* Updated iOS ComPDFKit PDF SDK to version 2.4.6.
* Updated Android ComPDFKit PDF SDK to version 2.4.6.
* Added compatibility for Android 15 and Android 16.
* Optimized page layout and zoom logic for an improved reading experience.
* Added pinch-to-zoom and page dragging while drawing annotations.
* Added support for filling out forms in annotation mode on Android.
* Introduced a new API for text search.
* Optimized the bottom toolbar UI in signature mode on iOS.
* Added JSON configuration to enable/disable error prompts and adjusted the display logic for scan document prompts on iOS.
* Added JSON configuration to enable/disable Ink drawing drag and mode-switch buttons.
* Unified setting of background color of blank area in theme.
* Added API for setting component background color.
* Removed the dependency on the prop-types library.
* Fixed a crash caused by entering Emoji characters on Android.
* Resolved crashes when verifying digital signatures in certain documents on Android.
* Fixed an issue where adding digital signatures failed in some documents on Android.
* Fixed an issue where pages always aligned to the left after setting horizontal margins on Android.
* Fixed page jumping issues in vertical scrolling mode when horizontal margins were set on Android.
* Fixed an issue where FreeText annotations did not fully display after being saved on Android.
* Resolved a crash caused by `InitOutFont` during SDK initialization on Android.
* Fixed an issue where `save()` did not save ongoing Ink and Pencil annotations on iOS.
* Fixed an issue where the top text was not vertically centered on iOS.
* Fixed flickering when opening a document multiple times on iOS.
* Fixed lagging when scrolling in content editing mode on iOS.

## 2.4.4
* Fixed the “Super expression must either be null or a function” error caused by incorrect class inheritance when using the Hermes engine.

## 2.4.3
* Added the features support for ComPDFKit PDF SDK for iOS V2.4.3.
* Added the features support for ComPDFKit PDF SDK for Android V2.4.3.
* Fixed a crash issue when exporting annotation files in certain documents
* Fixed an issue where selecting an annotation would unexpectedly switch the current drawing annotation type
* Fixed an issue where deleted text content in some documents was not saved properly
* Optimized the flickering issue when jumping to a specific page
* Improved the page navigation logic during annotation undo and redo operations

## 2.4.1
* Added the features support for ComPDFKit PDF SDK for iOS V2.4.1.
* Added the features support for ComPDFKit PDF SDK for Android V2.4.1.
* Added API to switch between different annotation types in annotation mode.
* Added Undo and Redo APIs for annotation actions.
* Added configuration option to hide the bottom annotation toolbar in annotation mode.
* Added support for context menu configuration.
* Added callback for tapping on the PDF page area.
* Adapted Android platform to support 16KB page sizes.
* Fixed an issue where some APIs became unresponsive, causing blocking behavior.
* Fixed an issue where the read-only (`readOnly`) setting had no effect on Android.
* Fixed a bug where the `page.removeAnnotation()` API could not delete annotations on Android.
* Fixed an issue where `getReadBackgroundColor()` returned the wrong color on iOS.

## 2.4.1-beta.1
* Fixed a build failure caused by incorrect package name `com.compdfkitpdf` generated during auto-linking.

## 2.4.0
* Added the features support for ComPDFKit PDF SDK for iOS V2.4.0.
* Added the features support for ComPDFKit PDF SDK for Android V2.4.0.
* Added configuration options for signature methods in signature form fields on Android.
* Added a document save reminder when exiting the interface on Android.
* Added functionality to erase existing Ink annotations on Android.
* Added APIs to delete annotations and form fields.
* Added an API to insert blank pages.
* Enhanced annotation property data.
* Enhanced form field property data.
* Fixed OOM crash issues on some devices during SDK initialization.
* Fixed an issue where signature appearance was not correctly displayed after digital signing.
* Fixed an issue where images failed to display after adding a watermark to certain documents.
* Fixed an issue that prevented inserting PNG images when inserting pages.
* Fixed incorrect handling of `ActionType_GoToR` and `ActionType_Launch` in hyperlink annotations.
* Fixed an issue where long input in electronic signatures within `ComPDFKit_Tools` caused incomplete display after saving.
* Fixed blurry display issue after zooming in on text annotations.
* Fixed jump behavior of `CPDFReaderView.setScale() `scaling method.
* Fixed a font inconsistency issue during content editing when adding text to already selected text with an existing device font.

## 2.3.0
* Added the features support for ComPDFKit PDF SDK for iOS iOS V2.3.0.
* Added the features support for ComPDFKit PDF SDK for Android Android V2.3.0.
* Added import/export form data API, supporting XFDF format files.
* Added the ability to create text input fields and insert images by clicking on a page area in content editing mode.
* Added navigation system print API.
* Added import PDF document API.
* Added split PDF document API.
* Added fill form content API.
* Added `saveAs` API.
* Added API to retrieve all annotations and form data on a page.
* Added document flattening API.
* Fixed a crash issue when editing or deleting text in certain documents.
* Fixed the border display issue after completing a free text annotation.
* Fixed an issue where the LaBan Key input method could not delete the last character while editing text.
* Fixed text garbling issues in content editing mode.
* Fixed an issue where form field content was not displayed in some documents.
* Fixed the issue that the zoomed-in page area did not follow the zooming when jumping to draw a rectangular area.
* Fixed the issue of Chinese garbled characters in the form name.
* Fixed the issue where the prompt did not appear for scanned PDF documents on iOS.

## 2.3.0-beta.1
* Added import/export interface for form data in XFDF format files.
* Added the ability to create text input boxes and insert images by clicking on the page area in content editing mode.
* Added a system print API for navigation.
* Fixed issue where editing or deleting text in some documents caused crashes.
* Fixed issue with the border appearing after completing FreeText annotation.
* Fixed issue where the LaBan Key input method deletes the last character when editing text.
* Fixed the issue of text garbling in content editing mode.

## 2.2.2
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

## 2.2.1
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

## 2.2.0

* Added features support for ComPDFKit PDF SDK for [Android V2.2.0](https://www.compdf.com/pdf-sdk/changelog-android#v2-2-0).
* Added features support for ComPDFKit PDF SDK for [iOS V2.2.0](https://www.compdf.com/pdf-sdk/changelog-ios#v2-2-0).
* Added import and export annotation interfaces.
* Added delete all annotations interface.
* Added get page number interface and page number listener callback.
* Added save document callback.
* Optimized document saving logic on iOS platform.

## 2.1.3-2

* Added the features support for ComPDFKit PDF SDK for Android V2.1.3.
* Fixed crash issue when opening certain documents.
* Fixed crash issue when adding mark annotations to some documents.
* Fixed potential crash during SDK initialization.
* Fixed incomplete display of underline annotations.
* Fixed abnormal annotation display after rotating the page.
* Fixed crash when releasing watermarks.
* Fixed memory leak in the property window of the ComPDFKit_Tools module.

## 2.1.3-1

* Added the features support for ComPDFKit PDF SDK for iOS V2.1.3.
* iOS annotation toolbar image button adaptation for iPad.
* RN iOS sandbox structure modification.


## 2.1.2
* Added `CPDFReaderView` UI component.
* Optimize document opening speed.


## 2.1.1
* Added the features support for ComPDFKit PDF SDK for iOS V2.1.1.
* Added the features support for ComPDFKit PDF SDK for Android V2.1.1.
* Optimized the logic for selecting text by long press.
* Fixed low text contrast issue in dark mode for some documents.
* Fixed crash issues with some documents.


## 2.1.0
* Added the features support for ComPDFKit PDF SDK for iOS V2.1.0.
* Added the features support for ComPDFKit PDF SDK for Android V2.1.0.
* Added annotation reply functionality.
* Optimized text aggregation logic for content editing.
* Added font subsetting.
* Added screenshot feature.
* Android platform adaptation for **Laban Key Keyboard**.
* Fixed an issue with the Ink annotation color display on Android.


## 2.0.1 - 13 May 2024
* Provide dependency methods from GitHub and npm.
* Added the features support for ComPDFKit PDF SDK for iOS V2.0.1.
* Added the features support for ComPDFKit PDF SDK for Android V2.0.1.
* Fix the issue of continuous memory growth.

## 2.0.1-beta.2 - 13 May 2024
* Adjust some document description errors.

## 2.0.1-beta.1 - 10 May 2024
* Provide dependency methods from GitHub and npm.
* Added the features support for ComPDFKit PDF SDK for iOS V2.0.1.
* Added the features support for ComPDFKit PDF SDK for Android V2.0.1.
* Fix the issue of continuous memory growth.
