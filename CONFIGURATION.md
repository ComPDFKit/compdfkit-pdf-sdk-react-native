## CPDFConfiguration Descriptions

This document outlines the UI configurations and PDF properties that can be defined when using the ComPDFKit PDF mobile SDK, including cross-platform support for React Native and Flutter, for opening PDF views. While the method for modifying configurations may vary across platforms due to different programming languages, the parameters remain consistent.

This configuration is only effective when you are using the default PDF view interfaces provided by the **ComPDFKit_Tools** module on **Android** and **iOS** platforms. **React Native** and **Flutter** already include the **ComPDFKit_Tools** module by default.

* **Android:** `CPDFDocumentActivity`、`CPDFDocumentFragment`
* **iOS:** `CPDFCPDFViewController`

### Usage Examples

Below are simple usage examples for each platform:

**Android**

For JSON-formatted configuration data, please refer to the [default configuration](#Json Example).

```java
// Retrieve default configuration data from the assets folder.
CPDFConfiguration configuration = CPDFConfigurationUtils.normalConfig(getContext(), "tools_default_configuration.json");

// Open the PDF using CPDFDocumentActivity.
CPDFDocumentActivity.startActivity(getContext(), documentPath, "", configuration);

// Open the PDF using CPDFDocumentFragment.
CPDFDocumentFragment.newInstance(documentPath, "", configuration);
```

**iOS**

For JSON-formatted configuration data, please refer to the [default configuration](#Json Example).

```swift
let jsonDataParse = CPDFJSONDataParse(String: jsonString as! String)
guard let configuration = jsonDataParse.configuration else { return }

CPDFViewController(filePath: path, password: nil, configuration: configuration)
```

**React Native**

```tsx
var configuration = ComPDFKit.getDefaultConfig({
  modeConfig: {
    initialViewMode: CPDFViewMode.VIEWER,
    availableViewModes: [
      CPDFViewMode.VIEWER,
      CPDFViewMode.ANNOTATIONS
    ]
  }
})

ComPDFKit.openDocument(document, '', configuration)

// Use in UI components
<CPDFReaderView
	document={samplePDF}
	configuration={config}
	style={{ flex: 1 }}
/>
```

**Flutter**

```dart
var configuration = CPDFConfiguration(
  modeConfig: ModeConfig(
    initialViewMode: CPreviewMode.viewer,
    availableViewModes: [
      CPreviewMode.viewer,
      CPreviewMode.annotations
    ]
  )
);
ComPDFKit.openDocument(document, password: '', configuration: configuration);

// usage Widget
Scaffold(
  resizeToAvoidBottomInset: false,
  appBar: AppBar(title: const Text('CPDFReaderWidget Example'),),
  body: CPDFReaderWidget(
    document: widget.documentPath,
    configuration: configuration
  ));
```

### Option Explanations

In the following section, explanations will be provided in JSON format. Each platform has defined relevant constant classes to assist you in conveniently setting the related parameters. Please refer to the respective `CPDFConfiguration` class content for each platform.

#### modeConfig

Used to configure the initial display mode and supported modes when displaying a PDF file.

##### **Parameters**

| Name               | Type   | Description                                                  |
| ------------------ | ------ | ------------------------------------------------------------ |
| initialViewMode    | string | Default mode to display when opening the PDF View, default is `viewer` |
| availableViewModes | string | Configure supported modes                                    |
| uiVisibilityMode   | string | Used to set the UI visibility mode<br/>**automatic**: Toolbars at the top and bottom are automatically shown or hidden when tapping on the PDF page<br/>**always**: Toolbars are always visible <br/>**never**: Toolbars are never displayed |

##### **Constants**

| Name          | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| viewer        | View PDF documents only.                                     |
| annotations   | Enables annotation editing mode, allowing addition, deletion, and modification of annotations. |
| contentEditor | content editing mode, enabling editing of text and image content within the PDF. |
| forms         | form filling mode, allowing addition and editing of form fields. |
| signautres    | signature mode, allowing electronic and digital signatures, as well as verification of digital signatures. |

```json
{
  "modeConfig": {
    "initialViewMode": "viewer",
    "uiVisibilityMode": "automatic",
    "availableViewModes": [
      "viewer",
      "annotations",
      "contentEditor",
      "forms",
      "signatures"
    ]
  }
}
```

#### toolbarConfig

Configure functions for the top toolbar in the PDF view.

##### **Parameters**

| Name                        | Type    | Description                                                  |
| --------------------------- | ------- | ------------------------------------------------------------ |
| androidAvailableActions     | Array   | Functions available in the top toolbar for Android platform.<br />Defaults: `thumbnail`, `search`, `bota`, `menu` |
| iosLeftBarAvailableActions  | Array   | Functions available in the left side of the top toolbar for iOS platform.<br />Defaults: `back`, `thumbnail` |
| iosRightBarAvailableActions | Array   | Functions available in the right side of the top toolbar for iOS platform.<br />Defaults: `search`, `bota`, `menu` |
| availableMenus              | Array   | A list of more functions popped up by the `menu` option on the top toolbar. |
| mainToolbarVisible          | boolean | Whether to display the toolbar at the top of the main interface view. |
| annotationToolbarVisible    | boolean | Shows or hides the annotation toolbar that appears at the bottom of the view when in annotation mode. |
| showInkToggleButton         | boolean | Whether to display the toggle/slide and drawing state buttons in the upper-left corner when drawing ink annotations. |
| contentEditorToolbarVisible | boolean | Show or hide the bottom toolbar in content editing mode      |
| formToolbarVisible          | boolean | Show or hide the bottom toolbar in form mode                 |
| signatureToolbarVisible     | boolean | Show or hide the bottom toolbar in signature mode            |
|                             |         |                                                              |

##### **Constants**

| Name      | Description                                                  |
| --------- | ------------------------------------------------------------ |
| back      | Exit the PDF view.<br />On Android platform, this is always displayed at the far left, regardless of the order of configuration. |
| thumbnail | Displays a list of PDF thumbnails and allows page manipulation such as addition and deletion. |
| bota      | Displays PDF outline, bookmarks, and annotations list.       |
| menu      | More options menu.                                           |

##### **availableMenus Constants**

| Name           | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| viewSetting    | Settings related to PDF viewing, such as scroll direction and theme. |
| documentEditor | Displays a list of PDF document thumbnails and allows page manipulation such as addition and deletion. |
| documentInfo   | Displays information related to the PDF document.            |
| watermark      | Adds text or image watermark to the document, saving it as a new document. |
| security       | Sets viewing and permission passwords for the document.      |
| flattened      | Flattens annotations and other content within the document, making annotations uneditable. |
| save           | Saves the document.                                          |
| share          | Shares the PDF document.                                     |
| openDocument   | Opens the system file selector to choose and open a PDF document. |
| snip           | The PDF capture function allows you to capture an area in the PDF document and convert it into an image. |
```json
{
   "toolbarConfig": {
    "mainToolbarVisible" : true,
    "contentEditorToolbarVisible" : true,
    "annotationToolbarVisible" : true,
    "formToolbarVisible" : true,
    "signatureToolbarVisible" : true,
    "showInkToggleButton": true,
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
      "openDocument",
      "snip"
    ]
  }
}
```

#### annotationsConfig

Configure annotation-related settings, such as enabling types displayed in the annotation toolbar and setting default attributes when adding annotations, including color and text styles.

##### **Parameters**

| Name             | Type   | Description                                                              |
| ---------------- | ------ |--------------------------------------------------------------------------|
| availableTypes   | Array  | The types of annotations enabled in the toolbar at the bottom.           |
| availableTools   | Array  | Annotation tools, including `Setting`, `Undo`, and `Redo`.               |
| initAttribute    | Array  | Set default attributes for annotations.                                  |
| annotationAuthor | String | Set the author name when adding annotations and replying to annotations. |

##### **availableTypes Constants**

| Name       |
| ---------- |
| note       |
| highlight  |
| underline  |
| squiggly   |
| strikeout  |
| ink        |
| ink_eraser |
| circle     |
| square     |
| arrow      |
| line       |
| freetext   |
| signature  |
| stamp      |
| pictures   |
| link       |
| sound      |

##### availableTools Constants

| Name    | Description                                                  |
| ------- | ------------------------------------------------------------ |
| setting | When a specific annotation type is selected from the list, the `setting` button becomes clickable, allowing for setting default attributes for the corresponding annotation. |
| undo    | Undo the annotation operation.                               |
| redo    | Redo the annotation operation.                               |

##### **initAttribute**

* note

| Name  | Type   | Example   | Description                            |
| ----- | ------ | --------- | -------------------------------------- |
| color | string | "#1460F3" | Color of note annotations              |
| alpha | int    | 255       | Opacity of the color<br />Range: 0~255 |

* highlight

| Name  | Type   | Example   | Description                            |
| ----- | ------ | --------- | -------------------------------------- |
| color | string | "#1460F3" | Color of highlight annotations         |
| alpha | int    | 77        | Opacity of the color<br />Range: 0~255 |

* underline

| Name  | Type   | Example   | Description                            |
| ----- | ------ | --------- | -------------------------------------- |
| color | string | "#1460F3" | Color of underline annotations         |
| alpha | int    | 77        | Opacity of the color<br />Range: 0~255 |

* squiggly

| Name  | Type   | Example   | Description                            |
| ----- | ------ | --------- | -------------------------------------- |
| color | string | "#1460F3" | Color of squiggly annotations          |
| alpha | int    | 77        | Opacity of the color<br />Range: 0~255 |

* strikeout

| Name  | Type   | Example   | Description                            |
| ----- | ------ | --------- | -------------------------------------- |
| color | string | "#1460F3" | Color of strikeout annotations         |
| alpha | int    | 77        | Opacity of the color<br />Range: 0~255 |

* ink

| Name        | Type   | Example   | Description                            |
| ----------- | ------ | --------- | -------------------------------------- |
| color       | string | "#1460F3" | Color of ink annotations               |
| alpha       | int    | 77        | Opacity of the color<br />Range: 0~255 |
| borderStyle | int    | 10        | Brush thickness<br />value range: 1~10 |

* square

| Name        | Type   | Example                                               | Description                                                  |
| ----------- | ------ | ----------------------------------------------------- | ------------------------------------------------------------ |
| fillColor   | string | "#1460F3"                                             | Fill color of the square                                     |
| borderColor | string | "#000000"                                             | Border color of the square                                   |
| colorAlpha  | int    | 128                                                   | Opacity of the fill color and border color<br />Range: 0~255 |
| borderWidth | int    | 2                                                     | Width of the border<br />Value range: 1~10                   |
| borderStyle | obj    | {<br /> "style": "solid",<br /> "dashGap": 8.0<br />} | Border style: `dashed` or `solid`                            |
| style       | string | solid                                                 | `dashed`，`solid`                                            |
| dashGap     | double | 8.0                                                   | Dashed gap, only style=`dashed` is valid.<br />value range:0.0~8.0 |

* circle

| Name        | Type   | Example                                               | Description                                                  |
| ----------- | ------ | ----------------------------------------------------- | ------------------------------------------------------------ |
| fillColor   | string | "#1460F3"                                             | Fill color of the circle                                     |
| borderColor | string | "#000000"                                             | Border color of the circle                                   |
| colorAlpha  | int    | 128                                                   | Opacity of the fill color and border color<br />Range: 0~255 |
| borderWidth | int    | 2                                                     | Width of the border<br />Value range: 1~10                   |
| borderStyle | obj    | {<br /> "style": "solid",<br /> "dashGap": 8.0<br />} | Border style: `dashed` or `solid`                            |
| style       | string | solid                                                 | `dashed`,`solid`                                             |
| dashGap     | double | 8.0                                                   | Dashed gap, only style=`dashed` is valid.<br />value range:0.0~8.0 |

* line

| Name        | Type   | Example                                               | Description                                                  |
| ----------- | ------ | ----------------------------------------------------- | ------------------------------------------------------------ |
| borderColor | string | "#000000"                                             | line color                                                   |
| borderAlpha | int    | 128                                                   | line color opacity<br />Range: 0~255                         |
| borderWidth | int    | 2                                                     | Width of the border<br />Value range: 1~10                   |
| borderStyle | obj    | {<br /> "style": "solid",<br /> "dashGap": 8.0<br />} | Border style: `dashed` or `solid`                            |
| style       | string | solid                                                 | `dashed`,`solid`                                             |
| dashGap     | double | 8.0                                                   | Dashed gap, only style=`dashed` is valid.<br />value range:0.0~8.0 |

* arrow

| Name          | Type   | Example                                               | Description                                                  |
| ------------- | ------ | ----------------------------------------------------- | ------------------------------------------------------------ |
| borderColor   | string | "#000000"                                             | arrow color                                                  |
| borderAlpha   | int    | 128                                                   | line color opacity<br />Range: 0~255                         |
| borderWidth   | int    | 2                                                     | Width of the border<br />Value range: 1~10                   |
| borderStyle   | obj    | {<br /> "style": "solid",<br /> "dashGap": 8.0<br />} | Border style: `dashed` or `solid`                            |
| style         | string | solid                                                 | `dashed`,`solid`                                             |
| dashGap       | double | 8.0                                                   | Dashed gap, only style=`dashed` is valid.<br />value range:0.0~8.0 |
| startLineType | string | openArrow                                             | Arrow starting position shape.                               |
| tailLineType  | string | none                                                  | Arrow tail position shape.                                   |

**LineType Constants**

| Name        |
| ----------- |
| none        |
| openArrow   |
| closedArrow |
| square      |
| circle      |
| diamond     |

* freeText

| Name           | Type    | Example   | Description                                                  |
| -------------- | ------- | --------- | ------------------------------------------------------------ |
| fontColor      | string  | "#1460F3" | text color                                                   |
| fontColorAlpha | int     | 255       | text color opacity.<br />value range：0~255                  |
| fontSize       | int     | 30        | font size<br>value range:1~100                               |
| isBold         | boolean | false     | Whether the font is bold.                                    |
| isItalic       | boolean | false     | Is the font italicized.                                      |
| alignment      | string  | left      | Text alignment.<br />`left`,`center`,`right`                 |
| typeface       | string  | Helvetica | The font used by default for text.<br />`Courier`<br/>`Helvetica`<br/>`Times-Roman` |

```json
{
"annotationsConfig": {
    "availableTypes": [
      "note",
      "highlight",
      "underline",
      "squiggly",
      "strikeout",
      "ink",
      "ink_eraser",
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
    "availableTools": [
      "setting",
      "undo",
      "redo"
    ],
    "initAttribute": {
      "note": {
        "color": "#1460F3",
        "alpha": 255
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
          "style": "solid",
          "dashGap": 0.0
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
        "startLineType": "none",
        "tailLineType": "openArrow"
      },
      "freeText": {
        "fontColor": "#000000",
        "fontColorAlpha": 255,
        "fontSize": 30,
        "isBold": false,
        "isItalic": false,
        "alignment": "left",
        "typeface": "Helvetica"
      }
    }
  }
}
```



#### contentEditorConfig

Switch to content editing mode to edit text and images. This configuration option allows you to specify the enabled editing types, such as enabling text editing only. You can also set the default attributes for adding text.

##### Parameters

| Name           | Type  | Description                                                  |
| -------------- | ----- | ------------------------------------------------------------ |
| availableTypes | Array | Content editing mode, the editing mode displayed at the bottom of the view.<br>Default order: `editorText`, `editorImage` |
| availableTools | Array | Available tools.<br/>including: `setting`, `undo`,`redo`     |
| initAttribute  | obj   | Default properties when adding text                          |

* text

| Name           | Type    | Example   | Description                                                  |
| -------------- | ------- | --------- | ------------------------------------------------------------ |
| fontColor      | string  | "#1460F3" | text color                                                   |
| fontColorAlpha | int     | 255       | text color opacity.<br />value range：0~255                  |
| fontSize       | int     | 30        | font size<br>value range:1~100                               |
| isBold         | boolean | false     | Whether the font is bold.                                    |
| isItalic       | boolean | false     | Is the font italicized.                                      |
| alignment      | string  | left      | Text alignment.<br />`left`,`center`,`right`                 |
| typeface       | string  | Helvetica | The font used by default for text.<br />`Courier`<br/>`Helvetica`<br/>`Times-Roman` |

```json
{
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
    "initAttribute": {
      "text": {
        "fontColor": "#000000",
        "fontColorAlpha" : 100,
        "fontSize": 30,
        "isBold": false,
        "isItalic": false,
        "typeface": "Times-Roman",
        "alignment": "left"
      }
    }
  }
}
```



#### formsConfig

This section is used to configure the types of forms enabled in the view's bottom toolbar, the form tools available, and the default attributes when adding forms.

##### Parameters

| Name           | Type  | Description                                |
| -------------- | ----- | ------------------------------------------ |
| availableTypes | Array | Types of forms enabled.                    |
| availableTools | Array | Form tools enabled.                        |
| initAttribute  | obj   | Default attributes for various form types. |

##### availableTypes Constants

| Name             |
| ---------------- |
| textField        |
| checkBox         |
| radioButton      |
| listBox          |
| comboBox         |
| signaturesFields |
| pushButton       |

##### availableTools Constants

| Name |
| ---- |
| undo |
| redo |

##### initAttribute

* textField

| Name        | Type    | Example   | Description                                                  |
| ----------- | ------- | --------- | ------------------------------------------------------------ |
| fillColor   | string  | "#DDE9FF" | Text field fill color.                                       |
| borderColor | string  | "#DDE9FF" | Text field border color                                      |
| borderWidth | int     | 2         | Text field border width<br>value range: 1~10                 |
| fontColor   | string  | "#000000" | font color                                                   |
| fontSize    | int     | 20        | font size<br>value range:1~100                               |
| isBold      | boolean | false     | Whether the font is bold.                                    |
| isItalic    | boolean | false     | Is the font italicized.                                      |
| alignment   | string  | left      | Text alignment.<br />`left`,`center`,`right`                 |
| multiline   | boolean | true      | 是否多行显示                                                 |
| typeface    | string  | Helvetica | The font used by default for text.<br />`Courier`<br/>`Helvetica`<br/>`Times-Roman` |

* checkBox

| Name         | Type    | Example   | Description                                                  |
| ------------ | ------- | --------- | ------------------------------------------------------------ |
| fillColor    | string  | "#DDE9FF" | checkBox fill color.                                         |
| borderColor  | string  | "#1460F3" | checkBox border Color.                                       |
| borderWidth  | int     | 2         | checkBox border width.<br/>value range: 1~10                 |
| checkedColor | string  | "#1460F3" | checkBox color.                                              |
| isChecked    | boolean | false     | When creating a checkBox, is it directly checked by default?. |
| checkedStyle | string  | "check"   | checkBox style.                                              |

**checkedStyle Constants**

| Name    |
| ------- |
| check   |
| circle  |
| cross   |
| diamond |
| square  |
| star    |

* radioButton

| Name         | Type    | Example   | Description                                                  |
| ------------ | ------- | --------- | ------------------------------------------------------------ |
| fillColor    | string  | "#DDE9FF" | radio Button fill color.                                     |
| borderColor  | string  | "#1460F3" | radio Button border Color.                                   |
| borderWidth  | int     | 2         | radio Button border width.<br/>value range: 1~10             |
| checkedColor | string  | "#1460F3" | radioButton color.                                           |
| isChecked    | boolean | false     | When creating radio button, whether to check the status directly by default. |
| checkedStyle | string  | "check"   | radio button style.                                          |

**checkedStyle Constants**

| Name    |
| ------- |
| check   |
| circle  |
| cross   |
| diamond |
| square  |
| star    |

* listBox

| Name        | Type    | Example   | Description                                                  |
| ----------- | ------- | --------- | ------------------------------------------------------------ |
| fillColor   | string  | "#DDE9FF" | list box fill color.                                         |
| borderColor | string  | "#1460F3" | list box border Color.                                       |
| borderWidth | int     | 2         | list box border width.<br/>value range: 1~10                 |
| fontColor   | string  | "#000000" | text color.                                                  |
| fontSize    | int     | 20        | font size<br/>value range:1~100                              |
| typeface    | string  | Helvetica | The font used by default for text.<br />`Courier`<br/>`Helvetica`<br/>`Times-Roman` |
| isBold      | boolean | false     | Whether the font is bold.                                    |
| isItalic    | boolean | false     | Is the font italicized.                                      |

* comboBox

| Name        | Type    | Example     | Description                                                  |
| ----------- | ------- | ----------- | ------------------------------------------------------------ |
| fillColor   | string  | "#DDE9FF"   | combo box fill color.                                        |
| borderColor | string  | "#1460F3"   | combo box border Color.                                      |
| borderWidth | int     | 2           | combo box border width.<br/>value range: 1~10                |
| fontColor   | string  | "#000000"   | text color.                                                  |
| fontSize    | int     | 20          | font size<br/>value range:1~100                              |
| typeface    | string  | "Helvetica" | The font used by default for text.<br />`Courier`<br/>`Helvetica`<br/>`Times-Roman` |
| isBold      | boolean | false       | Whether the font is bold.                                    |
| isItalic    | boolean | false       | Is the font italicized.                                      |

* pushButton

| Name        | Type    | Example     | Description                                                  |
| ----------- | ------- | ----------- | ------------------------------------------------------------ |
| fillColor   | string  | "#DDE9FF"   | combo box fill color.                                        |
| borderColor | string  | "#1460F3"   | combo box border Color.                                      |
| borderWidth | int     | 2           | combo box border width.<br/>value range: 1~10                |
| fontColor   | string  | "#000000"   | text color.                                                  |
| fontSize    | int     | 20          | font size<br/>value range:1~100                              |
| typeface    | string  | "Helvetica" | The font used by default for text.<br />`Courier`<br/>`Helvetica`<br/>`Times-Roman` |
| isBold      | boolean | false       | Whether the font is bold.                                    |
| isItalic    | boolean | false       | Is the font italicized.                                      |
| title       | string  | "Button"    | push button 创建时默认的按钮标题                             |

* signaturesFields

| Name        | Type   | Example   | Description                                   |
| ----------- | ------ | --------- | --------------------------------------------- |
| fillColor   | string | "#DDE9FF" | combo box fill color.                         |
| borderColor | string | "#1460F3" | combo box border Color.                       |
| borderWidth | int    | 2         | combo box border width.<br/>value range: 1~10 |

```json
{
  "formsConfig": {
    "availableTypes": [
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
        "alignment": "left",
        "multiline": true,
        "typeface": "Helvetica"
      },
      "checkBox": {
        "fillColor": "#DDE9FF",
        "borderColor": "#1460F3",
        "borderWidth": 2,
        "checkedColor": "#43474D",
        "isChecked": false,
        "checkedStyle": "check"
      },
      "radioButton": {
        "fillColor": "#DDE9FF",
        "borderColor": "#1460F3",
        "borderWidth": 2,
        "checkedColor": "#43474D",
        "isChecked": false,
        "checkedStyle": "circle"
      },
      "listBox": {
        "fillColor": "#DDE9FF",
        "borderColor": "#1460F3",
        "borderWidth": 2,
        "fontColor": "#000000",
        "fontSize": 20,
        "typeface": "Helvetica",
        "isBold": false,
        "isItalic": false
      },
      "comboBox": {
        "fillColor": "#DDE9FF",
        "borderColor": "#1460F3",
        "borderWidth": 2,
        "fontColor": "#000000",
        "fontSize": 20,
        "typeface": "Helvetica",
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
        "typeface": "Helvetica",
        "isBold": false,
        "isItalic": false
      },
      "signaturesFields": {
        "fillColor": "#DDE9FF",
        "borderColor": "#000000",
        "borderWidth": 2
      }
    }
  }
}
```

#### readerViewConfig

##### Parameters

| Name                | Type    | Example      | Description                                                  |
| ------------------- | ------- | ------------ | ------------------------------------------------------------ |
| linkHighlight       | boolean | true         | Sets whether hyperlinks in the PDF document annotations are highlighted. |
| formFieldHighlight  | boolean | true         | Sets whether form fields in the PDF document are highlighted. |
| displayMode         | string  | "singlePage" | Display mode of the PDF document, single page, double page, or book mode. |
| continueMode        | boolean | false        | Whether PDF page flipping is continuous scrolling.           |
| verticalMode        | boolean | true         | Whether scrolling is in vertical direction.<br/>`true`: Vertical scrolling, `false`: Horizontal scrolling.<br/>Default: `true` |
| cropMode            | boolean | false        | Cropping mode. Whether to crop blank areas of PDF pages      |
| themes              | string  | light        | Theme color.<br/>Default: `light`                            |
| enableSliderBar     | boolean | true         | Whether to display the sidebar quick scroll bar.             |
| enablePageIndicator | boolean | true         | Whether to display the bottom page indicator.                |
| pageSpacing         | int     | 10           | Spacing between each page of the PDF.<br/>default `10px`.    |
| pageScale           | double  | 1.0          | Page scale value, default 1.0.<br/>value range:1.0~5.0       |
| pageSameWidth       | boolean | true         | only android platform.                                       |
| margins             | Array   | [0,0,0,0]    | Set the outer spacing of the PDF area. The setting order is: left, top, right, bottom. |

##### displayMode Constants

| Name       |
| ---------- |
| singlePage |
| doublePage |
| coverPage  |

##### themes Constants

| Name   | Description                                  |
| ------ | -------------------------------------------- |
| light  | Bright mode, readerview background is white. |
| dark   | dark mode, readerview background is black.   |
| sepia  | brown paper color.                           |
| reseda | Light green, eye protection mode.            |

#### globalConfig

##### Parameters

| Name                    | Type                | Example                                                      | Description                                                  |
| ----------------------- | ------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| themeMode               | CPDFThemeMode       | light                                                        | Set the view theme style, support `light`, `dark`, `system`, the default is `light` theme<br />**ComPDFKit SDK for Flutter:** => 2.0.2<br />Only Android Platform. |
| fileSaveExtraFontSubset | boolean             | true                                                         | When saving a document, whether to save the used font set together with the document. |
| watermark               | CPDFWatermarkConfig |                                                              | Watermark configuration when opening the Add Watermark view  |
| thumbnail               | CPDFThumbnail       | {   "title" : "",   <br />"backgroundColor": "",  <br /> "editMode" : true <br />} |                                                              |
| enableErrorTips         | boolean             | true \| false                                                | Whether to enable error prompts. For example, if a page cannot add a highlight annotation, setting this to false will prevent the prompt message from appearing. |
| signatureType           | String              | manual                                                       | Used to configure the default signing method when signing in the form field of CPDFReaderView.<br />Type:<br />* manual<br />* digital<br />* electronic |
| bota                    | CPDFBotaConfig      |                                                              | Used to configure the enabled feature types and menu options in the BOTA interface |

##### themeMode Constants

| Name   | Description                           |
| ------ | ------------------------------------- |
| light  | The UI is displayed in a light theme. |
| dark   | The UI is displayed in a dark theme.  |
| system | Theme follow system settings.         |

#### contextMenuConfig

Used to configure the context menu options that pop up when selecting text, annotations, forms, etc. in different modes.

##### global

Used to configure global context menu items that are not tied to a specific mode (such as annotation, editing, or form mode). Currently, only the screenshot context is supported.

**screenshot**

Defines available actions during screenshot mode (e.g., area capture tools).

```json
"contextMenuConfig" : {
  "global": {
    "screenshot" : [
      { "key": "exit" },
      { "key": "share" }
    ]
  }
}
```

| **Key** | **Description**       |
| ------- | --------------------- |
| exit    | Exit screenshot mode. |
| share   | Share the screenshot. |

> ✅ Note: The order of the items determines how they appear in the menu. If not set, the default menu options will be used.

##### viewMode

Configures context menu options in **View Mode**, which applies to normal reading scenarios. Currently supports the textSelect context when selecting text.

```json
"contextMenuConfig" : {
  "viewMode": {
    "textSelect": [
      { "key": "copy" }
    ]
  }
}
```

##### annotationMode

Configures context menu options available in **Annotation Mode**, where different types of annotation targets (e.g., text, markup, stamp) show contextual menu actions.

```json
"contextMenuConfig" : {
  "annotationMode": {
    "textSelect": [
      { "key": "copy" },
      { "key": "highlight" },
      { "key": "underline" },
      { "key": "strikeout" },
      { "key": "squiggly" }
    ],
    "longPressContent": [
      { "key": "paste" },
      { "key": "note" },
      { "key": "textBox" },
      { "key": "stamp" },
      { "key": "image" }
    ],
    "markupContent": [
      { "key": "properties" },
      { "key": "note" },
      { "key": "reply" },
      { "key": "viewReply" },
      { "key": "delete" }
    ],
    "soundContent": [
      { "key": "reply" },
      { "key": "viewReply" },
      { "key": "play" },
      { "key": "record" },
      { "key": "delete" }
    ],
    "inkContent": [
      { "key": "properties" },
      { "key": "note" },
      { "key": "reply" },
      { "key": "viewReply" },
      { "key": "delete" }
    ],
    "shapeContent": [
      { "key": "properties" },
      { "key": "note" },
      { "key": "reply" },
      { "key": "viewReply" },
      { "key": "delete" }
    ],
    "freeTextContent": [
      { "key": "properties" },
      { "key": "edit" },
      { "key": "reply" },
      { "key": "viewReply" },
      { "key": "delete" }
    ],
    "signStampContent": [
      { "key": "signHere" },
      { "key": "delete" },
      { "key": "rotate" }
    ],
    "stampContent": [
      { "key": "note" },
      { "key": "reply" },
      { "key": "viewReply" },
      { "key": "delete" },
      { "key": "rotate" }
    ],
    "linkContent": [
      { "key": "edit" },
      { "key": "delete" }
    ]
  }
}
```

##### contentEditorMode

The context menu in content editing mode handles the context menu options that pop up for different operations such as selecting text, images, and long pressing the page.

```json
"contextMenuConfig" : {
  "contentEditorMode": {
    "editTextAreaContent" : [
      { "key": "properties" },
      { "key": "edit" },
      { "key": "cut" },
      { "key": "copy" },
      { "key": "delete" }
    ],
    "editSelectTextContent": [
      { "key": "properties" },
      {
        "key": "opacity",
        "subItems": ["25%", "50%", "75%", "100%"]
      },
      { "key": "cut" },
      { "key": "copy" },
      { "key": "delete" }
    ],
    "editTextContent": [
      { "key": "select" },
      { "key": "selectAll" },
      { "key": "paste" }
    ],
    "imageAreaContent": [
      { "key": "properties" },
      { "key": "rotateLeft" },
      { "key": "rotateRight" },
      { "key": "replace" },
      { "key": "export" },
      {
        "key": "opacity",
        "subItems": ["25%", "50%", "75%", "100%"]
      },
      { "key": "flipHorizontal" },
      { "key": "flipVertical" },
      { "key": "crop" },
      { "key": "delete" },
      { "key": "copy" },
      { "key": "cut" }
    ],
    "imageCropMode": [
      { "key": "done" },
      { "key": "cancel" }
    ],
    "editPathContent": [
      { "key": "delete" }
    ],
    "longPressWithEditTextMode" : [
      { "key" : "addText"},
      { "key" : "paste"},
      { "key" : "keepSourceFormatingPaste"}
    ],
    "longPressWithEditImageMode" : [
      { "key" : "addImages"},
      { "key" : "paste"}
    ],
    "longPressWithAllMode" : [
      { "key" : "paste"},
      { "key" : "keepSourceFormatingPaste"}
    ],
    "searchReplace": [
      { "key": "replace" }
    ]
  }
}
```

##### formMode

The context menu configuration in form mode displays different context menu options according to the object the user operates on (such as text field, list, radio button, etc.)

```json
"contextMenuConfig" : {
  "formMode": {
    "textField": [
      { "key": "properties" },
      { "key": "delete" }
    ],
    "checkBox": [
      { "key": "properties" },
      { "key": "delete" }
    ],
    "radioButton": [
      { "key": "properties" },
      { "key": "delete" }
    ],
    "listBox": [
      { "key": "options" },
      { "key": "properties" },
      { "key": "delete" }
    ],
    "comboBox": [
      { "key": "options" },
      { "key": "properties" },
      { "key": "delete" }
    ],
    "signatureField": [
      { "key": "startToSign" },
      { "key": "delete" }
    ],
    "pushButton" : [
      { "key": "options"},
      { "key": "properties"},
      { "key": "delete"}
    ]
  }
}
```

## Json Example

```json
{
  "modeConfig": {
    "initialViewMode": "viewer",
    "uiVisibilityMode": "automatic",
    "availableViewModes": [
      "viewer",
      "annotations",
      "contentEditor",
      "forms",
      "signatures"
    ]
  },
  "toolbarConfig": {
    "mainToolbarVisible" : true,
    "contentEditorToolbarVisible" : true,
    "annotationToolbarVisible" : true,
    "formToolbarVisible" : true,
    "signatureToolbarVisible" : true,
    "showInkToggleButton": true,
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
      "save",
      "watermark",
      "security",
      "flattened",
      "share",
      "openDocument",
      "snip"
    ]
  },
  "annotationsConfig": {
    "annotationAuthor": "Guest",
    "availableTypes": [
      "note",
      "highlight",
      "underline",
      "squiggly",
      "strikeout",
      "ink",
      "ink_eraser",
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
    "availableTools": [
      "setting",
      "undo",
      "redo"
    ],
    "initAttribute": {
      "note": {
        "color": "#1460F3",
        "alpha": 255
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
          "style": "solid",
          "dashGap": 0.0
        },
        "bordEffectType":"solid"
      },
      "circle": {
        "fillColor": "#1460F3",
        "borderColor": "#000000",
        "colorAlpha" : 128,
        "borderWidth": 2,
        "borderStyle": {
          "style": "solid",
          "dashGap": 0.0
        },
        "bordEffectType":"solid"
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
        "startLineType": "none",
        "tailLineType": "openArrow"
      },
      "freeText": {
        "fontColor": "#000000",
        "fontColorAlpha": 255,
        "fontSize": 30,
        "isBold": false,
        "isItalic": false,
        "alignment": "left",
        "typeface": "Helvetica"
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
    "initAttribute": {
      "text": {
        "fontColor": "#000000",
        "fontColorAlpha" : 100,
        "fontSize": 30,
        "isBold": false,
        "isItalic": false,
        "typeface": "Helvetica",
        "alignment": "left"
      }
    }
  },
  "formsConfig": {
    "availableTypes": [
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
        "alignment": "left",
        "multiline": true,
        "typeface": "Helvetica"
      },
      "checkBox": {
        "fillColor": "#DDE9FF",
        "borderColor": "#1460F3",
        "borderWidth": 2,
        "checkedColor": "#43474D",
        "isChecked": false,
        "checkedStyle": "check"
      },
      "radioButton": {
        "fillColor": "#DDE9FF",
        "borderColor": "#1460F3",
        "borderWidth": 2,
        "checkedColor": "#43474D",
        "isChecked": false,
        "checkedStyle": "circle"
      },
      "listBox": {
        "fillColor": "#DDE9FF",
        "borderColor": "#1460F3",
        "borderWidth": 2,
        "fontColor": "#000000",
        "fontSize": 20,
        "typeface": "Helvetica",
        "isBold": false,
        "isItalic": false
      },
      "comboBox": {
        "fillColor": "#DDE9FF",
        "borderColor": "#1460F3",
        "borderWidth": 2,
        "fontColor": "#000000",
        "fontSize": 20,
        "typeface": "Helvetica",
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
        "typeface": "Helvetica",
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
    "displayMode": "singlePage",
    "continueMode": true,
    "verticalMode": true,
    "cropMode": false,
    "themes" : "light",
    "enableSliderBar": true,
    "enablePageIndicator": true,
    "pageSpacing": 10,
    "margins" : [0,0,0,0],
    "pageScale": 1.0,
    "pageSameWidth": true,
    "enableMinScale": true
  },
  "global" : {
    "themeMode" : "system",
    "fileSaveExtraFontSubset" : true,
    "watermark": {
      "types" : [ "text" , "image" ],
      "saveAsNewFile" : false,
      "outsideBackgroundColor" : "",
      "text" : "",
      "image" : "tools_logo",
      "textSize" : 40,
      "textColor" : "#FF000000",
      "scale" : 1.5,
      "rotation" : 0,
      "opacity" : 255,
      "isFront" : false,
      "isTilePage" : false
    },
    "thumbnail": {
      "title" : "",
      "backgroundColor": "",
      "editMode" : true
    },
    "bota": {
      "tabs": ["outline", "bookmark", "annotations"],
      "menus": {
        "annotations": {
          "global": [
            { "id": "importAnnotation" },
            { "id": "exportAnnotation" },
            { "id": "removeAllAnnotation" },
            { "id": "removeAllReply" }
          ],
          "item": [
            { "id": "reviewStatus",
              "subMenus": [
                "accepted",
                "rejected",
                "cancelled",
                "completed",
                "none"
              ]
            },
            { "id": "markedStatus" },
            {
              "id": "more",
              "subMenus": [
                "addReply",
                "viewReply",
                "delete"
              ]
            }
          ]
        }
      }
    },
    "signatureType": "manual",
    "enableExitSaveTips" : true,
    "enableErrorTips" : true,
    "search": {
      "normalKeyword": {
        "borderColor": "#00000000",
        "fillColor": "#77FFFF00"
      },
      "focusKeyword": {
        "borderColor": "#00000000",
        "fillColor": "#CCFD7338"
      }
    },
    "pageEditor": {
      "menus": [
        "insertPage",
        "replacePage",
        "extractPage",
        "copyPage",
        "rotatePage",
        "deletePage"
      ]
    }
  },
  "contextMenuConfig" : {
    "global": {
      "screenshot" : [
        { "key": "exit" },
        { "key": "share" }
      ]
    },
    "viewMode": {
      "textSelect": [
        { "key": "copy" }
      ]
    },
    "annotationMode": {
      "textSelect": [
        { "key": "copy" },
        { "key": "highlight" },
        { "key": "underline" },
        { "key": "strikeout" },
        { "key": "squiggly" }
      ],
      "longPressContent": [
        { "key": "paste" },
        { "key": "note" },
        { "key": "textBox" },
        { "key": "stamp" },
        { "key": "image" }
      ],
      "markupContent": [
        { "key": "properties" },
        { "key": "note" },
        { "key": "reply" },
        { "key": "viewReply" },
        { "key": "delete" }
      ],
      "soundContent": [
        { "key": "reply" },
        { "key": "viewReply" },
        { "key": "play" },
        { "key": "record" },
        { "key": "delete" }
      ],
      "inkContent": [
        { "key": "properties" },
        { "key": "note" },
        { "key": "reply" },
        { "key": "viewReply" },
        { "key": "delete" }
      ],
      "shapeContent": [
        { "key": "properties" },
        { "key": "note" },
        { "key": "reply" },
        { "key": "viewReply" },
        { "key": "delete" }
      ],
      "freeTextContent": [
        { "key": "properties" },
        { "key": "edit" },
        { "key": "reply" },
        { "key": "viewReply" },
        { "key": "delete" }
      ],
      "signStampContent": [
        { "key": "signHere" },
        { "key": "delete" },
        { "key": "rotate" }
      ],
      "stampContent": [
        { "key": "note" },
        { "key": "reply" },
        { "key": "viewReply" },
        { "key": "delete" },
        { "key": "rotate" }
      ],
      "linkContent": [
        { "key": "edit" },
        { "key": "delete" }
      ]
    },
    "contentEditorMode": {
      "editTextAreaContent" : [
        { "key": "properties" },
        { "key": "edit" },
        { "key": "cut" },
        { "key": "copy" },
        { "key": "delete" }
      ],
      "editSelectTextContent": [
        { "key": "properties" },
        {
          "key": "opacity",
          "subItems": ["25%", "50%", "75%", "100%"]
        },
        { "key": "cut" },
        { "key": "copy" },
        { "key": "delete" }
      ],
      "editTextContent": [
        { "key": "select" },
        { "key": "selectAll" },
        { "key": "paste" }
      ],
      "imageAreaContent": [
        { "key": "properties" },
        { "key": "rotateLeft" },
        { "key": "rotateRight" },
        { "key": "replace" },
        { "key": "export" },
        {
          "key": "opacity",
          "subItems": ["25%", "50%", "75%", "100%"]
        },
        { "key": "flipHorizontal" },
        { "key": "flipVertical" },
        { "key": "crop" },
        { "key": "delete" },
        { "key": "copy" },
        { "key": "cut" }
      ],
      "imageCropMode": [
        { "key": "done" },
        { "key": "cancel" }
      ],
      "editPathContent": [
        { "key": "delete" }
      ],
      "longPressWithEditTextMode" : [
        { "key" : "addText"},
        { "key" : "paste"},
        { "key" : "keepSourceFormatingPaste"}
      ],
      "longPressWithEditImageMode" : [
        { "key" : "addImages"},
        { "key" : "paste"}
      ],
      "longPressWithAllMode" : [
        { "key" : "paste"},
        { "key" : "keepSourceFormatingPaste"}
      ],
      "searchReplace": [
        { "key": "replace" }
      ]
    },
    "formMode": {
      "textField": [
        { "key": "properties" },
        { "key": "delete" }
      ],
      "checkBox": [
        { "key": "properties" },
        { "key": "delete" }
      ],
      "radioButton": [
        { "key": "properties" },
        { "key": "delete" }
      ],
      "listBox": [
        { "key": "options" },
        { "key": "properties" },
        { "key": "delete" }
      ],
      "comboBox": [
        { "key": "options" },
        { "key": "properties" },
        { "key": "delete" }
      ],
      "signatureField": [
        { "key": "startToSign" },
        { "key": "delete" }
      ],
      "pushButton" : [
        { "key": "options"},
        { "key": "properties"},
        { "key": "delete"}
      ]
    }
  }
}
```

