# rjs-report

Analyse your r.js optimization output. Especially useful when optimizing your app into multiple output bundles. See the size of each bundle and large duplicated modules.

## Features

* see the size of each bundle
* see duplicate modules that appear in more than one bundle
* see sizes of each module grouped by bundle
* see all sizes ungzipped and gzipped
* list bundle and module paths with no sizing information for use with other tools

## Examples

```
# the default summary view
rjs-report -d public/dist summary

Module (261.7KB / 56.2KB) js/lib/d3/d3.js duplicated in
  js/app/modules/books/routes/books_new_route.js
  js/app/modules/magazines/routes/magazines_route.js


Module (59.9KB / 12.5KB) js/lib/fileupload/jquery.fileupload.js duplicated in
  js/app/modules/books/routes/review_route.js
  js/app/modules/books/routes/editors_route.js


Module (53.1KB / 10.9KB) js/lib/jquery.sparkline.js duplicated in
  js/app/modules/magazines/routes/magazines_route.js
  js/app/modules/music/routes/music_route.js


Bundle                                                               Size     Gzipped
-------------------------------------------------------------------  -------  -------
js/app/modules/books/routes/editors_route.js                         1.7MB    367.2KB
js/app/modules/magazines/routes/magazines_route.js                   965.8KB  223.4KB
js/app/boot.js                                                       485.6KB  129.1KB
js/lib/highcharts.js                                                 453.0KB  129.9KB
js/app/modules/books/routes/books_new_route.js                       449.8KB  102.8KB
js/app/modules/books/routes/review_route.js                          337.7KB  80.6KB
js/app/modules/music/routes/music_route.js                           271.8KB  65.5KB
js/app/modules/books/routes/experiment_route.js                      173.5KB  41.3KB
js/app/modules/books/routes/books_route.js                           172.6KB  41.2KB
js/lib/highcharts-more.js                                            61.1KB   16.9KB
-------------------------------------------------------------------  -------  -------
                                                                     4.9MB    1.2MB
```

Module (261.7KB / 56.2KB) js/lib/d3/d3.js duplicated in
  js/app/modules/books/routes/books_new_route.js
  js/app/modules/magazines/routes/magazines_route.js


Module (59.9KB / 12.5KB) js/lib/fileupload/jquery.fileupload.js duplicated in
  js/app/modules/books/routes/review_route.js
  js/app/modules/books/routes/editors_route.js


Module (53.1KB / 10.9KB) js/lib/jquery.sparkline.js duplicated in
  js/app/modules/magazines/routes/magazines_route.js
  js/app/modules/music/routes/music_route.js


Bundle                                                               Size     Gzipped
-------------------------------------------------------------------  -------  -------
js/app/modules/books/routes/editors_route.js                         1.7MB    367.2KB
js/app/modules/magazines/routes/magazines_route.js                   965.8KB  223.4KB
js/app/boot.js                                                       485.6KB  129.1KB
js/lib/highcharts.js                                                 453.0KB  129.9KB
js/app/modules/books/routes/books_new_route.js                       449.8KB  102.8KB
js/app/modules/books/routes/review_route.js                          337.7KB  80.6KB
js/app/modules/music/routes/music_route.js                           271.8KB  65.5KB
js/app/modules/books/routes/experiment_route.js                      173.5KB  41.3KB
js/app/modules/books/routes/books_route.js                           172.6KB  41.2KB
js/lib/highcharts-more.js                                            61.1KB   16.9KB
-------------------------------------------------------------------  -------  -------
                                                                     4.9MB    1.2MB
```

```
rjs-report -d public/dist modules --min-size 200000 --no-grouping

453.0KB / 129.9KB js/lib/highcharts.js
261.7KB / 56.2KB js/lib/d3/d3.js
247.0KB / 72.2KB js/lib/jquery.js
16.7KB / 4.9KB js/components/leap/view.js
```

## Commands

```
  Usage: rjs-report [options] [command]

  Commands:

    bundles [options]      list bundles
    modules [options]      list modules
    duplicates [options]   list modules found in multiple bundles
    summary [options]      report size of each bundle and large duplicates

  Options:

    -h, --help        output usage information
    -V, --version     output the version number
    -d, --dir [path]  The r.js optimization output dir (should contain the build.txt file)
```

### bundles

```
  Usage: bundles [options]

  Options:

    -h, --help   output usage information
    -p, --plain  a list of paths with no size information
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

### duplicates

```
  Usage: duplicates [options]

  Options:

    -h, --help              output usage information
    -s, --min-size [bytes]  minimum size of duplicates to be reported
```

### summary

```
  Usage: summary [options]

  Options:

    -h, --help              output usage information
    -s, --min-size [bytes]  minimum size of duplicates to be reported
```

## TODO
- [ ] support modules with plugins in the module id
- [ ] resolve paths that don't directly map to the file system (mapped/aliased modules)