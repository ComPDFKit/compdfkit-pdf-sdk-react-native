const withComPDFKitIOS = require("./plugin/src/withComPDFKitIOS");

module.exports = function withComPDFKit(config, options) {
  return withComPDFKitIOS(config, options);
};
