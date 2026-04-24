# PDF SDK for React Native | View, Annotate, Edit & Sign PDFs on iOS and Android

ComPDF for React Native gives developers a cross-platform PDF SDK for **iOS and Android** with viewing, annotation, editing, form filling, redaction, and signatures. For teams building broader **document workflow** products, ComPDF also connects well with ComPDF API for **Convert**, **OCR**, and **Generate** scenarios.

## 🚀 Why ComPDF

ComPDF is built for React Native teams that want native PDF performance without giving up cross-platform development speed.

Why it stands out in practice:

- **Cross-platform by default:** one React Native integration for **Android + iOS**.
- **JS bridge with native rendering:** keep product logic in JavaScript or TypeScript while using native PDF capabilities underneath.
- **Production-ready document UI:** ship viewing, review, editing, forms, and signatures faster.
- **Commercial support path:** trial license, enterprise licensing, SDK support, and API expansion options.
- **Less integration overhead:** simpler than combining a low-level renderer, custom tools, and separate workflow services.

## 🎬 Live Demo

Try ComPDF in action:

- Web Demo: [https://www.compdf.com/demo/webviewer](https://www.compdf.com/demo/webviewer)
- Sample Project: [https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native](https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native)
- Video Demo: [https://youtu.be/2ug2nPkuOy4](https://youtu.be/2ug2nPkuOy4)

## ⚡ Quick Start

> Requirements: React Native CLI or Expo development build, Android `minSdkVersion 21+`, iOS `12+`.

### 1. Install

```bash
npm install @compdfkit_pdf_sdk/react_native
```

### 2. Configure your project

**Expo**

```json
{
  "expo": {
    "plugins": ["@compdfkit_pdf_sdk/react_native"]
  }
}
```

**React Native CLI (iOS Podfile example)**

```ruby
pod "ComPDFKit", podspec:'https://file.compdf.com/cocoapods/ios/compdfkit_pdf_sdk/2.6.6/ComPDFKit.podspec'
pod "ComPDFKit_Tools", podspec:'https://file.compdf.com/cocoapods/ios/compdfkit_pdf_sdk/2.6.6/ComPDFKit_Tools.podspec'
```

**File placement**

- Android: put `license_key_rn.xml` and `PDF_Document.pdf` in `android/app/src/main/assets/`
- iOS: add `license_key_rn.xml` and `PDF_Document.pdf` to the iOS app target

### 3. Initialize and render the PDF reader

```tsx
import React, { useEffect } from 'react';
import { Platform, SafeAreaView } from 'react-native';
import { ComPDFKit, CPDFReaderView } from '@compdfkit_pdf_sdk/react_native';

export default function App() {
  useEffect(() => {
    const initialize = async () => {
      await ComPDFKit.initWithPath(
        Platform.OS === 'android'
          ? 'assets://license_key_rn.xml'
          : 'license_key_rn.xml',
      );
    };

    initialize();
  }, []);

  const document =
    Platform.OS === 'android'
      ? 'file:///android_asset/PDF_Document.pdf'
      : 'PDF_Document.pdf';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CPDFReaderView
        document={document}
        configuration={ComPDFKit.getDefaultConfig({})}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}
```

## 🧩 Key Features

- 📄 **Cross-Platform PDF Viewing**Render and navigate PDFs in a consistent React Native experience across both platforms.👉 Use case: document portals, mobile case management, secure readers
- ✍️ **Annotation & Review**Add highlights, notes, and markup directly in the app.👉 Use case: contract review, internal approvals, education apps
- 🛠️ **Editing, Forms, Redaction & Signatures**Turn a viewer into a complete document workflow screen.👉 Use case: onboarding packets, inspections, signed forms
- 🔌 **Configurable JS Bridge**Control reader modes, tools, and behaviors from JavaScript/TypeScript.👉 Use case: branded apps with custom business logic and analytics
- 🔄 **Convert / OCR / Generate Workflows via ComPDF API**
  Extend your app beyond viewing and editing with backend document processing.
  👉 Use case: invoice OCR, generated reports, searchable archives

## 💡 Use Cases

- **Document Management Systems** with one mobile codebase for iOS and Android
- **PDF Editors** embedded in React Native products
- **Invoice Processing** apps that upload scans and route OCR/conversion to backend services
- **Field Operations & Sales Apps** for reports, quotes, contracts, and signatures
- **Client and Employee Portals** that require secure in-app document review

## 🧪 Code Snippets

### Open a PDF modally with viewer + annotation modes only

```tsx
import { ComPDFKit, CPDFViewMode } from '@compdfkit_pdf_sdk/react_native';

const config = ComPDFKit.getDefaultConfig({
  modeConfig: {
    initialViewMode: CPDFViewMode.VIEWER,
    availableViewModes: [
      CPDFViewMode.VIEWER,
      CPDFViewMode.ANNOTATIONS,
    ],
  },
});

ComPDFKit.openDocument(document, '', config);
```

### Limit annotation tools and set default note styling

```tsx
import {
  ComPDFKit,
  CPDFAnnotationType,
  CPDFConfigTool,
  CPDFReaderView,
} from '@compdfkit_pdf_sdk/react_native';

const config = ComPDFKit.getDefaultConfig({
  annotationsConfig: {
    availableType: [CPDFAnnotationType.NOTE],
    availableTools: [
      CPDFConfigTool.SETTING,
      CPDFConfigTool.UNDO,
      CPDFConfigTool.REDO,
    ],
    initAttribute: {
      note: {
        color: '#1460F3',
        alpha: 255,
      },
    },
  },
});

<CPDFReaderView
  document={document}
  configuration={config}
  style={{ flex: 1 }}
/>;
```

## 🔗 Documentation & Resources

| Resource            | Link                                                                                                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Official Docs       | [https://www.compdf.com/guides/pdf-sdk/react-native/overview](https://www.compdf.com/guides/pdf-sdk/react-native/overview)                                                       |
| API Reference       | [https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native/blob/main/API.md](https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native/blob/main/API.md)                     |
| Configuration Guide | [https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native/blob/main/CONFIGURATION.md](https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native/blob/main/CONFIGURATION.md) |
| GitHub              | [https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native](https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native)                                                       |
| Demo                | [https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native](https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native)                                                       |

## ❤️ Engagement

If this package helps your React Native app ship faster, please ⭐ **Star us on GitHub** to support the project.

ComPDF is a strong fit for teams that want cross-platform delivery, native PDF performance, and a clean path from viewer UI to full document workflows.
