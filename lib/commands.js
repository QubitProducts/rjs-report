var printer = require('./printer');
var rr = require('./rjs-report');

module.exports.summary = function (root, cmd) {
  printer.duplicates(rr.duplicates(root, cmd), cmd);
  printer.bundles(rr.bundles(root, cmd), cmd);
};

module.exports.duplicates = function (root, cmd) {
  printer.duplicates(rr.duplicates(root, cmd), cmd);
};

module.exports.modules = function (root, cmd) {
  printer.modules(rr.modules(root, cmd), cmd);
};

module.exports.bundles = function (root, cmd) {
  printer.bundles(rr.bundles(root, cmd), cmd);
};