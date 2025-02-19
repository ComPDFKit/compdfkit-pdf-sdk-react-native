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

| Name   | Type    | Description                                                  |
| ------ | ------- | ------------------------------------------------------------ |
| result | boolean | Returns ```true``` if initialization is successful, otherwise returns ```false```. |

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

| Name   | Type    | Description                                                  |
| ------ | ------- | ------------------------------------------------------------ |
| result | boolean | Returns ```true``` if initialization is successful, otherwise returns ```false```. |

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

| Name          | Type   | Description                                                  |
| ------------- | ------ | ------------------------------------------------------------ |
| document      | string | The path to the PDF document to be presented.                |
| password      | string | PDF document password.                                       |
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

| Name   | Type    | Description                                                  |
| ------ | ------- | ------------------------------------------------------------ |
| result | boolean | Returns `true` if the deletion was successful, otherwise returns `false`. |

```tsx
ComPDFKit.removeSignFileList();
```

### pickFile

Opens the system file picker to select a PDF document.

Returns a Promise.

| Name   | Type   | Description           |
| ------ | ------ | --------------------- |
| result | string | 返回选择的PDF文件路径 |

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

| Name   | Type | Description  |
| ------ | ---- | ------------ |
| result | bool | 是否设置成功 |

```tsx
// Set the font directory
ComPDFKit.setImportFontDir('fontdir', true);
// Initialize the ComPDFKit SDK
ComPDFKit.init_('your license key');
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

| Name   | Type | Description                                                  |
| ------ | ---- | ------------------------------------------------------------ |
| result | bool | A promise that resolves to `true` if the document is successfully opened, otherwise `false`. |

```tsx
await pdfReaderRef.current?._pdfDocument.open(document, 'password');
```

#### hasChange
Checks whether the document has been modified.

Returns a Promise.

Promise Parameters:

| Name      | Type    | Description                                                  |
| --------- | ------- | ------------------------------------------------------------ |
| hasChange | boolean | `true`: The document has been modified,   <br/>`false`: The document has not been modified. |

```tsx
const hasChange = await pdfReaderRef.current?.hasChange();
```

#### save

Save the current document changes.

Returns a Promise.

Promise Parameters:

| Name   | Type    | Description                                            |
| ------ | ------- | ------------------------------------------------------ |
| result | boolean | **true**: Save successful,<br/>**false**: Save failed. |

```js
const saveResult = await pdfReaderRef.current.save();
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

| Name   | Type    | Description                                                  |
| ------ | ------- | ------------------------------------------------------------ |
| result | boolean | Return `true` if the document is a scanned image document, otherwise return `false`. |

```tsx
const isImageDoc = await pdfReaderRef.current?._pdfDocument.isImageDoc();
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

| Mode   | Description                                                  | Option Values     |
| ------ | ------------------------------------------------------------ | ----------------- |
| LIGHT  | Uses a white background and black text, suitable for reading in well-lit environments. | CPDFThemes.LIGHT  |
| DARK   | Uses a dark background and light text, suitable for reading in low-light environments. | CPDFThemes.DARK   |
| SEPIA  | Use a beige background for users who are used to reading on paper. | CPDFThemes.SEPIA  |
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

| Name   | Type    | Description                                                  |
| ------ | ------- | ------------------------------------------------------------ |
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

| Name   | Type    | Description                                                  |
| ------ | ------- | ------------------------------------------------------------ |
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

| Name   | Type    | Description                                                  |
| ------ | ------- | ------------------------------------------------------------ |
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

| Name   | Type    | Description                                                  |
| ------ | ------- | ------------------------------------------------------------ |
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

| Name   | Type    | Description                                                  |
| ------ | ------- | ------------------------------------------------------------ |
| result | boolean | Returns `true` if the current mode is clipping mode, otherwise returns `false` |

```tsx
await pdfReaderRef.current?.isCropMode();
```

#### setPageSameWidth

In the single page mode, set whether all pages keep the same width and the original page keeps the same width as readerView.

Parameters:

| Name            | Type    | Description                                                  |
| --------------- | ------- | ------------------------------------------------------------ |
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

### Page

#### setDisplayPageIndex

Jump to the index page.

Parameters:

| Name      | Type | Description    |
| --------- | ---- | -------------- |
| pageIndex | int  | 需要跳转的页码 |

```tsx
await pdfReaderRef.current?.setDisplayPageIndex(1);
```

#### getCurrentPageIndex

get current page index.

Returns a Promise.

Promise Parameters:

| Name      | Type | Description                |
| --------- | ---- | -------------------------- |
| pageIndex | int  | 返回当前文档展示的页面索引 |

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



### Annotations

#### import Annotations

Imports annotations from the specified XFDF file into the current PDF document.

Parameters:

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
| xfdfFile | string | Path of the XFDF file to be imported.<br/>The Android platform supports the following paths：<br/>- **assets file**:'file:///android_assets/test.xfdf'<br/>- **file path**: '/data/xxx.xfdf'<br/>- **Uri**: 'content://xxxx' |

Returns a Promise.

Promise Parameters:

| Name   | Type    | Description                                                |
| ------ | ------- | ---------------------------------------------------------- |
| result | boolean | **true**: import successful,<br/>**false**: import failed. |

```tsx
const result = await pdfReaderRef.current.importAnnotations('xxx.xfdf');
```

#### export Annotations
Exports annotations from the current PDF document to an XFDF file.

Returns a Promise.

Promise Parameters:

| Name     | Type   | Description                                                  |
| -------- | ------ | ------------------------------------------------------------ |
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

### Security

#### isEncrypted

Checks if the PDF document is encrypted.

Returns a Promise.

| Name   | Type    | Description        |
| ------ | ------- | ------------------ |
| result | boolean | 当前文档是否已加密 |

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

| Name   | Type    | Description                                                  |
| ------ | ------- | ------------------------------------------------------------ |
| result | boolean | A promise that resolves to `true` if the owner password is correct, otherwise `false`. |

```tsx
const check = await pdfReaderRef.current?._pdfDocument.checkOwnerPassword('ownerPassword');
```

#### setPassword

This method sets the document password, including the user password for access restrictions and the owner password for granting permissions.

- To enable permissions like printing or copying, the owner password must be set; otherwise, the settings will not take effect.

Parameters:

| Name           | Type                    | Description                                                  |
| -------------- | ----------------------- | ------------------------------------------------------------ |
| userPassword   | string                  | The user password for document access restrictions.          |
| ownerPassword  | string                  | The owner password to grant permissions (e.g., printing, copying). |
| allowsPrinting | boolean                 | Whether printing is allowed (true or false).                 |
| allowsCopying  | boolean                 | Whether copying is allowed (true or false).                  |
| encryptAlgo    | CPDFDocumentEncryptAlgo | The encryption algorithm to use (e.g., `CPDFDocumentEncryptAlgo.rc4`). |

Returns a Promise.

| Name   | Type    | Description                                                  |
| ------ | ------- | ------------------------------------------------------------ |
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

| Name   | Type    | Description                                                  |
| ------ | ------- | ------------------------------------------------------------ |
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

