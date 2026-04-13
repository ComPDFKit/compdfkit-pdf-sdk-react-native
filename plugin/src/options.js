const { getPackageVersion } = require("./version");

function resolveOptions(options = {}) {
  const packageVersion = getPackageVersion();
  const requestedVersion =
    typeof options.version === "string" ? options.version.trim() : "";
  const version = requestedVersion || packageVersion;

  if (requestedVersion && requestedVersion !== packageVersion) {
    console.warn(
      `[ComPDFKit] Expo plugin version "${requestedVersion}" does not match package version "${packageVersion}".`
    );
  }

  return {
    version,
    useGitPods: Boolean(options.useGitPods),
  };
}

module.exports = {
  resolveOptions,
};
