const { createRunOncePlugin, withPodfile } = require("@expo/config-plugins");
const { mergeContents } = require("@expo/config-plugins/build/utils/generateCode");

const { resolveOptions } = require("./options");
const { getPackageVersion } = require("./version");

const PACKAGE_NAME = "@compdfkit_pdf_sdk/react_native";
const PLUGIN_TAG = "compdfkit-react-native-ios-pods";
const IOS_GIT_SOURCE =
  "https://github.com/ComPDFKit/compdfkit-pdf-sdk-ios-swift.git";
const IOS_PODSPEC_BASE_URL =
  "https://file.compdf.com/cocoapods/ios/compdfkit_pdf_sdk";

function getPodLines(options) {
  if (options.useGitPods) {
    return [
      `  pod 'ComPDFKit', :git => '${IOS_GIT_SOURCE}', :tag => '${options.version}'`,
      `  pod 'ComPDFKit_Tools', :git => '${IOS_GIT_SOURCE}', :tag => '${options.version}'`,
    ].join("\n");
  }

  return [
    `  pod 'ComPDFKit', :podspec => '${IOS_PODSPEC_BASE_URL}/${options.version}/ComPDFKit.podspec'`,
    `  pod 'ComPDFKit_Tools', :podspec => '${IOS_PODSPEC_BASE_URL}/${options.version}/ComPDFKit_Tools.podspec'`,
  ].join("\n");
}

function assertExpectedPodfileShape(contents) {
  const expoModulesIndex = contents.indexOf("use_expo_modules!");
  if (expoModulesIndex === -1) {
    throw new Error(
      `[${PACKAGE_NAME}] Failed to update ios/Podfile: could not find the "use_expo_modules!" anchor.`
    );
  }

  const nativeModulesIndex = contents.indexOf("use_native_modules!");
  if (nativeModulesIndex !== -1 && nativeModulesIndex < expoModulesIndex) {
    throw new Error(
      `[${PACKAGE_NAME}] Failed to update ios/Podfile: expected "use_expo_modules!" to appear before "use_native_modules!".`
    );
  }
}

const withComPDFKitIOS = (config, userOptions) => {
  const options = resolveOptions(userOptions);

  return withPodfile(config, (podfileConfig) => {
    assertExpectedPodfileShape(podfileConfig.modResults.contents);

    const result = mergeContents({
      tag: PLUGIN_TAG,
      src: podfileConfig.modResults.contents,
      newSrc: getPodLines(options),
      anchor: /use_expo_modules!/,
      offset: 1,
      comment: "#",
    });

    podfileConfig.modResults.contents = result.contents;

    return podfileConfig;
  });
};

module.exports = createRunOncePlugin(
  withComPDFKitIOS,
  PACKAGE_NAME,
  getPackageVersion()
);
