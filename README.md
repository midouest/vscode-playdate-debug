# Playdate Debug

[![tests](https://github.com/midouest/vscode-playdate-debug/actions/workflows/tests.yaml/badge.svg)](https://github.com/midouest/vscode-playdate-debug/actions/workflows/tests.yaml)

Unofficial Playdate debug extension for Visual Studio Code on macOS, Windows and Ubuntu

## Features

- Debug Lua code running in the Playdate Simulator
- Compile games to `.pdx` using `pdc`
- Problem matchers for `pdc`
- Open the Playdate Simulator

## Requirements

- The [Playdate SDK](https://play.date/dev/) must be installed separately

## Quick Setup

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

The tasks and debugger will attempt to automatically resolve the correct configuration using the environment. The following configuration must exist for this to work:

- Either of the following:
  - The `PLAYDATE_SDK_PATH` environment variable is set to the Playdate SDK path
- The Playdate SDK `bin` directory is in your `PATH`
  - `~/.Playdate/config` exists and the `SDKRoot` property is set to the Playdate SDK path (macOS only)
- A [pdxinfo](https://sdk.play.date/1.9.3/Inside%20Playdate.html#pdxinfo) file exists in your game's `source` directory and the `name` property is set

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

See the [override configuration example](/fixtures/workspace/override-configuration) for more information.

The Playdate Simulator task launches the Playdate Simulator once and leaves it running in the background by default. The `kill` property can be used to instead have the task stop running instances of the Playdate Simulator before launching a new one.

```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "playdate-simulator",
      "problemMatcher": ["$pdc-external"],
      "label": "Playdate: Simulator",
      "kill": true
    }
  ]
}
```

The `playdate` debugger supports additional, advanced configuration properties on the configuration in `launch.json`: `disableWorkarounds`, `logDebugAdapter`, `retryTimeout`, and `maxRetries`. These are mainly for developers diagnosing issues with the extension or the Playdate Simulator. Typing the property name in your `launch.json` configuration will reveal the documentation for these properties.
