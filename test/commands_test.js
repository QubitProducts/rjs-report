var fs = require('fs');
var path = require('path');
var buster = require('buster');
var assert = buster.referee.assert;
var commands = require('../lib/commands');
var StdOutFixture = require('fixture-stdout');
var fixture = new StdOutFixture();

var buildDir = path.resolve(__dirname, 'fixture');

var output;

buster.testCase('Commands', {
  'setUp': function () {
    output = '';
    fixture.capture(function onWrite (string) {
      output += string;
      return false;
    });
  },

  'tearDown': function () {
    fixture.release();
  },

  'bundles --plain': function () {
    commands.bundles(buildDir, {plain: true});
    assert.equals(output, expectedOutput('bundles_plain'));
  },

  'bundles': function () {
    commands.bundles(buildDir, {});
    assert.equals(output, expectedOutput('bundles'));
  },

  'modules': function () {
    commands.modules(buildDir, {minSize: 0, grouping: true});
    assert.equals(output, expectedOutput('modules'));
  },

  'modules --no-grouping': function () {
    commands.modules(buildDir, {minSize: 0, grouping: false});
    assert.equals(output, expectedOutput('modules_no_grouping'));
  },

  'duplicates': function () {
    commands.duplicates(buildDir, {minSize: 0});
    assert.equals(output, expectedOutput('duplicates'));
  },

  'summary': function () {
    commands.summary(buildDir, {minSize: 0});
    assert.equals(output, expectedOutput('summary'));
  }
});

function expectedOutput(name) {
  return fs.readFileSync(path.resolve(__dirname, 'outputs', name + '.txt')).toString();
}