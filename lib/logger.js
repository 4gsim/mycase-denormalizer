const Debug = require("debug");

module.exports = function Logger(scope) {
  return {
    debug: Debug("denormalizer:" + scope),
    error: Debug("denormalizer:error:" + scope),
    warn: Debug("denormalizer:warn:" + scope),
  };
};
