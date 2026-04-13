# ComPDFKit React Native Example

A comprehensive example application demonstrating how to integrate and use the [ComPDFKit PDF SDK](https://www.compdf.com/) in a React Native project. The app showcases **45+ independent examples** across **9 feature categories**, covering everything from basic PDF viewing to advanced annotation, form, and security operations.

## Feature Categories

| Category | Examples | Description |
|----------|----------|-------------|
| **Viewer** | 4 | Basic viewer, dark theme, modal viewer, open external files |
| **Viewer Controller** | 6 | Zoom, display settings, snip mode, preview mode, document control |
| **Annotations** | 7 | Add / list / edit / delete annotations, XFDF import/export, annotation mode |
| **Forms** | 8 | Create / fill / edit forms, data import/export, custom creation, intercept actions |
| **Pages** | 6 | Insert / delete / rotate / move pages, split documents, page thumbnails |
| **Security** | 5 | Set/remove password, watermark, document permissions, digital signatures |
| **Content Editor** | 4 | Text editing, image editing, content editing mode, undo/redo history |
| **Search & Navigation** | 5 | Text search, outline, bookmarks, page navigation |
| **UI Customization** | 6 | Custom toolbar, context menu, UI style, annotation creation intercept |

## Project Structure

```
example/
├── App.tsx                        # App entry point
├── src/
│   ├── app/                       # Application shell
│   │   ├── initialization/        # SDK license & font initialization
│   │   ├── navigation/            # React Navigation routes & screen registry
│   │   ├── screens/               # Shell screens (Home, Category, Settings)
│   │   └── settings/              # Persisted user preferences
│   ├── examples/                  # Example metadata registry (data layer)
│   │   ├── registry.ts            # All categories aggregated
│   │   ├── runtime.ts             # Platform filtering & execution logic
│   │   └── shared/                # Shared types (ExampleItem, CategoryInfo, etc.)
│   ├── features/                  # Feature implementations (one folder per category)
│   │   ├── annotations/           # Annotation examples & shared scaffold
│   │   ├── content_editor/        # Content editor examples
│   │   ├── forms/                 # Form widget examples
│   │   ├── pages/                 # Page manipulation examples
│   │   ├── search_navigation/     # Search & navigation examples
│   │   ├── security/              # Security & encryption examples
│   │   ├── ui_customization/      # UI customization examples
│   │   ├── viewer/                # Viewer & viewer controller examples
│   │   └── widgets/               # Widget controller examples
│   ├── theme/                     # Light/dark theme tokens (appTheme.ts)
│   ├── util/                      # File copy & path utilities
│   └── widgets/                   # Reusable UI components (toolbar, cards, etc.)
```

## Prerequisites

- Node.js >= 18
- Yarn
- Xcode (for iOS) / Android Studio (for Android)
- A valid ComPDFKit license file (`license_key_rn.xml`) placed in:
  - **Android**: `android/app/src/main/assets/`
  - **iOS**: added to the Xcode project bundle

## Getting Started

1. Install dependencies:

   ```bash
   yarn install
   ```

   This will also run `pod install` for iOS automatically.

2. Build and run:

   ```bash
   # iOS
   yarn run ios

   # Android
   yarn run android
   ```

## Key Patterns

- **Scaffold pattern**: Each feature category provides a shared `{Feature}ExampleScaffold` that handles toolbar, PDF reader initialization, and navigation. Individual example screens only need to define their specific SDK operations.
- **Action modules**: SDK API calls are encapsulated in `{feature}Actions.ts` files, keeping UI components clean.
- **Registry system**: Example metadata (name, description, route, visual) is declared in `_registry.ts` files under `src/examples/`. The app shell reads this registry to build the Home and Category screens automatically.

## License

See the [LICENSE](../LICENSE) file in the root of the repository.
