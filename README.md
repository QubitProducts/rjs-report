# rjs-report

[![Build Status](https://travis-ci.org/QubitProducts/rjs-report.svg?branch=master)](https://travis-ci.org/QubitProducts/rjs-report)

Analyse your r.js optimization output. Especially useful when optimizing your app into multiple output bundles. See the size of each bundle and large duplicated modules.

## Why?

Large web applications can be bundled into multiple chunks (or multiple bundles) using r.js optimizer. This can help speed up the initial load of the app since the browser needs to download smaller files as well as parse and evaluate less code. Splitting the app into separate dynamically loaded parts can also help in development since less modules need to be loaded in on any given page. However, sometimes when creating these bundles with r.js, you might need to tweak which bundle certain modules should go to. If a module is large, you could

* build it into the root bundle if it's needed frequently
* duplicate it into some of the page bundles to avoid weighing down the rest of the pages
* put it into it's own bundle and load it on demand

rjs-report helps you make those decisions by listing the sizes of bundles, modules and duplicates.
 
## Features

* see the size of each bundle produced by r.js optimizer
* see duplicate modules that appear in more than one bundle
* see sizes of all your modules
* see all sizes ungzipped and gzipped
* list bundle and module paths with no sizing information for use with other tools

## Examples

Summary report

```
$ rjs-report -d public/dist summary

Module (261.7KB / 56.2KB) lib/d3/d3.js duplicated in
  app/modules/books/routes/books_new_route.js
  app/modules/magazines/routes/magazines_route.js


Module (59.9KB / 12.5KB) lib/fileupload/jquery.fileupload.js duplicated in
  app/modules/books/routes/review_route.js
  app/modules/books/routes/editor_route.js


Module (53.1KB / 10.9KB) lib/jquery.sparkline.js duplicated in
  app/modules/magazines/routes/magazines_route.js
  app/modules/music/routes/music_route.js


Bundle                                                               Size     Gzipped
-------------------------------------------------------------------  -------  -------
app/modules/books/routes/editor_route.js                             1.7MB    367.2KB
app/modules/magazines/routes/magazines_route.js                      965.8KB  223.4KB
app/boot.js                                                          485.6KB  129.1KB
lib/highcharts.js                                                    453.0KB  129.9KB
app/modules/books/routes/books_new_route.js                          449.8KB  102.8KB
app/modules/books/routes/review_route.js                             337.7KB  80.6KB
app/modules/music/routes/music_route.js                              271.8KB  65.5KB
app/modules/books/routes/experiment_route.js                         173.5KB  41.3KB
app/modules/books/routes/books_route.js                              172.6KB  41.2KB
lib/highcharts-more.js                                               61.1KB   16.9KB
-------------------------------------------------------------------  -------  -------
                                                                     4.9MB    1.2MB
```

Module report

```
$ rjs-report -d public/dist modules --min-size 200000 --no-grouping

453.0KB / 129.9KB lib/highcharts.js
261.7KB / 56.2KB lib/d3/d3.js
247.0KB / 72.2KB lib/jquery.js
16.7KB / 4.9KB components/leap/view.js
```

Plain bundle list

```
$ rjs-report -d public/dist bundles --plain

app/modules/books/routes/editor_route.js
app/modules/magazines/routes/magazines_route.js
app/modules/books/routes/books_new_route.js
app/modules/books/routes/review_route.js
app/modules/music/routes/music_route.js
app/modules/books/routes/experiment_route.js
app/modules/books/routes/books_route.js
lib/highcharts-more.js
lib/highcharts.js
app/boot.js
```

## Usage

Install
```
npm install -g rjs-report
```

And then use like so

```
rjs-report --dir path/to/your/r.js/build/output [command] [options]

#e.g.
rjs-report -d public/dist summary --min-size 20000
```

## Commands

```
  Usage: rjs-report [options] [command]

  Commands:

    summary [options]      report size of each bundle and large duplicates
    duplicates [options]   list modules found in multiple bundles
    modules [options]      list and filter modules
    bundles [options]      list bundles

  Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -d, --dir [path]  The r.js optimization output dir (should contain the build.txt file)
```

### summary

```
  Usage: summary [options]

  Options:

    -h, --help              output usage information
    -s, --min-size [bytes]  minimum size of duplicates to be reported
```

### duplicates

```
  Usage: duplicates [options]

  Options:

    -h, --help              output usage information
    -s, --min-size [bytes]  minimum size of duplicates to be reported
```

### modules

```
  Usage: modules [options]

  Options:

    -h, --help              output usage information
    -p, --plain             a list of paths with no size information
    -b, --bundle [name]     filter by bundle
    -g, --grep [name]       filter by name
    -s, --min-size [bytes]  filter by min size
    -G, --no-grouping       don't group by bundle
```

### bundles

```
  Usage: bundles [options]

  Options:

    -h, --help   output usage information
    -p, --plain  a list of paths with no size information
```

## Programmatic API

All of the same commands and (most of the) options are available for use within node. The commands return JSON.

```js
var path = require('path');
var rr = require('rjs-report');

var buildDir = path.resolve(__dirname, "./public/app-built");

rr.bundles(buildDir);
rr.bundles(buildDir, {plain: true});
rr.modules(buildDir, {minSize: 100000})
```

## TODO
- [ ] support modules with plugins in the module id
- [ ] resolve paths that don't directly map to the file system (mapped/aliased modules)