# 如何在 Expo 项目中使用 ComPDFKit React Native PDF SDK

本文档说明如何在 Expo 项目中集成 `@compdfkit_pdf_sdk/react_native`。

ComPDFKit 依赖原生 iOS 和 Android 代码，因此不支持在 Expo Go 中运行。请使用 development build、`expo run` 或 EAS Build。

SDK 包内已经包含官方 Expo config plugin。执行 `expo prebuild` 时，该插件会自动更新 iOS 的 Podfile，因此无需手动编辑 `ios/Podfile`。

## 开始前先准备好环境

请先确认当前环境已经具备 Expo 原生构建所需条件：

- [Android Studio](https://developer.android.com/studio/install)
- [Xcode](https://developer.apple.com/xcode/)
- [Expo CLI](https://docs.expo.dev/get-started/create-a-project/)
- [EAS CLI](https://www.npmjs.com/package/eas-cli)

## 创建一个 Expo 项目

执行以下命令：

```shell
npx create-expo-app compdfkit_expo
cd compdfkit_expo
```

然后安装项目依赖：

```shell
npm install
# 或
yarn install
```

## 安装 ComPDFKit

执行：

```shell
yarn add @compdfkit_pdf_sdk/react_native
```

## 在 Expo 配置中声明插件

按如下方式修改 `app.json`：

```json
{
  "expo": {
    "plugins": ["@compdfkit_pdf_sdk/react_native"]
  }
}
```

同时请确认项目中已经正确设置 iOS 的 `bundleIdentifier` 和 Android 的 `package`。ComPDFKit 的许可证会绑定到这些标识上。

如果你的 Expo 项目还需要自定义原生构建参数，例如 `compileSdkVersion`、`minSdkVersion` 或 `deploymentTarget`，可以额外安装并配置 `expo-build-properties`。但对于 ComPDFKit plugin 本身而言，这并不是必需项。

## 生成原生工程

执行：

```shell
CI=1 npx expo prebuild --clean
```

该命令会生成 `ios` 和 `android` 目录，并执行 ComPDFKit 的 Expo plugin。

## 验证 iOS 插件是否生效

在 prebuild 完成后，打开 `ios/Podfile`。

你应该能在 `use_expo_modules!` 下方看到类似如下的生成区块：

```ruby
# @generated begin compdfkit-react-native-ios-pods
pod 'ComPDFKit', :podspec => 'https://file.compdf.com/cocoapods/ios/compdfkit_pdf_sdk/2.6.4/ComPDFKit.podspec'
pod 'ComPDFKit_Tools', :podspec => 'https://file.compdf.com/cocoapods/ios/compdfkit_pdf_sdk/2.6.4/ComPDFKit_Tools.podspec'
# @generated end compdfkit-react-native-ios-pods
```

如果能够看到这段内容，则说明插件已经正常工作，无需手动修改 Podfile。

## 配置 EAS 云构建

运行：

```shell
eas build:configure
```

如果 Expo 提示需要先登录，请先完成登录。

如果选择 `All`，Expo 会生成一个类似下面的 `eas.json`：

```json
{
  "cli": {
    "version": ">= 5.4.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

## 手动补充 Android 权限

在当前阶段，Expo plugin 仅负责处理 iOS Podfile。Android 侧的权限仍需在 prebuild 之后手动补充。

打开 `android/app/src/main/AndroidManifest.xml`，加入以下内容：

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE"/>

<application
    android:requestLegacyExternalStorage="true"
    ...>
</application>
```

## 为测试准备一个 PDF 文件

为了完成下面的示例，请在 prebuild 之后将一个名为 `PDF_Document.pdf` 的文件复制到以下位置：

1. `android/app/src/main/assets/PDF_Document.pdf`
2. iOS 工程的 app target 中，确保该文件会被打进应用包内

此示例使用原生 bundle 文件路径。如果后续再次执行 `expo prebuild --clean`，请检查是否需要重新复制该 PDF 文件。

## 替换应用代码

将 `index.tsx` 替换为以下示例：

```tsx
import { Platform, SafeAreaView } from 'react-native';
import { Component } from 'react';
import { ComPDFKit, CPDFReaderView } from '@compdfkit_pdf_sdk/react_native';

const androidLicense = 'android license';
const iosLicense = 'ios license';

type Props = {};

export default class HomeScreen extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.initialize();
  }

  async initialize() {
    const result = await ComPDFKit.init_(
      Platform.OS === 'android' ? androidLicense : iosLicense
    );
    console.log('ComPDFKitRN', 'init_:', result);
  }

  samplePDF =
    Platform.OS === 'android'
      ? 'file:///android_asset/PDF_Document.pdf'
      : 'PDF_Document.pdf';

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <CPDFReaderView
          document={this.samplePDF}
          configuration={ComPDFKit.getDefaultConfig({})}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    );
  }
}
```

在运行应用之前，请先将 `androidLicense` 和 `iosLicense` 替换为你自己的 ComPDFKit 许可证。

> 你可以在 [GitHub 示例工程](https://github.com/ComPDFKit/compdfkit-pdf-sdk-react-native/blob/5b16c6af7561941b85256beaa05268145faa04a7/example/App.tsx#L26) 中查看试用许可证示例，或直接[联系 ComPDFKit 销售团队](https://www.compdf.com/contact-sales)获取许可证。

## 运行应用

执行：

```shell
npx expo run:android
```

或者执行：

```shell
npx expo run:ios
```

## 使用 EAS 构建

执行：

```shell
eas build --platform ios
```

或者执行：

```shell
eas build --platform android
```

Expo 会按照 `app.json` 中定义的同一套插件配置，在云端构建原生应用。

## 常见问题排查

### Expo Go 中无法打开 SDK

这是正常现象。ComPDFKit 依赖原生模块，因此请使用 development build、`expo run` 或 EAS Build。

### 生成后的 Podfile 中没有 ComPDFKit

请先确认 `@compdfkit_pdf_sdk/react_native` 已经写入 `expo.plugins`，然后重新执行：

```shell
CI=1 npx expo prebuild --clean
```

### 执行 prebuild 后示例 PDF 丢失

如果执行了 `expo prebuild --clean`，Expo 会重新生成原生工程。请将示例 PDF 再次复制到生成后的原生目录中。

## 支持

- 查看 [React Native 开发文档](https://www.compdf.com/guides/pdf-sdk/react-native/overview)
- 查看 [React Native 更新日志](https://www.compdf.com/pdf-sdk/changelog-react-native)
- 遇到技术问题时联系[技术支持](https://www.compdf.com/support)
- 遇到授权问题时联系[销售团队](https://compdf.com/contact-us)
