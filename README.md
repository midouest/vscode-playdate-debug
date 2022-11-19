# Playdate Debug

![tests](https://github.com/midouest/vscode-playdate-debug/actions/workflows/main.yml/badge.svg)

Unofficial Playdate debug extension for Visual Studio Code

## Features

- Debug Lua code running in the Playdate Simulator
- Compile games to `.pdx` using `pdc`
- Problem matchers for `pdc`
- Open the Playdate Simulator

## Requirements

- The [Playdate SDK](https://play.date/dev/) must be installed separately

## Quick Setup

Use [cookiecutter](https://cookiecutter.readthedocs.io/en/stable/) and [cookiecutter-playdate](https://github.com/midouest/cookiecutter-playdate) to quickly create a project skeleton.

## Manual Setup

### Debugging

1. Click on the debug icon (play symbol with a bug) in the toolbar to open the "Run and Debug" view
2. Click the link that says `Create a launch.json file`
3. Select `Playdate Debug` in the dropdown to create the configuration in `.vscode/launch.json`
4. _(Optional)_ Run the default build task before debugging by setting the `preLaunchTask` property in the `Debug (Simulator)` configuration:

```json
"preLaunchTask": "${defaultBuildTask}"
```

Your `.vscode/launch.json` should now look like this:

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "playdate",
      "request": "launch",
      "name": "Debug (Simulator)",
      "preLaunchTask": "${defaultBuildTask}"
    }
  ]
}
```

### Tasks _(Optional)_

#### Build

1. Enter `Cmd/Ctrl + Shift + P` on the keybord to open the Command Palette
2. Type `Configure Task` and hit enter
3. Select `Playdate: Build` in the dropdown to add it to `.vscode/tasks.json`

#### Simulator

1. Enter `Cmd/Ctrl + Shift + P` on the keybord to open the Command Palette
2. Type `Configure Task` and hit enter
3. Select `Playdate: Simulator` in the dropdown to add it to `.vscode/tasks.json`

#### Build and Run

1. Open `.vscode/tasks.json`
2. Paste the following configuration into the `tasks` array after the `Playdate: Simulator` task:

```json
{
  "label": "Playdate: Build and Run (Simulator)",
  "dependsOn": ["Playdate: Build", "Playdate: Simulator"],
  "dependsOrder": "sequence"
}
```

3. Enter `Cmd/Ctrl + Shift + P` on the keybord to open the Command Palette
4. Type `Configure Default Build Task` and hit enter
5. Select `Playdate: Build and Run (Simulator)` in the dropdown

Your `.vscode/tasks.json` file should now look like this:

```json
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
      "label": "Playdate: Simulator"
    },
    {
      "label": "Playdate: Build and Run (Simulator)",
      "dependsOn": ["Playdate: Build", "Playdate: Simulator"],
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

## Configuration

The tasks and debugger will attempt to automatically resolve the correct configuration using the environment. The following configuration must exist for this to work:

- Either of the following:
  - `~/.Playdate/config` exists and the `SDKRoot` property is set to the Playdate SDK path
  - The `PLAYDATE_SDK_PATH` environment variable is set to the Playdate SDK path
- The Playdate SDK `bin` directory is in your `PATH`
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

## Known Issues

- Debugging is not supported on Windows or Linux.
- `make` and `cmake`-based projects are not supported.
- Breakpoints are in an unverified state.
- Stepping into C functions causes the debugger to continue executing.
