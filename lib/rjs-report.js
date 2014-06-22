var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var R = require('ramda');
var analyser = require('rjs-build-analysis');
var gzipSize = require('gzip-size');

var buildOutputFilename = 'build.txt';

module.exports.bundles = bundles;
module.exports.modules = modules;
module.exports.duplicates = duplicates;
module.exports.validRoot = validRoot;


function bundles(root, options) {
  options = options || {};
  var bundles = analyser.bundles(buildOutput(root));
  
  if (options.plain) {
    return bundles;
  }

  return R.map(R.curry(withSize)(root), bundles);
}


function modules(root, options) {
  options = options || {};
  var bundles = analyser.parse(buildOutput(root)).bundles;

  if (options.bundle) {
    bundles = R.filter(
      R.pipe(R.get('parent'), R.contains(options.bundle)),
      bundles
    );
  }

  R.each(function (bundle) {
    bundle.children = R.pipe(
      R.map(R.curry(withSize)(root)),
      R.filter(function (module) {
        if (options.grep && !R.contains(options.grep, module.name)) return false;
        if (options.minSize && module.size < options.minSize) return false;
        return true;
      }),
      R.sortBy(R.get('size')),
      R.reverse
    )(bundle.children);
  }, bundles);

  bundles = R.filter(R.pipe(R.get('children'), R.not(R.isEmpty)))(bundles);

  if (options.plain) {
    return R.uniq(R.pluck('name', R.flatten(R.pluck('children', bundles))));
  } else {
    return bundles;
  }
}


function duplicates(root, options) {
  options = options || {};
  var duplicates = analyser.duplicates(buildOutput(root));

  duplicates = _.map(duplicates, function (bundles, module) {
    var stat = getStat(root, module);
    return {
      name: module,
      bundles: bundles,
      size: stat.size,
      gzipped: stat.gzipped
    };
  });

  duplicates = R.pipe(
    R.filter(function (module) {
      return module.size > options.minSize;
    }),
    R.sortBy(R.get('size')),
    R.reverse
  )(duplicates);

  return duplicates;
}


function validRoot(root) {
  return fs.existsSync(path.resolve(root, buildOutputFilename));
}


/**
 * Helper functions
 */


function withSize(root, bundle) {
  var stat = getStat(root, bundle);
  return {
    name: bundle,
    size: stat.size,
    gzipped: stat.gzipped
  };
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
    };
  }
}


function buildOutput(root) {
  return fs.readFileSync(path.resolve(root, buildOutputFilename)).toString();
}