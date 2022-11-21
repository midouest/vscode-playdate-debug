# Playdate Debug

[![tests](https://github.com/midouest/vscode-playdate-debug/actions/workflows/tests.yaml/badge.svg)](https://github.com/midouest/vscode-playdate-debug/actions/workflows/tests.yaml)

Unofficial Playdate debug extension for Visual Studio Code on macOS, Windows and Ubuntu

## Features

- Debug Lua code running in the Playdate Simulator
- Compile games to `.pdx` using `pdc`
- Problem matchers for `pdc`
- Open the Playdate Simulator
- Run and debug current Lua file in the Playdate Simulator from the editor toolbar

## Requirements

- The [Playdate SDK](https://play.date/dev/) must be installed separately

## Quick setup

### Run and debug current Lua file

The extension can build, run and debug the current Lua file in the editor with zero configuration as long the [automatic configuration conditions](#automatic) are met.

When you open a Lua file in the editor after installing the extension, you will now see a
launch icon and dropdown menu in the editor toolbar. Clicking the launch icon or selecting an item from the dropdown menu will build and run the current Lua file in the Playdate Simulator. The "Debug file in Playdate Simulator" option will enable breakpoints to be hit.

![Tooltip](/images/tooltip.png)

![Dropdown Menu](/images/dropdown-menu.png)

### Tasks and debug launcher

A [cookiecutter project template](https://github.com/midouest/cookiecutter-playdate) is available for quickly generating new projects from the command line.

Alternatively, you can copy the following `.vscode/tasks.json` and `.vscode/launch.json` configuration:

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "pdc",
      "problemMatcher": ["$pdc-lua", "$pdc-external"],
      "label": "Playdate: Build"
    },
    {
      "type": "playdate-simulator",
      "problemMatcher": ["$pdc-external"],
      "label": "Playdate: Run"
    },
    {
      "label": "Playdate: Build and Run",
      "dependsOn": ["Playdate: Build", "Playdate: Run"],
      "dependsOrder": "sequence",
      "problemMatcher": [],
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ]
}
```

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "playdate",
      "request": "launch",
      "name": "Playdate: Debug",
      "preLaunchTask": "${defaultBuildTask}"
    }
  ]
}
```

See the [basic configuration example](/fixtures/workspace/basic-configuration) for more information.

## Configuration

### Automatic

The tasks and debugger will attempt to automatically resolve the correct configuration using the environment. One of the following conditions must be met for this to work:

- The `PLAYDATE_SDK_PATH` environment variable is set to the Playdate SDK path
- `~/.Playdate/config` exists and the `SDKRoot` property is set to the Playdate SDK path (macOS only)

### Workspace settings override

The default behavior can be overridden by setting the SDK path, game source path, compiled game path or game name in your workspace's `settings.json` file. The extension will fall back to the default behavior for any configuration fields that are not set.

```json
// .vscode/settings.json
{
  "playdate-debug.sdkPath": "/path/to/PlaydateSDK",
  "playdate-debug.sourcePath": "/path/to/MyGame/source",
  "playdate-debug.outputPath": "/path/to/MyGame",
  "playdate-debug.productName": "My Game"
}
```

See the [override configuration example](/fixtures/workspace/override-configuration) for more information about these properties.

### PDC task

See the [pdc configuration example](/fixtures/workspace/pdc-configuration/) for additional `pdc` task properties.

### Playdate Simulator task

See the [playdate simulator configuration example](/fixtures/workspace/playdate-simulator-configuration/) for additional `playdate-simulator` task properties.

### Debugger

See the [debugger configuration example](/fixtures/workspace/debugger-configuration/) for additional `playdate` debugger properties.
