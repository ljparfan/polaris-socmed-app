const enhancedResolve = require("enhanced-resolve");

const resolver = enhancedResolve.create.sync({
  extensions: [".js", ".jsx", ".ts", ".tsx"],
  mainFields: ["exports", "import", "require", "module", "main", "export"],
  conditionNames: ["import", "node", "require"],
});

module.exports = function (request, options) {
  return resolver(options.basedir, request).replace(/\0#/g, "#");
};
