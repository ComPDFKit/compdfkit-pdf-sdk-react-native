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

