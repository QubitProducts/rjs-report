var numeral = require('numeral');
var Table = require('easy-table');
var R = require('ramda');
var clc = require('cli-color');

module.exports.bundles = bundles;
module.exports.modules = modules;
module.exports.duplicates = duplicates;


function bundles(bundles, options) {
  if (options.plain) {
    return console.log(bundles.join('\n'));
  }

  var t = new Table();

  R.each(function (bundle) {
    t.cell('Bundle', bundle.name);
    t.cell('Size', bundle.size, formatSize);
    t.cell('Gzipped', bundle.gzipped, formatSize);
    t.newRow();
  }, bundles);

  t.sort(['Size|des']);

  t.total('Size', Table.aggr.sum, formatSize);
  t.total('Gzipped', Table.aggr.sum, formatSize);

  console.log(t.toString());
}


function modules(bundles, options) {
  if (options.plain) {
    return console.log(bundles.join('\n'));
  }

  if (!options.grouping) {
    return R.pipe(
      R.pluck('children'),
      R.flatten,
      unique(R.get('name')),
      R.sortBy(R.get('size')),
      R.reverse,
      R.each(printModuleRow)
    )(bundles);
  }

  R.each(function (bundle) {
    console.log(bundle.parent)
    console.log(R.repeatN('-', bundle.parent.length).join(''));
    R.each(printModuleRow, bundle.children);
    console.log('\n');
  }, bundles);

  function printModuleRow(module) {
    console.log(formatSize(module.size), "/", formatSize(module.gzipped), module.name);
  }
}


function duplicates(duplicates, options) {
  R.each(function (module) {
    var size = formatSize(module.size);
    var gzipped = formatSize(module.gzipped);
    console.log("Module", "(" + size + " / " + gzipped + ")", clc.red(module.name), "duplicated in");
    console.log("\t" + module.bundles.join("\n\t"));
    console.log("\n");
  }, duplicates);
}

/**
 * Helper functions
 */

function formatSize(size) {
  if (size > 1024) {
    return numeral(size).format('0.0b');
  } else {
    return numeral(size).format('0b');
  }
}

var unique = R.curry(function unique(fn, list) {
  return R.foldr(function(acc, x) {
    var alreadyExists = R.find(function (item) {
      return fn(item) === fn(x);
    }, acc);
    return alreadyExists ? acc : R.prepend(x, acc);
  }, [], list);
});