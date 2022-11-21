# Override Configuration Example

This project demonstrates how to override the default `playdate-debug` extension configuration using workspace settings.

## Settings

All settings are derived from the [settings.json](/fixtures/workspace/override-configuration/.vscode/settings.json) file.

- `"playdate-debug.sdkPath"` configures the path to the Playdate SDK.
- `"playdate-debug.sourcePath"` configures the path to the game's `source/` folder.
- `"playdate-debug.outputPath"` configures the path to the directory that the compiled .pdx bundle will be placed in.
- `"playdate-debug.productName"` configures the name of the compiled .pdx bundle.`

Extension configuration values may be absolute or relative paths. Environment variables and VSCode variables are not supported.

## Tasks

The task configuration is identical to the [basic configuration](/fixtures/workspace/basic-configuration/README.md#tasks).

## Debug

The debug configuration is identical to the [basic configuration](/fixtures/workspace/basic-configuration/README.md#debug).
