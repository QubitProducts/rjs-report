var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var analyser = require("rjs-build-analysis");
var Table = require("easy-table");
var numeral = require("numeral");
var gzipSize = require('gzip-size');
var clc = require("cli-color");

var base = path.resolve(__dirname, "..", "mdashboard", "public", "app", "www-built");

var duplicateSizeTreshold = 40 * 1024;

function fullpath(file) {
  return path.resolve(base, file);
}

function formatSize(size) {
  return numeral(size).format('0.0b');
}

function getStat(module) {
  var stat = fs.statSync(fullpath(module));
  return {
    size: stat.size,
    gzipped: gzipSize.sync(fs.readFileSync(fullpath(module)).toString())
  };
}

var buildOutput = fs.readFileSync(fullpath("build.txt")).toString();

var bundles = analyser.bundles(buildOutput);

var t = new Table();

var totalSize = 0;
var totalGzippedSize = 0;
_.each(bundles, function (bundle) {
  var stat = getStat(bundle);

  totalSize += stat.size;
  totalGzippedSize += stat.gzipped;

  t.cell('Bundle', bundle);
  t.cell('Size', formatSize(stat.size));
  t.cell('Gzipped', formatSize(stat.gzipped));
  t.newRow();
});

var t2 = new Table();

t2.cell('Total', 'ungzipped');
t2.cell('Size', formatSize(totalSize));
t2.newRow();
t2.cell('Total', 'gzipped');
t2.cell('Size', formatSize(totalGzippedSize));
t2.newRow();

var duplicates = analyser.duplicates(buildOutput);
_.each(duplicates, function (bundles, module) {
  var stat;
  try {
    stat = getStat(module);
  } catch (e) {
    stat = {};
  }

  if (stat.size > duplicateSizeTreshold) {
    var size = formatSize(stat.size);
    var gzipped = formatSize(stat.gzipped);

    console.log("Module", "(" + size + " / " + gzipped + ")", clc.red(module), "duplicated in");
    console.log("\t" + bundles.join("\n\t"));
    console.log("\n");
  }
});

console.log(t.toString());
console.log(t2.toString());


var buildInfo = analyser.parse(buildOutput);
var aq = _.find(buildInfo.bundles, function (bundle) {
  if (bundle.parent.indexOf("anyquery") > -1) {
    var sized = _.map(bundle.children, function (module) {
      var stat;
      try {
        stat = getStat(module);
      } catch (e) {
        stat = {};
      }
      return {
        name: module,
        size: stat.size || 0,
        gzipped: stat.gzipped || 0
      }
    });
    sized = _.sortBy(sized, "size");
    console.log(sized);
    _.each(sized, function (module) {
      console.log(formatSize(module.size), "/", formatSize(module.gzipped), module.name);
    });
  }
});