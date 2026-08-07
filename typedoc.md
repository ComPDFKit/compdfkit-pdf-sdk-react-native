This site is the generated API reference for the ComPDF React Native SDK.
It documents the public TypeScript surface used to view, annotate, edit, fill,
search, and manage PDF documents on Android and iOS.

For an end-to-end setup walkthrough, see the
[React Native Integration Guide](./React%20Native%20Integration%20Guide.md).

## Start Here

- **Core**: {@link index.ComPDFKit | ComPDFKit} initializes the SDK and provides global APIs.
- **Viewer**: {@link index.CPDFReaderView | CPDFReaderView} renders and controls the PDF reader.
- **Document**: {@link index.CPDFDocument | CPDFDocument} provides document-wide operations.
- **Page**: {@link index.CPDFPage | CPDFPage} provides page text, annotation, and form operations.
- **Annotations**: {@link index.CPDFAnnotation | CPDFAnnotation} and its subclasses represent PDF annotations.
- **Forms**: {@link index.CPDFWidget | CPDFWidget} and its subclasses represent interactive form fields.
- **Edit**: {@link index.CPDFEditArea | CPDFEditArea} and {@link index.CPDFEditManager | CPDFEditManager} provide content editing APIs.
- **Configuration**: {@link index.CPDFConfiguration | CPDFConfiguration} configures reader modes, tools, and UI.
- **Utilities**: {@link index.CPDFImageUtil | CPDFImageUtil} and related helpers convert common SDK data.

## Typical Flow

1. Install `@compdfkit_pdf_sdk/react_native` in your React Native application.
2. Initialize `ComPDFKit` with the license method required by your deployment.
3. Render `CPDFReaderView` with a document path and configuration.
4. Use the document, page, annotation, form, and editing APIs from the reader ref.

```tsx
import {
  ComPDFKit,
  CPDFReaderView,
  getDefaultConfig,
} from "@compdfkit_pdf_sdk/react_native";

await ComPDFKit.init_("your-compdfkit-license");

const configuration = getDefaultConfig({});

<CPDFReaderView
  document="file:///path/to/document.pdf"
  configuration={configuration}
/>;
```

## Documentation Conventions

- Types and signatures are generated from the public TypeScript declarations.
- Examples show the intended React Native integration pattern.
- APIs marked `Deprecated` should be replaced with the alternative named in their migration note.
- Platform-specific behavior is called out in the API description when it differs between Android and iOS.

Use the search box or the navigation menu to find a symbol, then check its
parameters, return value, examples, and deprecation notes before integrating it.
