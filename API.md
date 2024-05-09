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
document = 'file:///storage/emulated/0/Download/sample.pdf'
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

When you use the `ComPDFKit.openDocument` method to present a PDF file, you need to pass configuration parameters to customize the UI features and PDF view properties. `ComPDFKit` provides default configuration parameters through `ComPDFKit.getDefaultConfig`. You can retrieve them using the following example:

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

