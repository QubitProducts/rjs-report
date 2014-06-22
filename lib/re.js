/**
 * Ramda extended
 */
var R = require('ramda');

module.exports.unique = R.curry(function unique(fn, list) {
  return R.foldr(function(acc, x) {
    var alreadyExists = R.find(function (item) {
      return fn(item) === fn(x);
    }, acc);
    return alreadyExists ? acc : R.prepend(x, acc);
  }, [], list);
});

module.exports.mapObj = R.curry(function mapObj (fn, obj) {
  return R.foldl(function(acc, key) {
    acc[key] = fn(obj[key], key, obj);
    return acc;
  }, {}, R.keys(obj));
});