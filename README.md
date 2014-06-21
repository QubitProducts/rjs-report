# ranalyse

Analyse your r.js optimization output.

* see the size of each bundle
* see duplicate modules that appear in more than one bundle
* see sizes of each module within selected bundles
* see all sizes in ungzipped and gzipped
* list bundles (useful as an input for further tools)
* set min size filter when listing things

# TODO

- [ ] rename to ranalyse
- [ ] make it an actual executable bin
- [ ] take require.js build config as input and resolve all of the paths
- [ ] put each info under a flag, e.g. ranalyse bd (for bundles and duplicates)
- [ ] cli arg for size tresholds
- [ ] bundles command - for listing bundles, with or without sizes
- [ ] modules command - for listing all modules, or modules for some bundle

## Someday
- [ ] support plugins
- [ ] resolve paths that don't directly map to the file system