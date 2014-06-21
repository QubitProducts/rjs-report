var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var analyser = require("rjs-build-analysis");
var Table = require("easy-table");
var numeral = require("numeral");
var gzipSize = require('gzip-size');
var clc = require("cli-color");
var R = require('ramda');

var duplicateSizeTreshold = 40 * 1024;
var buildOutputFilename = "build.txt";

module.exports.bundles = bundles;

function bundles(root, bundles) {
  bundles = bundles || analyser.bundles(buildOutput(root));
  var t = new Table();
  var totalSize = 0;
  var totalGzippedSize = 0;
  R.pipe(
    R.map(function (bundle) {
      return {
        name: bundle,
        stat: getStat(root, bundle)
      };
    }),
    R.sortBy(R.pipe(R.get('stat'), R.get('size'))),
    R.reverse,
    R.each(function (bundle) {
      var stat = bundle.stat;
      totalSize += stat.size;
      totalGzippedSize += stat.gzipped;

      t.cell('Bundle', bundle.name);
      t.cell('Size', formatSize(stat.size));
      t.cell('Gzipped', formatSize(stat.gzipped));
      t.newRow();
    })
  )(bundles);
  return t;
}

module.exports.duplicates = duplicates;
function duplicates(root, options) {
  var duplicates = analyser.duplicates(buildOutput(root));

  duplicates = _.map(duplicates, function (bundles, module) {
    return {
      name: module,
      bundles: bundles,
      stat: getStat(root, module)
    };
  });

  duplicates = R.pipe(
    R.sortBy(R.pipe(R.get('stat'), R.get('size'))),
    R.reverse
  )(duplicates);

  R.each(function (module) {
    if (module.stat.size > options.size) {
      var size = formatSize(module.stat.size);
      var gzipped = formatSize(module.stat.gzipped);
      console.log("Module", "(" + size + " / " + gzipped + ")", clc.red(module.name), "duplicated in");
      console.log("\t" + module.bundles.join("\n\t"));
      console.log("\n");
    }
  }, duplicates);
}

module.exports.summary = function (root) {
  var bundles = analyser.bundles(buildOutput(root));
  var t1 = bundles(root, bundles);
  console.log(t1.toString());
  duplicatesTable(root);
  return;

  var t2 = new Table();

  t2.cell('Total', 'ungzipped');
  t2.cell('Size', formatSize(totalSize));
  t2.newRow();
  t2.cell('Total', 'gzipped');
  t2.cell('Size', formatSize(totalGzippedSize));
  t2.newRow();

  console.log(t1.toString());
  console.log(t2.toString());
};

module.exports.modules = modules;
function modules (root, options) {
  var bundles = analyser.parse(buildOutput(root)).bundles;

  if (options.bundle) {
    bundles = R.filter(
      R.pipe(
        R.get('parent'),
        R.contains(options.bundle)
      )
    )(bundles);
  }

  R.each(function (bundle) {
    bundle.children = R.pipe(
      R.map(function (module) {
        var stat = getStat(root, module);
        return {
          name: module,
          size: stat.size,
          gzipped: stat.gzipped
        };
      }),
      R.filter(function (module) {
        if (options.grep && !R.contains(options.grep, module.name)) return false;
        if (options.size && module.size < options.size) return false;
        return true;
      }),
      R.sortBy(R.get('size')),
      R.reverse
    )(bundle.children);
  }, bundles);

  bundles = R.filter(R.pipe(R.get('children'), R.not(R.isEmpty)))(bundles);

  if (options.plain) {
    return R.pluck('name', R.flatten(R.pluck('children', bundles)));
  } else {
    R.each(function (bundle) {
      console.log(bundle.parent)
      console.log(R.repeatN('-', bundle.parent.length).join(''));
      R.each(function (module) {
        console.log(formatSize(module.size), "/", formatSize(module.gzipped), module.name);
      }, bundle.children);
      console.log('\n');
    }, bundles);
  }

  // _.find(buildInfo.bundles, function (bundle) {
  //   var sized = _.map(bundle.children, function (module) {
  //     var stat;
  //     try {
  //       stat = getStat(root, module);
  //     } catch (e) {
  //       stat = {};
  //     }
  //     return {
  //       name: module,
  //       size: stat.size || 0,
  //       gzipped: stat.gzipped || 0
  //     }
  //   });
  //   sized = _.sortBy(sized, "size");
  //   _.each(sized, function (module) {
  //     if (module.size > duplicateSizeTreshold) {
  //       console.log(formatSize(module.size), "/", formatSize(module.gzipped), module.name);
  //     }
  //   });
  // });
}

module.exports.bundlesPlain = function (root) {
  return analyser.bundles(buildOutput(root));
};

module.exports.modulesPlain = function (root, options) {
  options.plain = true;
  return modules(root, options);
};

module.exports.validRoot = function (root) {
  return fs.existsSync(path.resolve(root, buildOutputFilename));
};

function formatSize(size) {
  if (size > 1024) {
    return numeral(size).format('0.0b');
  } else {
    return numeral(size).format('0b');
  }
}

function getStat(root, module) {
  var modulePath = path.resolve(root, module);
  try {
    var stat = fs.statSync(modulePath);
    return {
      size: stat.size,
      gzipped: gzipSize.sync(fs.readFileSync(modulePath).toString())
    };
  } catch (e) {
    return {
      size: 0,
      gzipped: 0
    }
  }
}

function buildOutput(root) {
  return fs.readFileSync(path.resolve(root, buildOutputFilename)).toString();
}