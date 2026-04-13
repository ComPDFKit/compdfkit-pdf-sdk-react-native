const packageJson = require("../../package.json");

function getPackageVersion() {
  return packageJson.version;
}

module.exports = {
  getPackageVersion,
};
