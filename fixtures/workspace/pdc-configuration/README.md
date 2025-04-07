# PDC Configuration

This project demonstrates the extra configuration options that the `pdc` task supports.

## Tasks

The [`tasks.json`](/fixtures/workspace/pdc-configuration/.vscode/tasks.json) file specifies the following additional properties for the `pdc` task:

- `"strip": true` causes debug symbols to be stripped from the compiled Lua files. This property defaults to `false`.
- `"noCompress": true` causes `pdc` to skip compressing the output files. This property defaults to `false`.
- `"verbose": true` adds additional logging to the `pdc` output. This property defaults to `false`.
- `"quiet": true` suppresses all non-error output. This property defaults to `false`.
- `"skipUnknown": true` prevents `pdc` from copying unrecognized files into the pdx folder. This property defaults to `false`.
- `"libPath": ["/path/to/my/libraries"]` adds the given paths to the list of folders to search when resolving imports.
- `"incrementBuildNumber": true` automatically increments the build number in `pdxinfo` each time the PDC task is executed.
