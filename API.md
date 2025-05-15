# ComPDFKit React Native API

## TypeScript

ComPDFKit React Native supports TypeScript. Types used in this document will be described using TypeScript types. Type information is automatically provided when encoding, and the exact type aliases and constants used in our custom types can be found in the [CPDFConfiguration](./src/configuration/CPDFConfiguration.ts) and [CPDFOptions](./src/configuration/CPDFOptions.ts) source folders.

## ComPDFKit

ComPDFKit contains static methods for global library initialization, configuration, and utility methods.

### init_

Initialize the ComPDFKit SDK offline using your ComPDFKit commercial license key. Please contact our sales to obtain a trial license.

Parameters:

| Name    | Type   | Description                |
| ------- | ------ | -------------------------- |
| license | String | Your ComPDFKit license key |

Returns a Promise.

| Name   | Type    | Description                                                                    |
| ------ | ------- | ------------------------------------------------------------------------------ |
| result | boolean | Returns ``true`` if initialization is successful, otherwise returns ``false``. |

```tsx
ComPDFKit.init_('your compdfkit license')
```

### initialize

Use your ComPDFKit commercial license key to initialize the ComPDFKit SDK using online authentication. Please contact our sales to obtain a trial license.

Parameters:

| Name                 | Type   | Description                                                 |
| -------------------- | ------ | ----------------------------------------------------------- |
| androidOnlineLicense | string | Your ComPDFKit for React Native Android online license key. |
| iosOnlineLicense     | string | Your ComPDFKit for React Native iOS online license key.     |

Returns a Promise.

| Name   | Type    | Description                                                                    |
| ------ | ------- | ------------------------------------------------------------------------------ |
| result | boolean | Returns ``true`` if initialization is successful, otherwise returns ``false``. |

```tsx
ComPDFKit.initialize('android online license', 'ios online license')
```

### getVersionCode

Get the version number of the ComPDFKit SDK.

For example: '2.0.1'

Returns a Promise.

| Name        | Type   | Description                              |
| ----------- | ------ | ---------------------------------------- |
| versionCode | String | the version number of the ComPDFKit SDK. |

```tsx
ComPDFKit.getVersionCode().then((versionCode : string) => {
  console.log('ComPDFKit SDK Version:', versionCode)
})
```

### getSDKBuildTag

Get the build tag of the ComPDFKit PDF SDK.

For example: "build_beta_2.0.0_42db96987_202404081007"

Returns a Promise.

| Name     | Type   | Description                             |
| -------- | ------ | --------------------------------------- |
| buildTag | String | the build tag of the ComPDFKit PDF SDK. |

```tsx
ComPDFKit.getSDKBuildTag().then((buildTag : string) => {
  console.log('ComPDFKit Build Tag:', buildTag)
})
```

### openDocument

Used to present a PDF document.

Parameters:

| Name          | Type   | Description                                                                  |
| ------------- | ------ | ---------------------------------------------------------------------------- |
| document      | string | The path to the PDF document to be presented.                                |
| password      | string | PDF document password.                                                       |
| configuration | string | Configuration objects to customize the appearance and behavior of ComPDFKit. |

* (Android) For local storage file path:

```tsx
document = '/storage/emulated/0/Download/PDF_document.pdf'
ComPDFKit.openDocument(document, '', ComPDFKit.getDefaultConfig({}))
```

* (Android) For content Uri:

```tsx
document = 'content://...'
ComPDFKit.openDocument(document, '', ComPDFKit.getDefaultConfig({}))
```

* (Android) For assets path:

```tsx
document = "file:///android_asset/..."
ComPDFKit.openDocument(document, '', ComPDFKit.getDefaultConfig({}))
```

* (iOS) For app bundle file path:

```tsx
document = 'pdf_document.pdf'
ComPDFKit.openDocument(document, '', ComPDFKit.getDefaultConfig({}))
```

### getDefaultConfig

When using the `ComPDFKit.openDocument` method or the `CPDFReaderView` UI component to display a PDF file, you need to pass configuration parameters to customize the UI features and PDF view properties. `ComPDFKit` provides default configuration parameters through `ComPDFKit.getDefaultConfig`. You can retrieve them using the following example:

```tsx
ComPDFKit.getDefaultConfig({})
```

You can modify certain parameters to meet your requirements. Here are some usage examples:

1. Setting the initial display mode and available mode list. The following code is an example that enables only the viewer mode and annotation mode:

```tsx
ComPDFKit.getDefaultConfig({
  modeConfig: {
    initialViewMode: CPDFViewMode.VIEWER,
    availableViewModes: [
      CPDFViewMode.VIEWER,
      CPDFViewMode.ANNOTATIONS
    ]
  }
})
```

2. Setting the enabled annotation types and the default annotation attribute values list. For example, enabling only note annotations and setting the color and transparency of note annotations:

```tsx
ComPDFKit.getDefaultConfig({
  annotationsConfig:{
    availableType:[
      CPDFAnnotationType.NOTE
    ],
    availableTools:[
      CPDFConfigTool.SETTING,
      CPDFConfigTool.UNDO,
      CPDFConfigTool.REDO
    ],
    initAttribute:{
      note:{
        color: '#1460F3',
        alpha: 255
      }
    }
  }
})
```

3.Setting the display mode and page turning direction:

```tsx
ComPDFKit.getDefaultConfig({
  readerViewConfig:{
    displayMode: CPDFDisplayMode.DOUBLE_PAGE,
    verticalMode: false
  }
})
```

For more configuration parameter descriptions, please see [CPDFCONFIGURATION.md](./CONFIGURATION.md).

### removeSignFileList

Delete the signature saved in the electronic signature annotation list.

Returns a Promise.

| Name   | Type    | Description                                                                   |
| ------ | ------- | ----------------------------------------------------------------------------- |
| result | boolean | Returns `true` if the deletion was successful, otherwise returns `false`. |

```tsx
ComPDFKit.removeSignFileList();
```

### pickFile

Opens the system file picker to select a PDF document.

Returns a Promise.

| Name   | Type   | Description                        |
| ------ | ------ | ---------------------------------- |
| result | string | Returns the selected PDF file path |

```tsx
String? path = ComPDFKit.pickFile();
```

### setImportFontDir

Imports font files to support displaying additional languages.
mported fonts will appear in the font list for FreeText annotations and text editing.

**Note:** Fonts must be imported before initializing the SDK.

steps to import fonts:

1. Copy the fonts you want to import into a custom folder.
2. Call `setImportFontDir` with the folder path as a parameter.
3. Initialize the SDK using `ComPDFKit.init_`.

Parameters:

| Name       | Type   | Description                                             |
| ---------- | ------ | ------------------------------------------------------- |
| fontDir    | string | The path to the folder containing font files to import. |
| addSysFont | string | Whether to include system fonts in the font list.       |

Returns a Promise.

| Name   | Type | Description                                                |
| ------ | ---- | ---------------------------------------------------------- |
| result | bool | Returns true if the setting is successful, otherwise false |

```tsx
// Set the font directory
ComPDFKit.setImportFontDir('fontdir', true);
// Initialize the ComPDFKit SDK
ComPDFKit.init_('your license key');
```

### createUri

This method is supported only on the Android platform. It is used to create a URI for saving a file on the Android device.
The file is saved in the `Downloads` directory by default, but you can specify a subdirectory within `Downloads` using the [childDirectoryName] parameter. If the [childDirectoryName] is not provided, the file will be saved directly in the `Downloads` directory.
The [fileName] parameter is required to specify the name of the file (e.g., `test.pdf`).

Parameters:

| Name               | Type   | Description                                                 |
| ------------------ | ------ | ----------------------------------------------------------- |
| fileName           | string | specifies the name of the file, for example `test.pdf`.     |
| childDirectoryName | string | specifies a subdirectory within the `Downloads` folder.     |
| mimeType           | string | the MIME type of the file, defaulting to `application/pdf`. |

Returns a Promise.

| Name | Type   | Description                           |
| ---- | ------ | ------------------------------------- |
| uri  | string | Returns the uri used to save the file |

```tsx
const uri: string = await ComPDFKit.createUri('test.pdf', '', 'application/pdf');
```

## CPDFReaderView - Props

### Open Document

`CPDFReaderView` is a React component designed to display PDF documents. Below are details about the required `document` prop.

#### document

Specifies the path or URI of the PDF document to be displayed.

* **Type:** `string`
* **Required:** Yes

**Usage Examples:

* (Android) For local storage file path:

```tsx
<CPDFReaderView
	document={'/storage/emulated/0/Download/PDF_document.pdf'}/>
```

* (Android) For content Uri:

```tsx
<CPDFReaderView
	document={'content://...'}/>
```

* (Android) For assets path:

```tsx
<CPDFReaderView
	document={'file:///android_asset/...'}/>
```

* (iOS) For app bundle file path:

```tsx
<CPDFReaderView
	document={'pdf_document.pdf'}/>
```

#### password

The password to open the document is an optional parameter.

* **Type:** `string`

**Usage Examples:**

```tsx
<CPDFReaderView
	document={'pdf_document.pdf'}
  password={'password'}/>
```

#### configuration

Used to pass configuration parameters when rendering a PDF file to customize UI features and PDF view properties. `ComPDFKit` provides default configuration parameters through `ComPDFKit.getDefaultConfig`.

* **Type:**`string`
* **Required:** Yes

**Usage Examples:**

```tsx
<CPDFReaderView
  document={samplePDF}
  configuration={ComPDFKit.getDefaultConfig({

  })}
  style={{flex:1}}
  />
```

### Document

#### open

Reopens a specified document in the current `CPDFReaderView` component.

Parameters:

| Name     | Type   | Description                                                |
| -------- | ------ | ---------------------------------------------------------- |
| document | string | The file path of the PDF document.                         |
| password | string | The password for the document, which can be null or empty. |

Returns a Promise.

| Name   | Type | Description                                                                                      |
| ------ | ---- | ------------------------------------------------------------------------------------------------ |
| result | bool | A promise that resolves to `true` if the document is successfully opened, otherwise `false`. |

```tsx
await pdfReaderRef.current?._pdfDocument.open(document, 'password');
```

#### hasChange

Checks whether the document has been modified.

Returns a Promise.

Promise Parameters:

| Name      | Type    | Description                                                                                     |
| --------- | ------- | ----------------------------------------------------------------------------------------------- |
| hasChange | boolean | `true`: The document has been modified,   `false`: The document has not been modified. |

```tsx
const hasChange = await pdfReaderRef.current?.hasChange();
```

#### save

Save the current document changes.

Returns a Promise.

Promise Parameters:

| Name   | Type    | Description                                                            |
| ------ | ------- | ---------------------------------------------------------------------- |
| result | boolean | **true**: Save successful,``**false**: Save failed. |

```js
const saveResult = await pdfReaderRef.current.save();
```

#### saveAs

Saves the document to the specified directory.

Parameters:

| Name           | Type    | Description                                                  |
| -------------- | ------- | ------------------------------------------------------------ |
| savePath       | string  | Specifies the path where the document should be saved.       |
| removeSecurity | boolean | Whether to remove the document's password.                   |
| fontSubset     | boolean | Whether to embed font subsets into PDF. Defaults to **true**. |

Returns a Promise.

| Name   | Type | Description                                                  |
| ------ | ---- | ------------------------------------------------------------ |
| result | bool | Returns `true` if the document is saved successfully, otherwise `false`. |

```tsx
const savePath = '/data/user/0/com.compdfkit.flutter.example/cache/temp/PDF_Document.pdf';
// android platfrom support uri, for example:
const savePath = 'content://media/external/file/1000045118';
const removeSecurity = false;
const fontSubset = true;
const result = await pdfReaderRef.current?._pdfDocument.saveAs(savePath, removeSecurity, fontSubset);
```

#### onSaveDocument

function, optional

This function will be called when the document is saved.

Parameters:

| Name       | Type | Description             |
| ---------- | ---- | ----------------------- |
| pageNumber | int  | the current page number |

```tsx
<CPDFReaderView
	onSaveDocument={()=>{}}
	/>
```

#### getFileName

Gets the file name of the PDF document.

Returns a Promise.

| Name   | Type   | Description                             |
| ------ | ------ | --------------------------------------- |
| result | string | Gets the file name of the PDF document. |

```tsx
const fileName = await pdfReaderRef.current?._pdfDocument.getFileName();
```

#### isImageDoc

Checks if the PDF document is an image document. This is a time-consuming operation that depends on the document size.

Returns a Promise.

| Name   | Type    | Description                                                                              |
| ------ | ------- | ---------------------------------------------------------------------------------------- |
| result | boolean | Return `true` if the document is a scanned image document, otherwise return `false`. |

```tsx
const isImageDoc = await pdfReaderRef.current?._pdfDocument.isImageDoc();
```

#### getDocumentPath

Retrieves the path of the current document.

Returns a Promise.

| Name | Type   | Description                                 |
| ---- | ------ | ------------------------------------------- |
| path | string | Retrieves the path of the current document. |

```tsx
const documentPath = await pdfReaderRef.current?._pdfDocument.getDocumentPath();
```

### Viewer

#### setMargins

Set the current PDF view margin.

Parameters:

| Name   | Type | Description   |
| ------ | ---- | ------------- |
| left   | int  | margin left   |
| top    | int  | margin top    |
| right  | int  | margin right  |
| bottom | int  | margin bottom |

```tsx
await pdfReaderRef.current?.setMargins(10,10,10,10);
```

#### setPageSpacing

Sets the spacing between pages. This method is supported only on the `Android` platform.

- For the `iOS` platform, use the `setMargins`method instead.The spacing between pages is equal to the value of `CPDFEdgeInsets.top`.

Parameters:

| Name        | Type | Description                         |
| ----------- | ---- | ----------------------------------- |
| pageSpacing | int  | The space between pages, in pixels. |

```tsx
await pdfReaderRef.current?.setPageSpacing(10);
```

> Note: This method only supports the Android platform.

#### setScale

Set the page scale, Value Range: **1.0~5.0**

Parameters:

| Name  | Type   | Description |
| ----- | ------ | ----------- |
| scale | number | scale value |

```tsx
await pdfReaderRef.current?.setScale(2.0);
```

#### getScale

Get the current page scale

Returns a Promise.

| Name   | Type   | Description                                 |
| ------ | ------ | ------------------------------------------- |
| result | number | Returns the zoom ratio of the current page. |

```tsx
const scale = await pdfReaderRef.current?.getScale();
```

#### setCanScale

Whether allow to scale.

Parameters:

| Name     | Type    | Description |
| -------- | ------- | ----------- |
| canScale | boolean | scale value |

```tsx
await pdfReaderRef.current?.setCanScale(false);
```

> Note: This method only supports the Android platform.

#### setReadBackgroundColor

Sets background color of reader.

Parameters:

| Name  | Type       | Description |
| ----- | ---------- | ----------- |
| theme | CPDFThemes |             |

```tsx
await pdfReaderRef.current?.setReadBackgroundColor(CPDFThemes.LIGHT);
```

**Explanation of Themes**

| Mode   | Description                                                                                                                                 | Option Values     |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| LIGHT  | Uses a white background and black text, suitable for reading in well-lit environments.                                                      | CPDFThemes.LIGHT  |
| DARK   | Uses a dark background and light text, suitable for reading in low-light environments.                                                      | CPDFThemes.DARK   |
| SEPIA  | Use a beige background for users who are used to reading on paper.                                                                          | CPDFThemes.SEPIA  |
| RESEDA | Soft light green background reduces discomfort from high brightness and strong contrast when reading, effectively relieving visual fatigue. | CPDFThemes.RESEDA |

#### getReadBackgroundColor

Get background color of reader.

Returns a Promise.

| Name   | Type       | Description |
| ------ | ---------- | ----------- |
| result | CPDFThemes |             |

```tsx
CPDFThemes theme = await pdfReaderRef.current?.getReadBackgroundColor();
```

#### setFormFieldHighlight

Sets whether to display highlight Form Field.

Parameters:

| Name                 | Type    | Description                           |
| -------------------- | ------- | ------------------------------------- |
| isFormFieldHighlight | boolean | true to display highlight Form Field. |

```tsx
await pdfReaderRef.current?.setFormFieldHighlight(true);
```

#### isFormFieldHighlight

Whether to display highlight Form Field.

Returns a Promise.

| Name   | Type    | Description        |
| ------ | ------- | ------------------ |
| result | boolean | 当前是否高亮表单域 |

```tsx
const isFormFieldHighlight = await pdfReaderRef.current?.isFormFieldHighlight();
```

#### setLinkHighlight

Sets whether to display highlight Link.

Parameters:

| Name            | Type    | Description                |
| --------------- | ------- | -------------------------- |
| isLinkHighlight | boolean | Whether to highlight Link. |

```tsx
await pdfReaderRef.current?.setLinkHighlight(true);
```

#### isLinkHighlight

Whether to display highlight Link.

Returns a Promise.

| Name   | Type    | Description |
| ------ | ------- | ----------- |
| result | boolean |             |

```tsx
const isLinkHighlight = await pdfReaderRef.current?.isLinkHighlight();
```

#### setVerticalMode

Sets whether it is vertical scroll mode.

Parameters:

| Name           | Type    | Description                         |
| -------------- | ------- | ----------------------------------- |
| isVerticalMode | boolean | Whether it is vertical scroll mode. |

```tsx
await pdfReaderRef.current?.setVerticalMode(true);
```

#### isVerticalMode

Whether it is vertical scroll mode.

Returns a Promise.

| Name   | Type    | Description                                                                    |
| ------ | ------- | ------------------------------------------------------------------------------ |
| result | boolean | Returns `true` for vertical scrolling and `false` for horizontal scrolling |

```tsx
await pdfReaderRef.current?.isVerticalMode();
```

#### setContinueMode

Sets whether it is continuous scroll mode.

Parameters:

| Name           | Type    | Description                           |
| -------------- | ------- | ------------------------------------- |
| isContinueMode | boolean | Whether it is continuous scroll mode. |

```tsx
await pdfReaderRef.current?.setContinueMode(true);
```

#### isContinueMode

Whether it is continuous scroll mode.

Returns a Promise.

| Name   | Type    | Description                                                                        |
| ------ | ------- | ---------------------------------------------------------------------------------- |
| result | boolean | Returns `true` if the page is scrolled continuously, otherwise returns `false` |

```tsx
await pdfReaderRef.current?.isContinueMode();
```

#### setDoublePageMode

Sets whether it is double page mode.

Parameters:

| Name             | Type    | Description                     |
| ---------------- | ------- | ------------------------------- |
| isDoublePageMode | boolean | Whether it is double page mode. |

```tsx
await pdfReaderRef.current?.setDoublePageMode(true);
```

#### isDoublePageMode

Whether it is double page mode.

Returns a Promise.

| Name   | Type    | Description                                                                     |
| ------ | ------- | ------------------------------------------------------------------------------- |
| result | boolean | Returns `true` if double page display is enabled, otherwise returns `false` |

```tsx
await pdfReaderRef.current?.isDoublePageMode();
```

```tsx
await pdfReaderRef.current?.isContinueMode();
```

#### setCoverPageMode

Sets whether it is cover page mode.

Parameters:

| Name            | Type    | Description                                   |
| --------------- | ------- | --------------------------------------------- |
| isCoverPageMode | boolean | Whether to display the document in cover form |

```tsx
await pdfReaderRef.current?.setCoverPageMode(true);
```

#### isCoverPageMode

Whether it is cover page mode.

Returns a Promise.

| Name   | Type    | Description                                                                      |
| ------ | ------- | -------------------------------------------------------------------------------- |
| result | boolean | Returns `true` if the document cover is displayed, otherwise returns `false` |

```tsx
await pdfReaderRef.current?.isCoverPageMode();
```

#### setCropMode

Sets whether it is crop mode.

Parameters:

| Name       | Type    | Description              |
| ---------- | ------- | ------------------------ |
| isCropMode | boolean | Whether it is crop mode. |

```tsx
await pdfReaderRef.current?.setCropMode(true);
```

#### isCropMode

Whether it is cover page mode.

Returns a Promise.

| Name   | Type    | Description                                                                        |
| ------ | ------- | ---------------------------------------------------------------------------------- |
| result | boolean | Returns `true` if the current mode is clipping mode, otherwise returns `false` |

```tsx
await pdfReaderRef.current?.isCropMode();
```

#### setPageSameWidth

In the single page mode, set whether all pages keep the same width and the original page keeps the same width as readerView.

Parameters:

| Name            | Type    | Description                                                                                                                         |
| --------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| isPageSameWidth | boolean | true: All pages keep the same width, the original state keeps the same width as readerView; false: Show in the actual width of page |

```tsx
await pdfReaderRef.current?.setPageSameWidth(true);
```

> Note: This method only supports the Android platform.

#### isPageInScreen

Gets whether the specified `pageIndex` is displayed on the screen

Parameters:

| Name      | Type | Description |
| --------- | ---- | ----------- |
| pageIndex | int  | page index  |

```tsx
const isPageInScreen = await pdfReaderRef.current?.isPageInScreen(1);
```

> Note: This method only supports the Android platform.

#### setFixedScroll

Sets whether to fix the position of the non-swipe direction when zooming in for reading.

Parameters:

| Name          | Type    | Description              |
| ------------- | ------- | ------------------------ |
| isFixedScroll | boolean | Whether to fix scrolling |

```tsx
await pdfReaderRef.current?.setFixedScroll(true);
```

> Note: This method only supports the Android platform.

#### setPreviewMode

Switch the mode displayed by the current CPDFReaderWidget.

Parameters:

| Name     | Type         | Description              |
| -------- | ------------ | ------------------------ |
| viewMode | CPDFViewMode | The view mode to display |

```tsx
await pdfReaderRef.current?.setPreviewMode(CPDFViewMode.VIEWER);
```

#### getPreviewMode

Get the currently displayed mode.

Returns a Promise.

| Name     | Type         | Description                               |
| -------- | ------------ | ----------------------------------------- |
| viewMode | CPDFViewMode | Returns the currently displayed view mode |

```tsx
const mode = await pdfReaderRef.current?.getPreviewMode();
```

#### showThumbnailView

Displays the thumbnail view. When [editMode] is `true`,  the page enters edit mode, allowing operations such as insert, delete, extract, etc.

Returns a Promise.

| Name     | Type    | Description                 |
| -------- | ------- | --------------------------- |
| editMode | boolean | Whether to enable edit mode |

```tsx
await pdfReaderRef.current?.showThumbnailView(true);
```

#### showBotaView

Displays the BOTA view, which includes the document outline, bookmarks, and annotation list.

```tsx
await pdfReaderRef.current?.showBotaView();
```

#### showAddWatermarkView

Displays the BOTA view, which includes the document outline, bookmarks, and annotation list.

```tsx
await pdfReaderRef.current?.showAddWatermarkView();
```

#### showSecurityView

Displays the document security settings view, allowing users to configure document security options.

```tsx
await pdfReaderRef.current?.showSecurityView();
```

#### showDisplaySettingView

Displays the display settings view, where users can configure options such as scroll direction, scroll mode, and themes.

```tsx
await pdfReaderRef.current?.showDisplaySettingView();
```

#### enterSnipMode

Enters snip mode, allowing users to capture screenshots.

```tsx
await pdfReaderRef.current?.enterSnipMode();
```

#### exitSnipMode

Enters snip mode, allowing users to capture screenshots.

```tsx
await pdfReaderRef.current?.exitSnipMode();
```

#### printDocument

Invokes the system's print service to print the current document.

```tsx
await pdfReaderRef.current?._pdfDocument.printDocument();
```

### Page

#### setDisplayPageIndex

Jump to the index page.

Parameters:

| Name      | Type | Description         |
| --------- | ---- | ------------------- |
| pageIndex | int  | Jump to page number |

```tsx
await pdfReaderRef.current?.setDisplayPageIndex(1);
```

#### getCurrentPageIndex

get current page index.

Returns a Promise.

Promise Parameters:

| Name      | Type | Description                                            |
| --------- | ---- | ------------------------------------------------------ |
| pageIndex | int  | Returns the page index of the current document display |

```tsx
const pageIndex = await pdfReaderRef.current?.getCurrentPageIndex();
```

#### onPageChanged

function, optional

This function is called when the page number has been changed.

Parameters:

| Name       | Type | Description             |
| ---------- | ---- | ----------------------- |
| pageNumber | int  | the current page number |

```tsx
<CPDFReaderView
	onPageChanged={(pageIndex:number)=>{
	}}
  />
```

#### getPageCount

Get the total number of pages in the current document

Returns a Promise.

Promise Parameters:

| Name  | Type | Description                                           |
| ----- | ---- | ----------------------------------------------------- |
| count | int  | Get the total number of pages in the current document |

```tsx
const pageCount = await pdfReaderRef.current?._pdfDocument.getPageCount();
```

#### importDocument

Imports another PDF document and inserts it at a specified position in the current document.

Parameters:

| Name           | Type          | Description                                                  |
| -------------- | ------------- | ------------------------------------------------------------ |
| filePath       | string        | The path of the PDF document to import. Must be a valid, accessible path on the device. |
| pages          | Array[number] | The collection of pages to import, represented as an array of integers. If `null` or an empty array is passed, the entire document will be imported. |
| insertPosition | number        | The position to insert the external document into the current document. This value must be provided. If not specified, the document will be inserted at the end of the current document. |
| password       | string        | The password for the document, if it is encrypted. If the document is not encrypted, an empty string `''` can be passed. |

Returns a Promise.

| Name   | Type | Description                                                  |
| ------ | ---- | ------------------------------------------------------------ |
| result | bool | Returns a `Promise<boolean>` indicating whether the document import was successful.<br>\- `true` indicates success<br>\- `false` or an error indicates failure |

```tsx
// Define the file path of the document to import
// For local files (e.g., from app cache):
const filePath = '/data/user/0/com.compdfkit.flutter.example/cache/temp/PDF_Document.pdf';
// For Android content URIs (e.g., from media storage):
const filePath = 'content://media/external/file/1000045118';

// Specify the pages to import. An empty array [] imports all pages.
// In this example, only the first page (index 0) is imported.
const pages = [0]; 

// Define the position to insert the imported pages.
// 0 means inserting at the beginning of the document.
const insertPosition = 0; 

// Provide the document password if encrypted. Leave empty if not required.
const password = '';

// Import the document into the PDF reader.
const importResult = await pdfReaderRef.current?._pdfDocument.importDocument(
  filePath, 
  pages, 
  insertPosition, 
  password
);
```

#### splitDocumentPages

Splits the specified pages from the current document and saves them as a new document.

This function extracts the given pages from the current PDF document and saves them as a new document at the provided save path.

Parameters:

| Name     | Type          | Description                                    |
| -------- | ------------- | ---------------------------------------------- |
| savePath | string        | The path where the new document will be saved. |
| pages    | Array[number] | Pages to extract from the current document.    |

Returns a Promise.

| Name   | Type | Description                                                  |
| ------ | ---- | ------------------------------------------------------------ |
| result | bool | A Promise that resolves to `true` if the operation is successful, or `false` if it fails. |

```tsx
const savePath = '/data/user/0/com.compdfkit.flutter.example/cache/temp/PDF_Document.pdf';
// Pages to extract from the current document
const pages = [0, 1, 2]; 
const result = await pdfReaderRef.current?.splitDocumentPages(savePath, pages);
```

#### insertBlankPage

Inserts a blank page at the specified index in the document.

This method allows adding a blank page of a specified size at a specific index within the PDF document.
It is useful for document editing scenarios where page insertion is needed.

Parameters:

| Name      | Type         | Description                                                  |
| --------- | ------------ | ------------------------------------------------------------ |
| pageIndex | number       | The index position where the blank page will be inserted. Must be a valid index within the document. |
| pageSize  | CPDFPageSize | The size of the blank page to insert. Defaults to A4 size if not specified. |

Returns a Promise.

| Name   | Type | Description                                                  |
| ------ | ---- | ------------------------------------------------------------ |
| result | bool | A Promise that resolves to a boolean value indicating the success or failure of the blank page insertion. Resolves to `true` if the insertion was successful, `false` otherwise. |

```tsx
const pageSize = CPDFPageSize.a4;
// Custom page size
// const pageSize = new CPDFPageSize(500, 800);
const result = await pdfRef.current?._pdfDocument.insertBlankPage(0, pageSize);
```

### Annotations

#### import Annotations

Imports annotations from the specified XFDF file into the current PDF document.

Parameters:

| Name     | Type   | Description                                                                                                                                                                                                                                                    |
| -------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| xfdfFile | string | Path of the XFDF file to be imported.``The Android platform supports the following paths：``- **assets file**:'file:///android_assets/test.xfdf'``- **file path**: '/data/xxx.xfdf'``- **Uri**: 'content://xxxx' |

Returns a Promise.

Promise Parameters:

| Name   | Type    | Description                                                                |
| ------ | ------- | -------------------------------------------------------------------------- |
| result | boolean | **true**: import successful,``**false**: import failed. |

```tsx
const result = await pdfReaderRef.current.importAnnotations('xxx.xfdf');
```

#### export Annotations

Exports annotations from the current PDF document to an XFDF file.

Returns a Promise.

Promise Parameters:

| Name     | Type   | Description                                                                             |
| -------- | ------ | --------------------------------------------------------------------------------------- |
| xfdfPath | string | The path of the XFDF file if export is successful; an empty string if the export fails. |

```tsx
const exportXfdfFilePath = await pdfReaderRef.current?.exportAnnotations();
```

#### removeAllAnnotations

Delete all comments in the current document.

Returns a Promise.

Promise Parameters:

| Name   | Type    | Description |
| ------ | ------- | ----------- |
| result | boolean | true、false |

```tsx
const removeResult = await pdfReaderRef.current?.removeAllAnnotations();
```

#### getAnnotations

Retrieves all annotations on the current page.

This method fetches all annotations present on the current page of the PDF document  and returns a list of corresponding CPDFAnnotation instances.

Promise Parameters:

| Name        | Type             | Description                                                  |
| ----------- | ---------------- | ------------------------------------------------------------ |
| annotations | CPDFAnnotation[] | A promise that resolves with all annotations on the current page, or an empty array if retrieval fails. |

```tsx
// Page index, where 0 represents the first page
const pageIndex = 0;

// Retrieve the page object from the document
const page = pdfReaderRef?.current?._pdfDocument.pageAtIndex(pageIndex);

// Fetch all annotations on the specified page
const annotations = await page?.getAnnotations();
```

#### removeAnnotation

Removes the specified annotation from the PDF document

Parameters:

| Name       | Type           | Description                   |
| ---------- | -------------- | ----------------------------- |
| annotation | CPDFAnnotation | The annotation to be removed. |

Returns a Promise.

Promise Parameters:

| Name   | Type    | Description                                                 |
| ------ | ------- | ----------------------------------------------------------- |
| result | boolean | **true**: remove successful,<br />**false**: remove failed. |

```tsx
await pdfReaderRef?.current?._pdfDocument.removeAnnotation(annotation);
// or use
const pageIndex = 0;
const page = pdfReaderRef?.current?._pdfDocument.pageAtIndex(pageIndex);
const widgets = await page?.getWidgets();
const widgetToRemove = widgets[0];
await page?.removeWidget(widgetToRemove);
```

#### flattenAllPages

Flatten all pages of the current document.

Parameters:

| Name       | Type    | Description                                                  |
| ---------- | ------- | ------------------------------------------------------------ |
| savePath   | string  | The path to save the flattened document. On Android, you can pass a Uri. |
| fontSubset | boolean | Whether to include the font subset when saving.              |

Returns a Promise.

| Name   | Type    | Description                                                  |
| ------ | ------- | ------------------------------------------------------------ |
| result | boolean | Returns 'true' if the flattened document is saved successfully, otherwise 'false'. |

```tsx
const savePath = 'file:///storage/emulated/0/Download/flatten.pdf';
// or use Uri on the Android Platform.
const savePath = await ComPDFKit.createUri('flatten_test.pdf', 'compdfkit', 'application/pdf');
const fontSubset = true;
const result = await pdfReaderRef.current?._pdfDocument.flattenAllPages(savePath, fontSubset);
```

### Forms

#### importWidgets

Imports the form data from the specified XFDF file into the current PDF document.

The API only imports form data and modifies the form content through the corresponding form name.

Parameters:

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| xfdfFile | string | Path of the XFDF file to be imported.The Android platform supports the following paths：<br>- **assets file**:'file:///android_assets/test.xfdf'<br>- **file path**: '/data/xxx.xfdf'<br>- **Uri**: 'content://xxxx' |

Returns a Promise.

Promise Parameters:

| Name   | Type    | Description                                             |
| ------ | ------- | ------------------------------------------------------- |
| result | boolean | **true**: import successful,``**false**: import failed. |

```tsx
const result = await pdfReaderRef.current.importWidgets('xxx.xfdf');
```

#### exportWidgets

exports the form data from the current PDF document to an XFDF file.

Returns a Promise.

Promise Parameters:

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| xfdfPath | string | The path of the XFDF file if export is successful; an empty string if the export fails. |

```tsx
const exportXfdfFilePath = await pdfReaderRef.current?.exportWidgets();
```

#### getWidgets

Retrieves all form widgets on the current page.

This method fetches all form widgets present on the current page of the PDF document and returns a list of corresponding CPDFWidget instances.

Returns a Promise.

**Promise Parameters:**

| Name    | Type         | Description                                             |
| ------- | ------------ | ------------------------------------------------------- |
| widgets | CPDFWidget[] | **true**: import successful,``**false**: import failed. |

```tsx
const pageIndex = 0;
const page = pdfReaderRef?.current?._pdfDocument.pageAtIndex(pageIndex);
const widgets = await page?.getWidgets();
```

**Related Widgets**

| Class                 | Description                     |
| --------------------- | ------------------------------- |
| CPDFWidget            | Base class for all form widgets |
| CPDFTextWidget        | Text input field widget         |
| CPDFSignatureWidget   | Signature widget                |
| CPDFRadiobuttonWidget | Radio button widget             |
| CPDFPushbuttonWidget  | Button widget                   |
| CPDFListboxWidget     | List box widget                 |
| CPDFCheckboxWidget    | Checkbox widget                 |
| CPDFComboboxWidget    | Combo box widget                |

#### Fill Form Fields

ComPDFKit supports programmatically filling form fields in a PDF document.

The steps to fill in form fields using code are as follows:

1. Get the page object of the form to be filled in from CPDFDocument.

2. Retrieve all forms from the page object.

3. Traverse all forms to find the one to be filled in.

4. Modify the form field contents as needed.

This example shows how to fill in form fields:

```tsx
const pageIndex = 0;
// Retrieve the page object of the first page
const cpdfPage: CPDFPage = pdfReaderRef?.current?._pdfDocument.pageAtIndex(pageIndex);

// Retrieve all form widgets on the current page
const widgets = await page?.getWidgets();

// Fill in the text field content
// Assume that there is a text field form on the current page and retrieve the CPDFTextWidget object
const textWidget = widgets[0] as CPDFTextWidget;
// Set the text field content to "Hello World"
await textWidget.setText('Hello World');
// Refresh the appearance of the form to apply changes, this step is necessary
await textWidget.updateAp();

// Modify the radio button's checked state
const radioButtonWidget = widgets[0] as CPDFRadiobuttonWidget;
// Set the radio button to checked
await radioButtonWidget.setChecked(true);
// Refresh the appearance of the radio button
await radioButtonWidget.updateAp();

// Modify the checkbox's checked state
const checkboxWidget = widgets[0] as CPDFCheckboxWidget;
// Set the checkbox to checked
await checkboxWidget.setChecked(true);
// Refresh the appearance of the checkbox
await checkboxWidget.updateAp();

// Add an electronic signature to the signature form
const signatureWidget = widgets[0] as CPDFSignatureWidget;
// Android-supported URI format:
await signatureWidget.addImageSignature('content://media/external/images/media/123');
// Or file path:
await signatureWidget.addImageSignature('/path/to/image');
// Refresh the appearance of the signature form
await signatureWidget.updateAp();
```

#### removeWidget

Removes the specified widget from the PDF document

Parameters:

| Name   | Type       | Description               |
| ------ | ---------- | ------------------------- |
| widget | CPDFWidget | The widget to be removed. |

Returns a Promise.

Promise Parameters:

| Name   | Type    | Description                                                 |
| ------ | ------- | ----------------------------------------------------------- |
| result | boolean | **true**: remove successful,<br />**false**: remove failed. |

```tsx
await pdfReaderRef?.current?._pdfDocument.removeWidget(widget);
// or use
const pageIndex = 0;
const page = pdfReaderRef?.current?._pdfDocument.pageAtIndex(pageIndex);
const annotations = await page?.getAnnotations();
const annotationToRemove = annotations[0];
await page?.removeAnnotation(annotationToRemove);
```

### Security

#### isEncrypted

Checks if the PDF document is encrypted.

Returns a Promise.

| Name   | Type    | Description                       |
| ------ | ------- | --------------------------------- |
| result | boolean | Is the current document encrypted |

```tsx
const isEncrypted = await pdfReaderRef.current?._pdfDocument.isEncrypted();
```

#### getPermissions

Gets the current document's permissions.

There are three types of permissions:

No restrictions: `CPDFDocumentPermissions.NONE`If the document has an open password and an owner password,using the open password will grant `CPDFDocumentPermissions.USER` permissions, and using the owner password will grant `CPDFDocumentPermissions.OWNER` permissions.

Returns a Promise.

| Name   | Type                    | Description                              |
| ------ | ----------------------- | ---------------------------------------- |
| result | CPDFDocumentPermissions | Gets the current document's permissions. |

```tsx
const permissions = await pdfReaderRef.current?._pdfDocument.getPermissions();
```

#### checkOwnerUnlocked

Check if owner permissions are unlocked

Returns a Promise.

| Name   | Type    | Description |
| ------ | ------- | ----------- |
| result | boolean |             |

```tsx
const unlocked = await pdfReaderRef.current?._pdfDocument.checkOwnerUnlocked();
```

#### checkOwnerPassword

Whether the owner password is correct. If the password is correct, the document will be unlocked with full owner permissions.

Parameters:

| Name     | Type   | Description                                 |
| -------- | ------ | ------------------------------------------- |
| password | string | password The owner password to be verified. |

Returns a Promise.

| Name   | Type    | Description                                                                                |
| ------ | ------- | ------------------------------------------------------------------------------------------ |
| result | boolean | A promise that resolves to `true` if the owner password is correct, otherwise `false`. |

```tsx
const check = await pdfReaderRef.current?._pdfDocument.checkOwnerPassword('ownerPassword');
```

#### setPassword

This method sets the document password, including the user password for access restrictions and the owner password for granting permissions.

- To enable permissions like printing or copying, the owner password must be set; otherwise, the settings will not take effect.

Parameters:

| Name           | Type                    | Description                                                             |
| -------------- | ----------------------- | ----------------------------------------------------------------------- |
| userPassword   | string                  | The user password for document access restrictions.                     |
| ownerPassword  | string                  | The owner password to grant permissions (e.g., printing, copying).      |
| allowsPrinting | boolean                 | Whether printing is allowed (true or false).                            |
| allowsCopying  | boolean                 | Whether copying is allowed (true or false).                             |
| encryptAlgo    | CPDFDocumentEncryptAlgo | The encryption algorithm to use (e.g.,`CPDFDocumentEncryptAlgo.rc4`). |

Returns a Promise.

| Name   | Type    | Description                                                                                   |
| ------ | ------- | --------------------------------------------------------------------------------------------- |
| result | boolean | A promise that resolves to `true` if the password is successfully set, otherwise `false`. |

```tsx
const success = await pdfReaderRef.current?._pdfDocument.setPassword(
  'user_password',
  'owner_password',
  false,
  false,
  CPDFDocumentEncryptAlgo.rc4
);
```

#### removePassword

Remove the user password and owner permission password. set in the document, and perform an incremental save.

Returns a Promise.

| Name   | Type    | Description                                                              |
| ------ | ------- | ------------------------------------------------------------------------ |
| result | boolean | Returns `true` if password removal is successful, otherwise `false`. |

```tsx
const check = await pdfReaderRef.current?._pdfDocument.checkOwnerPassword('ownerPassword');
```

#### getEncryptAlgo

Get the encryption algorithm of the current document

Returns a Promise.

| Name   | Type                    | Description     |
| ------ | ----------------------- | --------------- |
| result | CPDFDocumentEncryptAlgo | Encryption Type |

```tsx
const encryptAlgo = await pdfReaderRef.current?._pdfDocument.getEncryptAlgo();
```

